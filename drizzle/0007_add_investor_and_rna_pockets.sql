CREATE TABLE `investor_pitches` (
  `id` text PRIMARY KEY NOT NULL,
  `headline` text NOT NULL,
  `problem_statement` text NOT NULL,
  `solution` text NOT NULL,
  `ask_amount` integer NOT NULL,
  `use_of_funds_json` text NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `traction_entries` (
  `id` text PRIMARY KEY NOT NULL,
  `occurred_on` text NOT NULL,
  `milestone` text NOT NULL,
  `description` text NOT NULL,
  `created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `traction_entries_occurred_on_idx` ON `traction_entries` (`occurred_on`);
--> statement-breakpoint
CREATE TABLE `biomarkers` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `type` text NOT NULL,
  `associated_condition` text NOT NULL,
  `evidence_notes` text NOT NULL,
  `status` text NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `biomarkers_updated_at_idx` ON `biomarkers` (`updated_at`);
--> statement-breakpoint
CREATE TABLE `clinical_simulation_runs` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `biomarker_id` text REFERENCES `biomarkers`(`id`) ON DELETE SET NULL,
  `cohort_size` integer NOT NULL,
  `dose_mg` integer NOT NULL,
  `duration_days` integer NOT NULL,
  `target_knockdown_percent` integer NOT NULL,
  `inputs_json` text NOT NULL,
  `results_json` text NOT NULL,
  `created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `clinical_simulation_runs_created_at_idx` ON `clinical_simulation_runs` (`created_at`);
--> statement-breakpoint
CREATE TABLE `molecular_analysis_notes` (
  `id` text PRIMARY KEY NOT NULL,
  `biomarker_id` text REFERENCES `biomarkers`(`id`) ON DELETE SET NULL,
  `title` text NOT NULL,
  `analysis_type` text NOT NULL,
  `observation` text NOT NULL,
  `interpretation` text NOT NULL,
  `next_step` text NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `molecular_analysis_notes_updated_at_idx` ON `molecular_analysis_notes` (`updated_at`);
