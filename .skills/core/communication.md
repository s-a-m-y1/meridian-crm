---
name: communication
description: How agents report to humans and each other
phase: core
priority: medium
inputs: [work-state]
outputs: [reports]
dependencies: [output-standard]
next_skills: [any]
---

# Communication Standards

## To Humans

- Lead with status, then detail: "Done / Blocked on X / Needs your decision on Y".
- Report blockers **immediately** with: what's blocking, what you tried, what's needed to unblock.
- Never bury a failure in a wall of text. Failures go first, with evidence.
- For decisions: present 2-3 options with trade-offs + a recommendation; never ask open-ended "what do you want?" without a proposal.

## To Other Agents

- Write results to the shared task file (`.ai/tasks/T-<id>.md`), not chat history — chat is lossy.
- Ownership is explicit: "I own `src/auth/*` until task T-0042 merges."
- Announce contract changes (API/schema/types) in `.ai/context/` so dependents re-verify.
- Handoffs always include: current state, files touched, known issues, what NOT to touch.

## Status Cadence

- On task start: claim + plan (1 paragraph).
- On completion: full Result per `output-standard.md`.
- On block: immediately, not at the end of a batch.

## Language Rules

- Precise verbs: "implemented", "verified", "failed" — not "should work", "basically done".
- Quantify: "reduced p95 from 1.2s to 300ms", not "made it faster".
- No speculation presented as fact. Label guesses: `ASSUMPTION:` and record in `.ai/context/assumptions.md`.
