---
name: context-management
description: Load minimum viable context; track project state and decisions
phase: core
priority: high
inputs: [task]
outputs: [relevant-context]
dependencies: []
next_skills: [any]
---

# Context Management

## Context Loading Protocol (before any skill execution)

1. **State first**: read `.ai/project-state.md` — current phase, active tasks, blockers.
2. **Bounded exploration**: identify relevant files by name/pattern/grep — never read the whole repo.
3. **Minimum viable read set**:
   - The task's declared file list (if a task exists).
   - Direct dependencies (imports/requires) of files to be modified.
   - Interface/contract files (types, API schemas, DB schema).
   - `.ai/decisions/` entries affecting the task's area.
4. **Skip everything else.** Reading unrelated large files degrades reasoning quality and wastes the session.

Rules:

- Prefer grep/glob to locate, then read a targeted line range.
- For a modification task: read the **entire target file** before editing — partial reads cause broken edits.
- Cap context at what the task needs; if the task spans >10 files, it should have been decomposed (see `core/task-management.md`).

## Project State File — `.ai/project-state.md`

The single source of truth for where the project is. Template:

```markdown
# Project State

- Project: <name> — <one-liner>
- Phase: <0-17 name> # from SDLC map
- Active Workflow: <new-feature | bug-fix | ...>
- Updated: <date> — <agent>

## Active Tasks

| Task | Status | Owner |
| ---- | ------ | ----- |

## Blockers

- <task/issue — reason — who resolves>

## Gate Status

| Gate           | Status    | Evidence |
| -------------- | --------- | -------- |
| 1 Requirements | PASS/FAIL | link     |

## Notes
```

Update triggers (mandatory): task status change, gate pass/fail, new blocker, phase change, decision recorded.

## What to Track (and where)

| Track                | Location                          |
| -------------------- | --------------------------------- |
| Decisions            | `.ai/decisions/ADR-<n>-<slug>.md` |
| Tasks                | `.ai/tasks/T-<id>.md`             |
| Bugs                 | `.ai/bugs/B-<id>.md`              |
| Risks                | `.ai/risks/R-<id>.md`             |
| Architecture summary | `.ai/architecture.md`             |
| Assumptions          | `.ai/context/assumptions.md`      |
| Changelog            | `.ai/changelog.md`                |

**Before any important decision, read memory first.** After acting, write memory. An agent with stale memory is worse than a fresh one.
