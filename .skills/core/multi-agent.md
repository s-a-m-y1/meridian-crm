---
name: multi-agent
description: Orchestrate multiple AI agents working in parallel safely
phase: core
priority: high
inputs: [task-breakdown]
outputs: [orchestration-plan, merge-order]
dependencies: [task-management, devops/git]
next_skills: [workflows/parallel-feature-execution]
---

# Multi-Agent Orchestration

## Roles

- **Coordinator** — decomposes work, assigns ownership, merges, runs final validation. Does not implement. **Spawning/monitoring worker sessions follows `core/delegation.md` (disk-based handoff — statuses only in coordinator context).**
- **Worker** — implements assigned tasks in its own worktree/branch. Does not touch others' files.

## The Prime Directive

> **No two agents ever write to the same file.** Ownership is declared in each task's `Files` scope; the coordinator rejects overlapping scopes or sequences them.

## Orchestration Protocol

1. **Decompose** (coordinator): task breakdown via `task-management.md`; merge overlapping-scope tasks or serialize them via dependencies.
2. **Assign**: each task gets an `owner: agent-<id>`; write it into the task file.
3. **Isolate**: each worker gets a **git worktree** + branch:

   ```bash
   git worktree add ../proj-w<id> -b feat/T-0042-<slug> main
   # agent works in ../proj-w<id>, sharing nothing but the base commit
   ```

   Worktrees give each agent a full checkout — no file contention at all.

4. **Bootstrap context**: workers read `.ai/project-state.md` + their task + declared scope files only.
5. **Execute**: each worker follows `development/implementation.md` + `review/code-review.md` on its own branch.
6. **Merge coordination** (coordinator, in dependency order):
   - Rebase each branch on main immediately before merge.
   - Conflict predicted (same area, different files) → merge smallest first.
   - Conflict on contract files (API/schema/types) → coordinator resolves, **both** owners informed; affected agents re-verify.
   - One branch at a time; run the full test suite after **each** merge — a bad merge never hides behind the next.
7. **Final validation** (coordinator): full pipeline — build, lint, full tests, security scan, gates 4-6, then hand to `workflows/release.md`.

## Conflict Prevention (beyond ownership)

- **Contract freeze**: shared contracts (API schema, DB migrations, shared types) are frozen until the owning task merges; other agents code against the committed contract.
- **DB migrations are single-threaded** — never two agents writing migrations; always serialize.
- **Lockfile is critical**: dependency changes are serialized; workers request new deps from the coordinator, who installs once and rebases workers.
- **Communication**: shared notes in `.ai/context/` (per-task scratch files, never the same file).

## Handoff Between Agents

Every worker ends its session with the standard Result (see `output-standard.md`) written to `.ai/tasks/T-<id>.md` under `## Result`, plus branch name + merge-readiness. The coordinator reviews these before merging — review between agents is mandatory, same standard as `review/code-review.md`.
