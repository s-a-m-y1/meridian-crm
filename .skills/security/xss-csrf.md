---
name: xss-csrf-ssrf
description: Prevent XSS, CSRF and SSRF vulnerability classes
phase: security
priority: high
inputs: [implementation, frontend-architecture]
outputs: [client-side-defenses]
dependencies: [development/frontend]
next_skills: [security-review]
---

# XSS / CSRF / SSRF Prevention

## XSS

1. Framework auto-escaping by default — never `dangerouslySetInnerHTML`/raw HTML injection with user content; where unavoidable (rich text): sanitize (DOMPurify-class) then allowlist tags/attrs.
2. **CSP** on all HTML responses: `default-src 'self'` + explicit allowances; no `unsafe-inline` (use nonces/hashes); inline event handlers forbidden.
3. Never build HTML by string concatenation from any user-influenced value; URL params rendered as text, not markup.
4. JSON APIs: `X-Content-Type-Options: nosniff` (no sniffed-HTML from API responses).
5. Markdown/rich user content: server-sanitize at save time AND client-render through safe pipeline (defense in depth).

## CSRF

1. Cookie-authenticated state-changing endpoints require CSRF tokens (synchronizer or double-submit cookie) OR `SameSite=Lax/Strict` + custom header requirement.
2. Token-auth APIs are CSRF-immune (no ambient cookie) — but only if no cookie fallback exists.
3. Verify on: POST/PUT/PATCH/DELETE with cookies; GET stays side-effect-free (idempotent + safe).
4. Custom request headers (`X-Requested-With`) as an additional speed bump, not the only defense.

## SSRF

1. Server-side requests to **user-supplied URLs** = highest scrutiny: allowlist destination hosts where possible; otherwise validate scheme (http/https only), resolve DNS and reject private/internal ranges (127/8, 10/8, 172.16/12, 169.254/16, ::1, metadata endpoints 169.254.169.254).
2. Re-validate after redirects (attacker's redirect can point inward).
3. Timeouts + size caps on fetched content; no raw proxying of response bodies to the DOM.
4. Webhook URLs, image-import features, "import from URL" — classic SSRF entry points; default-deny.

## Validation Checklist

- [ ] CSP deployed; no unsafe-inline; zero raw-HTML sinks with user content
- [ ] CSRF protection on ALL cookie-based mutations (grep the middleware)
- [ ] All user-URL fetches: scheme allowlist + internal-range denial + redirect re-validation

## Handoff

→ verification cases to `testing/api-testing.md` probes + `review/security-review.md`.
