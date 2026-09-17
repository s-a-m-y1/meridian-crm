---
name: event-driven-architecture
description: Design event-driven and queue-based systems — contracts, delivery, idempotency
domain: architecture
phase: architecture
priority: medium
inputs: [system-design, backend-architecture]
outputs: [event-architecture]
dependencies: [architecture/system-design, architecture/backend]
next_skills: [development/backend, observability/monitoring]
---

# Event-Driven & Queue Architecture

## When Events (vs sync RPC per `research/architecture-research.md`)

Choose async when: the consumer can lag without user harm (email, analytics, downstream sync), work is retryable/schedulable (jobs), producers must not know consumers (decoupling bounded contexts), or burst-absorption needed. Default sync for reads + user-waiting writes (per `architecture/system-design.md`).

## Design Decisions (each ADR'd)

### 1. Broker/queue choice (staged per `architecture/backend.md`): DB-backed queue (start — transactional with app data) → managed broker (when volume/reliability demand). Evaluate per `research/framework-library-evaluation.md` scorecard.

### 2. Event contract (the interface that must not drift)

- Event = fact in past tense: `order.created` (not "create_order") with versioned schema (`v1.order.created`) + cloud-events-style envelope (id, type, time, source) + schema-registry discipline (breaking changes = new version, per `architecture/api.md` versioning)
- Contracts versioned in-repo, generated types for consumers (per `development/api.md` contract-first discipline)

### 3. Delivery semantics — pick per event, state it:

| Semantics                   | When                     | Cost                                                                                             |
| --------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------ |
| At-most-once                | loss tolerable (metrics) | simplest, drops allowed                                                                          |
| **At-least-once** (default) | most business events     | consumers must be idempotent (dedupe by event id)                                                |
| Exactly-once                | money/critical           | BROKER DOESN'T MAGICALLY GIVE THIS — it's at-least-once + idempotent consumer; design it as such |

### 4. Idempotent consumers (mandatory per `development/backend.md` jobs rules): dedupe table by event id; natural idempotency where possible (upserts); side-effect guards on retry.

### 5. Ordering & concurrency: partition by key where order matters (per-entity ordering — global ordering is a myth you don't need); out-of-order tolerance designed (version checks, last-write-wins rules stated).

### 6. Failure handling (the part that bites in prod):

- **DLQ** for poison events (max retries → dead-letter + alert per `observability/monitoring.md` — a silent DLQ is a data-loss machine)
- Replay strategy: events retained + replay tooling (that's WHY you keep them); replay is idempotency's real test
- Backpressure: queue depth + oldest-age alerts (`observability/metrics.md` queue metrics) — consumer scaling trigger defined

### 7. Saga pattern (distributed multi-step flows): compensating actions per step (order: reserve-stock → charge → ship; cancel-reversals per step) — no distributed transactions, explicit compensation design, saga state observable per step.

## Validation Checklist

- [ ] Every event versioned + schema-registered; types generated for consumers
- [ ] Semantics chosen per event; idempotency implemented + tested (double-delivery test per `testing/integration.md`)
- [ ] DLQ + alerts + replay tooling; queue-depth alerts wired
- [ ] Sagas designed with compensations (where multi-step)

## Handoff

→ implementation per `development/backend.md` jobs/queues; monitoring per `observability/metrics.md`.
