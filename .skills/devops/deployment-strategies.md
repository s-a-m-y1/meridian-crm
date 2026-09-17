---
name: deployment-strategies
description: Blue-green, canary, rolling, zero-downtime deployment patterns
domain: devops
phase: devops
priority: high
inputs: [cd-pipeline, deployment]
outputs: [deployment-strategy]
dependencies: [devops/deployment]
next_skills: [observability/monitoring]
---

# Deployment Strategies

`devops/deployment.md` = the deploy process (checklists, expand/contract, rollback). THIS = the traffic-shift patterns for zero-downtime — when each fits.

## The Patterns

| Pattern                  | Mechanics                                          | Fits                                                                                               | Costs                                                                                                                                                         |
| ------------------------ | -------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Rolling** (default)    | replace instances batch-by-batch behind LB         | stateless app tier, standard K8s-style deploys                                                     | both versions live mid-deploy (API/N-1 compat per `development/api.md` versioning); slow rollback (roll back the roll)                                        |
| **Blue-Green**           | full new env runs → traffic switches atomically    | when instant rollback matters; DB-migration risky releases (old env keeps serving while new warms) | 2× infra during deploys; shared-DB is the catch (both envs must run on the new schema — expand/contract per `development/database.md` is what makes B/G safe) |
| **Canary**               | new version serves small % → metrics-judged → ramp | anything user-facing with traffic to spare; the pattern under `devops/deployment.md` canary notes  | needs: per-version metrics split (per `observability/metrics.md`), ramp runbook (who/what judges, auto-vs-human), time-to-verdict budgeted                    |
| Feature-flag dark-launch | code ships OFF, exposed gradually post-deploy      | decoupling deploy from release (per `devops/cd.md` + `development/feature-flags.md`)               | flag-hygiene tax (expiry discipline per `development/feature-flags.md` cleanup rules)                                                                         |

## Canary Protocol (the most judgment-heavy — make it mechanical)

1. **Pre-declare the ramp**: 5% → 25% → 50% → 100% with a metrics-window per step (per `devops/deployment.md` watch-window rules) — steps sized by traffic (5% of tiny traffic = noise; then start 25%)
2. **Pre-declare the verdict metrics + kill bars** (per `business/validation.md` pre-declared discipline): error-rate delta, p95 latency delta, business-metric delta — "auto-rollback if error-rate > +X% for Y minutes" (per `devops/deployment.md` auto-rollback default — the system rolls back, humans explain after)
3. **Metric split per version**: dashboards tagged by deploy-version (`observability/monitoring.md` deploy-markers); canary-vs-control comparison is THE signal (not canary-vs-yesterday — control is contemporaneous)
4. **Sane experiments**: canary-by-cohort where user-stickiness matters (same user always old-or-new — mixed-version sessions = weird states; consistent-hashing assignment per `development/feature-flags.md`)

## Zero-Downtime Rules (all patterns share)

- Health-check gating: new instances serve only when ready (`/readyz` per `observability/monitoring.md`); LB drains old gracefully (connection-drain windows > long requests)
- DB schema changes: backward-compatible ALWAYS during the shift (two versions run concurrently in every pattern — per `development/database.md` expand-first rule, restated because violations here cause the 3am pages)
- Jobs/consumers: version-skew tolerant (old-job payloads readable by new consumers during transition per `architecture/event-driven.md` versioned contracts)
- Rollback rehearsal per release: the previous artifact + one-command revert identified BEFORE shift (per `devops/deployment.md` readiness rule — patterns make rollback fast only if pre-positioned)

## Validation Checklist

- [ ] Pattern chosen per system-shape (justified, not fashion)
- [ ] Canary ramps + verdict metrics + kill bars pre-declared; auto-rollback armed
- [ ] Version-skew safety proven (both versions healthy on the new schema in staging)

## Handoff

→ metrics wiring `observability/monitoring.md`; migration coupling `development/database.md`.
