# Decisions — E-commers-Crm

Decision log. Status: PROPOSED = not yet accepted; ACCEPTED = agreed; SUPERSEDED = replaced; REJECTED.

| ID | Date | Decision | Rationale | Status |
| -- | ---- | -------- | --------- | ------ |
| ADR-001 | 2026-09-17 | NestJS + TypeORM + PostgreSQL for backend | Mature DI, typed entities, migration tooling | PROPOSED |
| ADR-002 | 2026-09-17 | Next.js + React + TanStack Query + shadcn/ui + Tailwind + cmdk | SSR, rich ecosystem, a11y, fast iter | PROPOSED |
| ADR-003 | 2026-09-17 | Redis + BullMQ for caching and background jobs | Proven queue semantics, TTL-safe caching | PROPOSED |
| ADR-004 | 2026-09-17 | Provider-independent AI abstraction | Never couple to OpenAI/Anthropic | PROPOSED |
| ADR-005 | 2026-09-17 | Mandatory `organization_id` on every tenant entity + org-scoped queries | Tenant isolation is non-negotiable | PROPOSED |
| ADR-006 | 2026-09-17 | Backend-only authorization; AI via named tools, never raw SQL | Security must not depend on frontend | PROPOSED |
| ADR-007 | 2026-09-17 | tsvector + GIN for search | Native PG full-text, no extra service | PROPOSED |
| ADR-008 | 2026-09-17 | Payments/billing DEFERRED | Not required by current product scope | PROPOSED |
| ADR-009 | 2026-09-17 | Greenfield build in `/home/sami/E-commers-Crm` | No existing repo found on audit | PROPOSED |

## Convention

- One file per accepted ADR in `docs/decisions/` mirroring the master prompt §3 documentation set. These rows are the index; create detail files when each decision is accepted during build.