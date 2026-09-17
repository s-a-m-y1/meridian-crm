---
name: frontend-performance
description: Measure and improve frontend performance against budgets
phase: performance
priority: medium
inputs: [performance-symptoms, build-output]
outputs: [perf-evidence, optimizations]
dependencies: [testing/performance]
next_skills: [review/performance-review]
---

# Frontend Performance

## Rule: Evidence First

Never "optimize" without a measurement showing the problem. Lighthouse/WebPageTest/bundle-analyzer numbers before and after — in the Result.

## Workflow

1. **Measure**: Core Web Vitals (LCP, INP, CLS) + bundle size per route vs budget (`architecture/frontend.md` budgets).
2. **Diagnose by metric**:
   - LCP slow → render strategy, image loading, critical path JS
   - INP slow → main-thread work, handlers, unvirtualized lists
   - CLS > 0.1 → unsized media/fonts, late-injected UI
   - Bundle over budget → analyze → largest offenders first
3. **Apply fixes by leverage order**: (1) ship less code (split routes, tree-shake, drop deps, dynamic imports), (2) load later (lazy below-fold, deferred non-critical), (3) load faster (preload critical, compress images → modern formats, CDN), (4) render faster (SSR/SSG critical pages), (5) micro-optimize LAST (memoization — only after profiling shows the hotspot).

## Built-in Standards (all builds)

- Images: sized + lazy + modern formats; fonts: `font-display: swap` + preload for the primary
- Lists > 50 rows virtualized; route-level splitting; no > 200KB ad-hoc third-party script
- Bundle budget enforced in CI (fail the build on regression, not a warning)

## Validation Checklist

- [ ] Before/after numbers for every change (same conditions, median of ≥3 runs)
- [ ] Budgets green in CI
- [ ] No fix degraded accessibility/functionality (checked)

## Handoff

→ `review/performance-review.md` with the measurement evidence.
