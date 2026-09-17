---
name: scalability-reliability-resilience
description: Design for scale, uptime and failure survival — the three -ility twins
domain: architecture
phase: architecture
priority: high
inputs: [system-design, nfrs]
outputs: [scalability-plan, reliability-plan, resilience-patterns]
dependencies: [architecture/system-design]
next_skills: [observability/metrics, devops/deployment]
---

# Scalability, Reliability & Resilience

Three distinct properties (often conflated — split them):

- **Scalability**: handles MORE (users, data, traffic) without degradation
- **Reliability**: works correctly for the handled load, for the promised time (uptime/SLA)
- **Resilience**: fails GRACEFULLY — degrades, recovers, doesn't cascade when components die

## Scalability Design

1. ** Stateless-by-default** app tier (state in session store/DB — horizontal scale = add instances; any stateful instance = scaling ceiling, justify exceptions per ADR)
2. **Scale path per tier** (cheapest first): vertical (bigger box — fine to start, ADR the ceiling) → read replicas (reads scale separately) → partitioning (data splits by key) → sharding (last resort — `architecture/database.md` staged plan)
3. **Scale trigger for every shared resource**: DB connections (pool sizing per `development/performance-database.md`), external-API rate limits (per `integrations/third-party-api.md`), cache capacity, queue consumers
4. **Backpressure over collapse**: when downstream saturates — queue + shed load (fail 20% of low-value work fast) — don't let saturation become latency-spiral (per `development/performance-backend.md` tail-latency rules)

## Reliability Design

1. **SLA → SLO translation**: NFR uptime → per-service SLOs + error budgets (`observability/slo.md` — the budget POLICES pace vs reliability)
2. **Single points of failure inventory** (per C2 container: what if it dies? — `architecture/system-design.md` failure-modes section, maintained as truth, not one-time)
3. **Data durability**: replication per `architecture/database.md` RPO; backups tested-restore (an untested backup is not a backup)
4. **Change discipline**: most outages are changes, not loads — hence `devops/deployment.md` canary + rollback-by-default (reliability is a DEPLOY property as much as a design one)

## Resilience Patterns (apply per integration point — per `architecture/backend.md` adapter rules)

| Pattern                  | When                                  | Rule                                                                                                |
| ------------------------ | ------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Timeout                  | EVERY external call                   | default-deny: no infinite waits; budget per call                                                    |
| Retry + backoff + jitter | transient errors only                 | idempotent operations only; capped; jitter (per `development/backend.md`)                           |
| Circuit breaker          | flaky dependency                      | open → fail-fast → half-open probe → recover                                                        |
| Bulkhead                 | one slow dep can't exhaust everything | separate pools per dependency                                                                       |
| Fallback                 | graceful degradation possible         | cached data, reduced feature, honest message (per `design/ui.md` error states) — never fake success |
| Load-shedding            | overload                              | drop lowest-priority work first, keep core path alive                                               |

Cascade-killer: one service's slow death becoming everyone's — bulkheads + breakers at every boundary. Verify with failure testing (per `testing/strategy.md`): kill dependencies in staging, watch degradation paths work.

## Validation Checklist

- [ ] App tier stateless (exceptions ADR'd); scale path per tier documented
- [ ] SPOF inventory current; data durability tested
- [ ] Every external call: timeout + retry/breaker/bulkhead assigned
- [ ] Failure drills run (deps killed in staging; degradation graceful)

## Handoff

→ SLO wiring → `observability/slo.md`; deployment safety → `devops/deployment.md`.
