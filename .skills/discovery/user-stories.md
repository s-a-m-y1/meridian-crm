---
name: user-stories
description: Convert requirements into user stories with Given/When/Then acceptance criteria
phase: discovery
priority: high
inputs: [requirements-specification]
outputs: [story-backlog]
dependencies: [requirements]
next_skills: [acceptance-criteria, mvp]
---

# User Stories

## Workflow

1. Take each Must/Should FR; write stories: `US-<n>: As a <persona>, I want <capability> so that <benefit>`.
2. One story = one deliverable slice (thin vertical cut through UI→API→DB where possible).
3. Each story gets draft acceptance criteria inline (formalized by `acceptance-criteria.md`).
4. Decompose anything > 1 day into smaller stories; merge anything < 30 min with a neighbor.
5. Map story → FR(s) in a traceability table. An FR with no story = gap; a story with no FR = gold-plating — remove or log the requirement it serves.

## Story Template

```markdown
## US-007 — Password reset

As a **forgetful user**, I want **to reset my password via email link** so that **I can regain access without support**.

- FRs covered: FR-12
- Priority: Must
- Estimate: M
- Acceptance criteria (draft): can request reset; link single-use, expires 15m; rate-limited 3/hour
- Dependencies: US-002 (auth), email provider account
```

## Validation Checklist

- [ ] Every persona is a real one from the brief
- [ ] Every Must FR covered by ≥1 story
- [ ] No story without an FR source
- [ ] All stories ≤ M estimate

## Handoff

→ `acceptance-criteria.md` (formalize AC), `product/mvp.md` (scope selection).
