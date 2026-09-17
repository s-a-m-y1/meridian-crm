---
name: hardening
description: Environment hardening checklist — headers, config, deployment surface
phase: security
priority: high
inputs: [deployed-environment]
outputs: [hardening-verification]
dependencies: [api-security, secrets]
next_skills: [security-review, deployment]
---

# Environment Hardening Checklist

Run before staging sign-off (Gate 8 precondition) and on every prod deploy. Itemized, verifiable, evidence-pasted.

## HTTP/Edge

- [ ] HSTS: `Strict-Transport-Security: max-age=31536000; includeSubDomains` (add preload only after cert/infra confidence)
- [ ] TLS: modern ciphers only, no TLS 1.0/1.1; no mixed content (scan)
- [ ] Headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`), `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] CSP on all HTML routes (no `unsafe-inline` — nonces/hashes per `xss-csrf.md`)
- [ ] CORS: explicit origin allowlist; no wildcard with credentials

## Application Config

- [ ] Debug mode OFF in prod (verified by probing a 500 — response contains no stack trace)
- [ ] Default credentials/keys changed (grep for seed/dev values in prod config)
- [ ] Error responses generic (`api-security.md` exposure rules)
- [ ] Request size limits set (body, uploads, arrays, pagination caps)
- [ ] Rate limits active on ALL route classes (probe: burst → expect 429)

## Infrastructure

- [ ] Containers: non-root user, read-only FS where possible, resource limits (`docker.md` runtime rules)
- [ ] DB user: app runtime uses least-privilege account (no superuser, no DDL in prod app role)
- [ ] Network: DB/cache not exposed publicly (only app network); admin panels behind VPN/auth
- [ ] Ports: only required ports open (scan from outside)
- [ ] Backups: encrypted, access-controlled, restore tested (`architecture/database.md` RTO)

## Secrets & Access

- [ ] No secrets in env dumps accessible to untrusted processes; per-service secrets least-privilege
- [ ] SSH/admin keys rotated from defaults; access logged
- [ ] CI/CD: tokens scoped; protected branches on; required reviews enforced

## Verification (evidence, not assertions)

For each section: the probe command + result pasted. "Configured" without a probe = unchecked.

## Handoff

→ results feed Gate 5/8; gaps → fix tasks with owners.
