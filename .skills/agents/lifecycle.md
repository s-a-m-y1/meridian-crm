---
name: agent-lifecycle
description: Full lifecycle of an agent session — boot, checkpoint, resume, termination
phase: agents
priority: medium
inputs: []
outputs: [lifecycle-standard]
dependencies: [core/delegation, agents/protocol]
next_skills: [core/memory-management]
---

# Agent Session Lifecycle

```
SPAWN → BOOT → WORK ⟲ (CHECKPOINT) → HANDOFF/TERMINATE → (archive)
                ↘ BLOCKED → (unblock) ↗        ↘ STALE → replaced (state on disk)
```

## 1. Spawn & Boot (per `core/delegation.md`)

Boot prompt = role + task + pointers (never explanations — files carry those). A booted session MUST, in order:

1. Read its task file completely + `.ai/project-state.md` + `.ai/architecture.md`
2. Read role definition (`agents/roles.md` — its authority row only)
3. Announce in sessions registry: status IN_PROGRESS + heartbeat

## 2. Work Cycle

- Follow role's skills exactly; statuses updated in front-matter as work progresses (TODO→IN_PROGRESS→REVIEW/TESTING→DONE)
- Every claim → evidence (commands + exit codes) appended under the task's Validation section
- Checkpoint: after each meaningful sub-step, append 1-3 lines to the task file (`## Progress: <done so far, next step>`) — this is what makes STALE recovery lossless

## 3. Blocked & Unblocked

- BLOCKED: write reason + who-can-unblock into task file + `QUESTION` message to CORD (protocol.md)
- CORD answers by updating the task file (never chat); worker sees the file change and proceeds
- Unblocking options: CORD decides / reassigns to a role that isn't blocked / splits the task

## 4. Handoff (normal end)

- Append full Result (output-standard.md) to the task file
- Set final front-matter status; update registry heartbeat
- Do NOT clean up: worktree + branch remain until CORD merges (merge may need rebase decisions)

## 5. Termination Types

| Type         | Trigger                           | Actions                                                                                                                         |
| ------------ | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| DONE         | Task REVIEW→merged by CORD        | Session CLOSED in registry; branch deleted post-merge by CORD                                                                   |
| SUPERSEDED   | Task re-split/obsolete            | Registry note + reason; branch discarded by CORD                                                                                |
| STALE        | No heartbeat/progress 2× expected | Kill session; fresh session boots from the SAME task file — Progress checkpoints make this lossless; registry notes replacement |
| VIOLATION    | Acting outside authority matrix   | Kill session + revert its branch + audit note in registry (roles.md kill rule)                                                  |
| CONTEXT-FULL | Session can't hold more context   | Checkpoint to task file → terminate → fresh session resumes (delegation.md coordinator rule, same for workers)                  |

## 6. Archive & Audit Trail

- Task files + message threads + registry rows are **never deleted** — they ARE the audit trail (who did what, why, when)
- Post-merge, sessions registry rows flip to CLOSED (kept, not removed) — enabling later forensics (e.g. RCA asking "which agent reviewed this?")

## Validation Checklist

- [ ] Every termination has a type + reason in the registry
- [ ] No session ended without Result in the task file (except VIOLATION kills)
- [ ] STALE replacements resumed from checkpoints (zero work lost)

## Handoff

→ memory writes per `core/memory-management.md`; orchestration per `agents/orchestrator.md`.
