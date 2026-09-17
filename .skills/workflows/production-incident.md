---
name: workflow-production-incident
description: Chain from production alert through postmortem and hardening
phase: workflow
priority: high
inputs: [production-alert]
outputs: [mitigated-incident, postmortem, preventive-actions]
dependencies:
  [
    observability/incident-response,
    observability/root-cause-analysis,
    development/bug-fix,
  ]
next_skills: [workflow-release]
---

# Workflow: Production Incident

```
1.  Detect & declare → observability/monitoring.md alert → severity + IC assigned
                       (SEV1: immediate, all hands, 30-min comms cadence)
2.  Mitigate         → rollback is DEFAULT (deployment.md) → flag-off → scale → failover
                       Mitigate FIRST, understand SECOND (IC decides; scribe logs timeline)
3.  Verify           → metrics window green + smoke, not "looks fine"
4.  Communicate     → stakeholder updates at cadence; stand-down notice with impact summary
5.  RCA             → observability/root-cause-analysis.md (5-whys to SYSTEMIC cause)
                       mandatory for SEV1/2 within 48h
6.  Fix             → development/bug-fix.md (root cause; regression test fails-before/passes-after)
7.  Prevent         → action items → real tasks (owner+date): monitoring gaps, checklist/standard
                       updates, blast-radius greps
8.  Close           → postmortem published; changelog "Fixed" entry; SEV1 → blameless review
```

## Special Cases

- **Security incident**: preserve evidence before destructive mitigation (when possible); rotate exposed secrets immediately (`security/secrets.md` incident path); notify humans at once — no agent handles disclosure alone.
- **Data loss**: backup restore per `architecture/database.md` RTO procedure (tested restore or it's not real); assess exposure scope honestly.
- **Partial degradation (SEV3/4)**: mitigate-then-diagnose order may flip — but RCA discipline unchanged.

## Rules

1. The timeline is sacred — scribe timestamps everything from declaration (it becomes the postmortem's raw material).
2. Action items without owners+dates are wishes (per RCA rules) — the incident isn't closed with them open.
3. "Check for same latent bug in siblings" from RCA step 5 is mandatory — incidents repeat in neighbors.

## Completion

Service healthy (verified), postmortem published, fixes merged+tested+deployed, preventive tasks scheduled, stakeholders informed end-to-end.
