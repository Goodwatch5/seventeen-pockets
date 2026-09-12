# Run Full Ecosystem

This is the complete functional ecosystem with all backend APIs, real database connections, and live data.

## What's included

* **PostgreSQL** - Shared database with ecosystem tables
* **Redis** - Caching and real-time data
* **Rightway API** (port 3001) - Platform configuration and sessions
* **Seventeen Pockets API** (port 3002) - Job orchestration and workflows
* **Solar Connect API** (port 3003) - Metrics collection and data sources
* **NextMyTeam API** (port 3004) - Team collaboration and events
* **Dashboard** (port 8080) - Live frontend with real data connections

## Requirements

* Docker Desktop (or Docker Engine)
* Docker Compose v2
* 8GB+ RAM recommended

## One command

```bash
docker compose -f docker-compose.full.yml up -d --build
```

## Access points

* **Dashboard:** http://localhost:8080 (live data, real-time updates)
* **Rightway API:** http://localhost:3001/health
* **Orchestration API:** http://localhost:3002/health
* **Metrics API:** http://localhost:3003/health
* **Collaboration API:** http://localhost:3004/health
* **PostgreSQL:** localhost:5432 (ecosystem/ecosystem\_password)
* **Redis:** localhost:6379

## Features

* **Real data connections:** Dashboard pulls live data from all APIs
* **Auto-generated metrics:** Solar Connect generates sample metrics every 30s
* **Auto-generated events:** NextMyTeam generates collaboration events every 45s
* **Cross-service integration:** APIs communicate with each other
* **Health monitoring:** All services have health checks
* **Caching:** Redis caches frequently accessed data

## Stop

```bash
docker compose -f docker-compose.full.yml down
```

## Reset data

```bash
docker compose -f docker-compose.full.yml down -v
```

## Development

Each API service can be developed independently. The compose setup includes volume mounts for live code changes.

## Monitoring

Watch logs from all services:

```bash
docker compose -f docker-compose.full.yml logs -f
```

Watch specific service:

```bash
docker compose -f docker-compose.full.yml logs -f rightway-api
```
