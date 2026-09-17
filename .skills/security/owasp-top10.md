---
name: owasp-top10
description: Audit a system against the OWASP Top 10 with concrete per-item checks
phase: security
priority: high
inputs: [codebase, architecture]
outputs: [owasp-audit-report]
dependencies: [security-review, threat-modeling]
next_skills: [quality-gates]
---

# OWASP Top 10 Audit (2021)

Run as a focused audit (gate for Gate 5) or on demand. Each item: what to check, where, and the pass bar. Findings use `review/code-review.md` severity format.

## A01 — Broken Access Control

- Check: every route touching an entity by ID verifies ownership (IDOR probes per `testing/api-testing.md`); deny-by-default guards; role matrix tested; no privilege assumptions in handlers.
- Pass: can/cannot matrix green for every role; IDOR probes return 404/403, never data.

## A02 — Cryptographic Failures

- Check: TLS everywhere (no http:// endpoints, HSTS on); passwords hashed (bcrypt/argon2 — never MD5/SHA1/fast-hash); tokens signed with strong alg (no `alg:none`, no weak secrets); PII encrypted at rest where required; secrets not in code/logs.
- Pass: grep shows zero weak hashes; key management via manager/env only.

## A03 — Injection

- Check: 100% parameterized queries/commands (grep for string-built SQL/exec); template/render contexts escaped; ORM filters not built from client objects.
- Pass: zero concat-built queries; injection probes (SQLi strings, NoSQL operators) all rejected 4xx.

## A04 — Insecure Design

- Check: threat model exists and current (`threat-modeling.md`); trust boundaries documented; risky flows have defense-in-depth (rate limit + validation + authz, not just one).
- Pass: no single-point-of-failure security control on money/auth paths.

## A05 — Security Misconfiguration

- Check: debug/stack traces off in prod; default credentials changed; CORS explicit; security headers on (`hardening.md` checklist); unused endpoints/features disabled; error messages generic.
- Pass: `hardening.md` checklist fully green in the deployed env.

## A06 — Vulnerable Components

- Check: dependency audit clean (`dependency-security.md`); base images pinned + scanned; no known-CVE components reachable.
- Pass: zero untriaged CRITICAL/HIGH CVEs in reachable paths.

## A07 — Auth Failures

- Check: `auth-security.md` rules — session rotation, token validation (sig+exp+iss+aud), lockout/rate limits, MFA where warranted, reset single-use/expiring, generic enumeration-proof responses.
- Pass: auth flows E2E-tested including failure branches.

## A08 — Data Integrity Failures

- Check: webhooks signature-verified before parsing; CI/CD pipeline protected (no unreviewed auto-merge, pinned actions); deserialization of untrusted data avoided/sandboxed; auto-update channels signed.
- Pass: no unsigned external input executed/trusted.

## A09 — Logging & Monitoring Failures

- Check: auth events audited; alerts actionable with runbooks (`observability/monitoring.md`); logs don't contain secrets/PII; incident detection tested (an alert fired on purpose once).
- Pass: a deliberately-triggered alert reached a responder in a drill.

## A10 — SSRF

- Check: all user-URL fetches: scheme allowlist + private-range denial + redirect re-validation (`xss-csrf.md` SSRF section).
- Pass: internal-metadata probes blocked.

## Output — Audit Report

```markdown
# OWASP Top 10 Audit — <date> <scope>

| Item | Status (PASS/GAP/FINDING) | Evidence | Findings (severity refs) |
Verdict: PASS (Gate 5) | FAIL (blocking items + fix tasks)
```

## Handoff

→ findings to `security/*` fix skills; verdict to `quality-gates/gates.md` Gate 5.
