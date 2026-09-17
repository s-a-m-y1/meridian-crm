---
name: backups-scaling-cost
description: Backups, restore drills, capacity scaling, and cloud cost optimization
domain: devops
phase: devops
priority: high
inputs: [dr-plan, metrics]
outputs: [backup-ops, capacity-plan, cost-optimizations]
dependencies: [architecture/disaster-recovery, observability/metrics]
next_skills: [workflows/disaster-recovery, documentation/maintenance]
---

# Backups, Scaling & Cost Optimization

The ops-execution layer of three capabilities designed elsewhere: DR plan (`architecture/disaster-recovery.md`) → backup OPS here; scale path (`architecture/scalability-reliability.md`) → capacity ops here; unit economics (`business/finance.md`) → cloud cost ops here.

## 1. Backup Operations (the run side)

- Schedule automation meeting RPO (per DR plan's backup design: frequency, tiers, geo-separation, immutability tier per `architecture/disaster-recovery.md`)
- **Backup verification pipeline** (backups that run ≠ backups that restore): automated restore-verify job (restore latest to scratch → smoke-check → record) on every schedule-cycle's sample; monthly FULL drill per DR plan (timed vs RTO — recorded, findings-actioned per `architecture/disaster-recovery.md` drill discipline)
- Retention automation per policy (per `data/data-governance-quality.md` §5 schedule — backups are PII-bearing too: retention applies to them; deletion/export paths per `data/data-governance-quality.md` §5)
- Alert on backup FAILURE (silently-failed backups discovered at restore-time = the worst story in engineering)

## 2. Capacity Management (scale ops)

- **Headroom tracked per resource**: utilization trending (per `observability/metrics.md` USE metrics) + headroom floor (e.g. <30% free → scale event) — headroom defined per resource (CPU, memory, DB connections, queue depth, disk)
- **Scale events pre-decided**: auto-scale rules (reactive: threshold-triggered instance adds) + forecast reviews (monthly: growth-rate × lead-time — ordering hardware/raising quotas takes longer than you think; per `development/data-pipelines.md` capacity trends if instrumented)
- Saturation-incident learning loop: every saturation incident → capacity-metric that would have predicted it added (per `observability/root-cause-analysis.md` preventive discipline — capacity incidents are repeats until the metric exists)

## 3. Cost Optimization (cloud economics)

- **Visibility first**: cost-per-service dashboards (IaC tags per `devops/infrastructure-as-code.md` — untagged spend = unmanaged spend); unit-economics metric: infra-cost-per-active-user (ties to `business/finance.md` unit economics — growth that grows cost faster than revenue = a finding, not a surprise)
- **The standard optimization ladder** (evidence before each step):
  1. Rightsizing: utilization data (not guesses) → instance sizes to actual + headroom (the #1 quick win: over-provisioned defaults)
  2. Scheduling: non-prod environments off-hours (dev envs running 24/7 = 3× waste)
  3. Storage lifecycle: hot→cool→archive per `architecture/infrastructure-designs.md` tiering; orphaned volumes/snapshots cleaned (per `data/data-governance-quality.md` cleanup rules)
  4. Commitment coverage (reserved instances/savings plans) at STEADY-state baseline only (commit to the floor, buy the burst on-demand — committing to peak = paying twice)
  5. Architecture restructures LAST (per `development/performance-backend.md` leverage-order philosophy — measure before rearchitecting for cost)
- **Cost regressions gated**: per-PR infra-cost delta visible in CI where tooling allows (a "small" PR adding a 24/7 GPU = review-time finding, not month-end surprise per `review/specialized-reviews.md` checklist extension)

## Validation Checklist

- [ ] Backup pipeline verifies restores (automated sample + monthly drill, timed)
- [ ] Headroom floors + auto-scale rules + monthly forecast review running
- [ ] Cost dashboards per service; unit-cost metric tracked; ladder executed evidence-first

## Handoff

→ drills → `workflows/disaster-recovery.md`; costs → `business/finance.md` reviews; cleanups → `maintenance/data-operations.md` §2.
