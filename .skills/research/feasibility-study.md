---
name: feasibility-study
description: Assess technical + operational + economic feasibility before committing to build
domain: research
phase: research
priority: high
inputs: [requirements, nfrs, constraints]
outputs: [feasibility-verdict]
dependencies: [research/technical-research, research/proof-of-concept]
next_skills: [product/prd, business/validation]
---

# Feasibility Study

## When To Use

Between requirements and commitment (PRD/architecture): "CAN we build this at acceptable cost/risk?" — the engineering answer to business validation. Requested by `business/validation.md` verdicts (BUILD needs technical feasibility confirmed) or gate 2 preparation.

## Three Feasibility Dimensions (verdict = all three)

### 1. Technical feasibility

- Hard blockers scan: laws of physics (real-time on batch data?), platform limits (API caps, store policies), missing capabilities (would require tech we don't have + can't readily acquire)
- Unknown-heavy areas → spiked (`research/proof-of-concept.md`) with kill criteria — count of unresolved unknowns is itself a verdict input
- NFR fit at target scale: latency/volume/security requirements vs candidate approaches (`testing/performance.md` budget shape)

### 2. Operational feasibility

- Who runs it? (on-call surface added — `observability/monitoring.md` alert count grows; staffing reality)
- Run cost at projected volume (infra + third-party + licenses — modeled per `business/finance.md`)
- Failure handling: what breaks, how detected, who fixes at 3am (unanswerable = not feasible yet)

### 3. Economic feasibility

- Build cost (est. from spike-calibrated decomposition) vs value (from `business/market-research.md` WTP evidence)
- Maintenance tail: features aren't one-time — ongoing cost ratio checked (`documentation/maintenance.md` health-signal lens)
- Opportunity cost: what does NOT get built (explicitly listed — per `product/prioritization.md`)

## Output — Verdict

```markdown
# Feasibility: <capability> — <date>

| Dimension | Verdict | Evidence | Gaps |
Technical | GO / RISKY / NO-GO | (spike reports, doc research) | ...
Operational | ... | (run cost model, on-call impact) |
Economic | ... | (build vs value, maintenance tail) |
OVERALL: GO (conditions) / GO-WITH-SCOPE-REDUCTION / NO-GO (reason + revisit trigger)
Conditions: e.g. "p95 < 300ms proven by spike before Gate 2"
```

## Rules

- NO-GO is a legitimate, valuable verdict (per `business/validation.md` KILL-is-a-win logic) — feasibility theater that always says GO kills companies slowly
- Every RISKY/GO carries its conditions into the PRD as explicit constraints (`product/prd.md`)
- Revisit triggers set (feasibility expires with scale/stack changes)

## Validation Checklist

- [ ] All 3 dimensions evidenced (not vibes); unknowns counted
- [ ] Spikes run for the top unknowns with pre-declared kill bars
- [ ] Verdict + conditions + revisit trigger recorded (`core/decision-log.md`)

## Handoff

→ GO → `product/prd.md` (with conditions as constraints); NO-GO → back to `business/validation.md` (pivot/kill).
