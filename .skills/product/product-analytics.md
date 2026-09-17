---
name: product-analytics
description: Answer product questions with data — cohort, funnel, retention analyses
domain: product
phase: product
priority: medium
inputs: [analytics-setup, product-metrics]
outputs: [analysis-reports]
dependencies: [marketing/analytics, product/product-metrics]
next_skills: [product/user-feedback, business/growth]
---

# Product Analytics

## Position

`marketing/analytics.md` = the infrastructure + acquisition lens (taxonomy, attribution). THIS skill = the analysis discipline: answering PRODUCT questions (retention, activation, feature-value) with that data. Same event taxonomy, same dashboards, different questions.

## Core Analyses (know which answers which question)

| Question                            | Analysis                                                                              | Honest method                                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Is the product sticking?            | Cohort retention curves (weekly/monthly by signup cohort)                             | curve flattening at non-zero = PMF signal; decaying-to-zero = value problem (per `business/growth.md` — route there) |
| What kills activation?              | Activation funnel step-drop analysis (per persona/segment split)                      | segment × step matrix; biggest drop = constraint (per `marketing/funnel.md` stage math)                              |
| Does feature X deliver value?       | Feature adoption cohorts: retained-with-feature vs retained-without (matched cohorts) | adoption ≠ value: usage can be habit-theater; outcome metrics beat click counts                                      |
| Which users upgrade?                | Upgrade-path analysis: pre-upgrade behaviors (frequency, breadth, depth)              | leads to in-product upgrade triggers (per `marketing/retention.md`) — correlation stated as correlation              |
| Who's about to churn?               | Churned-user lookback: last-30-days behavior vs retained users                        | → at-risk scoring → `marketing/retention.md` save-flows                                                              |
| What do power users do differently? | Power-vs-typical behavioral diff (breadth/depth/intensity)                            | → onboarding teaches the power-patterns (aha-moment engineering)                                                     |

## Workflow

1. **Question first** (decision-shaped: "should we invest in onboarding emails or feature Y?" — not "pull some data"): every analysis names the decision it informs + the action each possible result implies (analysis without a decision attached = museum analytics)
2. **Hypothesis + expected-pattern pre-declared** (per `business/validation.md` discipline — prevents HARKing: hypothesizing after results known)
3. **Query honestly**:
   - Segment where it matters (aggregate = average of different users = often nobody — `marketing/personas.md` segments)
   - Sample sizes shown; small cohorts labeled directional
   - Time-window sensitivity checked (Mon-vs-weekend, seasonality; "last 7 days" vs "last 30 days" tell different stories)
4. **Report format**: question → method → result (chart + numbers) → interpretation (labeled: what data says vs what we THINK it means) → recommendation to the decision
5. **Route**: answers feed `product/user-feedback.md` (combined with qualitative), `business/growth.md` loops, roadmap trade-offs (`product/prioritization.md` evidence)

## Rules

- Correlation ≠ causation (stated every time; causal claims need experiments — `product/experimentation.md`)
- Metric definitions from code (`marketing/analytics.md` single-source rule) — never re-derived ad hoc
- One analysis, one question (multi-question analyses blur everything)

## Validation Checklist

- [ ] Analysis tied to a named decision; hypothesis pre-declared
- [ ] Segmented; sample sizes + window sensitivity shown
- [ ] Interpretation separated from data; causal claims only via experiments
- [ ] Result routed to the decision owner

## Handoff

→ answers → `product/user-feedback.md` + `business/growth.md` + `product/roadmap.md` decisions.
