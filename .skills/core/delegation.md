---
name: delegation
description: Spawn and manage worker agent sessions with disk-based handoff — keeps the coordinator context small
phase: core
priority: high
inputs: [task-breakdown]
outputs: [worker-sessions, sessions-registry]
dependencies: [task-management, multi-agent]
next_skills: [multi-agent, workflows/parallel-feature-execution]
---

# Delegation Protocol — Managing Worker Sessions Without Context Bloat

## The Problem This Solves

A coordinator that chats with N workers holds N conversations, N results, and N merge states in its own context window — it gets slow, forgets, and "falls asleep" (context exhaustion). The fix: **the coordinator's context holds only statuses; everything else lives on disk.**

## Golden Rules

1. **Disk is the interface.** Workers and coordinator communicate ONLY through task files and the sessions registry — never through conversation history.
2. **Coordinator reads status lines, never full results.** A status is 1 line (`T-0042: REVIEW`). A result is 50+ lines. The difference, times N workers, is the difference between a fresh coordinator and a dead one.
3. **Tasks must be self-contained.** A worker should NEVER need to ask the coordinator anything — if it does, the task file was incomplete (fix the task, not the chat).
4. **One worker = one task = one branch = one worktree.**

## Protocol

### 1. Prepare (coordinator, before spawning)

Each task file must already contain (per `task-standard.md`): objective, context, file scope, ACs, dependencies, conventions pointer. Add the boot section:

```markdown
## Worker Boot

- Branch: feat/T-0042-<slug> | Worktree: ../proj-w2
- Do not touch: <files owned by other sessions>
- Done means: status REVIEW + Result written in this file
```

### 2. Spawn (one boot prompt per worker session — nothing else)

Use the standard boot contract in `agents/contract.md` (role + task + rules — the full protocol). Team assembly, scaling caps and the CORD command loop live in `agents/orchestrator.md`; inter-agent messaging formats and veto rules in `agents/protocol.md`.

```
You are worker W-2, owner of task T-0042.
1. Read .ai/tasks/T-0042.md — it contains EVERYTHING you need.
2. Follow .skills/development/implementation.md for the loop:
   Understand → Plan → Implement → Validate → Test → Review
3. Work ONLY on files listed in the task's scope.
4. On completion: append your Result to the task file and set
   front-matter status to REVIEW. On blocker: status BLOCKED + reason.
5. Do not chat back — everything you need to say goes in the task file.
6. Update the heartbeat line in .ai/context/sessions.md when you
   start, and on every status change.
```

Workers also read `.ai/project-state.md` + `.ai/architecture.md` (boot context) — but NEVER other workers' task files.

### 3. Register — `.ai/context/sessions.md`

```markdown
# Sessions Registry

| Session | Task   | Branch             | Status      | Heartbeat |
| ------- | ------ | ------------------ | ----------- | --------- |
| W-1     | T-0041 | feat/T-0041-auth   | IN_PROGRESS | 14:20     |
| W-2     | T-0042 | feat/T-0042-emails | REVIEW      | 14:05     |
```

Coordinator updates this table by READING front-matter statuses — a single grep-sized operation, not file-by-file full reads:

```bash
grep -H "^status:" .ai/tasks/T-00{41,42,43}.md
```

### 4. Poll (coordinator, lightweight loop)

- Check statuses every cycle: DONE/REVIEW → merge phase; BLOCKED → unblock or reassign; no change for a long stretch → STALE check.
- **STALE session**: heartbeat older than ~2× its last progress → do NOT assume failure: read that one task's Result section only, then decide (reassign / spawn fresh worker from same task file — the task file IS the state, so a new session resumes losslessly).
- Never open a worker's conversation or worktree unless merging or unblocking.

### 5. Merge (coordinator, serial per `multi-agent.md`)

Rebase → merge one branch → run full suite → update registry (session CLOSED) → next. After all merges: final CI (`devops/ci.md` stages) → hand to `workflows/release.md`.

### 6. Close

Registry rows stay (audit trail); task files keep their Results; `.ai/project-state.md` updated once, at the end — not continuously during execution.

## Failure Handling

| Situation                          | Action                                                                                                                                                     |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Worker asks a question in chat     | Answer by updating the task file, not by chatting — keep the interface on disk                                                                             |
| Worker stuck / context dead        | Task file is the state: spawn fresh session with the same boot prompt; it resumes                                                                          |
| Conflicting edits discovered       | Per `multi-agent.md`: coordinator resolves, both owners re-verify                                                                                          |
| Coordinator's own context bloating | Delegate more, hold less: statuses only; if it still grows, checkpoint to `.ai/context/` notes and start a fresh coordinator session reading project-state |

## Validation Checklist

- [ ] Every spawned session had a self-contained task file (zero questions asked = proof)
- [ ] Coordinator context contained only statuses (no full Result copies)
- [ ] Registry current; stale sessions detected and handled
- [ ] Merges serial with full suite between each

## Handoff

→ merge per `core/multi-agent.md`; release per `workflows/release.md`.
