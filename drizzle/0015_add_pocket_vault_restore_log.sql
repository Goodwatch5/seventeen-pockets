CREATE TABLE `vault_restore_previews` (
  `id` text PRIMARY KEY NOT NULL,
  `source_file_name` text NOT NULL,
  `mode` text NOT NULL,
  `payload_json` text NOT NULL,
  `counts_json` text NOT NULL,
  `created_at` integer NOT NULL,
  `expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `vault_restore_previews_expires_at_idx` ON `vault_restore_previews` (`expires_at`);
--> statement-breakpoint
CREATE TABLE `vault_restore_history` (
  `id` text PRIMARY KEY NOT NULL,
  `source_file_name` text NOT NULL,
  `mode` text NOT NULL,
  `counts_json` text NOT NULL,
  `total_records` integer NOT NULL,
  `restored_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `vault_restore_history_restored_at_idx` ON `vault_restore_history` (`restored_at`);