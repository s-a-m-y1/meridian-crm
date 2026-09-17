---
name: security-review
description: OWASP-based security review of changes and systems
phase: review
priority: high
inputs: [diff, auth-design, threat-model]
outputs: [security-findings, verdict]
dependencies: [security/threat-modeling, security skills]
next_skills: [quality-gates]
---

# Security Review

## Checklist (OWASP-aligned, diff-focused)

1. **Injection**: all queries parameterized/ORM? No string-built SQL/commands/shell? Template injection? (grep for concat near query/exec)
2. **Broken auth**: new routes guarded? Token checks complete (signature, expiry, audience)? Session fixation on login? Logout invalidates server-side?
3. **Broken access control**: object-level authz on every ID-bearing route (IDOR — fetch someone else's record by changing the ID)? Role checks at the guard, not scattered? Admin endpoints isolated?
4. **Input/output**: schema validation on all inputs (sizes, types, enums)? Output encodes correctly (no reflected user input unescaped)? No internal fields/stack traces in errors?
5. **Secrets**: none in code/config/logs/diff (grep the diff for key patterns!). `.env` gitignored? Secrets via manager/env only?
6. **CSRF/SSRF/XSS**: state-changing endpoints CSRF-protected (or token-auth which is CSRF-immune)? User-supplied URLs → allowlist/deny-internal-IPs (SSRF)? Rendering user HTML/markdown → sanitize?
7. **Deps & config**: new deps audited (`security/dependency-security.md`)? Security headers on (CSP, HSTS, X-Content-Type-Options)? Cookies HttpOnly+Secure+SameSite? Uploads (if any): type/size validated, stored untrusted, served with forced content-type from separate origin?
8. **Logging**: auth events logged; no PII/secrets in logs; failures logged with enough context to detect (but not leak).

## Verdict Model

- **PASS**: no CRITICAL/HIGH open; MEDIUMs tasked
- **NEEDS_REVIEW → FAIL** for any CRITICAL/HIGH — blocks merge/release (Gate 5)

For a full-system audit (not just a diff), run `security/owasp-top10.md` first, then this review on the findings. Pre-prod deploys additionally require `security/hardening.md` checklist green (Gate 8 precondition).

Finding format + severity per `review/code-review.md`. Security findings are never LOW-triaged away by default — exploitability gets argued, not assumed.

## Handoff

→ findings to implementer (fixes via `security/*` skills); verdict to `quality-gates/gates.md` Gate 5.
