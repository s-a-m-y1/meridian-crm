---
name: dependency-management
description: Evaluate, install and update dependencies safely
phase: development
priority: high
inputs: [dependency-request]
outputs: [evaluated-dependency, lockfile-change]
dependencies: [security/dependency-security]
next_skills: [review/dependency-review]
---

# Dependency Management

## Adding a Dependency (gate before install)

Evaluate and record (in the task/ADR for majors):

| Question               | Rule                                                                   |
| ---------------------- | ---------------------------------------------------------------------- |
| License                | Permissive (MIT/Apache/BSD)? Copyleft = legal check before use         |
| Maintenance            | Recent releases? Issues answered? Deprecated?                          |
| Size + transitive deps | What does it drag in? (supply-chain surface)                           |
| Necessity              | Is it ~50 lines we could own? Prefer the boring, small, popular option |
| Overlap                | Do we already have one that does this? (two date libs = no)            |
| Security               | Audit result clean (`security/dependency-security.md`)                 |

Fail on: unmaintained, license risk, unexplained transitive weight, or duplicate capability. Never add deps casually in a feature task — they get evaluated on their own merits.

## Updating Dependencies

1. Categorize: patch (safe, auto) / minor (likely-safe, run tests) / major (breaking — task with changelog review + migration work).
2. Update cadence: routine batch updates on a schedule (task per batch), not ad hoc inside feature work.
3. Process per update: read release notes/breaking changes → update → full test suite + build → contract tests for majors → evidence pasted.
4. Security patches bypass cadence: apply immediately via `security/dependency-security.md` emergency path.
5. Lockfile committed, single-threaded (per `core/multi-agent.md`); installed via the package manager, never manual edits to lockfiles.

## Validation Checklist

- [ ] Evaluation recorded (or "trivial/patch" justified)
- [ ] No duplicate capability introduced
- [ ] Lockfile via package manager only
- [ ] Full suite green post-update

## Handoff

→ `review/dependency-review.md` in any PR touching the lockfile.
