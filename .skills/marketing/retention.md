---
name: retention-marketing
description: Lifecycle programs that keep users — win-back, upsell, renewal (marketing side)
domain: marketing
phase: marketing
priority: medium
inputs: [growth-metrics, email-program]
outputs: [retention-program]
dependencies: [marketing/email, business/growth]
next_skills: [business/growth]
---

# Retention Marketing

## Boundary

Product-driven retention (activation, habit loops, value) lives in `business/growth.md` + product skills. THIS skill = the communication layer: the right message at the right lifecycle moment to users who already received value.

## Lifecycle Moments → Programs

| Moment              | Signal                                                         | Program                                                                |
| ------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Post-activation     | first value hit                                                | reinforce habit: quick-win tips (2-3 emails max)                       |
| Habitual use        | N sessions in M days                                           | power-user onboarding to next feature (usage-based)                    |
| Feature gap         | viewed feature they can't access                               | contextual upsell (their usage language — never blast)                 |
| At-risk             | usage drop vs personal baseline (per-user, not cohort average) | check-in: "something wrong?" — support tone, not sales                 |
| Cancellation intent | downgrade/cancel click                                         | save-flow: pause option, right plan fit, honest exit                   |
| Post-churn          | N days after                                                   | win-back after ONE cooling cycle: new value since they left (specific) |

## Rules

1. **Per-user baselines**: at-risk detection uses each user's own trajectory (weekly active drops 50% for a daily user ≠ for a weekly user) — cohort averages hide individuals
2. **Sales tone banned in save-flows**: churn is a service failure signal first — "what went wrong?" outperforms "wait! discount!" (discounts train churn-for-deals)
3. **Win-back honesty**: only after real product change; "we miss you" without new value = spam (one send, then sunset the address per `marketing/email.md` hygiene)
4. **Pause > cancel**: downgrade path preserves the account (data, habit, billing relationship) — offer pause before exit
5. **Measure in product terms**: saved ARR, resumed usage — not email open rates (vanity per `marketing/analytics.md`)

## Validation Checklist

- [ ] At-risk signals per-user (not cohort-average)
- [ ] Save-flow offers pause + fit fix before discounts
- [ ] Win-back gated on real product delta; one-send discipline
- [ ] Programs measured in ARR/usage terms

## Handoff

→ programs run via `marketing/email.md` sequences; metrics to `business/growth.md` loops.
