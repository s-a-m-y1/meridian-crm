---
name: design-system
description: Define design tokens, component library and visual consistency rules
phase: design
priority: medium
inputs: [ui-specification]
outputs: [design-tokens, component-inventory]
dependencies: [ux]
next_skills: [development/frontend]
---

# Design System

## Workflow

1. **Tokens** (single source of truth, consumed by code — never hardcode values):
   - Color: primary/secondary/surface/text levels; semantic aliases (success/warning/danger/info); **dark mode = token inversion, not new components**
   - Spacing: 4/8px scale (4, 8, 12, 16, 24, 32, 48, 64) — no arbitrary values
   - Typography: 4-6 sizes, defined line-heights, one icon size per scale step
   - Radius, shadows, z-index scale (documented stacking order), motion durations/easings
2. **Component inventory**: audit UI specs → component list (Button, Input, Modal, Toast, Table, …) with variants:

   ```markdown
   ## Button

   Variants: primary | secondary | destructive | ghost
   Sizes: sm | md | lg States: default | hover | focus-visible | active | disabled | loading
   Rules: loading state keeps width (no layout shift); destructive needs confirm when consequence > trivial
   ```

3. **Composition rules**: when to use Modal vs page (transient vs navigable), toast vs inline error (ambient vs blocking), spacing between stacked elements.
4. **Excluded**: anything one-off belongs in the feature, not the system. System components must serve ≥2 features.

## Validation Checklist

- [ ] Tokens cover all specs' needs; no spec uses a raw value
- [ ] Every component: variants + all states (incl. focus-visible, disabled, loading) defined
- [ ] Each system component serves ≥2 use cases
- [ ] Dark mode achievable by token swap only

## Handoff

→ `development/frontend.md` builds tokens+components as the first frontend tasks.
