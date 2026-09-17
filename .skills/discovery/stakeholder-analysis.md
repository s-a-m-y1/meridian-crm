---
name: stakeholder-analysis
description: Identify stakeholders, their influence, and what they need to sign off
domain: discovery
phase: discovery
priority: medium
inputs: [idea-analysis]
outputs: [stakeholder-map]
dependencies: [discovery/idea-analysis]
next_skills: [discovery/requirements]
---

# Stakeholder Analysis

## When To Use

Any project with >1 decision-maker: B2B products (buyer≠user≠admin), internal tools, marketplaces (multi-sided), regulated domains (compliance stakeholder). Solo-founder consumer apps: light version (founder + users + app-store/payment-platform as stakeholders).

## Workflow

1. **Inventory**: who affects or is affected? Roles: sponsor (funds/signs off), decision-maker, end-user, operator (runs it — support/ops), blocker (can veto: security/legal/platform), influencer.
2. **Map** (power × interest):

   |                | Low interest                    | High interest                                   |
   | -------------- | ------------------------------- | ----------------------------------------------- |
   | **High power** | Keep satisfied (don't surprise) | Manage closely (co-design, early wins)          |
   | **Low power**  | Monitor                         | Keep informed (users — the product IS for them) |

3. **Per key stakeholder record**:
   - Success criteria in THEIR words (what "good" means to them)
   - Veto conditions (what makes them say NO — discover early)
   - Communication cadence + format (weekly demo? sign-off gate? async report?)
4. **Trace into requirements**: every Must requirement traceable to a stakeholder's success criterion (extends `discovery/requirements.md` traceability) — untraceable Must = invented
5. **Sign-off gates** defined: who approves Gate 1 (requirements), Gate 2 (architecture), release (`quality-gates/gates.md` owners) — recorded in `.ai/project-state.md`

## Rules

- Conflicts between stakeholders (buyer wants control, user wants simplicity) surfaced INTO requirements as explicit trade-off decisions (`core/decision-log.md`) — never silently resolved by the builder
- B2B: the BLOCKER (security review, procurement) engaged at design time, not before signing (late blockers kill deals)
- Multi-sided products: each side is a persona (`marketing/personas.md`) + its own value loop

## Validation Checklist

- [ ] All stakeholder classes covered incl. blockers/operators
- [ ] Power/interest mapped; success criteria in their words
- [ ] Every Must requirement stakeholder-traceable
- [ ] Sign-off owners recorded for gates 1/2/release

## Handoff

→ `discovery/requirements.md` (stakeholder-traceable), gate ownership → `.ai/project-state.md`.
