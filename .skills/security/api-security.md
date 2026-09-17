---
name: api-security
description: Secure API surface — rate limiting, headers, exposure control
phase: security
priority: high
inputs: [api-architecture]
outputs: [secure-api-config]
dependencies: [architecture/api]
next_skills: [security-review]
---

# API Security

## Rules

1. **Rate limiting on every route** (tiered): strict on auth endpoints (5/min), normal on reads (60-100/min), background-class on expensive operations; response headers `X-RateLimit-*` + `Retry-After` on 429. Protect availability too (`DoS`).
2. **Security headers** on all responses: `Strict-Transport-Security` (HSTS), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` / `frame-ancestors 'none'`, CSP on HTML routes (per `xss-csrf.md`).
3. **Exposure control**: no internal IDs/flags in responses (use opaque public IDs where guessable sequential IDs are a concern); consistent errors that never reveal existence of resources the caller can't see; no stack traces/logs/internal paths in any 4xx/5xx body.
4. **Mass assignment**: update endpoints accept explicit DTOs (allowlisted fields), never spread of request body onto models (`update user` accepting `role` = privilege escalation classic).
5. **Pagination caps** everywhere; expensive queries (search/reports) authenticated + rate-limited.
6. **Webhooks out**: signed (HMAC), secrets per-consumer, replay-attack timestamps; **webhooks in**: verify signature before parsing, respond fast + process async.
7. API keys (if issued to consumers): hashed at rest, scoped, rotatable, revocable, never embedded in URLs (headers only — URLs end up in logs).
8. CORS: explicit origin allowlist (no `*` with credentials); credentials mode only for first-party origins.

## Validation Checklist

- [ ] Rate-limit class assigned to every route (grep routes without)
- [ ] Headers verified in API tests (assert per `testing/api-testing.md`)
- [ ] Mass-assignment probes pass (unknown/privileged fields rejected)
- [ ] CORS policy explicit + tested

## Handoff

→ `testing/api-testing.md` (probe cases), `review/security-review.md`.
