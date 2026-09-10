CREATE TABLE soul_checkins (
  id TEXT PRIMARY KEY NOT NULL,
  emotion TEXT NOT NULL,
  intensity INTEGER,
  category TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  exercise_title TEXT NOT NULL,
  exercise_text TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX soul_checkins_created_at_idx ON soul_checkins(created_at);
--> statement-breakpoint
CREATE TABLE composer_drafts (
  id TEXT PRIMARY KEY NOT NULL,
  source TEXT NOT NULL,
  source_label TEXT NOT NULL,
  tone TEXT NOT NULL,
  format TEXT NOT NULL,
  audience TEXT NOT NULL,
  purpose TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX composer_drafts_updated_at_idx ON composer_drafts(updated_at);
