---
name: workflow-new-project
description: Full chain from raw idea to first production release
phase: workflow
priority: high
inputs: [raw-idea]
outputs: [live-product, project-memory-initialized]
dependencies:
  [
    discovery,
    product,
    architecture,
    development,
    testing,
    review,
    security,
    documentation,
    devops,
  ]
next_skills: [workflow-new-feature, workflow-release]
---

# Workflow: New Project

Execute in order; each step's output feeds the next; gates (`quality-gates/gates.md`) mark the mandatory checkpoints.

```
0.  Business case      → business/market-research.md → competitive-analysis.md
                         → bmc.md (+ pricing.md, finance.md as needed)
                         → validation.md — KILL/PIVOT/BUILD verdict gates everything below
1.  Discovery          → discovery/idea-analysis.md            [GATE 1]
2.  Requirements       → discovery/requirements.md
3.  Stories + ACs      → discovery/user-stories.md → acceptance-criteria.md
4.  Product            → product/prd.md → mvp.md → prioritization.md → roadmap.md
5.  Architecture       → architecture/system-design.md (+ adr.md per decision,
                         auth-architecture.md, api.md, db.md, fe/be as needed) [GATE 2]
6.  Threat model       → security/threat-modeling.md
7.  Design             → design/ux.md → ui.md → design-system.md → accessibility.md
8.  Init repo/env      → devops/git.md + docker.md + ci.md scaffolding
9.  Task breakdown     → core/task-management.md (walking skeleton first)
10. Implement loop     → development/implementation.md (understand→plan→implement→validate→test→review)
    per task           → review/code-review.md                      [GATE 3 per task]
11. Test               → testing/strategy.md + family              [GATE 4]
12. Security review    → review/security-review.md                [GATE 5]
13. Performance       → testing/performance.md + review           [GATE 6]
14. Documentation     → documentation/* (readme, api-docs, setup, architecture-docs) [GATE 7]
15. Deploy dev→staging→prod → devops/cd.md + deployment.md        [GATE 8]
16. Validate prod     → observability/monitoring.md watch window  [GATE 9]
```

## Rules

0. Step 0 runs BEFORE any engineering: if validation verdict is KILL → project stops there (saved cost = win, recorded); PIVOT → restart step 0 with the pivot; BUILD → proceed with surviving assumptions as facts.

1. Initialize `.ai/` memory (project-state, architecture summary) at step 5 — memory starts at architecture time, not "later".
2. Walking skeleton (task #1 group): thin slice end-to-end (health→DB→one endpoint→one page) proving the stack — before fattening features (per `product/prioritization.md`).
3. Gate failures loop back to the producing step — never forward (Gate 2 fail → back to architecture, not "mind it").
4. Multi-agent execution from step 10: per `core/multi-agent.md` (worktrees, ownership, merge order).
5. Update `.ai/project-state.md` phase after every numbered step completes.

## Completion

Product live, gates 1-9 green, memory current, monitoring dashboards + alerts active, `.ai/` populated for the maintenance era.
