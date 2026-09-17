---
name: deprecation
description: Deprecate features and APIs with contracts, notices and sunset windows
domain: maintenance
phase: maintenance
priority: high
inputs: [product-lifecycle-decision]
outputs: [deprecation-records]
dependencies: [product/product-lifecycle]
next_skills: [maintenance/data-operations, documentation/changelog]
---

# Deprecation Management

The COMMUNICATION + CONTRACT side of sunsetting (the lifecycle decision: `product/product-lifecycle.md`; the code/data removal ops: `maintenance/data-operations.md`). Deprecation = a promise with a timeline; this skill keeps that promise auditable.

## The Deprecation Record (per deprecated item — `.ai/decisions/` or registry)

```markdown
# DEP-<n>: <feature/API/version deprecated>

- Announced: <date> | Sunset: <date> (window per policy below) | Removal release: <planned version>
- Reason: <why — from lifecycle evidence per `product/product-metrics.md`>
- Migration: <link to migration guide per `documentation/ops-guides.md`>
- Usage tracking: <metric + dashboard — the go/no-go on the sunset date>
- Affected consumers: <internal modules / API consumers / tenants — inventoried>
```

## Windows (standard policy — tightened by contract)

| Surface                    | Notice minimum                                 | Notes                                                                            |
| -------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------- |
| Public API breaking change | 2 minor releases or 90 days (whichever longer) | deprecation HEADERS + docs + notes per `architecture/api.md` versioning          |
| Feature (UI)               | 2 releases                                     | in-product notice for actives per `product/product-lifecycle.md` sunset protocol |
| Internal module            | 1 sprint cycle                                 | team-facing (contract per `agents/protocol.md` broadcast)                        |
| Data/field removal         | after code sunset + retention window           | grace for restore requests per `maintenance/data-operations.md`                  |

- SLA-bound contracts (enterprise) override with THEIR terms (per `compliance/legal.md` — never let a public sunset violate a signed one)

## Mechanics

1. **Announce** (the record +): changelog + release-notes entries (per `documentation/changelog.md` deprecation section), API responses carry deprecation headers + sunset dates (machine-readable per `architecture/api.md`), in-product notices for affected actives (per `marketing/email.md` targeted — never blast)
2. **Instrument the decline**: usage metric on the deprecated surface (per `product/product-metrics.md` — the sunset date's evidence base; usage NOT declining → extend or boost migration comms — never hard-kill a used thing per `product/product-lifecycle.md` mislabel rule)
3. **Migration support**: guide with executable samples (per `documentation/ops-guides.md` migration-guide rules); high-value consumers get direct support (B2B: named-account outreach per `maintenance/customer-support.md` escalation)
4. **Sunset execution**: at date + usage-at-zero → removal via `maintenance/data-operations.md` staging (code removal PR, changelog "Removed", data grace window)
5. **Audit trail**: the deprecation record closed with removal evidence (per `compliance/legal.md` §4 — consumers asking "when did you kill X" get an answerable date + notice-proof)

## Rules

- Never deprecate silently (the changelog-only "deprecation" users never read = contract violation, not deprecation)
- Never sunset early (dates are promises per `core/agent-rules.md` trust discipline — moving a sunset EARLIER = incident-grade comms failure, human sign-off required)
- Sunset dates synced: deprecation registry ↔ changelog ↔ release notes ↔ API headers (single source: the DEP record; everything links per `review/docs-review.md` no-duplication rule)

## Validation Checklist

- [ ] Every deprecation: record + window + migration + usage-metric
- [ ] Announcements multi-channel + machine-readable where API
- [ ] Sunset gated on usage evidence; removal staged per data-ops

## Handoff

→ removal → `maintenance/data-operations.md`; comms → `documentation/changelog.md` + `marketing/email.md`.
