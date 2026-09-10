DROP TABLE entries;
--> statement-breakpoint
CREATE TABLE events (
  id TEXT PRIMARY KEY NOT NULL,
  type TEXT NOT NULL,
  source TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL,
  validation_result TEXT NOT NULL,
  processing_result TEXT NOT NULL,
  received_at INTEGER NOT NULL,
  validated_at INTEGER NOT NULL,
  processed_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE event_stages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL,
  stage TEXT NOT NULL,
  sequence INTEGER NOT NULL,
  status TEXT NOT NULL,
  message TEXT NOT NULL,
  occurred_at INTEGER NOT NULL,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX events_created_at_idx ON events(created_at);
--> statement-breakpoint
CREATE INDEX event_stages_event_sequence_idx ON event_stages(event_id, sequence);