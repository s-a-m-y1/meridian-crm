---
name: background-services
description: Implement background jobs, queues and notification systems
domain: development
phase: development
priority: medium
inputs: [event-architecture, backend-architecture]
outputs: [jobs-queues-notifications]
dependencies: [architecture/event-driven, development/backend]
next_skills: [testing/integration, observability/monitoring]
---

# Background Services — Jobs, Queues, Notifications

Design layer: `architecture/event-driven.md` (contracts/semantics/sagas). THIS = implementation discipline.

## Background Jobs

1. **Job definition standard**: payload = IDs not objects (staleness-proof per `architecture/backend.md`); type-safe job classes (generated from event contracts where possible); every job declares: retry policy, idempotency key, DLQ destination
2. **Idempotency implemented** (not assumed): dedupe store keyed by event/job id OR natural-key upserts; double-delivery test per `testing/integration.md` (execute twice → same state — the job's proof of safety)
3. **Retry discipline**: exponential backoff + jitter (per `architecture/scalability-reliability.md`); retry ONLY transient failures (validation errors → straight to DLQ — retrying a poison message 5× is self-harm); max-attempts → DLQ + alert
4. **Scheduling**: cron semantics UTC + locked single-runner (per `development/implementation-lifecycle.md` cron rules); long jobs = check-pointable (resumable progress per `core/delegation.md` checkpoint philosophy)
5. **Queue consumer scaling**: depth + age metrics drive scale-out (per `observability/metrics.md` queue metrics); concurrency limits per downstream capacity (don't overload the DB with 50 parallel workers because the queue is deep)

## Notification System (email/push/in-app — the implementation layer)

1. **Channels as adapters** (per `architecture/backend.md`): email (per `marketing/email.md` deliverability discipline), push (per `development/mobile.md`), in-app (per `design/ui.md` states — notification center + toasts per `design/design-system.md`)
2. **Delivery rules**: preference-respecting (user opt-outs per `compliance/legal.md` §3); deduped (same event → one notification, batched windows); retried with backoff (channel flakiness is normal); every send logged with outcome (bounce/complaint handling per `marketing/email.md` hygiene)
3. **Template discipline**: one template source (shared with email lifecycle sequences — `marketing/email.md` copy rules apply); locale-aware per `development/i18n-rtl.md` (incl. RTL rendering for ar)
4. **Notification = event-driven consumer**: notification-preferences changes are events; quiet-hours rules enforced; the sender NEVER blocks the triggering flow (fire-and-forget into the queue — a failed email send must not fail the order)

## Validation Checklist

- [ ] All jobs idempotent + DLQ'd; double-delivery tests green
- [ ] Retry/backoff/jitter per policy; poison → DLQ not retry-storms
- [ ] Notifications: preference-checked, deduped, logged, async
- [ ] Queue depth/age alerting wired; consumer scaling rules set

## Handoff

→ tests per `testing/integration.md` (jobs inline-run rules); monitoring per `observability/monitoring.md`.
