---
name: backend-performance
description: Measure and improve backend performance — latency, throughput, memory, CPU
phase: performance
priority: medium
inputs: [performance-symptoms, metrics]
outputs: [perf-evidence, optimizations]
dependencies: [testing/performance]
next_skills: [review/performance-review]
---

# Backend Performance

## Rule: Evidence First

Profiler traces or load-test data, before and after. "Felt faster" is not evidence.

## Workflow

1. **Measure**: p50/p95/p99 latency + throughput under load (`testing/performance.md`); flame graph/profile of the hot path; resource utilization (CPU, memory, connections).
2. **Diagnose by pattern**:
   - High p99, low p50 → tail latency: GC pauses, lock contention, connection-pool exhaustion, retry storms, noisy neighbor
   - Uniformly slow → hot-path work: N+1 queries, missing cache, heavy serialization, sync I/O in loops
   - Throughput ceiling → CPU-bound (profile + optimize algorithm) or blocked (await/IO tuning, pool sizes)
   - Memory creep → leaks: growing caches, listeners not removed, per-request allocations held
3. **Apply fixes by leverage order**:
   1. Eliminate work (N+1 → batch/join; remove redundant calls per request)
   2. Cache correctly (read-through, TTL + invalidation strategy, hit-rate measured — `architecture/system-design.md` caching)
   3. Async-ify blocking I/O; parallelize independent calls
   4. Algorithmic fixes (O(n²) → O(n log n)) on proven hotspots
   5. Scale horizontally **only after** per-instance efficiency is sane (scaling inefficiency multiplies cost, not fixes it)

## Guardrails

- Every cache gets: an explicit invalidation story + hit-rate metric (a cache without invalidation is a correctness bug with good latency)
- New p95/p99 budgets per endpoint recorded; regressions tracked in CI (perf tests on critical paths)

## Validation Checklist

- [ ] Before/after p50/p95/p99 + throughput at same load
- [ ] Caches have invalidation + measured hit-rate
- [ ] No correctness/risk trade-offs hidden (state them)

## Handoff

→ `review/performance-review.md` with the load-test evidence.
