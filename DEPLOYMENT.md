# Meridian CRM — Deployment Guide

> **Implementation status:** Only the Docker Compose environments below are
> actually implemented and tested today. The Kubernetes, CI/CD auto-deploy,
> monitoring, and scaling sections further down are **planned but not yet
> implemented** (see `.ai/project-state.md`). Treat them as a roadmap, not
> working infrastructure.

## Quick Start with Docker Compose

### Development
```bash
# Start development environment with hot reload
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop
docker-compose -f docker-compose.dev.yml down
```

### Production
```bash
# Copy environment file and configure
cp .env.example .env
# Edit .env with your production values

# Build and start
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop
docker-compose -f docker-compose.prod.yml down
```

## Kubernetes Deployment

> **Status: planned, not yet implemented.** The `k8s/` manifests exist but have
> not been deployed or validated on any cluster. Verify each step works before
> relying on it.

### Prerequisites
- Kubernetes cluster (v1.25+)
- kubectl configured
- cert-manager installed for TLS
- NGINX Ingress Controller installed
- Container registry access (GHCR)

### Deploy to Staging
```bash
# Apply staging overlay
kubectl apply -k k8s/overlays/staging

# Check status
kubectl get all -n crm-staging
```

### Deploy to Production
```bash
# Apply production overlay
kubectl apply -k k8s/overlays/production

# Check status
kubectl get all -n crm
```

### Update Deployments
```bash
# Update images
kubectl set image deployment/backend backend=ghcr.io/your-org/crm-backend:new-tag -n crm
kubectl set image deployment/frontend frontend=ghcr.io/your-org/crm-frontend:new-tag -n crm

# Or use kustomize
kubectl apply -k k8s/overlays/production
```

## CI/CD Pipeline

> **Status: planned, not yet implemented.** Auto-deploy on push (steps 4-5
> below) is not wired up yet — CI currently runs tests/builds only. Do not
> assume pushes to `main` reach production.

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) handles:

1. **Backend Tests**: Lint, typecheck, unit tests, e2e tests
2. **Frontend Tests**: Lint, typecheck, unit tests, e2e tests
3. **Build & Push**: Multi-arch Docker images to GHCR
4. **Deploy Staging**: Auto-deploy on push to `develop`
5. **Deploy Production**: Auto-deploy on push to `main`

### Required Secrets
Configure these in GitHub repository settings:
- `GITHUB_TOKEN` (automatic)
- Container registry credentials (if not using GHCR)

## Environment Variables

See `.env.example` for all required variables. Key variables:

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | Min 32 chars, used for access tokens |
| `REFRESH_SECRET` | Min 32 chars, used for refresh tokens |
| `PGPASSWORD` | PostgreSQL password |
| `REDIS_PASSWORD` | Redis password |
| `OPENAI_API_KEY` | OpenAI API key for AI features |
| `ANTHROPIC_API_KEY` | Anthropic API key for AI features |

## Health Checks

All services expose health endpoints:
- Backend: `GET /health/liveness`, `GET /health/readiness`
- Frontend: `GET /`
- Database: `pg_isready`
- Redis: `redis-cli ping`

## Monitoring

> **Status: planned.** Prometheus scraping is not wired up yet; the metrics
> endpoint exists but nobody is consuming it.

Prometheus metrics available at:
- Backend: `GET /metrics` (port 4000)

## SSL/TLS

Production uses Let's Encrypt via cert-manager:
```bash
# Install cert-manager (check https://cert-manager.io/docs/installation/
# for the CURRENT version before running — the pin below may be stale)
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer
kubectl apply -f k8s/cert-manager/cluster-issuer.yaml
```

## Backup & Recovery

> **Database choice:** This guide assumes **self-hosted PostgreSQL and Redis
> running in-cluster** (StatefulSets). This is a deliberate cost/on-prem
> decision, but it means you own backups, failover, and upgrades yourself.
> If you switch to a managed database (RDS, Cloud SQL, ElastiCache, etc.),
> replace the commands below with your provider's tooling.

### Database Backup
```bash
# Backup
kubectl exec -n crm postgres-0 -- pg_dump -U $PGUSER $PGDATABASE > backup.sql

# Restore
kubectl exec -i -n crm postgres-0 -- psql -U $PGUSER $PGDATABASE < backup.sql
```

### Redis Backup
```bash
# Backup
kubectl exec -n crm redis-0 -- redis-cli --rdb /data/dump.rdb
kubectl cp crm/redis-0:/data/dump.rdb ./redis-backup.rdb

# Restore
kubectl cp ./redis-backup.rdb crm/redis-0:/data/dump.rdb
kubectl exec -n crm redis-0 -- redis-cli --rdb /data/dump.rdb
```

## Scaling

Manual scaling:
```bash
kubectl scale deployment backend --replicas=5 -n crm
kubectl scale deployment frontend --replicas=5 -n crm
```

Auto-scaling configured via HPA (CPU/memory based).

## Troubleshooting

### Check logs
```bash
# Backend
kubectl logs -n crm -l app=backend -f

# Frontend
kubectl logs -n crm -l app=frontend -f

# Database
kubectl logs -n crm -l app=postgres -f
```

### Debug pod
```bash
kubectl exec -it -n crm backend-xxx -- sh
kubectl exec -it -n crm frontend-xxx -- sh
```

### Database issues
```bash
# Check connections
kubectl exec -n crm postgres-0 -- psql -U $PGUSER -d $PGDATABASE -c "SELECT * FROM pg_stat_activity;"

# Check migrations
kubectl exec -n crm backend-xxx -- npm run migration:status
```

## Security Checklist

- [ ] All secrets rotated from defaults
- [ ] JWT secrets are 32+ characters
- [ ] Database SSL enabled
- [ ] Redis password set
- [ ] CORS restricted to your domain
- [ ] Rate limiting configured
- [ ] CSP headers enabled
- [ ] HSTS enabled (production)
- [ ] Audit logging enabled
- [ ] Regular security scans scheduled

## Support

For issues, check:
1. Application logs
2. Kubernetes events: `kubectl get events -n crm --sort-by='.lastTimestamp'`
3. GitHub Actions workflow logs
4. Database/Redis health checks