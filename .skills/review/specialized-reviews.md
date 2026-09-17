---
name: specialized-reviews
description: PR review process plus API, database, UX, a11y, test, docs, release reviews
domain: review
phase: review
priority: high
inputs: [diff, specs]
outputs: [review-verdicts]
dependencies: [review/code-review]
next_skills: [quality-gates]
---

# Specialized Reviews

`review/code-review.md` = the general engine (severity model, finding format, order-by-risk). THIS = specialized lenses applied when the change touches their domain. Same findings format everywhere: `[SEVERITY] location — issue — fix`.

## PR Review Process (the mechanics around all reviews)

1. PR = task-scoped (one task per PR per `core/task-standard.md`; scope-mismatch = first finding)
2. Reviewer ≠ implementer ALWAYS (per `agents/roles.md` separation — an agent reviewing its own work = VIOLATION finding at the process level)
3. Checklist: description↔diff match (undocumented changes = finding), task ACs addressed, tests adequate for the risk (per `review/test-review.md`), docs updated (per `review/docs-review.md`), checklist completed BEFORE verdict (no empty-approve)
4. Verdict: APPROVE / REQUEST_CHANGES with blocking-findings listed (per `review/code-review.md` verdict rules)

## API Review (on contract/route changes — per `architecture/api.md` standards)

- Contract drift: schema ↔ implementation (per `development/api.md` CI drift rules — the review verifies the CI check is actually wired for the NEW surface)
- Versioning: breaking changes properly versioned + deprecation notes (silent breaks = CRITICAL)
- REST/GraphQL conventions: resource naming, error envelope consistency, pagination, idempotency keys, rate-limit class, auth on every new route (401/403 semantics per `security/auth-security.md` rules)
- Response hygiene: no internal fields/leaks (per `security/api-security.md` exposure rules)

## Database Review (on schema/query changes — per `development/database.md` standards)

- Migrations: backward-compatible (two-step for breaking — the review REJECTS same-release contract drops); lock-behavior on prod-scale (CONCURRENTLY where supported, batched backfills); rollback path tested or irreversible-approved
- Constraint integrity: FK/unique/check where the DB can enforce (app-only enforcement = finding); UTC + money-types rules
- Query analysis: N+1 scan, index-justification per named query (speculative indexes = finding per `development/performance-database.md`), unbounded queries

## UX Review (on user-facing changes — per `design/design-qa.md`)

- The design-qa checklist is THE UX review (states completeness, copy conformance, interaction timing) — run in full for UI-diffs; this lens folds into the PR review when UI changes ride along
- Copy changes reviewed against `marketing/copywriting.md` standards (evidence-backed claims, one CTA, user language)

## A11y Review (on UI changes — per `design/accessibility.md`)

- Keyboard path + focus order + focus-visible; contrast + color-alone rules; semantic markup + ARIA-correctness; automated a11y checks in the suite green (violations on CRITICAL/SERIOUS = blocking per `testing/advanced-test-types.md`)

## Test Review (on test-heavy changes — per `review/test-review.md`)

- See `review/test-review.md` (created separately — kept there)

## Docs Review (on doc changes — per `review/docs-review.md` → `documentation/*` standards)

- See the documentation-family review section: accuracy (commands executed per `documentation/readme.md` rules), freshness (matches current behavior), no-duplication (links over restatement per `core/agent-rules.md` docs-sync rule)

## Release Review (pre-ship gate review — per `workflows/release.md` step 5)

- Release-plan conformance: the plan's IN-list shipped + OUT-list stayed out (per `product/release-planning.md`); gate evidence complete (gates 3-7 verdicts archived per `quality-gates/gates.md` evidence rules); rollback artifact ready (per `devops/deployment.md` readiness); comms prep done (changelog/support per `product/release-planning.md` comms section)

## Final Production Review (the last human-ish checkpoint before prod — Gate 9's opening)

- Pre-flight: monitoring dashboards live for the new surface (per `observability/monitoring.md` deploy-markers), alerts tested, rollback rehearsed one final time, on-call briefed; EVERY previous gate's evidence spot-checked (the "trust but verify" pass — per `quality-gates/gates.md` independent-verification rule for gates 8/9)

## Validation Checklist

- [ ] Every domain-touched lens applied (this file's per-lens checklists)
- [ ] Same severity model + finding format everywhere
- [ ] Verdicts evidence-linked; independent reviewer guaranteed

## Handoff

→ verdicts → `quality-gates/gates.md` gates 3-8 evidence; release → `workflows/release.md`.
