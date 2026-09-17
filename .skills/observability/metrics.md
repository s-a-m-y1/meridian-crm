---
name: metrics
description: Define and implement RED/USE metrics and SLOs
phase: observability
priority: high
inputs: [nfrs, architecture]
outputs: [metrics-definitions, slos]
dependencies: [logging]
next_skills: [monitoring, alerting]
---

# Metrics

## Standard Sets

**RED (per service/endpoint — user-facing health)**: Rate (requests/s), Errors (rate/ratio), Duration (p50/p95/p99).
**USE (per resource — capacity health)**: Utilization, Saturation, Errors — applied to: CPU, memory, disk, DB connections, queue depth.

## Rules

1. Every service emits: RED per endpoint-class + USE per resource (a service without RED is unmonitorable in an incident).
2. **SLOs from NFRs** (`discovery/requirements.md`): e.g. availability 99.9%, p95 API < 300ms, error ratio < 0.1%. Each SLO gets an error budget (SLO ⇒ budget = 1 − SLO) — burn rate drives alerting, not raw thresholds.
3. Business metrics (signup count, order count, core-action completion) — these are what the PRD's success metrics actually need; instrument them explicitly (`product/prd.md` traceability).
4. Metric naming: `<service>_<subsystem>_<name>_<unit>` consistent; labels bounded (unbounded labels like raw user-ID = cardinality explosion that kills metric systems).
5. Jobs/queues: enqueued, processed, failed, dead-letter, oldest-pending age (per `development/backend.md` observability hooks).

## Output — Metrics Registry

Table: metric name, type, labels, owner, alert threshold/burn-rate, dashboard location. Kept in `.ai/architecture.md` or monitoring docs — the registry is the contract between metrics and alerts.

## Validation Checklist

- [ ] RED+USE complete for every service
- [ ] Every NFR → SLO → alert mapping exists
- [ ] Business metrics instrumented
- [ ] Cardinality reviewed (no unbounded labels)

## Handoff

→ dashboards + alerts in `monitoring.md` / `incident-response.md` triggers.
