---
name: data-operations
description: Data maintenance — cleanup, deprecation, EOL, migrations of data, system health
domain: maintenance
phase: maintenance
priority: medium
inputs: [project-state, data-governance]
outputs: [data-ops]
dependencies: [data/data-governance, development/database]
next_skills: [workflows/production-incident]
---

# Data & Lifecycle Maintenance Operations

The ops side of long-horizon data + lifecycle work (design/governance lives in `data/*` family; scheduled/shutdown work lives here).

## 1. Database Maintenance (the routine care)

- Scheduled: vacuum/analyze (per engine guidance), index-bloat review (per `development/performance-database.md` — unused indexes COST writes; drop-with-evidence per its named-query rule), slow-query review (top-10 weekly per `observability/metrics.md` query metrics → tuned or ticketed)
- Growth watch: table-size trending + retention-policy enforcement (per `data/data-governance-quality.md` §5 — biggest-tables report monthly; runaway growth = data-lifecycle finding, not just ops note)
- Migration hygiene maintenance: migration history auditable; drift between environments = broken (per `development/database.md` versioned-migrations — re-sync via fresh-migrate, never hand-SQL per `core/agent-rules.md` no-guessing)

## 2. Cleanup Operations (the scheduled hygiene)

- Orphaned-data sweeps: files without owning records (per `architecture/infrastructure-designs.md` storage lifecycle + `data/data-governance-quality.md` cleanup rules), stale feature-flag rows (per `development/feature-flags.md` expiry), expired tokens/sessions purge
- Dead-identifier sweeps: unreferenced IDs, soft-deleted past retention, sandbox/test artifacts in prod-shaped envs
- Safe-delete mechanics: every sweep = dry-run-first (report → review → run; per `core/agent-rules.md` irreversible-with-safeguards rule); batched + resumable (per `development/database.md` backfill discipline, applied in reverse — delete-full)
- Evidence: before/after counts + re-run idempotency (per `development/background-services.md` job idempotency — sweeps ARE jobs, all job rules apply)

## 3. Feature Deprecation & Removal (the sunset ops — design side: `product/product-lifecycle.md`; communication side: `maintenance/deprecation.md`)

- Removal staging: usage-instrumented to near-zero (dashboards, not vibes per `product/product-metrics.md` evidence rules) → code removal PR (its own release per `product/release-planning.md` — removals get changelog + migration-guide entries) → data-retirement (the feature's tables → retention per `data/data-governance-quality.md` §5, NOT immediate drop: grace window for restore requests)
- Flag-removal choreography: flag expiry → code-cleanup PR per `development/feature-flags.md` cleanup discipline (dead branches removed = their own reviewable diffs per `development/refactoring.md` mechanical rules)
- Rollback-ability assessment per removal (per `devops/deployment.md` — a removal IS a deploy; its rollback story written before ship)

## 4. Data Migration Operations (the scheduled/policy-driven ones — NOT deploy-coupled schema changes)

- Scope: retention-purge execution, archival to cold storage (per `data/data-governance-quality.md` §5 tiering), backfills for new fields, tenant-data moves (per `platform/platform-services.md` lifecycle)
- Mechanics: batched + checkpointed + observable (per `development/database.md` backfill rules: progress metric, failure-rate, resume-from-point — a data migration that can't resume is a liability); dual-verify (row-counts + sampled content checks per `data/data-governance-quality.md` validation discipline)
- Windows: large ops in maintenance windows per `development/performance-database.md` destructive-ops rules; user-visible ones communicated (per `observability/incident-response.md` comms cadence — planned ≠ silent)

## 5. System Health Review (the monthly deep check)

- Composite review: maintenance debt + `documentation/maintenance.md` health signals + `observability/slo.md` budget-trend + `security/vulnerability-management.md` aging findings — the once-a-month full-body scan (its findings feed each owning skill's queue)
- Capacity confirmation per `devops/backups-scaling-cost.md` forecast (the data-growth angle: projections from trends, orders placed in time)

## Validation Checklist

- [ ] DB routines scheduled; sweeps dry-run-first + idempotent
- [ ] Removals staged (usage→code→data-grace); flags cleaned per expiry
- [ ] Data migrations checkpointed + verified; monthly health review runs

## Handoff

→ findings → owning skills' queues; destructive ops → maintenance windows + comms.
