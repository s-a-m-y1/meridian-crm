---
name: design-qa
description: Pre-handoff design QA — verify implementation matches spec before release
domain: design
phase: design
priority: medium
inputs: [ui-spec, implementation]
outputs: [design-qa-report]
dependencies: [design/ui, design/design-system]
next_skills: [review/code-review]
---

# Design QA

## Position

The design-side review gate before code review: does the BUILT thing match the SPEC'd thing? (Implementation quality is `review/code-review.md`; visual/UX conformance is here.) Runs when UI work is review-ready.

## The QA Checklist (per screen/flow, against `design/ui.md` spec)

### Conformance

- [ ] All 7 states implemented (default/loading/empty/error/success/partial/boundary) — the classic miss: happy path only
- [ ] Content matches spec (copy from `marketing/copywriting.md` — unreviewed copy changes are findings)
- [ ] Interaction behavior: triggers, feedback timing, debouncing per spec
- [ ] Data rendering: empty-value handling ("—" not blank), truncation rules at boundary content (longest name)

### System discipline

- [ ] Design tokens used (zero magic values — per `design/design-system.md`; hardcoded colors/spacing = finding)
- [ ] Component variants per system (no ad-hoc lookalikes); dark mode renders correctly (token inversion — not broken)

### Accessibility (per `design/accessibility.md` — the non-negotiables)

- [ ] Keyboard path works per flow; focus order logical; focus-visible everywhere
- [ ] Contrast pass; no color-alone state signals; alt text present
- [ ] Screen-reader announcement on async state changes (aria-live per spec)

### Responsive & i18n

- [ ] Breakpoints per spec (each viewport: nothing overflows, nothing unreachable)
- [ ] RTL rendering (per `development/i18n-rtl.md` — mirrored layout, directional icons flipped, bidi isolation for mixed content)

## Finding Format + Severity

Same model as `review/code-review.md`: `[SEVERITY] location — spec says X, built Y — fix Z`. Design QA verdict: APPROVE / REQUEST_CHANGES (any CRITICAL/HIGH — broken states, a11y failures — is blocking; MEDIUM token-drift fixable in-pass).

## Workflow

1. Spec-side pass (screen-by-screen checklist above, annotated with findings + screenshots)
2. Cross-device spot check (min: desktop, mobile-width, RTL if shipped locales)
3. Report → implementer fixes → re-verify CRITICAL/HIGH only (MEDIUMs tracked)
4. Approval recorded in task file (design-qa section) → code review proceeds

## Rules

- QA against the SPEC, not reviewer taste (disagreements with the spec itself → spec change via `design/ui.md`, not silent fixes)
- Screenshot-diff for regressions where tooling exists (per `testing/test-infrastructure.md` §6 if wired)

## Handoff

→ APPROVE → `review/code-review.md`; findings → implementer; spec bugs found → `design/ui.md` update first.
