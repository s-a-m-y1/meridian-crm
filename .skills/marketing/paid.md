---
name: paid-acquisition
description: Paid ads management — structure, budgets, creative testing, kill criteria
phase: marketing
priority: medium
inputs: [gtm-plan, pricing, finance]
outputs: [campaign-plan, creative-backlog]
dependencies: [business/pricing, business/finance]
next_skills: [business/growth]
---

# Paid Acquisition

## Preconditions (else BLOCKED — don't burn money)

1. LTV/CAC math closes at OBSERVED values (`business/bmc.md` — estimates don't justify spend)
2. Conversion path measured end-to-end (visitor→signup→paid) — ads pointing at an unmeasured funnel are donations to the platform
3. Kill criteria pre-declared BEFORE spending (per `business/finance.md` trigger discipline): max CPA × test budget × minimum decision data (e.g. "kill if CPA > $X after $Y spend or Z clicks")

## Campaign Structure

- Account segmented by intent: branded / competitor / problem-aware / lookalike — never mixed in one campaign (different intents = different economics)
- Naming convention (machine-parseable for reports): `[channel]-[objective]-[audience]-[date]`
- Budgets: 70% proven, 30% experiments (structure enforced monthly)

## Creative Testing Protocol

1. **Hypothesis backlog**: message-first (positioning angles from `business/gtm.md` messaging ladder) — creative tests message, not colors
2. **Test design**: one variable per test, 3-5 variants, pre-declared winner bar (e.g. "CTR+20% over control at 95% significance or 1k impressions/variant" — small samples = directional only, declared as such per `business/growth.md` honesty)
3. **Cadence**: weekly review — kill losers (budget to proven), promote winners, add new tests from backlog; every test logged (`.ai/context/growth-log.md`) including FAILURES (re-testing a known-dead message = wasted spend)
4. Creative rules: hook in first 3 words/seconds; one CTA; honest claims (fake urgency damages retention — `business/growth.md` no-dark-patterns)

## Channel-Specific Notes

| Channel     | Strength                | Kill fast if                                               |
| ----------- | ----------------------- | ---------------------------------------------------------- |
| Search ads  | intent capture          | branded terms cannibalize organic (measure incrementality) |
| Social ads  | problem-aware targeting | CPA > 1.5× target after test budget                        |
| Retargeting | cheap conversion        | frequency > 8/week (annoyance = brand damage)              |

## Tracking & Attribution

- UTM discipline: every link (source/medium/campaign/content) — no bare URLs; dashboards by campaign
- Attribution honest: last-click for search, but revenue reality-checked quarterly against cohort behavior (`business/growth.md`)

## Validation Checklist

- [ ] Preconditions all met (observed LTV/CAC, measured funnel, kill criteria written)
- [ ] Campaign structure + naming + budgets set per ratio
- [ ] Test backlog with pre-declared bars; failures logged

## Handoff

→ results feed `business/growth.md` experiment log; spend caps from `business/finance.md`.
