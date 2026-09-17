---
name: integration-testing
description: Test components together — services with real DB, module boundaries
phase: testing
priority: high
inputs: [implementation, test-strategy]
outputs: [integration-suite]
dependencies: [strategy]
next_skills: [coverage, regression]
---

# Integration Testing

## Scope

Repo+real DB, service orchestration, auth rules, transactions, module boundaries, adapter behavior (fake/stub third parties for speed; real sandbox for contract-critical ones).

## Rules

1. **Real database** (containerized per `testing/strategy.md`) — mocks here defeat the purpose (SQL correctness is what integration tests verify).
2. Isolation per test: fresh schema/transaction-rollback per test — no shared mutable state, no order dependence.
3. Cover specifically:
   - Transactions: commit/rollback paths; multi-step flows (all-succeed + each-fails-midway)
   - Constraints: unique violation, FK violation, ON DELETE behavior
   - Auth rules per role (can/cannot matrix)
   - N+1 detection on hot paths (query counter assertion)
   - Migration up/down on a schema with representative data
4. External services: fakes with recorded fixture responses; contract tests against the real sandbox in a separate, slower tier.
5. Async/jobs: run inline in tests (await the job) — verify side effects + idempotency (execute twice → same state).

## Validation Checklist

- [ ] Runs against real DB in CI (containers)
- [ ] Per-test isolation verified (random order green)
- [ ] Rollback/compensation paths covered
- [ ] Jobs idempotency tested

## Handoff

→ `coverage.md`, `regression.md` (integration layer of regression suite).
