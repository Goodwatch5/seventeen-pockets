# Seventeen Pockets - Architecture Diagrams & Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SEVENTEEN POCKETS ECOSYSTEM                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   LOAD BALANCER (HA)                      │   │
│  │              us-east-1 | eu-west-1 | ap-se-1             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
│  ┌──────────────────────────┴──────────────────────────────┐   │
│  │                    API GATEWAY                           │   │
│  │  (3 replicas per region, auto-scaling 2-10)             │   │
│  └──────────────────────────┬──────────────────────────────┘   │
│                              │                                    │
│  ┌──────────────────────────┴──────────────────────────────┐   │
│  │                  TWELVE POCKETS                          │   │
│  │                                                           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │   │
│  │  │  Pocket 01  │  │  Pocket 02  │  │  Pocket 03  │     │   │
│  │  │   Nexus     │  │Intelligence │  │    Data     │     │   │
│  │  │ (Viz/Dash)  │  │  (ML/Stats) │  │  (Database) │     │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │   │
│  │                                                           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │   │
│  │  │  Pocket 04  │  │  Pocket 05  │  │  Pocket 06  │     │   │
│  │  │ Automation  │  │  Pipeline   │  │ Monitoring  │     │   │
│  │  │ (Workflow)  │  │   (CI/CD)   │  │  (Health)   │     │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │   │
│  │                                                           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │   │
│  │  │  Pocket 07  │  │  Pocket 08  │  │  Pocket 09  │     │   │
│  │  │    Docs     │  │   Gateway   │  │  Monitor    │     │   │
│  │  │  (Knowledge)│  │  (Routing)  │  │  (Uptime)   │     │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │   │
│  │                                                           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │   │
│  │  │  Pocket 10  │  │  Pocket 11  │  │  Pocket 12  │     │   │
│  │  │   Alert     │  │  Auto-Fix   │  │  Recovery   │     │   │
│  │  │(Notif/Slack)│  │  (Deploy)   │  │  (Healing)  │     │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │   │
│  │                                                           │   │
│  │  ┌─────────────┐  ┌─────────────┐                       │   │
│  │  │  Pocket 13  │  │  Pocket 14  │                       │   │
│  │  │  Multimodal │  │   (Future)  │                       │   │
│  │  │  (Vision)   │  │             │                       │   │
│  │  └─────────────┘  └─────────────┘                       │   │
│  │                                                           │   │
│  └───────────────────────────────────────────────────────────┘   │
│                              │                                    │
│  ┌──────────────────────────┴──────────────────────────────┐   │
│  │              SHARED INFRASTRUCTURE                       │   │
│  │                                                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │  PostgreSQL  │  │    Redis     │  │   Vault      │  │   │
│  │  │  (3 regions) │  │  (3 regions) │  │  (3 regions) │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  │                                                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │  Prometheus  │  │   Grafana    │  │  ELK Stack   │  │   │
│  │  │ (Monitoring) │  │ (Dashboards) │  │   (Logs)     │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  │                                                           │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
User Request
    │
    ▼
┌─────────────────────┐
│  Load Balancer      │ (HA across 3 regions)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  API Gateway        │ (Rate limiting, auth)
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌────────┐   ┌────────┐
│Pocket  │   │Pocket  │ (Route based on path)
│ 01-14  │   │ 01-14  │
└────┬───┘   └───┬────┘
     │           │
     └─────┬─────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌────────┐   ┌────────┐
│Database│   │ Cache  │ (Read/Write)
│(Pocket │   │(Redis) │
│  03)   │   └────────┘
└────────┘
     │
     ▼
┌─────────────────────┐
│  Monitoring         │ (Pocket 09)
│  - Metrics          │
│  - Logs             │
│  - Traces           │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌────────┐   ┌────────┐
│Alert   │   │Recovery│ (Pocket 10 & 12)
│System  │   │System  │
└────────┘   └────────┘
```

## Network Topology

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERNET                                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │   CloudFlare / CDN             │
        │   (DDoS Protection)            │
        └────────────────┬───────────────┘
                         │
        ┌────────────────┴───────────────┐
        │                                │
        ▼                                ▼
┌──────────────────┐          ┌──────────────────┐
│  us-east-1       │          │  eu-west-1      │
│  (Primary)       │          │  (Secondary)     │
│                  │          │                  │
│ ┌──────────────┐ │          │ ┌──────────────┐ │
│ │ Load Balancer│ │          │ │ Load Balancer│ │
│ └──────┬───────┘ │          │ └──────┬───────┘ │
│        │         │          │        │         │
│ ┌──────▼───────┐ │          │ ┌──────▼───────┐ │
│ │ API Gateway  │ │          │ │ API Gateway  │ │
│ └──────┬───────┘ │          │ └──────┬───────┘ │
│        │         │          │        │         │
│ ┌──────▼───────┐ │          │ ┌──────▼───────┐ │
│ │ Pockets 1-14 │ │          │ │ Pockets 1-14 │ │
│ │ (3 replicas) │ │          │ │ (2 replicas) │ │
│ └──────┬───────┘ │          │ └──────┬───────┘ │
│        │         │          │        │         │
│ ┌──────▼───────┐ │          │ ┌──────▼───────┐ │
│ │ PostgreSQL   │ │          │ │ PostgreSQL   │ │
│ │ (Primary)    │ │◄─────────┼─┤ (Replica)    │ │
│ └──────────────┘ │          │ └──────────────┘ │
│                  │          │                  │
│ ┌──────────────┐ │          │ ┌──────────────┐ │
│ │ Redis        │ │          │ │ Redis        │ │
│ │ (Primary)    │ │◄─────────┼─┤ (Replica)    │ │
│ └──────────────┘ │          │ └──────────────┘ │
│                  │          │                  │
└──────────────────┘          └──────────────────┘
        │                              │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  ap-southeast-1              │
        │  (Tertiary / DR)             │
        │                              │
        │ ┌──────────────────────────┐ │
        │ │ Pockets 1-14             │ │
        │ │ (1 replica each)         │ │
        │ └──────────────────────────┘ │
        │                              │
        │ ┌──────────────────────────┐ │
        │ │ PostgreSQL (Replica)     │ │
        │ │ Redis (Replica)          │ │
        │ └──────────────────────────┘ │
        └──────────────────────────────┘
```

## Disaster Recovery Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  DISASTER RECOVERY FLOW                      │
└─────────────────────────────────────────────────────────────┘

Scenario 1: Single Pod Failure
  Pod Crash
    │
    ▼ (10s)
  Health Check Fails
    │
    ▼ (10s)
  Alert Triggered
    │
    ▼ (5s)
  Kubernetes Restarts Pod
    │
    ▼ (5s)
  Service Restored
  Total: ~30 seconds

Scenario 2: Single Node Failure
  Node Crash
    │
    ▼ (10s)
  Health Check Fails
    │
    ▼ (10s)
  Alert Triggered
    │
    ▼ (30s)
  Pods Rescheduled to Other Nodes
    │
    ▼ (30s)
  Service Restored
  Total: ~2 minutes

Scenario 3: Region Failure
  Region Down
    │
    ▼ (10s)
  Health Checks Fail
    │
    ▼ (10s)
  Alert Triggered
    │
    ▼ (30s)
  DNS Failover to Secondary Region
    │
    ▼ (2m)
  Connections Rerouted
    │
    ▼ (1m)
  Service Restored
  Total: ~5 minutes

Scenario 4: Database Failure
  Database Crash
    │
    ▼ (10s)
  Connection Pool Detects Failure
    │
    ▼ (10s)
  Alert Triggered
    │
    ▼ (20s)
  Failover to Replica
    │
    ▼ (10s)
  Connections Rerouted
    │
    ▼ (10s)
  Service Restored
  Total: ~1 minute
```

## Failover Scenarios

```
┌─────────────────────────────────────────────────────────────┐
│                  FAILOVER SCENARIOS                          │
└─────────────────────────────────────────────────────────────┘

Automatic Failover (us-east-1 → eu-west-1):
  ✓ Triggered automatically
  ✓ No manual intervention needed
  ✓ DNS updated within 30 seconds
  ✓ Data replicated in real-time
  ✓ Zero data loss

Automatic Failover (eu-west-1 → ap-southeast-1):
  ✓ Triggered automatically
  ✓ No manual intervention needed
  ✓ DNS updated within 30 seconds
  ✓ Data replicated in real-time
  ✓ Zero data loss

Manual Failover (ap-southeast-1 → us-east-1):
  ⚠ Requires manual approval
  ⚠ Initiated by on-call engineer
  ⚠ DNS updated within 30 seconds
  ⚠ Data replicated in real-time
  ⚠ Zero data loss

Cascading Failure Recovery:
  1. Detect primary region failure
  2. Failover to secondary region
  3. If secondary fails, failover to tertiary
  4. If tertiary fails, activate manual recovery
  5. Restore from backups if needed
```

## Cost Allocation

```
┌─────────────────────────────────────────────────────────────┐
│                  COST ALLOCATION                             │
└─────────────────────────────────────────────────────────────┘

Monthly Budget: $5,000

Compute (40%): $2,000
  - Kubernetes cluster: $1,200
  - Load balancers: $400
  - Auto-scaling: $400

Storage (20%): $1,000
  - Database: $600
  - Backups: $300
  - Logs: $100

Network (15%): $750
  - Data transfer: $500
  - CDN: $250

Services (15%): $750
  - Monitoring: $300
  - Logging: $250
  - Security: $200

Reserved Instances (10%): $500
  - 40% reserved
  - 30% spot
  - 30% on-demand

Optimization Targets:
  ✓ Cost per request: <$0.001
  ✓ Cost per user: <$0.10
  ✓ Cost per transaction: <$0.01
```
