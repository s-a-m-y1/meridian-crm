---
name: workflow-release
description: Chain from feature freeze through deployment to post-release monitoring
phase: workflow
priority: high
inputs: [main-branch]
outputs: [released-version]
dependencies:
  [
    testing/regression,
    review,
    devops/release-management,
    devops/deployment,
    observability/monitoring,
  ]
next_skills: [workflow-production-incident]
---

# Workflow: Release

```
1.  Feature freeze     → scope locked; late work targets next release
2.  Release regression → testing/regression.md: full pyramid + full E2E      [GATE 4]
3.  Security           → review/security-review.md + dep audit               [GATE 5]
4.  Performance        → testing/performance.md smoke vs budgets             [GATE 6]
5.  Docs               → documentation/changelog.md final + release notes    [GATE 7]
6.  Build + version    → devops/release-management.md (tag, artifact via ci.md)
7.  Deploy             → devops/deployment.md: staging full validation →
                         prod approval → canary → watch window → 100%        [GATE 8]
8.  Health check       → smoke suite + SLO watch (observability/monitoring.md)
9.  Post-release watch → 24-48h heightened monitoring + deploy markers       [GATE 9]
10. Close              → changelog published, retro notes, next train scheduled
```

## Rules

1. Any gate failure = release holds (per `quality-gates/gates.md` blocking rules — CRITICAL/HIGH security findings are absolute stops).
2. Canary is preferred over 100% blast (per `devops/deployment.md` env notes); watch-window metrics decide promotion.
3. Rollback readiness verified BEFORE deploy (previous artifact identified, procedure one command).
4. Late "must-include" fix after freeze → goes through full gates individually — shortcuts are how releases break.
5. On Gate 9 failure: rollback assessment mandatory (not optional), then `incident-response.md` if impact occurred.

## Completion

Version live, gates 4-9 green with archived evidence, watch window closed, changelog published, next train scheduled.
