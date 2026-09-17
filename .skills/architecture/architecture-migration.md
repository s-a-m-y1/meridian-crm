---
name: architecture-migration
description: Safely migrate from one architecture to another — strangler, expand/contract, staged
domain: architecture
phase: architecture
priority: medium
inputs: [current-architecture, target-architecture]
outputs: [migration-plan]
dependencies: [research/architecture-research, architecture/adr]
next_skills: [workflows/refactor, devops/deployment]
---

# Architecture Migration

## When To Use

Style change (monolith→services, monolith→modular — `research/architecture-research.md` decided WHY), datastore/engine swap (per `research/framework-library-evaluation.md`), or major-version platform upgrade (per `workflows/major-version-upgrade.md`). Never "because" — the ADR precedes the migration plan.

## The Strategies (pick per component; mixes are normal)

| Strategy                                     | When                                       | Mechanics                                                                                                                                                                                     |
| -------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Strangler Fig** (default for live systems) | zero-downtime replacement of a live system | new edge intercepts traffic per route/domain → routes old-or-new → new implementation grows behind it → old code starves → removed. The interception layer (proxy/facade) is the KEY artifact |
| Expand/Contract (data)                       | schema/storage changes                     | expand (add new shape, dual-write) → migrate (backfill in batches) → contract (remove old) — NEVER skip steps; per `development/database.md` two-step rules                                   |
| Branch-by-abstraction (in-code)              | module extractions                         | new interface wraps old impl → callers migrate gradually → swap impl behind the interface → old impl dies                                                                                     |
| Big-bang rewrite                             | NEVER for working systems                  | per `core/agent-rules.md` — rewrite only when the system is dead/unmaintainable AND migration path proven impossible; human sign-off on the risk                                              |

## Workflow

1. **Baseline first**: current behavior pinned by tests (characterization per `development/refactoring.md` preconditions — migration without a green safety net = BLOCKED); metrics recorded (latency/cost — the "why" must be measurable after)
2. **Slice the migration** (components/routes, not "all at once"): each slice independently shippable + revertible; sequence by (risk × value) — highest-risk slice EARLY (fail fast on the scary unknowns per `product/prioritization.md` de-risk logic)
3. **Dual-run where data correctness is at stake**: shadow traffic (new path computes, old path serves, results diffed — per `testing/regression.md` equivalence evidence) before cutover; divergence metrics drive go/no-go
4. **Cutover with reversible steps**: flag-gated (`development/feature-flags.md` kill-switch per slice); rollback path documented per slice (per `devops/deployment.md` rollback-readiness rule); data migration backward-compatible (expand/contract)
5. **Verify + retire**: post-slice: metrics vs baseline (migration must have EARNED its cost); dead code removed per slice (not "later cleanup" — later never comes); old path's removal = its own reviewable change

## Rules

- Each slice = own tasks/PRs (per `core/task-standard.md` scope discipline); multi-week mega-branches rot (`core/multi-agent.md` merge rules)
- Data migrations batch + observable (progress, failure rate, resume-from-point per `development/database.md` backfill rules)
- Comms: internal stakeholders per slice (schema/contract changes announced per `core/multi-agent.md` contract-freeze); users only if behavior-visible

## Validation Checklist

- [ ] WHY pre-approved (ADR); baseline tests + metrics captured
- [ ] Sliced; highest-risk first; each slice flag-gated with rollback
- [ ] Data via expand/contract; dual-run diffed where correctness matters
- [ ] Dead paths removed per slice; post-migration metrics verified

## Handoff

→ execution `workflows/refactor.md` + `devops/deployment.md`; data steps per `development/database.md`.
