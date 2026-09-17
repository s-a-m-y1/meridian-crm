---
name: business-model
description: Design the business model canvas and unit economics
phase: business
priority: high
inputs: [market-research, competitive-analysis]
outputs: [business-model-canvas, unit-economics]
dependencies: [market-research, competitive-analysis]
next_skills: [product/prd, business/growth]
---

# Business Model Canvas (BMC) + Unit Economics

## Part 1 — BMC (one page, 9 blocks, each 1-3 bullets max)

```markdown
1. Customer Segments (from market-research — priority segment first)
2. Value Proposition (the wedge: for <segment>, we <do X> unlike <competitor> because <defensibility>)
3. Channels (reach: from segment's "where they gather")
4. Customer Relationships (self-serve / personal / community — match segment)
5. Revenue Streams (from pricing skill — main + secondary)
6. Key Resources (the few things that MUST exist to deliver)
7. Key Activities (what we must be world-class at)
8. Key Partnerships (what we deliberately DON'T build — outsource/rent)
9. Cost Structure (fixed vs variable — what scales with usage)
```

Rule: every block traceable to research/competitive files — no new inventions here (inventions = new assumptions → `.ai/context/assumptions.md`).

## Part 2 — Unit Economics (the viability test)

| Metric                | Formula                                        | Healthy target                 |
| --------------------- | ---------------------------------------------- | ------------------------------ |
| CAC                   | sales+marketing spend ÷ new customers          | depends (see payback)          |
| LTV                   | avg revenue/user × gross margin × avg lifetime | LTV > 3× CAC                   |
| Payback period        | CAC ÷ monthly gross margin/user                | < 12 months (SaaS)             |
| Gross margin          | (revenue − COGS) ÷ revenue                     | > 70% software; > 30% services |
| Contribution per unit | price − variable cost                          | positive, obviously            |

- Numbers sourced from research pricing data or marked `ESTIMATE (method)`.
- **If LTV/CAC math doesn't close, the model is broken** — say it, don't hide it: verdict FAIL → back to pricing/segment, recorded as a business risk.

## Part 3 — 12-Month P&L Sketch (revenue + costs at 3 adoption scenarios)

Pessimistic / expected / optimistic — with the driver made explicit (e.g. conversion rate × traffic, or N accounts × price). Shows cash needs + breakeven point.

## Validation Checklist

- [ ] All 9 blocks filled with research traceability
- [ ] LTV/CAC/payback computed with shown math
- [ ] 3-scenario P&L with explicit drivers
- [ ] Verdict: VIABLE / BROKEN (where) — broken is a valid, useful answer

## Handoff

→ `pricing.md` (design pricing detail), `product/prd.md` (features serve the wedge), `growth.md` (acquisition engine).
