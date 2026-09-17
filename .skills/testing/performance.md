---
name: performance-testing
description: Load, stress and soak testing with evidence-based budgets
phase: testing
priority: medium
inputs: [nfrs, performance-budgets]
outputs: [perf-report, capacity-numbers]
dependencies: [strategy]
next_skills: [development/performance-backend, review/performance-review]
---

# Performance Testing

## Test Types (run the one matching the question)

| Type   | Question                           | Shape                                            |
| ------ | ---------------------------------- | ------------------------------------------------ |
| Load   | Does it meet NFR at expected peak? | Expected traffic × 1.5, sustained 15-30 min      |
| Stress | Where does it break?               | Ramp past peak until degradation; find the cliff |
| Soak   | Does it degrade over time?         | 4-24h steady load → leaks, GC creep, disk fill   |
| Spike  | Does it survive bursts?            | 10× instantaneous, watch recovery                |

## Rules

1. **Environment**: production-like (same compute class, representative data volume — 100 rows ≠ 1M rows) or the results are fiction.
2. **Metrics recorded**: p50/p95/p99 latency, throughput, error rate, resource saturation (CPU/mem/connections) — with the load shape documented.
3. **Pass criteria = NFRs** (`discovery/requirements.md`): e.g. "p95 < 300ms at 500 rps sustained, error rate < 0.1%". No pass criteria = no test.
4. Realistic traffic: mix of endpoints (not hammering one), realistic payloads, authenticated where applicable.
5. Findings → `development/performance-*.md` skills for fixes; re-test after (before/after evidence).

## Output — Perf Report

```markdown
# Perf Report — <date> <env>

## Config (load shape, data volume, instance size)

## Results (metrics table per endpoint/flow, vs budget)

## Findings (cliff location, first bottleneck, saturation points)

## Verdict: PASS/FAIL vs NFRs | Capacity estimate: X rps/instance
```

## Validation Checklist

- [ ] Production-like env + data volume stated
- [ ] Budgets/NFRs referenced; verdict against them
- [ ] Capacity number derived (rps per instance, break point)

## Handoff

→ failures go to `development/performance-backend.md` / `performance-database.md`; evidence to `review/performance-review.md`.
