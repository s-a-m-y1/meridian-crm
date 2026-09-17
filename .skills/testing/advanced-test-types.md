---
name: advanced-test-types
description: Contract, snapshot, mutation, a11y, security, compatibility testing types
domain: testing
phase: testing
priority: medium
inputs: [test-strategy, api-architecture]
outputs: [specialized-tests]
dependencies: [testing/strategy, testing/api-testing]
next_skills: [review/test-review, quality-gates]
---

# Advanced Test Types

Distinct test TYPES (levels/pyramid live in `testing/strategy.md` + family; these extend the toolbox for specific risks).

## 1. Contract Testing (consumer-driven)

- Provider validates responses against the published schema (per `testing/api-testing.md` contract rules — drift = CI failure, restated as the contract-SUITE)
- Consumer-driven contracts (Pact-style) for internal services: consumers record expectations; providers verify against ALL consumers' pacts before merge (breaking a consumer = their test fails in OUR CI — the whole point)
- Webhooks-out: contracts per consumer registration (per `architecture/api.md` webhook contracts — payload schemas versioned + consumers notified on change)

## 2. Snapshot Testing (bounded use)

- Fits: rendered component structure, generated output (config, serializers, migration-generated DDL)
- Doesn't fit: business logic, dates/timestamps, anything with intentional variance — snapshot theater (update-button-driven testing) is the anti-pattern
- Rules: reviewed like diffs (a snapshot change IS a behavior change — reviewer must say "yes intended"); bounded scope (per-component, not whole-page blobs — one-word change shouldn't 500-line-diff); serializable (no flaky fields — date/id mocked per `testing/test-infrastructure.md` clock rules)

## 3. Mutation Testing (test-quality test — targeted use)

- Purpose: does the suite ACTUALLY detect bugs? (coverage % measures execution, not verification per `testing/coverage.md` — mutation measures assertion-strength)
- Scope: critical modules only (auth, payments, data transforms — running it repo-wide is compute theater); gate on criticals: mutation score ≥ threshold (e.g. 70%) — surviving mutants = tests that execute-but-don't-assert
- Workflow: run on critical module → surviving mutants triaged → either kill-test written OR mutant documented-equivalent (a legitimate outcome; log why) — score trend tracked per release

## 4. Accessibility Testing (per `design/accessibility.md` — the automated layer)

- Automated: axe-core in component tests + E2E journeys (violations = CI failure on CRITICAL/SERIOUS); eslint-plugin-jsx-a11y as the lint-layer
- Manual protocol stays (per `design/accessibility.md` — keyboard walkthroughs can't be automated away); test IDs reference the WCAG criteria (traceability: criterion → test)

## 5. Security Testing (per `security/security-testing.md` — the test-execution layer of it)

- Automated probes in the API suite: injection strings, oversized payloads, malformed bodies (per `testing/api-testing.md` negative probes)
- Dependency scans (per `security/dependency-security.md`) + secret scans (per `security/secrets.md` CI rules) as CI stages
- Pen-test = human-orchestrated activity (per `security/security-testing.md`); automated = the continuous floor

## 6. Compatibility Testing

- Browser matrix: primary (evergreen Chrome/Safari/FF) in CI; secondary nightly per `testing/e2e.md` cadence rules
- Mobile web: top devices × viewports (per `design/design-implementation.md` responsive specs — the spec IS the compatibility oracle)
- Native platforms (if `development/mobile.md`): iOS/Android versions matrix declared per store-stats (test on min + latest + 1-major-back)

## Validation Checklist

- [ ] Consumer contracts wired for internal services; webhook contracts versioned
- [ ] Snapshots bounded + reviewed; mutation score tracked on criticals
- [ ] a11y + security automated layers failing-CI on violations; compat matrix in CI

## Handoff

→ findings to `review/test-review.md`; gate evidence to `quality-gates/gates.md` (gate 4/5).
