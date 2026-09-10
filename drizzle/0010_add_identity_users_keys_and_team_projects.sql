CREATE TABLE `identity_users` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `role` text NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `identity_users_updated_at_idx` ON `identity_users` (`updated_at`);
--> statement-breakpoint
CREATE TABLE `api_keys` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `user_id` text NOT NULL,
  `key_prefix` text NOT NULL,
  `key_hash` text NOT NULL,
  `revoked_at` integer,
  `last_verified_at` integer,
  `created_at` integer NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `identity_users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `api_keys_user_idx` ON `api_keys` (`user_id`);
--> statement-breakpoint
CREATE INDEX `api_keys_hash_idx` ON `api_keys` (`key_hash`);
--> statement-breakpoint
CREATE TABLE `team_projects` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `status` text NOT NULL,
  `description` text NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `team_projects_updated_at_idx` ON `team_projects` (`updated_at`);
--> statement-breakpoint
CREATE TABLE `project_members` (
  `project_id` text NOT NULL,
  `member_id` text NOT NULL,
  `linked_at` integer NOT NULL,
  FOREIGN KEY (`project_id`) REFERENCES `team_projects`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`member_id`) REFERENCES `team_members`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `project_members_unique_idx` ON `project_members` (`project_id`,`member_id`);
--> statement-breakpoint
CREATE INDEX `project_members_project_idx` ON `project_members` (`project_id`);
--> statement-breakpoint
CREATE INDEX `project_members_member_idx` ON `project_members` (`member_id`);
