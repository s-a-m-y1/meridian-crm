---
name: incident-response
description: Respond to production incidents with a command structure
phase: maintenance
priority: high
inputs: [alert, monitoring]
outputs: [mitigated-incident]
dependencies: [monitoring]
next_skills: [root-cause-analysis]
---

# Incident Response

## Severity Levels

| Sev  | Definition                                | Response                                   |
| ---- | ----------------------------------------- | ------------------------------------------ |
| SEV1 | Prod down / data loss / security breach   | Immediate, all hands, comms cadence 30 min |
| SEV2 | Major feature broken / severe degradation | Fast (hour), focused team                  |
| SEV3 | Minor degradation, workaround exists      | Same day                                   |
| SEV4 | Cosmetic/minor                            | Scheduled                                  |

## Workflow

```
1. Detect (alert per monitoring.md)
2. Declare (sev + assign Incident Commander + Scribe — one IC, not a committee)
3. Communicate (stakeholders informed: status + ETA expectations; cadence per sev)
4. Mitigate: FIRST make it stop hurting, THEN understand
   - rollback is default per deployment.md (deploy change? → roll back first, debug after)
   - feature flag off / scale / failover as applicable
5. Verify mitigation (metrics window green, not "looks fine")
6. Stand down + RCA commitment (SEV1/2 mandatory: root-cause-analysis.md within 48h)
```

## Rules

1. **IC owns decisions**; investigators report to IC; scribe timestamps every action/finding (the timeline is the RCA's raw material).
2. Mitigate > diagnose during fire (per workflow step 4) — a fast rollback beats a perfect explanation of an ongoing outage.
3. Every action logged with time (timeline table: time — action — actor — observation).
4. Data-loss/security incidents: preserve evidence (logs, snapshots) BEFORE mitigation that destroys it, when possible without extending the outage; security breach → `security/secrets.md` incident path + human notification immediately.
5. SEV1s get a postmortem per `root-cause-analysis.md` — blameless, focused on system + process fixes, with owners and dates.

## Validation Checklist

- [ ] Sev declared + IC named + timeline running
- [ ] Mitigation verified by metrics (not vibes)
- [ ] Stakeholders updated at cadence; RCA scheduled (SEV1/2)

## Handoff

→ `root-cause-analysis.md` (postmortem), fixes via `development/bug-fix.md`/`workflows/production-incident.md`.
