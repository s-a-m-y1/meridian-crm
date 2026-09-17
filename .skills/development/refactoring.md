---
name: refactoring
description: Safe restructuring of existing code without behavior change
phase: development
priority: medium
inputs: [refactor-request, test-suite]
outputs: [refactored-code, evidence-of-equivalence]
dependencies: [implementation]
next_skills: [review/code-review]
---

# Refactoring

## Rules

1. **Behavior change = not refactoring** — that's a feature or bugfix; different task, different review.
2. Preconditions (else BLOCKED):
   - Tests exist for the code being refactored, or are written FIRST to pin current behavior
   - Tests green before starting
3. Small steps, commit after each: extract → run tests → commit → next. Never a mega-refactor branch.
4. Keep refactors **mechanical** (rename, extract function, inline, move) — one pattern type per pass. Mixing patterns hides bugs.
5. Performance claims post-refactor require before/after measurements (`testing/performance.md`).

## Workflow

```
Analyze (what & why — smell + cost)
→ Risk assessment (high-risk code = weaker tests = add tests first)
→ Plan (steps, each independently green)
→ Refactor loop: one move → tests → commit
→ Performance check (if perf-relevant area)
→ Review (diff shows shape change, not behavior change)
```

## High-Risk Areas (extra care)

Public APIs, auth code, transactions/migrations, concurrent code, data transformations. For these: characterization tests + human review mandatory + no simultaneous parallel work in the same files.

## Validation Checklist

- [ ] Test suite green before AND after (same set, no skips added)
- [ ] Diff contains no logic changes (reviewer verifies)
- [ ] Public behavior untouched (API/schema outputs identical — verified by contract tests)
- [ ] Each commit independently green

## Handoff

→ `review/code-review.md` with note "refactor — verify shape-not-behavior".
