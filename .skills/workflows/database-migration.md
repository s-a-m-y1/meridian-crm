---
name: workflow-database-migration
description: Execute database migrations safely — plan, backup, migrate, verify, rollback-ready
domain: workflows
phase: development
priority: high
inputs: [migration-request]
outputs: [migrated-database, evidence]
dependencies: [development/database, devops/deployment]
next_skills: [testing/integration]
---

# Workflow: Database Migration

```
1.  Classify         → additive / destructive / backfill / index / type-change
                       (destructive+type = highest care; rename = expand/contract pair per development/database.md)
2.  Design           → development/database.md rules: two-step for breaking (add-nullable → backfill → enforce);
                       lock-behavior (CONCURRENTLY for indexes; batch for backfills); rollback-or-irreversible-note
3.  Review           → review/specialized-reviews.md database-lens: compat + locks + rollback + named-query-indexes
4.  Test             → testing/integration.md: up/down on representative data (rollback PROVEN, not hoped)
                       + app-runs-on-both-schemas (expand-compat test: old-code + new-schema)
5.  Pre-flight       → backup verified (devops/backups-scaling-cost.md restore-verify) + maintenance-window
                       decision (locks) + deploy-order plan (expand → app-deploy → contract per devops/deployment.md)
6.  Execute          → expand-migrations FIRST → deploy app → watch (monitoring.md deploy-markers + slow-query
                       + error-rate) → contract-migrations in a LATER release (NEVER same-release drop)
7.  Verify           → app-metrics window green + data spot-checks (row-counts/samples per data-governance-quality.md)
8.  Rollback-path    → armed the whole time: app-rollback = redeploy-previous (compat holds by design);
                       broken-migration = restore-from-backup (architecture/disaster-recovery.md path, human-approved)
```

Rules: migrations serialized single-owner per `core/multi-agent.md` (restated — THE classic multi-agent breakage); backward-compat is the whole game (both versions run on the new schema during deploy per `devops/deployment-strategies.md` skew-rules); irreversible migrations = human sign-off pre-flight (per `development/database.md`).
