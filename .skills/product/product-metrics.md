---
name: product-metrics
description: Define the product metric tree — North Star, input metrics, guardrails
domain: product
phase: product
priority: high
inputs: [product-strategy, analytics-setup]
outputs: [metric-tree]
dependencies: [product/strategy, marketing/analytics]
next_skills: [business/growth, observability/metrics]
---

# Product Metrics (The Metric Tree)

## The Tree Structure

```
North Star (one — best proxy of delivered value)
   ├── Input metrics (2-4 — the levers that MOVE the North Star)
   │      └── team-controllable, weekly-reviewable
   └── Guardrails (the metrics that must NOT break while moving inputs)
          └── counter-metrics, quality/health caps
```

## Workflow

1. **North Star selection** (one, from the strategic pillars — `product/strategy.md` "how to win"):
   - Format: `<value-received> per <time unit>` — "weekly active projects created", "hours of meetings transcribed/week"
   - Tests: measures VALUE delivered (not usage theater — logins ≠ value), moves when product improves, hard to game (per `business/growth.md` vanity ban)
   - It's chosen, defended, and changed only at quarterly strategy review (metric-of-the-month = thrash)
2. **Input metrics** (the 2-4 levers): decomposition of the North Star — if North Star = activated users × actions/activated, the inputs are activation rate and action-rate; each input assigned an owning team/function + a weekly review
3. **Guardrails** (the safety nets — per `business/growth.md` no-growth-at-quality-cost):
   - Quality: error rate, p95 latency, support ticket rate
   - Trust: churn rate, refund rate, NPS drop
   - Cost: infra cost/user (growth that costs > margin/user = unbounded loss)
   - Any experiment that moves inputs while breaking a guardrail = FAILED experiment (pre-declared in the experiment design)
4. **Instrumentation**: every metric defined in CODE (event taxonomy per `marketing/analytics.md` — definition lives with the event, not in a doc that drifts); dashboards per `observability/monitoring.md` (golden signals + this tree)
5. **Review cadence**: weekly (inputs + guardrails — growth meeting), quarterly (North Star itself + tree validity: does the North Star still track value?)

## Rules

- One North Star org-wide (competing stars = split attention — per `business/growth.md` discipline)
- Every metric has an owner + a decision it informs ("interesting" dashboards are museum pieces)
- Segmented views: metric tree by persona/channel where sample allows (aggregate averages hide the story)

## Validation Checklist

- [ ] North Star passes the 3 tests; defined in code
- [ ] 2-4 inputs, each owned + weekly-reviewed
- [ ] Guardrails wired into experiment verdicts (auto-fail on breach)
- [ ] Quarterly tree-validity review scheduled

## Handoff

→ instrumentation via `marketing/analytics.md`; dashboards → `observability/monitoring.md`; experiments → `business/growth.md`.
