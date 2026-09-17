---
name: mvp
description: Define the minimum viable product scope that delivers core value safely
phase: product
priority: high
inputs: [prd, story-backlog]
outputs: [mvp-definition]
dependencies: [prd, user-stories]
next_skills: [prioritization, roadmap]
---

# MVP Definition

## Workflow

1. List Must-priority stories; ask of each: _"Without this, does the product deliver its core value?"_
   - Yes → MVP. No → post-MVP backlog.
2. Add **MVP-forcing constraints**: NFRs are never fully deferrable — pick minimum viable levels:
   - Auth + basic security: always in
   - Observability (logs + errors + health): always in
   - Performance: minimum viable = meet NFR at expected MVP traffic (not 10×)
3. Kill anything that serves a metric not in the PRD's success list.
4. Output the definition of done for the MVP: all MVP stories' ACs pass + gates 1-8 pass + smoke test on production.

## Output

```markdown
# MVP Definition — <project>

## Core Value Hypothesis (one sentence)

## In Scope (story IDs)

## Deferred (story IDs → reason → revisit trigger)

## Minimum NFR Levels (per category)

## MVP Definition of Done
```

## Validation Checklist

- [ ] MVP tells a complete user story end-to-end (not a half-flow)
- [ ] Every inclusion justified by core value or non-negotiable NFR
- [ ] Deferrals have revisit triggers (dates/metrics), not "someday"

## Handoff

→ `prioritization.md` (order the MVP work), `roadmap.md` (sequence releases).
