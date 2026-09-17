---
name: ux-design
description: Design user research, user flows, information architecture and wireframes
phase: design
priority: high
inputs: [prd, personas, requirements-specification]
outputs: [ux-specification, user-flows, wireframes-description]
dependencies: [product/prd]
next_skills: [ui-specification, design-system]
---

# UX Design

## Workflow

1. **Research digest** (no real users for agents — use available evidence): support tickets, existing analytics, competitor patterns, platform conventions (users already know standard patterns — deviate only with strong reason).
2. **Information architecture**: content/feature inventory → hierarchy/grouping → navigation model (global nav + local contexts); label with user words not system words.
3. **User flows** for every critical task (from user stories' ACs): flow diagrams per AC — steps, decision points, error branches. Every flow must include its failure exits (invalid input, auth expiry, network error, empty result).
4. **Wireframes** (low fidelity, structural only): layout regions, hierarchy, what's primary vs secondary per screen — explicitly no visual styling at this stage.
5. **Form UX rules** (apply to any form): labels above fields; inline validation on blur, never on every keystroke; error messages say how to fix, near the field; required-field indicators; never delete user input on failed submit; sensible defaults; keyboard order = visual order.
6. **Mobile vs desktop**: task-continuity across breakpoints; touch targets ≥44px; primary actions reachable (bottom on mobile).

## Output — UX Specification

Per flow: entry point → steps → exit states (success/error) → what the user sees at each step. Per screen (wireframe): regions, hierarchy, states list.

## Validation Checklist

- [ ] Every user story has its flow (or is explicitly covered by one)
- [ ] Every flow has error exits designed
- [ ] Every form follows form UX rules
- [ ] Navigation reaches every feature within 3 clicks

## Handoff

→ `ui.md` turns wireframes into UI specs; `design-system.md` supplies components/tokens.
