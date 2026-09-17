# Architecture — E-commers-Crm

## Overview

A production-grade, multi-tenant Real Estate CRM with an optional AI intelligence layer. The CRM (organizations, users, teams, leads, customers, properties, deals, pipeline, tasks, activities, notes, search, dashboards, analytics) is fully functional with AI disabled. AI (assistant, lead scoring, summaries, next actions, forecasting, copilot, daily briefing) operates only through a permission-gated tool layer.

Planned greenfield build in `/home/sami/E-commers-Crm`. No existing code as of 2026-09-17.

## Containers (target)

| Container | Responsibility | Tech | Owner |
| --------- | -------------- | ---- | ----- |
| Backend API | CRM domain logic, auth, authorization, validation, search, AI orchestration | NestJS + TypeORM | Agent 1 |
| Frontend | CRM UI, dashboards, Kanban, AI components, RTL | Next.js + React + TanStack Query + shadcn/ui + Tailwind | Agent 2 |
| AI Engine | Provider abstraction, tools, scoring, forecasting, briefing jobs | NestJS module (`src/ai`) | Agent 3 |
| Worker | BullMQ jobs: daily briefing, neglect detection, matview refresh, scoring | BullMQ worker | Agent 3/5 |
| PostgreSQL | Primary data store | PostgreSQL 16 | Agent 1 |
| Redis | Caching + BullMQ broker | Redis 7 | Agent 5 |
| Docker | Containerized deploy (backend, frontend, worker, postgres, redis) | Docker + Compose | Agent 5 |

## Key Decisions

See `docs/DECISIONS.md` for the ADR index.

- Multi-tenant with mandatory `organization_id` on every tenant-owned entity.
- Backend authorization only; frontend permission checks are UX, not security.
- AI never touches SQL directly — named tools with AuthContext validation.
- Provider-independent AI abstraction; never coupled to a single vendor.
- PostgreSQL tsvector + GIN for search; Redis for cache and queues only where correctness allows.

## Data Flows (planned)

1. **Request lifecycle**: Auth (JWT) → tenant context → controller → service → DB (scoped by org) → response.
2. **AI tool call**: chat → trace ID → tool registry → AuthContext check → scoped query → minimal response → usage log.
3. **Background jobs**: schedule/event → BullMQ → worker → idempotent execution → log + usage/audit.
4. **Search**: tsvector columns updated via triggers → GIN index → scoped queries.

## Cross-Cutting

- Auth: JWT + refresh, argon2/bcrypt hashing, rate limiting, brute-force protection.
- Observability: structured logs, per-AI-request cost/token/latency, trace IDs.
- Audit log for permission changes, AI writes, deletions, exports.
- Error taxonomy: never leak stack traces; consistent API error shape.

## Operational Notes

- Redis outage must degrade gracefully (no cache = correct reads still work).
- Backups defined but restore verification required before claiming verified.
- Performance: pagination everywhere, index by org + owner, avoid N+1, pool connections.

## Validation

- [ ] C1/C2 matches deployed containers (once deployed)
- [ ] ADR index current
- [ ] Failure modes documented per container