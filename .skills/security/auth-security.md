---
name: auth-security
description: Implement secure authentication and authorization
phase: security
priority: high
inputs: [auth-architecture]
outputs: [secure-auth-implementation]
dependencies: [architecture/auth-architecture]
next_skills: [security-review, testing/api-testing]
---

# Auth Security Implementation

## Authentication Rules

1. Passwords: proven scheme only — bcrypt/argon2 with sane cost; never plaintext/reversible/MD5/SHA-fast. Reject common-password lists; minimum length 8+ (length beats complexity theater).
2. Sessions (web): HTTP-only, Secure, SameSite cookies; rotate session ID on login/privilege change; server-side revocation on logout; absolute + idle expiry.
3. Tokens (API): short-lived access (≤15 min); refresh tokens stored server-side, rotatable, revocable, single-use rotation on refresh; JWTs validated for signature AND exp AND issuer AND audience.
4. Password reset: single-use, expiring (≤15 min) tokens, hashed at rest like passwords; reset invalidates existing sessions; never reveal account existence in the response (same message whether email exists or not).
5. Rate limits: login/reset endpoints strict (e.g. 5/min/IP + account-level lockout with backoff); MFA offered where the product holds sensitive data.
6. All auth events audited: login success/fail, lockout, reset, permission change (log who/what/when/IP — no secrets/PII beyond user ID).

## Authorization Rules

1. **Deny by default**: no route accessible without explicit guard; privileged access requires explicit role, never absence of a check.
2. **Object-level checks (IDOR) on every route touching an entity by ID** — `get order by ID` verifies the caller owns it. This is the #1 access-control bug class; treat as always-suspect.
3. Centralized enforcement at one guard/middleware layer; handlers never assume "already checked".
4. Role/capability matrix written down (who can do what); tests assert the full can/cannot matrix (per `testing/api-testing.md` 403 cases).
5. Privilege changes (role grant/revoke) invalidate affected sessions/tokens immediately.
6. Fail-closed: broken token parsing/expired session = reject (401), never degrade to anonymous-allowed.

## Validation Checklist

- [ ] Full can/cannot matrix tested per role
- [ ] IDOR probes pass (other-user IDs → 404/403, never data)
- [ ] Reset flow: single-use, expiry, session invalidation verified
- [ ] Auth audit events present; no secrets in them

## Handoff

→ `review/security-review.md`; auth flows to `testing/api-testing.md` + `testing/e2e.md`.
