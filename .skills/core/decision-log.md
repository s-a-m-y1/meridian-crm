---
name: decision-log
description: Record significant engineering decisions as lightweight ADRs
phase: core
priority: medium
inputs: [decision-context]
outputs: [adr-file]
dependencies: []
next_skills: [architecture/adr]
---

# Decision Logging

Any decision that a future agent could question — stack choice, pattern, contract, breaking change — gets logged. For full architecture decisions use `architecture/adr.md`; use this lightweight format for the rest.

## Lightweight Decision Record (`.ai/decisions/D-<n>-<slug>.md`)

```markdown
# D-014 — Use optimistic UI for cart updates

- Date: 2026-09-14 | Decider: agent/pm-1 (human-approved)
- Status: accepted | superseded-by D-020
- Context: cart latency complaints; server round-trip 400ms p95.
- Options: (a) optimistic update (b) skeleton+refetch (c) websocket push
- Decision: (a) — best perceived perf; conflict resolution is rare (single-user carts).
- Consequences: + fast UX; − needs rollback-on-failure logic; tests must cover 409 case.
```

## What MUST Be Logged

- Technology/dependency adoption or removal
- Contract (API/schema/event) changes
- Breaking changes / dropped backward compatibility
- Consciously accepted risk (link the risk file)
- Human overrides of agent recommendations

## Rule of Thumb

If you'd have to re-derive it from scratch in a week, or someone might ask "why is it like this?", log it.
