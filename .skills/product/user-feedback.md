---
name: user-feedback
description: Systematically collect, cluster and route user feedback into product action
domain: product
phase: product
priority: high
inputs: [support-tickets, nps-responses, usage-data]
outputs: [feedback-loop]
dependencies: [maintenance/customer-support, marketing/analytics]
next_skills: [product/feature-specification, product/roadmap]
---

# User Feedback System

## Sources (each wired, not wished)

| Source                                                   | Cadence         | Signal type                                                      |
| -------------------------------------------------------- | --------------- | ---------------------------------------------------------------- |
| Support tickets (`maintenance/customer-support.md` tags) | continuous      | pain + bugs (tag taxonomy is the structure)                      |
| NPS/CSAT free-text                                       | on-survey       | sentiment + reasons                                              |
| In-app feedback widget (contextual: after key flows)     | event-triggered | task-level friction                                              |
| Churn/exit surveys (cancellation flow)                   | on-churn        | the most honest data you'll get                                  |
| Sales/team conversations                                 | weekly digest   | objection patterns (B2B: lost-deal reasons)                      |
| Usage behavior (what they DO vs SAY)                     | continuous      | behavior > opinions — `marketing/analytics.md` funnel + heatmaps |

## Workflow

1. **Capture into ONE inbox**: all sources tagged uniformly: source + feature-area + persona/segment + type (bug/friction/missing/request) + severity (frequency × intensity — "3 tickets/week on checkout" beats "someone mentioned")
2. **Weekly clustering** (the core ritual):
   - Cluster by feature-area + type; count frequency (frequency is evidence per `business/market-research.md` rules)
   - Top clusters become **insight cards**: `Insight: <n> users in <segment> struggle with <job> — evidence: <tickets/surveys/behavior>`
   - Each card routed: bug → `development/bug-fix.md` workflow; friction (UX) → `design/ux.md` fix task; missing-feature → feature-spec queue with demand evidence attached; "out of 1 complainer" → politely parked (not everything is a signal)
3. **Quantify before queueing**: feature requests demand evidence bar (frequency + segment fit + willingness-to-pay signal — per `business/validation.md` class) — anecdote ≠ backlog
4. **Close the loop with users** (the retention multiplier): "you asked, we shipped" — notify the requesters specifically (`marketing/email.md` targeted sends), public changelog (`documentation/changelog.md`)
5. **Monthly feedback review**: cluster trend lines (rising cluster = emerging problem), inform `product/roadmap.md`; churn-reason top-3 get named owners (per `maintenance/customer-support.md` weekly-signals discipline)
6. **Trend alerts**: cluster frequency > threshold → alert (per `observability/monitoring.md` — e.g. checkout-friction tickets +50% WoW = fire, not noise)

## Rules

- Feedback ≠ roadmap (users describe pains, not solutions — translate via personas + jobs-to-be-done, don't implement literal asks)
- The feedback LOOP is the product (collecting without routing + closing = theater)
- Behavior evidence outranks verbal requests where they conflict (what they do > what they say they want)

## Validation Checklist

- [ ] All 6 sources wired into one tagged inbox
- [ ] Weekly clustering ritual scheduled; insight cards routed with owners
- [ ] Feature requests pass the evidence bar before entering backlog
- [ ] Loop closed with requesters (shipped notifications)

## Handoff

→ bugs → `workflows/bug-fix.md`; friction → design tasks; requests → `product/feature-specification.md` queue; insights → `product/roadmap.md`.
