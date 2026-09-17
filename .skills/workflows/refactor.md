---
name: workflow-refactor
description: Chain for safe structural improvement without behavior change
phase: workflow
priority: medium
inputs: [refactor-request]
outputs: [refactored-code, equivalence-evidence]
dependencies: [development/refactoring, testing, review]
next_skills: [workflow-release]
---

# Workflow: Refactor

```
1.  Analyze      → what + why (smell, cost: bugs caused / velocity lost / confusion risk)
2.  Risk assess  → area criticality × test strength; public API/contract/auth/transactions = high risk
3.  Preconditions → tests exist & green (else: WRITE THEM FIRST — pin current behavior) [BLOCKED if not]
4.  Plan         → mechanical steps, each independently green; announce to parallel agents (file ownership per core/multi-agent.md)
5.  Refactor loop→ development/refactoring.md: one move → full tests → commit → repeat
6.  Perf check   → testing/performance.md before/after IF perf-relevant area (verify no regression)
7.  Review       → review/code-review.md: "verify shape change, NOT behavior change" (contract tests prove)
```

## Rules

1. Separate branch/task from feature work — never ride along (per `development/refactoring.md`).
2. High-risk areas (auth, transactions, API): characterization tests + human review mandatory + no parallel work in same files.
3. Step 6 matters: some refactors silently regress performance (adding layers, indirection) — evidence over assumption.
4. Public behavior identical = proven by contract tests, not asserted (API/schema outputs diffed).

## Completion

Behavior provably unchanged (test + contract evidence), each commit green, perf unchanged (or improved, with numbers), review APPROVE.
