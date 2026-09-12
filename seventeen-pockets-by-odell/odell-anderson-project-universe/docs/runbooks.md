# Seventeen Pockets - Runbooks

## Runbook 1: Monitor (Pocket 09) Failure Recovery

### Symptoms

* No health checks being performed
* Alerts not being triggered
* Dashboard shows "No Data"

### Detection

* Alert: "Monitor health check failed"
* Prometheus: `monitor_up == 0`
* Grafana: Monitor dashboard offline

### Recovery Steps

**Step 1: Verify Failure (1 min)**

```bash
kubectl get pods -n monitoring | grep monitor
kubectl logs -n monitoring -l app=monitor --tail=50
kubectl describe pod -n monitoring -l app=monitor
```

**Step 2: Check Secondary Region (2 min)**

```bash
# Switch to secondary region
kubectl config use-context eu-west-1
kubectl get pods -n monitoring | grep monitor

# If secondary is healthy, DNS will auto-failover
# If secondary is also down, proceed to Step 3
```

**Step 3: Restart Monitor Pods (3 min)**

```bash
# Delete failed pods to trigger restart
kubectl delete pods -n monitoring -l app=monitor

# Wait for new pods to start
kubectl wait --for=condition=ready pod -l app=monitor -n monitoring --timeout=300s
```

**Step 4: Verify Recovery (2 min)**

```bash
# Check health endpoint
curl http://monitor.default.svc.cluster.local:9090/health

# Check metrics are flowing
kubectl logs -n monitoring -l app=monitor --tail=20

# Verify alerts are being triggered
kubectl get alerts -n monitoring
```

**Step 5: Notify Team (1 min)**

* Send message to #ops-incidents
* Update incident ticket
* Document root cause

### Rollback

If recovery fails:

1. Restore from backup: `kubectl apply -f monitor-backup.yaml`
2. Restore database: `pg_restore -d monitor_db monitor_backup.sql`
3. Restart all services: `kubectl rollout restart deployment/monitor`

### Prevention

* Monitor CPU/memory usage
* Set resource limits
* Enable auto-scaling
* Regular health checks

***

## Runbook 2: Alert System (Pocket 10) Failure Recovery

### Symptoms

* Alerts not being sent
* Slack/Discord/Telegram offline
* No notifications received

### Detection

* Alert: "Alert system health check failed"
* Prometheus: `alert_system_up == 0`
* Manual test: `curl -X POST /api/v1/alert/test`

### Recovery Steps

**Step 1: Verify Failure (1 min)**

```bash
kubectl get pods -n alerts | grep alert
kubectl logs -n alerts -l app=alert-system --tail=50
kubectl describe pod -n alerts -l app=alert-system
```

**Step 2: Test Fallback Channels (2 min)**

```bash
# Test email fallback
kubectl exec -n alerts alert-system-0 -- \
  curl -X POST http://localhost:8001/api/v1/alert/test?severity=critical

# Check if email was sent
kubectl logs -n alerts -l app=alert-system | grep "email"
```

**Step 3: Restart Alert System (3 min)**

```bash
# Delete failed pods
kubectl delete pods -n alerts -l app=alert-system

# Wait for restart
kubectl wait --for=condition=ready pod -l app=alert-system -n alerts --timeout=300s
```

**Step 4: Verify Recovery (2 min)**

```bash
# Test all channels
kubectl exec -n alerts alert-system-0 -- \
  curl -X POST http://localhost:8001/api/v1/alert/test

# Check logs
kubectl logs -n alerts -l app=alert-system --tail=20
```

**Step 5: Notify Team (1 min)**

* Send manual notification to #ops-incidents
* Update incident ticket
* Document root cause

### Rollback

If recovery fails:

1. Restore from backup: `kubectl apply -f alert-system-backup.yaml`
2. Restart services: `kubectl rollout restart deployment/alert-system`
3. Verify channels: `kubectl exec alert-system-0 -- /test-channels.sh`

### Prevention

* Monitor channel health
* Test channels hourly
* Maintain fallback channels
* Regular backup testing

***

## Runbook 3: Recovery System (Pocket 12) Failure Recovery

### Symptoms

* No automatic recovery happening
* Failed services not restarting
* Cascading failures occurring

### Detection

* Alert: "Recovery system health check failed"
* Prometheus: `recovery_system_up == 0`
* Manual check: `kubectl get recovery-jobs`

### Recovery Steps

**Step 1: Verify Failure (1 min)**

```bash
kubectl get pods -n recovery | grep recovery
kubectl logs -n recovery -l app=recovery-system --tail=50
kubectl describe pod -n recovery -l app=recovery-system
```

**Step 2: Check Consensus (2 min)**

```bash
# Check Raft consensus status
kubectl exec -n recovery recovery-system-0 -- \
  curl http://localhost:8002/api/v1/consensus/status

# If quorum lost, manually restore
kubectl exec -n recovery recovery-system-0 -- \
  /restore-consensus.sh
```

**Step 3: Restart Recovery System (3 min)**

```bash
# Delete failed pods
kubectl delete pods -n recovery -l app=recovery-system

# Wait for restart
kubectl wait --for=condition=ready pod -l app=recovery-system -n recovery --timeout=300s
```

**Step 4: Verify Recovery (2 min)**

```bash
# Check consensus
kubectl exec -n recovery recovery-system-0 -- \
  curl http://localhost:8002/api/v1/consensus/status

# Check recovery jobs
kubectl get recovery-jobs -n recovery

# Verify logs
kubectl logs -n recovery -l app=recovery-system --tail=20
```

**Step 5: Notify Team (1 min)**

* Send message to #ops-incidents
* Update incident ticket
* Document root cause

### Rollback

If recovery fails:

1. Restore from backup: `kubectl apply -f recovery-system-backup.yaml`
2. Restore consensus: `kubectl exec recovery-system-0 -- /restore-consensus.sh`
3. Restart services: `kubectl rollout restart deployment/recovery-system`

### Prevention

* Monitor consensus health
* Test recovery procedures
* Maintain backup consensus
* Regular failover drills

***

## Runbook 4: Regional Failover

### Symptoms

* Entire region is down
* All services in region unreachable
* Health checks failing for all pockets

### Detection

* Alert: "Region health check failed"
* Prometheus: `region_up{region=\"us-east-1\"} == 0`
* Manual check: `ping region-health-check.us-east-1.internal`

### Recovery Steps

**Step 1: Verify Region Failure (1 min)**

```bash
# Check all services in region
kubectl config use-context us-east-1
kubectl get nodes
kubectl get pods --all-namespaces

# If all nodes are down, region is failed
```

**Step 2: Trigger Automatic Failover (1 min)**

```bash
# Automatic failover should trigger within 30 seconds
# Monitor DNS propagation
dig api.seventeen-pockets.com

# Should resolve to secondary region IP
```

**Step 3: Verify Secondary Region (2 min)**

```bash
# Switch to secondary region
kubectl config use-context eu-west-1

# Check all services are healthy
kubectl get pods --all-namespaces
kubectl get svc

# Verify data replication
kubectl exec -n data postgres-0 -- \
  psql -c "SELECT * FROM replication_status;"
```

**Step 4: Verify Data Integrity (2 min)**

```bash
# Check replication lag
kubectl exec -n data postgres-0 -- \
  psql -c "SELECT slot_name, restart_lsn FROM pg_replication_slots;"

# Should be <100ms
```

**Step 5: Notify Team (1 min)**

* Send message to #ops-incidents
* Page on-call engineer
* Update status page
* Document incident

### Rollback

When primary region recovers:

1. Verify primary region is healthy
2. Manually trigger failback: `kubectl exec failover-controller -- /failback.sh`
3. Monitor replication
4. Verify all services

### Prevention

* Monitor region health
* Test failover monthly
* Maintain backup regions
* Regular DR drills

***

## Runbook 5: Database Failure Recovery

### Symptoms

* Database connection errors
* Queries timing out
* Data not persisting

### Detection

* Alert: "Database health check failed"
* Prometheus: `postgres_up == 0`
* Application logs: "connection refused"

### Recovery Steps

**Step 1: Verify Failure (1 min)**

```bash
kubectl exec -n data postgres-0 -- \
  psql -c "SELECT 1;"

# If fails, database is down
```

**Step 2: Check Replica (2 min)**

```bash
# Check if replica is healthy
kubectl exec -n data postgres-1 -- \
  psql -c "SELECT 1;"

# If replica is healthy, failover to it
```

**Step 3: Trigger Failover (2 min)**

```bash
# Promote replica to primary
kubectl exec -n data postgres-1 -- \
  pg_ctl promote

# Update connection strings
kubectl set env deployment/api-gateway \
  DATABASE_URL=postgresql://postgres-1:5432/db
```

**Step 4: Verify Recovery (2 min)**

```bash
# Test connections
kubectl exec -n data postgres-1 -- \
  psql -c "SELECT COUNT(*) FROM users;"

# Check replication
kubectl exec -n data postgres-1 -- \
  psql -c "SELECT * FROM pg_stat_replication;"
```

**Step 5: Restore Primary (5 min)**

```bash
# Restart primary pod
kubectl delete pod -n data postgres-0

# Wait for restart
kubectl wait --for=condition=ready pod postgres-0 -n data --timeout=300s

# Rejoin as replica
kubectl exec -n data postgres-0 -- \
  /rejoin-replica.sh
```

### Rollback

If recovery fails:

1. Restore from backup: `pg_restore -d db backup.sql`
2. Restart database: `kubectl rollout restart statefulset/postgres`
3. Verify data: `psql -c "SELECT COUNT(*) FROM users;"`

### Prevention

* Monitor database health
* Test failover monthly
* Maintain backups
* Regular restore testing

***

## Runbook 6: Cascading Failure Recovery

### Symptoms

* Multiple services failing
* Errors cascading through system
* Recovery system overwhelmed

### Detection

* Alert: "Cascading failure detected"
* Prometheus: `error_rate > 50%`
* Multiple service alerts firing

### Recovery Steps

**Step 1: Stop Cascading (1 min)**

```bash
# Enable circuit breakers
kubectl set env deployment/api-gateway \
  CIRCUIT_BREAKER_ENABLED=true

# Reduce traffic
kubectl patch service api-gateway -p \
  '{"spec":{"sessionAffinity":"ClientIP"}}'
```

**Step 2: Identify Root Cause (2 min)**

```bash
# Check logs for first failure
kubectl logs -n default --all-containers=true \
  --timestamps=true | grep ERROR | head -20

# Check metrics
kubectl exec -n monitoring prometheus-0 -- \
  curl 'http://localhost:9090/api/v1/query?query=rate(errors_total[5m])'
```

**Step 3: Isolate Failed Service (2 min)**

```bash
# Scale down failed service
kubectl scale deployment/failed-service --replicas=0

# Reroute traffic
kubectl patch service failed-service -p \
  '{"spec":{"selector":{"app":"fallback"}}}'
```

**Step 4: Recover Services (5 min)**

```bash
# Restart services in order
kubectl rollout restart deployment/pocket-01
kubectl rollout restart deployment/pocket-02
kubectl rollout restart deployment/pocket-03
# ... continue for all pockets

# Wait for each to be ready
kubectl wait --for=condition=ready pod -l app=pocket-01 --timeout=300s
```

**Step 5: Verify Recovery (2 min)**

```bash
# Check error rate
kubectl exec -n monitoring prometheus-0 -- \
  curl 'http://localhost:9090/api/v1/query?query=rate(errors_total[5m])'

# Should be <0.1%
```

**Step 6: Notify Team (1 min)**

* Send message to #ops-incidents
* Page on-call engineer
* Update status page
* Document incident

### Prevention

* Implement circuit breakers
* Set resource limits
* Enable rate limiting
* Regular chaos testing
