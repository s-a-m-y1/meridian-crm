---
name: referral-program
description: Design referral, affiliate and ambassador programs that actually work
domain: marketing
phase: marketing
priority: medium
inputs: [pricing, growth-metrics]
outputs: [referral-program-spec]
dependencies: [business/pricing, business/growth]
next_skills: [marketing/analytics]
---

# Referral & Affiliate Programs

## The One Rule

Referrals work when **value is delivered first**. A program bolted onto an un-retained product buys churn. Preconditions (else BLOCKED): retention curve flat/nonzero (`business/growth.md`), NPS or organic word-of-mouth already observable (people recommend unprompted).

## Choose the Shape

| Shape              | Mechanics                                         | Works when                              |
| ------------------ | ------------------------------------------------- | --------------------------------------- |
| Two-sided reward   | referrer + referee both get value (credit/months) | broad products, low marginal cost       |
| Affiliate          | % commission on referred revenue                  | B2B, higher ACV, professional referrers |
| Ambassador         | exclusive access + identity + perks               | community-driven products               |
| Milestone referral | reward at referee's activation (not signup)       | anti-fraud + real-value confirmation    |

Reward by value type: product credit > cash (margin-preserving, product-sticky) — cash rewards attract professional bounty hunters, not advocates.

## Workflow

1. **Aim at the advocacy moment**: ask at the measurable high point (activation, NPS 9-10 response, renewal) — timing beats incentive size
2. **Make the ask shareable**: pre-written message the referrer would actually send (in THEIR voice — `marketing/copywriting.md` customer-words rule); one-click send; link attribution automatic
3. **Incentive symmetry**: both sides gain; referee's offer visible ("your friend gets X, you get X") — hidden asymmetry reads as scam
4. **Anti-fraud by design**:
   - Reward at activation/first-payment (not signup) — kills fake accounts
   - Velocity caps per referrer; review high-volume referrers manually (week 1)
   - Duplicate payment methods/emails flagged
5. **Terms**: eligibility, payout thresholds, prohibited channels (spam), termination — LEGAL-REVIEW-REQUIRED per `compliance/legal.md`
6. **Measure honestly** (`marketing/analytics.md`): referred-user LTV vs organic (referred users are typically higher-intent — if not, the incentive attracts the wrong people); attribution: referral codes + links, no fuzzy multi-touch
7. **Experiment cadence**: incentive size × ask-timing × placement — one variable per test (`business/growth.md`)

## Rules

- Never incentivize below unit economics: reward cost per activated user < CAC via other channels (else just buy ads)
- No gamified leaderboards for non-ambassador programs (incentivizes volume over fit — wrong users)
- Kill criteria pre-declared (fraud rate > X%, referred LTV < organic × 0.7)

## Validation Checklist

- [ ] Preconditions met (retention + organic word-of-mouth)
- [ ] Reward at activation (not signup); both sides benefit
- [ ] Anti-fraud mechanics in place; velocity caps set
- [ ] Terms legal-reviewed; payout math under CAC

## Handoff

→ tracking in `marketing/analytics.md`; experiment loop in `business/growth.md`.
