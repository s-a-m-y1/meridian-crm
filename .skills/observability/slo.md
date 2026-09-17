---
name: slo-management
description: SLIs, SLOs, error budgets and their governance
domain: observability
phase: observability
priority: high
inputs: [nfrs, metrics]
outputs: [slo-system]
dependencies: [observability/metrics]
next_skills: [observability/monitoring, quality-gates]
---

# SLI/SLO/Error Budget Management

`observability/metrics.md` = metric definitions (the vocabulary). THIS = the SLO SYSTEM: the contract that converts reliability into a governable budget.

## Definitions (precise — these get conflated)

- **SLI** (indicator): a measured good/total ratio on user experience (availability = successful/total requests; latency = under-300ms/total; freshness = within-SLO/total events)
- **SLO** (objective): target on an SLI over a window (99.9% availability / 30d) — always BOTH: target AND window
- **Error budget** = 100% − SLO (99.9% → 0.1% = 43min downtime/month — the SPENDABLE unreliability)
- SLA ≠ SLO: legal/contractual consequence-bearing versions (per `compliance/legal.md` review) — SLOs are internal targets; SLAs are promises with teeth

## Workflow

1. **SLI selection** (user-experience-shaped, not ops-vanity): availability + latency (p95, p99 per critical path) + correctness where measurable (e.g. "jobs completed vs dead-lettered") + freshness for async/`architecture/event-driven.md` surfaces. Every SLI documented: measurement formula, source metric, which user journey it represents (per `discovery/user-journey.md` moments)
2. **SLO setting** from NFRs (`discovery/requirements.md` quantified availability/latency): start with what the system DOES (measure 30d first) then set targets just above current reality (aspirational SLOs = burned budgets = ignored system); document why each target (the "99.95 because enterprise contract" reasoning per `core/decision-log.md`)
3. **Budget governance** (the actual point):
   - Burn-rate alerting: fast-burn (page — budget dying in hours) vs slow-burn (ticket — dying over weeks) thresholds per `observability/alerting-tracing.md` rules — budget alerts are SYMPTOM alerts (per `observability/monitoring.md` symptom-cause doctrine)
   - **Budget policy pre-declared**: what stops when the budget's spent (feature-freezes reliability work first; launches gated on remaining budget — the policy is agreed BEFORE the fire, per `business/finance.md` trigger-decision discipline)
   - Budget spend reviewed in the weekly ops cadence (like spend-forecast reviews — money and reliability both budgeted)
4. **Reporting**: SLO dashboard per service (current, target, budget-remaining, burn trend — per `observability/monitoring.md` SLO panel); quarterly SLO review: targets still match user needs + NFRs? (SLOs set once and forgotten = cargo cult)
5. **Downstream dependencies**: multi-service chains compose pessimistically (upstream SLO ≥ downstream needs — a 99% dependency can't back your 99.9% promise; per `architecture/scalability-reliability.md` SPOF-by-SLO reasoning)

## Validation Checklist

- [ ] Every SLI: formula + source + user journey mapped
- [ ] SLOs evidence-set (current-reality + NFR-derived); targets+windows documented
- [ ] Burn alerts wired (fast/slow); budget policy agreed pre-incident
- [ ] Weekly budget review + quarterly target review running

## Handoff

→ alerts → `observability/alerting-tracing.md`; dashboards → `observability/monitoring.md`; policy triggers → `quality-gates/gates.md` release gating.
