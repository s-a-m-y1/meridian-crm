---
name: test-coverage
description: Measure coverage, analyze gaps, keep it honest
phase: testing
priority: medium
inputs: [test-suite]
outputs: [coverage-report]
dependencies: [unit, integration]
next_skills: [quality-gates]
---

# Test Coverage Analysis

## Rules

1. Coverage **measures what's executed, not what's verified** — it finds untested code; it does not prove correctness. Use it as a gap detector, never as a quality score to maximize (chasing 100% produces assertion-free tests).
2. Budgets: ≥80% lines on **changed code** (PR-level); critical-path modules (auth, payments, data transforms) ≥90%.
3. Gap analysis workflow:
   - Generate report (lines + branches) on changed files
   - For each uncovered branch: deliberate (unreachable? trivial?) or write the missing test
   - Assertion quality check: any test without an assertion that could fail = delete or fix (assertion-free tests are coverage theater)
4. **AC coverage** (the metric that matters): every AC has ≥1 named test in the traceability table (`testing/strategy.md`). A green suite with an untested AC is a gap coverage % won't show.
5. Coverage regression: PRs that drop changed-code coverage below budget fail CI.

## Output

Coverage % (changed + critical modules), uncovered-branch dispositions (test added / justified), AC traceability status, verdict vs budget.

## Handoff

→ `quality-gates/gates.md` (Gate 4 evidence); gaps → new test tasks.
