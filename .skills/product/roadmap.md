---
name: roadmap
description: Define milestones, releases and the route from MVP to full product
phase: product
priority: medium
inputs: [prioritized-backlog, mvp-definition]
outputs: [roadmap, milestone-plan]
dependencies: [prioritization]
next_skills: [workflows/new-project, task-management]
---

# Roadmap

## Workflow

1. Group the ranked backlog into **milestones** (2-6 weeks of work each): each milestone = a demo-able outcome.
2. Each milestone gets:

   ```markdown
   ## M1 — Walking skeleton (target: <date>)

   Outcome: user can <end-to-end capability> (demo script one-liner)
   Stories: US-001, US-003, US-007
   Exit criteria: milestone ACs pass, gates 1-6 green, perf baseline recorded
   Dependencies: <external things needed by this date>
   ```

3. Sequence releases: MVP release (M1-M2) → growth/hardening releases. Tag each release with theme + trigger (metric or date — never "when it's ready").
4. Load-balance: milestones with heavy risk get scope headroom (cut list ready in advance — lowest value stories first to cut).
5. Identify cross-milestone prep that must start early (infra, accounts, data migration, security review time) — schedule those as explicit tasks.

## Validation Checklist

- [ ] Every milestone demo-able by a human
- [ ] Dependencies scheduled before dependents
- [ ] Every release has an objective trigger
- [ ] Prep work (infra/security/legal) on the roadmap, not implied

## Handoff

→ `workflows/new-project.md` (kick off M1), `core/task-management.md` (break M1 into tasks).
