---
name: frontend-architecture
description: Design frontend architecture — rendering, state, data layer, routing
phase: architecture
priority: high
inputs: [system-design, ui-specification]
outputs: [frontend-architecture-document]
dependencies: [system-design, design/ui]
next_skills: [development/frontend]
---

# Frontend Architecture

## Workflow

1. Choose **rendering strategy** against NFRs:

   | Strategy            | When                                            |
   | ------------------- | ----------------------------------------------- |
   | SPA                 | Rich interactivity, logged-in apps              |
   | SSR / framework SSR | SEO, fast first paint on content pages          |
   | Static + hydration  | Content sites, marketing                        |
   | Hybrid (per-route)  | Mixed content/interactive apps — most real apps |

2. Design the **layered structure** (keep layers one-directional: ui → state → services → api-client):

   ```
   src/
   ├── app/ (routes, entry)      ├── features/<domain>/ (ui + state colocated)
   ├── components/ (shared)      ├── services/ (api clients, external)
   ├── stores/ (cross-feature)   └── lib/ (pure utils)
   ```

3. Choose **state management** per state type (state colocation principle):
   - Server state → data-fetching cache (e.g. react-query-style: caching, dedupe, retries)
   - URL state → router params/query (shareable, back-button-correct)
   - Client UI state → local/component state
   - Global client state → store ONLY if truly cross-feature (justification required — most "global" state is server state in disguise)
4. Define **API data layer**: typed client generated from API schema (single source of contract truth), error normalization, auth token refresh.
5. Routing plan: route list, guards (auth/roles), code-splitting boundaries (per-route chunks), 404/error boundaries.
6. Performance budgets (initial JS, TTI targets from NFRs) → drives lazy-loading and bundle strategy from day one.
7. Record choices as ADRs where contestable (SPA vs SSR, state library).

## Validation Checklist

- [ ] Every route listed with its guard + data dependencies
- [ ] State classified (server/url/local/global) with justifications
- [ ] Performance budget stated; initial-JS estimate under it
- [ ] Contract source defined (generated types from API schema)

## Handoff

→ `development/frontend.md` implements against this; `design/design-system.md` feeds components.
