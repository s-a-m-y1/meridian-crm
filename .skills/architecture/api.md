---
name: api-architecture
description: Design API contracts — style, versioning, errors, pagination, conventions
phase: architecture
priority: high
inputs: [system-design, requirements-specification]
outputs: [api-contract-architecture]
dependencies: [system-design]
next_skills: [development/api, documentation/api-docs]
---

# API Architecture

## Workflow

1. **Style decision** (ADR): REST (default — resource-oriented, cacheable, universally understood) vs. GraphQL (client-driven aggregation across many domains; beware N+1 + auth complexity) vs. gRPC (internal high-throughput services).
2. **Versioning strategy** from day one — default: URI versioning (`/v1/`), additive-only within a version; breaking change → new version + deprecation window (never silent breaks).
3. **Resource model**: nouns not verbs; plural; nesting ≤ 2 levels (`/users/{id}/orders`); actions that don't fit CRUD get explicit sub-resources (`POST /orders/{id}/cancel`).
4. **Cross-cutting conventions** (apply to every endpoint, no exceptions):
   - **Errors**: one error envelope, machine-readable codes + human message + problem details (type/title/status/detail). No stack traces, ever.
   - **Pagination**: cursor-based (stable under inserts) — `?limit=&cursor=`, response includes `nextCursor`.
   - **Filtering/sorting**: allowlist of fields only (never client-supplied column names — injection).
   - **Idempotency**: `Idempotency-Key` header on all POSTs with side effects.
   - **Requests/Responses**: explicit DTO layer; unknown fields rejected or ignored — never silently stored.
5. **AuthN/AuthZ contract**: token type, scopes/roles in the contract, 401 vs 403 semantics.
6. **Rate limiting contract**: headers (`X-RateLimit-*`), 429 with `Retry-After`.
7. Contract-first: schema (OpenAPI/graphql SDL) is the single source of truth; clients generate from it; CI validates implementation matches schema.

## Validation Checklist

- [ ] Every endpoint has: auth requirement, error responses, rate limit class
- [ ] Error envelope + pagination consistent across all endpoints
- [ ] Contract schema exists and is version-controlled
- [ ] Breaking-change policy written down

## Handoff

→ `development/api.md` (implementation), `documentation/api-docs.md` (publish).
