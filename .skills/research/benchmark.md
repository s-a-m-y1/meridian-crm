---
name: benchmark
description: Design fair, reproducible benchmarks with statistical honesty
domain: research
phase: research
priority: medium
inputs: [poc-question, performance-budgets]
outputs: [benchmark-report]
dependencies: [research/proof-of-concept, testing/performance]
next_skills: [development/performance-backend, development/performance-database]
---

# Benchmarking

## Rules (the integrity rules)

1. **Reproducible or worthless**: script committed, environment documented (CPU/RAM/runtime/data), seed fixed — a benchmark someone can't rerun is an opinion
2. **Median of N ≥ 3 runs** (5 for noisy metrics); report p50/p95/p99 spread, not single runs
3. **Warm-up accounted**: cold vs warm stated (JIT/DB cache/page cache distort comparisons — compare warm-to-warm, cold-to-cold)
4. **Realistic scenario** (`testing/performance.md` rules): our payload sizes, our data volume, our query shapes — synthetic micro-benchmarks (fibonacci loops) prove nothing about our system
5. **Same-conditions comparison**: one variable per benchmark round (versions/tools differ, nothing else); wall-clock AND resource (CPU/mem/IO) — a "faster" tool that eats 2× RAM has a different truth
6. **No post-hoc cherry-picking**: metrics declared BEFORE running (per `business/validation.md` bars); publishing the flattering run from 10 = fraud

## Benchmark Design Template

```markdown
# Benchmark: <question> — <date>

Environment: <hardware, runtime versions, data volume+shape — fully scripted>
Contenders: <A vs B — versions; single differing variable>
Methodology: workload (ops/s shape), duration, warm-up, runs N, metrics captured
Metrics: <declared upfront — e.g. p50/p95 latency, throughput, p99 mem>
Results: <table — all runs, not just best>
Verdict: <against pre-declared bars> | Script: <path to committed repro>
```

## Common Pitfalls (checklist against)

- [ ] Dead-code elimination (benchmarked function optimized away — use consumed results)
- [ ] Timer resolution (ms clocks on microsecond ops)
- [ ] Concurrent interference (other processes during run; container CPU throttling unaccounted)
- [ ] Data in page cache (first run "cold" — label it, don't mix)
- [ ] Version skew (library X.1 vs X.2 differences attributed to the tool)

## Validation Checklist

- [ ] Repro script committed; env documented; fixed seed
- [ ] ≥3 runs, spread reported; warm/cold labeled
- [ ] Metrics pre-declared; all runs published
- [ ] One variable differed between contenders

## Handoff

→ feeds `research/technical-research.md` decisions; findings executed by `development/performance-*` skills.
