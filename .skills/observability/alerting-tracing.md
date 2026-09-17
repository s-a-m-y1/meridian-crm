---
name: alerting-tracing
description: Alert design discipline and distributed tracing
domain: observability
phase: observability
priority: high
inputs: [metrics, slo-system]
outputs: [alerts, tracing]
dependencies: [observability/slo, observability/monitoring]
next_skills: [observability/incident-response]
---

# Alerting & Tracing

Two disciplines extending `observability/monitoring.md` (dashboards/detection doctrine — its alert RULES live HERE now in full).

## 1. Alerting Discipline (the anti-pager-fatigue rules)

### Alert on symptoms, page on urgencies (per `observability/monitoring.md` doctrine — operationalized)

- SYMPTOM = user-feels-it (error rate, latency, availability burn per `observability/slo.md`) → alert-worthy
- CAUSE = internal (CPU high, disk filling) → diagnostic signal, dashboard-only — page ONLY when it's about to BECOME a symptom (predictive cause-alerts: disk-80%-in-2-hours, not disk-70%-now)

### The quality bar (every alert passes or gets deleted)

1. **Actionable**: exact next step exists (runbook-linked per `observability/monitoring.md` no-orphan rule — unactionable alert = deleted on sight)
2. **Urgent-for-a-human**: is-3am-worthy? (ticket vs page honestly classified; `observability/incident-response.md` severity calibration is the reference)
3. **Rare-enough**: firing weekly = noise-tuned (threshold raised or alert removed — noisy alerts train ignore-muscle, the incident-response killer)
4. **Deduplicated**: related failures alert ONCE (grouping by cause; 40 alerts from one DB outage = one incident, one page per `observability/incident-response.md` IC brain)

### Severity tiers (wired to response)

| Tier          | Fires when                                                             | Route                                                          |
| ------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------- |
| Page (SEV1/2) | user-facing now / fast budget burn (`observability/slo.md` burn rules) | on-call NOW (per `observability/incident-response.md` cadence) |
| Ticket        | slow-burn / degradation-with-workaround                                | today's triage                                                 |
| Info          | state changes worth knowing (deploys, scale events, flag flips)        | chat/log only                                                  |

- Alert-review ritual: monthly — what fired, what was ignored, what got acted-on (per `documentation/maintenance.md` health signals); delete/refine honest (an alert nobody would act on is a liability, not safety)

## 2. Distributed Tracing (required at multi-service scale — per `architecture/architecture-styles.md` microservices profile rule)

### Instrumentation

- Trace context propagated EVERYWHERE (HTTP headers → internal calls → queues → jobs — context-injection middleware per `observability/logging.md` request-ID discipline, generalized); sampling strategy: head-based default + tail-based for errors/slow-traces (100% of interesting, 1-10% of normal — cost-sane)
- Span per meaningful unit (HTTP handler, DB call, external call, queue publish/consume) with: duration + status + key attributes (route, tenant-safe identifiers — NO secrets/PII in attributes per `observability/logging.md` security discipline)

### Use patterns (tracing answers these)

- "WHERE is the time going?" — span waterfalls on slow requests (per `development/performance-backend.md` diagnosis, now cross-service)
- "WHY did it fail?" — error-trace linkage (the failing span's subtree = the blast path per `architecture/scalability-reliability.md` cascade-debugging)
- "Who's affected?" — trace-filter by user/tenant/route (incident scoping per `observability/incident-response.md` impact-assessment)
- Dependency mapping: emergent service-graph from traces (the ACTUAL architecture vs the `.ai/architecture.md` diagram — drift between them = finding per `review/architecture-review.md`)

## Validation Checklist

- [ ] Every alert passes the 4-bar (actionable/urgent/rare/deduped); runbook-linked; monthly review running
- [ ] Traces propagated across ALL boundaries (incl. queues); errors/slow tail-sampled; PII-free spans
- [ ] Trace-derived dependency map reviewed vs architecture docs

## Handoff

→ pages → `observability/incident-response.md`; slow traces → `development/performance-*` loops; service-map → `review/architecture-review.md`.
