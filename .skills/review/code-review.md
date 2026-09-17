---
name: code-review
description: Systematic review of code changes with severity-classified findings
phase: review
priority: high
inputs: [diff, task-file]
outputs: [review-findings]
dependencies: [implementation]
next_skills: [merge-decision]
---

# Code Review

## Review Order (by risk, top findings first)

1. **Correctness**: does the diff actually satisfy the task's ACs? Logic errors, edge cases, error paths handled?
2. **Security**: per `security/review-checklist` — input validation, authz on new routes, secrets, injection, data exposure.
3. **Design**: layering respected (`development/backend.md`)? Scope creep (changes outside task's declared files)? Contract drift?
4. **Tests**: ACs covered? Failure paths? Would these tests catch the bug they claim to prevent (real assertions)?
5. **Maintainability**: naming, duplication, dead code, misleading comments, magic values.
6. **Docs**: behavior/contract changes reflected?

## Finding Format (always)

```markdown
### [SEVERITY] <one-line title>

- Location: file:line
- Issue: what + why it matters
- Suggested fix: concrete (code sketch if non-obvious)
```

## Severity Classification

| Level    | Meaning                                  | Action                                                 |
| -------- | ---------------------------------------- | ------------------------------------------------------ |
| CRITICAL | Security hole, data loss, prod-breaking  | Blocks merge. Fix now.                                 |
| HIGH     | Bug or design flaw, will bite soon       | Blocks merge unless explicitly deferred (owner + task) |
| MEDIUM   | Smell/missed convention, future friction | Fix before merge preferred; may be tasked              |
| LOW      | Style/minor                              | Author's discretion                                    |
| INFO     | Observation, no action demanded          | Note only                                              |

## Rules

- **Every diff gets reviewed** — by another agent or human; self-review is a pre-step, never the whole review (except solo emergencies with recorded risk).
- Review the diff, not the author; cite line numbers; propose fixes, not lectures.
- No "LGTM" without the checklist run. Approval statement must say: ACs verified, findings resolved or triaged.
- Reviewer runs the tests themselves if anything looks off (trust evidence, verify claims — per `core/agent-rules.md`).

## Validation Checklist

- [ ] All 6 review dimensions checked
- [ ] Every finding has severity + location + fix
- [ ] Verdict: APPROVE / REQUEST_CHANGES (with blocking findings listed)

## Handoff

→ APPROVE → merge (per `devops/git.md`); REQUEST_CHANGES → back to implementer with findings.
