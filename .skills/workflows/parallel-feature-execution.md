---
name: workflow-parallel-execution
description: Multi-agent delivery of a task set for one feature
phase: workflow
priority: medium
inputs: [task-breakdown]
outputs: [merged-validated-feature]
dependencies: [core/multi-agent, core/task-management, devops/git]
next_skills: [workflow-release]
---

# Workflow: Parallel Feature Execution

```
1.  Decompose        → core/task-management.md
2.  Ownership audit  → core/multi-agent.md: file scopes disjoint?
                       overlapping → serialize via dependencies OR re-split
                       contracts/schema/migrations/lockfile → single-threaded always
3.  Provision        → git worktree + branch per worker (commands in multi-agent.md)
3b. Self-contain     → each task file gets Worker Boot section (core/delegation.md)
4.  Workers run      → spawn per core/delegation.md boot prompt: implement→test→review
                       each in its own worktree; ends with Result in task file
                       + heartbeat row in .ai/context/sessions.md
5.  Agent reviews    → review/code-review.md applied by other agents (review is
                       part of the workflow, not optional cross-agent courtesy)
6.  Merge order      → dependency order (coordinator): rebase → merge one branch
                       → full suite → repeat (never two-at-once)
7.  Final validation → full CI (ci.md stages 1-10) + regression + security/perf as apply
8.  Hand to release  → workflows/release.md (normal train or flagged urgent)
```

## Failure Modes (watch for)

| Signal                                   | Response                                                                       |
| ---------------------------------------- | ------------------------------------------------------------------------------ |
| Contract conflict at merge               | Coordinator resolves; both branch owners re-verify against the merged contract |
| Lockfile conflict                        | Coordinator takes all dep changes serially; rebases workers                    |
| Long-lived divergence (branches rotting) | Merge earlier/smaller; decomposition too coarse — re-plan                      |
| Blocked worker                           | Coordinator reassigns or re-splits; BLOCKED status propagates to dependents    |

## Rules

1. Workers never merge to main — only the coordinator does (single merge point = clean history + one brain holding the ordering).
2. No contract/schema/migration/lockfile work in parallel. Ever. (This is where multi-agent projects actually break.)
3. Every merge is followed by the full suite — a broken merge is caught at its merge, not discovered three merges later.

## Completion

All tasks DONE (evidence in task files), branches merged sequentially green, final CI green, feature handed to release workflow.
