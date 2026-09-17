---
name: release-management
description: Versioning, release cuts, change records
phase: devops
priority: medium
inputs: [main-branch, changelog]
outputs: [versioned-release]
dependencies: [cd, testing/regression, documentation/changelog]
next_skills: [workflows/release, documentation/changelog]
---

# Release Management

## Versioning — SemVer

`MAJOR.MINOR.PATCH` — MAJOR: breaking API/contract changes; MINOR: backward-compatible features; PATCH: fixes. Pre-1.0: minor bumps, breaking allowed with changelog note. Tag releases in git (`v1.2.3`); changelog per `documentation/changelog.md` from conventional commits (feat→MINOR, fix→PATCH).

## Release Cut

1. **Feature freeze** on the release scope (new work targets next release)
2. Release-candidate from main; full release regression: pyramid + full E2E + perf smoke + security scan (`workflows/release.md` chain)
3. Changelog reviewed: every user-visible change present; known-issues section honest
4. Release notes = changelog digest + migration notes for breaking changes
5. Tag → build artifact → staged rollout per `devops/deployment.md` (canary → 100%)
6. Post-release: 24-48h heightened monitoring window (`observability/monitoring.md`), then release closes

## Rules

- Release train cadence (weekly/biweekly) beats "when ready" (per `product/roadmap.md` triggers)
- Hotfix path: branch from release tag → fix → patch bump → expedited (but reviewed + tested) release
- Never release with a red gate or unresolved CRITICAL/HIGH security finding (Gate 8)
- Post-1.0: deprecation policy honored (2 releases notice on breaking API changes)

## Validation Checklist

- [ ] Version + tag + changelog consistent
- [ ] Release regression evidence archived with the release
- [ ] Rollback artifact identified before rollout

## Handoff

→ `workflows/release.md` orchestrates; docs updated per `documentation/*`.
