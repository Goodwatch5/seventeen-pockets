# Release notes — v1.0.0

## What's in this release

- **19 pockets** live in one app: Pocket Zero (event orchestration), Metrics,
  Auditor, Soul, Composer, Team, Brain, API explorer, Dashboard, Investor,
  RNA, Clinical (diagnostic-support demo), Solar Connect (CI/pipeline
  ingestion), Workflows/Nexus (automation engine), Identity (users, roles,
  API keys), Sentinel (anomaly alerting), Memory (knowledge base), Forecast
  (trend projection), and Vault (backup/restore).
- **Standalone Bun 1.3 runtime** — no platform host required. `bun start`
  runs the whole stack: server, built client, SQLite.
- **Foundation HTTP parity** — `GET /health`, `GET /api/v1/system`, and
  `POST /api/v1/events` work outside any embedding host.
- **Action RPC at `/actions`** — every server action is callable as
  `POST /actions` with `{ action, args }` → `{ data }` / `{ error }`;
  `GET /actions` returns the full catalog.
- **GitLab live sync wiring** — with `GITLAB_TOKEN` (`read_api` scope) and
  `GITLAB_PROJECT_IDS` set, project pipelines are polled every
  `SOLAR_SYNC_INTERVAL_MIN` minutes and ingested into Solar Connect via the
  existing `ingestPipelineEvent` action, deduplicated by GitLab pipeline id.
- **Docker + CI** — multi-stage `Dockerfile` (deps → build → slim runtime,
  non-root user), `docker-compose.yml` with a persistent data volume, and a
  GitHub Actions CI workflow (install → typecheck → build).

## Upgrade notes

- This is the first release — there is no upgrade path from the Hatch-hosted
  prototype. Deploy fresh.
- The server runs `db:migrate` on boot, so a fresh `DATABASE_PATH` target
  self-initializes its SQLite schema. To start clean, delete the sqlite file
  (or `docker compose down -v`) before first boot.
- First Identity user created must be an `admin`; afterwards user/key
  management requires an admin key.

## Known limitations

- Runtime configuration previously came from the embedding host — it now
  reads `process.env` (see `.env.example`), but hot-reloading config is not
  supported; restart the server to pick up changes.
- The client expects `/actions` on the same origin; it cannot point at a
  remote action server.
- The Clinical pocket is a demonstration with safety disclosures, not a
  medical device; forecasts are estimates. See README caveats.
