// Polls GitLab pipeline APIs and ingests new pipelines as Solar Connect
// pipeline events. Pure env config; never throws out of syncOnce.

import { Database } from "bun:sqlite";
import { type Ctx } from "@hatch/space-sdk";
import { Actions } from "./actions";

const GITLAB_API = "https://gitlab.com/api/v4";

interface GitlabPipeline {
  id: number;
  sha: string;
  status: string;
  duration: number | null;
  updated_at: string;
  created_at: string;
}

type PipelineStatus = "success" | "failed" | "canceled" | "running";

function mapStatus(status: string): PipelineStatus {
  switch (status) {
    case "success":
      return "success";
    case "failed":
      return "failed";
    case "canceled":
    case "skipped":
      return "canceled";
    default:
      return "running";
  }
}

export function startGitlabSync(opts: {
  ctxFactory: () => Ctx;
  sqlite: Database;
  projectIds: string[];
  intervalMin: number;
}): () => void {
  const token = process.env.GITLAB_TOKEN ?? "";
  if (!token) {
    console.log("[gitlab-sync] no token; sync disabled");
    return () => {};
  }

  opts.sqlite.run(
    "CREATE TABLE IF NOT EXISTS gitlab_pipeline_seen (gitlab_pipeline_id INTEGER PRIMARY KEY, project_id TEXT NOT NULL, seen_at TEXT NOT NULL)",
  );

  const projectNames = new Map<string, string>();

  async function projectName(projectId: string): Promise<string> {
    const cached = projectNames.get(projectId);
    if (cached) return cached;
    const res = await fetch(`${GITLAB_API}/projects/${encodeURIComponent(projectId)}`, {
      headers: { "PRIVATE-TOKEN": token },
    });
    if (!res.ok) throw new Error(`project lookup failed: ${res.status}`);
    const body = (await res.json()) as { name?: string };
    const name = typeof body.name === "string" && body.name ? body.name : projectId;
    projectNames.set(projectId, name);
    return name;
  }

  function isSeen(pipelineId: number): boolean {
    const row = opts.sqlite
      .query<{ one: number }, [number]>("SELECT 1 AS one FROM gitlab_pipeline_seen WHERE gitlab_pipeline_id = ?")
      .get(pipelineId);
    return row != null;
  }

  function markSeen(pipelineId: number, projectId: string): void {
    opts.sqlite.run(
      "INSERT OR IGNORE INTO gitlab_pipeline_seen (gitlab_pipeline_id, project_id, seen_at) VALUES (?, ?, ?)",
      [pipelineId, projectId, new Date().toISOString()],
    );
  }

  async function syncProject(projectId: string): Promise<void> {
    const res = await fetch(
      `${GITLAB_API}/projects/${encodeURIComponent(projectId)}/pipelines?per_page=50&order_by=updated_at&sort=desc`,
      { headers: { "PRIVATE-TOKEN": token } },
    );
    if (!res.ok) throw new Error(`pipelines request failed: ${res.status}`);
    const pipelines = (await res.json()) as GitlabPipeline[];
    const name = await projectName(projectId);
    let ingested = 0;
    for (const pipeline of pipelines) {
      if (isSeen(pipeline.id)) continue;
      const result = (await Actions.ingestPipelineEvent.handler(opts.ctxFactory() as Ctx, {
        project: name,
        event_kind: "pipeline" as const,
        status: mapStatus(pipeline.status),
        duration_seconds: Math.min(Math.max(Math.round(pipeline.duration ?? 0), 0), 604800),
        commit_reference: (pipeline.sha ?? "").slice(0, 40),
        event_timestamp: pipeline.updated_at ?? pipeline.created_at,
      })) as { ok: boolean; errors?: Record<string, string> };
      if (!result.ok) {
        console.log(
          `[gitlab-sync] project ${projectId}: ingest rejected for pipeline ${pipeline.id}: ${JSON.stringify(result.errors ?? result)}`,
        );
        continue;
      }
      markSeen(pipeline.id, projectId);
      ingested += 1;
    }
    console.log(`[gitlab-sync] project ${projectId}: ingested ${ingested} new pipelines`);
  }

  async function syncOnce(): Promise<void> {
    for (const projectId of opts.projectIds) {
      try {
        await syncProject(projectId);
      } catch (err) {
        console.log(
          `[gitlab-sync] project ${projectId}: sync error: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }
  }

  void syncOnce();
  const timer = setInterval(() => {
    void syncOnce();
  }, opts.intervalMin * 60_000);

  return () => {
    clearInterval(timer);
  };
}
