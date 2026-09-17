---
name: test-infrastructure
description: Test data, mocking, environments, isolation, flaky tests, visual regression
domain: testing
phase: testing
priority: high
inputs: [test-strategy]
outputs: [test-infrastructure]
dependencies: [testing/strategy]
next_skills: [testing/unit, testing/integration]
---

# Test Infrastructure

The substrate every test skill stands on (strategy/levels live in `testing/strategy.md`+family; THIS = data/mocks/env/isolation/flake/visual).

## 1. Test Data Management

- **Factories over fixtures**: builders with sensible defaults + overrides per case (fixtures = brittle shared state; factories compose per `core/engineering-principles.md` convention rule)
- Realistic edge seeds mandatory in factories: unicode (incl. Arabic per `development/i18n-rtl.md`), max-length, empty, emoji, RTL strings — boundary content tested as routine, not heroics
- Per-suite datasets: hermetic (each suite builds its world — zero cross-suite coupling); production-shaped data generators for perf tests (per `testing/performance.md` env rules — 100-row demos answer nothing)

## 2. Mocking Discipline (mock only true boundaries)

- Mockable set: time, randomness, network/external services, filesystem, queues (per `testing/unit.md` rules — restated as the checklist)
- **Contract mocks**: external-service mocks generated from their schemas (OpenAPI/recorded fixtures per `testing/api-testing.md` contract rules — hand-imagined mocks drift from reality silently)
- Mock fidelity check: mocks assert the calls they receive (args, order-when-mattered) — mocks that just return data test nothing about the interaction
- Anti-pattern: mocking the SUT's internals (mock what you don't own, never what you're testing)

## 3. Test Environment Topology

- Tiered: in-memory (unit) → containerized real deps (integration — per `testing/strategy.md` container rules) → full-stack staging (E2E/per `testing/e2e.md`)
- Parity rule: staging config-shape = prod (per `devops/cd.md` single-artifact — environment differences by VALUES only); local = containers via one command (per `devops/project-init.md` setup validation)
- Env spin-up/teardown automated in the suite lifecycle (self-cleaning — a suite that leaves state poisons the next run)

## 4. Test Isolation

- Per-test transaction-rollback or fresh-schema (per `testing/integration.md` isolation — no order dependence, verified by **random-order CI runs** at least weekly)
- Parallel-safe: no shared mutable fixtures; suite-level sharding where volume demands
- Time-travel discipline: clock injection everywhere (no real `now()` in testable code — the #1 flake source)

## 5. Flaky Test Protocol (per `testing/strategy.md` quarantine policy, operationalized)

- Flake = any test passing AND failing on identical code — the detector: CI retries-with-tracking (test outcomes recorded per run; 2+ outcomes on same SHA = flagged)
- Quarantine: ≤ 7 days, owner + fix task, expiry alert (per `testing/strategy.md` — never delete, never ignore)
- Root-cause via categories: time (fix: clock injection), order (fix: isolation), async (fix: polling-not-sleeps per `testing/e2e.md`), resource (fix: env teardown), external (fix: mock the boundary)

## 6. Visual Regression

- Screenshot-diffs on shared components + key screens (per-component baseline; diffs reviewed — visual changes are CHANGES, reviewed like diffs); RTL + LTR baselines (per `development/i18n-rtl.md` test rule)
- Anti-flake: deterministic rendering (fixed viewport/font/animation-disabled in captures); threshold tuned to catch real changes without AA-pixel noise

## Validation Checklist

- [ ] Factories with edge-seeds; hermetic suites; random-order CI green
- [ ] Mocks = boundaries only, generated from contracts, interaction-asserting
- [ ] Flake detector + quarantine-with-expiry running; visual baselines incl. RTL

## Handoff

→ substrate consumed by all `testing/*` skills; flake stats to `documentation/maintenance.md` health signals.
