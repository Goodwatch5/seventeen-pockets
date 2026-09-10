CREATE TABLE `workflows` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `enabled` integer NOT NULL,
  `trigger_kind` text NOT NULL,
  `trigger_config_json` text NOT NULL,
  `last_evaluated_at` integer,
  `last_fired_at` integer,
  `last_metric_value` integer,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `workflows_updated_at_idx` ON `workflows` (`updated_at`);
--> statement-breakpoint
CREATE INDEX `workflows_enabled_idx` ON `workflows` (`enabled`);
--> statement-breakpoint
CREATE TABLE `workflow_actions` (
  `id` text PRIMARY KEY NOT NULL,
  `workflow_id` text NOT NULL,
  `sequence` integer NOT NULL,
  `kind` text NOT NULL,
  `config_json` text NOT NULL,
  `created_at` integer NOT NULL,
  FOREIGN KEY (`workflow_id`) REFERENCES `workflows`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `workflow_actions_workflow_sequence_idx` ON `workflow_actions` (`workflow_id`,`sequence`);
--> statement-breakpoint
CREATE TABLE `workflow_runs` (
  `id` text PRIMARY KEY NOT NULL,
  `workflow_id` text NOT NULL,
  `status` text NOT NULL,
  `trigger_kind` text NOT NULL,
  `trigger_summary` text NOT NULL,
  `action_results_json` text NOT NULL,
  `error_text` text NOT NULL,
  `started_at` integer NOT NULL,
  `finished_at` integer NOT NULL,
  FOREIGN KEY (`workflow_id`) REFERENCES `workflows`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `workflow_runs_workflow_started_idx` ON `workflow_runs` (`workflow_id`,`started_at`);
--> statement-breakpoint
CREATE INDEX `workflow_runs_started_at_idx` ON `workflow_runs` (`started_at`);
