---
name: api-implementation
description: Standards for implementing API endpoints that satisfy the architecture contract
phase: development
priority: high
inputs: [api-architecture, backend-architecture]
outputs: [api-endpoints]
dependencies: [architecture/api, architecture/backend]
next_skills: [testing/api-testing, documentation/api-docs]
---

# API Implementation

## Rules

1. **Contract-first**: implement to the OpenAPI/SDL schema; CI validates routes/requests/responses against it (drift = build failure).
2. Every endpoint must have, before merge:
   - Auth requirement declared + enforced at the guard layer (401 vs 403 correct semantics)
   - Request validation (schema; unknown fields rejected) BEFORE any business logic
   - All documented error responses actually produced (a documented-but-impossible error is a lie)
   - Rate limiting class assigned
   - Cursor pagination if list-shaped (never offset for mutable feeds)
   - `Idempotency-Key` honored on side-effecting POSTs (store key + response, replay on duplicate)
3. Response discipline: return exactly the DTO (no leaking internal fields/IDs — e.g. numeric DB IDs, internal flags); consistency: dates ISO-8601 UTC, enums documented.
4. Webhooks (if emitting): signed payloads, retry with backoff, delivery log visible; (if consuming): signature verification before parsing, replay protection, fast 2xx then process async.
5. Version discipline: additive-only within `/v1/`; anything breaking → new version + deprecation headers/notes.
6. Testing gates per endpoint: happy path + validation errors + auth failures (401/403) + rate limit + pagination edge (cursor at end) — see `testing/api-testing.md`.

## Validation Checklist

- [ ] Schema ↔ implementation drift check passes in CI
- [ ] All endpoints: auth + validation + rate limit + pagination + idempotency as applicable
- [ ] No internal field leakage in responses
- [ ] Error envelope 100% consistent

## Handoff

→ `testing/api-testing.md` (contract tests), `documentation/api-docs.md` (publish docs from schema).
