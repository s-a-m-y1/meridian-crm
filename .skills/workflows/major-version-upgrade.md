---
name: workflow-major-upgrade
description: Major version upgrades — frameworks, runtimes, platform moves
domain: workflows
phase: maintenance
priority: medium
inputs: [upgrade-request]
outputs: [upgraded-system]
dependencies:
  [research/framework-library-evaluation, architecture/architecture-migration]
next_skills: [testing/regression]
---

# Workflow: Major Version Upgrade

```
1.  Justify          → research/technical-research.md: WHY (EOL-security / required-feature / vendor-sunset)
                       — "latest-because-latest" = rejected (per core/engineering-principles.md simplicity)
2.  Research         → framework-library-evaluation.md + documentation-research.md: migration-guides
                       (the real cost-map), breaking-changes × our-usage-grep, ecosystem-compat
                       (our OTHER deps on the new major?) + benchmark.md spikes for perf-claims
3.  Plan             → architecture-migration.md slicing: incremental-upgrade-paths where they exist
                       (codemods/interop-modes) > big-bang; slice-order risk-first (per its slice-rules)
4.  Safety-net       → development/refactoring.md preconditions ×2: full-suite green BEFORE start +
                       characterization-tests on legacy-behaviors the suite misses (migration = the riskiest refactor)
5.  Execute          → per-slice: upgrade-slice → fix → test → commit → deploy-behind-flag where behavior-visible
                       (development/feature-flags.md); infra-coordinated parts via devops/infrastructure-as-code.md
                       (runtime/platform changes = IaC-changes w/ plan-review)
6.  Verify           → regression.md full-pyramid + e2e + perf-comparison (benchmark.md before/after —
                       major-upgrades ARE perf-events; regression-gate per review/performance-review.md)
                       + parity-checks in staging (devops/cd.md env-parity rules)
7.  Rollout          → release.md path + canary-sized-start + extended-watch (upgrade-regressions surface slow);
                       rollback = previous-artifact (whole-upgrade rollback = redeploy-old + DB-compat-checked
                       IF the upgrade carried migrations → those were expand-only per development/database.md)
8.  Post             → follow-up-debt task (deprecated-APIs-we-deferred during the upgrade —
                       maintenance/maintenance-operations.md register) + docs-refresh (architecture-docs,
                       setup-guide version-pins per documentation/setup.md pinning-rules) + changelog
```

Rules: never mid-release-train (upgrade = its own release-window per `product/release-planning.md`); lockfile+runtime+IaC change together per-slice (drift = the upgrade's classic failure); EOL-security-upgrades take the hotfix.md path instead (this workflow = planned majors).
