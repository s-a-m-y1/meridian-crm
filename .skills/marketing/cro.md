---
name: conversion-optimization
description: Landing page and funnel conversion optimization — research-first CRO
domain: marketing
phase: marketing
priority: medium
inputs: [gtm, analytics-setup]
outputs: [cro-backlog]
dependencies: [marketing/analytics, marketing/copywriting]
next_skills: [business/growth]
---

# Conversion Rate Optimization (CRO)

## Rules (anti-pattern first)

- **No opinion wars**: CRO by opinion = HiPPO (highest-paid person's opinion). Research first, then test.
- **Traffic threshold honesty**: < 1,000 monthly uniques or < 100 conversions/month → statistical A/B is impossible (`business/growth.md` small-sample honesty). Do qualitative fixes + usability review instead — declare it.
- **CRO ≠ tricks**: dark patterns (fake countdowns, forced continuity) convert once, churn + brand-kill after — banned per `marketing/copywriting.md` honesty rules.

## Workflow (research → hypothesis → test → learn)

1. **Diagnose with data** (`marketing/analytics.md` funnel):
   - Where's the biggest drop? (stage conversion % vs industry baseline)
   - Segment it: device (mobile?), source (which channel converts worst?), geography
   - Heatmaps/session recordings for the worst-dropping page (where do users rage-click? die?)
2. **Qualitative**: 5 session replays + 3 exit surveys ("what stopped you?") — the top 3 reasons become the backlog
3. **Hypothesis format** (per `business/growth.md` experiment discipline):
   `Because [evidence], we believe [change] for [segment] will [effect]. We'll know if [metric] [moves X%] by [bar].`
4. **Fix by leverage order**:
   1. Message-market fit (headline says the right thing — `marketing/copywriting.md`)
   2. Trust/proof (testimonials, logos, security signals near CTAs)
   3. Friction (fewer form fields, faster page — `development/performance-frontend.md`)
   4. Layout/visual hierarchy LAST (rearranging deck chairs)
5. **Test**: one variable, pre-declared bar, adequate sample (calculate required n beforehand); declared directional-only if underpowered
6. **Log everything** (`.ai/context/growth-log.md`) — losing tests prevent re-testing dead hypotheses

## Validation Checklist

- [ ] Diagnosis evidence-backed (funnel + session data, not opinion)
- [ ] Hypotheses in format with pre-declared bars
- [ ] Sample size calculated; underpowered tests declared qualitative
- [ ] Zero dark patterns

## Handoff

→ winners standardized into templates (`marketing/copywriting.md`); logs to `business/growth.md`.
