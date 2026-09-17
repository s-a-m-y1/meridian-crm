---
name: product-strategy
description: Connect business strategy to product bets — the why behind the roadmap
domain: product
phase: product
priority: high
inputs: [bmc, competitive-analysis, growth-metrics]
outputs: [product-strategy]
dependencies: [business/bmc, business/competitive-analysis]
next_skills: [product/roadmap, product/prioritization]
---

# Product Strategy

## What This Is (and isn't)

NOT the roadmap (that's `product/roadmap.md` — sequencing) and not the PRD (that's `product/prd.md` — what to build). Strategy = the CHOICES: where to play, how to win, what we deliberately won't do. Every roadmap item should be derivable from this document.

## Workflow

1. **Inputs harvest** (evidence, not hope): wedge from `business/competitive-analysis.md`, LTV/CAC reality from `business/bmc.md`, retention curve from `business/growth.md`, constraint from `business/finance.md` runway
2. **Where to play**: the beachhead segment (`business/gtm.md`) + expansion map (beachhead → adjacent segments — the sequence, not a wish list)
3. **How to win**: the defensible advantage made operational — 2-3 strategic pillars the product invests in disproportionately (e.g. "fastest time-to-first-value", "deepest <niche> workflow", "best-in-class reliability at <price>")
   - Each pillar: what it means for FEATURE decisions (what gets built), metric (how we know we're winning), and anti-pillar (what we sacrifice — "not the most features" is a choice)
4. **What we won't do** (the discipline section — most valuable when re-read in 6 months): explicit no's with reasons (per `discovery/scope-management.md` OUT-list logic): "no enterprise features until 10 design-partner deals", "no native mobile until weekly-retention > 40%"
5. **Bets** (2-3 max): each bet = hypothesis + investment + kill/scale criteria (per `business/validation.md` pre-declared bars):
   `Bet: embedding editor wins the <niche> segment. Invest: 1 quarter. Know by: <metric bar at date>. Kill/scale accordingly.`
6. **Cadence**: strategy reviewed quarterly against metrics (strategy that never changes is dogma; that changes monthly is thrash — quarterly is the discipline) — inputs re-harvested, bets closed/continued/added

## Rules

- One page. A strategy nobody finishes reading governs nothing (per `core/communication.md` precision)
- Strategy conflicts resolved at THIS level, not in roadmap debates (when two features compete, the pillars decide — that's their job)
- Bets sized so ONE failing bet doesn't kill the company (portfolio sense per `business/finance.md`)

## Validation Checklist

- [ ] Derivable: every roadmap item traces to a pillar/bet
- [ ] Anti-pillars + won't-do's explicit (with revisit triggers)
- [ ] Bets have pre-declared kill/scale bars
- [ ] Quarterly review cadence scheduled with metric inputs

## Handoff

→ `product/roadmap.md` (sequence from strategy), `product/prioritization.md` (pillar-weighted scoring).
