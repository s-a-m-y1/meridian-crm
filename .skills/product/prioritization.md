---
name: prioritization
description: Rank backlog by value/effort/risk to sequence execution
phase: product
priority: medium
inputs: [mvp-definition, story-backlog]
outputs: [prioritized-backlog]
dependencies: [mvp]
next_skills: [roadmap, task-management]
---

# Prioritization

## Workflow

1. Score each story on three axes (1-5 each):

   | Axis   | 5 means                                                                        |
   | ------ | ------------------------------------------------------------------------------ |
   | Value  | Directly drives a PRD success metric                                           |
   | Effort | Small (invert: 5 = cheap)                                                      |
   | Risk   | De-risks the project if done early (unknown tech, third-party, data migration) |

2. Compute priority score = Value + Effort + Risk (higher = earlier). Treat as a heuristic ranking, not math truth.
3. Apply sequencing rules:
   - **Risk early**: risky/spiky work goes first — fail fast on the scary parts.
   - **Vertical first**: a walking skeleton (end-to-end thin slice) before fattening any layer.
   - **Dependencies win**: a dependency of N stories outranks its raw score.
4. Sanity-check top 10 with the user/product owner; record disagreements as decisions.

## Output

Ranked backlog table (story, value/effort/risk, score, phase assignment) + top-10 rationale.

## Validation Checklist

- [ ] Walking skeleton in the first ~5 items
- [ ] Highest-risk item scheduled in first third
- [ ] Order respects dependencies

## Handoff

→ `roadmap.md` (milestones from ranked backlog), `core/task-management.md` (execution).
