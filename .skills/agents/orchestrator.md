---
name: agent-orchestrator
description: Assemble, scale and command the agent team — the brain that stays small
phase: agents
priority: high
inputs: [work-request, task-breakdown]
outputs: [team-assembly-plan, scale-decisions]
dependencies: [agents/roles, core/delegation, core/task-management]
next_skills: [agents/protocol, workflows/parallel-feature-execution]
---

# Agent Orchestrator — Team Assembly & Scaling

The CORD (coordinator) runs this skill. Its own context stays tiny (statuses only, per `core/delegation.md`); the decisions below are recorded on disk, not held in memory.

## 1. Team Assembly (per feature/workflow)

```
Request size → minimum team:
- Single task (S)            → 1 DEV + auto self-review + CORD gate check
- Feature (2-6 tasks)        → DEV-BE + DEV-FE + QA + CORD (REV can be a second session or CORD-with-rules)
- Contract/schema work        → ARCH + 1 DEV + QA + CORD  (ALWAYS serialized, never parallel)
- Pre-release                → QA + SEC + PERF + OPS + CORD (review crew)
- Incident                   → SRE + 1 DEV + CORD (small, focused — big teams slow fires)
```

Rule: **smallest team that covers the authority matrix** (implementer≠reviewer, QA independent). Extra agents = coordination cost without benefit.

## 2. Scaling Protocol (auto-decisions, recorded to sessions.md)

| Signal                                                 | Action                                                                                           |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Queue of unblocked tasks > active workers of that role | Spawn worker for that role (up to cap)                                                           |
| Any worker BLOCKED > 30 min agent-time                 | CORD unblocks, reassigns, or re-splits — never leaves it stuck                                   |
| Worker finished all its tasks                          | Reassign to queued work of same role; else CLOSE session (don't keep idle sessions — they drift) |
| Merge backlog > 2 branches waiting                     | Pause spawning; drain merges first (per multi-agent serial-merge rule)                           |
| Conflict at merge                                      | CORD resolves + both owners re-verify; if repeated on same files → re-split ownership            |
| Context exhaustion (worker "stale")                    | Kill session; fresh session boots from task file (state on disk, zero loss per delegation.md)    |

**Caps**: DEV workers ≤ 5 per feature (more = merge thrash); QA/SEC/PERF ≤ 1 active each (their gates are chokepoints, not parallel work); total sessions ≤ 8 per CORD.

## 3. Command Loop (CORD heartbeat)

```
every cycle:
  1. read statuses (grep front-matter — delegation.md protocol)
  2. unblock: BLOCKED tasks — decide within the cycle
  3. assign: TODO tasks whose deps are DONE → idle matching role
  4. review queue: REVIEW tasks → route to REV (never the implementer)
  5. merge queue: approved branches → serial merge + full suite (multi-agent.md)
  6. update .ai/context/sessions.md + project-state (once per cycle)
```

A cycle ends when nothing is assignable/unblockable — CORD then reports (Result format) and waits, or proceeds to final validation when the board is clear.

## 4. Kill / Abort Rules

- Session acting outside authority (e.g. DEV merging) → kill session, revert its branch, note in sessions registry (audit trail).
- Task found mis-scoped mid-flight → stop the session, re-split, reassign — never "let it finish, fix later".
- CORD itself bloating → checkpoint notes to `.ai/context/`, fresh CORD session reads project-state + sessions registry and resumes (the disk is the state).

## Validation Checklist

- [ ] Team size matches the table (no vanity agents)
- [ ] Every spawn/kill recorded with reason in sessions registry
- [ ] Merge backlog drained before new spawns
- [ ] No idle sessions kept alive

## Handoff

→ `agents/protocol.md` (inter-agent communication), `workflows/parallel-feature-execution.md`.
