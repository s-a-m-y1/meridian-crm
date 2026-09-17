---
name: workflow-deprecation-removal
description: Safely remove a deprecated feature/API — staged, communicated, reversible
domain: workflows
phase: maintenance
priority: medium
inputs: [deprecation-record]
outputs: [removed-feature]
dependencies: [maintenance/deprecation, maintenance/data-operations]
next_skills: [workflows/release]
---

# Workflow: Deprecated Feature Removal

```
1.  Verify-record    → maintenance/deprecation.md DEP-record exists w/: announced-date, sunset-date,
                       migration-guide, usage-metric, affected-consumers
                       (NO record → this workflow is BLOCKED: deprecate-first per deprecation.md)
2.  Usage-check      → the metric at/near-zero? (product/product-metrics.md evidence —
                       NOT-zero → extend-window + boost-migration-comms per deprecation.md usage-rule;
                       killing a used thing = contract-violation)
3.  Consumer-audit   → affected-list re-verified: internal-modules (grep-callers), API-consumers
                       (registry/keys per architecture/api.md), tenants (platform/platform-services.md)
                       — each has migration-confirmed-or-waived
4.  Removal-PR       → code-removal (its own release per product/release-planning.md; flag-dead-branches
                       per development/feature-flags.md cleanup); migration-guide FINAL (documentation/ops-guides.md);
                       changelog "Removed" (documentation/changelog.md) + API-version-bump if contract-surface
                       (architecture/api.md versioning)
5.  Test             → contract-tests updated (the removed-surface's tests DIE with it —
                       orphan-tests = rot per testing/advanced-test-types.md); full-regression (regression.md);
                       internal-consumers green on their own suites
6.  Ship + watch     → workflows/release.md path; watch consumers' error-rates post-deploy
                       (a missed-consumer = immediate usage-spike-on-404s → monitoring.md alert → hotfix.md path
                       if needed: re-enable-behind-flag FAST, fix-properly next)
7.  Data-grace       → the feature's DATA retires via maintenance/data-operations.md §3 staging:
                       retention-window (restore-requests honored) → archival/purge per data-retention.md
8.  Close            → DEP-record closed w/ removal-evidence (compliance/audit.md trail);
                       postmortem-lite: what did we learn about this feature's lifecycle?
                       (product/product-lifecycle.md portfolio-view update)
```

Rules: reversal-path pre-planned (step-6's flag-re-enable = the undo — per `devops/deployment.md` rollback-readiness applied to removals); sunset-dates are promises (per `maintenance/deprecation.md` early-sunset rule: never-move-earlier without human-signed comms-plan).
