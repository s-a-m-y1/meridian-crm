---
name: workflow-performance-optimization
description: Evidence-driven performance optimization — measure, fix, verify
domain: workflows
phase: performance
priority: high
inputs: [perf-symptom-or-budget]
outputs: [optimized-system, evidence]
dependencies: [testing/performance, development/performance-backend]
next_skills: [review/performance-review]
---

# Workflow: Performance Optimization

```
1.  Baseline         → testing/performance.md — measure the CURRENT state (same-env load test)
                       NO optimization without baseline numbers (the anti-"feels-faster" rule)
2.  Diagnose         → symptom → skill: backend-flamegraphs (performance-backend.md) /
                       DB-EXPLAIN (performance-database.md) / bundle-Lighthouse (performance-frontend.md)
                       Traces/metrics point FIRST (development/performance-backend.md diagnosis-table)
3.  Hypothesize      → per business/validation.md discipline: "fixing X will move p95 by Y" (pre-declared)
4.  Fix (leverage-order — ONE change at a time):
                       eliminate-work → cache → async → algorithmic → scale (per the performance skills' ladders)
5.  Verify           → re-run step-1's SAME test (before/after, same-conditions, ≥3 runs median)
6.  Review           → review/performance-review.md — evidence-pair + trade-off check [GATE 6]
7.  Guard            → perf-budget in CI (per performance-frontend.md CI rules) + monitoring-modes.md
                       trend-alerts (regression canary) — the fix STAYS fixed
8.  Document         → numbers + method archived (benchmark.md repro) — future-optimizers start from evidence
```

Rules: one-change-one-measure (multi-fix = un-attributable per `research/benchmark.md`); hypothesis-bar pre-declared (validation discipline); NO trade silent (correctness-for-speed = review-finding per `review/performance-review.md`).
