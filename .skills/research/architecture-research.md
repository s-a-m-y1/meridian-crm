---
name: architecture-research
description: Research architecture patterns and styles before committing — migration costs included
domain: research
phase: research
priority: medium
inputs: [system-design, nfrs]
outputs: [architecture-options-analysis]
dependencies: [research/technical-research, architecture/system-design]
next_skills: [architecture/adr, architecture/architecture-migration]
---

# Architecture Pattern Research

Extends `research/technical-research.md` for architecture-STYLE decisions: monolith vs microservices vs serverless, sync vs event-driven, SQL vs NoSQL — the questions where industry debates are loudest and defaults matter most.

## The Anti-Pattern To Kill

Adopting patterns from conference talks / "companies at 100× our scale do it" — pattern fit is a function of OUR constraints (team size, deploy cadence, domain coupling, ops maturity), never of prestige. `core/engineering-principles.md` simplicity-first applies doubly here.

## Decision Inputs (gather before scoring)

1. **Team shape**: # engineers, # deploy-owners (microservices without N teams = distributed monolith — worst of both)
2. **Domain coupling map**: bounded contexts + their coupling (from `architecture/system-design.md` domains) — tightly-coupled contexts split by force = chatty services
3. **Deploy cadence need**: who needs to deploy independently? (that's the REAL microservices question)
4. **Ops maturity**: observability, orchestration, on-call capacity (per `.ai/architecture.md` operational notes)
5. **NFRs**: latency budgets, scale targets (real numbers, not "web scale")

## Pattern Comparison (standard trade-off table — always include BOTH costs)

| Pattern          | Wins                                       | Costs (write these down, don't romanticize)                                      |
| ---------------- | ------------------------------------------ | -------------------------------------------------------------------------------- |
| Modular monolith | 1 deploy, 1 codebase, easy local txn       | module discipline required (enforce boundaries or it rots)                       |
| Microservices    | independent deploys/teams, blast isolation | distributed txns, network failure modes, N× observability, versioned contracts   |
| Serverless       | no-ops scale-to-zero, pay-per-use          | cold starts, vendor lock, local dev friction, cost cliffs at volume              |
| Event-driven     | decoupled producers/consumers, replay      | eventual consistency UX, debugging complexity, poison messages                   |
| Sync RPC         | simple mental model, immediate result      | coupling, cascade failures (add timeouts/breakers per `architecture/backend.md`) |

## Workflow

1. Frame: the specific problem (NOT "should we do microservices" but "orders + inventory deploy independently?") — patterns serve problems
2. Inputs above → options (2-3 viable, from the table + hybrids like "monolith + 1 extracted service")
3. Migration cost column (from current state — greenfield analysis is fantasy for existing systems; see `architecture/architecture-migration.md`)
4. PoC the risky unknowns (`research/proof-of-concept.md`): e.g. cross-service txn latency for OUR flows
5. Score with weights → trade-off statements → ADR with revisit trigger ("re-evaluate extraction when deploy contention > X/week")
6. **Default bias explicit in ADR**: modular-monolith-default per `architecture/system-design.md`, deviation carries the burden of proof

## Validation Checklist

- [ ] Decision framed as a problem, not a pattern name
- [ ] Team/ops reality checked (scale rules evaluated honestly)
- [ ] BOTH wins and costs written per option; migration cost included
- [ ] ADR with revisit trigger (these decisions expire with growth)

## Handoff

→ `architecture/adr.md` (mandatory ADR — these are one-way-ish doors); migration path → `architecture/architecture-migration.md`.
