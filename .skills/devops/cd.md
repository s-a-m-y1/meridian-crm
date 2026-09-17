---
name: cd
description: Continuous delivery pipeline — promote verified artifacts through environments
phase: devops
priority: high
inputs: [ci-artifact]
outputs: [deployed-environments]
dependencies: [ci, deployment, security/secrets]
next_skills: [observability/monitoring, release-management]
---

# Continuous Delivery

## Environment Progression

```
dev (auto-deploy every merge to main)
  → staging (auto; prod-parity: same image, same config shape, realistic data volume)
  → production (manual approval OR auto with canary — see deployment.md)
```

One artifact promoted through all environments — never rebuilt per env (per `ci.md` rule 4). Environment differs only by config (env vars/secrets per `security/secrets.md`).

## Pipeline Stages (per promotion)

1. Pre-checks: artifact exists + CI green for this exact artifact; migration plan attached if any (`development/database.md` — expand/contract order documented)
2. Deploy per `devops/deployment.md` (staging: full auto; prod: approval gate + canary preferred)
3. Post-deploy validation: health checks green → smoke suite (critical paths) → error-rate watch window (5-10 min)
4. On failure: **auto-rollback** to previous artifact (rollback is default action, not a decision made during the incident)

## Rules

1. Deployment is reversible **by design**: every deploy has a recorded previous version; DB migrations always backward-compatible (two-step rule) so app rollback works.
2. Secrets injected per environment at deploy time; no env crossover.
3. Audit trail: what artifact, who/what approved, when, to where — recorded (deploys are auditable events).
4. Release notes auto-accumulated per `documentation/changelog.md` from conventional commits.

## Validation Checklist

- [ ] Single artifact promoted through all envs
- [ ] Auto-rollback on post-deploy failure verified (tested in staging deliberately!)
- [ ] Migration plan attached for DB-changing releases
- [ ] Audit trail complete

## Handoff

→ `observability/monitoring.md` (watch the deployment); versioning per `release-management.md`.
