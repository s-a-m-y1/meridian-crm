---
name: user-journey
description: Map end-to-end user journeys with emotion, barriers and jobs-to-be-done
domain: discovery
phase: discovery
priority: medium
inputs: [personas, user-stories]
outputs: [journey-maps]
dependencies: [marketing/personas]
next_skills: [design/ux, marketing/funnel]
---

# User Journey Mapping

## Relationship To Other Skills

`marketing/personas.md` builds the persona-format journeys (marketing lens: awareness→advocacy, funnel economics). THIS skill maps **product journeys** (usage lens): the end-to-end path to complete a job-to-be-done — deeper on in-product stages, barriers, and handoff-to-design. Use whichever lens the task needs; both pull from the same persona evidence.

## Workflow

1. **Pick the job** (jobs-to-be-done framing): "when I <situation>, I want to <motivation>, so I can <outcome>" — journeys serve jobs, not screens
2. **Stages**: the user's path in THEIR terms (current-state map from research/interviews — how they do it TODAY incl. non-product tools):
   `trigger → research → evaluate → first use → adopt → (habitual use / abandon) → advocate`
3. **Per stage** (evidence-sourced per personas rules):
   - Actions + touchpoints (where they are: search results, invite emails, in-app)
   - Thoughts + questions ("is this legit?", "will it work for MY case?")
   - **Emotion curve** (annotate: frustrated/hopeful/anxious/proud) — dips = churn-risk points
   - **Barriers** (the gold): each barrier gets an owner + task (product fix, content answer, email sequence)
   - Time + drop-off data where available (`marketing/analytics.md`)
4. **Moments of truth**: mark the 2-3 make-or-break points (activation moment, first-payment hesitation, first-error encounter) — these get disproportionate design/UX investment (`design/ux.md` + `design/ui.md` states)
5. **Future-state map**: journey with our product — each barrier from current-state gets its resolution mapped; new journey validated against personas (walk through it as each persona — "would <persona> actually do step 3?")
6. **Feeds downstream**:
   - Barriers → backlog (product or marketing tasks with owners)
   - Moments of truth → UX flows (`design/ux.md`) + E2E scenarios (`testing/e2e.md` — journeys are the E2E selection basis)
   - Emotion dips → `marketing/retention.md` save-flow design points

## Validation Checklist

- [ ] Journey framed as job-to-be-done (not screen tour)
- [ ] Current-state evidence-sourced (interviews/analytics, not imagined)
- [ ] Every barrier tasked to an owner; moments of truth marked
- [ ] Future-state walked-through per persona

## Handoff

→ `design/ux.md` (flows), `testing/e2e.md` (journey-based scenarios), barriers → task backlog.
