// Applies drizzle sqlite migrations in journal order, tracking progress in a
// `_migrations` table so runs are idempotent.

import { Database } from "bun:sqlite";
import { readFileSync } from "node:fs";
import { join } from "node:path";

interface JournalEntry {
  tag: string;
}

interface Journal {
  entries: JournalEntry[];
}

const STATEMENT_BREAKPOINT = /^\s*-->\s*$/m;

export function applyMigrations(db: Database, drizzleDir: string): void {
  db.run(
    "CREATE TABLE IF NOT EXISTS _migrations (tag TEXT PRIMARY KEY, applied_at TEXT NOT NULL)",
  );

  const journalPath = join(drizzleDir, "meta", "_journal.json");
  const journal = JSON.parse(readFileSync(journalPath, "utf8")) as Journal;

  const applied = new Set<string>();
  for (const row of db.query<{ tag: string }, []>("SELECT tag FROM _migrations").all()) {
    applied.add(row.tag);
  }

  for (const entry of journal.entries) {
    if (applied.has(entry.tag)) continue;
    const sql = readFileSync(join(drizzleDir, `${entry.tag}.sql`), "utf8");
    const statements = sql
      .split(STATEMENT_BREAKPOINT)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    for (const statement of statements) {
      db.run(statement);
    }
    db.run("INSERT INTO _migrations (tag, applied_at) VALUES (?, ?)", [entry.tag, new Date().toISOString()]);
    console.log(`[migrate] applied ${entry.tag}`);
  }
}
