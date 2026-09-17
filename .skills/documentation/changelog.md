---
name: changelog
description: Maintain a Keep-a-Changelog-style record of user-visible changes
phase: documentation
priority: high
inputs: [commits, releases]
outputs: [changelog]
dependencies: [devops/release-management]
next_skills: [release]
---

# Changelog

## Format (Keep a Changelog)

```markdown
# Changelog

## [Unreleased]

### Added / Changed / Fixed / Removed / Security / Deprecated

- <change — user-visible framing, PR/task ref>

## [1.4.0] — 2026-09-14

...
```

## Rules

1. **User-visible changes only** — a refactor with zero behavior change doesn't belong (it's in git history); internal-only work noted only when it affects operators (config format, log format, deploy procedure).
2. Written in the PR, not retroactively — each PR adds its line to `[Unreleased]` (PR review enforces presence per `review/code-review.md` docs check).
3. `Security` section mandatory for vulnerability fixes (no exploit details — "patched authentication bypass in X" level).
4. Breaking changes: flagged prominently with migration notes (per `architecture/api.md` versioning policy).
5. On release cut: `[Unreleased]` becomes `[version] — date`; links to diffs between versions.
6. Entries never edited after release (post-1.0 history is immutable — corrections go in the next release).

## Validation Checklist

- [ ] Every merged PR with user-visible change has an entry (gate check)
- [ ] Version headers match git tags exactly
- [ ] Security fixes present without exploit details

## Handoff

→ `release-management.md` uses it for release notes.
