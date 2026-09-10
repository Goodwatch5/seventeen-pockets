// Standalone Bun runtime for Seventeen Pockets v1.0.0.
// Serves the action dispatcher, REST endpoints, static client bundle, the
// Nexus workflow scheduler, and the optional GitLab pipeline sync.

import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { mkdirSync } from "node:fs";
import { dirname, extname, join, normalize, relative, resolve } from "node:path";
import { type BlobClient, type Ctx, z } from "@hatch/space-sdk";
import { Actions } from "./actions";
import * as schema from "./schema";
import { applyMigrations } from "./migrate";
import { startGitlabSync } from "./gitlab-sync";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const PORT = Number(process.env.PORT ?? 3000) || 3000;
const DATABASE_PATH = process.env.DATABASE_PATH ?? "./data/app.db";
const GITLAB_TOKEN = process.env.GITLAB_TOKEN ?? "";
const GITLAB_PROJECT_IDS = (process.env.GITLAB_PROJECT_IDS ??
  "76506056,76967613,76887018,76117871,76277290,43907259")
  .split(",")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);
const SOLAR_SYNC_INTERVAL_MIN = Number(process.env.SOLAR_SYNC_INTERVAL_MIN ?? 15) || 15;

const DRIZZLE_DIR = join(import.meta.dir, "..", "..", "drizzle");
const CLIENT_DIST = join(import.meta.dir, "..", "..", "client", "dist");

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------

const resolvedDbPath = resolve(DATABASE_PATH);
mkdirSync(dirname(resolvedDbPath), { recursive: true });
const sqlite = new Database(resolvedDbPath);
const drizzleDb = drizzle(sqlite, { schema });
applyMigrations(sqlite, DRIZZLE_DIR);

// ---------------------------------------------------------------------------
// PortableCtx
// ---------------------------------------------------------------------------

function unsupportedBlob(): never {
  throw new Error("blobs not supported in standalone runtime");
}

const blobs: BlobClient = {
  put: async () => unsupportedBlob(),
  getUrl: async () => unsupportedBlob(),
  delete: async () => unsupportedBlob(),
  head: async () => unsupportedBlob(),
  list: async () => unsupportedBlob(),
};

function makeCtx(): Ctx {
  // The full Ctx surface (agent/inference/tool/emit) is a Hatch-runtime
  // concern; no action in this codebase touches anything beyond db and
  // invalidateQueries, so the remainder is safely stubbed via cast.
  const ctx = {
    slug: "seventeen-pockets",
    invocationId: crypto.randomUUID(),
    spaceDir: process.cwd(),
    db: (() => drizzleDb) as unknown as Ctx["db"],
    invalidateQueries: () => {},
    executePrivileged: async () => {
      throw new Error("privileged contracts not supported in standalone runtime");
    },
    blobs,
  } as unknown as Ctx;
  return ctx;
}

// ---------------------------------------------------------------------------
// Action dispatcher
// ---------------------------------------------------------------------------

class HttpError extends Error {
  readonly statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

type AnyActionDef = {
  request: z.ZodType;
  handler: (ctx: Ctx, args: unknown) => Promise<unknown>;
};

const actionRegistry = Actions as unknown as Record<string, AnyActionDef | undefined>;

async function callAction(name: string, args: unknown): Promise<unknown> {
  const def = actionRegistry[name];
  if (!def) throw new HttpError(404, `Unknown action: ${name}`);
  const parsed = def.request.safeParse(args ?? {});
  if (!parsed.success) throw new HttpError(422, parsed.error.message);
  return def.handler(makeCtx() as Ctx, parsed.data);
}

function jsonError(status: number, message: string): Response {
  return Response.json({ error: message }, { status });
}

// ---------------------------------------------------------------------------
// Static files
// ---------------------------------------------------------------------------

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function contentType(extension: string): string {
  return CONTENT_TYPES[extension.toLowerCase()] ?? "application/octet-stream";
}

async function serveStaticFile(urlPath: string): Promise<Response | null> {
  let decoded: string;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  const abs = normalize(join(CLIENT_DIST, decoded));
  const rel = relative(CLIENT_DIST, abs);
  if (rel === "" || rel.startsWith("..")) return null;
  const file = Bun.file(abs);
  if (!(await file.exists())) return null;
  return new Response(file, { headers: { "content-type": contentType(extname(abs)) } });
}

async function serveIndex(): Promise<Response> {
  const file = Bun.file(join(CLIENT_DIST, "index.html"));
  if (await file.exists()) {
    return new Response(file, { headers: { "content-type": "text/html; charset=utf-8" } });
  }
  return jsonError(404, "Client bundle not found. Run `bun run build:client` first.");
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

async function handlePostActions(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "Invalid JSON body");
  }
  const payload = (body ?? {}) as { action?: unknown; args?: unknown };
  if (typeof payload.action !== "string" || payload.action.length === 0) {
    return jsonError(400, "Missing action name");
  }
  try {
    const result = await callAction(payload.action, payload.args);
    return Response.json({ data: result });
  } catch (err) {
    if (err instanceof HttpError) return jsonError(err.statusCode, err.message);
    return jsonError(500, err instanceof Error ? err.message : String(err));
  }
}

async function handlePostEvents(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "Invalid JSON body");
  }
  const payload = (body ?? {}) as { type?: unknown; source?: unknown; payload?: unknown };
  try {
    const result = (await callAction("submitEvent", {
      type: payload.type,
      source: payload.source,
      payload_json: JSON.stringify(payload.payload ?? {}),
    })) as { ok: boolean; event?: unknown; errors?: Record<string, string> };
    if (result.ok) {
      return Response.json(result.event, { status: 201 });
    }
    return Response.json({ errors: result.errors }, { status: 422 });
  } catch (err) {
    if (err instanceof HttpError) return jsonError(err.statusCode, err.message);
    return jsonError(500, err instanceof Error ? err.message : String(err));
  }
}

async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname;

  if (req.method === "POST" && pathname === "/actions") return handlePostActions(req);

  if (req.method === "GET" && pathname === "/actions") {
    try {
      return Response.json({ data: await callAction("getApiExplorerCatalog", {}) });
    } catch (err) {
      if (err instanceof HttpError) return jsonError(err.statusCode, err.message);
      return jsonError(500, err instanceof Error ? err.message : String(err));
    }
  }

  if (req.method === "GET" && pathname === "/health") {
    return Response.json(await callAction("health", {}));
  }

  if (req.method === "GET" && pathname === "/api/v1/system") {
    return Response.json(await callAction("getsystem", {}));
  }

  if (req.method === "POST" && pathname === "/api/v1/events") return handlePostEvents(req);

  if (req.method === "GET") {
    if (!pathname.startsWith("/actions") && !pathname.startsWith("/api/")) {
      const file = await serveStaticFile(pathname);
      if (file) return file;
      return serveIndex();
    }
  }

  return jsonError(404, "Not found");
}

// ---------------------------------------------------------------------------
// Nexus scheduler
// ---------------------------------------------------------------------------

async function runWorkflowEvaluation(): Promise<void> {
  try {
    const result = (await callAction("evaluateWorkflows", {})) as {
      evaluated: number;
      fired: number;
      evaluated_at: string;
    };
    console.log(`[nexus] evaluated=${result.evaluated} fired=${result.fired} at ${result.evaluated_at}`);
  } catch (err) {
    console.log(`[nexus] evaluation error: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

if (GITLAB_TOKEN) {
  startGitlabSync({
    ctxFactory: makeCtx,
    sqlite,
    projectIds: GITLAB_PROJECT_IDS,
    intervalMin: SOLAR_SYNC_INTERVAL_MIN,
  });
  console.log(`[gitlab-sync] enabled for ${GITLAB_PROJECT_IDS.length} project(s), every ${SOLAR_SYNC_INTERVAL_MIN}m`);
} else {
  console.log("[gitlab-sync] skipped (no token) — set GITLAB_TOKEN to enable Solar Connect live sync");
}

setInterval(() => {
  void runWorkflowEvaluation();
}, 5 * 60_000);
setTimeout(() => {
  void runWorkflowEvaluation();
}, 5_000);

Bun.serve({
  port: PORT,
  fetch: handleRequest,
});

console.log(`Server started on http://localhost:${PORT} (db: ${resolvedDbPath})`);
