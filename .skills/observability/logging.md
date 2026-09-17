---
name: logging
description: Structured logging with security discipline
phase: observability
priority: high
inputs: [implementation]
outputs: [logging-standards]
dependencies: []
next_skills: [metrics, monitoring]
---

# Logging

## Rules

1. **Structured logs** (JSON): timestamp (UTC ISO), level, service, request-ID (propagated from request through jobs/queues — trace correlation), message, context fields. Machine-parseable is the point.
2. **Levels, strictly**:
   - `debug`: dev-only detail (never on in prod defaults)
   - `info`: state changes (job started/finished, deploy events, auth events)
   - `warn`: recoverable anomaly (retry succeeded, circuit opened, fallback used) — needs attention eventually
   - `error`: needs action now (failed request, job dead-lettered) — always with context + stack
3. **Security discipline**:
   - NEVER: secrets, tokens, passwords, full PII, raw request bodies in logs
   - Log user IDs not usernames/emails; PII fields truncated/redacted at the logger (structured redaction, not developer memory)
   - Auth events logged: login success/fail, lockouts, permission changes (per `security/auth-security.md`)
4. Errors logged with: what failed, where (code path), correlation IDs, and enough input context to reproduce (sanitized) — "Error occurred" entries are worthless.
5. No log-and-swallow: every logged error gets either handling or an alert expectation; swallowed errors are hidden bugs.
6. Request logs: method, path (route pattern, not raw URL — query params may hold PII), status, duration — one line per request.

## Validation Checklist

- [ ] All logs structured + request-ID correlated
- [ ] Redaction verified (probe: send a fake "password" field → check output)
- [ ] Level discipline grep-checked (no error-as-info patterns)

## Handoff

→ log-based metrics/alerts via `metrics.md`; dashboards via `monitoring.md`.
