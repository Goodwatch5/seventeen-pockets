CREATE TABLE team_members (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  focus_area TEXT NOT NULL,
  availability TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX team_members_updated_at_idx ON team_members(updated_at);
--> statement-breakpoint
CREATE TABLE team_notes (
  id TEXT PRIMARY KEY NOT NULL,
  author TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX team_notes_created_at_idx ON team_notes(created_at);
--> statement-breakpoint
CREATE TABLE brain_messages (
  id TEXT PRIMARY KEY NOT NULL,
  role TEXT NOT NULL,
  kind TEXT NOT NULL,
  content TEXT NOT NULL,
  sources_json TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX brain_messages_created_at_idx ON brain_messages(created_at);
