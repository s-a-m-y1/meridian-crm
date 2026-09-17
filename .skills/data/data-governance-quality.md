---
name: data-governance-quality
description: Data modeling, quality, validation, governance, lineage, retention, privacy, ETL
domain: data
phase: data
priority: high
inputs: [database-architecture, compliance-requirements]
outputs: [data-platform-rules]
dependencies: [architecture/database, development/data-pipelines]
next_skills: [data/data-operations, compliance/legal]
---

# Data Domain — Governance, Quality, Lineage, Retention, Privacy

The data-domain skill consolidating the governance-layer capabilities (engineering/warehouse mechanics: `development/data-pipelines.md` ELT/dbt; operational cleanup: `maintenance/data-operations.md`).

## 1. Data Modeling (beyond the app schema — the analytical + domain layer)

- Conceptual → logical → physical per layer of need; the WAREHOUSE models star-schema facts/dims (per `development/data-pipelines.md` marts) — app-schema (3NF per `development/database.md`) ≠ analytics-schema (denormalized for reads): the boundary is the pipeline, never-crossed directly (per its no-cross-DB rule)
- Domain events as first-class data (per `architecture/event-driven.md` contracts — the fact-table seeds); late-arriving data rules declared (upsert windows per `data-quality` freshness)

## 2. Data Quality (the tests-data-passes — pipeline-side, extending `development/data-pipelines.md` dbt tests)

- Standard checks per table: not-null/unique/relationships/accepted-values (its baseline) + business-assertions (e.g. revenue ≥ 0, event-consistency invariants) + anomaly-detection (row-count ± X% vs trailing-window — catches upstream breaks per `observability/alerting-tracing.md` predictive doctrine)
- Quality SLAs per dataset: freshness (per pipeline SLAs), completeness (% expected rows), correctness (sampled audits on critical marts — financial figures get reconciliation checks: warehouse-revenue vs billing-system, variance < threshold per `development/payments.md` audit trail discipline)
- Failure handling: quality-gate failures block downstream marts (bad data propagating to dashboards = decision-poisoning — fail-closed per `quality-gates/gates.md` philosophy, applied to data)

## 3. Data Governance (who owns what, who may see what)

- **Ownership registry**: every dataset → owning team + steward + purpose (per pipeline contracts in `development/data-pipelines.md` — governance extends them with PEOPLE, not just schemas)
- **Classification mandatory** (per `security/threat-modeling.md` data-classes): public / internal / PII / sensitive-PII / financial — classification drives every downstream control (retention, access, encryption, deletion duties per `compliance/legal.md`)
- **Access control**: role-scoped (analyst/engineer/leadership per `development/data-pipelines.md` BI rules); PII columns masked/restricted by default (no raw-PII in BI per its governance rules; purpose-limited access grants with expiry)
- **Immutability where required** (financial/audit data): append-only + WORM (per `security/platform-container-security.md` audit-log integrity — generalized to data stores)

## 4. Data Lineage (the "where did this number come from" answer)

- Lineage recorded: source-table → transformation-model → mart → dashboard (dbt docs auto-generate the pipeline layer; dashboard-registry links the last mile)
- Change impact: lineage queries answer "what breaks if we change X" (schema-change PRs consult lineage per `development/data-pipelines.md` downstream-impact rule — the dependency-graph made executable)
- Lineage + classification together: PII column flows → every destination it touches inherits the classification (privacy-controls propagate by map, not hope)

## 5. Data Retention & Privacy (execution mapped from compliance — `compliance/legal.md` + `data-retention` duties)

- Retention schedule per classification (per `development/legal-compliance.md` schedule — the DATA-domain mechanics: partitioning by date enables enforcement; purge jobs per `maintenance/data-operations.md` sweeps)
- **The deletion contract** (GDPR-grade): user-erasure cascades via lineage-map (delete/anonymize across sources + warehouse + backups-policy [documented-backup-exemption per `compliance/legal.md`] + third-parties per DPA register per `development/legal-compliance.md`) — erasure requests tested end-to-end (a deletion-path never executed = a promise never kept)
- Data minimization at INGEST (collect-what's-needed per `development/legal-compliance.md` privacy-by-default — the cheapest deletion is the row never born)

## Validation Checklist

- [ ] Every dataset: owner + classification + quality-SLAs; quality gates block downstream
- [ ] Lineage executable (impact answered by query); classification propagates via map
- [ ] Retention enforced by partition-purge; erasure tested end-to-end

## Handoff

→ privacy duties → `compliance/legal.md`; ops → `maintenance/data-operations.md`; pipeline mechanics → `development/data-pipelines.md`.
