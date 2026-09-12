# Seventeen Pocket Ecosystem - Deployment Guide

## Prerequisites

* Docker & Docker Compose
* Kubernetes cluster (optional, for production)
* PostgreSQL 13+
* Redis 6+
* Node.js 18+
* Python 3.9+

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://gitlab.com/feetfirst2/17-pockets-left-brand.git
cd 17-pockets-left-brand
```

### 2. Environment Configuration

```bash
cp .env.example .env
# Edit .env with your local settings
```

### 3. Start Services

```bash
docker-compose up -d
```

### 4. Initialize Database

```bash
docker-compose exec database psql -U postgres -f /init/schema.sql
```

### 5. Verify Services

```bash
curl http://localhost:3000/health
```

## Production Deployment

### Using Ansible (Pocket 17)

```bash
cd praefect-ansible-scripts
ansible-playbook deploy-ecosystem.yml -i inventory/production
```

### Using Kubernetes

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmaps/
kubectl apply -f k8s/secrets/
kubectl apply -f k8s/deployments/
kubectl apply -f k8s/services/
```

## Service Deployment Order

### Phase 1: Infrastructure

```bash
# Deploy database and cache
kubectl apply -f k8s/deployments/database.yaml
kubectl apply -f k8s/deployments/redis.yaml

# Wait for readiness
kubectl wait --for=condition=ready pod -l app=database --timeout=300s
kubectl wait --for=condition=ready pod -l app=redis --timeout=300s
```

### Phase 2: Core Services

```bash
# Deploy identity service
kubectl apply -f k8s/deployments/identity.yaml

# Deploy automation engine
kubectl apply -f k8s/deployments/automation.yaml

# Deploy reasoning engine
kubectl apply -f k8s/deployments/deepagent.yaml
```

### Phase 3: Application Services

```bash
# Deploy all service pockets
kubectl apply -f k8s/deployments/services/
```

### Phase 4: Presentation

```bash
# Deploy dashboard
kubectl apply -f k8s/deployments/dashboard.yaml
```

## Configuration Management

### Secrets

```bash
kubectl create secret generic ecosystem-secrets \
  --from-literal=jwt-secret=$(openssl rand -base64 32) \
  --from-literal=db-password=$(openssl rand -base64 32) \
  --from-literal=api-key=$(openssl rand -base64 32)
```

### ConfigMaps

```bash
kubectl create configmap ecosystem-config \
  --from-file=config/
```

## Health Checks

### Verify All Services

```bash
#!/bin/bash

echo "Checking ecosystem health..."

services=(
  "identity:3001"
  "automation:3002"
  "deepagent:3003"
  "database:5432"
  "redis:6379"
  "dashboard:3000"
)

for service in "${services[@]}"; do
  host=$(echo $service | cut -d: -f1)
  port=$(echo $service | cut -d: -f2)
  
  if nc -z $host $port; then
    echo "✓ $service is running"
  else
    echo "✗ $service is NOT running"
  fi
done
```

## Monitoring

### Prometheus Metrics

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'ecosystem'
    static_configs:
      - targets: ['localhost:9090']
```

### Logging

```bash
# View logs for all services
kubectl logs -f -l app=ecosystem --all-containers=true

# View logs for specific service
kubectl logs -f deployment/identity
```

## Scaling

### Horizontal Scaling

```bash
# Scale automation service to 3 replicas
kubectl scale deployment automation --replicas=3

# Scale dashboard to 2 replicas
kubectl scale deployment dashboard --replicas=2
```

### Resource Limits

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

## Backup & Recovery

### Database Backup

```bash
kubectl exec -it pod/database -- pg_dump -U postgres > backup.sql
```

### Database Restore

```bash
kubectl exec -it pod/database -- psql -U postgres < backup.sql
```

## Troubleshooting

### Service Won't Start

```bash
# Check pod status
kubectl describe pod <pod-name>

# Check logs
kubectl logs <pod-name>

# Check events
kubectl get events --sort-by='.lastTimestamp'
```

### Database Connection Issues

```bash
# Test database connectivity
kubectl run -it --rm debug --image=postgres:13 --restart=Never -- \
  psql -h database -U postgres -c "SELECT 1"
```

## Rollback

```bash
# Rollback to previous deployment
kubectl rollout undo deployment/identity

# Check rollout history
kubectl rollout history deployment/identity
```

## Post-Deployment

1. Run integration tests
2. Verify all health checks pass
3. Monitor metrics for 24 hours
4. Document any issues
5. Update runbooks
