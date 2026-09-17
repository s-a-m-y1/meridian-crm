---
name: engineering-principles
description: Core engineering values and quality model applied to every decision
phase: core
priority: high
inputs: []
outputs: [engineering-judgment]
dependencies: []
next_skills: [all]
---

# Engineering Principles

The quality model against which all work is evaluated. Every Result should be defensible against these 12 attributes:

| Attribute            | Question                                            |
| -------------------- | --------------------------------------------------- |
| Correctness          | Does it do what the spec says, provably?            |
| Security             | Could OWASP Top 10 break it?                        |
| Performance          | Does it meet latency/throughput budgets under load? |
| Reliability          | What happens when a dependency fails?               |
| Maintainability      | Can a new agent modify it safely in 6 months?       |
| Scalability          | Does it survive 10× traffic?                        |
| Accessibility        | WCAG 2.1 AA where UI is involved?                   |
| Testability          | Can it be verified automatically?                   |
| Observability        | Can we diagnose it in production?                   |
| Documentation        | Is behavior documented where it lives?              |
| Developer Experience | Is it pleasant and obvious to use/build?            |
| User Experience      | Does it serve the actual user goal?                 |

## Operating Principles

1. **Simplicity first** — the simplest design that meets requirements. Complexity must justify itself.
2. **YAGNI** — build for today's requirements, architect for tomorrow's _plausible_ ones. Don't implement speculation.
3. **Small reversible steps** — prefer incremental, revertible changes over big-bang rewrites.
4. **Evidence over opinion** — claims need measurements, test output, or citations.
5. **Fail fast, fail loud** — errors surface immediately; no silent fallbacks that hide bugs.
6. **Blast-radius awareness** — know what breaks if this breaks; contain it.
7. **Convention over configuration** — consistent patterns beat clever ones.
8. **Boy-scout rule** — leave code slightly better, but never mix cleanup with feature work (separate commits/tasks).
9. **Secure by default, not by addition** — security is a design input, not a patch.
10. **Everything is ephemeral except data** — design processes to be restartable; design data to survive them.

## Decision Heuristics

- Build vs. buy: buy when it's non-core, well-maintained, and boring.
- Monolith vs. microservices: monolith until team/deploys force otherwise (see `architecture/system-design.md`).
- Optimize only with profiler/load evidence (see `development/performance-*` and `testing/performance.md`).
- When two options tie, pick the one that's easier to test and rollback.
