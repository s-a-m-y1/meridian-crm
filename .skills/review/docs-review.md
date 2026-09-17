---
name: docs-review
description: Review documentation for accuracy, freshness, and non-duplication
domain: review
phase: review
priority: medium
inputs: [doc-changes]
outputs: [docs-verdict]
dependencies: [review/specialized-reviews]
next_skills: [quality-gates]
---

# Documentation Review

The docs lens of the PR review (per `review/specialized-reviews.md`) — detailed here because docs failures hide longest (nobody executes docs until a newcomer gets hurt).

## The Checklist

### 1. Accuracy (the execution test)

- Every command in the diff EXECUTED by the reviewer (per `documentation/readme.md` command rules — copy-paste must work; "looks right" = not reviewed)
- Code samples compile/run against current API (drift-check like contract tests, but manual — samples are the #1 rot point)
- Config values match reality (`.env.example` entries ↔ actual required vars per `devops/project-init.md` env catalog)

### 2. Freshness (the sync test)

- Doc describes CURRENT behavior, not intended-future (aspirational docs = finding: mark planned or remove — per `core/agent-rules.md` docs-sync rule)
- Version-pinned references: library versions, API versions, dates (unversioned claims rot silently per `research/documentation-research.md` pinning rules)
- Screenshots/UI references match shipped UI (post-redesign stale screenshots = classic silent lie)

### 3. Duplication audit (the DRY-docs test)

- Same rule stated in 2 places = drift-risk finding: consolidate to one source + link (per `core/agent-rules.md` — docs sync via links, not restatement)
- Standards docs (conventions, checklists) live in ONE home; other docs reference (`product/feature-specification.md` links-not-duplicates rule, generalized)

### 4. Completeness for audience

- README: quick-start works from zero (per `documentation/readme.md` fresh-boot test)
- Setup: prerequisites version-pinned; failure paths documented (top-5 setup issues per `documentation/setup.md`)
- API docs: generated from contract (per `documentation/api-docs.md` — hand-maintained parallel docs = HIGH finding)
- Runbooks: alert-linked (per `observability/monitoring.md` no-orphan rule); steps executable by the responder at 3am (not just the author)

### 5. Structure/format

- Headings scannable; code-blocks language-tagged; no contradictory sibling sections (internal-consistency pass)

## Verdict

APPROVE / REQUEST_CHANGES (accuracy failures = HIGH+; duplication = MEDIUM with consolidation direction; freshness = MEDIUM with specific rot pointed out).

## Handoff

→ verdict → Gate 7 evidence; rot findings → `documentation/maintenance.md` freshness-audit backlog.
