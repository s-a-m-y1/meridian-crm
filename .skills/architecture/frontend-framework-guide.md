---
name: frontend-framework-guide
description: Stack-specific implementation standards — React/Next.js default profile
phase: architecture
priority: medium
inputs: [frontend-architecture]
outputs: [stack-profile]
dependencies: [frontend]
next_skills: [development/frontend]
---

# Frontend Stack Profile — React / Next.js (Default)

**Why this default**: React = largest ecosystem/AI-training corpus (agents write it best), Next.js covers SPA+SSR+static in one framework (rendering-strategy decision per `architecture/frontend.md` becomes per-route, not per-project). Alternatives (Vue/Svelte/Solid) stay valid via ADR — this profile just removes decision cost when nothing favors an alternative.

## Project Shape (App Router)

```
src/app/            routes (server components by default)
src/components/     shared, presentational
src/features/<d>/   domain: components + state colocated
src/lib/            api client (typed, generated), utils
```

## Rules (map to existing skills)

| Concern                  | Rule                                                                                                                     | Source skill                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| Server/client components | Default server; `"use client"` only for interactivity — push leaf-first                                                  | architecture/frontend            |
| Data fetching            | Server components fetch directly; client via typed query cache — no raw fetch in components                              | development/frontend             |
| State                    | Server state→cache; URL state→params; local→useState; global→store only with justification                               | architecture/frontend            |
| Forms                    | Server Actions or typed API layer; validation mirrors backend (client = UX only)                                         | development/frontend             |
| Rendering per route      | `default` SSR for content, `force-static` for marketing, SPA-mode for app islands — decided per route in the route table | architecture/frontend            |
| Performance budgets      | Initial route JS budget in CI (Lighthouse/bundle-analyzer); images `next/image`; fonts `next/font` (no layout shift)     | development/performance-frontend |
| Testing                  | Vitest (unit/component per testing/unit) + Testing Library queries by role/label; Playwright for E2E per testing/e2e     | testing/*                        |
| Styling                  | Tailwind tokens or CSS-vars — values from `design-system.md` tokens only, no magic values                                | design/design-system             |
| a11y                     | eslint-plugin-jsx-a11y + axe in CI per design/accessibility                                                              | design/accessibility             |

## Other-Stack Profiles (pointer)

When an ADR selects a different stack, write the equivalent profile as its own file in this folder (e.g. `profile-vue.md`) mapping the SAME concerns to that stack — the concern table is the invariant, the stack answers it.

## Validation Checklist

- [ ] Every concern row has a concrete rule (no "use best practices")
- [ ] Route table includes rendering strategy per route
- [ ] Budget wired into CI

## Handoff

→ `development/frontend.md` implements; deviations require ADR.
