CREATE TABLE metric_events (
  id TEXT PRIMARY KEY NOT NULL,
  type TEXT NOT NULL,
  source TEXT NOT NULL,
  level TEXT NOT NULL,
  message TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  received_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX metric_events_created_at_idx ON metric_events(created_at);
--> statement-breakpoint
CREATE TABLE readiness_checks (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL,
  notes TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX readiness_checks_category_idx ON readiness_checks(category);
--> statement-breakpoint
CREATE INDEX readiness_checks_updated_at_idx ON readiness_checks(updated_at);