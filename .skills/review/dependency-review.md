---
name: dependency-review
description: Review dependency changes in a diff for risk and duplication
phase: review
priority: medium
inputs: [lockfile-diff]
outputs: [dependency-verdict]
dependencies: [development/dependency-management, security/dependency-security]
next_skills: [code-review-merge]
---

# Dependency Review

## Checklist (any PR touching lockfile/manifest)

1. **Justified**: which task required this? None → reject (drive-by dependency).
2. **Evaluated** (per `development/dependency-management.md`): maintenance status, license, size, transitive surface — evaluation recorded for majors?
3. **Audited**: security scan clean (`security/dependency-security.md`)? New transitive deps carrying known CVEs?
4. **Not duplicated**: capability already present (second date lib, second state lib)? Reject duplicates.
5. **Pinned sane**: version range not wildly open for majors; lockfile committed and manager-generated (no hand-edits).
6. **Breaking assessment**: major bump → migration notes read + API changes grep'd in our usage + contract tests run.

## Verdict

- APPROVE (justified, evaluated, audited, unique) / REQUEST_CHANGES with the failed check.
- Security-relevant finding → escalate via `security/dependency-security.md` severity.

## Handoff

→ merge decision with `code-review.md` verdict.
