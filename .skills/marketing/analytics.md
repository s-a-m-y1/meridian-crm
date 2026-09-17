---
name: marketing-analytics
description: Attribution, dashboards and honest measurement of marketing
phase: marketing
priority: high
inputs: [gtm-funnel, growth-metrics]
outputs: [marketing-analytics-setup]
dependencies: [business/growth, observability/metrics]
next_skills: [business/growth]
---

# Marketing Analytics

## Rules

1. **Instrument before spending** — a channel you can't attribute is a channel you're guessing about (per `business/growth.md` — no guessing)
2. One source of truth per metric: define where each number lives (analytics tool, billing, CRM) — competing dashboards with different numbers = decisions by noise
3. Vanity metrics banned from decision reviews (pageviews, follower counts, raw signups): decisions tie to activation → retention → revenue (the AARRR chain from `business/growth.md`)

## Core Setup

1. **Event taxonomy** (one naming scheme, documented):
   - `view_landing`, `signup_start`, `signup_complete`, `activation` (= the defined first-value action from `business/gtm.md` — exact definition in code), `upgrade_start`, `payment_complete`, `churn`
   - Properties: `utm_source/medium/campaign/content` (from `marketing/paid.md` discipline), plan, tier — stored on USER not session (attribution survives logins)
2. **Attribution model**: declared explicitly (default: first-touch for channel learning + last-click for conversion ops) — model choice written down; NEVER silently compare numbers across models; reality-check quarterly against cohort LTV (attribution flatters itself)
3. **Funnel dashboard** (per `observability/metrics.md` standards): the AARRR chain with conversion % between stages, split by channel + campaign; weekly review in growth cadence
4. **Cohort retention** as the arbiter: channel judged on the retention curve of ITS users, not the volume it delivered — cheap-to-acquire churners are expensive
5. **Alerting on the funnel**: activation rate or signup conversion drops > 20% week-over-week → alert (a broken signup form with ads running = money on fire) — wired per `observability/monitoring.md` alert rules

## Reporting Cadence

- Weekly: funnel by channel, experiment results (growth log entries)
- Monthly: channel CPA/CAC vs LTV observed, cohort curves per channel, budget shifts per `marketing/paid.md` 70/30
- Quarterly: attribution vs cohort reality-check; kill/keep channel decisions (pre-declared criteria from `marketing/paid.md`)

## Privacy

Analytics complies with consent (per `marketing/email.md` compliance rules): no PII in event properties, IP handling per policy, documented data retention — privacy violations are business risk (per `security/threat-modeling.md` I-category discipline).

## Validation Checklist

- [ ] Event taxonomy documented; activation defined in code (not prose)
- [ ] Channel attribution + cohort retention both in the weekly dashboard
- [ ] Funnel alerts wired; vanity metrics excluded from decision reviews

## Handoff

→ all data feeds `business/growth.md` loops; alerting via `observability/monitoring.md`.
