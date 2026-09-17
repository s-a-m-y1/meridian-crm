---
name: workflow-dependency-update-technical-debt
description: Dependency updates and tech-debt paydown workflows
domain: workflows
phase: maintenance
priority: medium
inputs: [update-request, debt-register]
outputs: [updated-deps, reduced-debt]
dependencies:
  [development/dependency-management, maintenance/maintenance-operations]
next_skills: [testing/regression]
---

# Workflow: Dependency Update

```
1.  Classify         → security-critical (vulnerability-management.md SLAs → workflows/hotfix.md path)
                       / routine patch / minor / major (development/dependency-management.md gates)
2.  Research (majors)→ research/framework-library-evaluation.md: release-notes + breaking-changes +
                       usage-grep (our actual call-sites) — the migration-cost map
3.  Update           → lockfile via manager ONLY; batch by level (patches together; majors individually)
4.  Verify           → full-suite + build + contract tests (per testing/regression.md dependency-trigger table)
                       + smoke on deployed-dev (the "works in CI, breaks in prod-shape" catch)
5.  Review           → review/dependency-review.md gates (justified/evaluated/audited/unique)
6.  Ship             → normal release flow (changelog per documentation/changelog.md);
                       security-criticals via hotfix.md expedited path
7.  Post             → monitor window (monitoring.md) — behavior-changes surface in prod first sometimes
```

# Workflow: Technical Debt Paydown

```
1.  Select           → debt-register (maintenance/maintenance-operations.md §2): interest-rated,
                       capacity-quota-respecting (the 20% budget — debt work is PLANNED not squeezed)
2.  Risk-class       → development/refactoring.md preconditions: tests-exist-or-written-first (else BLOCKED);
                       high-risk areas (auth/contracts/transactions) get characterization-tests + serialized work
3.  Execute          → workflows/refactor.md loop (mechanical steps, each green)
                       structural items (extractions) via architecture/architecture-migration.md slicing
4.  Verify           → behavior-unchanged-PROOF (contract tests per refactor.md) + perf-check if hot-path
5.  Record           → debt-register item closed w/ evidence; ceiling-metrics re-checked
                       (maintenance.md health-signal — did the flake%/CI-time actually improve?)
```

Rules: debt-work never rides feature-PRs (separate commits per `development/refactoring.md`); selection by INTEREST not fun (per `documentation/maintenance.md` rules — restated: the register enforces it).
