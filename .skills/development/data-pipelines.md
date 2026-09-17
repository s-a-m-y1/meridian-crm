---
name: data-pipelines
description: Data engineering — ETL, warehousing, reporting, analytics pipelines
phase: development
priority: low
inputs: [architecture, observability/metrics]
outputs: [data-platform]
dependencies: [architecture/database, observability/monitoring]
next_skills: [business/growth, business/finance]
---

# Data Pipelines & Analytics Platform

## Rules

1. **ELT over ETL**: load raw → transform in warehouse (dbt/SQL). Raw data never mutated; transformations versioned, tested, reviewable.
2. **Single source of truth**: warehouse (Postgres/BigQuery/Snowflake) = the only place dashboards read from. App DB ≠ analytics DB (replication lag acceptable; no cross-DB joins in app).
3. **Data contracts** (schemas with owners): every source table has a schema (columns, types, freshness SLA, owner). Breaking changes = contract violation = alert + block downstream.
4. **Modeling**: staging (raw → clean) → intermediate (business logic) → marts (star schema for BI). dbt recommended — tests (not_null, unique, accepted_values, relationships) run in CI.
5. **Freshness SLAs**: critical tables (revenue, users) ≤ 1h; operational ≤ 15m; batch ≤ 24h. Freshness monitored + alerted (`observability/monitoring.md`).
6. **Governance**: PII columns tagged; access via roles (analyst / engineer / leadership); no raw PII in BI tools; retention per `legal-compliance.md`.

## Architecture

```
Sources (app DB, Stripe, GA, Amplitude, logs)
    → Ingestion (Fivetran / Airbyte / custom CDC)
        → Raw schema (append-only, partitioned by date)
            → dbt staging (clean, typed, tested)
                → Intermediate (business logic, reusable)
                    → Marts (facts + dims, star schema)
                        → BI (Metabase / Looker / Superset)
```

## Workflow

1. **Add source**: ingestion connector + raw schema + freshness SLA + owner
2. **Model**: dbt models (staging → intermediate → mart) + tests + docs (dbt docs)
3. **Review**: dbt compile + test + docs in CI; schema change = PR with downstream impact analysis
4. **Deploy**: dbt run (prod) after CI green; freshness monitors auto-created
5. **Monitor**: freshness alerts, row count anomalies, test failures → paging (`observability/monitoring.md`)

## Validation Checklist

- [ ] Every source has freshness SLA + owner; alerts firing
- [ ] dbt models all test green in CI (not_null, unique, relationships, accepted_values)
- [ ] Data contracts documented; breaking changes block deploy
- [ ] PII tagged; access roles enforced; no PII in BI
- [ ] Dashboards read only from marts (not raw / staging)

## Handoff

→ `business/growth.md` (cohort queries), `business/finance.md` (revenue models), `observability/monitoring.md` (freshness alerts).
