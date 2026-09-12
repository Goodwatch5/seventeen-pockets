# Seventeen Pocket Ecosystem - Integration Guide

## Overview

This guide details how all seventeen pockets integrate and communicate within the unified ecosystem.

## Architecture

### Layered Design

```
┌─────────────────────────────────────────┐
│     Presentation Layer (Dashboard)      │ Pocket 6
├─────────────────────────────────────────┤
│     Application Layer (Automation)      │ Pocket 4
├─────────────────────────────────────────┤
│     Reasoning Layer (DeepAgent)         │ Pocket 10
├─────────────────────────────────────────┤
│     Service Layer (APIs & Services)     │ Pockets 16, 11, 12, 13, 14
├─────────────────────────────────────────┤
│     Data Layer (Database)               │ Pocket 7
├─────────────────────────────────────────┤
│     Infrastructure Layer (Ansible)      │ Pocket 17
└─────────────────────────────────────────┘
```

## Pocket Dependencies

### Core Dependencies

* **All Pockets** → Pocket 1 (Identity) for authentication
* **All Pockets** → Pocket 7 (Database) for data persistence
* **All Pockets** → Pocket 4 (Automation) for workflow orchestration

### Service Dependencies

* Pocket 6 (Dashboard) ← Pocket 10 (DeepAgent) for analytics
* Pocket 11 (Solar) ← Pocket 4 (Automation) for scheduling
* Pocket 14 (NextMyTeam) ← Pocket 1 (Identity) for user management

## API Contracts

### Authentication Endpoint (Pocket 1)

```
POST /api/v1/auth/token
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}

Response: { "token": "jwt_token", "expires_in": 3600 }
```

### Data Query Endpoint (Pocket 7)

```
GET /api/v1/data/query
Authorization: Bearer {token}
Content-Type: application/json

{
  "pocket_id": "integer",
  "query": "string"
}

Response: { "data": [...], "count": integer }
```

### Automation Trigger (Pocket 4)

```
POST /api/v1/automation/trigger
Authorization: Bearer {token}
Content-Type: application/json

{
  "workflow_id": "string",
  "parameters": {...}
}

Response: { "execution_id": "string", "status": "queued" }
```

## Event Flow

### Example: User Authentication to Dashboard

1. User submits credentials to Pocket 1 (Identity)
2. Pocket 1 validates and returns JWT token
3. User requests dashboard data with token
4. Pocket 6 (Dashboard) validates token with Pocket 1
5. Pocket 6 queries Pocket 7 (Database) for metrics
6. Pocket 10 (DeepAgent) processes analytics
7. Pocket 6 renders visualization

## Configuration Management

### Environment Variables

```bash
# Pocket 1 - Identity
IDENTITY_DB_URL=postgresql://...
IDENTITY_JWT_SECRET=...

# Pocket 7 - Database
DATABASE_URL=postgresql://...
DATABASE_POOL_SIZE=20

# Pocket 4 - Automation
AUTOMATION_QUEUE_URL=redis://...
AUTOMATION_WORKERS=4

# Pocket 10 - DeepAgent
DEEPAGENT_MODEL_PATH=...
DEEPAGENT_TIMEOUT=300
```

## Deployment Sequence

1. **Infrastructure** (Pocket 17 - Ansible)
   * Provision servers and networks
   * Configure load balancers
2. **Data Layer** (Pocket 7 - Database)
   * Initialize databases
   * Run migrations
3. **Core Services** (Pockets 1, 4, 10)
   * Deploy identity service
   * Deploy automation engine
   * Deploy reasoning engine
4. **Application Services** (Pockets 11-16)
   * Deploy all service pockets
   * Register with service discovery
5. **Presentation** (Pocket 6 - Dashboard)
   * Deploy dashboard
   * Configure data sources

## Monitoring & Health Checks

### Health Endpoint (All Pockets)

```
GET /health

Response: {
  "status": "healthy",
  "pocket_id": "integer",
  "version": "string",
  "dependencies": {
    "identity": "healthy",
    "database": "healthy",
    "automation": "healthy"
  }
}
```

## Troubleshooting

### Common Issues

1. **Authentication Failures**
   * Check Pocket 1 (Identity) service status
   * Verify JWT secret configuration
   * Check token expiration
2. **Data Access Issues**
   * Verify Pocket 7 (Database) connectivity
   * Check database permissions
   * Review query logs
3. **Workflow Failures**
   * Check Pocket 4 (Automation) queue status
   * Review workflow definitions
   * Check resource availability

## Version Management

* **Ecosystem Version**: 3.0
* **API Version**: v1
* **Compatibility**: Backward compatible with 2.x
