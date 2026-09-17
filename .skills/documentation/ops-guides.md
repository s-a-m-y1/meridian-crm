---
name: ops-guides
description: Deployment guide, migration guide, release notes, security docs
domain: documentation
phase: documentation
priority: medium
inputs: [deployment, migrations]
outputs: [ops-docs]
dependencies: [devops/deployment, documentation/setup]
next_skills: [review/docs-review]
---

# Ops Documentation

Four ops-facing doc types (runbooks live separately in `documentation/troubleshooting.md` — alert-linked, per `observability/monitoring.md` rules).

## 1. Deployment Guide (the operator's manual)

- Environment map (dev/staging/prod: topology per `.ai/architecture.md`, access, differences-by-VALUES per `devops/ci.md` parity rules)
- Deploy procedures: normal path (`workflows/release.md` steps operationalized: build→promote→canary→watch), emergency path (hotfix per `workflows/hotfix.md`), rollback (one-command, per `devops/deployment.md` readiness — THE most-read section in a bad day)
- Migration coupling: when deploys carry migrations (expand/contract sequencing per `development/database.md` — the operator's checklist of which release does what to the schema)
- Access/permissions: who can deploy where (least-privilege per `security/platform-container-security.md`; break-glass procedure per `observability/incident-response.md`)

## 2. Migration Guide (the consumer-facing version)

- Audience = USERS/CONSUMERS of our breaking changes (API clients, tenants upgrading major versions — per `architecture/api.md` deprecation windows: the guide IS the consumer's path through the window)
- Per breaking change: what changed → why (brief) → how to migrate (before/after code samples — executable per `review/docs-review.md` accuracy rules) → deadline (sunset date)
- Internal data/schema migrations = NOT this doc (they live in `development/database.md` procedures + migration files themselves — this distinction prevents operator/user confusion)

## 3. Release Notes (the consumer-facing change digest)

- Per release: user-visible changes in user language (changelog-derived per `documentation/changelog.md` — the digest of the digest: changelog = exhaustive, notes = curated for the affected audience)
- Structure: New / Improved / Fixed / Breaking (with migration-guide links) / Deprecations (with sunset dates)
- Drafted in the release plan (`product/release-planning.md` comms section), finalized at freeze, published at ship (per `workflows/release.md` step 5)

## 4. Security Documentation (the trust surface)

- `SECURITY.md`: how to report vulnerabilities (security.txt + contact + safe-harbor statement for researchers per `research/security-research.md` disclosure posture — researchers with a clear path report BEFORE exploiting)
- Security practices summary (auth model, encryption-at-rest/in-transit, audit logging per `security/platform-container-security.md` — the "what we do" that enterprise buyers/procurement ask for; DPA/pen-test summary links per `compliance/compliance-review.md` evidence)
- Threat-model refresh history + vuln-handling SLAs (per `security/vulnerability-management.md` published policy — transparency as marketing per `business/gtm.md` positioning)
- What it NEVER contains: implementation details that aid attack (specific versions-of-everything, infra topology beyond necessity — per `security/api-security.md` exposure discipline applied to docs)

## Validation Checklist

- [ ] Deployment guide's rollback section tested during a rehearsal (per `architecture/disaster-recovery.md` drills)
- [ ] Migration guides: samples executable; sunset dates synced with deprecation registries
- [ ] SECURITY.md report-path tested (a researcher could use it cold)
- [ ] Release notes published per release; security doc reviewed per `review/security-review.md`

## Handoff

→ freshness per `documentation/maintenance.md`; accuracy per `review/docs-review.md`.
