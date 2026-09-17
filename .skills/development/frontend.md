---
name: frontend-implementation
description: Standards for implementing frontend code — components, state, data, forms, errors
phase: development
priority: high
inputs: [frontend-architecture, ui-specification, design-system]
outputs: [frontend-code]
dependencies: [architecture/frontend, design/ui]
next_skills: [testing/unit, testing/e2e]
---

# Frontend Implementation

## Component Rules

- Server data → data layer (query cache); local UI state → `useState`; cross-feature → store (only with justification). No prop-drilling past 2 levels; no copying server data into client state (derive instead).
- Components: typed props, no `any`; colocate tests; shared components go to `components/`, feature-specific stay in the feature folder.
- Every interactive element: keyboard operable, focus-visible style (per `design/accessibility.md`).
- Every state from UI spec implemented: default/loading/empty/error/success/partial/boundary — loading = skeletons for content, buttons disable+spinner on submit (never double-submit).
- Layout stability: reserve space for async content; no CLS from late-loading images (dimensions declared).

## Data & Forms

- Requests via the typed API client only (generated from contract); no hand-written fetches bypassing error handling.
- Error normalization: network/server/validation each handled distinctly (offline banner vs toast vs inline fields).
- Forms: validation mirror of backend rules (but backend remains the authority — client validation is UX, not security); submit errors preserve user input; disable submit while pending; success confirms + navigates per spec.
- URL state (filters, page, tab) → query params — shareable/back-button correct.

## Performance (built-in, not bolted on)

- Route-level code splitting; below-the-fold/heavy components lazy-loaded; lists > 50 rows virtualized.
- Memoize only measured hot paths — no reflexive `useMemo` noise.
- Images: sized, lazy-loaded, modern formats; budget: initial route JS per `architecture/frontend.md` (verify in CI).

## Validation Checklist

- [ ] All 7 UI states per interactive element
- [ ] No `any` types; props typed
- [ ] Keyboard + focus-visible verified
- [ ] Performance budget met (measured, not assumed)

## Handoff

→ `testing/unit.md` (component tests incl. states + a11y), `testing/e2e.md` (journeys).
