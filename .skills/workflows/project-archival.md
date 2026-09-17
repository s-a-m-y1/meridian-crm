---
name: workflow-project-archival
description: Decommission/archive a project — export, preserve, sunset cleanly
domain: workflows
phase: core
priority: low
inputs: [archival-decision]
outputs: [archived-project]
dependencies: [maintenance/deprecation, compliance/legal]
next_skills: []
---

# Workflow: Project Archival

When a project reaches end-of-life (superseded/pivoted-away/sunset per `product/product-lifecycle.md` portfolio-view — the decision itself is human-signed per one-way-door rules).

```
1.  Decide + record  → the archival decision + reason + any successor-mapping
                       (core/decision-log.md — someone WILL ask "where did X go" later)
2.  User-sunset      → full maintenance/deprecation.md protocol at product-scale:
                       generous-notice → data-export (users' data is THEIRS per compliance/legal.md
                       portability-duty — export-tooling before shutdown, grace-window for late-extracts)
                       → refund-proration (development/payments.md — outstanding obligations settled
                       BEFORE the billing-provider is disconnected — the order matters)
3.  Data-preservation → retention-classes executed (data/data-retention.md + legal-requirements:
                       financial/audit data retained per compliance/legal.md §1 registry —
                       NOT everything: minimization applies to corpses too); PII purged on schedule
                       (the deletion-contract honored post-mortem per data-governance-quality.md);
                       backups: final-snapshot retained per retention-policy then expired
                       (an eternal-forgotten-backup = a forgotten-PII-store = the classic post-mortem leak)
4.  Infra-sundown   → devops/infrastructure-as-code.md destroy-path (the reproducibility-rule in reverse:
                       clean-teardown, no-orphaned-resources — the cost-audit AFTER destroy confirms
                       zero-residue per devops/backups-scaling-cost.md cost-visibility); secrets-revoked
                       (security/secrets.md — all project-credentials killed, provider-apps removed);
                       third-party-registrations removed (integrations register cleared per
                       development/legal-compliance.md DPA-register — no ghost-subprocessors)
5.  Code-archival   → repo archived-readonly w/ final-README ("this project is archived: why,
                       where's the successor, how-to-read-the-history" per documentation/readme.md
                       newcomer-test applied to historians); .ai/ memory preserved WITH the code
                       (the decisions/tasks/bugs are the project's real-docs per core/memory-management.md);
                       tags/releases left intact (audit-trail per compliance/audit.md)
6.  Domain-surface  → domains/DNS/emails redirected-or-expired DELIBERATELY (an expiring-domain =
                       someone-else's-phishing-platform — renewal-or-expiry is a decision, not an accident);
                       monitoring-stopped AFTER the last integration-check (a monitored-corpse wastes
                       alert-attention per observability/alerting-tracing.md delete-honesty)
7.  Final-report    → archival-record: what-existed, why-sunset, where-things-went (users/data/code),
                       lessons (observability/root-cause-analysis.md format — EOL is a postmortem-worthy
                       event: what did this project teach the org?)
```

Rules: reversibility-honesty (archival ≠ deletion — read-only-preserves optionality; deletion is a separate later-decision with its own retention-clock); everything-expires DELIBERATELY (the last line of defense against zombie-costs-and-PII — per `core/engineering-principles.md` fail-loud, applied to endings).
