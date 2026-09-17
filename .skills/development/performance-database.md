---
name: database-performance
description: Query analysis, indexing, and database bottleneck elimination
phase: performance
priority: medium
inputs: [slow-queries, schema]
outputs: [query-optimizations, index-changes]
dependencies: [testing/performance, development/database]
next_skills: [review/performance-review]
---

# Database Performance

## Rule: Evidence First

`EXPLAIN` plans and timing, before and after. Never index blindly.

## Workflow

1. **Identify**: slow-query log, DB metrics (via `observability/metrics.md` — query time, locks, connections), N+1 traces from the app.
2. **Analyze**: `EXPLAIN (ANALYZE, BUFFERS)` each slow query → full scans? wrong join order? implicit casts? row over-fetch (SELECT *)?
3. **Fix by leverage order**:
   1. **Query shape**: eliminate N+1 (batch/join), fetch only needed columns, remove functions-on-indexed-columns in WHERE (kills index use), split monster multi-join queries
   2. **Indexes**: composite matching the query pattern (equality columns first, then range/sort); partial/covering indexes where fitting; **CONCURRENTLY** in production (no lock)
   3. **Schema/mAccess patterns**: denormalize ONLY for a measured read-win that justifies write cost (ADR it); materialized views for expensive aggregations
   4. **Connection management**: pool sized for the DB's real capacity; no per-request connections; pool exhaustion = queue in front, not retry storms
   5. **Scale-out path** (last): read replicas for read-heavy → partitioning for huge tables → sharding (one-way door; ADR + human sign-off)
4. **Verify**: re-EXPLAIN, re-time under representative load; check write-latency impact (indexes aren't free) and lock behavior of migrations.

## Guardrails

- Any index without a named query it serves = speculative → reject
- Destructive ops (drops, big backfills) in maintenance windows; batched; lock-timeout set
- Slow-query monitoring persists after the fix (regression detection — `observability/monitoring.md`)

## Validation Checklist

- [ ] EXPLAIN before/after per optimized query
- [ ] Every new index tied to a named query
- [ ] Write-path impact measured
- [ ] Prod migrations lock-safe (CONCURRENTLY / windows / batches)

## Handoff

→ `review/performance-review.md`; schema changes via `development/database.md` migration rules.
