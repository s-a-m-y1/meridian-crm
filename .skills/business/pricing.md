---
name: pricing
description: Design pricing model, tiers and tests
phase: business
priority: medium
inputs: [bmc, market-research, competitive-analysis]
outputs: [pricing-model]
dependencies: [bmc]
next_skills: [business/growth, product/prd]
---

# Pricing

## Workflow

1. **Choose metric** (what we charge FOR — most important decision):
   - Per seat (team tools) / per usage (APIs, infra) / flat subscription (simple products) / transaction % (marketplaces) / outcome-based (strongest, hardest to meter)
   - Metric must: scale with the customer's value received, be predictable for them, and be cheap for us to meter.
2. **Anchor on value, not cost**: estimate the customer's gain (time saved × their cost, or revenue enabled), price at a fraction (10-30%) of that gain — value-based anchor, not cost+markup.
3. **Tiers** (2-4, simple):
   - Free trial > free tier (trial creates urgency; free tier creates commitment debates)
   - Each tier maps to a segment's size/need (from research segments) — don't fragment
   - The tier most customers should pick = the one we want them to pick (price psychology is deliberate)
4. **Competitive frame**: from `competitive-analysis.md` — never win by being cheapest unless cost-structure genuinely allows it (race-to-bottom = recorded risk).
5. **Guardrails**: annual discount ≤ 20%; grandfather early users on price rises; enterprise = custom + security features + SLA, never just "more seats".
6. **Price testing** (validation-style): Van Westendorp's 4 questions (cheap/bargain/expensive/too expensive) with 5+ target users; or A/B on the landing page; pass bars declared BEFORE the test (per `validation.md` discipline).
7. **Unit economics re-check**: update LTV/CAC with chosen prices (`bmc.md` must still close).

## Output — Pricing Page (spec)

Tiers, prices, features per tier, metering rules, trial policy, upgrade/downgrade rules — written as a spec the product can implement (feature flags per tier, enforced server-side — `security/api-security.md` exposure rules: client-side-only tier checks are trivially bypassed).

## Validation Checklist

- [ ] Metric scales with received value + predictable for customer
- [ ] Value-based anchor shown (the math)
- [ ] Tier enforcement server-side (implementation requirement)
- [ ] bmc.md unit economics re-verified with final prices

## Handoff

→ `growth.md` (conversion), `product/prd.md` (tier gating features).
