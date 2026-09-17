---
name: framework-library-evaluation
description: Evaluate and select frameworks and libraries — structured scorecards
domain: research
phase: research
priority: high
inputs: [technical-research, project-constraints]
outputs: [selection-decision]
dependencies: [research/technical-research]
next_skills: [architecture/adr, development/dependency-management]
---

# Framework & Library Evaluation

Extends `research/technical-research.md` with the specific scorecard for frameworks/libraries. Decision process identical; evaluation criteria below.

## Framework Scorecard (major — React vs Vue vs X class)

| Criterion            | Weight guide | What to check                                                                                    |
| -------------------- | ------------ | ------------------------------------------------------------------------------------------------ |
| Fit to requirements  | 0.25         | does it cover OUR rendering/data/team needs (from NFRs — not generic benchmarks)                 |
| Ecosystem & hiring   | 0.20         | package ecosystem depth, talent pool, AI-agent proficiency (proxy: corpus size)                  |
| Maintenance health   | 0.15         | release cadence, funded/core-team, deprecation stance, security response time                    |
| Longevity risk       | 0.15         | adoption trajectory (declining = future rewrite), owner concentration (single maintainer = risk) |
| Operational cost     | 0.10         | build tooling, hosting fit, upgrade path pain (check major-version migration guides)             |
| Performance envelope | 0.10         | meets OUR budgets (`testing/performance.md`), not benchmark bragging                             |
| License              | 0.05         | permissive; copyleft reviewed per `compliance/legal.md`                                          |

Rules: weights pre-declared; a framework failing MAINTENANCE (unmaintained) is eliminated before scoring (no trade-off rescues an abandoned framework); legacy-context check — evaluate against OUR stack per `.ai/architecture.md`, not a greenfield fantasy.

## Library Scorecard (minor — one package)

1. **Necessity gate** (`development/dependency-management.md`): ~50 lines we could own? duplicate capability? → reject before scorecard
2. Score (1-5): maintenance (last release < 12mo), downloads trend (flat/growing), issue responsiveness, transitive dependency count (each = supply-chain surface), security audit clean (`security/dependency-security.md`), TypeScript types quality, breaking-change history (semver discipline)
3. **Dependency-half-life check**: how hard to REMOVE later? (thin wrappers easy; ORM/framework-core = one-way door — human sign-off)
4. Alternatives always compared (2-3 minimum — the first search result is not an evaluation)

## Workflow

1. Frame + criteria per `research/technical-research.md` (this scorecard = the criteria)
2. Build comparison matrix; score with evidence links
3. **Spike risky claims** (next skill): performance/battery claims get a 2-hour PoC benchmark in OUR scenario before trusting (`research/proof-of-concept.md`)
4. Trade-offs + decision → ADR for frameworks, D-record for libraries
5. Install via `development/dependency-management.md` gates

## Validation Checklist

- [ ] Scorecard applied with pre-declared weights; elimination rule enforced
- [ ] ≥2 alternatives compared for libraries; ≥3 for frameworks
- [ ] Perf/risky claims spiked with PoC evidence, not vendor docs
- [ ] Removal-cost (half-life) assessed; one-way doors human-approved

## Handoff

→ ADR/D-record; install gates; PoC findings attached to the decision.
