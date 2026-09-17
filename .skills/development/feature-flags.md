---
name: feature-flags
description: Feature flag infrastructure — rollout, targeting, experimentation, kill-switch
phase: development
priority: medium
inputs: [architecture, gtm]
outputs: [flag-service]
dependencies: [architecture/api, observability/metrics]
next_skills: [business/growth, marketing/paid]
---

# Feature Flags & Experimentation Infrastructure

## Rules

1. **Flags are not config** — they're code paths with lifecycle (create → rollout → cleanup). Every flag has: owner, purpose, targeting rules, rollout plan, expiration date, cleanup task.
2. **Types of flags**:
   - Release (trunk-based deploy): short-lived, 100% rollout → remove
   - Experiment (A/B): targeting + metrics + pre-declared bars → decision → remove
   - Kill-switch (ops): instant off for problematic features; long-lived, audited
   - Permission (entitlement): tier-based access (pricing.md); long-lived, managed
3. **Rollout protocol** (for release/experiment):
   - Internal (team) → 5% canary → 25% → 50% → 100% — each step: metrics window (error rate, latency, business metric) green → next
   - Kill criteria pre-declared (error rate > X, latency p95 > Y, business metric drop > Z%)
4. **Targeting rules** (expressions evaluated server-side):
   - User attributes (tier, country, cohort, custom)
   - Percentage rollout (consistent hashing on user_id)
   - Segment lists (beta users, early-access)
   - Never client-side only (bypassable)
5. **Client SDK**: evaluates locally with server-synced rules; fallback to server eval for critical paths; cache with short TTL; graceful degradation (flag off = default behavior).
6. **Audit & cleanup**:
   - Every flag change audited (who, when, why, before/after)
   - Expired flags: automated PR to remove code + flag (CI fails if flag code exists past expiry)
   - Quarterly flag audit: remove unused, consolidate overlapping

## Implementation Checklist

- [ ] Flag service API: evaluate(user, flag) → boolean/variant; sync rules; audit log
- [ ] Client SDK (JS/React, mobile, backend) with local eval + server fallback
- [ ] Admin UI: create flag, targeting rules, rollout steps, metrics view, kill switch
- [ ] Integration points: CI (flag check in deploy), monitoring (flag state alerts), analytics (flag variant in events)
- [ ] Cleanup job: flags past expiry → automated removal PR

## Validation Checklist

- [ ] Every flag has: owner, purpose, type, expiry, rollout plan
- [ ] Kill-switch tested in staging (flip → verify off)
- [ ] Client SDK gracefully degrades (flag service down → default)
- [ ] Expired flags auto-PR'd for removal

## Handoff

→ `business/growth.md` (experiment loops), `marketing/paid.md` (rollout coordination), `observability/monitoring.md` (flag state alerts).
