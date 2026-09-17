---
name: idea-analysis
description: Turn a raw idea into a structured problem statement with goals and constraints
phase: discovery
priority: high
inputs: [raw-idea]
outputs: [problem-statement, goals, constraints, risks]
dependencies: []
next_skills: [requirements]
---

# Idea Analysis

## Workflow

1. **Restate** the idea in one sentence. Confirm with the user if ambiguous — never guess.
2. **Problem**: what pain exists today, for whom, how measured?
3. **Target users**: personas (role, context, goal, current workaround).
4. **Goals**: business goals (revenue, cost, retention — measurable) + technical goals (scale, uptime, compliance).
5. **Constraints**: budget, deadline, platform, compliance (GDPR/HIPAA/SOC2), team, existing systems.
6. **Assumptions**: anything unverified → `.ai/context/assumptions.md`.
7. **Risks**: top 3-5 → `.ai/risks/R-<id>.md` (market, technical, compliance, schedule).
8. **Out of scope**: what this explicitly will NOT do (kills scope creep early).

## Output — Discovery Brief

```markdown
# Discovery Brief — <project>

## Problem

## Target Users (personas)

## Business Goals (measurable)

## Technical Goals

## Constraints

## Assumptions (each marked VERIFIED/UNVERIFIED)

## Risks (with likelihood/impact)

## Out of Scope
```

## Validation Checklist

- [ ] Problem stated as a measurable pain, not a solution
- [ ] Every goal has a metric
- [ ] Every assumption recorded and marked
- [ ] User confirmed the brief before moving on

## Handoff

→ `requirements.md` — needs: this brief.
