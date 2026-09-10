// One-shot migration runner: `bun run db:migrate`.

import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { applyMigrations } from "./migrate";

const databasePath = resolve(process.env.DATABASE_PATH ?? "./data/app.db");
mkdirSync(dirname(databasePath), { recursive: true });

const db = new Database(databasePath);
applyMigrations(db, resolve(process.cwd(), "drizzle"));
db.close();

console.log(`[db:migrate] done: ${databasePath}`);
