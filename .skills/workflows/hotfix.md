---
name: workflow-hotfix
description: Emergency production hotfix — expedited but disciplined
domain: workflows
phase: maintenance
priority: high
inputs: [prod-incident-or-critical]
outputs: [hotfixed-prod]
dependencies: [workflows/production-incident, devops/release-management]
next_skills: [observability/root-cause-analysis]
---

# Workflow: Hotfix

```
1.  Qualify          → is it REALLY a hotfix? SEV1/2 prod-impact or critical-security
                       (security-criticals per security/vulnerability-management.md emergency-path)
                       — "annoying but survivable" = normal release train (per product/release-planning.md dates rule)
2.  Minimal-fix      → smallest SAFE change that stops the bleeding (per observability/incident-response.md
                       mitigate-first doctrine); NOT the perfect fix (the perfect fix ships next train)
3.  Branch           → hotfix/<id> from the RELEASE TAG (per devops/git.md hotfix-branch rules —
                       not from main: main may carry unshipped work)
4.  Test             → the incident-repro test (fails-before/passes-after per development/bug-fix.md)
                       + blast-radius suite (regression.md hotfix table: FULL suite + smoke-on-deployed-env)
                       — expedited ≠ skipped (per core/agent-rules.md NEVER #12: no ignoring failing tests, ever)
5.  Review           → one focused reviewer (human-or-agent per agents/roles.md) — FAST but REAL
                       (expedited-review = smaller-checklist not zero-checklist; security-hotfixes +
                       security-review.md always)
6.  Ship             → patch-bump per devops/release-management.md hotfix-path → canary-small → watch-window
                       (devops/deployment.md) → rollback-ready (the hotfix ITSELF gets rollback-verified pre-merge)
7.  Merge-back       → hotfix-branch → main immediately after deploy (drift-prevention per devops/git.md)
8.  Follow-up        → full-RCA per observability/root-cause-analysis.md (SEV1/2 mandatory) —
                       "why did hotfix-path trigger" is itself an RCA question (release-process gap?);
                       followups enter maintenance/maintenance-operations.md §5 queue with incident-priority
```

Rules: every hotfix retro-checked — "could this have been a normal release?" (frequent-yes = process-rot signal per `observability/alerting-tracing.md` review philosophy); hotfix-count is a health-metric (trending-up = deeper problems — per `documentation/maintenance.md` health-signals).
