CREATE TABLE `clinical_cases` (
  `id` text PRIMARY KEY NOT NULL,
  `label` text NOT NULL,
  `symptoms` text NOT NULL,
  `observations` text NOT NULL,
  `summary_json` text NOT NULL,
  `created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `clinical_cases_created_at_idx` ON `clinical_cases` (`created_at`);
--> statement-breakpoint
CREATE TABLE `pipeline_events` (
  `id` text PRIMARY KEY NOT NULL,
  `project` text NOT NULL,
  `event_kind` text NOT NULL,
  `status` text NOT NULL,
  `duration_seconds` integer NOT NULL,
  `commit_reference` text NOT NULL,
  `event_timestamp` integer NOT NULL,
  `created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `pipeline_events_event_timestamp_idx` ON `pipeline_events` (`event_timestamp`);
--> statement-breakpoint
CREATE INDEX `pipeline_events_project_idx` ON `pipeline_events` (`project`);
