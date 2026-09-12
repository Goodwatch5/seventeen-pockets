# Automatic Deployment Guide

## Quick Start (Automated)

### Option 1: GitLab CI/CD (Recommended)

1. **Trigger deployment** via GitLab UI:
   * Go to CI/CD → Pipelines
   * Click "Run Pipeline"
   * Select `main` branch
   * Click "Run Pipeline"
   * Find the `deploy_ecosystem` job and click "Play" ▶️
2. **Monitor deployment**:
   * Watch the job logs for real-time progress
   * Ecosystem runs live in CI for 30 minutes
   * All health checks and integration tests included

### Option 2: Local Auto-Deploy Script

```bash
# Make script executable
chmod +x scripts/auto-deploy.sh

# Run automatic deployment
./scripts/auto-deploy.sh
```

### Option 3: Manual Docker Compose

```bash
# Start full ecosystem
docker compose -f docker-compose.full.yml up -d --build

# Wait 60 seconds, then access:
# http://localhost:8080
```

## What Gets Deployed

### Services

* **PostgreSQL** (port 5432) - Shared database
* **Redis** (port 6379) - Caching layer
* **Rightway API** (port 3001) - Platform configuration
* **Orchestration API** (port 3002) - Job workflows
* **Metrics API** (port 3003) - Data collection
* **Collaboration API** (port 3004) - Team events
* **Dashboard** (port 8080) - Frontend interface

### Features

* ✅ **Real data connections** between all services
* ✅ **Auto-generated sample data** (metrics + events)
* ✅ **Health monitoring** with automatic checks
* ✅ **Professional UI** with proper images
* ✅ **Cross-service integration** (APIs communicate)
* ✅ **Live updates** every 30-45 seconds

## Access Points

| Service            | URL                                  | Description                                |
| ------------------ | ------------------------------------ | ------------------------------------------ |
| **Main Dashboard** | http://localhost:8080                | Original Seventeen Pockets interface       |
| **Ecosystem View** | http://localhost:8080/ecosystem.html | Modern ecosystem overview                  |
| **Rightway API**   | http://localhost:3001/health         | Platform API health                        |
| **Orchestration**  | http://localhost:3002/health         | Workflow engine health                     |
| **Metrics**        | http://localhost:3003/health         | Data collection health                     |
| **Collaboration**  | http://localhost:3004/health         | Team events health                         |
| **Database**       | localhost:5432                       | PostgreSQL (ecosystem/ecosystem\_password) |
| **Cache**          | localhost:6379                       | Redis                                      |

## Monitoring

### View Logs

```bash
# All services
docker compose -f docker-compose.full.yml logs -f

# Specific service
docker compose -f docker-compose.full.yml logs -f rightway-api
```

### Check Status

```bash
# Container status
docker compose -f docker-compose.full.yml ps

# Health checks
curl http://localhost:8080/api/platform/full-status
```

## Troubleshooting

### Services Won't Start

```bash
# Check Docker is running
docker info

# Clean restart
docker compose -f docker-compose.full.yml down -v
docker compose -f docker-compose.full.yml up -d --build
```

### Port Conflicts

If ports are in use, stop conflicting services:

```bash
# Check what's using ports
lsof -i :8080
lsof -i :5432
lsof -i :6379

# Kill processes if needed
sudo kill -9 <PID>
```

### Reset Everything

```bash
# Complete reset (removes all data)
docker compose -f docker-compose.full.yml down -v
docker system prune -f
docker volume prune -f

# Fresh start
docker compose -f docker-compose.full.yml up -d --build
```

## Development

### Live Code Changes

The compose setup includes volume mounts for development:

* `./api` → Container `/app/api`
* `./dashboard` → Container `/app/dashboard`

Changes to these directories will be reflected in running containers.

### Database Access

```bash
# Connect to PostgreSQL
docker exec -it $(docker compose -f docker-compose.full.yml ps -q postgres) psql -U ecosystem -d ecosystem

# Connect to Redis
docker exec -it $(docker compose -f docker-compose.full.yml ps -q redis) redis-cli
```

## Production Notes

⚠️ **This setup is for development/demo purposes**

For production deployment:

* Use proper secrets management
* Configure SSL/TLS
* Set up proper monitoring
* Use production-grade database hosting
* Configure proper networking and security

## Support

If deployment fails:

1. Check the auto-deploy script logs
2. Verify Docker Desktop is running
3. Ensure ports 3001-3004, 5432, 6379, 8080 are available
4. Try the manual Docker Compose method
5. Check GitLab CI/CD pipeline logs for detailed error information
