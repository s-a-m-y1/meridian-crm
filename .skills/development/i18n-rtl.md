---
name: i18n-rtl
description: Internationalization and RTL support — locales, translations, RTL layouts
phase: development
priority: high
inputs: [market-research, design-system]
outputs: [i18n-implementation]
dependencies: [design/design-system, design/accessibility]
next_skills: [development/frontend, testing/unit]
---

# Internationalization & RTL

## Rules

1. **RTL is not a toggle — it's a layout direction**: use logical CSS properties (`margin-inline-start`, `padding-inline-end`, `border-inline-start`) instead of physical (`left`/`right`). The browser handles flip when `dir="rtl"` on `<html>`.
2. **Locale-aware from day one**: even if English-only at launch, every user-facing string uses a translation key (`t('key')`) — hardcoded strings are technical debt that costs 10× later.
3. **Direction per locale**: `ar`, `he`, `fa`, `ur` → `dir="rtl"` + `lang="ar"` on `<html>`. Locale detection: user preference > `Accept-Language` > fallback.
4. **Date/number/currency formatting via Intl API** — never hand-format. `new Intl.DateTimeFormat(locale)`, `Intl.NumberFormat(locale, {style:'currency', currency})`.
5. **Translation workflow**:
   - Keys in JSON/YAML per locale (`en.json`, `ar.json`) — keys semantic (`auth.login.button` not `button_login`)
   - ICU MessageFormat for plurals/gender/select (`{count, plural, one {item} other {items}}`)
   - Missing key → show key in dev, fallback to base locale in prod (never crash)
   - Translation review gate: no merge with missing keys in base locale
6. **RTL QA checklist** (per `testing/unit.md` + `testing/e2e.md`):
   - Mirror layout (navigation, sidebars, modals, tooltips, dropdowns, pagination)
   - Icons that imply direction (arrows, chevrons, back/forward) flip correctly
   - Form inputs: text aligns start; placeholders align start; cursor behavior
   - Numbers inside RTL text: Arabic-Indic digits for `ar` (`Intl.NumberFormat('ar-EG').format()`)
   - Mixed content (LTR brand names inside RTL) — `unicode-bidi: isolate` or `<bdi>`
7. **Font loading**: Arabic fonts larger; `font-display: swap`; subset for performance; `font-family` fallback chain includes Noto Sans Arabic / system fonts.
8. **Testing**: E2E runs in both `en` and `ar` (viewport, layout, forms); snapshot diffs catch regressions.

## Implementation Checklist

- [ ] Logical CSS properties used everywhere (no `left`/`right`/`margin-left` in layout)
- [ ] `dir` + `lang` set on `<html>` per locale; `lang` on per-element if mixed
- [ ] All user strings via `t('key')`; zero hardcoded strings in components
- [ ] ICU MessageFormat for all dynamic text (plurals, select, date/time/currency)
- [ ] RTL E2E suite runs in CI (layout snapshots + form interactions)
- [ ] Font subset loaded; `font-display: swap`; fallback chain correct

## Handoff

→ `design/design-system.md` (tokens include RTL variants), `testing/e2e.md` (RTL viewport), `development/frontend.md` (rendering strategy).
