---
name: accessibility
description: Apply WCAG 2.1 AA standards and verify accessibility
phase: design
priority: high
inputs: [ui-specification]
outputs: [accessibility-specification]
dependencies: [ui]
next_skills: [testing/unit, testing/e2e, security]
---

# Accessibility (WCAG 2.1 AA)

## Requirements (all builds — non-negotiable)

**Perceivable**

- Text alternatives for all meaningful images; decorative images `alt=""`
- Color contrast: 4.5:1 normal text, 3:1 large text/UI components; **never color alone** to convey state — icon/label too
- Content readable at 200% zoom; no horizontal scroll at 320px width

**Operable**

- Everything keyboard-reachable: Tab order = logical/visual order; no keyboard traps
- Visible focus indicator (2px offset outline minimum) — never remove without an equal alternative
- Touch targets ≥44×44px
- No motion that flashes > 3×/second; respect `prefers-reduced-motion`

**Understandable**

- Page `<title>` unique/descriptive; one `<h1>`; headings form a real outline
- Labels programmatically tied to inputs (`<label for>`); errors described in text, tied via `aria-describedby`
- Navigation consistent across pages; focus management on route change and modals (focus in on open, restore on close)

**Robust**

- Use semantic HTML first (`button` not `<div onclick>`); ARIA only when semantics are insufficient — every `aria-*` rule requires verification (wrong ARIA is worse than none)
- `<html lang>`; form purpose attributes (`autocomplete`) for common fields

## Workflow

1. Audit UI specs for the above; annotate gaps into the spec.
2. Automated checks (axe/eslint-plugin-jsx-a11y) wired into CI.
3. Keyboard walkthrough script per critical flow (tab-through test) — manual/agent checklist.
4. Manual protocol for interactive components: focus order, focus-visible, screen-reader announcement of state changes (`aria-live` for toasts/async results).

## Validation Checklist

- [ ] Automated a11y checks pass on every screen
- [ ] All critical flows pass keyboard-only walkthrough
- [ ] All form errors announced + tied to fields

## Handoff

→ feeds `testing/unit.md` (a11y assertions in component tests) and `testing/e2e.md` (a11y in journeys).
