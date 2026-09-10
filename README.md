# Seventeen Pockets v1.0.0

> "We build systems that connect humanity. Not through promises, but through precision. Not through capital, but through intelligence."

Seventeen Pockets is a standalone operational-intelligence platform: nineteen
specialized pockets — dashboards, analytics, automation, identity, and
diagnostic tooling — running on a single Bun 1.3 runtime with a React 19
client and a SQLite store. One server binary, one database file, one action
RPC surface.

## The 19 pockets

| # | Pocket | What it does |
|---|--------|--------------|
| 0 | Pocket Zero | Event orchestration — the central event bus |
| 1 | Metrics | KPI collection and visualization |
| 2 | Auditor | Audit trails and compliance records |
| 3 | Soul | System identity and mission configuration |
| 4 | Composer | Guided content and workflow composition |
| 5 | Team | Team members, roles, and collaboration |
| 6 | Brain | Reasoning and analysis workspace |
| 7 | API explorer | Browse and call the action catalog |
| 8 | Dashboard | Widget-based operations dashboard |
| 9 | Investor | Investor relations reporting |
| 10 | RNA | Data-pipeline observability |
| 11 | Clinical | Diagnostic-support demo — **not a medical device** |
| 12 | Solar Connect | CI/pipeline ingestion (incl. GitLab live sync) |
| 13 | Workflows / Nexus | Automation engine |
| 14 | Identity | Users, roles, and API keys |
| 15 | Sentinel | Anomaly detection and alerting |
| 16 | Memory | Knowledge base |
| 17 | Forecast | Trend projection |
| 18 | Vault | Backup and restore |

## Quickstart

Requirements: [Bun](https://bun.sh) 1.3+.

```bash
bun install
bun run db:migrate
bun run build
bun start
```

Then open http://localhost:3000.

### Docker

```bash
docker compose up --build
```

The database persists in the named volume `seventeen-pockets-data`
(mounted at `/app/data`). To wipe it, `docker compose down -v`.

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP port the server listens on |
| `DATABASE_PATH` | `./data/app.db` | SQLite database file (persist this on deploy hosts) |
| `GITLAB_TOKEN` | — | Personal/project token for GitLab pipeline sync |
| `GITLAB_PROJECT_IDS` | — | Comma-separated GitLab project IDs to poll |
| `SOLAR_SYNC_INTERVAL_MIN` | — | Minutes between GitLab pipeline polls |

See `.env.example` for a starting template.

## GitLab wiring (Solar Connect)

Set `GITLAB_TOKEN` (needs the `read_api` scope) and `GITLAB_PROJECT_IDS`.
The server polls each project's pipelines every `SOLAR_SYNC_INTERVAL_MIN`
minutes and ingests them into Solar Connect through the existing
`ingestPipelineEvent` action, deduplicated by GitLab pipeline id.

No token? The app runs fine without it and logs:

```
[gitlab-sync] skipped (no token)
```

## API contract

- `POST /actions` — `{ "action": "<name>", "args": { ... } }` → `{ "data": ... }` or `{ "error": ... }`
- `GET /actions` — full action catalog
- `GET /health` — liveness
- `GET /api/v1/system` — system summary
- `POST /api/v1/events` — `{ "type": "...", "source": "...", "payload": { ... } }`

The client expects `/actions` on the same origin.

## Identity bootstrap

The **first** Identity user created must be an `admin`. After that, user and
API-key management requires an admin key. Store that first admin key
somewhere safe — it is the only way to manage users and keys.

## Deploy hosts

- Listens on `$PORT` (default `3000`).
- SQLite lives at `$DATABASE_PATH` (default `./data/app.db`). **Mount or
  back up this path** — everything (events, users, keys, pockets' data) is
  in that one file.
- Migrations run on boot, so a fresh volume self-initializes.

## Caveats

- This is a **v1.0.0 prototype**, not production-hardened: no rate limiting,
  no TLS termination, no multi-instance support.
- The **Clinical pocket is a demonstration with safety disclosures** — it is
  not a medical device and must not be used for diagnosis or treatment.
- **Forecasts are estimates**, not guarantees.
