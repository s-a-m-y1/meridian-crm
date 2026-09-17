---
name: financial-model
description: Budget, runway, revenue forecast and cost management
phase: business
priority: medium
inputs: [bmc, pricing, roadmap]
outputs: [financial-model]
dependencies: [bmc, pricing]
next_skills: [product/roadmap, devops]
---

# Financial Model

## Workflow

1. **Cost model** (12-24 months):
   - Fixed: team, tools, base infra
   - Variable: per-user costs (compute, third-party APIs, licenses) — from `bmc.md` cost structure
   - Map costs to roadmap milestones (`product/roadmap.md`) — money follows plan, not vibes
2. **Revenue forecast** (3 scenarios × 8 quarters):
   - Drivers explicit: users × conversion × ARPU (from `pricing.md`), with churn
   - Pessimistic case must be SURVIVABLE (if not, the plan is fragile — record as risk)
   - No hockey sticks without a stated mechanism (per `market-research.md` no-invented-numbers rule)
3. **Runway & breakeven**:
   - Runway = cash ÷ net monthly burn (show monthly burn curve)
   - Breakeven quarter per scenario; sensitivity: the ONE driver that most changes breakeven (test ±20%)
4. **Budget allocation**: build (dev costs) vs GTM vs ops — with the ratio justified by stage (pre-validation: mostly validation+build; post-PMF: growth-weighted)
5. **Instrument financial metrics**: MRR/ARR, churn, burn, runway — added to business metrics (`observability/metrics.md` + `growth.md` North-star block); monthly review cadence with recorded results.
6. **Trigger-based decisions** (decided NOW, not mid-crisis): runway < 6 months → cost cuts list (pre-ranked, in this file); CAC pays back > 18 months → channel kill criteria; revenue misses pessimistic 2 quarters → strategy review (not "push harder").

## Output — Financial Model

```markdown
# Financial Model — <date>

Cost structure (fixed/variable) | Forecast 3×8Q (drivers shown) | Runway + breakeven
Sensitivity (key driver ±20%) | Budget allocation | Financial metrics + cadence
Trigger decisions (pre-declared)
```

## Validation Checklist

- [ ] Pessimistic scenario survivable (or risk recorded)
- [ ] Every forecast number derived from a named driver
- [ ] Runway/burn monthly curve present; breakeven sensitivity done
- [ ] Trigger decisions pre-declared (not reactive)

## Handoff

→ roadmap sequencing (affordability filter), metrics → `observability/`; monthly review → `core/memory-management.md` cadence.
