---
name: ui-specification
description: Produce implementable UI specifications including all interactive states
phase: design
priority: high
inputs: [ux-specification, design-system]
outputs: [ui-specification]
dependencies: [ux, design-system]
next_skills: [development/frontend, accessibility]
---

# UI Specification

## Workflow — Per Screen/Component

1. **Anatomy**: regions + components used (from the design system — no ad-hoc components when a token/component exists).
2. **Data bindings**: what data each element shows, empty-value rendering (`—`, not blank/`undefined`).
3. **States — MANDATORY enumeration per interactive element**:

   | State    | Spec must define                                                                               |
   | -------- | ---------------------------------------------------------------------------------------------- |
   | Default  | Content, layout                                                                                |
   | Loading  | Skeletons > spinners for content areas; optimistic UI where safe; disable-not-hide the trigger |
   | Empty    | Helpful message + next action ("No projects yet → Create project"); never a blank page         |
   | Error    | What message, retry affordance, what happens to user input                                     |
   | Success  | Confirmation + next navigation                                                                 |
   | Partial  | Subset of data — what renders missing                                                          |
   | Boundary | Max content (longest name/title), overflow behavior (truncate/ellipsis/wrap rules)             |

4. **Interactions**: triggers, feedback (<100ms perceptible), debouncing on inputs, optimistic vs. pending UI per action.
5. **Responsive behavior**: breakpoints, reflow plan, hide/reveal priorities per breakpoint.
6. **Accessibility annotations**: heading structure, focus order, ARIA only where semantics are insufficient, keyboard alternatives for pointer interactions (full spec → `accessibility.md`).

## Output — UI Spec (per screen)

```markdown
# <Screen> — UI Spec

## Anatomy | ## Data Bindings

## States (all 7 rows above)

## Interactions | ## Responsive | ## Accessibility Notes
```

## Validation Checklist

- [ ] All 7 states specified for every interactive element
- [ ] No ad-hoc components/tokens duplicating design system
- [ ] Every error state pairs with a recovery action
- [ ] Focus order + keyboard path defined

## Handoff

→ `development/frontend.md` (build), `design/accessibility.md` (a11y check), `testing/strategy.md` (component tests per state).
