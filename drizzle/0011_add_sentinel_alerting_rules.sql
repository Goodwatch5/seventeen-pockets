CREATE TABLE `sentinel_rules` (
  `id` text PRIMARY KEY NOT NULL,
  `target_kind` text NOT NULL,
  `target_name` text NOT NULL,
  `threshold_mode` text NOT NULL,
  `threshold_value` real NOT NULL,
  `window_kind` text NOT NULL,
  `window_value` integer NOT NULL,
  `enabled` integer NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `sentinel_rules_target_idx` ON `sentinel_rules` (`target_kind`,`target_name`);
--> statement-breakpoint
CREATE INDEX `sentinel_rules_updated_at_idx` ON `sentinel_rules` (`updated_at`);
--> statement-breakpoint
CREATE TABLE `sentinel_alerts` (
  `id` text PRIMARY KEY NOT NULL,
  `rule_id` text NOT NULL,
  `observation_id` text NOT NULL,
  `target_kind` text NOT NULL,
  `target_name` text NOT NULL,
  `observed_value` real NOT NULL,
  `baseline_mean` real NOT NULL,
  `baseline_std_dev` real NOT NULL,
  `deviation` real NOT NULL,
  `threshold_mode` text NOT NULL,
  `threshold_value` real NOT NULL,
  `severity` text NOT NULL,
  `status` text NOT NULL,
  `observed_at` integer NOT NULL,
  `acknowledged_at` integer,
  `resolved_at` integer,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL,
  FOREIGN KEY (`rule_id`) REFERENCES `sentinel_rules`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sentinel_alerts_rule_observation_unique_idx` ON `sentinel_alerts` (`rule_id`,`observation_id`);
--> statement-breakpoint
CREATE INDEX `sentinel_alerts_status_idx` ON `sentinel_alerts` (`status`);
--> statement-breakpoint
CREATE INDEX `sentinel_alerts_observed_at_idx` ON `sentinel_alerts` (`observed_at`);
