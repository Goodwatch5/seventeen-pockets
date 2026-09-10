import { defineAction, z, type ActionsModule } from "@hatch/space-sdk";
import { and, asc, count, desc, eq, lte } from "drizzle-orm";
import * as schema from "./schema";

const SERVER_STARTED_AT = new Date().toISOString();

const EventStageSchema = z.object({
  stage: z.enum(["receive", "validate", "process"]),
  sequence: z.number().int(),
  status: z.enum(["complete", "failed"]),
  message: z.string(),
  occurred_at: z.string(),
});

const EventSummarySchema = z.object({
  id: z.string(),
  type: z.string(),
  source: z.string(),
  status: z.enum(["processed", "failed"]),
  payload_preview: z.string(),
  received_at: z.string(),
  processed_at: z.string(),
});

const EventDetailSchema = z.object({
  id: z.string(),
  type: z.string(),
  source: z.string(),
  payload: z.record(z.string(), z.unknown()),
  status: z.enum(["processed", "failed"]),
  validation_result: z.string(),
  processing_result: z.string(),
  receivedAt: z.string(),
  received_at: z.string(),
  validated_at: z.string(),
  processed_at: z.string(),
  stages: z.array(EventStageSchema),
});

const MetricEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  source: z.string(),
  level: z.enum(["healthy", "warning", "critical"]),
  message: z.string(),
  payload: z.record(z.string(), z.unknown()),
  received_at: z.string(),
});

const ReadinessCheckSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  status: z.enum(["pass", "fail", "pending"]),
  notes: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

const SoulCheckinSchema = z.object({
  id: z.string(),
  emotion: z.string(),
  intensity: z.number().int().min(1).max(10).nullable(),
  category: z.string(),
  exercise: z.object({ id: z.string(), title: z.string(), text: z.string(), minutes: z.number().int() }),
  created_at: z.string(),
});

const ComposerDraftSchema = z.object({
  id: z.string(),
  source: z.enum(["auditor", "metrics", "soul"]),
  source_label: z.string(),
  tone: z.enum(["professional", "empathetic", "urgent"]),
  format: z.enum(["notification", "email", "emotional_email"]),
  audience: z.string(),
  purpose: z.string(),
  content: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

const TeamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  focus_area: z.string(),
  availability: z.enum(["available", "limited", "unavailable"]),
  status: z.enum(["active", "away", "offline"]),
  created_at: z.string(),
  updated_at: z.string(),
});

const TeamNoteSchema = z.object({
  id: z.string(),
  author: z.string(),
  body: z.string(),
  created_at: z.string(),
});

const MemoryEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  tags: z.array(z.string()),
  related_pocket: z.string().nullable(),
  relevance: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

const BrainSourceSchema = z.object({
  pocket: z.enum(["zero", "metrics", "auditor", "soul", "team", "memory"]),
  label: z.string(),
  count: z.number().int(),
});

const BrainCitationSchema = z.object({
  id: z.string(),
  title: z.string(),
  related_pocket: z.string().nullable(),
  tags: z.array(z.string()),
});

const BrainMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  kind: z.enum(["question", "briefing"]),
  content: z.string(),
  sources: z.array(BrainSourceSchema),
  consulted_entries: z.array(BrainCitationSchema),
  created_at: z.string(),
});

const WidgetIdSchema = z.enum(["zero", "metrics", "auditor", "soul", "team", "brain"]);
const WidgetConfigSchema = z.object({ id: WidgetIdSchema, enabled: z.boolean() });
const defaultWidgets = ["zero", "metrics", "auditor", "soul", "team", "brain"].map((id) => ({ id: id as z.infer<typeof WidgetIdSchema>, enabled: true }));

const UseOfFundsItemSchema = z.object({ category: z.string(), amount: z.number().int().nonnegative() });
const InvestorPitchSchema = z.object({
  id: z.string(), headline: z.string(), problem_statement: z.string(), solution: z.string(), ask_amount: z.number().int().nonnegative(),
  use_of_funds: z.array(UseOfFundsItemSchema), created_at: z.string(), updated_at: z.string(),
});
const TractionEntrySchema = z.object({ id: z.string(), occurred_on: z.string(), milestone: z.string(), description: z.string(), created_at: z.string() });
const BiomarkerStatusSchema = z.enum(["candidate", "reviewed", "validated", "archived"]);
const BiomarkerSchema = z.object({
  id: z.string(), name: z.string(), type: z.string(), associated_condition: z.string(), evidence_notes: z.string(),
  status: BiomarkerStatusSchema, created_at: z.string(), updated_at: z.string(),
});
const SimulationResultSchema = z.object({
  projected_knockdown_percent: z.number().int(), projected_response_rate_percent: z.number().int(), projected_responders: z.number().int(),
  uncertainty_percent: z.number().int(), risk_band: z.enum(["low", "moderate", "elevated"]), summary: z.string(),
});
const SimulationRunSchema = z.object({
  id: z.string(), name: z.string(), biomarker_id: z.string().nullable(), biomarker_name: z.string().nullable(), cohort_size: z.number().int(),
  dose_mg: z.number().int(), duration_days: z.number().int(), target_knockdown_percent: z.number().int(),
  results: SimulationResultSchema, created_at: z.string(),
});
const MolecularNoteSchema = z.object({
  id: z.string(), biomarker_id: z.string().nullable(), biomarker_name: z.string().nullable(), title: z.string(), analysis_type: z.string(),
  observation: z.string(), interpretation: z.string(), next_step: z.string(), created_at: z.string(), updated_at: z.string(),
});

const DifferentialItemSchema = z.object({ consideration: z.string(), rationale: z.string(), next_step: z.string() });
const ClinicalSummarySchema = z.object({
  overview: z.string(), considerations: z.array(DifferentialItemSchema), safety_note: z.string(), knowledge_version: z.string(),
});
const ClinicalCaseSchema = z.object({
  id: z.string(), label: z.string(), symptoms: z.string(), observations: z.string(), summary: ClinicalSummarySchema, created_at: z.string(),
});
const PipelineEventSchema = z.object({
  id: z.string(), project: z.string(), event_kind: z.enum(["pipeline", "deployment"]), status: z.enum(["success", "failed", "canceled", "running"]),
  duration_seconds: z.number().int(), commit_reference: z.string(), event_timestamp: z.string(), created_at: z.string(),
});

const WorkflowTriggerSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("event"), event_type: z.string() }),
  z.object({ kind: z.literal("metric"), metric_name: z.string(), operator: z.enum(["above", "below"]), value: z.number() }),
  z.object({ kind: z.literal("schedule"), schedule_type: z.enum(["interval", "cron"]), interval_minutes: z.number().int().nullable(), cron_expression: z.string() }),
]);
const WorkflowActionSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("team_note"), author: z.string(), body: z.string() }),
  z.object({ kind: z.literal("composer_message"), audience: z.string(), purpose: z.string(), content: z.string() }),
  z.object({ kind: z.literal("auditor_check"), name: z.string(), category: z.string(), status: z.enum(["pass", "fail", "pending"]), notes: z.string() }),
  z.object({ kind: z.literal("emit_event"), type: z.string(), source: z.string(), payload_json: z.string() }),
]);
const WorkflowActionResultSchema = z.object({ sequence: z.number().int(), kind: z.string(), status: z.enum(["success", "failure"]), message: z.string() });
const WorkflowRunSchema = z.object({
  id: z.string(), workflow_id: z.string(), status: z.enum(["success", "failure"]), trigger_kind: z.enum(["manual", "event", "metric", "schedule"]),
  trigger_summary: z.string(), actions: z.array(WorkflowActionResultSchema), error: z.string(), started_at: z.string(), finished_at: z.string(),
});
const WorkflowSchema = z.object({
  id: z.string(), name: z.string(), enabled: z.boolean(), trigger: WorkflowTriggerSchema, actions: z.array(WorkflowActionSchema),
  last_evaluated_at: z.string().nullable(), last_fired_at: z.string().nullable(), created_at: z.string(), updated_at: z.string(), runs: z.array(WorkflowRunSchema),
});

const IdentityRoleSchema = z.enum(["admin", "operator", "viewer"]);
const IdentityUserSchema = z.object({
  id: z.string(), name: z.string(), role: IdentityRoleSchema, created_at: z.string(), updated_at: z.string(),
});
const ApiKeySchema = z.object({
  id: z.string(), name: z.string(), user_id: z.string(), user_name: z.string(), role: IdentityRoleSchema,
  prefix: z.string(), status: z.enum(["active", "revoked"]), created_at: z.string(), revoked_at: z.string().nullable(), last_verified_at: z.string().nullable(),
});
const ProjectStatusSchema = z.enum(["planned", "active", "on_hold", "done"]);
const TeamProjectSchema = z.object({
  id: z.string(), name: z.string(), status: ProjectStatusSchema, description: z.string(),
  members: z.array(z.object({ id: z.string(), name: z.string(), role: z.string() })),
  created_at: z.string(), updated_at: z.string(),
});

const SentinelTargetKindSchema = z.enum(["metric", "event"]);
const SentinelThresholdModeSchema = z.enum(["standard_deviation", "absolute", "percentage"]);
const SentinelWindowKindSchema = z.enum(["observations", "hours"]);
const SentinelRuleSchema = z.object({
  id: z.string(), target_kind: SentinelTargetKindSchema, target_name: z.string(), threshold_mode: SentinelThresholdModeSchema,
  threshold_value: z.number(), window_kind: SentinelWindowKindSchema, window_value: z.number().int(), enabled: z.boolean(),
  created_at: z.string(), updated_at: z.string(),
});
const SentinelAlertSchema = z.object({
  id: z.string(), rule_id: z.string(), observation_id: z.string(), target_kind: SentinelTargetKindSchema, target_name: z.string(),
  observed_value: z.number(), baseline_mean: z.number(), baseline_standard_deviation: z.number(), deviation: z.number(),
  threshold_mode: SentinelThresholdModeSchema, threshold_value: z.number(), severity: z.enum(["medium", "high", "critical"]),
  status: z.enum(["open", "acknowledged", "resolved"]), observed_at: z.string(), acknowledged_at: z.string().nullable(),
  resolved_at: z.string().nullable(), created_at: z.string(), updated_at: z.string(),
});
const ForecastPointSchema = z.object({ at: z.string(), estimated_value: z.number() });
const ForecastResultSchema = z.object({
  metric_name: z.string(), horizon_hours: z.number().int(), status: z.enum(["ready", "insufficient_data"]),
  message: z.string(), observation_count: z.number().int(), window_started_at: z.string().nullable(), window_ended_at: z.string().nullable(),
  latest_value: z.number().nullable(), direction: z.enum(["rising", "falling", "flat", "unknown"]), slope_per_hour: z.number().nullable(),
  fit_quality: z.number().nullable(), confidence_score: z.number().int(), confidence: z.enum(["low", "moderate", "high"]),
  precision_digits: z.number().int(), projections: z.array(ForecastPointSchema),
});

type WorkflowTrigger = z.infer<typeof WorkflowTriggerSchema>;
type WorkflowAction = z.infer<typeof WorkflowActionSchema>;
type WorkflowActionResult = z.infer<typeof WorkflowActionResultSchema>;
type IdentityRole = z.infer<typeof IdentityRoleSchema>;

async function hashApiKey(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function verifyCredential(db: any, material: string) {
  const key = material.trim();
  if (!key) return null;
  const hash = await hashApiKey(key);
  const rows = await db.select().from(schema.apiKeys).where(eq(schema.apiKeys.keyHash, hash)).limit(1);
  const stored = rows[0] as typeof schema.apiKeys.$inferSelect | undefined;
  if (!stored || stored.revokedAt) return null;
  const users = await db.select().from(schema.identityUsers).where(eq(schema.identityUsers.id, stored.userId)).limit(1);
  const user = users[0] as typeof schema.identityUsers.$inferSelect | undefined;
  if (!user) return null;
  return { key: stored, user, role: user.role as IdentityRole };
}

async function enforceOptionalApiWrite(ctx: any, args: { api_key?: string }, adminOnly = false) {
  if (!args.api_key) return;
  const auth = await verifyCredential(ctx.db(), args.api_key);
  if (!auth) throw new Error("API key is unknown or revoked.");
  if (auth.role === "viewer" || (adminOnly && auth.role !== "admin")) throw new Error(adminOnly ? "An admin API key is required." : "This API key is read-only.");
}

function toIdentityUser(row: typeof schema.identityUsers.$inferSelect) {
  return { id: row.id, name: row.name, role: row.role as IdentityRole, created_at: row.createdAt.toISOString(), updated_at: row.updatedAt.toISOString() };
}

async function loadIdentityKeys(db: any): Promise<Array<z.infer<typeof ApiKeySchema>>> {
  const [keys, users] = await Promise.all([
    db.select().from(schema.apiKeys).orderBy(desc(schema.apiKeys.createdAt)).limit(300),
    db.select().from(schema.identityUsers).limit(300),
  ]);
  const userMap = new Map<string, typeof schema.identityUsers.$inferSelect>(users.map((user: typeof schema.identityUsers.$inferSelect) => [user.id, user]));
  return keys.map((key: typeof schema.apiKeys.$inferSelect) => {
    const user = userMap.get(key.userId);
    return {
      id: key.id, name: key.name, user_id: key.userId, user_name: user?.name ?? "Deleted user", role: (user?.role ?? "viewer") as IdentityRole,
      prefix: key.keyPrefix, status: key.revokedAt ? "revoked" as const : "active" as const,
      created_at: key.createdAt.toISOString(), revoked_at: key.revokedAt?.toISOString() ?? null, last_verified_at: key.lastVerifiedAt?.toISOString() ?? null,
    };
  });
}

async function loadTeamProjects(db: any): Promise<Array<z.infer<typeof TeamProjectSchema>>> {
  const [projects, links, members] = await Promise.all([
    db.select().from(schema.teamProjects).orderBy(desc(schema.teamProjects.updatedAt)).limit(300),
    db.select().from(schema.projectMembers).limit(2000),
    db.select().from(schema.teamMembers).limit(500),
  ]);
  const memberMap = new Map(members.map((member: typeof schema.teamMembers.$inferSelect) => [member.id, member]));
  return projects.map((project: typeof schema.teamProjects.$inferSelect) => ({
    id: project.id, name: project.name, status: project.status as z.infer<typeof ProjectStatusSchema>, description: project.description,
    members: links.filter((link: typeof schema.projectMembers.$inferSelect) => link.projectId === project.id).map((link: typeof schema.projectMembers.$inferSelect) => memberMap.get(link.memberId)).filter(Boolean).map((member: any) => ({ id: member.id, name: member.name, role: member.role })),
    created_at: project.createdAt.toISOString(), updated_at: project.updatedAt.toISOString(),
  }));
}

const apiCatalog = [
  { name: "health", pocket: "Core", method: "query", inputs: {}, returns: "Core service status, server boot timestamp, and current server timestamp." },
  { name: "getsystem", pocket: "Core", method: "query", inputs: {}, returns: "The Seventeen Pockets foundation identity, version, purpose, and canonical capability list." },
  { name: "getDashboard", pocket: "Pocket Zero", method: "query", inputs: {}, returns: "System status, contract, event totals, and recent event summaries." },
  { name: "submitEvent", pocket: "Pocket Zero", method: "mutation", inputs: { type: "dotted lowercase string (required)", source: "string (required)", payload_json: "JSON object string (optional; defaults to {})" }, returns: "Validation result and complete receive → validate → process trace, including canonical receivedAt and existing timestamps." },
  { name: "getEvent", pocket: "Pocket Zero", method: "query", inputs: { id: "event id" }, returns: "One event, parsed payload, and ordered processing stages." },
  { name: "getMetrics", pocket: "Pocket Metrics", method: "query", inputs: {}, returns: "Health score, level counts, rolling volume, and recent service events." },
  { name: "submitMetricEvent", pocket: "Pocket Metrics", method: "mutation", inputs: { type: "string", source: "string", level: "healthy | warning | critical", message: "string", payload_json: "JSON object string; numeric observations use payload.value" }, returns: "The stored service event or field errors." },
  { name: "getSentinel", pocket: "Pocket Sentinel", method: "query", inputs: {}, returns: "Anomaly rules, numeric observation targets, and complete alert history." },
  { name: "createSentinelRule", pocket: "Pocket Sentinel", method: "mutation", inputs: { target_kind: "metric | event", target_name: "name or blank for all", threshold_mode: "standard_deviation | absolute | percentage", threshold_value: "positive number", window_kind: "observations | hours", window_value: "integer", enabled: "boolean" }, returns: "The persisted anomaly rule." },
  { name: "setSentinelRuleEnabled", pocket: "Pocket Sentinel", method: "mutation", inputs: { id: "rule id", enabled: "boolean" }, returns: "The updated rule state." },
  { name: "evaluateSentinel", pocket: "Pocket Sentinel", method: "mutation", inputs: {}, returns: "Evaluation totals and newly recorded alerts." },
  { name: "updateSentinelAlert", pocket: "Pocket Sentinel", method: "mutation", inputs: { id: "alert id", status: "acknowledged | resolved" }, returns: "The updated alert." },
  { name: "getForecast", pocket: "Pocket Forecast", method: "query", inputs: { metric_name: "numeric metric type", horizon_hours: "1 | 6 | 24 | 168" }, returns: "Least-squares direction, confidence, fit quality, and estimated projection points." },
  { name: "getAuditor", pocket: "Pocket Auditor", method: "query", inputs: {}, returns: "Readiness score, grouped gaps, counts, and all checks." },
  { name: "submitReadinessCheck", pocket: "Pocket Auditor", method: "mutation", inputs: { name: "string", category: "string", status: "pass | fail | pending", notes: "string" }, returns: "The stored readiness check or field errors." },
  { name: "getSoul", pocket: "Pocket Soul", method: "query", inputs: {}, returns: "Grounding exercise library and saved check-in history." },
  { name: "submitSoulCheckin", pocket: "Pocket Soul", method: "mutation", inputs: { emotion: "string", intensity: "integer 1–10 or null", category: "breathing | sensory | journaling | movement" }, returns: "The saved check-in with its matched grounding practice." },
  { name: "getComposer", pocket: "Pocket Composer", method: "query", inputs: {}, returns: "Available pocket sources and saved drafts." },
  { name: "generateComposition", pocket: "Pocket Composer", method: "mutation", inputs: { source: "auditor | metrics | soul", tone: "professional | empathetic | urgent", format: "notification | email | emotional_email", audience: "string", purpose: "string" }, returns: "A grounded, editable message preview or field errors." },
  { name: "saveComposerDraft", pocket: "Pocket Composer", method: "mutation", inputs: { source: "auditor | metrics | soul", source_label: "string", tone: "professional | empathetic | urgent", format: "notification | email | emotional_email", audience: "string", purpose: "string", content: "string" }, returns: "The persisted draft or an error." },
  { name: "getTeam", pocket: "Pocket Team", method: "query", inputs: {}, returns: "Team roster, shared notes, and projects with linked member names." },
  { name: "addTeamMember", pocket: "Pocket Team", method: "mutation", inputs: { name: "string", role: "string", focus_area: "string", availability: "available | limited | unavailable", status: "active | away | offline", api_key: "optional operator/admin key" }, returns: "The persisted team member or field errors." },
  { name: "updateTeamMember", pocket: "Pocket Team", method: "mutation", inputs: { id: "member id", role: "string", focus_area: "string", availability: "available | limited | unavailable", status: "active | away | offline", api_key: "optional operator/admin key" }, returns: "The updated team member or field errors." },
  { name: "postTeamNote", pocket: "Pocket Team", method: "mutation", inputs: { author: "string", body: "string", api_key: "optional operator/admin key" }, returns: "The persisted team note or field errors." },
  { name: "createProject", pocket: "Pocket Team", method: "mutation", inputs: { name: "string", status: "planned | active | on_hold | done", description: "string", member_ids: "array of team member ids", api_key: "optional operator/admin key" }, returns: "The persisted project with member names resolved." },
  { name: "updateProjectStatus", pocket: "Pocket Team", method: "mutation", inputs: { id: "project id", status: "planned | active | on_hold | done", api_key: "optional operator/admin key" }, returns: "The updated project." },
  { name: "linkProjectMember", pocket: "Pocket Team", method: "mutation", inputs: { project_id: "project id", member_id: "member id", api_key: "optional operator/admin key" }, returns: "The project with the member linked." },
  { name: "unlinkProjectMember", pocket: "Pocket Team", method: "mutation", inputs: { project_id: "project id", member_id: "member id", api_key: "optional operator/admin key" }, returns: "The project with the member unlinked." },
  { name: "getIdentity", pocket: "Pocket Identity", method: "query", inputs: {}, returns: "Users and masked API-key metadata. Full key material is never returned after issuance." },
  { name: "createIdentityUser", pocket: "Pocket Identity", method: "mutation", inputs: { name: "string", role: "admin | operator | viewer", api_key: "optional admin key" }, returns: "The persisted user." },
  { name: "issueApiKey", pocket: "Pocket Identity", method: "mutation", inputs: { name: "string", user_id: "user id", api_key: "optional admin key" }, returns: "Key metadata plus full key material once." },
  { name: "revokeApiKey", pocket: "Pocket Identity", method: "mutation", inputs: { id: "key id", api_key: "optional admin key" }, returns: "Revocation confirmation." },
  { name: "verifyApiKey", pocket: "Pocket Identity", method: "query", inputs: { key: "full API key material" }, returns: "Validity, owner, and role; updates last verified time for active keys." },
  { name: "getMemory", pocket: "Pocket Memory", method: "query", inputs: { query: "optional title/body search", tag: "optional exact tag filter" }, returns: "Ranked knowledge entries, available tags, and total count." },
  { name: "createMemoryEntry", pocket: "Pocket Memory", method: "mutation", inputs: { title: "string", body: "string", tags: "string array", related_pocket: "optional pocket name" }, returns: "The persisted knowledge entry." },
  { name: "updateMemoryEntry", pocket: "Pocket Memory", method: "mutation", inputs: { id: "entry id", title: "string", body: "string", tags: "string array", related_pocket: "optional pocket name" }, returns: "The updated knowledge entry." },
  { name: "deleteMemoryEntry", pocket: "Pocket Memory", method: "mutation", inputs: { id: "entry id" }, returns: "Deletion confirmation." },
  { name: "getBrain", pocket: "Pocket Brain", method: "query", inputs: {}, returns: "Persistent conversation and connected-pocket counts." },
  { name: "askBrain", pocket: "Pocket Brain", method: "mutation", inputs: { prompt: "string", kind: "question | briefing" }, returns: "Stored answer grounded in pocket records, with cited Memory entries." },
  { name: "getApiExplorerCatalog", pocket: "Pocket API", method: "query", inputs: {}, returns: "Read-only endpoint names, expected inputs, and return descriptions." },
  { name: "getCustomDashboard", pocket: "Pocket Dashboard", method: "query", inputs: {}, returns: "Saved widget layout plus live summaries from connected pockets." },
  { name: "saveDashboardConfiguration", pocket: "Pocket Dashboard", method: "mutation", inputs: { widgets: "ordered array of { id, enabled }" }, returns: "The persisted widget configuration and update time." },
  { name: "getInvestor", pocket: "Pocket Investor", method: "query", inputs: {}, returns: "Saved pitch, traction log, and live record counts across connected pockets." },
  { name: "saveInvestorPitch", pocket: "Pocket Investor", method: "mutation", inputs: { headline: "string", problem_statement: "string", solution: "string", ask_amount: "integer dollars", use_of_funds: "array of { category, amount }" }, returns: "The persisted investor pitch or field errors." },
  { name: "addTractionEntry", pocket: "Pocket Investor", method: "mutation", inputs: { occurred_on: "YYYY-MM-DD", milestone: "string", description: "string" }, returns: "The persisted traction milestone or field errors." },
  { name: "getRna", pocket: "Pocket RNA", method: "query", inputs: {}, returns: "Biomarkers, clinical simulation history, and linked molecular analysis notes." },
  { name: "addBiomarker", pocket: "Pocket RNA", method: "mutation", inputs: { name: "string", type: "string", associated_condition: "string", evidence_notes: "string", status: "candidate | reviewed | validated | archived" }, returns: "The persisted biomarker or field errors." },
  { name: "runClinicalSimulation", pocket: "Pocket RNA", method: "mutation", inputs: { name: "string", biomarker_id: "string or null", cohort_size: "integer 1–100000", dose_mg: "integer 1–10000", duration_days: "integer 1–3650", target_knockdown_percent: "integer 1–100" }, returns: "A stored exploratory server-side simulation with calculated results." },
  { name: "addMolecularNote", pocket: "Pocket RNA", method: "mutation", inputs: { biomarker_id: "string or null", title: "string", analysis_type: "string", observation: "string", interpretation: "string", next_step: "string" }, returns: "The persisted structured analysis note or field errors." },
  { name: "getClinical", pocket: "Pocket Clinical", method: "query", inputs: {}, returns: "Local-first posture and saved diagnostic-support demo cases." },
  { name: "createClinicalCase", pocket: "Pocket Clinical", method: "mutation", inputs: { label: "string", symptoms: "string", observations: "string" }, returns: "A persisted differential-support summary generated from the built-in knowledge table." },
  { name: "getSolarConnect", pocket: "Solar Connect", method: "query", inputs: {}, returns: "Derived pipeline health, deployment frequency, failure rate, and recent CI events." },
  { name: "ingestPipelineEvent", pocket: "Solar Connect", method: "mutation", inputs: { project: "string", event_kind: "pipeline | deployment", status: "success | failed | canceled | running", duration_seconds: "positive integer", commit_reference: "string", event_timestamp: "ISO datetime" }, returns: "The persisted CI event or field errors." },
  { name: "getWorkflows", pocket: "Pocket Workflows", method: "query", inputs: {}, returns: "Persisted Nexus workflows with triggers, ordered actions, and recent execution history." },
  { name: "createWorkflow", pocket: "Pocket Workflows", method: "mutation", inputs: { name: "string", enabled: "boolean", trigger: "event | metric | schedule configuration", actions: "one or more action configurations" }, returns: "The persisted workflow or field errors." },
  { name: "setWorkflowEnabled", pocket: "Pocket Workflows", method: "mutation", inputs: { id: "workflow id", enabled: "boolean" }, returns: "The updated workflow state." },
  { name: "runWorkflowNow", pocket: "Pocket Workflows", method: "mutation", inputs: { id: "workflow id" }, returns: "A real manual execution and its action results." },
  { name: "evaluateWorkflows", pocket: "Pocket Workflows", method: "mutation", inputs: {}, returns: "Scheduler evaluation totals and generated runs." },
  { name: "deleteWorkflow", pocket: "Pocket Workflows", method: "mutation", inputs: { id: "workflow id" }, returns: "Deletion confirmation; actions and runs cascade." },
  { name: "getVault", pocket: "Pocket Vault", method: "query", inputs: {}, returns: "Backup contract, upload limit, table inventory, and immutable restore history." },
  { name: "exportVault", pocket: "Pocket Vault", method: "query", inputs: {}, returns: "A complete versioned JSON backup containing every application record." },
  { name: "previewVaultRestore", pocket: "Pocket Vault", method: "mutation", inputs: { source_file_name: "JSON file name", mode: "merge | replace", payload_json: "backup JSON, maximum 5 MiB" }, returns: "Server-validated dry-run counts or precise table and row errors." },
  { name: "confirmVaultRestore", pocket: "Pocket Vault", method: "mutation", inputs: { preview_id: "unexpired validated preview id" }, returns: "Atomic restore result and audit-history entry." },
] as const;

const groundingExercises = [
  { id: "breath-box", category: "breathing", title: "Box breathing", minutes: 4, text: "Sit with both feet supported. Breathe in through your nose for a slow count of four. Hold for four. Breathe out for four. Hold empty for four. Repeat the four-part cycle four times, letting your shoulders soften on each exhale." },
  { id: "breath-long-exhale", category: "breathing", title: "Longer exhale", minutes: 3, text: "Place one hand lightly on your abdomen. Inhale gently for a count of four, then exhale for a count of six. Do not force the breath. Repeat for ten rounds, noticing the support beneath your body." },
  { id: "sensory-54321", category: "sensory", title: "5–4–3–2–1 grounding", minutes: 5, text: "Name five things you can see, four things you can feel, three things you can hear, two things you can smell, and one thing you can taste. Move slowly and describe each detail out loud or in your mind." },
  { id: "sensory-temperature", category: "sensory", title: "Temperature and texture", minutes: 3, text: "Hold a cool glass, textured cloth, or another safe object. Notice its temperature, weight, edges, and texture. Describe four precise sensations, then look around and name three colors in the room." },
  { id: "journal-name-need", category: "journaling", title: "Name, need, next", minutes: 7, text: "Write three short lines: ‘Right now I feel…’, ‘What this feeling may need is…’, and ‘One kind next step I can take is…’. Keep the next step small enough to do within ten minutes." },
  { id: "journal-facts-story", category: "journaling", title: "Facts and story", minutes: 8, text: "Divide a page into two columns. On the left, list only what you directly know happened. On the right, list the meanings or predictions your mind is adding. Circle one fact you can act on and write one measured response." },
  { id: "move-orient", category: "movement", title: "Orient and stretch", minutes: 4, text: "Stand or sit securely. Slowly turn your head and notice the room from left to right. Roll your shoulders five times, reach both arms up, then press your feet into the floor for ten seconds. Repeat once while breathing normally." },
  { id: "move-shake-walk", category: "movement", title: "Shake and walk", minutes: 5, text: "Gently shake out your hands and arms for thirty seconds. Walk at a comfortable pace for three minutes, noticing each foot meeting the ground. Finish by standing still and naming one change in your body." },
] as const;

function toSoulCheckin(row: typeof schema.soulCheckins.$inferSelect) {
  const exercise = groundingExercises.find((item) => item.id === row.exerciseId);
  return {
    id: row.id, emotion: row.emotion, intensity: row.intensity, category: row.category,
    exercise: { id: row.exerciseId, title: row.exerciseTitle, text: row.exerciseText, minutes: exercise?.minutes ?? 5 },
    created_at: row.createdAt.toISOString(),
  };
}

function toComposerDraft(row: typeof schema.composerDrafts.$inferSelect) {
  return {
    id: row.id,
    source: row.source as "auditor" | "metrics" | "soul",
    source_label: row.sourceLabel,
    tone: row.tone as "professional" | "empathetic" | "urgent",
    format: row.format as "notification" | "email" | "emotional_email",
    audience: row.audience,
    purpose: row.purpose,
    content: row.content,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  };
}

function toSummary(row: typeof schema.events.$inferSelect) {
  const compact = row.payloadJson.replace(/\s+/g, " ");
  return {
    id: row.id,
    type: row.type,
    source: row.source,
    status: row.status as "processed" | "failed",
    payload_preview: compact.length > 92 ? `${compact.slice(0, 89)}…` : compact,
    received_at: row.receivedAt.toISOString(),
    processed_at: row.processedAt.toISOString(),
  };
}

function safePayload(payloadJson: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(payloadJson);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

async function loadDetail(db: any, eventId: string) {
  const rows = await db.select().from(schema.events).where(eq(schema.events.id, eventId)).limit(1);
  const event = rows[0];
  if (!event) return null;

  const stages = await db
    .select()
    .from(schema.eventStages)
    .where(eq(schema.eventStages.eventId, eventId))
    .orderBy(asc(schema.eventStages.sequence));

  return {
    id: event.id,
    type: event.type,
    source: event.source,
    payload: safePayload(event.payloadJson),
    status: event.status as "processed" | "failed",
    validation_result: event.validationResult,
    processing_result: event.processingResult,
    receivedAt: event.receivedAt.toISOString(),
    received_at: event.receivedAt.toISOString(),
    validated_at: event.validatedAt.toISOString(),
    processed_at: event.processedAt.toISOString(),
    stages: stages.map((stage: typeof schema.eventStages.$inferSelect) => ({
      stage: stage.stage as "receive" | "validate" | "process",
      sequence: stage.sequence,
      status: stage.status as "complete" | "failed",
      message: stage.message,
      occurred_at: stage.occurredAt.toISOString(),
    })),
  };
}

async function loadComposerSources(db: any) {
  const [auditorRows, metricRows, soulRows] = await Promise.all([
    db.select().from(schema.readinessChecks).orderBy(desc(schema.readinessChecks.updatedAt)).limit(100),
    db.select().from(schema.metricEvents).orderBy(desc(schema.metricEvents.receivedAt)).limit(100),
    db.select().from(schema.soulCheckins).orderBy(desc(schema.soulCheckins.createdAt)).limit(1),
  ]);
  const pass = auditorRows.filter((row: typeof schema.readinessChecks.$inferSelect) => row.status === "pass").length;
  const failed = auditorRows.filter((row: typeof schema.readinessChecks.$inferSelect) => row.status === "fail");
  const pending = auditorRows.filter((row: typeof schema.readinessChecks.$inferSelect) => row.status === "pending");
  const critical = metricRows.filter((row: typeof schema.metricEvents.$inferSelect) => row.level === "critical").length;
  const warning = metricRows.filter((row: typeof schema.metricEvents.$inferSelect) => row.level === "warning").length;
  const health = metricRows.length === 0 ? "unknown" : critical > 0 ? "critical" : warning > 0 ? "degraded" : "healthy";
  const score = auditorRows.length ? Math.round((pass / auditorRows.length) * 100) : null;
  const soul = soulRows[0] as typeof schema.soulCheckins.$inferSelect | undefined;
  return [
    {
      key: "auditor" as const, label: "Auditor gap report", available: auditorRows.length > 0,
      summary: auditorRows.length ? `Readiness is ${score}%. ${failed.length} failed and ${pending.length} pending. ${[...failed, ...pending].slice(0, 3).map((row) => `${row.name}${row.notes ? ` — ${row.notes}` : ""}`).join("; ") || "No open gaps."}` : "No readiness checks have been recorded.",
    },
    {
      key: "metrics" as const, label: "Metrics health summary", available: metricRows.length > 0,
      summary: metricRows.length ? `System health is ${health}. Across ${metricRows.length} recent events, ${critical} are critical and ${warning} are warnings. ${metricRows[0]?.message ?? ""}` : "No service events have been recorded.",
    },
    {
      key: "soul" as const, label: "Soul check-in", available: Boolean(soul),
      summary: soul ? `Latest check-in: ${soul.emotion}${soul.intensity ? ` at intensity ${soul.intensity} of 10` : ""}. Grounding practice: ${soul.exerciseTitle}.` : "No Soul check-in has been recorded.",
    },
  ];
}

function composeText(sourceLabel: string, summary: string, tone: "professional" | "empathetic" | "urgent", format: "notification" | "email" | "emotional_email", audience: string, purpose: string) {
  const opening = tone === "urgent" ? "Action needed now" : tone === "empathetic" ? "A thoughtful update" : "Status update";
  const next = tone === "urgent" ? `Please review this immediately and coordinate the next step: ${purpose}.` : tone === "empathetic" ? `I’m sharing this with care so we can respond constructively. The next step I’d value is: ${purpose}.` : `Requested next step: ${purpose}.`;
  if (format === "notification") return `${opening}: ${sourceLabel} — ${summary} ${next}`;
  const subject = tone === "urgent" ? `Urgent: ${sourceLabel}` : tone === "empathetic" ? `Checking in: ${sourceLabel}` : `${sourceLabel} update`;
  const emotionalLine = format === "emotional_email" ? "I want to acknowledge the human impact behind this update, not only the status itself. " : "";
  return `Subject: ${subject}\n\nHello ${audience},\n\n${emotionalLine}${summary}\n\n${next}\n\nThank you`;
}

function toTeamMember(row: typeof schema.teamMembers.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    focus_area: row.focusArea,
    availability: row.availability as "available" | "limited" | "unavailable",
    status: row.status as "active" | "away" | "offline",
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  };
}

function toTeamNote(row: typeof schema.teamNotes.$inferSelect) {
  return { id: row.id, author: row.author, body: row.body, created_at: row.createdAt.toISOString() };
}

type MemoryEntry = z.infer<typeof MemoryEntrySchema>;
type BrainCitation = z.infer<typeof BrainCitationSchema>;

function parseMemoryTags(value: string): string[] {
  try {
    const parsed = z.array(z.string()).safeParse(JSON.parse(value));
    return parsed.success ? parsed.data : [];
  } catch { return []; }
}

function normalizeMemoryTags(tags: string[]) {
  return Array.from(new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))).slice(0, 12);
}

function toMemoryEntry(row: typeof schema.memoryEntries.$inferSelect, relevance = 0): MemoryEntry {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    tags: parseMemoryTags(row.tagsJson),
    related_pocket: row.relatedPocket,
    relevance,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  };
}

function memoryTerms(query: string) {
  return Array.from(new Set((query.toLowerCase().match(/[a-z0-9][a-z0-9_-]*/g) ?? []).filter((term) => term.length > 1)));
}

function scoreMemory(row: typeof schema.memoryEntries.$inferSelect, query: string) {
  const phrase = query.trim().toLowerCase();
  if (!phrase) return 0;
  const title = row.title.toLowerCase();
  const body = row.body.toLowerCase();
  const tags = parseMemoryTags(row.tagsJson);
  const terms = memoryTerms(query);
  let score = 0;
  if (title === phrase) score += 40;
  else if (title.includes(phrase)) score += 20;
  if (body.includes(phrase)) score += 10;
  for (const term of terms) {
    if (title.split(/\s+/).some((word) => word.replace(/[^a-z0-9_-]/g, "") === term)) score += 8;
    else if (title.includes(term)) score += 5;
    if (body.includes(term)) score += 2;
    if (tags.includes(term)) score += 10;
  }
  return score;
}

async function searchMemoryRows(db: any, query: string, tag: string, limit = 100): Promise<MemoryEntry[]> {
  const rows = await db.select().from(schema.memoryEntries).orderBy(desc(schema.memoryEntries.updatedAt)).limit(1000);
  const normalizedTag = tag.trim().toLowerCase();
  return rows
    .filter((row: typeof schema.memoryEntries.$inferSelect) => !normalizedTag || parseMemoryTags(row.tagsJson).includes(normalizedTag))
    .map((row: typeof schema.memoryEntries.$inferSelect) => ({ row, relevance: scoreMemory(row, query) }))
    .filter((item: { relevance: number }) => !query.trim() || item.relevance > 0)
    .sort((a: any, b: any) => b.relevance - a.relevance || b.row.updatedAt.getTime() - a.row.updatedAt.getTime())
    .slice(0, limit)
    .map((item: any) => toMemoryEntry(item.row, item.relevance));
}

function toBrainMessage(row: typeof schema.brainMessages.$inferSelect) {
  let sources: Array<{ pocket: "zero" | "metrics" | "auditor" | "soul" | "team" | "memory"; label: string; count: number }> = [];
  let consultedEntries: BrainCitation[] = [];
  try { sources = JSON.parse(row.sourcesJson); } catch { sources = []; }
  try { consultedEntries = JSON.parse(row.consultedEntriesJson); } catch { consultedEntries = []; }
  return {
    id: row.id,
    role: row.role as "user" | "assistant",
    kind: row.kind as "question" | "briefing",
    content: row.content,
    sources,
    consulted_entries: consultedEntries,
    created_at: row.createdAt.toISOString(),
  };
}

async function synthesizeBrain(db: any, prompt: string, kind: "question" | "briefing") {
  const [zero, metrics, checks, soul, notes, members, memory] = await Promise.all([
    db.select().from(schema.events).orderBy(desc(schema.events.createdAt)).limit(30),
    db.select().from(schema.metricEvents).orderBy(desc(schema.metricEvents.receivedAt)).limit(100),
    db.select().from(schema.readinessChecks).orderBy(desc(schema.readinessChecks.updatedAt)).limit(100),
    db.select().from(schema.soulCheckins).orderBy(desc(schema.soulCheckins.createdAt)).limit(10),
    db.select().from(schema.teamNotes).orderBy(desc(schema.teamNotes.createdAt)).limit(30),
    db.select().from(schema.teamMembers).orderBy(desc(schema.teamMembers.updatedAt)).limit(100),
    searchMemoryRows(db, prompt, "", 5),
  ]);
  const citations: BrainCitation[] = memory.map((entry) => ({ id: entry.id, title: entry.title, related_pocket: entry.related_pocket, tags: entry.tags }));
  const sources = [
    { pocket: "zero" as const, label: "Zero events", count: zero.length },
    { pocket: "metrics" as const, label: "Metrics signals", count: metrics.length },
    { pocket: "auditor" as const, label: "Auditor checks", count: checks.length },
    { pocket: "soul" as const, label: "Soul check-ins", count: soul.length },
    { pocket: "team" as const, label: "Team notes", count: notes.length },
    { pocket: "memory" as const, label: "Memory entries consulted", count: memory.length },
  ];
  const available = sources.filter((source) => source.count > 0);
  if (available.length === 0) {
    return {
      sources,
      citations,
      content: kind === "briefing"
        ? "There isn’t enough pocket activity for a briefing yet. Add a Memory entry or activity in another pocket, then request the briefing again."
        : `I checked every connected pocket and searched Memory for “${prompt},” but there are no matching stored records to ground an answer yet.`,
    };
  }

  const parts: string[] = [];
  if (memory.length) parts.push(`Relevant Memory:\n${memory.map((entry) => `[Memory: ${entry.title}] ${entry.body.length > 360 ? `${entry.body.slice(0, 357)}…` : entry.body}`).join("\n")}`);
  if (zero.length) parts.push(`Pocket Zero has ${zero.length} recent ${zero.length === 1 ? "event" : "events"}; the latest is ${zero[0].type} from ${zero[0].source}, marked ${zero[0].status}.`);
  if (metrics.length) {
    const critical = metrics.filter((row: typeof schema.metricEvents.$inferSelect) => row.level === "critical").length;
    const warning = metrics.filter((row: typeof schema.metricEvents.$inferSelect) => row.level === "warning").length;
    const state = critical ? "critical" : warning ? "degraded" : "healthy";
    parts.push(`Pocket Metrics is ${state} across ${metrics.length} recent signals (${critical} critical, ${warning} warning). Latest: ${metrics[0].message}`);
  }
  if (checks.length) {
    const failed = checks.filter((row: typeof schema.readinessChecks.$inferSelect) => row.status === "fail");
    const pending = checks.filter((row: typeof schema.readinessChecks.$inferSelect) => row.status === "pending");
    const passing = checks.length - failed.length - pending.length;
    parts.push(`Pocket Auditor shows ${passing} passing, ${failed.length} failed, and ${pending.length} pending checks.${[...failed, ...pending][0] ? ` The first open item is ${[...failed, ...pending][0].name}.` : ""}`);
  }
  if (soul.length) parts.push(`Pocket Soul’s latest check-in is ${soul[0].emotion}${soul[0].intensity ? ` at ${soul[0].intensity}/10` : ""}, paired with ${soul[0].exerciseTitle}.`);
  if (notes.length) parts.push(`Pocket Team has ${notes.length} recent ${notes.length === 1 ? "update" : "updates"}. Latest from ${notes[0].author}: ${notes[0].body}`);
  if (members.length) {
    const active = members.filter((row: typeof schema.teamMembers.$inferSelect) => row.status === "active").length;
    const availableMembers = members.filter((row: typeof schema.teamMembers.$inferSelect) => row.availability === "available").length;
    parts.push(`The team roster has ${members.length} ${members.length === 1 ? "member" : "members"}; ${active} active and ${availableMembers} available.`);
  }
  const prefix = kind === "briefing" ? "Current cross-pocket briefing:" : `Based on the stored records relevant to “${prompt}”:`;
  const priorities: string[] = [];
  if (metrics.some((row: typeof schema.metricEvents.$inferSelect) => row.level === "critical")) priorities.push("Review critical Metrics signals first");
  if (checks.some((row: typeof schema.readinessChecks.$inferSelect) => row.status === "fail")) priorities.push("assign owners to failed Auditor checks");
  if (members.length && !members.some((row: typeof schema.teamMembers.$inferSelect) => row.availability === "available")) priorities.push("confirm team coverage before assigning new work");
  const next = priorities.length ? ` Recommended next move: ${priorities.join(", then ")}.` : " No urgent exception is visible in the stored records; review the latest updates and choose the next owner.";
  return { sources, citations, content: `${prefix}\n\n${parts.join("\n\n")}${next}` };
}

function validateJsonObject(payloadJson: string, errors: Record<string, string>) {
  let payload: Record<string, unknown> = {};
  if (payloadJson.length > 20_000) {
    errors.payload_json = "Payload must be 20 KB or smaller.";
  } else {
    try {
      const parsed = JSON.parse(payloadJson || "{}");
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        errors.payload_json = "Payload must be a JSON object.";
      } else {
        payload = parsed as Record<string, unknown>;
      }
    } catch {
      errors.payload_json = "Payload is not valid JSON.";
    }
  }
  return payload;
}

function parseUseOfFunds(value: string) {
  try {
    const parsed = UseOfFundsItemSchema.array().safeParse(JSON.parse(value));
    return parsed.success ? parsed.data : [];
  } catch { return []; }
}

function toInvestorPitch(row: typeof schema.investorPitches.$inferSelect) {
  return {
    id: row.id, headline: row.headline, problem_statement: row.problemStatement, solution: row.solution, ask_amount: row.askAmount,
    use_of_funds: parseUseOfFunds(row.useOfFundsJson), created_at: row.createdAt.toISOString(), updated_at: row.updatedAt.toISOString(),
  };
}

function toTractionEntry(row: typeof schema.tractionEntries.$inferSelect) {
  return { id: row.id, occurred_on: row.occurredOn, milestone: row.milestone, description: row.description, created_at: row.createdAt.toISOString() };
}

function toBiomarker(row: typeof schema.biomarkers.$inferSelect) {
  return {
    id: row.id, name: row.name, type: row.type, associated_condition: row.associatedCondition, evidence_notes: row.evidenceNotes,
    status: row.status as z.infer<typeof BiomarkerStatusSchema>, created_at: row.createdAt.toISOString(), updated_at: row.updatedAt.toISOString(),
  };
}

type SimulationResult = z.infer<typeof SimulationResultSchema>;
function parseSimulationResult(value: string): SimulationResult {
  try {
    const parsed = SimulationResultSchema.safeParse(JSON.parse(value));
    if (parsed.success) return parsed.data;
  } catch { /* handled by the fallback below */ }
  return { projected_knockdown_percent: 0, projected_response_rate_percent: 0, projected_responders: 0, uncertainty_percent: 0, risk_band: "moderate", summary: "Stored result could not be read." };
}

function simulateClinicalRun(cohortSize: number, doseMg: number, durationDays: number, targetKnockdown: number): SimulationResult {
  const doseFactor = doseMg / (doseMg + 100);
  const durationFactor = durationDays / (durationDays + 60);
  const projectedKnockdown = Math.max(1, Math.min(95, Math.round(targetKnockdown * (0.58 + doseFactor * 0.27 + durationFactor * 0.15))));
  const responseRate = Math.max(1, Math.min(92, Math.round(projectedKnockdown * (0.68 + durationFactor * 0.18))));
  const projectedResponders = Math.round(cohortSize * responseRate / 100);
  const proportion = responseRate / 100;
  const uncertainty = Math.max(1, Math.min(50, Math.ceil(1.96 * Math.sqrt((proportion * (1 - proportion)) / cohortSize) * 100)));
  const riskScore = (doseMg > 500 ? 2 : doseMg > 150 ? 1 : 0) + (durationDays > 365 ? 2 : durationDays > 120 ? 1 : 0) + (targetKnockdown > 85 ? 1 : 0);
  const riskBand = riskScore >= 3 ? "elevated" as const : riskScore >= 1 ? "moderate" as const : "low" as const;
  return {
    projected_knockdown_percent: projectedKnockdown,
    projected_response_rate_percent: responseRate,
    projected_responders: projectedResponders,
    uncertainty_percent: uncertainty,
    risk_band: riskBand,
    summary: `Exploratory model projects ${responseRate}% response (${projectedResponders} of ${cohortSize}) with ±${uncertainty}% sampling uncertainty and a ${riskBand} parameter-risk band.`,
  };
}

function toSimulationRun(row: typeof schema.clinicalSimulationRuns.$inferSelect, biomarkerName: string | null) {
  return {
    id: row.id, name: row.name, biomarker_id: row.biomarkerId, biomarker_name: biomarkerName, cohort_size: row.cohortSize,
    dose_mg: row.doseMg, duration_days: row.durationDays, target_knockdown_percent: row.targetKnockdownPercent,
    results: parseSimulationResult(row.resultsJson), created_at: row.createdAt.toISOString(),
  };
}

function toMolecularNote(row: typeof schema.molecularAnalysisNotes.$inferSelect, biomarkerName: string | null) {
  return {
    id: row.id, biomarker_id: row.biomarkerId, biomarker_name: biomarkerName, title: row.title, analysis_type: row.analysisType,
    observation: row.observation, interpretation: row.interpretation, next_step: row.nextStep,
    created_at: row.createdAt.toISOString(), updated_at: row.updatedAt.toISOString(),
  };
}

const clinicalKnowledge = [
  { consideration: "Self-limited respiratory illness", terms: ["cough", "sore throat", "congestion", "runny nose", "fever"], nextStep: "Review duration, temperature, hydration, breathing, and relevant exposure history with a clinician." },
  { consideration: "Allergic or environmental irritation", terms: ["sneeze", "itchy", "watery eyes", "pollen", "dust", "rash"], nextStep: "Review triggers, timing, exposures, and any history of allergic reactions." },
  { consideration: "Gastrointestinal illness or irritation", terms: ["nausea", "vomit", "diarrhea", "abdominal", "stomach", "cramp"], nextStep: "Review hydration, intake, pain location, stool changes, and duration with a clinician." },
  { consideration: "Headache syndrome", terms: ["headache", "migraine", "light sensitivity", "aura", "head pain"], nextStep: "Review onset, severity, neurologic symptoms, triggers, and prior headache pattern." },
  { consideration: "Musculoskeletal strain or overuse", terms: ["muscle", "joint", "sprain", "strain", "back pain", "stiffness"], nextStep: "Review mechanism, range of motion, swelling, weakness, and functional limits." },
  { consideration: "Stress, sleep, or autonomic factors", terms: ["stress", "anxiety", "panic", "tired", "fatigue", "insomnia", "dizzy"], nextStep: "Review sleep, hydration, recent stressors, medications, and persistent or worsening symptoms." },
] as const;
const urgentClinicalTerms = ["chest pain", "trouble breathing", "cannot breathe", "one-sided weakness", "fainting", "severe bleeding", "suicidal", "overdose", "seizure"];

function buildClinicalSummary(symptoms: string, observations: string) {
  const text = `${symptoms} ${observations}`.toLowerCase();
  const considerations: Array<{ consideration: string; rationale: string; next_step: string }> = clinicalKnowledge
    .map((entry) => ({ entry, matches: entry.terms.filter((term) => text.includes(term)) }))
    .filter((match) => match.matches.length > 0)
    .sort((a, b) => b.matches.length - a.matches.length)
    .slice(0, 4)
    .map(({ entry, matches }) => ({ consideration: entry.consideration, rationale: `Matched entered terms: ${matches.join(", ")}.`, next_step: entry.nextStep }));
  if (!considerations.length) considerations.push({ consideration: "Needs clinician-led assessment", rationale: "The entered terms do not closely match a category in this small demo knowledge table.", next_step: "Collect onset, duration, severity, associated symptoms, medications, and relevant history for clinical review." });
  const urgent = urgentClinicalTerms.some((term) => text.includes(term));
  return {
    overview: `This demo matched ${considerations.length} possible ${considerations.length === 1 ? "consideration" : "considerations"} from a limited built-in table. It does not diagnose or rank likelihood.`,
    considerations,
    safety_note: urgent ? "The text includes a potentially urgent warning sign. Seek immediate in-person or emergency assessment rather than relying on this demo." : "This is a diagnostic-support demo, not medical advice. A qualified clinician should interpret symptoms, examine the patient, and decide next steps. Seek urgent care for severe or rapidly worsening symptoms.",
    knowledge_version: "clinical-demo-1",
  };
}

function parseClinicalSummary(value: string): z.infer<typeof ClinicalSummarySchema> {
  try { const parsed = ClinicalSummarySchema.safeParse(JSON.parse(value)); if (parsed.success) return parsed.data; } catch { /* use safe fallback */ }
  return { overview: "Stored summary could not be read.", considerations: [], safety_note: "This is a diagnostic-support demo, not medical advice.", knowledge_version: "unknown" };
}

function toClinicalCase(row: typeof schema.clinicalCases.$inferSelect) {
  return { id: row.id, label: row.label, symptoms: row.symptoms, observations: row.observations, summary: parseClinicalSummary(row.summaryJson), created_at: row.createdAt.toISOString() };
}

function toPipelineEvent(row: typeof schema.pipelineEvents.$inferSelect) {
  return { id: row.id, project: row.project, event_kind: row.eventKind as "pipeline" | "deployment", status: row.status as "success" | "failed" | "canceled" | "running", duration_seconds: row.durationSeconds, commit_reference: row.commitReference, event_timestamp: row.eventTimestamp.toISOString(), created_at: row.createdAt.toISOString() };
}

function parseWorkflowTrigger(value: string): WorkflowTrigger | null {
  try { const result = WorkflowTriggerSchema.safeParse(JSON.parse(value)); return result.success ? result.data : null; } catch { return null; }
}

function parseWorkflowAction(value: string): WorkflowAction | null {
  try { const result = WorkflowActionSchema.safeParse(JSON.parse(value)); return result.success ? result.data : null; } catch { return null; }
}

function parseActionResults(value: string): WorkflowActionResult[] {
  try { const result = WorkflowActionResultSchema.array().safeParse(JSON.parse(value)); return result.success ? result.data : []; } catch { return []; }
}

function toWorkflowRun(row: typeof schema.workflowRuns.$inferSelect) {
  return {
    id: row.id,
    workflow_id: row.workflowId,
    status: row.status as "success" | "failure",
    trigger_kind: row.triggerKind as "manual" | "event" | "metric" | "schedule",
    trigger_summary: row.triggerSummary,
    actions: parseActionResults(row.actionResultsJson),
    error: row.errorText,
    started_at: row.startedAt.toISOString(),
    finished_at: row.finishedAt.toISOString(),
  };
}

function applyWorkflowTemplate(value: string, workflowName: string, triggerSummary: string, timestamp: Date) {
  return value
    .replaceAll("{{workflow}}", workflowName)
    .replaceAll("{{trigger}}", triggerSummary)
    .replaceAll("{{timestamp}}", timestamp.toISOString());
}

function cronFieldMatches(field: string, value: number, min: number, max: number) {
  return field.split(",").some((part) => {
    const token = part.trim();
    if (!token) return false;
    const [base, stepText] = token.split("/");
    const step = stepText === undefined ? 1 : Number(stepText);
    if (!Number.isInteger(step) || step < 1) return false;
    if (base === "*") return (value - min) % step === 0;
    const range = base?.split("-").map(Number) ?? [];
    if (range.length === 2 && range.every(Number.isInteger)) return range[0]! >= min && range[1]! <= max && range[0]! <= value && value <= range[1]! && (value - range[0]!) % step === 0;
    const exact = Number(base);
    return Number.isInteger(exact) && exact >= min && exact <= max && value === exact;
  });
}

function validCron(expression: string) {
  const fields = expression.trim().split(/\s+/);
  if (fields.length !== 5) return false;
  const probes: Array<[number, number]> = [[0, 59], [0, 23], [1, 31], [1, 12], [0, 6]];
  return fields.every((field, index) => {
    const [min, max] = probes[index]!;
    return field.split(",").every((part) => {
      const [base, stepText] = part.split("/");
      if (stepText !== undefined && (!/^\d+$/.test(stepText) || Number(stepText) < 1)) return false;
      if (base === "*") return true;
      if (/^\d+$/.test(base ?? "")) { const number = Number(base); return number >= min && number <= max; }
      const range = (base ?? "").match(/^(\d+)-(\d+)$/);
      return Boolean(range && Number(range[1]) >= min && Number(range[2]) <= max && Number(range[1]) <= Number(range[2]));
    });
  });
}

function cronMatches(expression: string, date: Date) {
  const fields = expression.trim().split(/\s+/);
  if (fields.length !== 5) return false;
  const values = [date.getUTCMinutes(), date.getUTCHours(), date.getUTCDate(), date.getUTCMonth() + 1, date.getUTCDay()];
  const ranges: Array<[number, number]> = [[0, 59], [0, 23], [1, 31], [1, 12], [0, 6]];
  return fields.every((field, index) => cronFieldMatches(field, values[index]!, ranges[index]![0], ranges[index]![1]));
}

async function readWorkflowMetric(db: any, metricName: string): Promise<number | null> {
  const rows = await db.select().from(schema.metricEvents).orderBy(desc(schema.metricEvents.receivedAt)).limit(500);
  if (metricName === "total_events") return rows.length;
  if (metricName === "healthy_events") return rows.filter((row: typeof schema.metricEvents.$inferSelect) => row.level === "healthy").length;
  if (metricName === "warning_events") return rows.filter((row: typeof schema.metricEvents.$inferSelect) => row.level === "warning").length;
  if (metricName === "critical_events") return rows.filter((row: typeof schema.metricEvents.$inferSelect) => row.level === "critical").length;
  if (metricName === "health_score") {
    if (!rows.length) return null;
    const healthy = rows.filter((row: typeof schema.metricEvents.$inferSelect) => row.level === "healthy").length;
    const warning = rows.filter((row: typeof schema.metricEvents.$inferSelect) => row.level === "warning").length;
    return Math.round((healthy * 100 + warning * 60) / rows.length);
  }
  const matching = rows.find((row: typeof schema.metricEvents.$inferSelect) => row.type === metricName);
  if (!matching) return null;
  const value = safePayload(matching.payloadJson).value;
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

async function executeWorkflow(db: any, workflow: typeof schema.workflows.$inferSelect, actions: Array<typeof schema.workflowActions.$inferSelect>, triggerKind: "manual" | "event" | "metric" | "schedule", triggerSummary: string) {
  const startedAt = new Date();
  const results: WorkflowActionResult[] = [];
  for (const actionRow of actions) {
    const action = parseWorkflowAction(actionRow.configJson);
    if (!action) {
      results.push({ sequence: actionRow.sequence, kind: actionRow.kind, status: "failure", message: "Stored action configuration is invalid." });
      continue;
    }
    try {
      if (action.kind === "team_note") {
        const body = applyWorkflowTemplate(action.body, workflow.name, triggerSummary, startedAt);
        await db.insert(schema.teamNotes).values({ id: crypto.randomUUID(), author: action.author, body, createdAt: new Date() });
        results.push({ sequence: actionRow.sequence, kind: action.kind, status: "success", message: `Posted a team note as ${action.author}.` });
      } else if (action.kind === "composer_message") {
        const content = applyWorkflowTemplate(action.content, workflow.name, triggerSummary, startedAt);
        const now = new Date();
        await db.insert(schema.composerDrafts).values({ id: crypto.randomUUID(), source: "metrics", sourceLabel: `Workflow: ${workflow.name}`, tone: "professional", format: "notification", audience: action.audience, purpose: action.purpose, content, createdAt: now, updatedAt: now });
        results.push({ sequence: actionRow.sequence, kind: action.kind, status: "success", message: `Saved a Composer draft for ${action.audience}.` });
      } else if (action.kind === "auditor_check") {
        const now = new Date();
        await db.insert(schema.readinessChecks).values({ id: crypto.randomUUID(), name: action.name, category: action.category, status: action.status, notes: applyWorkflowTemplate(action.notes, workflow.name, triggerSummary, startedAt), createdAt: now, updatedAt: now });
        results.push({ sequence: actionRow.sequence, kind: action.kind, status: "success", message: `Logged ${action.status} readiness check “${action.name}”.` });
      } else {
        const payload = safePayload(action.payload_json);
        const eventId = crypto.randomUUID(); const receivedAt = new Date(); const validatedAt = new Date(receivedAt.getTime() + 1); const processedAt = new Date(receivedAt.getTime() + 2);
        const validationResult = "Schema accepted: type, source, and payload are valid.";
        const processingResult = `Pocket Zero processed ${action.type} from ${action.source}.`;
        await db.insert(schema.events).values({ id: eventId, type: action.type, source: action.source, payloadJson: JSON.stringify(payload), status: "processed", validationResult, processingResult, receivedAt, validatedAt, processedAt, createdAt: receivedAt, updatedAt: processedAt });
        await db.insert(schema.eventStages).values([
          { eventId, stage: "receive", sequence: 1, status: "complete", message: "Envelope accepted by Pocket Zero.", occurredAt: receivedAt },
          { eventId, stage: "validate", sequence: 2, status: "complete", message: validationResult, occurredAt: validatedAt },
          { eventId, stage: "process", sequence: 3, status: "complete", message: processingResult, occurredAt: processedAt },
        ]);
        results.push({ sequence: actionRow.sequence, kind: action.kind, status: "success", message: `Emitted ${action.type} into Pocket Zero.` });
      }
    } catch {
      results.push({ sequence: actionRow.sequence, kind: action.kind, status: "failure", message: "The action could not be completed." });
    }
  }
  const failed = results.filter((item) => item.status === "failure");
  const finishedAt = new Date();
  const runRow = { id: crypto.randomUUID(), workflowId: workflow.id, status: failed.length ? "failure" : "success", triggerKind, triggerSummary, actionResultsJson: JSON.stringify(results), errorText: failed.length ? `${failed.length} of ${results.length} actions failed.` : "", startedAt, finishedAt };
  await db.insert(schema.workflowRuns).values(runRow);
  await db.update(schema.workflows).set({ lastFiredAt: finishedAt, updatedAt: finishedAt }).where(eq(schema.workflows.id, workflow.id));
  return toWorkflowRun(runRow);
}

async function loadWorkflow(db: any, workflow: typeof schema.workflows.$inferSelect, runLimit = 20) {
  const [actions, runs] = await Promise.all([
    db.select().from(schema.workflowActions).where(eq(schema.workflowActions.workflowId, workflow.id)).orderBy(asc(schema.workflowActions.sequence)),
    db.select().from(schema.workflowRuns).where(eq(schema.workflowRuns.workflowId, workflow.id)).orderBy(desc(schema.workflowRuns.startedAt)).limit(runLimit),
  ]);
  return {
    id: workflow.id,
    name: workflow.name,
    enabled: workflow.enabled,
    trigger: parseWorkflowTrigger(workflow.triggerConfigJson) ?? { kind: "event" as const, event_type: "invalid.configuration" },
    actions: actions.map((row: typeof schema.workflowActions.$inferSelect) => parseWorkflowAction(row.configJson)).filter((item: WorkflowAction | null): item is WorkflowAction => item !== null),
    last_evaluated_at: workflow.lastEvaluatedAt?.toISOString() ?? null,
    last_fired_at: workflow.lastFiredAt?.toISOString() ?? null,
    created_at: workflow.createdAt.toISOString(),
    updated_at: workflow.updatedAt.toISOString(),
    runs: runs.map(toWorkflowRun),
  };
}

type NumericObservation = { id: string; kind: "metric" | "event"; name: string; value: number; at: Date };

function numericValue(payloadJson: string) {
  const value = safePayload(payloadJson).value;
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

async function loadNumericObservations(db: any): Promise<NumericObservation[]> {
  const [metricRows, eventRows] = await Promise.all([
    db.select().from(schema.metricEvents).orderBy(asc(schema.metricEvents.receivedAt)).limit(2000),
    db.select().from(schema.events).orderBy(asc(schema.events.receivedAt)).limit(2000),
  ]);
  const observations: NumericObservation[] = [];
  for (const row of metricRows as Array<typeof schema.metricEvents.$inferSelect>) {
    const value = numericValue(row.payloadJson);
    if (value !== null) observations.push({ id: row.id, kind: "metric", name: row.type, value, at: row.receivedAt });
  }
  for (const row of eventRows as Array<typeof schema.events.$inferSelect>) {
    const value = numericValue(row.payloadJson);
    if (value !== null) observations.push({ id: row.id, kind: "event", name: row.type, value, at: row.receivedAt });
  }
  return observations.sort((a, b) => a.at.getTime() - b.at.getTime());
}

function toSentinelRule(row: typeof schema.sentinelRules.$inferSelect) {
  return {
    id: row.id, target_kind: row.targetKind as "metric" | "event", target_name: row.targetName,
    threshold_mode: row.thresholdMode as "standard_deviation" | "absolute" | "percentage", threshold_value: row.thresholdValue,
    window_kind: row.windowKind as "observations" | "hours", window_value: row.windowValue, enabled: row.enabled,
    created_at: row.createdAt.toISOString(), updated_at: row.updatedAt.toISOString(),
  };
}

function toSentinelAlert(row: typeof schema.sentinelAlerts.$inferSelect) {
  return {
    id: row.id, rule_id: row.ruleId, observation_id: row.observationId, target_kind: row.targetKind as "metric" | "event",
    target_name: row.targetName, observed_value: row.observedValue, baseline_mean: row.baselineMean,
    baseline_standard_deviation: row.baselineStdDev, deviation: row.deviation,
    threshold_mode: row.thresholdMode as "standard_deviation" | "absolute" | "percentage", threshold_value: row.thresholdValue,
    severity: row.severity as "medium" | "high" | "critical", status: row.status as "open" | "acknowledged" | "resolved",
    observed_at: row.observedAt.toISOString(), acknowledged_at: row.acknowledgedAt?.toISOString() ?? null,
    resolved_at: row.resolvedAt?.toISOString() ?? null, created_at: row.createdAt.toISOString(), updated_at: row.updatedAt.toISOString(),
  };
}

function mean(values: number[]) { return values.reduce((sum, value) => sum + value, 0) / values.length; }
function standardDeviation(values: number[], average: number) {
  return Math.sqrt(values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length);
}
function decimalPlaces(value: number) {
  const text = String(value);
  if (text.includes("e-")) return Math.min(3, Number(text.split("e-")[1]) || 0);
  return Math.min(3, text.includes(".") ? text.split(".")[1]!.length : 0);
}
function roundTo(value: number, digits: number) {
  const scale = 10 ** digits;
  return Math.round((value + Number.EPSILON) * scale) / scale;
}

function calculateForecast(metricName: string, observations: NumericObservation[], horizonHours: number) {
  const series = observations.filter((item) => item.kind === "metric" && item.name === metricName).slice(-60);
  const precisionDigits = series.reduce((max, item) => Math.max(max, decimalPlaces(item.value)), 0);
  const base = {
    metric_name: metricName, horizon_hours: horizonHours, observation_count: series.length, precision_digits: precisionDigits,
    window_started_at: series[0]?.at.toISOString() ?? null, window_ended_at: series.at(-1)?.at.toISOString() ?? null,
  };
  const distinctTimes = new Set(series.map((item) => item.at.getTime()));
  if (series.length < 3 || distinctTimes.size < 2) {
    return { ...base, status: "insufficient_data" as const, message: "At least three numeric observations across two or more timestamps are required.", latest_value: series.at(-1)?.value ?? null, direction: "unknown" as const, slope_per_hour: null, fit_quality: null, confidence_score: 0, confidence: "low" as const, projections: [] };
  }
  const origin = series[0]!.at.getTime();
  const xs = series.map((item) => (item.at.getTime() - origin) / 3_600_000);
  const ys = series.map((item) => item.value);
  const xMean = mean(xs); const yMean = mean(ys);
  const denominator = xs.reduce((sum, value) => sum + (value - xMean) ** 2, 0);
  if (denominator === 0) return { ...base, status: "insufficient_data" as const, message: "Observations need distinct timestamps before a trend can be estimated.", latest_value: series.at(-1)!.value, direction: "unknown" as const, slope_per_hour: null, fit_quality: null, confidence_score: 0, confidence: "low" as const, projections: [] };
  const slope = xs.reduce((sum, value, index) => sum + (value - xMean) * (ys[index]! - yMean), 0) / denominator;
  const intercept = yMean - slope * xMean;
  const fitted = xs.map((value) => intercept + slope * value);
  const residual = ys.reduce((sum, value, index) => sum + (value - fitted[index]!) ** 2, 0);
  const totalVariance = ys.reduce((sum, value) => sum + (value - yMean) ** 2, 0);
  const fitQuality = totalVariance === 0 ? 1 : Math.max(0, Math.min(1, 1 - residual / totalVariance));
  const density = Math.min(1, Math.max(0, (series.length - 2) / 10));
  const confidenceScore = Math.round(100 * density * (0.35 + 0.65 * fitQuality));
  const confidence = confidenceScore >= 75 ? "high" as const : confidenceScore >= 45 ? "moderate" as const : "low" as const;
  const elapsedHours = Math.max(1 / 60, xs.at(-1)! - xs[0]!);
  const materialChange = Math.max(10 ** -precisionDigits, Math.abs(yMean) * 0.01);
  const direction = Math.abs(slope * elapsedHours) <= materialChange ? "flat" as const : slope > 0 ? "rising" as const : "falling" as const;
  const latest = series.at(-1)!;
  const projections = [0.25, 0.5, 0.75, 1].map((fraction) => ({
    at: new Date(latest.at.getTime() + horizonHours * fraction * 3_600_000).toISOString(),
    estimated_value: roundTo(latest.value + slope * horizonHours * fraction, precisionDigits),
  }));
  return {
    ...base, status: "ready" as const, message: "Least-squares estimate from recent numeric observations. It is not a guarantee.",
    latest_value: latest.value, direction, slope_per_hour: roundTo(slope, Math.min(5, precisionDigits + 2)),
    fit_quality: roundTo(fitQuality, 2), confidence_score: confidenceScore, confidence, projections,
  };
}

function validIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

const VAULT_SCHEMA_VERSION = 1;
const VAULT_MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const VAULT_PREVIEW_TTL_MS = 30 * 60 * 1000;

const VaultCountSchema = z.record(z.string(), z.number().int().nonnegative());
const VaultValidationErrorSchema = z.object({ table: z.string(), row: z.number().int().nullable(), message: z.string() });
const VaultHistorySchema = z.object({
  id: z.string(), source_file_name: z.string(), mode: z.enum(["merge", "replace"]), counts: VaultCountSchema,
  total_records: z.number().int(), restored_at: z.string(),
});

type VaultMode = "merge" | "replace";
type VaultError = z.infer<typeof VaultValidationErrorSchema>;
type BackupSpec = {
  name: string;
  table: any;
  required: string[];
  dates?: string[];
  nullableDates?: string[];
  numbers?: string[];
  nullableNumbers?: string[];
  booleans?: string[];
  jsonStrings?: string[];
};

const backupSpecs: BackupSpec[] = [
  { name: "events", table: schema.events, required: ["id", "type", "source", "payloadJson", "status", "validationResult", "processingResult", "receivedAt", "validatedAt", "processedAt", "createdAt", "updatedAt"], dates: ["receivedAt", "validatedAt", "processedAt", "createdAt", "updatedAt"], jsonStrings: ["payloadJson"] },
  { name: "event_stages", table: schema.eventStages, required: ["id", "eventId", "stage", "sequence", "status", "message", "occurredAt"], dates: ["occurredAt"], numbers: ["id", "sequence"] },
  { name: "metric_events", table: schema.metricEvents, required: ["id", "type", "source", "level", "message", "payloadJson", "receivedAt", "createdAt"], dates: ["receivedAt", "createdAt"], jsonStrings: ["payloadJson"] },
  { name: "readiness_checks", table: schema.readinessChecks, required: ["id", "name", "category", "status", "notes", "createdAt", "updatedAt"], dates: ["createdAt", "updatedAt"] },
  { name: "soul_checkins", table: schema.soulCheckins, required: ["id", "emotion", "intensity", "category", "exerciseId", "exerciseTitle", "exerciseText", "createdAt"], dates: ["createdAt"], nullableNumbers: ["intensity"] },
  { name: "composer_drafts", table: schema.composerDrafts, required: ["id", "source", "sourceLabel", "tone", "format", "audience", "purpose", "content", "createdAt", "updatedAt"], dates: ["createdAt", "updatedAt"] },
  { name: "team_members", table: schema.teamMembers, required: ["id", "name", "role", "focusArea", "availability", "status", "createdAt", "updatedAt"], dates: ["createdAt", "updatedAt"] },
  { name: "team_notes", table: schema.teamNotes, required: ["id", "author", "body", "createdAt"], dates: ["createdAt"] },
  { name: "team_projects", table: schema.teamProjects, required: ["id", "name", "status", "description", "createdAt", "updatedAt"], dates: ["createdAt", "updatedAt"] },
  { name: "project_members", table: schema.projectMembers, required: ["projectId", "memberId", "linkedAt"], dates: ["linkedAt"] },
  { name: "memory_entries", table: schema.memoryEntries, required: ["id", "title", "body", "tagsJson", "relatedPocket", "createdAt", "updatedAt"], dates: ["createdAt", "updatedAt"], jsonStrings: ["tagsJson"] },
  { name: "brain_messages", table: schema.brainMessages, required: ["id", "role", "kind", "content", "sourcesJson", "consultedEntriesJson", "createdAt"], dates: ["createdAt"], jsonStrings: ["sourcesJson", "consultedEntriesJson"] },
  { name: "dashboard_configurations", table: schema.dashboardConfigurations, required: ["id", "widgetsJson", "updatedAt"], dates: ["updatedAt"], jsonStrings: ["widgetsJson"] },
  { name: "investor_pitches", table: schema.investorPitches, required: ["id", "headline", "problemStatement", "solution", "askAmount", "useOfFundsJson", "createdAt", "updatedAt"], dates: ["createdAt", "updatedAt"], numbers: ["askAmount"], jsonStrings: ["useOfFundsJson"] },
  { name: "traction_entries", table: schema.tractionEntries, required: ["id", "occurredOn", "milestone", "description", "createdAt"], dates: ["createdAt"] },
  { name: "biomarkers", table: schema.biomarkers, required: ["id", "name", "type", "associatedCondition", "evidenceNotes", "status", "createdAt", "updatedAt"], dates: ["createdAt", "updatedAt"] },
  { name: "clinical_simulation_runs", table: schema.clinicalSimulationRuns, required: ["id", "name", "biomarkerId", "cohortSize", "doseMg", "durationDays", "targetKnockdownPercent", "inputsJson", "resultsJson", "createdAt"], dates: ["createdAt"], numbers: ["cohortSize", "doseMg", "durationDays", "targetKnockdownPercent"], jsonStrings: ["inputsJson", "resultsJson"] },
  { name: "molecular_analysis_notes", table: schema.molecularAnalysisNotes, required: ["id", "biomarkerId", "title", "analysisType", "observation", "interpretation", "nextStep", "createdAt", "updatedAt"], dates: ["createdAt", "updatedAt"] },
  { name: "clinical_cases", table: schema.clinicalCases, required: ["id", "label", "symptoms", "observations", "summaryJson", "createdAt"], dates: ["createdAt"], jsonStrings: ["summaryJson"] },
  { name: "pipeline_events", table: schema.pipelineEvents, required: ["id", "project", "eventKind", "status", "durationSeconds", "commitReference", "eventTimestamp", "createdAt"], dates: ["eventTimestamp", "createdAt"], numbers: ["durationSeconds"] },
  { name: "identity_users", table: schema.identityUsers, required: ["id", "name", "role", "createdAt", "updatedAt"], dates: ["createdAt", "updatedAt"] },
  { name: "api_keys", table: schema.apiKeys, required: ["id", "name", "userId", "keyPrefix", "keyHash", "revokedAt", "lastVerifiedAt", "createdAt"], dates: ["createdAt"], nullableDates: ["revokedAt", "lastVerifiedAt"] },
  { name: "workflows", table: schema.workflows, required: ["id", "name", "enabled", "triggerKind", "triggerConfigJson", "lastEvaluatedAt", "lastFiredAt", "lastMetricValue", "createdAt", "updatedAt"], dates: ["createdAt", "updatedAt"], nullableDates: ["lastEvaluatedAt", "lastFiredAt"], nullableNumbers: ["lastMetricValue"], booleans: ["enabled"], jsonStrings: ["triggerConfigJson"] },
  { name: "workflow_actions", table: schema.workflowActions, required: ["id", "workflowId", "sequence", "kind", "configJson", "createdAt"], dates: ["createdAt"], numbers: ["sequence"], jsonStrings: ["configJson"] },
  { name: "workflow_runs", table: schema.workflowRuns, required: ["id", "workflowId", "status", "triggerKind", "triggerSummary", "actionResultsJson", "errorText", "startedAt", "finishedAt"], dates: ["startedAt", "finishedAt"], jsonStrings: ["actionResultsJson"] },
  { name: "sentinel_rules", table: schema.sentinelRules, required: ["id", "targetKind", "targetName", "thresholdMode", "thresholdValue", "windowKind", "windowValue", "enabled", "createdAt", "updatedAt"], dates: ["createdAt", "updatedAt"], numbers: ["thresholdValue", "windowValue"], booleans: ["enabled"] },
  { name: "sentinel_alerts", table: schema.sentinelAlerts, required: ["id", "ruleId", "observationId", "targetKind", "targetName", "observedValue", "baselineMean", "baselineStdDev", "deviation", "thresholdMode", "thresholdValue", "severity", "status", "observedAt", "acknowledgedAt", "resolvedAt", "createdAt", "updatedAt"], dates: ["observedAt", "createdAt", "updatedAt"], nullableDates: ["acknowledgedAt", "resolvedAt"], numbers: ["observedValue", "baselineMean", "baselineStdDev", "deviation", "thresholdValue"] },
];

const backupSpecMap = new Map(backupSpecs.map((spec) => [spec.name, spec]));

function serializeVaultRow(row: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [key, value instanceof Date ? value.toISOString() : value]));
}

function reviveVaultRow(spec: BackupSpec, row: Record<string, unknown>) {
  const restored = { ...row };
  for (const key of spec.dates ?? []) restored[key] = new Date(String(restored[key]));
  for (const key of spec.nullableDates ?? []) restored[key] = restored[key] === null ? null : new Date(String(restored[key]));
  return restored;
}

function validateVaultPackage(value: unknown): { errors: VaultError[]; tables: Record<string, Array<Record<string, unknown>>>; counts: Record<string, number> } {
  const errors: VaultError[] = [];
  const empty = { errors, tables: {}, counts: {} };
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ...empty, errors: [{ table: "package", row: null, message: "Backup must be a JSON object." }] };
  const root = value as Record<string, unknown>;
  if (root.schema_version !== VAULT_SCHEMA_VERSION) errors.push({ table: "package", row: null, message: `Unsupported schema_version. Expected ${VAULT_SCHEMA_VERSION}.` });
  if (typeof root.exported_at !== "string" || Number.isNaN(new Date(root.exported_at).getTime())) errors.push({ table: "package", row: null, message: "exported_at must be a valid ISO timestamp." });
  if (!root.tables || typeof root.tables !== "object" || Array.isArray(root.tables)) {
    errors.push({ table: "package", row: null, message: "tables must be an object containing every supported table." });
    return empty;
  }
  const tables = root.tables as Record<string, unknown>;
  const unknown = Object.keys(tables).filter((name) => !backupSpecMap.has(name));
  for (const name of unknown) errors.push({ table: name, row: null, message: "Unknown table in backup." });
  const normalized: Record<string, Array<Record<string, unknown>>> = {};
  const counts: Record<string, number> = {};
  for (const spec of backupSpecs) {
    const rows = tables[spec.name];
    if (!Array.isArray(rows)) {
      errors.push({ table: spec.name, row: null, message: "Expected an array for this table." });
      normalized[spec.name] = []; counts[spec.name] = 0; continue;
    }
    normalized[spec.name] = [];
    counts[spec.name] = rows.length;
    rows.forEach((candidate, index) => {
      if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) { errors.push({ table: spec.name, row: index + 1, message: "Record must be an object." }); return; }
      const row = candidate as Record<string, unknown>;
      const missing = spec.required.filter((key) => !(key in row));
      if (missing.length) errors.push({ table: spec.name, row: index + 1, message: `Missing required fields: ${missing.join(", ")}.` });
      for (const key of spec.dates ?? []) if (key in row && (typeof row[key] !== "string" || Number.isNaN(new Date(String(row[key])).getTime()))) errors.push({ table: spec.name, row: index + 1, message: `${key} must be a valid ISO timestamp.` });
      for (const key of spec.nullableDates ?? []) if (key in row && row[key] !== null && (typeof row[key] !== "string" || Number.isNaN(new Date(String(row[key])).getTime()))) errors.push({ table: spec.name, row: index + 1, message: `${key} must be null or a valid ISO timestamp.` });
      for (const key of spec.numbers ?? []) if (key in row && (typeof row[key] !== "number" || !Number.isFinite(row[key] as number))) errors.push({ table: spec.name, row: index + 1, message: `${key} must be a finite number.` });
      for (const key of spec.nullableNumbers ?? []) if (key in row && row[key] !== null && (typeof row[key] !== "number" || !Number.isFinite(row[key] as number))) errors.push({ table: spec.name, row: index + 1, message: `${key} must be null or a finite number.` });
      for (const key of spec.booleans ?? []) if (key in row && typeof row[key] !== "boolean") errors.push({ table: spec.name, row: index + 1, message: `${key} must be true or false.` });
      for (const key of spec.jsonStrings ?? []) if (key in row) { if (typeof row[key] !== "string") errors.push({ table: spec.name, row: index + 1, message: `${key} must be a JSON string.` }); else { try { JSON.parse(row[key] as string); } catch { errors.push({ table: spec.name, row: index + 1, message: `${key} contains invalid JSON.` }); } } }
      for (const key of spec.required.filter((item) => !(spec.dates ?? []).includes(item) && !(spec.nullableDates ?? []).includes(item) && !(spec.numbers ?? []).includes(item) && !(spec.nullableNumbers ?? []).includes(item) && !(spec.booleans ?? []).includes(item))) if (key in row && row[key] !== null && typeof row[key] !== "string") errors.push({ table: spec.name, row: index + 1, message: `${key} must be text${key === "relatedPocket" || key === "biomarkerId" ? " or null" : ""}.` });
      normalized[spec.name]!.push(row);
    });
  }
  const relationChecks: Array<[string, string, string, string]> = [
    ["event_stages", "eventId", "events", "id"], ["project_members", "projectId", "team_projects", "id"], ["project_members", "memberId", "team_members", "id"],
    ["clinical_simulation_runs", "biomarkerId", "biomarkers", "id"], ["molecular_analysis_notes", "biomarkerId", "biomarkers", "id"],
    ["api_keys", "userId", "identity_users", "id"], ["workflow_actions", "workflowId", "workflows", "id"], ["workflow_runs", "workflowId", "workflows", "id"], ["sentinel_alerts", "ruleId", "sentinel_rules", "id"],
  ];
  for (const [child, foreignKey, parent, parentKey] of relationChecks) {
    const parentIds = new Set((normalized[parent] ?? []).map((row) => row[parentKey]));
    (normalized[child] ?? []).forEach((row, index) => { const value = row[foreignKey]; if (value !== null && value !== undefined && !parentIds.has(value)) errors.push({ table: child, row: index + 1, message: `${foreignKey} does not reference a ${parent} record in this backup.` }); });
  }
  return { errors: errors.slice(0, 250), tables: normalized, counts };
}

function vaultHistoryRow(row: typeof schema.vaultRestoreHistory.$inferSelect) {
  let counts: Record<string, number> = {};
  try { counts = JSON.parse(row.countsJson) as Record<string, number>; } catch { counts = {}; }
  return { id: row.id, source_file_name: row.sourceFileName, mode: row.mode as VaultMode, counts, total_records: row.totalRecords, restored_at: row.restoredAt.toISOString() };
}

export const Actions = {
  health: defineAction({
    request: z.object({}),
    response: z.object({
      status: z.literal("ok"),
      service: z.literal("seventeen-pockets-core"),
      startedAt: z.string(),
      timestamp: z.string(),
    }),
    async handler() {
      return {
        status: "ok" as const,
        service: "seventeen-pockets-core" as const,
        startedAt: SERVER_STARTED_AT,
        timestamp: new Date().toISOString(),
      };
    },
  }),

  getsystem: defineAction({
    request: z.object({}),
    response: z.object({
      name: z.literal("Seventeen Pockets"),
      version: z.literal("1.0.0"),
      purpose: z.literal("Intelligence and automation foundation"),
      capabilities: z.tuple([
        z.literal("identity"),
        z.literal("projects"),
        z.literal("events"),
        z.literal("metrics"),
        z.literal("workflows"),
        z.literal("validation"),
        z.literal("audit"),
        z.literal("automation"),
      ]),
    }),
    async handler() {
      return {
        name: "Seventeen Pockets" as const,
        version: "1.0.0" as const,
        purpose: "Intelligence and automation foundation" as const,
        capabilities: ["identity", "projects", "events", "metrics", "workflows", "validation", "audit", "automation"] as ["identity", "projects", "events", "metrics", "workflows", "validation", "audit", "automation"],
      };
    },
  }),

  getDashboard: defineAction({
    request: z.object({}),
    response: z.object({
      system: z.object({
        status: z.literal("operational"),
        pocket: z.literal("zero"),
        version: z.literal("1.0.0-prototype"),
        checked_at: z.string(),
      }),
      contract: z.object({
        action: z.literal("submitEvent"),
        required: z.array(z.string()),
        optional: z.array(z.string()),
        pipeline: z.array(z.string()),
      }),
      metrics: z.object({ total_events: z.number().int(), processed_events: z.number().int() }),
      events: z.array(EventSummarySchema),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const [totals, events] = await Promise.all([
        db.select({ value: count() }).from(schema.events),
        db.select().from(schema.events).orderBy(desc(schema.events.createdAt)).limit(30),
      ]);
      const total = totals[0]?.value ?? 0;
      return {
        system: {
          status: "operational" as const,
          pocket: "zero" as const,
          version: "1.0.0-prototype" as const,
          checked_at: new Date().toISOString(),
        },
        contract: {
          action: "submitEvent" as const,
          required: ["type", "source"],
          optional: ["payload"],
          pipeline: ["receive", "validate", "process"],
        },
        metrics: { total_events: total, processed_events: total },
        events: events.map(toSummary),
      };
    },
  }),

  submitEvent: defineAction({
    request: z.object({ type: z.string(), source: z.string(), payload_json: z.string().optional().default("{}") }),
    response: z.discriminatedUnion("ok", [
      z.object({
        ok: z.literal(false),
        errors: z.object({
          type: z.string().optional(),
          source: z.string().optional(),
          payload_json: z.string().optional(),
        }),
      }),
      z.object({ ok: z.literal(true), event: EventDetailSchema }),
    ]),
    async handler(ctx, args) {
      const errors: Record<string, string> = {};
      const type = args.type.trim();
      const source = args.source.trim();
      if (!type) errors.type = "Event type is required.";
      else if (!/^[a-z][a-z0-9]*(?:\.[a-z][a-z0-9_-]*)+$/.test(type)) errors.type = "Use a dotted lowercase type, such as system.pulse.";
      if (!source) errors.source = "Source is required.";
      else if (source.length > 80) errors.source = "Keep the source under 80 characters.";
      const payload = validateJsonObject(args.payload_json, errors);
      if (Object.keys(errors).length > 0) return { ok: false as const, errors };

      const db = ctx.db<typeof schema>();
      const id = crypto.randomUUID();
      const receivedAt = new Date();
      const validatedAt = new Date(receivedAt.getTime() + 1);
      const processedAt = new Date(receivedAt.getTime() + 2);
      const payloadJson = JSON.stringify(payload);
      const validationResult = "Schema accepted: type, source, and payload are valid.";
      const processingResult = `Pocket Zero processed ${type} from ${source}.`;

      await db.insert(schema.events).values({
        id, type, source, payloadJson, status: "processed", validationResult, processingResult,
        receivedAt, validatedAt, processedAt, createdAt: receivedAt, updatedAt: processedAt,
      });
      await db.insert(schema.eventStages).values([
        { eventId: id, stage: "receive", sequence: 1, status: "complete", message: "Envelope accepted by Pocket Zero.", occurredAt: receivedAt },
        { eventId: id, stage: "validate", sequence: 2, status: "complete", message: validationResult, occurredAt: validatedAt },
        { eventId: id, stage: "process", sequence: 3, status: "complete", message: processingResult, occurredAt: processedAt },
      ]);

      ctx.invalidateQueries();
      const event = await loadDetail(db as never, id);
      if (!event) throw new Error("Pocket Zero could not load the processed event.");
      return { ok: true as const, event };
    },
  }),

  getEvent: defineAction({
    request: z.object({ id: z.string().min(1) }),
    response: z.object({ event: EventDetailSchema.nullable() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      return { event: await loadDetail(db as never, args.id) };
    },
  }),

  getMetrics: defineAction({
    request: z.object({}),
    response: z.object({
      checked_at: z.string(),
      health: z.enum(["healthy", "degraded", "critical", "unknown"]),
      health_score: z.number().int().nullable(),
      recent_window: z.number().int(),
      counts: z.object({ total: z.number().int(), healthy: z.number().int(), warning: z.number().int(), critical: z.number().int() }),
      volume: z.array(z.object({
        interval_start: z.string(),
        label: z.string(),
        total: z.number().int(),
        healthy: z.number().int(),
        warning: z.number().int(),
        critical: z.number().int(),
      })),
      events: z.array(MetricEventSchema),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.metricEvents).orderBy(desc(schema.metricEvents.receivedAt)).limit(500);
      const recent = rows.slice(0, 100);
      const counts = {
        total: rows.length,
        healthy: rows.filter((row) => row.level === "healthy").length,
        warning: rows.filter((row) => row.level === "warning").length,
        critical: rows.filter((row) => row.level === "critical").length,
      };
      const recentCounts = {
        healthy: recent.filter((row) => row.level === "healthy").length,
        warning: recent.filter((row) => row.level === "warning").length,
        critical: recent.filter((row) => row.level === "critical").length,
      };
      const healthScore = recent.length === 0 ? null : Math.round((recentCounts.healthy * 100 + recentCounts.warning * 60) / recent.length);
      const health: "healthy" | "degraded" | "critical" | "unknown" = recent.length === 0 ? "unknown" : recentCounts.critical > 0 ? "critical" : recentCounts.warning > 0 ? "degraded" : "healthy";

      const now = Date.now();
      const intervalMs = 4 * 60 * 60 * 1000;
      const start = Math.floor((now - 24 * 60 * 60 * 1000) / intervalMs) * intervalMs;
      const volume = recent.length === 0 ? [] : Array.from({ length: 7 }, (_, index) => {
        const intervalStart = start + index * intervalMs;
        const intervalEnd = intervalStart + intervalMs;
        const inBucket = rows.filter((row) => row.receivedAt.getTime() >= intervalStart && row.receivedAt.getTime() < intervalEnd);
        return {
          interval_start: new Date(intervalStart).toISOString(),
          label: new Date(intervalStart).toISOString(),
          total: inBucket.length,
          healthy: inBucket.filter((row) => row.level === "healthy").length,
          warning: inBucket.filter((row) => row.level === "warning").length,
          critical: inBucket.filter((row) => row.level === "critical").length,
        };
      });

      return {
        checked_at: new Date(now).toISOString(), health, health_score: healthScore, recent_window: recent.length, counts,
        volume,
        events: rows.slice(0, 30).map((row) => ({
          id: row.id,
          type: row.type,
          source: row.source,
          level: row.level as "healthy" | "warning" | "critical",
          message: row.message,
          payload: safePayload(row.payloadJson),
          received_at: row.receivedAt.toISOString(),
        })),
      };
    },
  }),

  submitMetricEvent: defineAction({
    request: z.object({ type: z.string(), source: z.string(), level: z.enum(["healthy", "warning", "critical"]), message: z.string(), payload_json: z.string() }),
    response: z.discriminatedUnion("ok", [
      z.object({ ok: z.literal(false), errors: z.record(z.string(), z.string()) }),
      z.object({ ok: z.literal(true), event: MetricEventSchema }),
    ]),
    async handler(ctx, args) {
      const errors: Record<string, string> = {};
      const type = args.type.trim();
      const source = args.source.trim();
      const message = args.message.trim();
      if (!type) errors.type = "Event type is required.";
      else if (type.length > 100) errors.type = "Keep the event type under 100 characters.";
      if (!source) errors.source = "Source is required.";
      else if (source.length > 80) errors.source = "Keep the source under 80 characters.";
      if (!message) errors.message = "Message is required.";
      else if (message.length > 500) errors.message = "Keep the message under 500 characters.";
      const payload = validateJsonObject(args.payload_json, errors);
      if (Object.keys(errors).length > 0) return { ok: false as const, errors };

      const id = crypto.randomUUID();
      const receivedAt = new Date();
      const db = ctx.db<typeof schema>();
      await db.insert(schema.metricEvents).values({ id, type, source, level: args.level, message, payloadJson: JSON.stringify(payload), receivedAt, createdAt: receivedAt });
      ctx.invalidateQueries();
      return { ok: true as const, event: { id, type, source, level: args.level, message, payload, received_at: receivedAt.toISOString() } };
    },
  }),

  getSentinel: defineAction({
    request: z.object({}),
    response: z.object({
      evaluated_at: z.string(),
      counts: z.object({ rules: z.number().int(), enabled: z.number().int(), open: z.number().int(), acknowledged: z.number().int(), resolved: z.number().int() }),
      targets: z.array(z.object({ kind: SentinelTargetKindSchema, name: z.string(), observations: z.number().int() })),
      rules: z.array(SentinelRuleSchema), alerts: z.array(SentinelAlertSchema),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const [rules, alerts, observations] = await Promise.all([
        db.select().from(schema.sentinelRules).orderBy(desc(schema.sentinelRules.updatedAt)).limit(500),
        db.select().from(schema.sentinelAlerts).orderBy(desc(schema.sentinelAlerts.observedAt)).limit(1000),
        loadNumericObservations(db as never),
      ]);
      const targetMap = new Map<string, { kind: "metric" | "event"; name: string; observations: number }>();
      for (const observation of observations) {
        const key = `${observation.kind}:${observation.name}`;
        const current = targetMap.get(key) ?? { kind: observation.kind, name: observation.name, observations: 0 };
        current.observations += 1; targetMap.set(key, current);
      }
      return {
        evaluated_at: new Date().toISOString(),
        counts: { rules: rules.length, enabled: rules.filter((rule) => rule.enabled).length, open: alerts.filter((alert) => alert.status === "open").length, acknowledged: alerts.filter((alert) => alert.status === "acknowledged").length, resolved: alerts.filter((alert) => alert.status === "resolved").length },
        targets: Array.from(targetMap.values()).sort((a, b) => a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name)),
        rules: rules.map(toSentinelRule), alerts: alerts.map(toSentinelAlert),
      };
    },
  }),

  createSentinelRule: defineAction({
    request: z.object({ target_kind: SentinelTargetKindSchema, target_name: z.string(), threshold_mode: SentinelThresholdModeSchema, threshold_value: z.number(), window_kind: SentinelWindowKindSchema, window_value: z.number(), enabled: z.boolean() }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), errors: z.record(z.string(), z.string()) }), z.object({ ok: z.literal(true), rule: SentinelRuleSchema })]),
    async handler(ctx, args) {
      const targetName = args.target_name.trim() || "*"; const errors: Record<string, string> = {};
      if (targetName.length > 120) errors.target_name = "Keep the target name under 120 characters.";
      if (!Number.isFinite(args.threshold_value) || args.threshold_value <= 0 || args.threshold_value > 1_000_000) errors.threshold_value = "Enter a threshold greater than 0 and no more than 1,000,000.";
      if (!Number.isSafeInteger(args.window_value) || args.window_value < 3 || args.window_value > (args.window_kind === "observations" ? 500 : 8760)) errors.window_value = args.window_kind === "observations" ? "Use 3–500 observations." : "Use 3–8,760 hours.";
      if (Object.keys(errors).length) return { ok: false as const, errors };
      const now = new Date(); const row = { id: crypto.randomUUID(), targetKind: args.target_kind, targetName, thresholdMode: args.threshold_mode, thresholdValue: args.threshold_value, windowKind: args.window_kind, windowValue: args.window_value, enabled: args.enabled, createdAt: now, updatedAt: now };
      const db = ctx.db<typeof schema>(); await db.insert(schema.sentinelRules).values(row); ctx.invalidateQueries();
      return { ok: true as const, rule: toSentinelRule(row) };
    },
  }),

  setSentinelRuleEnabled: defineAction({
    request: z.object({ id: z.string().min(1), enabled: z.boolean() }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), error: z.string() }), z.object({ ok: z.literal(true), rule: SentinelRuleSchema })]),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.sentinelRules).where(eq(schema.sentinelRules.id, args.id)).limit(1);
      if (!rows[0]) return { ok: false as const, error: "That rule no longer exists." };
      const updatedAt = new Date(); const row = { ...rows[0], enabled: args.enabled, updatedAt };
      await db.update(schema.sentinelRules).set({ enabled: args.enabled, updatedAt }).where(eq(schema.sentinelRules.id, args.id)); ctx.invalidateQueries();
      return { ok: true as const, rule: toSentinelRule(row) };
    },
  }),

  evaluateSentinel: defineAction({
    request: z.object({}),
    response: z.object({ evaluated_at: z.string(), rules_evaluated: z.number().int(), observations_evaluated: z.number().int(), alerts_created: z.number().int(), insufficient_baselines: z.number().int(), alerts: z.array(SentinelAlertSchema) }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>(); const now = new Date();
      const [rules, observations, existingAlerts] = await Promise.all([
        db.select().from(schema.sentinelRules).where(eq(schema.sentinelRules.enabled, true)).orderBy(asc(schema.sentinelRules.createdAt)).limit(500),
        loadNumericObservations(db as never),
        db.select().from(schema.sentinelAlerts).limit(5000),
      ]);
      const existing = new Set(existingAlerts.map((alert: typeof schema.sentinelAlerts.$inferSelect) => `${alert.ruleId}:${alert.observationId}`));
      const created: Array<typeof schema.sentinelAlerts.$inferSelect> = []; let evaluated = 0; let insufficient = 0;
      for (const rule of rules) {
        const names = rule.targetName === "*" ? Array.from(new Set(observations.filter((item) => item.kind === rule.targetKind).map((item) => item.name))) : [rule.targetName];
        for (const name of names) {
          const series = observations.filter((item) => item.kind === rule.targetKind && item.name === name);
          for (let index = 0; index < series.length; index += 1) {
            const observation = series[index]!;
            if (existing.has(`${rule.id}:${observation.id}`)) continue;
            const preceding = series.slice(0, index);
            const baseline = rule.windowKind === "observations" ? preceding.slice(-rule.windowValue) : preceding.filter((item) => item.at.getTime() >= observation.at.getTime() - rule.windowValue * 3_600_000);
            if (baseline.length < 3) { insufficient += 1; continue; }
            evaluated += 1;
            const values = baseline.map((item) => item.value); const average = mean(values); const stddev = standardDeviation(values, average); const difference = Math.abs(observation.value - average);
            let deviation: number | null = null;
            if (rule.thresholdMode === "standard_deviation") deviation = difference / Math.max(stddev, Math.abs(average) * 1e-9, 1e-9);
            else if (rule.thresholdMode === "absolute") deviation = difference;
            else if (average !== 0) deviation = difference / Math.abs(average) * 100;
            if (deviation === null || deviation <= rule.thresholdValue) continue;
            const ratio = deviation / rule.thresholdValue; const severity = ratio >= 3 ? "critical" as const : ratio >= 1.5 ? "high" as const : "medium" as const;
            const row = { id: crypto.randomUUID(), ruleId: rule.id, observationId: observation.id, targetKind: observation.kind, targetName: observation.name, observedValue: observation.value, baselineMean: average, baselineStdDev: stddev, deviation, thresholdMode: rule.thresholdMode, thresholdValue: rule.thresholdValue, severity, status: "open", observedAt: observation.at, acknowledgedAt: null, resolvedAt: null, createdAt: now, updatedAt: now };
            await db.insert(schema.sentinelAlerts).values(row); created.push(row); existing.add(`${rule.id}:${observation.id}`);
          }
        }
      }
      ctx.invalidateQueries();
      return { evaluated_at: now.toISOString(), rules_evaluated: rules.length, observations_evaluated: evaluated, alerts_created: created.length, insufficient_baselines: insufficient, alerts: created.map(toSentinelAlert) };
    },
  }),

  updateSentinelAlert: defineAction({
    request: z.object({ id: z.string().min(1), status: z.enum(["acknowledged", "resolved"]) }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), error: z.string() }), z.object({ ok: z.literal(true), alert: SentinelAlertSchema })]),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.sentinelAlerts).where(eq(schema.sentinelAlerts.id, args.id)).limit(1);
      if (!rows[0]) return { ok: false as const, error: "That alert no longer exists." };
      const now = new Date(); const acknowledgedAt = args.status === "acknowledged" ? (rows[0].acknowledgedAt ?? now) : rows[0].acknowledgedAt; const resolvedAt = args.status === "resolved" ? now : null;
      const row = { ...rows[0], status: args.status, acknowledgedAt, resolvedAt, updatedAt: now };
      await db.update(schema.sentinelAlerts).set({ status: args.status, acknowledgedAt, resolvedAt, updatedAt: now }).where(eq(schema.sentinelAlerts.id, args.id)); ctx.invalidateQueries();
      return { ok: true as const, alert: toSentinelAlert(row) };
    },
  }),

  getForecast: defineAction({
    request: z.object({ metric_name: z.string().optional().default(""), horizon_hours: z.union([z.literal(1), z.literal(6), z.literal(24), z.literal(168)]).optional().default(24) }),
    response: z.object({ calculated_at: z.string(), available_metrics: z.array(z.object({ name: z.string(), observations: z.number().int(), latest_at: z.string() })), forecast: ForecastResultSchema.nullable() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>(); const observations = await loadNumericObservations(db as never);
      const metrics = observations.filter((item) => item.kind === "metric"); const names = Array.from(new Set(metrics.map((item) => item.name)));
      const availableMetrics = names.map((name) => { const series = metrics.filter((item) => item.name === name); return { name, observations: series.length, latest_at: series.at(-1)!.at.toISOString() }; }).sort((a, b) => a.name.localeCompare(b.name));
      const requested = args.metric_name.trim(); const selected = requested && names.includes(requested) ? requested : requested ? "" : (names[0] ?? "");
      return { calculated_at: new Date().toISOString(), available_metrics: availableMetrics, forecast: selected ? calculateForecast(selected, observations, args.horizon_hours) : null };
    },
  }),

  getAuditor: defineAction({
    request: z.object({}),
    response: z.object({
      calculated_at: z.string(),
      score: z.number().int().nullable(),
      counts: z.object({ total: z.number().int(), pass: z.number().int(), fail: z.number().int(), pending: z.number().int() }),
      gaps: z.array(z.object({
        category: z.string(),
        failed: z.number().int(),
        pending: z.number().int(),
        items: z.array(z.object({ id: z.string(), name: z.string(), status: z.enum(["fail", "pending"]), needed: z.string() })),
      })),
      checks: z.array(ReadinessCheckSchema),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.readinessChecks).orderBy(desc(schema.readinessChecks.updatedAt)).limit(500);
      const pass = rows.filter((row) => row.status === "pass").length;
      const fail = rows.filter((row) => row.status === "fail").length;
      const pending = rows.filter((row) => row.status === "pending").length;
      const gapMap = new Map<string, { category: string; failed: number; pending: number; items: Array<{ id: string; name: string; status: "fail" | "pending"; needed: string }> }>();
      for (const row of rows) {
        if (row.status === "pass") continue;
        const current = gapMap.get(row.category) ?? { category: row.category, failed: 0, pending: 0, items: [] };
        if (row.status === "fail") current.failed += 1;
        else current.pending += 1;
        current.items.push({
          id: row.id,
          name: row.name,
          status: row.status as "fail" | "pending",
          needed: row.notes ? row.notes : row.status === "fail" ? `Resolve and re-run ${row.name}.` : `Complete and verify ${row.name}.`,
        });
        gapMap.set(row.category, current);
      }
      return {
        calculated_at: new Date().toISOString(),
        score: rows.length === 0 ? null : Math.round((pass / rows.length) * 100),
        counts: { total: rows.length, pass, fail, pending },
        gaps: Array.from(gapMap.values()).sort((a, b) => a.category.localeCompare(b.category)),
        checks: rows.map((row) => ({
          id: row.id,
          name: row.name,
          category: row.category,
          status: row.status as "pass" | "fail" | "pending",
          notes: row.notes,
          created_at: row.createdAt.toISOString(),
          updated_at: row.updatedAt.toISOString(),
        })),
      };
    },
  }),

  submitReadinessCheck: defineAction({
    request: z.object({ name: z.string(), category: z.string(), status: z.enum(["pass", "fail", "pending"]), notes: z.string() }),
    response: z.discriminatedUnion("ok", [
      z.object({ ok: z.literal(false), errors: z.record(z.string(), z.string()) }),
      z.object({ ok: z.literal(true), check: ReadinessCheckSchema }),
    ]),
    async handler(ctx, args) {
      const errors: Record<string, string> = {};
      const name = args.name.trim();
      const category = args.category.trim();
      const notes = args.notes.trim();
      if (!name) errors.name = "Check name is required.";
      else if (name.length > 140) errors.name = "Keep the check name under 140 characters.";
      if (!category) errors.category = "Category is required.";
      else if (category.length > 80) errors.category = "Keep the category under 80 characters.";
      if (notes.length > 2_000) errors.notes = "Keep notes under 2,000 characters.";
      if (Object.keys(errors).length > 0) return { ok: false as const, errors };

      const id = crypto.randomUUID();
      const now = new Date();
      const db = ctx.db<typeof schema>();
      await db.insert(schema.readinessChecks).values({ id, name, category, status: args.status, notes, createdAt: now, updatedAt: now });
      ctx.invalidateQueries();
      return { ok: true as const, check: { id, name, category, status: args.status, notes, created_at: now.toISOString(), updated_at: now.toISOString() } };
    },
  }),

  getSoul: defineAction({
    request: z.object({}),
    response: z.object({
      exercises: z.array(z.object({ id: z.string(), category: z.enum(["breathing", "sensory", "journaling", "movement"]), title: z.string(), minutes: z.number().int(), text: z.string() })),
      history: z.array(SoulCheckinSchema),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.soulCheckins).orderBy(desc(schema.soulCheckins.createdAt)).limit(50);
      return { exercises: groundingExercises.map((item) => ({ ...item })), history: rows.map(toSoulCheckin) };
    },
  }),

  submitSoulCheckin: defineAction({
    request: z.object({ emotion: z.string(), intensity: z.number().int().min(1).max(10).nullable(), category: z.enum(["breathing", "sensory", "journaling", "movement"]) }),
    response: z.discriminatedUnion("ok", [
      z.object({ ok: z.literal(false), errors: z.record(z.string(), z.string()) }),
      z.object({ ok: z.literal(true), checkin: SoulCheckinSchema }),
    ]),
    async handler(ctx, args) {
      const emotion = args.emotion.trim();
      if (!emotion) return { ok: false as const, errors: { emotion: "Choose the emotion that feels closest." } as Record<string, string> };
      const options = groundingExercises.filter((item) => item.category === args.category);
      const emotionWeight = Array.from(emotion).reduce((total, char) => total + char.charCodeAt(0), 0);
      const exercise = options[emotionWeight % options.length];
      if (!exercise) return { ok: false as const, errors: { category: "Choose a grounding category." } as Record<string, string> };
      const id = crypto.randomUUID();
      const createdAt = new Date();
      const db = ctx.db<typeof schema>();
      await db.insert(schema.soulCheckins).values({ id, emotion, intensity: args.intensity, category: args.category, exerciseId: exercise.id, exerciseTitle: exercise.title, exerciseText: exercise.text, createdAt });
      ctx.invalidateQueries();
      const row = { id, emotion, intensity: args.intensity, category: args.category, exerciseId: exercise.id, exerciseTitle: exercise.title, exerciseText: exercise.text, createdAt };
      return { ok: true as const, checkin: toSoulCheckin(row) };
    },
  }),

  getComposer: defineAction({
    request: z.object({}),
    response: z.object({
      sources: z.array(z.object({ key: z.enum(["auditor", "metrics", "soul"]), label: z.string(), available: z.boolean(), summary: z.string() })),
      drafts: z.array(ComposerDraftSchema),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const [sources, rows] = await Promise.all([
        loadComposerSources(db as never),
        db.select().from(schema.composerDrafts).orderBy(desc(schema.composerDrafts.updatedAt)).limit(50),
      ]);
      return { sources, drafts: rows.map(toComposerDraft) };
    },
  }),

  generateComposition: defineAction({
    request: z.object({ source: z.enum(["auditor", "metrics", "soul"]), tone: z.enum(["professional", "empathetic", "urgent"]), format: z.enum(["notification", "email", "emotional_email"]), audience: z.string(), purpose: z.string() }),
    response: z.discriminatedUnion("ok", [
      z.object({ ok: z.literal(false), errors: z.record(z.string(), z.string()) }),
      z.object({ ok: z.literal(true), preview: z.object({ source: z.enum(["auditor", "metrics", "soul"]), source_label: z.string(), tone: z.enum(["professional", "empathetic", "urgent"]), format: z.enum(["notification", "email", "emotional_email"]), audience: z.string(), purpose: z.string(), content: z.string() }) }),
    ]),
    async handler(ctx, args) {
      const audience = args.audience.trim();
      const purpose = args.purpose.trim();
      const errors: Record<string, string> = {};
      if (!audience) errors.audience = "Add a recipient or audience.";
      else if (audience.length > 100) errors.audience = "Keep the audience under 100 characters.";
      if (!purpose) errors.purpose = "Describe the action or outcome you want.";
      else if (purpose.length > 500) errors.purpose = "Keep the purpose under 500 characters.";
      const db = ctx.db<typeof schema>();
      const sources = await loadComposerSources(db as never);
      const source = sources.find((item) => item.key === args.source);
      if (!source?.available) errors.source = source?.summary ?? "That pocket has no output yet.";
      if (Object.keys(errors).length) return { ok: false as const, errors };
      return { ok: true as const, preview: { source: args.source, source_label: source!.label, tone: args.tone, format: args.format, audience, purpose, content: composeText(source!.label, source!.summary, args.tone, args.format, audience, purpose) } };
    },
  }),

  saveComposerDraft: defineAction({
    request: z.object({ source: z.enum(["auditor", "metrics", "soul"]), source_label: z.string(), tone: z.enum(["professional", "empathetic", "urgent"]), format: z.enum(["notification", "email", "emotional_email"]), audience: z.string(), purpose: z.string(), content: z.string() }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), error: z.string() }), z.object({ ok: z.literal(true), draft: ComposerDraftSchema })]),
    async handler(ctx, args) {
      const content = args.content.trim();
      if (!content) return { ok: false as const, error: "Generate or write content before saving." };
      if (content.length > 10_000) return { ok: false as const, error: "Keep the draft under 10,000 characters." };
      const id = crypto.randomUUID();
      const now = new Date();
      const db = ctx.db<typeof schema>();
      const row = { id, source: args.source, sourceLabel: args.source_label, tone: args.tone, format: args.format, audience: args.audience.trim(), purpose: args.purpose.trim(), content, createdAt: now, updatedAt: now };
      await db.insert(schema.composerDrafts).values(row);
      ctx.invalidateQueries();
      return { ok: true as const, draft: toComposerDraft(row) };
    },
  }),

  getTeam: defineAction({
    request: z.object({}),
    response: z.object({ members: z.array(TeamMemberSchema), notes: z.array(TeamNoteSchema), projects: z.array(TeamProjectSchema) }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const [members, notes, projects] = await Promise.all([
        db.select().from(schema.teamMembers).orderBy(desc(schema.teamMembers.updatedAt)).limit(100),
        db.select().from(schema.teamNotes).orderBy(desc(schema.teamNotes.createdAt)).limit(100),
        loadTeamProjects(db as never),
      ]);
      return { members: members.map(toTeamMember), notes: notes.map(toTeamNote), projects };
    },
  }),

  addTeamMember: defineAction({
    request: z.object({ name: z.string(), role: z.string(), focus_area: z.string(), availability: z.enum(["available", "limited", "unavailable"]), status: z.enum(["active", "away", "offline"]) }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), errors: z.record(z.string(), z.string()) }), z.object({ ok: z.literal(true), member: TeamMemberSchema })]),
    async handler(ctx, args) {
      const name = args.name.trim(); const role = args.role.trim(); const focusArea = args.focus_area.trim();
      const errors: Record<string, string> = {};
      if (!name) errors.name = "Member name is required."; else if (name.length > 100) errors.name = "Keep the name under 100 characters.";
      if (!role) errors.role = "Role is required."; else if (role.length > 100) errors.role = "Keep the role under 100 characters.";
      if (!focusArea) errors.focus_area = "Focus area is required."; else if (focusArea.length > 160) errors.focus_area = "Keep the focus area under 160 characters.";
      if (Object.keys(errors).length) return { ok: false as const, errors };
      const id = crypto.randomUUID(); const now = new Date(); const db = ctx.db<typeof schema>();
      const row = { id, name, role, focusArea, availability: args.availability, status: args.status, createdAt: now, updatedAt: now };
      await db.insert(schema.teamMembers).values(row); ctx.invalidateQueries();
      return { ok: true as const, member: toTeamMember(row) };
    },
  }),

  updateTeamMember: defineAction({
    request: z.object({ id: z.string().min(1), role: z.string(), focus_area: z.string(), availability: z.enum(["available", "limited", "unavailable"]), status: z.enum(["active", "away", "offline"]) }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), errors: z.record(z.string(), z.string()) }), z.object({ ok: z.literal(true), member: TeamMemberSchema })]),
    async handler(ctx, args) {
      const role = args.role.trim(); const focusArea = args.focus_area.trim(); const errors: Record<string, string> = {};
      if (!role) errors.role = "Role is required."; else if (role.length > 100) errors.role = "Keep the role under 100 characters.";
      if (!focusArea) errors.focus_area = "Focus area is required."; else if (focusArea.length > 160) errors.focus_area = "Keep the focus area under 160 characters.";
      if (Object.keys(errors).length) return { ok: false as const, errors };
      const db = ctx.db<typeof schema>(); const found = await db.select().from(schema.teamMembers).where(eq(schema.teamMembers.id, args.id)).limit(1);
      if (!found[0]) return { ok: false as const, errors: { id: "That team member no longer exists." } };
      const updatedAt = new Date();
      await db.update(schema.teamMembers).set({ role, focusArea, availability: args.availability, status: args.status, updatedAt }).where(eq(schema.teamMembers.id, args.id));
      ctx.invalidateQueries();
      return { ok: true as const, member: toTeamMember({ ...found[0], role, focusArea, availability: args.availability, status: args.status, updatedAt }) };
    },
  }),

  postTeamNote: defineAction({
    request: z.object({ author: z.string(), body: z.string() }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), errors: z.record(z.string(), z.string()) }), z.object({ ok: z.literal(true), note: TeamNoteSchema })]),
    async handler(ctx, args) {
      const author = args.author.trim(); const body = args.body.trim(); const errors: Record<string, string> = {};
      if (!author) errors.author = "Author is required."; else if (author.length > 100) errors.author = "Keep the author under 100 characters.";
      if (!body) errors.body = "Write an update before posting."; else if (body.length > 2_000) errors.body = "Keep updates under 2,000 characters.";
      if (Object.keys(errors).length) return { ok: false as const, errors };
      const id = crypto.randomUUID(); const createdAt = new Date(); const db = ctx.db<typeof schema>();
      const row = { id, author, body, createdAt }; await db.insert(schema.teamNotes).values(row); ctx.invalidateQueries();
      return { ok: true as const, note: toTeamNote(row) };
    },
  }),

  createProject: defineAction({
    request: z.object({ name: z.string(), status: ProjectStatusSchema, description: z.string(), member_ids: z.array(z.string()), api_key: z.string().optional() }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), errors: z.record(z.string(), z.string()) }), z.object({ ok: z.literal(true), project: TeamProjectSchema })]),
    async handler(ctx, args) {
      await enforceOptionalApiWrite(ctx, args);
      const name = args.name.trim(); const description = args.description.trim(); const errors: Record<string, string> = {};
      if (!name) errors.name = "Project name is required."; else if (name.length > 140) errors.name = "Keep the name under 140 characters.";
      if (description.length > 3_000) errors.description = "Keep the description under 3,000 characters.";
      const db = ctx.db<typeof schema>();
      const memberIds = [...new Set(args.member_ids)];
      if (memberIds.length) {
        const members = await db.select().from(schema.teamMembers).limit(500);
        const known = new Set(members.map((member) => member.id));
        if (memberIds.some((id) => !known.has(id))) errors.member_ids = "Choose members from the current roster.";
      }
      if (Object.keys(errors).length) return { ok: false as const, errors };
      const now = new Date(); const row = { id: crypto.randomUUID(), name, status: args.status, description, createdAt: now, updatedAt: now };
      await db.insert(schema.teamProjects).values(row);
      if (memberIds.length) await db.insert(schema.projectMembers).values(memberIds.map((memberId) => ({ projectId: row.id, memberId, linkedAt: now })));
      ctx.invalidateQueries();
      const project = (await loadTeamProjects(db as never)).find((item) => item.id === row.id)!;
      return { ok: true as const, project };
    },
  }),

  updateProjectStatus: defineAction({
    request: z.object({ id: z.string().min(1), status: ProjectStatusSchema, api_key: z.string().optional() }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), error: z.string() }), z.object({ ok: z.literal(true), project: TeamProjectSchema })]),
    async handler(ctx, args) {
      await enforceOptionalApiWrite(ctx, args);
      const db = ctx.db<typeof schema>(); const found = await db.select().from(schema.teamProjects).where(eq(schema.teamProjects.id, args.id)).limit(1);
      if (!found[0]) return { ok: false as const, error: "That project no longer exists." };
      await db.update(schema.teamProjects).set({ status: args.status, updatedAt: new Date() }).where(eq(schema.teamProjects.id, args.id));
      ctx.invalidateQueries();
      return { ok: true as const, project: (await loadTeamProjects(db as never)).find((item) => item.id === args.id)! };
    },
  }),

  linkProjectMember: defineAction({
    request: z.object({ project_id: z.string().min(1), member_id: z.string().min(1), api_key: z.string().optional() }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), error: z.string() }), z.object({ ok: z.literal(true), project: TeamProjectSchema })]),
    async handler(ctx, args) {
      await enforceOptionalApiWrite(ctx, args);
      const db = ctx.db<typeof schema>();
      const [projects, members] = await Promise.all([db.select().from(schema.teamProjects).where(eq(schema.teamProjects.id, args.project_id)).limit(1), db.select().from(schema.teamMembers).where(eq(schema.teamMembers.id, args.member_id)).limit(1)]);
      if (!projects[0]) return { ok: false as const, error: "That project no longer exists." };
      if (!members[0]) return { ok: false as const, error: "That team member no longer exists." };
      const existing = await db.select().from(schema.projectMembers).where(and(eq(schema.projectMembers.projectId, args.project_id), eq(schema.projectMembers.memberId, args.member_id))).limit(1);
      if (!existing[0]) await db.insert(schema.projectMembers).values({ projectId: args.project_id, memberId: args.member_id, linkedAt: new Date() });
      await db.update(schema.teamProjects).set({ updatedAt: new Date() }).where(eq(schema.teamProjects.id, args.project_id));
      ctx.invalidateQueries();
      return { ok: true as const, project: (await loadTeamProjects(db as never)).find((item) => item.id === args.project_id)! };
    },
  }),

  unlinkProjectMember: defineAction({
    request: z.object({ project_id: z.string().min(1), member_id: z.string().min(1), api_key: z.string().optional() }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), error: z.string() }), z.object({ ok: z.literal(true), project: TeamProjectSchema })]),
    async handler(ctx, args) {
      await enforceOptionalApiWrite(ctx, args);
      const db = ctx.db<typeof schema>(); const found = await db.select().from(schema.teamProjects).where(eq(schema.teamProjects.id, args.project_id)).limit(1);
      if (!found[0]) return { ok: false as const, error: "That project no longer exists." };
      await db.delete(schema.projectMembers).where(and(eq(schema.projectMembers.projectId, args.project_id), eq(schema.projectMembers.memberId, args.member_id)));
      await db.update(schema.teamProjects).set({ updatedAt: new Date() }).where(eq(schema.teamProjects.id, args.project_id));
      ctx.invalidateQueries();
      return { ok: true as const, project: (await loadTeamProjects(db as never)).find((item) => item.id === args.project_id)! };
    },
  }),

  getIdentity: defineAction({
    request: z.object({}),
    response: z.object({ users: z.array(IdentityUserSchema), keys: z.array(ApiKeySchema) }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const [users, keys] = await Promise.all([db.select().from(schema.identityUsers).orderBy(desc(schema.identityUsers.updatedAt)).limit(300), loadIdentityKeys(db as never)]);
      return { users: users.map(toIdentityUser), keys };
    },
  }),

  createIdentityUser: defineAction({
    request: z.object({ name: z.string(), role: IdentityRoleSchema, api_key: z.string().optional() }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), errors: z.record(z.string(), z.string()) }), z.object({ ok: z.literal(true), user: IdentityUserSchema })]),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const existingUsers = await db.select({ value: count() }).from(schema.identityUsers);
      const errors: Record<string, string> = {};
      if ((existingUsers[0]?.value ?? 0) === 0) {
        if (args.role !== "admin") errors.role = "The first identity must be an admin so access can be bootstrapped safely.";
      } else {
        if (!args.api_key) errors.api_key = "An admin API key is required.";
        else await enforceOptionalApiWrite(ctx, args, true);
      }
      const name = args.name.trim();
      if (!name) errors.name = "User name is required."; else if (name.length > 100) errors.name = "Keep the name under 100 characters.";
      if (Object.keys(errors).length) return { ok: false as const, errors };
      const now = new Date(); const row = { id: crypto.randomUUID(), name, role: args.role, createdAt: now, updatedAt: now };
      await db.insert(schema.identityUsers).values(row); ctx.invalidateQueries();
      return { ok: true as const, user: toIdentityUser(row) };
    },
  }),

  issueApiKey: defineAction({
    request: z.object({ name: z.string(), user_id: z.string().min(1), api_key: z.string().optional() }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), errors: z.record(z.string(), z.string()) }), z.object({ ok: z.literal(true), key: ApiKeySchema, full_key: z.string() })]),
    async handler(ctx, args) {
      const name = args.name.trim(); const errors: Record<string, string> = {}; const db = ctx.db<typeof schema>();
      if (!name) errors.name = "Key name is required."; else if (name.length > 100) errors.name = "Keep the name under 100 characters.";
      const [users, existingKeys] = await Promise.all([
        db.select().from(schema.identityUsers).where(eq(schema.identityUsers.id, args.user_id)).limit(1),
        db.select({ value: count() }).from(schema.apiKeys),
      ]);
      if (!users[0]) errors.user_id = "Choose an existing user.";
      if ((existingKeys[0]?.value ?? 0) === 0) {
        if (users[0] && users[0].role !== "admin") errors.user_id = "The first key must belong to an admin.";
      } else {
        if (!args.api_key) errors.api_key = "An admin API key is required.";
        else await enforceOptionalApiWrite(ctx, args, true);
      }
      if (Object.keys(errors).length) return { ok: false as const, errors };
      const fullKey = `sp_live_${crypto.randomUUID().replaceAll("-", "")}${crypto.randomUUID().replaceAll("-", "")}`;
      const now = new Date(); const row = { id: crypto.randomUUID(), name, userId: args.user_id, keyPrefix: `${fullKey.slice(0, 16)}…`, keyHash: await hashApiKey(fullKey), revokedAt: null, lastVerifiedAt: null, createdAt: now };
      await db.insert(schema.apiKeys).values(row); ctx.invalidateQueries();
      const key = (await loadIdentityKeys(db as never)).find((item) => item.id === row.id)!;
      return { ok: true as const, key, full_key: fullKey };
    },
  }),

  revokeApiKey: defineAction({
    request: z.object({ id: z.string().min(1), api_key: z.string().optional() }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), error: z.string() }), z.object({ ok: z.literal(true), id: z.string(), revoked_at: z.string() })]),
    async handler(ctx, args) {
      if (!args.api_key) throw new Error("An admin API key is required.");
      await enforceOptionalApiWrite(ctx, args, true);
      const db = ctx.db<typeof schema>(); const found = await db.select().from(schema.apiKeys).where(eq(schema.apiKeys.id, args.id)).limit(1);
      if (!found[0]) return { ok: false as const, error: "That API key no longer exists." };
      if (found[0].revokedAt) return { ok: false as const, error: "That API key is already revoked." };
      const revokedAt = new Date(); await db.update(schema.apiKeys).set({ revokedAt }).where(eq(schema.apiKeys.id, args.id)); ctx.invalidateQueries();
      return { ok: true as const, id: args.id, revoked_at: revokedAt.toISOString() };
    },
  }),

  verifyApiKey: defineAction({
    request: z.object({ key: z.string() }),
    response: z.discriminatedUnion("valid", [z.object({ valid: z.literal(false), reason: z.string() }), z.object({ valid: z.literal(true), owner: z.object({ id: z.string(), name: z.string(), role: IdentityRoleSchema }), key: z.object({ id: z.string(), name: z.string(), prefix: z.string() }) })]),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>(); const auth = await verifyCredential(db as never, args.key);
      if (!auth) return { valid: false as const, reason: "Key is unknown or revoked." };
      await db.update(schema.apiKeys).set({ lastVerifiedAt: new Date() }).where(eq(schema.apiKeys.id, auth.key.id)); ctx.invalidateQueries();
      return { valid: true as const, owner: { id: auth.user.id, name: auth.user.name, role: auth.role }, key: { id: auth.key.id, name: auth.key.name, prefix: auth.key.keyPrefix } };
    },
  }),

  getMemory: defineAction({
    request: z.object({ query: z.string().optional().default(""), tag: z.string().optional().default("") }),
    response: z.object({ entries: z.array(MemoryEntrySchema), tags: z.array(z.string()), total: z.number().int(), query: z.string(), active_tag: z.string() }),
    async handler(ctx, args) {
      const query = args.query.trim().slice(0, 300);
      const tag = args.tag.trim().toLowerCase().slice(0, 60);
      const db = ctx.db<typeof schema>();
      const [entries, allRows] = await Promise.all([
        searchMemoryRows(db as never, query, tag, 300),
        db.select().from(schema.memoryEntries).orderBy(desc(schema.memoryEntries.updatedAt)).limit(1000),
      ]);
      const tags = Array.from(new Set(allRows.flatMap((row) => parseMemoryTags(row.tagsJson)))).sort();
      return { entries, tags, total: allRows.length, query, active_tag: tag };
    },
  }),

  createMemoryEntry: defineAction({
    request: z.object({ title: z.string(), body: z.string(), tags: z.array(z.string()), related_pocket: z.string().nullable().optional() }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), errors: z.record(z.string(), z.string()) }), z.object({ ok: z.literal(true), entry: MemoryEntrySchema })]),
    async handler(ctx, args) {
      const title = args.title.trim(); const body = args.body.trim(); const tags = normalizeMemoryTags(args.tags); const relatedPocket = args.related_pocket?.trim() || null;
      const errors: Record<string, string> = {};
      if (!title) errors.title = "Title is required."; else if (title.length > 180) errors.title = "Keep the title under 180 characters.";
      if (!body) errors.body = "Body is required."; else if (body.length > 20_000) errors.body = "Keep the body under 20,000 characters.";
      if (args.tags.length > 12) errors.tags = "Use no more than 12 tags.";
      if (relatedPocket && relatedPocket.length > 100) errors.related_pocket = "Keep the pocket name under 100 characters.";
      if (Object.keys(errors).length) return { ok: false as const, errors };
      const now = new Date(); const row = { id: crypto.randomUUID(), title, body, tagsJson: JSON.stringify(tags), relatedPocket, createdAt: now, updatedAt: now };
      const db = ctx.db<typeof schema>(); await db.insert(schema.memoryEntries).values(row); ctx.invalidateQueries();
      return { ok: true as const, entry: toMemoryEntry(row) };
    },
  }),

  updateMemoryEntry: defineAction({
    request: z.object({ id: z.string().min(1), title: z.string(), body: z.string(), tags: z.array(z.string()), related_pocket: z.string().nullable().optional() }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), errors: z.record(z.string(), z.string()) }), z.object({ ok: z.literal(true), entry: MemoryEntrySchema })]),
    async handler(ctx, args) {
      const title = args.title.trim(); const body = args.body.trim(); const tags = normalizeMemoryTags(args.tags); const relatedPocket = args.related_pocket?.trim() || null;
      const errors: Record<string, string> = {};
      if (!title) errors.title = "Title is required."; else if (title.length > 180) errors.title = "Keep the title under 180 characters.";
      if (!body) errors.body = "Body is required."; else if (body.length > 20_000) errors.body = "Keep the body under 20,000 characters.";
      if (args.tags.length > 12) errors.tags = "Use no more than 12 tags.";
      if (relatedPocket && relatedPocket.length > 100) errors.related_pocket = "Keep the pocket name under 100 characters.";
      const db = ctx.db<typeof schema>(); const found = await db.select().from(schema.memoryEntries).where(eq(schema.memoryEntries.id, args.id)).limit(1);
      if (!found[0]) errors.id = "That Memory entry no longer exists.";
      if (Object.keys(errors).length) return { ok: false as const, errors };
      const existing = found[0]!;
      const row = { ...existing, title, body, tagsJson: JSON.stringify(tags), relatedPocket, updatedAt: new Date() };
      await db.update(schema.memoryEntries).set({ title, body, tagsJson: row.tagsJson, relatedPocket, updatedAt: row.updatedAt }).where(eq(schema.memoryEntries.id, args.id)); ctx.invalidateQueries();
      return { ok: true as const, entry: toMemoryEntry(row) };
    },
  }),

  deleteMemoryEntry: defineAction({
    request: z.object({ id: z.string().min(1) }),
    response: z.object({ ok: z.boolean(), error: z.string().optional() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>(); const found = await db.select().from(schema.memoryEntries).where(eq(schema.memoryEntries.id, args.id)).limit(1);
      if (!found[0]) return { ok: false, error: "That Memory entry no longer exists." };
      await db.delete(schema.memoryEntries).where(eq(schema.memoryEntries.id, args.id)); ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  getBrain: defineAction({
    request: z.object({}),
    response: z.object({ messages: z.array(BrainMessageSchema), connected: z.array(BrainSourceSchema) }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const [rows, synthesis] = await Promise.all([
        db.select().from(schema.brainMessages).orderBy(asc(schema.brainMessages.createdAt)).limit(200),
        synthesizeBrain(db as never, "current state", "briefing"),
      ]);
      return { messages: rows.map(toBrainMessage), connected: synthesis.sources };
    },
  }),

  askBrain: defineAction({
    request: z.object({ prompt: z.string(), kind: z.enum(["question", "briefing"]) }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), error: z.string() }), z.object({ ok: z.literal(true), user_message: BrainMessageSchema, assistant_message: BrainMessageSchema })]),
    async handler(ctx, args) {
      const prompt = args.prompt.trim();
      if (!prompt) return { ok: false as const, error: "Ask a question or request a briefing." };
      if (prompt.length > 2_000) return { ok: false as const, error: "Keep the request under 2,000 characters." };
      const db = ctx.db<typeof schema>(); const result = await synthesizeBrain(db as never, prompt, args.kind);
      const now = new Date(); const assistantAt = new Date(now.getTime() + 1);
      const userRow = { id: crypto.randomUUID(), role: "user", kind: args.kind, content: prompt, sourcesJson: "[]", consultedEntriesJson: "[]", createdAt: now };
      const assistantRow = { id: crypto.randomUUID(), role: "assistant", kind: args.kind, content: result.content, sourcesJson: JSON.stringify(result.sources), consultedEntriesJson: JSON.stringify(result.citations), createdAt: assistantAt };
      await db.insert(schema.brainMessages).values([userRow, assistantRow]); ctx.invalidateQueries();
      return { ok: true as const, user_message: toBrainMessage(userRow), assistant_message: toBrainMessage(assistantRow) };
    },
  }),

  getApiExplorerCatalog: defineAction({
    request: z.object({}),
    response: z.object({
      generated_at: z.string(),
      endpoints: z.array(z.object({
        name: z.string(), pocket: z.string(), method: z.enum(["query", "mutation"]),
        inputs: z.record(z.string(), z.string()), returns: z.string(),
      })),
    }),
    async handler() {
      return { generated_at: new Date().toISOString(), endpoints: apiCatalog.map((endpoint) => ({ ...endpoint, inputs: { ...endpoint.inputs } })) };
    },
  }),

  getCustomDashboard: defineAction({
    request: z.object({}),
    response: z.object({
      updated_at: z.string().nullable(),
      widgets: z.array(WidgetConfigSchema),
      summaries: z.object({
        zero: z.object({ total: z.number().int(), processed: z.number().int(), latest: z.string().nullable() }),
        metrics: z.object({ total: z.number().int(), health: z.enum(["healthy", "degraded", "critical", "unknown"]), score: z.number().int().nullable() }),
        auditor: z.object({ total: z.number().int(), score: z.number().int().nullable(), open: z.number().int() }),
        soul: z.object({ count: z.number().int(), latest: z.string().nullable() }),
        team: z.object({ members: z.number().int(), available: z.number().int(), updates: z.number().int() }),
        brain: z.object({ responses: z.number().int(), latest: z.string().nullable() }),
      }),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const [configRows, zeroRows, metricRows, checkRows, soulRows, memberRows, noteRows, brainRows] = await Promise.all([
        db.select().from(schema.dashboardConfigurations).where(eq(schema.dashboardConfigurations.id, "personal")).limit(1),
        db.select().from(schema.events).orderBy(desc(schema.events.createdAt)).limit(500),
        db.select().from(schema.metricEvents).orderBy(desc(schema.metricEvents.receivedAt)).limit(500),
        db.select().from(schema.readinessChecks).orderBy(desc(schema.readinessChecks.updatedAt)).limit(500),
        db.select().from(schema.soulCheckins).orderBy(desc(schema.soulCheckins.createdAt)).limit(100),
        db.select().from(schema.teamMembers).orderBy(desc(schema.teamMembers.updatedAt)).limit(500),
        db.select().from(schema.teamNotes).orderBy(desc(schema.teamNotes.createdAt)).limit(500),
        db.select().from(schema.brainMessages).where(eq(schema.brainMessages.role, "assistant")).orderBy(desc(schema.brainMessages.createdAt)).limit(100),
      ]);
      const metricCritical = metricRows.filter((row) => row.level === "critical").length;
      const metricWarning = metricRows.filter((row) => row.level === "warning").length;
      const metricScore = metricRows.length ? Math.round((metricRows.filter((row) => row.level === "healthy").length * 100 + metricWarning * 60) / metricRows.length) : null;
      const passed = checkRows.filter((row) => row.status === "pass").length;
      let widgets = defaultWidgets;
      const stored = configRows[0];
      if (stored) {
        try {
          const parsed = WidgetConfigSchema.array().safeParse(JSON.parse(stored.widgetsJson));
          if (parsed.success) widgets = parsed.data;
        } catch { /* fall back to the complete default layout */ }
      }
      return {
        updated_at: stored?.updatedAt.toISOString() ?? null,
        widgets,
        summaries: {
          zero: { total: zeroRows.length, processed: zeroRows.filter((row) => row.status === "processed").length, latest: zeroRows[0]?.type ?? null },
          metrics: { total: metricRows.length, health: metricRows.length === 0 ? "unknown" as const : metricCritical ? "critical" as const : metricWarning ? "degraded" as const : "healthy" as const, score: metricScore },
          auditor: { total: checkRows.length, score: checkRows.length ? Math.round((passed / checkRows.length) * 100) : null, open: checkRows.filter((row) => row.status !== "pass").length },
          soul: { count: soulRows.length, latest: soulRows[0]?.emotion ?? null },
          team: { members: memberRows.length, available: memberRows.filter((row) => row.availability === "available").length, updates: noteRows.length },
          brain: { responses: brainRows.length, latest: brainRows[0]?.content ?? null },
        },
      };
    },
  }),

  saveDashboardConfiguration: defineAction({
    request: z.object({ widgets: z.array(WidgetConfigSchema).length(6) }),
    response: z.discriminatedUnion("ok", [
      z.object({ ok: z.literal(false), error: z.string() }),
      z.object({ ok: z.literal(true), widgets: z.array(WidgetConfigSchema), updated_at: z.string() }),
    ]),
    async handler(ctx, args) {
      const unique = new Set(args.widgets.map((widget) => widget.id));
      if (unique.size !== defaultWidgets.length || defaultWidgets.some((widget) => !unique.has(widget.id))) {
        return { ok: false as const, error: "Include every dashboard widget exactly once." };
      }
      const db = ctx.db<typeof schema>();
      const updatedAt = new Date();
      const existing = await db.select().from(schema.dashboardConfigurations).where(eq(schema.dashboardConfigurations.id, "personal")).limit(1);
      if (existing[0]) {
        await db.update(schema.dashboardConfigurations).set({ widgetsJson: JSON.stringify(args.widgets), updatedAt }).where(eq(schema.dashboardConfigurations.id, "personal"));
      } else {
        await db.insert(schema.dashboardConfigurations).values({ id: "personal", widgetsJson: JSON.stringify(args.widgets), updatedAt });
      }
      ctx.invalidateQueries();
      return { ok: true as const, widgets: args.widgets, updated_at: updatedAt.toISOString() };
    },
  }),

  getInvestor: defineAction({
    request: z.object({}),
    response: z.object({
      pitch: InvestorPitchSchema.nullable(), traction: z.array(TractionEntrySchema),
      key_metrics: z.array(z.object({ key: z.string(), label: z.string(), value: z.number().int(), pocket: z.string() })),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const [pitches, traction, zeroCount, metricCount, checkCount, draftCount, teamCount, biomarkerCount, simulationCount] = await Promise.all([
        db.select().from(schema.investorPitches).where(eq(schema.investorPitches.id, "primary")).limit(1),
        db.select().from(schema.tractionEntries).orderBy(desc(schema.tractionEntries.occurredOn), desc(schema.tractionEntries.createdAt)).limit(200),
        db.select({ value: count() }).from(schema.events), db.select({ value: count() }).from(schema.metricEvents),
        db.select({ value: count() }).from(schema.readinessChecks), db.select({ value: count() }).from(schema.composerDrafts),
        db.select({ value: count() }).from(schema.teamMembers), db.select({ value: count() }).from(schema.biomarkers),
        db.select({ value: count() }).from(schema.clinicalSimulationRuns),
      ]);
      return {
        pitch: pitches[0] ? toInvestorPitch(pitches[0]) : null,
        traction: traction.map(toTractionEntry),
        key_metrics: [
          { key: "events", label: "Processed events", value: zeroCount[0]?.value ?? 0, pocket: "Pocket Zero" },
          { key: "signals", label: "Operational signals", value: metricCount[0]?.value ?? 0, pocket: "Pocket Metrics" },
          { key: "checks", label: "Readiness checks", value: checkCount[0]?.value ?? 0, pocket: "Pocket Auditor" },
          { key: "drafts", label: "Saved drafts", value: draftCount[0]?.value ?? 0, pocket: "Pocket Composer" },
          { key: "team", label: "Team members", value: teamCount[0]?.value ?? 0, pocket: "Pocket Team" },
          { key: "biomarkers", label: "Biomarkers", value: biomarkerCount[0]?.value ?? 0, pocket: "Pocket RNA" },
          { key: "simulations", label: "Simulation runs", value: simulationCount[0]?.value ?? 0, pocket: "Pocket RNA" },
        ],
      };
    },
  }),

  saveInvestorPitch: defineAction({
    request: z.object({ headline: z.string(), problem_statement: z.string(), solution: z.string(), ask_amount: z.number(), use_of_funds: z.array(UseOfFundsItemSchema) }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), errors: z.record(z.string(), z.string()) }), z.object({ ok: z.literal(true), pitch: InvestorPitchSchema })]),
    async handler(ctx, args) {
      const headline = args.headline.trim(); const problemStatement = args.problem_statement.trim(); const solution = args.solution.trim();
      const errors: Record<string, string> = {};
      if (!headline) errors.headline = "Headline is required."; else if (headline.length > 180) errors.headline = "Keep the headline under 180 characters.";
      if (!problemStatement) errors.problem_statement = "Problem statement is required."; else if (problemStatement.length > 4_000) errors.problem_statement = "Keep the problem under 4,000 characters.";
      if (!solution) errors.solution = "Solution is required."; else if (solution.length > 4_000) errors.solution = "Keep the solution under 4,000 characters.";
      if (!Number.isSafeInteger(args.ask_amount) || args.ask_amount < 0 || args.ask_amount > 1_000_000_000_000) errors.ask_amount = "Enter a whole-dollar ask between 0 and 1 trillion.";
      if (!args.use_of_funds.length) errors.use_of_funds = "Add at least one use-of-funds line.";
      else if (args.use_of_funds.length > 12) errors.use_of_funds = "Use no more than 12 funding lines.";
      else if (args.use_of_funds.some((item) => !item.category.trim() || !Number.isSafeInteger(item.amount) || item.amount < 0)) errors.use_of_funds = "Each funding line needs a category and non-negative whole-dollar amount.";
      if (Object.keys(errors).length) return { ok: false as const, errors };
      const funds = args.use_of_funds.map((item) => ({ category: item.category.trim(), amount: item.amount }));
      const db = ctx.db<typeof schema>(); const now = new Date();
      const existing = await db.select().from(schema.investorPitches).where(eq(schema.investorPitches.id, "primary")).limit(1);
      if (existing[0]) await db.update(schema.investorPitches).set({ headline, problemStatement, solution, askAmount: args.ask_amount, useOfFundsJson: JSON.stringify(funds), updatedAt: now }).where(eq(schema.investorPitches.id, "primary"));
      else await db.insert(schema.investorPitches).values({ id: "primary", headline, problemStatement, solution, askAmount: args.ask_amount, useOfFundsJson: JSON.stringify(funds), createdAt: now, updatedAt: now });
      ctx.invalidateQueries();
      const row = existing[0] ? { ...existing[0], headline, problemStatement, solution, askAmount: args.ask_amount, useOfFundsJson: JSON.stringify(funds), updatedAt: now } : { id: "primary", headline, problemStatement, solution, askAmount: args.ask_amount, useOfFundsJson: JSON.stringify(funds), createdAt: now, updatedAt: now };
      return { ok: true as const, pitch: toInvestorPitch(row) };
    },
  }),

  addTractionEntry: defineAction({
    request: z.object({ occurred_on: z.string(), milestone: z.string(), description: z.string() }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), errors: z.record(z.string(), z.string()) }), z.object({ ok: z.literal(true), entry: TractionEntrySchema })]),
    async handler(ctx, args) {
      const occurredOn = args.occurred_on.trim(); const milestone = args.milestone.trim(); const description = args.description.trim(); const errors: Record<string, string> = {};
      if (!validIsoDate(occurredOn)) errors.occurred_on = "Choose a valid calendar date.";
      if (!milestone) errors.milestone = "Milestone is required."; else if (milestone.length > 180) errors.milestone = "Keep the milestone under 180 characters.";
      if (!description) errors.description = "Description is required."; else if (description.length > 2_000) errors.description = "Keep the description under 2,000 characters.";
      if (Object.keys(errors).length) return { ok: false as const, errors };
      const row = { id: crypto.randomUUID(), occurredOn, milestone, description, createdAt: new Date() }; const db = ctx.db<typeof schema>();
      await db.insert(schema.tractionEntries).values(row); ctx.invalidateQueries();
      return { ok: true as const, entry: toTractionEntry(row) };
    },
  }),

  getRna: defineAction({
    request: z.object({}),
    response: z.object({ biomarkers: z.array(BiomarkerSchema), simulations: z.array(SimulationRunSchema), notes: z.array(MolecularNoteSchema) }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const [biomarkers, simulations, notes] = await Promise.all([
        db.select().from(schema.biomarkers).orderBy(desc(schema.biomarkers.updatedAt)).limit(300),
        db.select().from(schema.clinicalSimulationRuns).orderBy(desc(schema.clinicalSimulationRuns.createdAt)).limit(200),
        db.select().from(schema.molecularAnalysisNotes).orderBy(desc(schema.molecularAnalysisNotes.updatedAt)).limit(300),
      ]);
      const names = new Map(biomarkers.map((item) => [item.id, item.name]));
      return { biomarkers: biomarkers.map(toBiomarker), simulations: simulations.map((item) => toSimulationRun(item, item.biomarkerId ? names.get(item.biomarkerId) ?? null : null)), notes: notes.map((item) => toMolecularNote(item, item.biomarkerId ? names.get(item.biomarkerId) ?? null : null)) };
    },
  }),

  addBiomarker: defineAction({
    request: z.object({ name: z.string(), type: z.string(), associated_condition: z.string(), evidence_notes: z.string(), status: BiomarkerStatusSchema }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), errors: z.record(z.string(), z.string()) }), z.object({ ok: z.literal(true), biomarker: BiomarkerSchema })]),
    async handler(ctx, args) {
      const name = args.name.trim(); const type = args.type.trim(); const condition = args.associated_condition.trim(); const evidence = args.evidence_notes.trim(); const errors: Record<string, string> = {};
      if (!name) errors.name = "Biomarker name is required."; else if (name.length > 140) errors.name = "Keep the name under 140 characters.";
      if (!type) errors.type = "Biomarker type is required."; else if (type.length > 100) errors.type = "Keep the type under 100 characters.";
      if (!condition) errors.associated_condition = "Associated condition is required."; else if (condition.length > 200) errors.associated_condition = "Keep the condition under 200 characters.";
      if (!evidence) errors.evidence_notes = "Evidence notes are required."; else if (evidence.length > 5_000) errors.evidence_notes = "Keep evidence notes under 5,000 characters.";
      if (Object.keys(errors).length) return { ok: false as const, errors };
      const now = new Date(); const row = { id: crypto.randomUUID(), name, type, associatedCondition: condition, evidenceNotes: evidence, status: args.status, createdAt: now, updatedAt: now }; const db = ctx.db<typeof schema>();
      await db.insert(schema.biomarkers).values(row); ctx.invalidateQueries();
      return { ok: true as const, biomarker: toBiomarker(row) };
    },
  }),

  runClinicalSimulation: defineAction({
    request: z.object({ name: z.string(), biomarker_id: z.string().nullable(), cohort_size: z.number(), dose_mg: z.number(), duration_days: z.number(), target_knockdown_percent: z.number() }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), errors: z.record(z.string(), z.string()) }), z.object({ ok: z.literal(true), simulation: SimulationRunSchema })]),
    async handler(ctx, args) {
      const name = args.name.trim(); const errors: Record<string, string> = {};
      if (!name) errors.name = "Simulation name is required."; else if (name.length > 160) errors.name = "Keep the name under 160 characters.";
      const ranges: Array<[string, number, number, number]> = [["cohort_size", args.cohort_size, 1, 100_000], ["dose_mg", args.dose_mg, 1, 10_000], ["duration_days", args.duration_days, 1, 3_650], ["target_knockdown_percent", args.target_knockdown_percent, 1, 100]];
      for (const [key, value, min, max] of ranges) if (!Number.isSafeInteger(value) || value < min || value > max) errors[key] = `Enter a whole number from ${min} to ${max}.`;
      const db = ctx.db<typeof schema>(); let biomarkerName: string | null = null;
      if (args.biomarker_id) { const found = await db.select().from(schema.biomarkers).where(eq(schema.biomarkers.id, args.biomarker_id)).limit(1); if (!found[0]) errors.biomarker_id = "Choose an available biomarker."; else biomarkerName = found[0].name; }
      if (Object.keys(errors).length) return { ok: false as const, errors };
      const results = simulateClinicalRun(args.cohort_size, args.dose_mg, args.duration_days, args.target_knockdown_percent); const createdAt = new Date();
      const row = { id: crypto.randomUUID(), name, biomarkerId: args.biomarker_id, cohortSize: args.cohort_size, doseMg: args.dose_mg, durationDays: args.duration_days, targetKnockdownPercent: args.target_knockdown_percent, inputsJson: JSON.stringify(args), resultsJson: JSON.stringify(results), createdAt };
      await db.insert(schema.clinicalSimulationRuns).values(row); ctx.invalidateQueries();
      return { ok: true as const, simulation: toSimulationRun(row, biomarkerName) };
    },
  }),

  addMolecularNote: defineAction({
    request: z.object({ biomarker_id: z.string().nullable(), title: z.string(), analysis_type: z.string(), observation: z.string(), interpretation: z.string(), next_step: z.string() }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), errors: z.record(z.string(), z.string()) }), z.object({ ok: z.literal(true), note: MolecularNoteSchema })]),
    async handler(ctx, args) {
      const title = args.title.trim(); const analysisType = args.analysis_type.trim(); const observation = args.observation.trim(); const interpretation = args.interpretation.trim(); const nextStep = args.next_step.trim(); const errors: Record<string, string> = {};
      if (!title) errors.title = "Note title is required."; else if (title.length > 180) errors.title = "Keep the title under 180 characters.";
      if (!analysisType) errors.analysis_type = "Analysis type is required."; else if (analysisType.length > 120) errors.analysis_type = "Keep the analysis type under 120 characters.";
      if (!observation) errors.observation = "Observation is required."; else if (observation.length > 4_000) errors.observation = "Keep the observation under 4,000 characters.";
      if (!interpretation) errors.interpretation = "Interpretation is required."; else if (interpretation.length > 4_000) errors.interpretation = "Keep the interpretation under 4,000 characters.";
      if (!nextStep) errors.next_step = "Next step is required."; else if (nextStep.length > 2_000) errors.next_step = "Keep the next step under 2,000 characters.";
      const db = ctx.db<typeof schema>(); let biomarkerName: string | null = null;
      if (args.biomarker_id) { const found = await db.select().from(schema.biomarkers).where(eq(schema.biomarkers.id, args.biomarker_id)).limit(1); if (!found[0]) errors.biomarker_id = "Choose an available biomarker."; else biomarkerName = found[0].name; }
      if (Object.keys(errors).length) return { ok: false as const, errors };
      const now = new Date(); const row = { id: crypto.randomUUID(), biomarkerId: args.biomarker_id, title, analysisType, observation, interpretation, nextStep, createdAt: now, updatedAt: now };
      await db.insert(schema.molecularAnalysisNotes).values(row); ctx.invalidateQueries();
      return { ok: true as const, note: toMolecularNote(row, biomarkerName) };
    },
  }),

  getClinical: defineAction({
    request: z.object({}),
    response: z.object({
      posture: z.object({ local_storage: z.literal("active"), data_residency: z.literal("local"), cloud_sync: z.literal("off"), mode: z.literal("offline-first") }),
      cases: z.array(ClinicalCaseSchema),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.clinicalCases).orderBy(desc(schema.clinicalCases.createdAt)).limit(100);
      return { posture: { local_storage: "active" as const, data_residency: "local" as const, cloud_sync: "off" as const, mode: "offline-first" as const }, cases: rows.map(toClinicalCase) };
    },
  }),

  createClinicalCase: defineAction({
    request: z.object({ label: z.string(), symptoms: z.string(), observations: z.string() }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), errors: z.record(z.string(), z.string()) }), z.object({ ok: z.literal(true), case: ClinicalCaseSchema })]),
    async handler(ctx, args) {
      const label = args.label.trim(); const symptoms = args.symptoms.trim(); const observations = args.observations.trim(); const errors: Record<string, string> = {};
      if (!label) errors.label = "Case label is required."; else if (label.length > 120) errors.label = "Keep the label under 120 characters.";
      if (!symptoms) errors.symptoms = "Enter symptoms or concerns."; else if (symptoms.length > 4_000) errors.symptoms = "Keep symptoms under 4,000 characters.";
      if (observations.length > 4_000) errors.observations = "Keep observations under 4,000 characters.";
      if (Object.keys(errors).length) return { ok: false as const, errors };
      const summary = buildClinicalSummary(symptoms, observations); const createdAt = new Date();
      const row = { id: crypto.randomUUID(), label, symptoms, observations, summaryJson: JSON.stringify(summary), createdAt };
      const db = ctx.db<typeof schema>(); await db.insert(schema.clinicalCases).values(row); ctx.invalidateQueries();
      return { ok: true as const, case: toClinicalCase(row) };
    },
  }),

  getSolarConnect: defineAction({
    request: z.object({}),
    response: z.object({
      calculated_at: z.string(), health: z.enum(["healthy", "degraded", "critical", "unknown"]),
      totals: z.object({ events: z.number().int(), completed: z.number().int(), deployments: z.number().int(), failures: z.number().int() }),
      failure_rate_percent: z.number().nullable(), deployment_frequency_30d: z.number().int(), average_duration_seconds: z.number().int().nullable(),
      events: z.array(PipelineEventSchema),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.pipelineEvents).orderBy(desc(schema.pipelineEvents.eventTimestamp)).limit(500);
      const completed = rows.filter((row) => row.status !== "running" && row.status !== "canceled");
      const failures = completed.filter((row) => row.status === "failed").length;
      const successfulDeployments = rows.filter((row) => row.eventKind === "deployment" && row.status === "success" && row.eventTimestamp.getTime() >= Date.now() - 30 * 24 * 60 * 60 * 1000).length;
      const failureRate = completed.length ? Number(((failures / completed.length) * 100).toFixed(1)) : null;
      const avgDuration = completed.length ? Math.round(completed.reduce((sum, row) => sum + row.durationSeconds, 0) / completed.length) : null;
      const health = completed.length === 0 ? "unknown" as const : failureRate! >= 30 ? "critical" as const : failureRate! > 0 ? "degraded" as const : "healthy" as const;
      return { calculated_at: new Date().toISOString(), health, totals: { events: rows.length, completed: completed.length, deployments: rows.filter((row) => row.eventKind === "deployment").length, failures }, failure_rate_percent: failureRate, deployment_frequency_30d: successfulDeployments, average_duration_seconds: avgDuration, events: rows.slice(0, 50).map(toPipelineEvent) };
    },
  }),

  ingestPipelineEvent: defineAction({
    request: z.object({ project: z.string(), event_kind: z.enum(["pipeline", "deployment"]), status: z.enum(["success", "failed", "canceled", "running"]), duration_seconds: z.number(), commit_reference: z.string(), event_timestamp: z.string() }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), errors: z.record(z.string(), z.string()) }), z.object({ ok: z.literal(true), event: PipelineEventSchema })]),
    async handler(ctx, args) {
      const project = args.project.trim(); const commitReference = args.commit_reference.trim(); const errors: Record<string, string> = {};
      if (!project) errors.project = "Project is required."; else if (project.length > 160) errors.project = "Keep the project under 160 characters.";
      if (!commitReference) errors.commit_reference = "Commit reference is required."; else if (commitReference.length > 160) errors.commit_reference = "Keep the commit reference under 160 characters.";
      if (!Number.isSafeInteger(args.duration_seconds) || args.duration_seconds < 0 || args.duration_seconds > 604_800) errors.duration_seconds = "Enter a whole number from 0 to 604800 seconds.";
      const eventTimestamp = new Date(args.event_timestamp);
      if (!args.event_timestamp || Number.isNaN(eventTimestamp.getTime())) errors.event_timestamp = "Choose a valid event date and time.";
      if (Object.keys(errors).length) return { ok: false as const, errors };
      const createdAt = new Date(); const row = { id: crypto.randomUUID(), project, eventKind: args.event_kind, status: args.status, durationSeconds: args.duration_seconds, commitReference, eventTimestamp, createdAt };
      const db = ctx.db<typeof schema>(); await db.insert(schema.pipelineEvents).values(row); ctx.invalidateQueries();
      return { ok: true as const, event: toPipelineEvent(row) };
    },
  }),

  getWorkflows: defineAction({
    request: z.object({}),
    response: z.object({
      evaluated_at: z.string(),
      counts: z.object({ total: z.number().int(), enabled: z.number().int(), runs: z.number().int(), failures: z.number().int() }),
      workflows: z.array(WorkflowSchema),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const [rows, runs] = await Promise.all([
        db.select().from(schema.workflows).orderBy(desc(schema.workflows.updatedAt)).limit(200),
        db.select().from(schema.workflowRuns).orderBy(desc(schema.workflowRuns.startedAt)).limit(1000),
      ]);
      const workflows = await Promise.all(rows.map((row) => loadWorkflow(db as never, row)));
      return { evaluated_at: new Date().toISOString(), counts: { total: rows.length, enabled: rows.filter((row) => row.enabled).length, runs: runs.length, failures: runs.filter((row) => row.status === "failure").length }, workflows };
    },
  }),

  createWorkflow: defineAction({
    request: z.object({ name: z.string(), enabled: z.boolean(), trigger: WorkflowTriggerSchema, actions: z.array(WorkflowActionSchema) }),
    response: z.discriminatedUnion("ok", [
      z.object({ ok: z.literal(false), errors: z.record(z.string(), z.string()) }),
      z.object({ ok: z.literal(true), workflow: WorkflowSchema }),
    ]),
    async handler(ctx, args) {
      const name = args.name.trim(); const errors: Record<string, string> = {};
      if (!name) errors.name = "Workflow name is required."; else if (name.length > 140) errors.name = "Keep the name under 140 characters.";
      if (args.actions.length < 1) errors.actions = "Add at least one action."; else if (args.actions.length > 12) errors.actions = "Use no more than 12 actions.";
      if (args.trigger.kind === "event") {
        const eventType = args.trigger.event_type.trim();
        if (!/^[a-z][a-z0-9]*(?:\.[a-z][a-z0-9_-]*)+$/.test(eventType)) errors.trigger = "Use a dotted lowercase event type, such as system.pulse.";
      } else if (args.trigger.kind === "metric") {
        if (!args.trigger.metric_name.trim()) errors.trigger = "Metric name is required.";
        else if (args.trigger.metric_name.length > 120) errors.trigger = "Keep the metric name under 120 characters.";
        if (!Number.isFinite(args.trigger.value)) errors.trigger = "Threshold must be a finite number.";
      } else if (args.trigger.schedule_type === "interval") {
        if (!Number.isSafeInteger(args.trigger.interval_minutes) || (args.trigger.interval_minutes ?? 0) < 5 || (args.trigger.interval_minutes ?? 0) > 525_600) errors.trigger = "Interval must be a whole number from 5 to 525600 minutes.";
      } else if (!validCron(args.trigger.cron_expression)) errors.trigger = "Use a valid five-field UTC cron expression.";

      args.actions.forEach((action, index) => {
        const key = `action_${index}`;
        if (action.kind === "team_note" && (!action.author.trim() || !action.body.trim())) errors[key] = "Team note actions need an author and body.";
        if (action.kind === "composer_message" && (!action.audience.trim() || !action.purpose.trim() || !action.content.trim())) errors[key] = "Composer actions need an audience, purpose, and message.";
        if (action.kind === "auditor_check" && (!action.name.trim() || !action.category.trim())) errors[key] = "Auditor actions need a check name and category.";
        if (action.kind === "emit_event") {
          if (!/^[a-z][a-z0-9]*(?:\.[a-z][a-z0-9_-]*)+$/.test(action.type.trim()) || !action.source.trim()) errors[key] = "Event actions need a dotted lowercase type and source.";
          const payloadErrors: Record<string, string> = {}; validateJsonObject(action.payload_json, payloadErrors); if (payloadErrors.payload_json) errors[key] = payloadErrors.payload_json;
        }
      });
      if (Object.keys(errors).length) return { ok: false as const, errors };

      const trigger: WorkflowTrigger = args.trigger.kind === "event"
        ? { ...args.trigger, event_type: args.trigger.event_type.trim() }
        : args.trigger.kind === "metric"
          ? { ...args.trigger, metric_name: args.trigger.metric_name.trim() }
          : { ...args.trigger, cron_expression: args.trigger.cron_expression.trim() };
      const now = new Date(); const id = crypto.randomUUID(); const db = ctx.db<typeof schema>();
      const workflowRow = { id, name, enabled: args.enabled, triggerKind: trigger.kind, triggerConfigJson: JSON.stringify(trigger), lastEvaluatedAt: now, lastFiredAt: null, lastMetricValue: null, createdAt: now, updatedAt: now };
      await db.insert(schema.workflows).values(workflowRow);
      await db.insert(schema.workflowActions).values(args.actions.map((action, sequence) => ({ id: crypto.randomUUID(), workflowId: id, sequence: sequence + 1, kind: action.kind, configJson: JSON.stringify(action), createdAt: now })));
      ctx.invalidateQueries();
      return { ok: true as const, workflow: await loadWorkflow(db as never, workflowRow) };
    },
  }),

  setWorkflowEnabled: defineAction({
    request: z.object({ id: z.string().min(1), enabled: z.boolean() }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), error: z.string() }), z.object({ ok: z.literal(true), workflow: WorkflowSchema })]),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.workflows).where(eq(schema.workflows.id, args.id)).limit(1);
      if (!rows[0]) return { ok: false as const, error: "That workflow no longer exists." };
      const now = new Date();
      await db.update(schema.workflows).set({ enabled: args.enabled, lastEvaluatedAt: now, updatedAt: now }).where(eq(schema.workflows.id, args.id));
      ctx.invalidateQueries();
      return { ok: true as const, workflow: await loadWorkflow(db as never, { ...rows[0], enabled: args.enabled, lastEvaluatedAt: now, updatedAt: now }) };
    },
  }),

  runWorkflowNow: defineAction({
    request: z.object({ id: z.string().min(1) }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), error: z.string() }), z.object({ ok: z.literal(true), run: WorkflowRunSchema })]),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.workflows).where(eq(schema.workflows.id, args.id)).limit(1);
      if (!rows[0]) return { ok: false as const, error: "That workflow no longer exists." };
      const actions = await db.select().from(schema.workflowActions).where(eq(schema.workflowActions.workflowId, args.id)).orderBy(asc(schema.workflowActions.sequence));
      const run = await executeWorkflow(db as never, rows[0], actions, "manual", "Manual test run");
      ctx.invalidateQueries();
      return { ok: true as const, run };
    },
  }),

  evaluateWorkflows: defineAction({
    request: z.object({}),
    response: z.object({ evaluated_at: z.string(), evaluated: z.number().int(), fired: z.number().int(), runs: z.array(WorkflowRunSchema) }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>(); const now = new Date();
      const workflows = await db.select().from(schema.workflows).where(eq(schema.workflows.enabled, true)).orderBy(asc(schema.workflows.createdAt)).limit(500);
      const generatedRuns: Array<ReturnType<typeof toWorkflowRun>> = [];
      for (const workflow of workflows) {
        const trigger = parseWorkflowTrigger(workflow.triggerConfigJson);
        let shouldFire = false; let triggerSummary = ""; let metricValue: number | null = workflow.lastMetricValue;
        if (trigger?.kind === "event") {
          const recent = await db.select().from(schema.events).orderBy(desc(schema.events.createdAt)).limit(500);
          const match = recent.find((row: typeof schema.events.$inferSelect) => row.type === trigger.event_type && row.createdAt.getTime() > (workflow.lastEvaluatedAt?.getTime() ?? workflow.createdAt.getTime()));
          if (match) { shouldFire = true; triggerSummary = `Received ${match.type} from ${match.source} (#${match.id.slice(0, 8)}).`; }
        } else if (trigger?.kind === "metric") {
          metricValue = await readWorkflowMetric(db as never, trigger.metric_name);
          if (metricValue !== null) {
            const satisfies = trigger.operator === "above" ? metricValue > trigger.value : metricValue < trigger.value;
            const previousSatisfied = workflow.lastMetricValue === null ? false : trigger.operator === "above" ? workflow.lastMetricValue > trigger.value : workflow.lastMetricValue < trigger.value;
            shouldFire = satisfies && !previousSatisfied;
            if (shouldFire) triggerSummary = `${trigger.metric_name} crossed ${trigger.operator} ${trigger.value}; current value ${metricValue}.`;
          }
        } else if (trigger?.kind === "schedule") {
          if (trigger.schedule_type === "interval" && trigger.interval_minutes) {
            const baseline = workflow.lastFiredAt ?? workflow.createdAt;
            shouldFire = now.getTime() - baseline.getTime() >= trigger.interval_minutes * 60_000;
            if (shouldFire) triggerSummary = `${trigger.interval_minutes}-minute interval became due.`;
          } else if (trigger.schedule_type === "cron" && cronMatches(trigger.cron_expression, now)) {
            const currentMinute = Math.floor(now.getTime() / 60_000);
            shouldFire = !workflow.lastFiredAt || Math.floor(workflow.lastFiredAt.getTime() / 60_000) < currentMinute;
            if (shouldFire) triggerSummary = `Cron schedule matched ${trigger.cron_expression} at ${now.toISOString()} (UTC).`;
          }
        }
        await db.update(schema.workflows).set({ lastEvaluatedAt: now, lastMetricValue: metricValue, updatedAt: now }).where(eq(schema.workflows.id, workflow.id));
        if (shouldFire) {
          const actionRows = await db.select().from(schema.workflowActions).where(eq(schema.workflowActions.workflowId, workflow.id)).orderBy(asc(schema.workflowActions.sequence));
          generatedRuns.push(await executeWorkflow(db as never, { ...workflow, lastEvaluatedAt: now, lastMetricValue: metricValue }, actionRows, trigger!.kind, triggerSummary));
        }
      }
      ctx.invalidateQueries();
      return { evaluated_at: now.toISOString(), evaluated: workflows.length, fired: generatedRuns.length, runs: generatedRuns };
    },
  }),

  deleteWorkflow: defineAction({
    request: z.object({ id: z.string().min(1) }),
    response: z.object({ ok: z.boolean(), error: z.string().optional() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.workflows).where(eq(schema.workflows.id, args.id)).limit(1);
      if (!rows[0]) return { ok: false, error: "That workflow no longer exists." };
      await db.delete(schema.workflows).where(eq(schema.workflows.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  getVault: defineAction({
    request: z.object({}),
    response: z.object({
      schema_version: z.number().int(), max_upload_bytes: z.number().int(), preview_ttl_minutes: z.number().int(),
      table_names: z.array(z.string()), history: z.array(VaultHistorySchema),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.vaultRestoreHistory).orderBy(desc(schema.vaultRestoreHistory.restoredAt)).limit(100);
      return { schema_version: VAULT_SCHEMA_VERSION, max_upload_bytes: VAULT_MAX_UPLOAD_BYTES, preview_ttl_minutes: VAULT_PREVIEW_TTL_MS / 60_000, table_names: backupSpecs.map((spec) => spec.name), history: rows.map(vaultHistoryRow) };
    },
  }),

  exportVault: defineAction({
    request: z.object({}),
    response: z.object({ file_name: z.string(), content: z.string(), size_bytes: z.number().int(), counts: VaultCountSchema, total_records: z.number().int(), exported_at: z.string(), schema_version: z.number().int() }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>(); const exportedAt = new Date().toISOString();
      const tables: Record<string, Array<Record<string, unknown>>> = {}; const counts: Record<string, number> = {};
      for (const spec of backupSpecs) {
        const rows = await db.select().from(spec.table);
        tables[spec.name] = rows.map((row: Record<string, unknown>) => serializeVaultRow(row));
        counts[spec.name] = rows.length;
      }
      const packageValue = { schema_version: VAULT_SCHEMA_VERSION, exported_at: exportedAt, product: "seventeen-pockets", tables };
      const content = JSON.stringify(packageValue, null, 2);
      const day = exportedAt.slice(0, 10);
      return { file_name: `seventeen-pockets-backup-${day}.json`, content, size_bytes: new TextEncoder().encode(content).byteLength, counts, total_records: Object.values(counts).reduce((sum, value) => sum + value, 0), exported_at: exportedAt, schema_version: VAULT_SCHEMA_VERSION };
    },
  }),

  previewVaultRestore: defineAction({
    request: z.object({ source_file_name: z.string(), mode: z.enum(["merge", "replace"]), payload_json: z.string() }),
    response: z.discriminatedUnion("ok", [
      z.object({ ok: z.literal(false), size_bytes: z.number().int(), errors: z.array(VaultValidationErrorSchema) }),
      z.object({ ok: z.literal(true), preview_id: z.string(), source_file_name: z.string(), mode: z.enum(["merge", "replace"]), schema_version: z.number().int(), exported_at: z.string(), expires_at: z.string(), size_bytes: z.number().int(), total_records: z.number().int(), total_will_restore: z.number().int(), tables: z.array(z.object({ name: z.string(), file_records: z.number().int(), existing_records: z.number().int(), will_restore: z.number().int(), will_skip: z.number().int() })) }),
    ]),
    async handler(ctx, args) {
      const sizeBytes = new TextEncoder().encode(args.payload_json).byteLength;
      if (sizeBytes > VAULT_MAX_UPLOAD_BYTES) return { ok: false as const, size_bytes: sizeBytes, errors: [{ table: "package", row: null, message: `File exceeds the ${VAULT_MAX_UPLOAD_BYTES / 1024 / 1024} MiB upload limit.` }] };
      const sourceFileName = args.source_file_name.trim();
      if (!sourceFileName || sourceFileName.length > 240 || !sourceFileName.toLowerCase().endsWith(".json")) return { ok: false as const, size_bytes: sizeBytes, errors: [{ table: "package", row: null, message: "Choose a .json backup file with a file name under 240 characters." }] };
      let parsed: unknown;
      try { parsed = JSON.parse(args.payload_json); } catch { return { ok: false as const, size_bytes: sizeBytes, errors: [{ table: "package", row: null, message: "File is not valid JSON." }] }; }
      const validated = validateVaultPackage(parsed);
      if (validated.errors.length) return { ok: false as const, size_bytes: sizeBytes, errors: validated.errors };
      const root = parsed as { exported_at: string };
      const db = ctx.db<typeof schema>();
      const summaries: Array<{ name: string; file_records: number; existing_records: number; will_restore: number; will_skip: number }> = [];
      const willRestoreCounts: Record<string, number> = {};
      for (const spec of backupSpecs) {
        const existing = await db.select().from(spec.table);
        const incoming = validated.tables[spec.name] ?? [];
        let willRestore = incoming.length;
        if (args.mode === "merge") {
          const existingKeys = new Set(existing.map((row: Record<string, unknown>) => spec.name === "project_members" ? `${row.projectId}:${row.memberId}` : String(row.id)));
          willRestore = incoming.filter((row) => !existingKeys.has(spec.name === "project_members" ? `${row.projectId}:${row.memberId}` : String(row.id))).length;
        }
        willRestoreCounts[spec.name] = willRestore;
        summaries.push({ name: spec.name, file_records: incoming.length, existing_records: existing.length, will_restore: willRestore, will_skip: incoming.length - willRestore });
      }
      const now = new Date(); const expiresAt = new Date(now.getTime() + VAULT_PREVIEW_TTL_MS); const previewId = crypto.randomUUID();
      await db.delete(schema.vaultRestorePreviews).where(lte(schema.vaultRestorePreviews.expiresAt, now));
      await db.insert(schema.vaultRestorePreviews).values({ id: previewId, sourceFileName, mode: args.mode, payloadJson: args.payload_json, countsJson: JSON.stringify(willRestoreCounts), createdAt: now, expiresAt });
      return { ok: true as const, preview_id: previewId, source_file_name: sourceFileName, mode: args.mode, schema_version: VAULT_SCHEMA_VERSION, exported_at: root.exported_at, expires_at: expiresAt.toISOString(), size_bytes: sizeBytes, total_records: Object.values(validated.counts).reduce((sum, value) => sum + value, 0), total_will_restore: Object.values(willRestoreCounts).reduce((sum, value) => sum + value, 0), tables: summaries };
    },
  }),

  confirmVaultRestore: defineAction({
    request: z.object({ preview_id: z.string().min(1) }),
    response: z.discriminatedUnion("ok", [z.object({ ok: z.literal(false), error: z.string() }), z.object({ ok: z.literal(true), history: VaultHistorySchema })]),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const previews = await db.select().from(schema.vaultRestorePreviews).where(eq(schema.vaultRestorePreviews.id, args.preview_id)).limit(1);
      const preview = previews[0];
      if (!preview) return { ok: false as const, error: "This restore preview no longer exists. Validate the file again." };
      if (preview.expiresAt.getTime() <= Date.now()) { await db.delete(schema.vaultRestorePreviews).where(eq(schema.vaultRestorePreviews.id, preview.id)); return { ok: false as const, error: "This restore preview expired. Validate the file again." }; }
      let parsed: unknown;
      try { parsed = JSON.parse(preview.payloadJson); } catch { return { ok: false as const, error: "The staged backup could not be read. Validate the source file again." }; }
      const validated = validateVaultPackage(parsed);
      if (validated.errors.length) return { ok: false as const, error: "The staged backup no longer passes validation. Nothing was changed." };
      const mode = preview.mode as VaultMode; const restoredAt = new Date(); const historyId = crypto.randomUUID();
      let historyRecord: typeof schema.vaultRestoreHistory.$inferSelect | null = null;
      try {
        const operations: any[] = [];
        if (mode === "replace") for (const spec of [...backupSpecs].reverse()) operations.push(db.delete(spec.table));
        const appliedCounts: Record<string, number> = {};
        for (const spec of backupSpecs) {
          const incoming = (validated.tables[spec.name] ?? []).map((row) => reviveVaultRow(spec, row));
          let rowsToInsert = incoming;
          if (mode === "merge") {
            const existing = await db.select().from(spec.table);
            const existingKeys = new Set(existing.map((row: Record<string, unknown>) => spec.name === "project_members" ? `${row.projectId}:${row.memberId}` : String(row.id)));
            rowsToInsert = incoming.filter((row) => !existingKeys.has(spec.name === "project_members" ? `${row.projectId}:${row.memberId}` : String(row.id)));
          }
          if (rowsToInsert.length) operations.push(db.insert(spec.table).values(rowsToInsert).onConflictDoNothing());
          appliedCounts[spec.name] = rowsToInsert.length;
        }
        const totalRecords = Object.values(appliedCounts).reduce((sum, value) => sum + value, 0);
        const historyValues = { id: historyId, sourceFileName: preview.sourceFileName, mode, countsJson: JSON.stringify(appliedCounts), totalRecords, restoredAt };
        operations.push(db.insert(schema.vaultRestoreHistory).values(historyValues));
        operations.push(db.delete(schema.vaultRestorePreviews).where(eq(schema.vaultRestorePreviews.id, preview.id)));
        await db.batch(operations as [any, ...any[]]);
        historyRecord = historyValues;
      } catch {
        return { ok: false as const, error: "Restore could not be applied. No records were changed." };
      }
      ctx.invalidateQueries();
      return { ok: true as const, history: vaultHistoryRow(historyRecord!) };
    },
  }),
} satisfies ActionsModule;
