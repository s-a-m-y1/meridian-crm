---
name: maintenance
description: Ongoing upkeep — tech debt, dependency cadence, doc freshness
phase: maintenance
priority: medium
inputs: [project-state, audit-results]
outputs: [maintenance-plan]
dependencies: [documentation/changelog, security/dependency-security]
next_skills: [workflows]
---

# Maintenance

## Recurring Cadences

| Cadence   | Activity                                                                                               | Skills                                          |
| --------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| Weekly    | Dependency updates (routine batch), flaky-test review                                                  | `dependency-management`, `testing/strategy`     |
| Biweekly  | Tech-debt review: top 3 items tasked or explicitly deferred                                            | this file                                       |
| Monthly   | Security scan triage (new CVEs), coverage drift check                                                  | `dependency-security`, `testing/coverage`       |
| Quarterly | Doc freshness audit (README/setup/arch vs reality), NFR/SLO review, threat-model refresh trigger check | `documentation/*`, `metrics`, `threat-modeling` |

## Technical Debt Protocol

1. Debt is **recorded, never remembered**: `.ai/risks/` or a debt backlog entry — what, where, cost of delay, remediation sketch, interest (how it slows work).
2. Prioritize by **interest**: debt actively generating bugs/slowness first; dormant debt can wait.
3. Budget rule: ~20% of capacity for debt+maintenance — agreed and enforced, not aspirational.
4. Fix at touchpoints opportunistically (boy-scout rule per `engineering-principles.md`) — but as separate commits (never mixed into feature diffs, per `refactoring.md`).

## Doc Freshness (the rot check)

Run a "newcomer agent" test quarterly: fresh agent follows README → setup → first task using docs only; every stumble = a doc bug (tasked).

## Health Signals That Demand Maintenance Work

Flaky tests > 2% of suite, CI time > 2× baseline, coverage dropping 2 releases straight, deploys needing manual "extra steps", warnings in logs normalized as "usual" — each = dedicated maintenance task, not background noise.

## Validation Checklist

- [ ] Cadence table scheduled (tasks exist in `.ai/tasks/`)
- [ ] Debt backlog has interest-rated items, not vague wishes
- [ ] Last doc-freshness walkthrough dated + issues tasked

## Handoff

→ tasks via `core/task-management.md`; dep changes via `testing/regression.md` rules.
