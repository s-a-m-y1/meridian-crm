---
name: partnerships
description: Structure and evaluate business partnerships — resellers, integrations, alliances
domain: business
phase: business
priority: medium
inputs: [bmc, competitive-analysis]
outputs: [partnership-plan]
dependencies: [business/bmc]
next_skills: [business/gtm, integrations/third-party-api]
---

# Partnerships

## When To Use

- Channel partner / reseller (they sell, you build)
- Technology integration partner (their users become your distribution)
- Co-marketing alliance (shared beachhead, split costs)
- Build-vs-partner decision: partner when capability is non-core + partner's core strength (`core/engineering-principles.md` buy-vs-build)

## When NOT To Use

- "Strategic partnership" with no concrete distribution/margin/co-sell motion (vaporware handshake)
- Core-capability outsourcing (you lose the product)

## Workflow

1. **Define the job**: what specifically does this partner do for us? (leads, closes deals, embeds product, provides credibility). Quantified target — "X qualified leads/month" or "Y co-sold deals/quarter" (pre-declared per `business/validation.md` discipline).
2. **Partner selection scorecard** (1-5 each):
   - Audience overlap with our beachhead (5 = exactly our segment)
   - Their motivation (what THEY get — margin, product completeness, competitive edge)
   - Effort to integrate/sell (5 = low effort)
   - Risk (exclusivity demands, competitive conflict, single-point dependency)
3. **Structure** (the four standard shapes):

   | Shape                   | Economics                                      | Control                               |
   | ----------------------- | ---------------------------------------------- | ------------------------------------- |
   | Reseller                | 15-30% margin                                  | We set floor price; they own customer |
   | Referral                | 10-20% first-year commission                   | We own customer; lightest touch       |
   | Integration/Marketplace | listing/co-sell, revenue share on attributions | each owns own product                 |
   | Alliance (co-marketing) | split costs, shared content                    | no revenue link                       |

4. **Terms to define**: exclusivity (default: none), duration (1 year + renewal, not perpetual), termination (30-60d), data ownership (customer data stays ours — `compliance/legal.md` review), attribution (first-touch per `marketing/analytics.md`).
5. **Legal review**: agreement reviewed by qualified counsel — flag as LEGAL-REVIEW-REQUIRED (agents draft structure; humans sign).
6. **Launch as an experiment**: 90-day pilot with pre-declared pass bars (leads/sales volume); kill criteria honored like any `business/growth.md` experiment.

## Rules

- Partner-fit failures are the #1 partnership killer — scorecard before enthusiasm
- No exclusivity in first agreements (blocks all other channels)
- Attribution disputes solved by writing the rule into the agreement upfront

## Validation Checklist

- [ ] Job quantified; scorecard ≥ 3.5 average
- [ ] Structure + economics + termination defined
- [ ] LEGAL-REVIEW-REQUIRED flagged; no agent-signed agreements
- [ ] Pilot bars + kill criteria pre-declared

## Handoff

→ integration work via `integrations/third-party-api.md`; comms via `business/gtm.md`.
