# Auto-Fix and Auto-Deploy Integration Guide

## Overview

Automated pipeline that detects issues, applies fixes, and deploys updates without manual intervention.

## Quick Start

### 1. Enable Auto-Fix

```bash
# Start auto-fix loop
curl -X POST http://localhost:8002/api/v1/auto-fix/start
```

### 2. Enable Auto-Deploy

```bash
# Deploy new version
curl -X POST http://localhost:8002/api/v1/deploy \
  -H "Content-Type: application/json" \
  -d '{
    "version": "1.2.0",
    "previous_version": "1.1.0",
    "auto_rollback": true
  }'
```

## API Endpoints

### Health Check

```bash
GET /health
```

### Apply Fix

```bash
POST /api/v1/fix
Content-Type: application/json

{
  "issue_id": "issue-123",
  "issue_type": "database_slow_query",
  "pocket": "Data",
  "message": "Slow query detected"
}
```

### Deploy

```bash
POST /api/v1/deploy
Content-Type: application/json

{
  "version": "1.2.0",
  "previous_version": "1.1.0",
  "auto_rollback": true
}
```

### Get Fix History

```bash
GET /api/v1/fix-history?limit=100
```

### Get Deployment History

```bash
GET /api/v1/deployment-history?limit=100
```

### Get Statistics

```bash
GET /api/v1/stats
```

## Deployment Stages

1. **Build**: Docker image creation
2. **Test**: Automated test suite (80% coverage required)
3. **Staging**: Deploy to staging environment
4. **Production Canary**: Deploy to 10% of production
5. **Production**: Full production rollout
6. **Rollback**: Automatic rollback on failure

## Performance

* **Issue Detection**: <30 seconds
* **Fix Application**: <2 minutes
* **Deployment**: <5 minutes
* **Rollback**: <1 minute

## Support

For issues, check logs and deployment history endpoints.
