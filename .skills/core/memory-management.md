---
name: memory-management
description: Project memory structure and read/write protocol for .ai/
phase: core
priority: high
inputs: []
outputs: [project-memory]
dependencies: []
next_skills: [context-management]
---

# Project Memory (`.ai/`)

## Structure

```
.ai/
├── project-state.md      # live snapshot: phase, tasks, blockers, gates
├── architecture.md        # current architecture summary (mirrors ADRs)
├── changelog.md           # release-level changes
├── decisions/             # ADR-<n>-<slug>.md — immutable once accepted
├── tasks/                # T-<id>.md per task-standard.md
├── bugs/                 # B-<id>.md
├── risks/                # R-<id>.md
└── context/
    └── assumptions.md    # every ASSUMPTION ever made
```

## Read Protocol (before important decisions)

1. `project-state.md` — where are we?
2. Decisions touching the current area (grep by slug in `.ai/decisions/`).
3. Open risks + bugs in the same area.
4. Relevant task files (active ones only).

## Write Protocol (after acting)

| Event                     | Memory Write                                                        |
| ------------------------- | ------------------------------------------------------------------- |
| Task status change        | task file + project-state                                           |
| Gate pass/fail            | project-state Gate Status table                                     |
| Architectural/tech choice | new ADR via `architecture/adr.md`                                   |
| New risk identified       | `.ai/risks/R-<id>.md` (risk, likelihood, impact, mitigation, owner) |
| Bug found                 | `.ai/bugs/B-<id>.md` (report, repro, status)                        |
| Assumption made           | append to `.ai/context/assumptions.md`                              |
| User-visible change       | `.ai/changelog.md` entry                                            |

## Immutability Rules

- ADRs are append-only. Superseding = new ADR linking "Supersedes: ADR-N" + status changed on the old one (never edit its rationale).
- Task/bug files keep history — status changes append, prior results stay.

## Garbage Discipline

Memory exists to be _used_, not hoarded: risk resolved → mark resolved with evidence; assumption confirmed → convert to requirement/fact; changelog entries never edited after release.
