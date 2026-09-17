---
name: marketing-funnel
description: Model, measure and manage the full marketing funnel with stage economics
domain: marketing
phase: marketing
priority: high
inputs: [gtm, analytics-setup]
outputs: [funnel-model]
dependencies: [marketing/analytics, business/finance]
next_skills: [business/growth, marketing/paid]
---

# Marketing Funnel

## The Funnel (AARRR standardized — same model everywhere)

```
Visitor → Signup → Activated → Retained → Paid → Referring
```

Stage definitions are NON-NEGOTIABLE (defined once, in code — `marketing/analytics.md` event taxonomy): "Activated" = the first-value action from `business/gtm.md` — never "logged in 3 times".

## Workflow

1. **Model current funnel** (monthly + weekly cohorts):

   | Stage | # Users | Conv. to next | Industry ref | $ per user at stage |
   | ----- | ------- | ------------- | ------------ | ------------------- |

   Every stage transition instrumented (`marketing/analytics.md`); splits by channel + persona where sample allows.

2. **Stage economics** (which stage is worth fixing):
   - Value of +1pp at each stage = (users at stage) × (+1pp) × (LTV of activated user)
   - The stage with highest $-per-pp is the constraint — work it, not the loudest debate
3. **Constraint playbook** (match fix to weakest stage):

   | Weak stage         | First moves                                                                     |
   | ------------------ | ------------------------------------------------------------------------------- |
   | Visitor→Signup     | message-market fit (`marketing/cro.md`), page speed                             |
   | Signup→Activated   | onboarding email sequence (`marketing/email.md`), activation friction audit     |
   | Activated→Retained | product value — NOT marketing (route to `product/roadmap.md`)                   |
   | Retained→Paid      | paywall placement, pricing page proof, upgrade triggers (`business/pricing.md`) |
   | Paid→Referring     | `marketing/referral.md` at advocacy moment                                      |

4. **Forecast with the model**: any growth plan expressed as stage-conversion deltas — "2× traffic" with 0.5% conversion = nothing; makes projections checkable (`business/finance.md` drivers)
5. **Review cadence**: weekly funnel review (growth meeting per `business/growth.md`); quarterly full-model re-baseline

## Rules

- One funnel definition org-wide (competing definitions = decisions by noise — `marketing/analytics.md` single-source rule)
- Funnel ≠ TOFU/MOFU/BOFU content labels — those are content-team planning terms (`marketing/content.md`); the money funnel is AARRR
- No stage works on "visitors" without persona (traffic quality > quantity)

## Validation Checklist

- [ ] All 6 stages instrumented; definitions in code not docs
- [ ] Stage economics computed; constraint stage identified with $ math
- [ ] Weekly review scheduled; quarterly re-baseline

## Handoff

→ constraint fixes route to the playbook skills; forecast to `business/finance.md`.
