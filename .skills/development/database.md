---
name: database-implementation
description: Standards for schema design, migrations, seed data and query safety
phase: development
priority: high
inputs: [database-architecture, requirements]
outputs: [schema, migrations, seed-data]
dependencies: [architecture/database]
next_skills: [testing/integration, devops/deployment]
---

# Database Implementation

## Schema Design

- Model from access patterns: query-first design (how is this data read?), then normalize (3NF default; denormalize only with measured read-win that justifies write-complexity — ADR).
- Every table: PK, `created_at`/`updated_at`, FK constraints with explicit ON DELETE behavior (RESTRICT default; CASCADE only with written justification — cascading deletes are dangerous).
- Constraints ARE integrity: unique, not-null, check constraints — never rely on app code alone for what the DB can enforce.
- Index strategy: index for every FK + frequent predicate; every index justified by a query (no speculative indexing — write cost). Use composite order matching query patterns (most selective first).
- Money → integer minor units or decimal (never float). Timestamps → UTC (store, compare, display-localize).

## Migrations (non-negotiable rules)

1. Migrations are versioned, ordered, immutable once applied to shared envs; never edit an applied migration — write a new one.
2. **Always backward-compatible two-step for breaking changes**:
   - Step 1 (this release): add nullable column/table, dual-write, backfill
   - Step 2 (next release): enforce not-null, remove old column
   - Never drop a column/table in the same release that stops using it.
3. **Zero-downtime rules**: no long locks (add index CONCURRENTLY where supported; batch backfills in chunks); deploy order = expand → migrate → contract.
4. Every migration has a tested **down/rollback** path, or an explicit "irreversible: reason" note (irreversible ones require human sign-off).
5. Single-threaded authorship (see `core/multi-agent.md`): migrations are serialized, one agent owns the migration queue at a time.

## Query Safety

- No string-concatenated SQL — parameterized/ORM only (see `security/input-validation.md`).
- N+1 check: trace query count per request path in dev/tests (fail on N+1 in hot paths).
- Every transaction: shortest scope; no external I/O inside (see `development/backend.md`).
- Pagination everywhere; no unbounded `SELECT *`.

## Seed Data

- Deterministic seed for dev/test envs; clearly marked as seed (never in prod); covers representative + edge entities (empty strings, unicode, max lengths).

## Validation Checklist

- [ ] Constraints enforce integrity (not just app code)
- [ ] Migrations backward-compatible (two-step for breaking)
- [ ] Rollback tested or irreversible-approved
- [ ] No N+1 in hot paths (measured)
- [ ] No unbounded queries

## Handoff

→ `testing/integration.md`; `devops/deployment.md` (migration-in-deploy procedures).
