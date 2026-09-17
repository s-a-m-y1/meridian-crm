---
name: system-architecture
description: Design the technical architecture of the software system with explicit trade-offs
phase: architecture
priority: high
inputs: [prd, requirements-specification, constraints]
outputs: [architecture-document, .ai/architecture.md]
dependencies: [requirements, prd]
next_skills:
  [
    frontend-architecture,
    backend-architecture,
    database-architecture,
    api-architecture,
    adr,
  ]
---

# System Architecture

## Workflow

1. Read PRD + NFRs. List the **architectural drivers** (the NFRs/constraints that actually shape this system — usually 3-5: scale, latency, compliance, team size, deadline).
2. Draft candidate architectures. For each, describe with **C4 levels**:
   - **C1 Context** — system + external actors/systems (one diagram)
   - **C2 Containers** — apps, APIs, DBs, queues, caches (one diagram)
   - **C3 Components** — inside each container, only where non-obvious
3. Compare candidates in a trade-off table. Always consider at minimum:
   - Monolith-first vs. microservices — default: **modular monolith**; split only on deploy-independence/team-scaling evidence
   - Synchronous (REST/gRPC) vs. event-driven (queues) — default: sync for reads, async for writes that can lag
   - SQL vs. NoSQL — default: SQL; NoSQL only with a specific access pattern that demands it
4. Decide explicitly: monolith vs. distributed, build vs. buy for each major capability, self-host vs. managed.
5. Plan for cross-cutting concerns, each getting a home in the design:
   - AuthN/AuthZ (→ `auth-architecture.md`), Caching, Storage, Queues/Events, Observability (→ `observability/*`), Security (→ `security/threat-modeling.md`)
6. Scalability & reliability plan: stateless-by-default, horizontal scale path, single points of failure, failure modes per container (what happens when each dies?), RTO/RPO from NFRs.
7. Record every decision as an ADR (`adr.md`) with the trade-off table. Update `.ai/architecture.md` summary.

## Output — Architecture Document

```markdown
# Architecture — <project>

## Architectural Drivers (from NFRs)

## C1 System Context (diagram + narrative)

## C2 Containers (diagram + responsibility of each)

## Key Decisions (ADR links)

## Data Flow (2-3 critical flows, step by step)

## Scalability Plan

## Reliability Plan (failure modes per container)

## Cross-Cutting Concerns (auth, cache, observability, security)
```

## Decision Criteria & Trade-Off Rule

Every choice records: options considered, chosen, why, what we give up, when we'd revisit (trigger).

## Validation Checklist

- [ ] Every architectural driver addressed by a decision
- [ ] Every container has: responsibility, failure mode, scale path
- [ ] No unexplained 3rd-party service
- [ ] NFRs mapped to design elements (latency→caching layer, uptime→redundancy…)
- [ ] ADRs written; `.ai/architecture.md` updated

## Handoff

→ `frontend.md`, `backend.md`, `database.md`, `api.md`, `auth-architecture.md`.
