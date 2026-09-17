---
name: integration-implementation
description: Implement third-party integrations, webhooks, and file storage adapters
domain: development
phase: development
priority: medium
inputs: [api-research, backend-architecture]
outputs: [integrations]
dependencies: [research/api-research, development/backend]
next_skills: [testing/api-testing, observability/monitoring]
---

# Integration Implementation

Research/decision: `research/api-research.md`. Integration DOMAIN guide: `integrations/third-party-api.md` (the standards catalog). THIS = the coding discipline.

## The Adapter (the only acceptable shape)

```
internal service logic → adapter interface (OUR types) → adapter impl (their SDK/API) → external service
```

- OUR domain types at the boundary (never their types leaking inward — per `architecture/backend.md` layering)
- Adapter = the ONE place their SDK lives (swap vendors = rewrite one module per the ADR's exit plan)
- Config-injected (per `security/secrets.md`); sandbox + prod profiles

## External Calls (per `architecture/backend.md` adapter rules — restated as the checklist)

- [ ] Timeout set (never SDK default = often infinite)
- [ ] Retry: transient-only + backoff + jitter; idempotency-key on side-effecting calls (per `development/payments.md` discipline — universal, not Stripe-only)
- [ ] Circuit breaker + bulkhead (per `architecture/scalability-reliability.md` patterns)
- [ ] Fallback behavior defined (per `development/implementation-lifecycle.md` degradation — cached/stale/degraded, honest)
- [ ] Their rate limits respected: client-side throttle + 429/Retry-After handling + budget under limit (per `research/api-research.md` headroom math)

## Webhooks IN (consuming)

1. **Verify signature BEFORE parsing** (per `security/xss-csrf.md` webhook rules + `architecture/api.md` webhook contracts); reject invalid → 401 + alert
2. **Fast 2xx + queue** (per `development/background-services.md`): respond before processing (their retry-storms punish slow handlers); replay-tolerance (event ids deduped — at-least-once delivery is the norm)
3. Ordering not assumed (event-version checks per `architecture/event-driven.md` ordering rules)

## Webhooks OUT (emitting)

1. Signed (HMAC per-consumer secret), timestamped (replay window), retried with backoff + DLQ (per `development/background-services.md` jobs discipline)
2. Delivery observability: per-consumer success rate, latency, DLQ (customers ask "did you send it" — answer with data per `observability/monitoring.md`); endpoint management UI/API (register, rotate secret, disable)
3. Event contract per `architecture/event-driven.md` versioning — breaking changes = new version + sunset window (customers' integrations break silently otherwise)

## File Storage (implementation per `architecture/infrastructure-designs.md` storage design)

- Signed-URL flows (direct browser↔store; app never proxies bytes per bandwidth economics); virus/malware scan hook for user uploads (per `security/input-validation.md` upload rules — type allowlist + magic-byte + scan async); cleanup jobs (orphaned uploads + retention per `data/data-governance-quality.md` §5)

## Validation Checklist

- [ ] Adapters: our types inward, their SDK contained, timeouts/breakers/idempotency everywhere
- [ ] Webhooks-in: sig-first, fast-ack, deduped; webhooks-out: signed, retried, observable
- [ ] Uploads: type-checked, scanned, signed-URL, cleaned up on schedule

## Handoff

→ contract tests against sandbox per `testing/api-testing.md`; integration health monitoring per `observability/monitoring.md`.
