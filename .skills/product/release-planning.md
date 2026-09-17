---
name: release-planning
description: Plan release content, sequencing and readiness — the bridge from roadmap to ship
domain: product
phase: product
priority: medium
inputs: [roadmap, feature-status, feedback-loop]
outputs: [release-plan]
dependencies: [product/roadmap, documentation/changelog]
next_skills: [workflows/release, devops/release-management]
---

# Release Planning

## Position

`product/roadmap.md` = multi-milestone strategy sequencing. THIS = the NEXT release concretely: what's in, what's out, in what order, ready when. Feeds `workflows/release.md` (execution) and `devops/release-management.md` (versioning).

## Workflow

1. **Theme the release** (one sentence: "faster onboarding" / "v1 billing complete") — a release without a theme is a random bag; the theme guides cut decisions
2. **Candidate inventory**: features/specs DONE or DONE-minus-polish + bug clusters + tech-debt items that gate the theme (`documentation/maintenance.md` interest-rated) + dependency/security patches forced in (`security/dependency-security.md` emergency items always ride)
3. **Inclusion tests** (per candidate):
   - Complete enough to ship? (partial features = broken promises — half a checkout ships never; cut or complete per `discovery/scope-management.md`)
   - Measurable? (success metric per `product/feature-specification.md` — unmeasurable = un-verifiable post-ship)
   - Flag-gated? (risky items ship dark + gradual per `development/feature-flags.md` — inclusion ≠ full exposure)
   - Reversible? (one-way doors flagged for human sign-off at release review)
4. **Sequence within the release** (migration-aware per `development/database.md` expand/contract):
   - Expand-migrations ship early (before their consumers), contract-migrations NEVER in the same release
   - Flag-dependent features can land in any order (flags decouple deploy from release per `devops/cd.md`)
5. **Release plan output**:
   ```markdown
   # Release <vX> — theme: <one sentence> — target: <date or train>

   In: [items — each: spec/bug/debt link, flag name, exposure plan]
   Out: [cut items — reason + next-release status recorded, not "someday"]
   Order: [merge/deploy sequence incl. migration order]
   Ready-bar: [gates to pass — `quality-gates/gates.md` 3-7 + regression green]
   Comms: [changelog draft (`documentation/changelog.md`), in-app notes, support heads-up (`maintenance/customer-support.md`)]
   Measure: [each feature's post-ship check — metric + date]
   ```
6. **Freeze + execute** via `workflows/release.md` (the plan is ITS input); post-ship: measure per plan's Measure section (release isn't done at deploy — it's done when the theme's metric moves)

## Rules

- Dates from trains (`devops/release-management.md` cadence) unless a forced item (security) triggers an out-of-band release — planned exceptions, not heroic ones
- Cut-list kept honest: cutting at planning (cheap) beats cutting at freeze (expensive, emotional)
- Support team briefed BEFORE users see anything (surprise-your-support-team releases fail twice)

## Validation Checklist

- [ ] Theme + inclusion tests applied; no partial features
- [ ] Migration order expand/contract-safe; flag exposure plans set
- [ ] Comms + support prep in the plan; measure-by dates set

## Handoff

→ execution: `workflows/release.md`; versioning: `devops/release-management.md`; changelog: `documentation/changelog.md`.
