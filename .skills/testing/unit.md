---
name: unit-testing
description: Write fast, isolated unit and component tests
phase: testing
priority: high
inputs: [implementation, test-strategy]
outputs: [unit-test-suite]
dependencies: [strategy]
next_skills: [coverage]
---

# Unit Testing

## Scope

Pure functions, services with mocked boundaries, UI components in isolation (all states per `design/ui.md`).

## Rules

1. Test **behavior through the public API** of the unit — never private internals (those tests break on every refactor without catching bugs).
2. Mock only true boundaries: time, randomness, network, filesystem, other processes. Everything else real.
3. Component tests must cover: render (content), interaction (act → assert), all states incl. empty/error/loading, a11y assertions (per `design/accessibility.md` — roles/labels), boundary content (longest strings).
4. Parameterize variants (one test, many cases) for input matrices; **always include invalid input cases** — testing only happy paths is testing half the contract.
5. Determinism: fixed clocks/seeds; no real network; no relying on execution order.
6. Speed budget: full unit suite < 60s (or it stops being run).

## Case Design (per unit)

Happy path → each failure branch → boundaries (empty, zero, max, off-by-one) → invalid inputs → concurrency where applicable. Each case traces to an AC or a branch of the implementation (untested branch = gap).

## Validation Checklist

- [ ] Names read as behavior statements
- [ ] Zero inter-test dependencies; suite passes run in random order
- [ ] Failure paths and boundaries covered (not just happy)
- [ ] Component states + a11y assertions present

## Handoff

→ `coverage.md` (gap analysis), `regression.md` (suite wiring).
