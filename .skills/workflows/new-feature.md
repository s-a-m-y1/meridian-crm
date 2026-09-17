---
name: workflow-new-feature
description: Chain from feature request through review to documentation
phase: workflow
priority: high
inputs: [feature-request]
outputs: [merged-tested-documented-feature]
dependencies:
  [discovery/requirements, architecture, development, testing, review]
next_skills: [workflow-release]
---

# Workflow: New Feature

```
1.  Clarify requirement   → discovery/requirements.md (scoped: this feature) [mini Gate 1]
2.  Stories + ACs         → discovery/user-stories.md + acceptance-criteria.md
3.  UX/UI if user-facing  → design/ux.md → ui.md (+ design-system.md components if missing)
4.  Architecture check    → review/architecture-review.md:
    Does this fit ADRs? New decision needed? Contract/schema impact? [mini Gate 2]
    - New ADR if a decision is being made (architecture/adr.md)
    - Threat-model delta if new attack surface (security/threat-modeling.md)
5.  Task breakdown        → core/task-management.md (sized tasks, file scopes, deps)
6.  Implement             → development/implementation.md (+ domain skill:
                            frontend/backend/database/api per layer touched)
7.  Tests with impl        → testing/* (ACs mapped per strategy.md)
8.  Regression             → testing/regression.md (blast radius per diff)   [GATE 3+4]
9.  Reviews                → review/code-review.md (+ security-review.md if
                            auth/input/PII touched; perf-review if hot path) [GATE 5/6 as apply]
10. Docs                   → documentation/* affected sections + changelog.md entry [GATE 7]
11. Merge per git.md → deploy via cd.md → staging validation (smoke) [GATE 8 staging]
```

## Rules

1. Steps 4-5 are mandatory even for "small" features — 15 minutes of arch-check prevents most "how did this become a rewrite" disasters.
2. Implementation loop per `development/implementation.md` — never skip understand/plan.
3. Parallelizable after step 5: multiple tasks/agents per `core/multi-agent.md` (or `workflows/parallel-feature-execution.md`).
4. Release: features merge to main; they ship on the next release train (`workflows/release.md`) unless flagged urgent.

## Completion

Feature merged, ACs verified with test evidence, regression green, review APPROVE, docs+changelog updated, staging smoke clean.
