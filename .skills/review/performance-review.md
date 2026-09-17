---
name: performance-review
description: Review performance claims and evidence for changes
phase: review
priority: medium
inputs: [diff, perf-reports]
outputs: [performance-verdict]
dependencies: [testing/performance, development/performance-backend]
next_skills: [quality-gates]
---

# Performance Review

## Checklist

1. **Evidence standard**: every performance claim carries before/after numbers — same env, same load shape, ≥3 runs, medians (`testing/performance.md` format). "Feels faster" = rejected.
2. **Budget check**: hot paths within p95/p99 budgets (`discovery/requirements.md` NFRs)? New endpoint assigned a budget at all?
3. **Regression scan**: diff adds loops-with-queries (N+1), per-request allocations, extra synchronous serial calls, larger payloads, unbounded queries, or new chatty cross-service calls?
4. **Complexity-for-speed trade-offs**: is the added complexity worth the measured win? Caches have invalidation + hit-rate metrics? Denormalization has write-path story?
5. **Scalability check**: new state on app instances (breaks horizontal scale)? New locks/singletons? Connection growth?
6. **Frontend**: bundle delta per route vs budget (CI-enforced per `development/performance-frontend.md`)?

## Findings

Same severity model as `code-review.md`. Typical: `[HIGH] N+1 introduced in orders listing (query count 1→51 per page)`, `[MEDIUM] cache added without invalidation — correctness risk`, `[LOW] unbounded SELECT in admin report`.

## Verdict

- PASS (budgets met, evidence present) / FAIL (regression or missing evidence for a perf-relevant change) → Gate 6.

## Handoff

→ fixes via `development/performance-*.md`; verdict to `quality-gates/gates.md` Gate 6.
