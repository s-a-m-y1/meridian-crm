---
name: implementation-lifecycle-skills
description: Dev-layer execution skills — code-gen, migration, legacy, config, env, graceful degradation
domain: development
phase: development
priority: medium
inputs: [task, architecture]
outputs: [implementation]
dependencies: [development/implementation]
next_skills: [testing/strategy]
---

# Implementation-Lifecycle Skills

Consolidates distinct development activities beyond the core loop (`development/implementation.md` remains the master protocol; everything here EXTENDS it with mode-specific rules).

## 1. Code Generation (agent-built code discipline)

- Generated code = first-class code: passes lint/typecheck/tests identical to hand-written (per Gate 3 — "generated" is not an excuse flag)
- Scaffolds from templates only (consistent structure per `devops/project-init.md` conventions); one-off generation adapted to the codebase's ACTUAL patterns (read neighbors first — per `development/implementation.md` understand step)
- Bulk-generation rule: generate in reviewable units (per file/feature), never 50 files in one un-reviewable commit

## 2. Code Migration & Legacy Code (existing-system changes)

- **Understand-before-touch, doubly**: legacy code carries implicit invariants — mine them via tests FIRST (characterization tests per `development/refactoring.md` — legacy without tests = write tests BEFORE any change; else BLOCKED)
- Archaeology: git blame/log + comments + `.ai/decisions/` — "why is this weird" often has a recorded reason (per `core/context-management.md` memory reads)
- Change shapes: strangler/expand-contract/branch-by-abstraction per `architecture/architecture-migration.md`; NEVER "clean up while we're in here" mixing (per `core/agent-rules.md` scope)
- Deprecation contracts preserved (per `maintenance/deprecation.md` — legacy callers keep working until their sunset)

## 3. Configuration & Environment Management

- Config taxonomy: build-time (in image), deploy-time (env vars per `security/secrets.md`), runtime (feature flags per `development/feature-flags.md`) — each value classified ONCE, no ambiguity
- **12-factor discipline**: config via env, validated at boot, fail-fast on missing (per `development/backend.md` config rules); `.env.example` maintained as the catalog (per `devops/project-init.md`)
- Env parity: dev/staging/prod differ by VALUES only, never shape (parity drift = "works in staging" lies — per `devops/cd.md` single-artifact rule)

## 4. Graceful Degradation (feature-level resilience)

- Dependency-outage design per feature: what still works? (core path vs enrichments — per `architecture/scalability-reliability.md` fallback patterns)
- Degradation USER contract: honest reduced-UI states (per `design/ui.md` error/partial states), never fake success, never silent data loss
- Test the degradation: kill the dependency in staging (per `testing/strategy.md` failure drills) — degradation paths that were never run are wishful thinking

## 5. Scheduled/Cron Jobs (implementation rules)

- Idempotent + distributed-safe (lock or single-runner — two instances double-firing a job = classic incident)
- Observability per job: last-run/success/failure visible (`observability/metrics.md` jobs metrics); missed-run alerting (a cron that silently stops = rot)
- Timezone/DST discipline (UTC internally; schedule semantics documented per `development/i18n-rtl.md` locale formats)

## Handoff

→ all modes feed `testing/strategy.md` mapping; config changes → `documentation/setup.md` env catalog.
