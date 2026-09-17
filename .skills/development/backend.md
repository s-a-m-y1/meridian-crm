---
name: backend-implementation
description: Standards for implementing backend code — controllers, services, repositories, jobs
phase: development
priority: high
inputs: [backend-architecture, api-architecture]
outputs: [backend-code]
dependencies: [architecture/backend, architecture/api]
next_skills: [testing/unit, testing/integration]
---

# Backend Implementation

## Layer Rules (strict)

- **Controller**: parse+validate input, call one service, map result → HTTP. No business logic, no SQL.
- **Service**: business logic + transaction boundaries. Framework-agnostic (no HTTP types inside). Dependencies injected, not imported ad hoc.
- **Repository**: data access only. No business rules. Returns domain objects, not raw rows/drivers.
- Violation of layering = review blocker (see `review/code-review.md`).

## Implementation Rules

- **Validate every input** at the boundary: schema-validated (zod/joi/pydantic-style), unknown fields rejected, coercion explicit — see `security/input-validation.md`.
- **Error taxonomy** (consistent hierarchy): Validation → 422/400; NotFound → 404; Conflict → 409; RateLimit → 429; Internal → 500 (never leak internals). Errors carried in the standard envelope; services throw typed domain errors, controllers map them.
- **Transactions**: shortest scope possible; no I/O (HTTP/email) inside a transaction; multi-step domain flows = transaction per consistency unit + compensating action or outbox pattern.
- **Background jobs**: idempotent (safe duplicate execution), retry w/ exponential backoff, dead-letter after max attempts, payload = IDs not objects (avoid staleness), observability hooks (queue depth, failure rate — `observability/metrics.md`).
- **External calls** (via adapters only): explicit timeout (never default-infinite), retry on transient only, circuit breaker, fallback defined.
- **Config**: env-only, validated at boot, fail-fast on missing (no silent defaults for required config); secrets never in code/logs (`security/secrets.md`).
- **Logging**: structured, request-ID propagated, level discipline (info=state changes, warn=recoverable, error=needs action) — per `observability/logging.md`.

## Validation Checklist

- [ ] Layering respected (no skipping)
- [ ] All inputs schema-validated at boundary
- [ ] All external calls timeout + retry + breaker
- [ ] Jobs idempotent + dead-lettered
- [ ] No secrets/config defaults for required values

## Handoff

→ `testing/unit.md` (services), `testing/integration.md` (repo+DB), `testing/api-testing.md` (contract).
