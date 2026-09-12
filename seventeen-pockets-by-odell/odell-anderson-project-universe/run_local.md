# Run locally (Option B1)

This repo supports a minimum viable local ecosystem run using Docker Compose:

* Postgres
* Redis
* Rightway dashboard (static) served by Nginx

## Requirements

* Docker Desktop (or Docker Engine)
* Docker Compose v2 (`docker compose`)

## One command

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

Open:

* http://localhost:8080

## Stop

```bash
docker compose -f docker-compose.dev.yml down
```
