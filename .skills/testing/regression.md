---
name: regression-testing
description: Verify existing behavior still works after changes
phase: testing
priority: high
inputs: [change, full-test-suite]
outputs: [regression-evidence]
dependencies: [strategy]
next_skills: [release-workflow]
---

# Regression Testing

## Definition of Done (any change)

Every task/PR runs the full affected pyramid: unit + integration + API tests, plus any E2E touching changed flows. Evidence (command + exit code) pasted in the Result — "should still work" is not regression testing.

## Scope Analysis

1. From the diff: changed modules → which tests cover them (direct).
2. Changed **shared code** (utils, auth, schema, API contracts, design-system components) → blast radius: grep consumers → their tests too, plus contract tests if API/schema changed.
3. Contract/schema changes → ALL API tests + dependent E2E journeys.
4. Any doubt → run the full suite (it exists precisely for this).

## Special Regressions

| Trigger           | Extra regression required                                       |
| ----------------- | --------------------------------------------------------------- |
| Dependency update | Full suite + smoke on a deployed env (dev)                      |
| Refactor          | Full suite, zero skips added (per `development/refactoring.md`) |
| Migration         | Integration migration tests + data backfill verification        |
| Hotfix            | Full suite + the incident's repro test + post-deploy prod smoke |

## Release-Level Regression

Pre-release (`workflows/release.md`): full pyramid + full E2E set + perf smoke + security scan. Tagged regression suite = the release gate.

## Validation Checklist

- [ ] Blast-radius analysis recorded (which tests, why those)
- [ ] Full affected suite green, evidence pasted
- [ ] No skipped/failing tests waved through

## Handoff

→ `workflows/release.md` (Gate: regression green required).
