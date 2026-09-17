---
name: e2e-testing
description: End-to-end tests of critical user journeys in a production-like environment
phase: testing
priority: medium
inputs: [test-strategy, ui-specification]
outputs: [e2e-suite]
dependencies: [strategy]
next_skills: [regression, release-workflow]
---

# End-to-End Testing

## Selection Rule

E2E only for **critical user journeys** (revenue/signup/core-action, per `testing/strategy.md`). Everything else stays at lower levels. A journey qualifies if: its failure = direct business damage AND it cannot be fully verified lower in the pyramid.

## Rules

1. Environment: production-like (real build, real DB, seeded data) — E2E against mocks tests nothing real.
2. Write journeys as a user would experience them — step names in user language ("user resets password and logs in"), asserting observable outcomes (URL, visible content, email received via test inbox), never internals.
3. Stability over coverage: no fixed sleeps (poll for conditions); resilient selectors (`role`, `label` — never nth-child/xpath); auto-retry once on failure with capture (screenshot + trace + network log on failure — mandatory for debugging).
4. Auth journeys: login, logout, session expiry, password reset (full flow incl. email link).
5. Cross-browser: primary browser in CI; secondary (e.g. WebKit/Safari) for the top journeys only; full matrix nightly.
6. Mobile: critical journeys on a mobile viewport (responsive behavior per `design/ui.md`).
7. Data lifecycle: each journey creates and cleans its own entities (prefixed IDs); no shared fixtures between journeys.

## Validation Checklist

- [ ] Every journey maps to a critical AC (no convenience E2E)
- [ ] Zero fixed sleeps; selectors resilient
- [ ] Failure artifacts (screenshot/trace) captured automatically
- [ ] Runs green 3 consecutive times before trusted (flaky = quarantine per strategy)

## Handoff

→ `regression.md` (E2E layer pre-release), `workflows/release.md` (gate).
