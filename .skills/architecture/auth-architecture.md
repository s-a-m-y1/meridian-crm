---
name: auth-architecture
description: Design authentication and authorization architecture
phase: architecture
priority: high
inputs: [system-design, requirements-specification]
outputs: [auth-architecture-document]
dependencies: [system-design]
next_skills: [security/auth-security, security/threat-modeling]
---

# Auth Architecture

## Workflow

1. **Authentication model** by product type:
   - First-party web app → HTTP-only session cookie (Secure, SameSite=Lax) — preferred default
   - API/mobile/third-party → short-lived access token (JWT, ≤15min) + rotating refresh token (stored server-side, revocable)
   - Machine-to-machine → client credentials / mTLS
   - Passwords: never invent your own scheme — bcrypt/argon2, never plaintext, never reversible; consider delegated auth (OIDC) to avoid owning passwords at all
2. **Authorization model** — pick one, ADR it:
   - RBAC (default — roles: admin/member/viewer)
   - ABAC/policy (complex, fine-grained cross-resource rules)
   - ReBAC (sharing/graph relationships — e.g. document-sharing apps)
   - Enforce at a single chokepoint (middleware/guard), never scattered in handlers. Every request authenticated + authorized before any data access.
3. **Session/token lifecycle**: issuance, refresh, rotation, revocation, expiry, logout everywhere; password reset single-use expiring tokens.
4. **Identity-provider decision**: self-host vs. delegated (Auth0/Cognito/OIDC) — default delegated for non-core identity.
5. Multi-factor, account lockout/throttling, and audit logging of auth events (logins, failures, permission changes).

## Validation Checklist

- [ ] Every protected route has a declared guard
- [ ] Token/cookie lifetimes + rotation + revocation specified
- [ ] AuthZ model chosen + ADR'd, enforcement point singular
- [ ] Auth events auditable

## Handoff

→ `security/auth-security.md` (implementation standards), `security/threat-modeling.md` (threats to this design).
