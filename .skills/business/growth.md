---
name: growth
description: Post-launch growth engine — retention first, then acquisition loops
phase: business
priority: medium
inputs: [gtm-plan, metrics]
outputs: [growth-engine-plan]
dependencies: [gtm]
next_skills: [observability/metrics, documentation/maintenance]
---

# Growth

## Prime Directive

**Retention before acquisition.** Pouring users into a leaky bucket is paying to disappoint people. Order of operations: (1) retention curve flattens (people stay) → (2) activation rises → (3) THEN scale acquisition.

## Workflow

0. **Execution skills under this engine**: content (`marketing/content.md`), SEO (`marketing/seo.md`), paid (`marketing/paid.md`), email (`marketing/email.md`), social (`marketing/social.md`) — all obey this skill's rules (pre-declared bars, honest metrics, no dark patterns, logs to growth-log); analytics wiring per `marketing/analytics.md`.
1. **Retention curve** (weekly cohorts): does it flatten at a nonzero level?
   - Flattens → real value; scale acquisition
   - Decays to zero → value problem; growth tactics are pointless — fix product value (back to `discovery/` / `validation.md` — and say so honestly)
2. **AARRR funnel diagnosis** (find the WEAKEST stage, work only on it):
   ```
   Acquisition → Activation → Retention → Revenue → Referral
   ```
   For the weakest stage: 2-3 experiment hypotheses, each with a pre-declared pass bar (validation discipline — no post-hoc "wins").
3. **Growth loops** (build at least one — better than linear "campaigns"):
   - Content/SEO loop: content ranks → traffic → more content
   - Viral loop: user invites → new users invite (needs shared-value mechanics — collaborative docs, not "share buttons)
   - Usage loop: product outputs (reports, badges, embeds) carry our brand to new users
4. **Experiment cadence** (one change, measured, recorded):
   - Format: `Hypothesis | Change | Metric | Pass bar | Result | Decision`
   - Log every experiment in `.ai/context/growth-log.md` — failed experiments are ASSETS (documented dead-ends; never re-test what already failed)
   - Statistical honesty: small samples = directional only; declare sample sizes
5. **North-star metric**: ONE metric = best proxy of delivered value (e.g. "weekly active projects", not "signups" — vanity). All experiments tie to it. Instrumented per `observability/metrics.md` (business metrics block).

## Rules

- No dark patterns (fake urgency, forced virality) — retention tanks anyway and UX trust dies (design principles apply to growth too)
- Paid acquisition only after LTV/CAC math closes at observed values (bmc.md) — scaling paid before that = burning money with a dashboard
- Every growth change respects product quality gates (no "skip tests, it's just marketing copy" — copy IS product)

## Output — Growth Engine Plan

Weakest-stage diagnosis | Loop design | North-star + instrumentation spec | Experiment backlog | Cadence

## Validation Checklist

- [ ] Retention curve status known before any acquisition spend
- [ ] North-star defined + instrumented
- [ ] Experiment log running with pre-declared bars
- [ ] LTV/CAC re-verified at observed values before paid scaling

## Handoff

→ metrics instrumentation → `observability/`; quarterly review via `documentation/maintenance.md`.
