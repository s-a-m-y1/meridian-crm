---
name: product-lifecycle
description: Manage features from introduction through growth, maturity and sunset
domain: product
phase: product
priority: low
inputs: [product-metrics, feedback-loop]
outputs: [lifecycle-decisions]
dependencies: [product/product-metrics, product/user-feedback]
next_skills: [maintenance/deprecation, product/roadmap]
---

# Product Lifecycle Management

## The Stages (per feature — not per product; products are portfolios of feature lifecycles)

| Stage        | Signals                                                               | Management focus                                                                                                                  |
| ------------ | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Introduction | new; adoption < X%; metric unproven                                   | measure aggressively (`product/experimentation.md`); kill criteria live; small exposure via flags                                 |
| Growth       | adoption rising; retention-with-feature > baseline                    | invest (polish, integration depth, remove friction — per `marketing/funnel.md` constraint logic)                                  |
| Maturity     | adoption plateau; stable value; maintenance becomes visible           | optimize cost-of-ownership; harvest (pricing/packaging per `business/pricing.md`); stop feature-investment — defend, don't extend |
| Decline      | adoption falling; complaint mix shifts to "outdated/missing-modern-X" | decision point: revitalize (re-spec — only with evidence per `product/user-feedback.md`) or sunset (below)                        |

## Workflow

1. **Lifecycle inventory** (quarterly): every significant feature tagged with stage + evidence (adoption trend, retention delta, support-load, maintenance cost) — the honest picture: aging features nobody uses but everyone pays to maintain
2. **Stage decisions** (the actual output):
   - Introduction→: hit the kill bar? KILL (folded per `business/validation.md` discipline — cheap kills are lifecycle wins) ; pass → Growth investment
   - Maturity: explicit "defend" decision (no more investment — declining marginal returns; `documentation/maintenance.md` debt rules apply)
   - Decline: revitalize-with-evidence or sunset — sunk cost is NOT evidence (a feature with falling adoption + no demand signals gets sunset, not renewed hope)
3. **Sunset protocol** (feeds `maintenance/deprecation.md` for execution):
   - User impact audit: who's still using it (count, segment, revenue share — `product/product-analytics.md` cohorts)
   - Notice period generous + in-product + per-user for actives (not changelog-buried); migration path or export (per `compliance/legal.md` data-portability duties)
   - Kill criteria for the sunset itself (if actives > threshold, it's not sunsetting — it's a revitalize case mislabeled)
4. **Portfolio balance**: lifecycle view at the PRODUCT level — all-mature portfolio = dying product (no growth engines); all-introduction = thrash (nothing proven) — the mix is a strategy signal (feeds `product/strategy.md` quarterly review)

## Rules

- Stage changes are metric-triggered, not anniversary-driven (the quarterly review LOOKS; metrics DECIDE)
- Sunset = user-respectful + legal-compliant (data export, notice) — never a silent removal (per `maintenance/deprecation.md` contract with users)
- The kill discipline compounds: features that die cheaply early leave room for the ones that deserve growth investment

## Validation Checklist

- [ ] Quarterly inventory with stage evidence per feature
- [ ] Stage decisions recorded (incl. kill/defend/sunset with their evidence)
- [ ] Sunsets follow the protocol (audit + notice + export + criteria)

## Handoff

→ sunset execution → `maintenance/deprecation.md`; portfolio view → `product/strategy.md` quarterly.
