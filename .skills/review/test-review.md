---
name: test-review
description: Review tests for real coverage and assertion quality — anti-theater
domain: review
phase: review
priority: medium
inputs: [test-changes, acceptance-criteria]
outputs: [test-verdict]
dependencies: [review/code-review, testing/strategy]
next_skills: [quality-gates]
---

# Test Review

The specialized lens for test changes (or feature PRs' test portions) — extends `review/specialized-reviews.md` PR process. Mission: catch **test theater** — suites that pass while verifying nothing.

## The Anti-Theater Checklist

### 1. Assertion quality (the #1 catch)

- Every test asserts something that CAN FAIL (a test without a failing mode = coverage theater per `testing/coverage.md` rules)
- Assertions specific: exact values/behaviors, not "not-null" hand-waves on critical paths; error tests assert error TYPE + message-relevant parts (not just "threw")
- Mutation-mindset spot check: would this test catch a flipped comparison/changed boundary? (formal mutation runs per `testing/advanced-test-types.md` on criticals; review applies the mindset everywhere)

### 2. Coverage honesty

- ACs mapped: every task AC has a named test (per `core/task-standard.md` testing requirements — the review VERIFIES the mapping, not trusts it)
- Failure paths: negative/edge/boundary cases present (happy-path-only suites = finding per `testing/unit.md` case-design rules); the 7 UI states covered for component tests (per `design/ui.md` states)
- New code paths: untested branches in the diff = finding (branch-level, not just line-count per `testing/coverage.md`)

### 3. Test quality mechanics

- Isolation: no order-dependence, no shared mutable state (per `testing/test-infrastructure.md` — review greps for sleeps, cross-test leakage)
- Determinism: time/randomness/external-world handled (clock injection, seeded random, boundary mocks per mocking discipline) — flake introduced = HIGH finding (flakes tax everyone per `testing/strategy.md` costs)
- Naming/structure: behavior-statement names, AAA structure (per `testing/unit.md` standards)

### 4. The fix-the-test-to-pass anti-pattern

- Diff shows: test logic weakened to make a failing implementation pass (assertions narrowed, cases skipped, timeouts inflated)? = CRITICAL finding — the test suite exists to catch bugs, not to be negotiated with (per `core/agent-rules.md` never-ignore-failing-tests — this is its review-side enforcement)

## Verdict

APPROVE (tests verify what they claim) / REQUEST_CHANGES (specific theater findings — each with the fix: stronger assertion, missing case, isolation problem).

## Handoff

→ verdict → Gate 4 evidence; mutation stats trends → `documentation/maintenance.md`.
