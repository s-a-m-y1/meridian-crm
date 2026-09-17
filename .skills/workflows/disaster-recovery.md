---
name: workflow-disaster-recovery
description: Execute disaster recovery — failover, restore, rebuild per the DR plan
domain: workflows
phase: devops
priority: high
inputs: [disaster-scenario]
outputs: [recovered-system, dr-report]
dependencies: [architecture/disaster-recovery, observability/incident-response]
next_skills: [observability/root-cause-analysis]
---

# Workflow: Disaster Recovery (Execution)

Runs UNDER `observability/incident-response.md` command structure (a DR event = an incident; IC owns decisions). THIS = the technical-execution sequence per scenario.

```
1.  Declare         → scenario-matched (architecture/disaster-recovery.md scenario-inventory) + IC assigned
                      + timeline-started (incident-response.md discipline — applies fully)
2.  Communicate      → status-page + stakeholders at SEV1-cadence (monitoring-modes.md status-page +
                      incident-response.md comms) — during-DR comms ≥ normal-incidents (users notice)
3.  Execute-runbook → the scenario's DR-runbook (architecture/disaster-recovery.md §4): numbered steps,
                      commands, expected-outputs (runbooks were DRILLED — execution follows them, not
                      improvisation; deviation logged for post-drill-review per its §5)
   ├─ Zone/region-failover: DNS/LB-switch → fenced-old-region (split-brain-per its §3) → service-verify
   ├─ Data-corruption:      PITR to pre-corruption-timestamp (development/database.md restore-path) →
   │                        data-loss-audit (what-window lost — quantified for comms) → app-verify
   ├─ Bad-migration/deploy: rollback-first (workflows/hotfix.md / devops/deployment.md auto-rollback)
   └─ Ransomware:           isolate + immutable-backup-restore (architecture/disaster-recovery.md §2
                            immutability-tier — the tier that exists FOR this) + security-liaison engaged
                            (compliance/legal.md §5 legal-clock if data-exposure)
4.  Verify          → /readyz green + smoke-suite + business-metric-sanity (a few orders processed?
                      monitoring.md golden-signal + product/product-metrics.md business-check)
                      + DATA-verification (row-counts/samples per data/data-governance-quality.md —
                      "service up" ≠ "data right")
5.  Stand-down       → comms-all-clear + timeline-frozen (the RCA's raw-material per incident-response.md §6)
6.  Post-incident    → RCA mandatory (SEV1/2): why + why-DR-not-faster + DR-plan-finding (what the event
                      taught the PLAN — a DR-execution always finds runbook-gaps per disaster-recovery.md
                      drill-findings-loop) → fixes tasked at incident-priority (maintenance-operations.md §5)
7.  DR-metrics       → actual-RTO/RPO vs targets (recorded — the drill-accuracy data;
                      big-miss = architecture-review of the DR-plan itself)
```

Rules: rehearsed-paths-only for the first hour (improvisation = the DR-failure-mode; the plan allows judgement AFTER service-restored); data-loss honesty quantified before comms (per `core/communication.md` precise-numbers rule); immutable-backups touched = forensics-preservation considered (ransomware-case evidence per `security/security-testing.md`).
