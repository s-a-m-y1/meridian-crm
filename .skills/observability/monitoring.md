---
name: monitoring
description: Dashboards, health checks, alerting and production diagnostics
phase: observability
priority: high
inputs: [metrics, slos]
outputs: [dashboards, alerts, health-endpoints]
dependencies: [metrics]
next_skills: [incident-response]
---

# Monitoring

## Health Endpoints (implemented per service)

- `/healthz` (liveness): process alive — deep checks absent (a DB outage shouldn't kill-restart healthy instances)
- `/readyz` (readiness): dependencies reachable (DB, cache) — failed readiness removes instance from LB, no restart
- Both cheap (< 50ms), unauthenticated-but-safe (no info leak beyond up/down), monitored externally

## Dashboards (per service, one page tells the story)

1. Golden row: traffic, error ratio, p95/p99, saturation — the "is it healthy?" glance
2. SLO panel: each SLO + error-budget burn
3. Dependencies: DB, cache, queue depth/age, third-party call success/latency
4. Business metrics: core actions/minute (`metrics.md` business set)
5. Deploy markers overlay — correlate changes with metric shifts (the most common "cause" is "we changed something")

## Alerting Rules

1. Alert on **symptoms users feel** (error rate, latency, SLO burn), not causes (CPU% alone) — cause-alerts cry wolf.
2. Every alert: actionable (runbook link — `documentation/troubleshooting.md`/runbooks), severity-tiered, SLO-burn-rate-based (fast-burn pages, slow-burn tickets).
3. No alert without a runbook; no runbook without an alert.
4. Per-deploy watch window: auto-alert on error-rate delta vs baseline post-deploy (`devops/deployment.md` watch step).

## Production Diagnostics (investigation flow)

Timeline correlation: alerts + deploy markers + logs by request-ID (`logging.md`) + traces across services → isolate the failing layer (edge/app/DB/dependency) → metrics drill (which endpoint/resource) → logs/trace drill (which requests, why). Use `observability/root-cause-analysis.md` once mitigated.

## Validation Checklist

- [ ] healthz/readyz present + externally monitored
- [ ] Dashboards cover golden signals + SLO + deps + business
- [ ] Every alert has runbook + severity + burn-rate policy

## Handoff

→ alerts fire → `incident-response.md`.
