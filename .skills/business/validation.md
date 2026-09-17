---
name: lean-validation
description: Test riskiest assumptions cheaply before building — Lean approach
phase: business
priority: high
inputs: [market-research, competitive-analysis, bmc]
outputs: [validation-results, go-no-go]
dependencies: [market-research]
next_skills: [product/mvp, product/prd]
---

# Lean Validation

Build only what's validated. This skill kills bad ideas cheaply and de-risks good ones.

## Workflow

1. **Harvest assumptions**: from research/bmc files — every claim marked UNVERIFIED/ESTIMATE is a candidate. List ALL.
2. **Rank by risk** (Bets board):

   | Criterion   | Ask                             |
   | ----------- | ------------------------------- |
   | Fatality    | If false, does the product die? |
   | Uncertainty | How much evidence do we have?   |
   | Cheapness   | How fast can we test it?        |

   Riskiest = high fatality × high uncertainty. That's validated FIRST (leap-of-faith assumptions — typically 2-3).

3. **Design the cheapest test per assumption** (pick by cost, weakest allowed test that still moves belief):

   | Test                                   | Cost     | Moves belief on                       |
   | -------------------------------------- | -------- | ------------------------------------- |
   | Landing page + ad traffic (CTR/signup) | ~days, $ | Demand exists at all                  |
   | Concierge MVP (serve 5 users manually) | ~1 week  | Workflow value, willingness to engage |
   | Fake door / smoke test                 | ~days    | Feature-level demand                  |
   | Pre-order / LOI / deposit              | medium   | Willingness to PAY                    |
   | Interview 5-8 target users             | ~week    | Problem severity, workarounds         |
   | Prototype demo + watch usage           | medium   | Usability of the wedge                |

   Interview rules: ask about past behavior (facts), never hypotheticals ("would you use...?" = worthless); listen for workarounds + money already spent — those are the signals.

4. **Define pass/fail BEFORE running** (numbers written first — no post-hoc "well, sort of worked"): e.g. "≥ 5% landing conversion" / "3 of 5 interviewees describe the pain unprompted" / "2 pre-orders".
5. **Run → record** results (evidence) in the validation table:
   `Assumption | Test | Pass bar | Result | Belief now (↑/↓/→)`
6. **Decide**: kill (fatal assumption failed — celebrate the money saved), pivot (adjust segment/wedge; re-run), or proceed (MVP green-light — but only after the top-3 leap assumptions pass).
7. Output: validated assumptions → requirements inputs; dead ones → recorded as resolved risks (`.ai/risks/`).

## Output — Validation Dossier

```markdown
# Validation — <date>

## Bets Board (ranked assumptions)

## Tests Run (table w/ evidence) — pass bars set BEFORE each run

## Verdict: KILL | PIVOT (<to what>) | BUILD (MVP scope confirmation)

## Surviving assumptions (now facts — feed PRD)
```

## Validation Checklist

- [ ] Pass bars pre-declared for every test (no post-hoc)
- [ ] Top-3 fatal assumptions actually tested (not just the cheap ones)
- [ ] Interviews probed behavior, not opinions
- [ ] Verdict honest (KILL is a win when it saves a build)

## Handoff

→ `product/mvp.md` (scope on validated core), `product/prd.md` (facts → requirements).
