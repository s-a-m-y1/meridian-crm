---
name: test-strategy
description: Define the test pyramid, coverage targets and level assignment
phase: testing
priority: high
inputs: [requirements, acceptance-criteria, architecture]
outputs: [test-strategy, coverage-targets]
dependencies: [acceptance-criteria]
next_skills: [unit, integration, api-testing, e2e, performance]
---

# Test Strategy

## The Pyramid (and where each AC maps)

```
        /E2E\        few — one per critical user journey (slow, flaky-prone)
       /API-\        contract per endpoint (request/response/behavior)
      /Integr-\     service+repo+DB, cross-module boundaries
     /----------\   unit — the majority: fast, deterministic, isolated
```

- **Unit** (majority): pure logic + component render in isolation. Mock boundaries (time, random, network).
- **Integration**: real DB (containerized), real service wiring. Verify queries, transactions, auth rules.
- **API/contract**: endpoint behavior per `development/api.md` gates (happy + 401/403 + validation + rate limit + pagination edge).
- **E2E** (few, valuable only): money-paths — signup, purchase, core action. One per critical journey, max — flaky E2E suites destroy trust.
- Assignment rule: test at the **lowest level that can verify the AC**; E2E is the last resort, not the default.

## Standards (all tests)

- **Arrange-Act-Assert** structure; one behavior per test; test names = behavior statements (`rejects expired reset tokens`, not `test_7`)
- Deterministic: time/random/network mocked or containerized; no `sleep()`-based waits (poll conditions)
- No test interdependence; parallelizable by default
- Every bug fix adds a regression test (per `development/bug-fix.md`)
- Coverage floor: 80% lines on changed code, 100% of ACs mapped to ≥1 test (AC→test ID traceability table maintained)

## Workflow

1. Inventory ACs → assign each to a level (lowest possible).
2. Define fixture/seed strategy (`development/database.md` seeds) and test-env topology (containers).
3. Set CI gates: unit+integration on every PR; E2E + contract + coverage on merge to main; nightly perf (`testing/performance.md`).
4. Flaky-test policy: quarantine with expiry (max 7 days) + owner + fix task — never delete, never ignore.

## Validation Checklist

- [ ] Every Must AC mapped to ≥1 named test
- [ ] CI level gates defined
- [ ] Flaky policy in place

## Handoff

→ specific test skills: `unit.md`, `integration.md`, `api-testing.md`, `e2e.md`, `performance.md`, `regression.md`, `coverage.md`.
