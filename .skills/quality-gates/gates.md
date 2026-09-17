---
name: quality-gates
description: The 9 mandatory lifecycle gates with pass/fail criteria and blocking behavior
phase: core
priority: critical
inputs: [phase-artifacts]
outputs: [gate-decisions]
dependencies: [all phase skills]
next_skills: [next-phase-or-fix]
---

# Quality Gates

A project/feature does not progress past a failed gate. Gate results recorded in `.ai/project-state.md` Gate Status with evidence links.

## Gate Table

| #   | Gate                      | Pass Criteria (evidence required)                                                                                                       | Failure → Required Action                                                                |
| --- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 1   | **Requirements**          | All FRs/NFRs testable + prioritized + traceable to goals; assumptions marked                                                            | Unverifiable/ambiguous reqs → re-run `discovery/requirements.md`; no architecture starts |
| 2   | **Architecture**          | ADRs for major decisions w/ trade-offs; C1/C2 complete; failure modes + scale plan per container; security design (threat model) exists | Gaps → `architecture/system-design.md` + `threat-modeling.md`; no task breakdown starts  |
| 3   | **Implementation**        | Diff matches task scope; lint+typecheck+build green; layering/contract respected; no CRITICAL/HIGH review findings                      | Out-of-scope changes reverted; violations fixed; findings resolved before merge          |
| 4   | **Testing**               | ACs all covered by named tests; suite green (evidence: cmd+exit); changed-code coverage ≥ budget; no new flaky tests                    | Red tests fixed or BLOCKED; coverage gaps tasked + justified                             |
| 5   | **Security**              | `security-review` PASS (no open CRITICAL/HIGH); dep audit clean or triaged; secrets scan green; auth matrix tested                      | CRITICAL/HIGH → fix via `security/*` before release; no exceptions                       |
| 6   | **Performance**           | Hot paths within NFR budgets with before/after evidence; no N+1/unbounded queries introduced; budgets CI-enforced                       | Regression → `performance-*` skills; missing evidence = fail (not pass)                  |
| 7   | **Documentation**         | README commands work; API docs match schema; changelog entries present; setup guide clean-env verified                                  | Broken docs fixed in same PR; release blocked until green                                |
| 8   | **Deployment**            | Pre-deploy checklist green; expand/contract order respected; rollback path ready; post-deploy smoke + metrics window clean              | Failed smoke/watch window → auto-rollback per `devops/deployment.md`                     |
| 9   | **Production Validation** | 24-48h monitoring window: SLOs met, error rate at/below baseline, business metrics functional, no SEV1/2 from release                   | Degradation → `incident-response.md`; rollback assessment mandatory                      |

## Gate Rules

1. **Blocking**: CRITICAL findings and Gates 1,2,5 are hard stops; others block their phase but the fix may be tasked (MEDIUM review findings may defer with owner + date).
2. **Evidence or it didn't happen**: every PASS cites commands/exit codes/links — "looks good" is not evidence (per `core/agent-rules.md`).
3. **Re-gating**: changes after a gate passed re-open that gate (post-arch-change → re-run Gate 2; post-fix → re-run Gate 4).
4. **Who gates**: the executing agent self-reports + the reviewing agent (or human) verifies. Independent verification for Gates 5, 8, 9 always.
5. Gate status is workflow-visible: `workflows/*.md` reference these gate numbers at their step boundaries.

## Validation Checklist (of the gate system itself)

- [ ] All 9 gates have measurable pass criteria
- [ ] Failure paths specified (no gate says "try harder")
- [ ] Re-gate triggers defined
