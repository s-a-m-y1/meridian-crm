---
name: mobile-development
description: Mobile app development — React Native / Flutter, native bridges, store release
phase: development
priority: medium
inputs: [frontend-architecture, design-system]
outputs: [mobile-app]
dependencies:
  [architecture/frontend, design/design-system, development/frontend]
next_skills: [testing/e2e, devops/ci, devops/cd]
---

# Mobile Development

## Stack Decision (ADR required)

| Option                | When                                                      |
| --------------------- | --------------------------------------------------------- |
| React Native          | Web team shares code/logic; large ecosystem; JS/TS talent |
| Flutter               | Custom UI heavy; performance-critical; Dart talent        |
| Native (Swift/Kotlin) | Platform-specific features critical; maximum performance  |

Default: **React Native (Expo)** for most products — code sharing with web, fast iteration, Expo EAS for builds.

## Architecture

- Shared core: API client (`development/api.md`), state management, business logic — pure TS, shared with web
- Platform layer: navigation (Expo Router), native modules (camera, biometrics, push), UI components (React Native primitives + design system tokens)
- Code sharing target: ≥70% logic shared; UI per-platform (design tokens map to RN/Flutter equivalents)

## Development Standards

- **Expo managed workflow** (EAS Build) — no native config drift; OTA updates for JS changes (`expo-updates`)
- **TypeScript strict**; shared types from API schema (`development/api.md`)
- **Testing**: unit (Jest), component (React Native Testing Library), E2E (Detox / Maestro) — CI on device farms
- **Performance**: JS bundle < 2MB (Hermes + Metro config); startup < 3s cold; 60fps scroll; memory < 150MB
- **Native modules**: minimal, typed via Codegen; prefer Expo modules over custom native code
- **Push notifications**: Expo Push / FCM / APNs — token management, deep links, categories
- **Biometrics / Keychain / Secure Storage**: Expo SecureStore / Keychain / Keystore — never plaintext secrets

## Release Pipeline

1. **EAS Build** (CI): dev → preview (TestFlight / Play Internal) → production
2. **OTA updates** for JS-only changes (expo-updates) — instant rollout, kill-switch via `feature-flags.md`
3. **Store release**: automated via EAS Submit; screenshots, metadata from `marketing/copywriting.md` assets
4. **Rollback**: OTA revert (instant) or store version rollback (Apple/Google review) — `feature-flags.md` kill-switch instant

## Testing

- Unit: Jest (shared logic)
- Component: React Native Testing Library (shared components)
- E2E: Detox (iOS/Android simulators) or Maestro (cross-platform) — CI on device farms
- Visual regression: snapshot tests per screen (RTL + LTR)

## Validation Checklist

- [ ] Shared logic ≥70%; platform code isolated
- [ ] EAS Build + OTA configured; kill-switch tested
- [ ] Performance budgets met (bundle, startup, memory, FPS)
- [ ] Store metadata + screenshots from marketing assets
- [ ] Push + deep links tested on device; biometrics/secure storage verified

## Handoff

→ `devops/ci.md` (EAS Build), `devops/cd.md` (EAS Submit), `feature-flags.md` (OTA kill-switch), `testing/e2e.md` (Detox/Maestro).
