---
name: threat-modeling
description: Identify threats with STRIDE and drive security design
phase: security
priority: high
inputs: [architecture]
outputs: [threat-model, security-requirements]
dependencies: [architecture/system-design]
next_skills: [security-review, security skills]
---

# Threat Modeling (STRIDE)

## Workflow

1. **Model the system**: list components + data flows (use C2 from `architecture/system-design.md`); mark trust boundaries (internet↔LB, LB↔app, app↔DB, app↔third-party).
2. **Enumerate threats per element** with STRIDE:

   | Category                   | Ask                                                                                  |
   | -------------------------- | ------------------------------------------------------------------------------------ |
   | **S**poofing               | Can an attacker pretend to be a user/service? (weak auth, token theft)               |
   | **T**ampering              | Can data in transit/at rest be modified? (unsigned webhooks, no TLS, mutable logs)   |
   | **R**epudiation            | Can actions be denied? (missing audit logs on money/auth events)                     |
   | **I**nformation disclosure | Can data leak? (verbose errors, IDOR, logs with PII, public buckets)                 |
   | **D**enial of service      | Can availability be attacked? (unbounded queries, expensive endpoints, queue floods) |
   | **E**levation of privilege | Can authz be bypassed? (missing object-level checks, privileged defaults)            |

3. **Rate each threat**: likelihood × impact → priority (matrix). Focus on high/high first; Internet-facing trust boundaries get extra scrutiny.
4. **Mitigate**: for each high-priority threat assign a control — map to skills: `auth-security.md`, `input-validation.md`, `xss-csrf.md`, `api-security.md`, `secrets.md`, rate limiting, audit logging, encryption at rest/in transit.
5. **Residual risk**: what we consciously don't mitigate → `.ai/risks/R-<id>.md` with acceptance sign-off.
6. Output feeds: design constraints (arch), security review checklist items (`review/security-review.md`), test cases (`testing/api-testing.md` security probes).

## Refresh Triggers

New trust boundary, new external integration, auth model change, new data class (PII/payments), major architecture change.

## Validation Checklist

- [ ] Every trust boundary crossed by a mitigated threat
- [ ] High-priority threats have named controls mapped to owning skills/tasks
- [ ] Residual risks logged and signed off

## Handoff

→ `security/auth-security.md` + `api-security.md` + `input-validation.md` (implementation); `review/security-review.md` (verification).
