# Deployment — E-commers-Crm

Status: PLANNED. Execution in Phase 15.

## Containers (Docker Compose)

- backend (NestJS)
- frontend (Next.js)
- worker (BullMQ)
- postgres (PostgreSQL 16)
- redis (Redis 7)

## Requirements

- Health checks per container; migrations run as part of deploy.
- Env vars via env files / secrets manager — never in Dockerfiles, never committed.
- Restart policies, logging, resource limits.
- Backup strategy + retention + restore procedure; restore must be verified before considered verified.
- CI/CD pipeline: install → lint → typecheck → unit → integration → build → E2E (where env permits) → security checks. No deploy on failed critical checks.

## Open Questions

- Deployment target (cloud/VPS) — see `KNOWN_ISSUES.md` K-006.
- Env/provider credentials for AI, email, WhatsApp.