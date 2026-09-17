---
name: deployment
description: Deploy to environments with checklists, migrations, health gates and rollback
phase: deployment
priority: high
inputs: [cd-artifact, environment]
outputs: [deployed-service]
dependencies: [cd, development/database]
next_skills: [observability/monitoring, workflows/release]
---

# Deployment

## Pre-Deployment Checklist (every env, every time)

- [ ] Artifact = CI-verified, same ID promoted (no rebuilds)
- [ ] Migrations reviewed: backward-compatible (two-step per `development/database.md`)? rollback path known? lock impact assessed?
- [ ] Config diff reviewed (env vars, feature flags); secrets present in target env's store
- [ ] Release notes/changelog updated
- [ ] Rollback plan: previous artifact identified + procedure confirmed
- [ ] On-call/monitoring ready for the watch window

## Deploy Order (zero-downtime)

1. **Expand**: run additive migrations first (new nullable columns/tables) — old code ignores them, no lock drama
2. Deploy new app version (rolling: N+1 instances, health-checked, old kept until new green)
3. **Contract**: enforce new constraints / remove old paths in a later release (per two-step rule)
4. Post-deploy validation:
   - Health endpoints green (`/healthz` liveness, `/readyz` readiness)
   - Smoke suite: top critical journeys pass
   - Metrics watch window (5-10 min): error rate, latency, saturation vs pre-deploy baseline
5. Record: artifact, time, env, migration IDs, validation evidence → deployment log (auditable, per `cd.md`)

## Rollback Procedure (default-on-failure, not a decision)

1. App: redeploy previous artifact (kept ready; single command)
2. DB: **do not rollback migrations that added nullable/optional things** — old code coexists (that's why expand-first). Only a broken additive migration forces restore-from-backup path (`architecture/database.md` RTO) — last resort, human-approved.
3. Verify: health + smoke + metrics window on rollback too (rollback is a deploy).
4. Post-rollback: incident severity assessment (`observability/incident-response.md` if user-facing).

## Environment-Specific Notes

- **dev**: auto per merge; minimal ceremony
- **staging**: full deploy + smoke + perf spot-check; prod-parity config shape
- **production**: approval gate, canary preferred (small % traffic → metrics window → 100%), off-peak window for risky migrations, feature flags for gradual enablement

## Validation Checklist

- [ ] Checklist fully green; evidence recorded
- [ ] Expand-migrate-contract order respected
- [ ] Watch window clean (or rolled back with evidence)

## Handoff

→ `observability/monitoring.md` (ongoing); release record per `release-management.md`.
