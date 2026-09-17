---
name: developer-guides
description: Contributing guide, coding standards, developer/user guides, FAQ
domain: documentation
phase: documentation
priority: medium
inputs: [project-conventions]
outputs: [guides]
dependencies: [documentation/readme, documentation/setup]
next_skills: [review/docs-review]
---

# Developer & User Guides

Four doc types with distinct audiences (per `core/communication.md` audience-first rule). README remains the entry (`documentation/readme.md`); these go deeper.

## 1. CONTRIBUTING.md (the collaboration contract)

- Prerequisites → setup pointer (`documentation/setup.md` link — never restate)
- Workflow: branch naming (`devops/git.md` conventions), commit style (conventional commits), PR expectations (task-linked, scope-matched per `core/task-standard.md`; review requirements per `review/specialized-reviews.md` PR process — implementer≠reviewer)
- Standards pointers: lint/format run commands (configs are the standard per `devops/project-init.md`), test expectations (gates per `testing/strategy.md` CI levels)
- Good-first-issues pointer + contact/maintainer channels
- Rule: contributing-friction kills contributions (agents AND humans — this doc is onboarding UX per `core/engineering-principles.md` DX attribute)

## 2. CODING_STANDARDS.md (the decisions-in-one-place doc)

- What it IS: links to the canonical skills/ADRs + repo-specific decisions (naming, error-handling pattern per `development/backend.md` taxonomy, import order)
- What it is NOT: a restatement of `core/agent-rules.md` or framework docs (duplication rots per `review/docs-review.md` audit rule — ONE source, linked)
- Living doc: changes via PR like code; stale-standard findings route here (per `documentation/maintenance.md` doc-freshness loop)

## 3. Developer Guide (deeper than setup — the "how we work here" doc)

- Architecture orientation (links `documentation/architecture-docs.md` + `.ai/architecture.md` summary)
- Domain walkthrough: the 2-3 core flows step-by-step (request lifecycle, a domain event's journey per `architecture/event-driven.md` — the NEW contributor's mental model)
- Where things live + why (the non-obvious structure rationale — `.ai/decisions/` links for the "why is it like this")
- Debugging starting points (local dev tips, common issues — feeds from `documentation/troubleshooting.md` entries that are dev-facing)

## 4. User Guide + FAQ (the product docs)

- Task-oriented (user jobs per `discovery/user-journey.md` framing — "how do I <do the thing>" not feature tours)
- FAQ from ACTUAL questions: support tickets + onboarding confusion sources (per `maintenance/customer-support.md` KB rules — the FAQ is support-data-driven, not imagined; each entry cites its evidence-class: "top-asked in tickets")
- Screenshots current (per `review/docs-review.md` freshness — post-redesign screenshot rot)
- In-product linking: user guide linked from help/empty-states (per `design/ui.md` empty-state next-action rule)

## Validation Checklist

- [ ] CONTRIBUTING matches actual workflow (a newcomer-agent completed a first PR using only it)
- [ ] CODING_STANDARDS is links+decisions, zero restatement
- [ ] Developer guide covers core flows; user guide task-oriented with evidence-backed FAQ

## Handoff

→ all docs subject to `review/docs-review.md`; freshness via `documentation/maintenance.md`.
