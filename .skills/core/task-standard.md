---
name: task-standard
description: Canonical task file format and lifecycle statuses
phase: core
priority: high
inputs: [work-request]
outputs: [task-file]
dependencies: []
next_skills: [task-management, implementation]
---

# Task Standard

Every unit of work is a task file: `.ai/tasks/T-<seq>.md` (zero-padded, e.g. `T-0042.md`).

## Canonical Format

```markdown
---
id: T-0042
title: Add password reset endpoint
type: feature | bug | refactor | chore | docs | infra
status: TODO | IN_PROGRESS | BLOCKED | REVIEW | TESTING | DONE
owner: <agent-id or human>
dependencies: [T-0040] # task IDs that must be DONE first
priority: high | medium | low
estimate: S | M | L
---

# T-0042 — Add password reset endpoint

## Objective

One sentence — the outcome, not the method.

## Context

Why this task exists; links to PRD/story/bug it implements.

## Scope

### Files (declared scope — edits outside this list are out of scope)

- `src/api/routes/auth.ts` (modify)
- `src/api/services/reset-token.ts` (create)
- `tests/api/reset.test.ts` (create)
  Out of scope: <explicitly excluded>

## Implementation Requirements

- <numbered, verifiable requirements>

## Acceptance Criteria

- [ ] AC1: <Given/When/Then or observable outcome>
- [ ] AC2: ...

## Testing Requirements

- Unit: <what>
- Integration: <what>
- Regression: <what must not break>

## Security Requirements

- <auth needed, input validation, rate limits, secrets touched>

## Performance Requirements

- <budgets: latency, payload, N+1 avoidance>

## Documentation Requirements

- <README/API docs/changelog/ADR updates needed>

## Expected Output

- <artifacts: code, migrations, docs, config>

## Validation

- [ ] Lint/typecheck pass (cmd: <cmd>)
- [ ] Tests pass (cmd: <cmd>)
- [ ] Acceptance criteria all checked
- [ ] Scope respected (no out-of-list files changed)

## Handoff

→ Next: <skill or task>, needs: <inputs>

> If this task will be executed by a spawned worker session, also add the
> **Worker Boot** section per `core/delegation.md` (branch, worktree,
> do-not-touch list, done-definition) — the task file must be self-contained
> enough that a fresh session needs ZERO chat to execute it.
```

## Status Lifecycle

```
TODO → IN_PROGRESS → REVIEW → TESTING → DONE
              ↘ BLOCKED → (unblock) → IN_PROGRESS
TODO/any → CANCELLED (with recorded reason — never silently deleted)
```

| Status      | Meaning                            | Owner must                                |
| ----------- | ---------------------------------- | ----------------------------------------- |
| TODO        | Defined, not started               | Have deps DONE                            |
| IN_PROGRESS | Being implemented                  | Update on progress/blockers               |
| BLOCKED     | Cannot proceed                     | State blocker + who resolves, immediately |
| REVIEW      | Implemented, awaiting review       | Pass review/code-review.md                |
| TESTING     | Under QA                           | Pass tests + coverage                     |
| DONE        | All gates for the task passed      | Evidence linked in Validation             |
| CANCELLED   | Obsolete/descoped (kept for audit) | Record reason + superseding task/decision |

## Rules

1. A task without acceptance criteria is invalid — return it to planning.
2. Status transitions are recorded in the task file (edit the front-matter).
3. `DONE` requires evidence (commands + exit codes) pasted under Validation.
4. If scope must grow, create a new task — don't silently expand this one.
5. One task = one reviewable change (roughly one PR).
