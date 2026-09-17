---
name: architecture-styles
description: Monolith vs microservices vs serverless — decision and implementation profiles
domain: architecture
phase: architecture
priority: medium
inputs: [system-design, architecture-research]
outputs: [style-decision, implementation-profile]
dependencies: [research/architecture-research]
next_skills: [architecture/adr, architecture/architecture-migration]
---

# Architecture Styles — Profiles

The DECISION research lives in `research/architecture-research.md` (options + trade-offs + team-reality). This skill = the implementation profile AFTER the choice: what each style demands operationally. Default remains modular monolith (per `architecture/system-design.md`); every profile below earns its costs honestly.

## Modular Monolith (default)

- **Module discipline = the whole game**: enforced boundaries (package/module rules in CI — import-linting per module dependency direction), one-directional (`orders → billing` never back), public API per module (internal classes not importable — tooling enforced)
- Single deploy; local transactions; simplest observability
- Rot risk: boundary erosion — quarterly boundary-audit in `review/architecture-review.md` (module-skipping imports = HIGH finding)

## Microservices (only with the evidence — N deploy-owners, proven deploy contention)

- **Contract discipline**: per-service API versioning (per `architecture/api.md`), schema-registry for events (per `architecture/event-driven.md`) — contracts are the only coupling allowed
- **Independent datastores** (shared DB = distributed monolith, the worst outcome); cross-service joins banned — API composition or event-carried state
- **Distributed realities paid daily**: timeouts/breakers/bulkheads per call (per `architecture/scalability-reliability.md` patterns); distributed tracing MANDATORY (per `observability/alerting-tracing.md` — you cannot debug N services with logs alone); saga-based flows (per `architecture/event-driven.md`)
- **Ops tax honest**: N × (deploy + monitoring + on-call + capacity); count it before choosing (per `business/finance.md`)

## Serverless (per-function scale economics)

- Fits: bursty/event workloads, glue integrations, spiky traffic, low-traffic internal tools
- Doesn't fit: steady high-traffic (cost cliff — model per `business/finance.md`), latency-sensitive (cold starts budget-check per `testing/performance.md`), long-running jobs (timeout ceilings)
- Discipline: stateless handlers (state in managed services), cold-start mitigation (provisioned concurrency for latency-critical paths), local-dev story designed (per `devops/docker.md` parity), vendor-lock exit plan written into the ADR (per `research/api-research.md` exit-plan rule)

## Hybrid (the actual common answer)

Monolith core + extracted services ONLY where deploy-independence is proven needed + serverless for bursty edges — composition justified per-component (each component's style carries its own ADR row). This is not indecision; it's fit-per-component per `core/engineering-principles.md` simplicity rule.

## Validation Checklist

- [ ] Style choice ADR'd with team/ops evidence (not prestige — per research skill)
- [ ] For the chosen profile: ALL its discipline items implemented/enforced in CI
- [ ] Hybrid components each justify their style individually

## Handoff

→ boundaries → module/service structure (`architecture/backend.md`); migration from current → `architecture/architecture-migration.md`.
