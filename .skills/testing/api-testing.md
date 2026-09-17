---
name: api-testing
description: Contract and behavioral tests for API endpoints
phase: testing
priority: high
inputs: [api-architecture, implementation]
outputs: [api-test-suite]
dependencies: [strategy, development/api]
next_skills: [regression, documentation/api-docs]
---

# API Testing

## Per-Endpoint Required Cases

| Case            | Asserts                                                                          |
| --------------- | -------------------------------------------------------------------------------- |
| Happy path      | 200/201, body matches schema exactly (no extra/leaked fields)                    |
| Validation      | 422/400 per invalid field + combined-invalid; unknown fields rejected            |
| Unauthenticated | 401 (no token/expired)                                                           |
| Forbidden       | 403 (valid token, wrong role/scope)                                              |
| Not found       | 404 (valid auth, missing resource — and no existence leak for others' resources) |
| Conflict        | 409 (duplicate/unique violation)                                                 |
| Rate limit      | 429 + Retry-After                                                                |
| Pagination      | cursor at end, empty page, cursor stability                                      |
| Idempotency     | same Idempotency-Key twice → single side effect, identical response              |

## Rules

1. **Contract validation on every response**: body validated against the OpenAPI/schema (drift caught here, per `development/api.md`).
2. Test against a **running service with real DB** (integration tier), not mocked handlers — the point is the full HTTP path (middleware, guards, error mapping).
3. Error envelope consistency asserted (every error response has the envelope shape).
4. Include one **negative security probe** suite: SQLi strings in inputs, oversized payloads, malformed JSON, wrong content-type — all rejected with 4xx and logged, never 500.
5. Webhook endpoints (if any): signature check verified (bad signature → 401 fast; valid → 2xx + async processing observable).

## Validation Checklist

- [ ] Case table filled for every endpoint
- [ ] Contract drift check part of the suite
- [ ] Security probes pass (no 500s, nothing leaked)

## Handoff

→ `regression.md` (API layer of the suite); docs generated from the same contract (`documentation/api-docs.md`).
