---
name: experimentation
description: Design and run product experiments with statistical honesty — A/B and beyond
domain: product
phase: product
priority: high
inputs: [product-metrics, feature-flags-infrastructure]
outputs: [experiment-program]
dependencies: [product/product-metrics, development/feature-flags]
next_skills: [business/growth, review/release-review]
---

# Product Experimentation

## Rules (statistical honesty — the non-negotiables)

1. **Pre-declared everything**: hypothesis, metric, pass bar, duration/sample BEFORE launch (per `business/validation.md` discipline — post-hoc "it sort of worked" is banned)
2. **One variable** per experiment (bundled changes = un-attributable learning)
3. **Sample size calculated**: use expected-effect + baseline variance; underpowered experiments = directional-only, DECLARED as such
4. **Fixed duration or fixed sample** — peeking at p-values daily until significance = false positives guaranteed (multiple-looks inflation); stopping rules set at design
5. **A/A sanity checks** occasionally (infrastructure + analysis pipeline verification — catches biased assignment/broken tracking)
6. **Both positive AND negative results logged** (`.ai/context/growth-log.md`) — a documented dead-end is an asset; un-run experiments on tested hypotheses = waste

## Experiment Design Template

```markdown
# EXP-<n>: <name>

- Hypothesis: because [evidence], [change] for [segment] will [move metric] by [≥X]
- Primary metric: (ONE — from metric tree inputs) | Guardrails: [must-not-break list]
- Assignment: random by user (consistent hashing per `development/feature-flags.md`)
- Power analysis: baseline σ, expected effect, required n, duration
- Stop rules: fixed at n OR [early-kill if guardrail breaches]
- Decision rule: ship if p<0.05 AND effect ≥ bar AND guardrails intact; else kill
```

## Workflow

1. **Backlog from the metric tree**: experiments target the weakest input metric (not random curiosity)
2. **Prioritize by information value × cost** (cheap fast tests that de-risk big bets first)
3. **Design** (template above — reviewed before launch like any change)
4. **Run** via `development/feature-flags.md` experiment flags (5% → full roll per its protocol; kill-switch live during the experiment)
5. **Analyze honestly**: segment checks (did it help SOME and hurt others? Simpson's-paradox scan), novelty-effect awareness (week-1 lift ≠ steady state — extend if suspicious), guardrails verdict explicit
6. **Decide + record + ship/kill**: full-rollout via flags or removal; result into growth log; learning into the next hypothesis (the compounding is the point)

## When A/B Is Wrong (choose honestly)

- No traffic (<100 conversions/period) → qualitative + usability + staged rollout with monitoring instead (declared)
- UX-wide changes needing felt experience → before/after cohort with guardrails, not forced A/B
- Trust/irreversible changes (pricing, security) → `business/pricing.md` testing protocols, not traffic splits

## Validation Checklist

- [ ] Every experiment pre-declared (hypothesis/bar/duration/stop rules)
- [ ] Power analysis done; underpowered declared directional
- [ ] No peeking; stop rules honored; A/A check ran at least once
- [ ] All results (incl. negatives) in growth log

## Handoff

→ infra via `development/feature-flags.md`; results → `business/growth.md` + `product/roadmap.md` decisions.
