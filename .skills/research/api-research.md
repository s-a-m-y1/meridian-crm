---
name: api-research
description: Evaluate external APIs and services before integrating
domain: research
phase: research
priority: medium
inputs: [integration-need]
outputs: [api-evaluation]
dependencies: [research/technical-research, security/threat-modeling]
next_skills: [integrations/third-party-api, architecture/adr]
---

# External API Research

Extends `research/technical-research.md` for "should we integrate with external API X" decisions (for the HOW, see `integrations/third-party-api.md`).

## Evaluation Criteria (scorecard 1-5, weights pre-declared)

| Criterion             | Checks                                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Capability fit        | covers OUR actual use cases (against 3 concrete scenarios we need), edge cases + limits (rate, pagination, payload caps)              |
| Reliability           | status page history (uptime + incident patterns), SLA offered, error-rate reputation — search outage reports                          |
| Documentation         | API reference quality + runnable examples + sandbox access; docs lie = integration hell                                               |
| Auth & security model | OAuth2 vs API keys, scopes, IP allowlists, webhook signing, SOC2/ISO posture — feeds `security/threat-modeling.md` new-boundary check |
| Rate limits & quotas  | documented limits vs OUR projected volume (peak × 3 headroom); burst behavior; overage billing surprises                              |
| Pricing model         | per-call/tiered/hybrid — cost at OUR volume (model it); free-tier cliffs; egress fees                                                 |
| Vendor lock-in        | data export (can we LEAVE with our data?), standard formats, proprietary features dependency                                          |
| Support & community   | response SLAs, changelog discipline, deprecation policy (version sunset windows)                                                      |

## Workflow

1. **Concrete scenarios first**: list 3-5 real calls we'd make (from requirements) — evaluate against THOSE, not the API's marketing demo
2. **Sandbox spike** (`research/proof-of-concept.md`): implement the 2 hardest scenarios in sandbox — auth flow pain, error semantics, latency from our region (docs vs reality gap discovered here)
3. **Failure-path research**: how does it behave when WE misbehave (bad tokens, over-quota)? Retry-after handling? Idempotency support for our side-effects?
4. **Score + trade-offs** per scorecard; vendor lock-in + deprecation history get extra weight for core-path integrations (payment/auth = one-way doors)
5. **Decide + record** (ADR for core-path; D-record for utility integrations); include the exit plan: what it takes to swap vendors later (the answer belongs IN the ADR)

## Rules

- Two-vendor minimum comparison (per `research/framework-library-evaluation.md` rule)
- Test the failure paths, not the happy path (integrations die on error handling, not happy flows)
- Regional latency checked from OUR infrastructure location

## Validation Checklist

- [ ] 3+ real scenarios tested in sandbox (not just "API works")
- [ ] Rate limits ×3 headroom math vs our volume
- [ ] Exit plan (data export + swap cost) written into the ADR
- [ ] Webhook signing + auth model security-reviewed

## Handoff

→ decision → ADR; implementation → `integrations/third-party-api.md` adapter standards.
