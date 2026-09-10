import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const events = sqliteTable(
  "events",
  {
    id: text("id").primaryKey(),
    type: text("type").notNull(),
    source: text("source").notNull(),
    payloadJson: text("payload_json").notNull(),
    status: text("status").notNull(),
    validationResult: text("validation_result").notNull(),
    processingResult: text("processing_result").notNull(),
    receivedAt: integer("received_at", { mode: "timestamp_ms" }).notNull(),
    validatedAt: integer("validated_at", { mode: "timestamp_ms" }).notNull(),
    processedAt: integer("processed_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("events_created_at_idx").on(table.createdAt)],
);

export const eventStages = sqliteTable(
  "event_stages",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    stage: text("stage").notNull(),
    sequence: integer("sequence").notNull(),
    status: text("status").notNull(),
    message: text("message").notNull(),
    occurredAt: integer("occurred_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("event_stages_event_sequence_idx").on(table.eventId, table.sequence),
  ],
);

export const metricEvents = sqliteTable(
  "metric_events",
  {
    id: text("id").primaryKey(),
    type: text("type").notNull(),
    source: text("source").notNull(),
    level: text("level").notNull(),
    message: text("message").notNull(),
    payloadJson: text("payload_json").notNull(),
    receivedAt: integer("received_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("metric_events_created_at_idx").on(table.createdAt)],
);

export const soulCheckins = sqliteTable(
  "soul_checkins",
  {
    id: text("id").primaryKey(),
    emotion: text("emotion").notNull(),
    intensity: integer("intensity"),
    category: text("category").notNull(),
    exerciseId: text("exercise_id").notNull(),
    exerciseTitle: text("exercise_title").notNull(),
    exerciseText: text("exercise_text").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("soul_checkins_created_at_idx").on(table.createdAt)],
);

export const composerDrafts = sqliteTable(
  "composer_drafts",
  {
    id: text("id").primaryKey(),
    source: text("source").notNull(),
    sourceLabel: text("source_label").notNull(),
    tone: text("tone").notNull(),
    format: text("format").notNull(),
    audience: text("audience").notNull(),
    purpose: text("purpose").notNull(),
    content: text("content").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("composer_drafts_updated_at_idx").on(table.updatedAt)],
);

export const readinessChecks = sqliteTable(
  "readiness_checks",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    status: text("status").notNull(),
    notes: text("notes").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("readiness_checks_category_idx").on(table.category),
    index("readiness_checks_updated_at_idx").on(table.updatedAt),
  ],
);

export const teamMembers = sqliteTable(
  "team_members",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    role: text("role").notNull(),
    focusArea: text("focus_area").notNull(),
    availability: text("availability").notNull(),
    status: text("status").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("team_members_updated_at_idx").on(table.updatedAt)],
);

export const teamNotes = sqliteTable(
  "team_notes",
  {
    id: text("id").primaryKey(),
    author: text("author").notNull(),
    body: text("body").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("team_notes_created_at_idx").on(table.createdAt)],
);

export const memoryEntries = sqliteTable(
  "memory_entries",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    tagsJson: text("tags_json").notNull(),
    relatedPocket: text("related_pocket"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("memory_entries_updated_at_idx").on(table.updatedAt),
    index("memory_entries_related_pocket_idx").on(table.relatedPocket),
  ],
);

export const brainMessages = sqliteTable(
  "brain_messages",
  {
    id: text("id").primaryKey(),
    role: text("role").notNull(),
    kind: text("kind").notNull(),
    content: text("content").notNull(),
    sourcesJson: text("sources_json").notNull(),
    consultedEntriesJson: text("consulted_entries_json").notNull().default("[]"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("brain_messages_created_at_idx").on(table.createdAt)],
);

export const dashboardConfigurations = sqliteTable("dashboard_configurations", {
  id: text("id").primaryKey(),
  widgetsJson: text("widgets_json").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const investorPitches = sqliteTable("investor_pitches", {
  id: text("id").primaryKey(),
  headline: text("headline").notNull(),
  problemStatement: text("problem_statement").notNull(),
  solution: text("solution").notNull(),
  askAmount: integer("ask_amount").notNull(),
  useOfFundsJson: text("use_of_funds_json").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const tractionEntries = sqliteTable(
  "traction_entries",
  {
    id: text("id").primaryKey(),
    occurredOn: text("occurred_on").notNull(),
    milestone: text("milestone").notNull(),
    description: text("description").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("traction_entries_occurred_on_idx").on(table.occurredOn)],
);

export const biomarkers = sqliteTable(
  "biomarkers",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    type: text("type").notNull(),
    associatedCondition: text("associated_condition").notNull(),
    evidenceNotes: text("evidence_notes").notNull(),
    status: text("status").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("biomarkers_updated_at_idx").on(table.updatedAt)],
);

export const clinicalSimulationRuns = sqliteTable(
  "clinical_simulation_runs",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    biomarkerId: text("biomarker_id").references(() => biomarkers.id, { onDelete: "set null" }),
    cohortSize: integer("cohort_size").notNull(),
    doseMg: integer("dose_mg").notNull(),
    durationDays: integer("duration_days").notNull(),
    targetKnockdownPercent: integer("target_knockdown_percent").notNull(),
    inputsJson: text("inputs_json").notNull(),
    resultsJson: text("results_json").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("clinical_simulation_runs_created_at_idx").on(table.createdAt)],
);

export const molecularAnalysisNotes = sqliteTable(
  "molecular_analysis_notes",
  {
    id: text("id").primaryKey(),
    biomarkerId: text("biomarker_id").references(() => biomarkers.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    analysisType: text("analysis_type").notNull(),
    observation: text("observation").notNull(),
    interpretation: text("interpretation").notNull(),
    nextStep: text("next_step").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("molecular_analysis_notes_updated_at_idx").on(table.updatedAt)],
);

export const clinicalCases = sqliteTable(
  "clinical_cases",
  {
    id: text("id").primaryKey(),
    label: text("label").notNull(),
    symptoms: text("symptoms").notNull(),
    observations: text("observations").notNull(),
    summaryJson: text("summary_json").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("clinical_cases_created_at_idx").on(table.createdAt)],
);

export const pipelineEvents = sqliteTable(
  "pipeline_events",
  {
    id: text("id").primaryKey(),
    project: text("project").notNull(),
    eventKind: text("event_kind").notNull(),
    status: text("status").notNull(),
    durationSeconds: integer("duration_seconds").notNull(),
    commitReference: text("commit_reference").notNull(),
    eventTimestamp: integer("event_timestamp", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("pipeline_events_event_timestamp_idx").on(table.eventTimestamp),
    index("pipeline_events_project_idx").on(table.project),
  ],
);

export const identityUsers = sqliteTable(
  "identity_users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    role: text("role").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("identity_users_updated_at_idx").on(table.updatedAt)],
);

export const apiKeys = sqliteTable(
  "api_keys",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id").notNull().references(() => identityUsers.id, { onDelete: "cascade" }),
    keyPrefix: text("key_prefix").notNull(),
    keyHash: text("key_hash").notNull(),
    revokedAt: integer("revoked_at", { mode: "timestamp_ms" }),
    lastVerifiedAt: integer("last_verified_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("api_keys_user_idx").on(table.userId),
    index("api_keys_hash_idx").on(table.keyHash),
  ],
);

export const teamProjects = sqliteTable(
  "team_projects",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    status: text("status").notNull(),
    description: text("description").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("team_projects_updated_at_idx").on(table.updatedAt)],
);

export const projectMembers = sqliteTable(
  "project_members",
  {
    projectId: text("project_id").notNull().references(() => teamProjects.id, { onDelete: "cascade" }),
    memberId: text("member_id").notNull().references(() => teamMembers.id, { onDelete: "cascade" }),
    linkedAt: integer("linked_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("project_members_project_idx").on(table.projectId),
    index("project_members_member_idx").on(table.memberId),
  ],
);

export const workflows = sqliteTable(
  "workflows",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    enabled: integer("enabled", { mode: "boolean" }).notNull(),
    triggerKind: text("trigger_kind").notNull(),
    triggerConfigJson: text("trigger_config_json").notNull(),
    lastEvaluatedAt: integer("last_evaluated_at", { mode: "timestamp_ms" }),
    lastFiredAt: integer("last_fired_at", { mode: "timestamp_ms" }),
    lastMetricValue: integer("last_metric_value"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("workflows_updated_at_idx").on(table.updatedAt),
    index("workflows_enabled_idx").on(table.enabled),
  ],
);

export const workflowActions = sqliteTable(
  "workflow_actions",
  {
    id: text("id").primaryKey(),
    workflowId: text("workflow_id")
      .notNull()
      .references(() => workflows.id, { onDelete: "cascade" }),
    sequence: integer("sequence").notNull(),
    kind: text("kind").notNull(),
    configJson: text("config_json").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("workflow_actions_workflow_sequence_idx").on(table.workflowId, table.sequence)],
);

export const workflowRuns = sqliteTable(
  "workflow_runs",
  {
    id: text("id").primaryKey(),
    workflowId: text("workflow_id")
      .notNull()
      .references(() => workflows.id, { onDelete: "cascade" }),
    status: text("status").notNull(),
    triggerKind: text("trigger_kind").notNull(),
    triggerSummary: text("trigger_summary").notNull(),
    actionResultsJson: text("action_results_json").notNull(),
    errorText: text("error_text").notNull(),
    startedAt: integer("started_at", { mode: "timestamp_ms" }).notNull(),
    finishedAt: integer("finished_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("workflow_runs_workflow_started_idx").on(table.workflowId, table.startedAt),
    index("workflow_runs_started_at_idx").on(table.startedAt),
  ],
);

export const sentinelRules = sqliteTable(
  "sentinel_rules",
  {
    id: text("id").primaryKey(),
    targetKind: text("target_kind").notNull(),
    targetName: text("target_name").notNull(),
    thresholdMode: text("threshold_mode").notNull(),
    thresholdValue: real("threshold_value").notNull(),
    windowKind: text("window_kind").notNull(),
    windowValue: integer("window_value").notNull(),
    enabled: integer("enabled", { mode: "boolean" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("sentinel_rules_target_idx").on(table.targetKind, table.targetName),
    index("sentinel_rules_updated_at_idx").on(table.updatedAt),
  ],
);

export const sentinelAlerts = sqliteTable(
  "sentinel_alerts",
  {
    id: text("id").primaryKey(),
    ruleId: text("rule_id").notNull().references(() => sentinelRules.id, { onDelete: "cascade" }),
    observationId: text("observation_id").notNull(),
    targetKind: text("target_kind").notNull(),
    targetName: text("target_name").notNull(),
    observedValue: real("observed_value").notNull(),
    baselineMean: real("baseline_mean").notNull(),
    baselineStdDev: real("baseline_std_dev").notNull(),
    deviation: real("deviation").notNull(),
    thresholdMode: text("threshold_mode").notNull(),
    thresholdValue: real("threshold_value").notNull(),
    severity: text("severity").notNull(),
    status: text("status").notNull(),
    observedAt: integer("observed_at", { mode: "timestamp_ms" }).notNull(),
    acknowledgedAt: integer("acknowledged_at", { mode: "timestamp_ms" }),
    resolvedAt: integer("resolved_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    uniqueIndex("sentinel_alerts_rule_observation_unique_idx").on(table.ruleId, table.observationId),
    index("sentinel_alerts_status_idx").on(table.status),
    index("sentinel_alerts_observed_at_idx").on(table.observedAt),
  ],
);

export const vaultRestorePreviews = sqliteTable(
  "vault_restore_previews",
  {
    id: text("id").primaryKey(),
    sourceFileName: text("source_file_name").notNull(),
    mode: text("mode").notNull(),
    payloadJson: text("payload_json").notNull(),
    countsJson: text("counts_json").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("vault_restore_previews_expires_at_idx").on(table.expiresAt)],
);

export const vaultRestoreHistory = sqliteTable(
  "vault_restore_history",
  {
    id: text("id").primaryKey(),
    sourceFileName: text("source_file_name").notNull(),
    mode: text("mode").notNull(),
    countsJson: text("counts_json").notNull(),
    totalRecords: integer("total_records").notNull(),
    restoredAt: integer("restored_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("vault_restore_history_restored_at_idx").on(table.restoredAt)],
);
