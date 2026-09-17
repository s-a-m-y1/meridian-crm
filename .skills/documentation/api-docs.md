---
name: api-documentation
description: Publish API reference from the contract schema
phase: documentation
priority: high
inputs: [api-schema, api-implementation]
outputs: [api-docs]
dependencies: [architecture/api, testing/api-testing]
next_skills: [quality-gates]
---

# API Documentation

## Rules

1. **Generate from the contract** (OpenAPI/SDL) — never hand-maintain a parallel doc; drift = doc bugs (schema-first per `architecture/api.md`).
2. Per endpoint documented: purpose, auth requirement, request (fields + types + constraints), **all error responses with causes**, rate-limit class, pagination behavior, idempotency semantics, example request/response (realistic values).
3. Response field docs include semantics (units, nullability, enum meanings) — not just types.
4. Versioning documented: current version, deprecations (sunset dates), migration notes for breaking changes.
5. Auth doc: how to get a token/key, scopes/roles matrix (from `security/auth-security.md` capability matrix).
6. **Accuracy check**: docs validated against the running service in CI (schema → docs generation + contract tests already assert the schema — closing the loop).
7. Changelog entry for any user-facing API change (per `changelog.md`).

## Structure (generated reference + hand-written guides)

Reference (auto) + "Getting Started" (first call walkthrough with curl) + auth guide + webhooks guide (signing/retries per `development/api.md`) + rate limits + errors table.

## Validation Checklist

- [ ] Generated from schema; no drift possible by construction
- [ ] Every error response documented with cause
- [ ] First-call walkthrough executed verbatim (proof it works)

## Handoff

→ Gate 7 evidence; published with releases per `release-management.md`.
