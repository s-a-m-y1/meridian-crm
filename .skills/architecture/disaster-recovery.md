---
name: disaster-recovery
description: DR strategy — RTO/RPO targets, backup design, recovery procedures, drills
domain: architecture
phase: architecture
priority: high
inputs: [nfrs, database-architecture]
outputs: [dr-plan]
dependencies: [architecture/database, observability/monitoring]
next_skills: [devops/backups, workflows/disaster-recovery]
---

# Disaster Recovery (DR)

## Core Concepts (define before anything)

- **RTO** (Recovery Time Objective): how long until service restored after catastrophe
- **RPO** (Recovery Point Objective): how much data loss is acceptable (time-based)
- Set from business NFRs (per `discovery/requirements.md` quantified NFRs) — RTO:RPO implies the architecture: minutes:zero = multi-region sync; hours:hours = backups + restore; days:day = nightly backups, honest trade-off recorded

## The DR Plan (the deliverable)

### 1. Scenario inventory (ranked by likelihood × impact)

| Scenario                  | Likelihood     | RTO target | RPO target | Recovery path                                                                            |
| ------------------------- | -------------- | ---------- | ---------- | ---------------------------------------------------------------------------------------- |
| App-instance failure      | high (routine) | minutes    | 0          | orchestrator restart (not DR — that's ops per `architecture/scalability-reliability.md`) |
| Zone failure              | low            | per NFR    | per NFR    | multi-AZ failover                                                                        |
| Region failure            | very low       | per NFR    | per NFR    | region failover / rebuild                                                                |
| Data corruption (logical) | medium         | varies     | last-clean | PITR to pre-corruption timestamp                                                         |
| Bad migration/deploy      | medium         | minutes    | 0          | rollback per `devops/deployment.md` + restore path                                       |
| Credential/provider exit  | low            | days       | 0          | exit plan per `research/api-research.md`                                                 |
| Ransomware/malicious      | low            | days       | last-clean | isolated backups (immutable/air-gapped tier)                                             |

### 2. Backup design (per `devops/backups-scaling-cost.md` implementation)

- Automated schedule meeting RPO; encryption at rest; access least-privilege
- **Immutability tier** (ransomware protection): backups a compromised system can't delete (object-lock/air-gap)
- Geographic separation (backup region ≠ primary region)
- **Tested restore = the only real backup**: monthly restore drill (staged environment, timed, recorded) — per RTO measurement; untested = doesn't exist (per `architecture/database.md` rule)

### 3. Failover design (when multi-region/high-RTO)

- Data replication strategy (sync vs async — trade-off: async = RPO>0 but no write-latency tax; ADR'd)
- DNS/load-balancer switch (single-pane failover tooling; runbook steps per `documentation/troubleshooting.md`)
- Split-brain prevention (fencing — the old region must not serve after failover)

### 4. Runbooks (per `documentation/troubleshooting.md`)

Per scenario: detection (what alerts), decision (who declares + criteria), steps (numbered, commands, expected outputs), validation (what "recovered" proves), comms (per `observability/incident-response.md` cadence). A DR runbook never executed is fiction — drills prove them.

### 5. Drills (the muscle memory)

- Monthly: restore-from-backup (timed vs RTO — actual RTO measured, not the docs' wish)
- Quarterly: failover drill (staging first; production game-days when mature per `observability/monitoring.md` verify rules)
- Findings from drills → DR plan fixes (per `observability/root-cause-analysis.md` action-item discipline — a drill finding is a pre-incident finding: treat as a gift)

## Validation Checklist

- [ ] RTO/RPO set from NFRs; scenario inventory complete
- [ ] Backups immutable-tiered, geo-separated, monthly-restore-tested (timed, recorded)
- [ ] Runbooks per scenario; drills scheduled with findings-loop

## Handoff

→ implementation `devops/backups-scaling-cost.md`; execution `workflows/disaster-recovery.md`; incident merge `observability/incident-response.md`.
