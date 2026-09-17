---
name: business-model-innovation
description: Evolve or pivot the business model using strategic option maps
domain: business
phase: business
priority: medium
inputs: [bmc, growth-metrics]
outputs: [model-evolution-plan]
dependencies: [business/bmc]
next_skills: [business/growth]
---

# Business Model Innovation

## Purpose

Improve an EXISTING proven model (not first design — that's `business/bmc.md`). Use when growth stalls, expansion needs a new revenue stream, or a segment shows unmonetized value.

## When To Use

- Growth plateau with healthy retention (product works; model limits it)
- Adding a revenue stream (usage tiers, marketplace, services)
- Expansion: new segment/geography where current model doesn't fit

## When NOT To Use

- Pre-PMF (validate first — `business/validation.md`)
- Revenue underperformance caused by churn (fix retention — `business/growth.md` — not the model)

## Workflow

1. **Diagnose the constraint**: which BMC block is the binding limit? (LTV ceiling? CAC? channel saturation? price metric misaligned with value?)
2. **Option map** (standard levers — pick 2-3 to explore, never all):

   | Lever           | Options                                                                             |
   | --------------- | ----------------------------------------------------------------------------------- |
   | Pricing metric  | seat → usage → outcome → hybrid                                                     |
   | Revenue streams | subscription → + usage overages → + marketplace take → + services → + data products |
   | Segments        | move upmarket (enterprise) / downmarket (PLG) / adjacent segment                    |
   | Packaging       | unbundling (split product) / bundling (suite) / freemium shift                      |
   | Channel         | direct → partner/reseller → platform integrations                                   |

3. **Evaluate each option**: impact on LTV, CAC, churn risk, operational cost, migration friction for existing users (grandfather rules mandatory — `business/pricing.md`)
4. **Decide** per `core/decision-log.md`: chosen lever + expected effect + measurement plan
5. **Instrument before launch**: new model's metrics wired (`marketing/analytics.md`) with pre-declared success bars
6. **Grandfather + communicate**: existing users keep current deal (or explicit opt-in upgrade); clear comms per `marketing/email.md` lifecycle

## Rules

- One model change at a time — simultaneous pricing + metric changes are un-attributable
- Model changes are HUMAN sign-off decisions (revenue-affecting, semi-irreversible — trust damage)
- 90-day review with kill criteria pre-declared

## Validation Checklist

- [ ] Constraint diagnosed from metrics (not opinion)
- [ ] Options evaluated with LTV/CAC/churn impact
- [ ] Existing users grandfathered; comms plan exists
- [ ] Success bars + kill criteria pre-declared

## Handoff

→ execution via `business/pricing.md` / `business/gtm.md`; tracking via `marketing/analytics.md`.
