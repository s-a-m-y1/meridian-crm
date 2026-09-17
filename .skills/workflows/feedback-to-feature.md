---
name: workflow-feedback-to-feature
description: Convert customer feedback into shipped features — the complete loop
domain: workflows
phase: product
priority: high
inputs: [feedback-signal]
outputs: [shipped-feature, closed-loop]
dependencies: [product/user-feedback, product/feature-specification]
next_skills: [workflows/new-feature]
---

# Workflow: Customer Feedback → Feature

```
1.  Capture          → product/user-feedback.md inbox (tagged: source/area/persona/type/severity)
2.  Cluster          → weekly ritual: top-clusters → insight-cards (evidence: frequency × segment-fit)
3.  Qualify          → evidence-bar per user-feedback.md §3: frequency + persona-fit + WTP-signal
                       (anecdote ≠ backlog — the honest filter)
4.  Strategy-check   → product/strategy.md pillars: does it serve a pillar/bet? (no → park w/ trigger)
5.  Validate         → business/validation.md lean-tests for the leap-assumptions
                       (landing-test/concierge/interviews — depends what's unknown)
6.  Specify          → product/feature-specification.md (full spec: ACs, states, measurement)
7.  Build            → workflows/new-feature.md (the standard chain from spec → prod)
8.  Measure          → the spec's success-metric + date (product/product-metrics.md tree) —
                       post-ship check: did it ACTUALLY move the metric? (features that don't = learning)
9.  Close the loop   → notify requesters (marketing/email.md targeted "you asked, we shipped") +
                       changelog + support-KB update (maintenance/customer-support.md)
                       — the loop-closure is the retention-multiplier per user-feedback.md §4
```

Rules: the loop is closed or the feedback-system is theater (per `product/user-feedback.md` loop-rule, operationalized); behavior-evidence outranks verbal-requests where they conflict (restated); killed ideas get recorded-with-reason (per `business/validation.md` KILL-is-a-win — the "why we didn't build it" memory prevents re-litigating).
