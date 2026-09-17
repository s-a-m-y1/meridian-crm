---
name: backend-architecture
description: Design backend architecture — layering, services, jobs, queues, integrations
phase: architecture
priority: high
inputs: [system-design, requirements-specification]
outputs: [backend-architecture-document]
dependencies: [system-design]
next_skills: [development/backend, api-architecture]
---

# Backend Architecture

## Workflow

1. Define the **layered structure** (dependencies point one way — up only):

   ```
   Controller (HTTP: validate, map, respond — no business logic)
      ↓
   Service (business logic, transactions, orchestration — no HTTP, no SQL)
      ↓
   Repository (data access, query construction — no business logic)
   ```

   Rationale: each layer testable in isolation (unit → service; integration → repo+DB; API → contract).

2. Map **domains** from PRD (auth, billing, …) → modules with clear ownership; a modular monolith uses package boundaries to enforce domain seams.
3. Design **background jobs & queues**:
   - Anything > 500ms or retry-worthy → async queue
   - Every job: idempotent, retry policy with backoff, dead-letter after N, visibility in observability
   - Queue tech: start with DB-backed queue; move to broker when volume/reliability demands (ADR required)
4. **External integrations** — each wrapped in an adapter with: timeout, circuit breaker, retry, fallback behavior, contract tests against the real API (sandbox).
5. **Webhooks** — in and out: signature verification (in), signed delivery + retry with backoff (out).
6. Cross-cutting: config loading (env-only, validated at boot), structured logging, error taxonomy (→ `observability/logging.md`).
7. Emit service diagrams (C3) for domains with non-obvious flows.

## Validation Checklist

- [ ] No layer-skipping (controller calling repo = violation)
- [ ] Every job idempotent + dead-lettered
- [ ] Every integration has timeout/circuit breaker/fallback
- [ ] Error taxonomy defined

## Handoff

→ `development/backend.md` (implementation standards), `architecture/api.md` (HTTP contracts).
