CREATE TABLE `dashboard_configurations` (
  `id` text PRIMARY KEY NOT NULL,
  `widgets_json` text NOT NULL,
  `updated_at` integer NOT NULL
);
