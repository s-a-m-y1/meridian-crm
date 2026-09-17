---
name: task-management
description: Decompose, delegate, and track tasks across the lifecycle
phase: core
priority: high
inputs: [requirements-or-feature, architecture]
outputs: [task-breakdown]
dependencies: [task-standard, architecture]
next_skills: [implementation, multi-agent]
---

# Task Management

## Decomposition Protocol

1. Read the feature/spec + architecture summary (`.ai/architecture.md`).
2. Split along **natural seams**: API contract → backend endpoint → DB layer → UI → tests → docs.
3. Apply rules of thumb:
   - A task is sized to complete in one focused session (S ≤ 2h, M ≤ 1d, L ≤ 3d — split L further).
   - Each task independently testable and reviewable.
   - Each task declares its file scope (enables parallel agents — see `multi-agent.md`).
4. Identify dependencies: build data model → API → service logic → UI.
5. Emit task files per `task-standard.md`; register all in `.ai/project-state.md`.

## Tracking Protocol

- Every status change → update the task file front-matter **immediately**.
- Stuck >30 min (agent) or >1 day (human)? → BLOCKED with reason.
- Daily (or per-session) snapshot in project-state: counts of TODO/IN_PROGRESS/BLOCKED/DONE.
- A discovered new requirement mid-task → new task, not scope creep.

## Dependency Rules

- A task may start only when all `dependencies` are DONE (or explicitly waived by a human with recorded reason).
- Circular dependency detected → decomposition is wrong; re-plan the seam.
- If a dependency is long-running, check whether this task's _file scope_ actually depends on it — often only the contract does, and the contract is already stable.

## Estimation & Priority

Priority = f(business value from `product/prioritization.md`, blocker-ness, risk). Sequence: blockers → high-value → high-risk-early (de-risk) → rest.
