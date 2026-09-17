---
name: design-implementation-skills
description: Design layer implementation skills — user-research, flows, IA, wireframes, interaction, responsive
domain: design
phase: design
priority: medium
inputs: [personas, journey-maps, ui-spec]
outputs: [design-artifacts]
dependencies: [design/ux, design/ui]
next_skills: [development/frontend]
---

# Design Implementation Layer

Consolidates the requested design extensions. These are MODES within the design process (the existing skills `design/ux.md`, `design/ui.md`, `design/design-system.md`, `design/accessibility.md` remain the standards-bearers); this skill defines the distinct activities not yet explicit:

## 1. User Research (evidence mode — extends `marketing/personas.md` into UX depth)

- Methods inventory by question type: usability tests (5 users per persona — findability/friction), card sorting (IA validation), tree testing (nav findability), first-click tests (entry-point clarity), diary studies (behavior in context)
- Every session: 30-min structured script (tasks in user language, zero leading questions), findings logged with severity (per `review/code-review.md` levels: CRITICAL=no one completes task → INFO=preference)
- Rule: 5 users find ~85% of usability issues (Nielsen) — don't gold-plate research; DO test with EACH distinct persona

## 2. User Flows (per critical task — deepens `discovery/user-journey.md` product-stage)

- Flow diagram per task: entry → decision points → success/error exits (all failure exits designed per `design/ui.md` states discipline)
- Branch validation: every branch reachable in the UI AND covered by a test path (`testing/e2e.md` selection)

## 3. Information Architecture

- Content inventory → hierarchy (card-sort-informed) → navigation model → labeling (user words — `marketing/copywriting.md` customer-language rule)
- Test: tree test ≥ 80% find-rate on top tasks; nav depth ≤ 3 clicks to any core feature (`design/ux.md` navigation rule)

## 4. Wireframing (structure before skin)

- Low-fi first: regions + hierarchy + content priorities — NO visual decisions (per `design/ux.md` stage discipline)
- Annotated: each region links to its spec section (data, states, interactions); throwaway by design — wireframes answer "does the STRUCTURE work", pixels come later

## 5. Interaction Design

- Micro-interactions specified: trigger → feedback (<100ms perceptible per `design/ui.md`) → state change; debouncing, optimistic-vs-pending per action risk
- Destructive actions: confirmation patterns scaled to consequence (undo > confirm-dialog > typed-confirm for irreversible per `design/design-system.md` component rules)
- Keyboard alternatives for every pointer interaction (`design/accessibility.md` operable rules)

## 6. Responsive Design (structure-level)

- Breakpoint plan per component (reflow rules, hide/reveal priorities per `design/ui.md` responsive section) — decided at design time, not improvised by builders
- Content priority stacking: what survives the smallest viewport (the core job, always; chrome, conditionally)

## Handoff

→ outputs feed `design/ui.md` (full specs), `design/design-system.md` (new component needs), `development/frontend.md` (build).
