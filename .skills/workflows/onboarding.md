---
name: workflow-onboarding
description: Onboard a new agent or human to the project — from zero to productive
domain: workflows
phase: core
priority: medium
inputs: [newcomer]
outputs: [productive-contributor]
dependencies: [core/context-management, documentation/developer-guides]
next_skills: [core/task-management]
---

# Workflow: Onboarding (Agent or Human)

```
1.  Boot-read       → the newcomer reads IN ORDER (core/context-management.md boot-protocol):
                       AGENT.md → .ai/project-state.md → .ai/architecture.md →
                       documentation/developer-guides.md developer-guide (core-flows section)
2.  Setup           → one-command up: scripts/setup.sh (devops/project-init.md §6 validated-setup)
                       — human-newcomer follows documentation/setup.md (its top-5-issues are the
                       onboarding-friction-log: every stumble = doc-bug tasked per its rules)
3.  Verify-boot     → run the full suite + a dev-command — GREEN before any work starts
                       (per testing/strategy.md never-start-on-red; also proves the env)
4.  Orientation     → .ai/decisions/ top-ADRs (the WHY-map per core/decision-log.md rationale-preservation)
                       + the task-board (project-state.md active-tasks) + review/specialized-reviews.md
                       (how work gets accepted here) — the culture-docs, compressed
5.  First-task      → scoped-starter (S-sized, real, non-critical-path per core/task-management.md sizing):
                       agent-newcomer gets task-via-contract (agents/contract.md — full protocol);
                       human gets a good-first-issue w/ a named-buddy (CONTRIBUTING.md pointer)
6.  First-review    → implementer≠reviewer enforced (agents/roles.md) — the newcomer's first diff
                       reviewed WITH teaching-tone (review findings phrased fix-not-lecture per
                       review/code-review.md rules) — the review IS the onboarding
7.  Feed-forward    → every-newcomer-friction logged (the doc-bug loop) — onboarding is a PRODUCT
                       with users (core/engineering-principles.md DX-attribute): the fresh-boot-test
                       (documentation/readme.md) runs EVERY onboard, formally or not — capture it
```

Success-bar: newcomer shipped a green-reviewed change without asking "how do I X" that's already-documented (question-asked-that-docs-answer = doc-gap finding; question-asked-that-docs-should = onboarding-gap — per `documentation/developer-guides.md` evidence-backed-FAQ rules, generalized).
