---
name: adr
description: Write Architecture Decision Records capturing context, options and consequences
phase: architecture
priority: high
inputs: [architecture-decision]
outputs: [adr-file]
dependencies: [system-design]
next_skills: [architecture-review, memory-management]
---

# Architecture Decision Records

ADR = a dated, immutable record of a significant decision. Lives in `.ai/decisions/ADR-<n>-<slug>.md`.

## Template

```markdown
# ADR-007 — Use PostgreSQL as primary datastore

- Status: proposed | accepted | superseded by ADR-012
- Date: 2026-09-14
- Deciders: agent/architect + human sign-off

## Context

What forces the decision now (drivers, NFRs, constraints). Facts only.

## Options Considered

| Option | Pros | Cons | Fit with NFRs |
| ------ | ---- | ---- | ------------- |

## Decision

<Choice> — because <strongest reasons, tied to context>.

## Consequences

- Positive: ...
- Negative/accepted costs: ...
- Reversibility: easy | hard | one-way door
- Revisit trigger: <event/metric that should reopen this>

## Compliance

How to verify the decision is followed (checklist item for architecture-review).
```

## Rules

1. Immutable after acceptance — supersede, never edit (link both ways).
2. One decision per ADR. Small decisions use `core/decision-log.md` instead.
3. A one-way-door decision (data model, public API contract, vendor lock-in) always requires human sign-off.
4. No ADR, no architectural change — reviews check decisions against ADRs.

## Handoff

→ `review/architecture-review.md` checks compliance; `.ai/architecture.md` summary updated.
