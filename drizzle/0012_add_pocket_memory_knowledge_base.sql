CREATE TABLE `memory_entries` (
  `id` text PRIMARY KEY NOT NULL,
  `title` text NOT NULL,
  `body` text NOT NULL,
  `tags_json` text NOT NULL,
  `related_pocket` text,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `memory_entries_updated_at_idx` ON `memory_entries` (`updated_at`);
--> statement-breakpoint
CREATE INDEX `memory_entries_related_pocket_idx` ON `memory_entries` (`related_pocket`);
--> statement-breakpoint
ALTER TABLE `brain_messages` ADD `consulted_entries_json` text DEFAULT '[]' NOT NULL;
