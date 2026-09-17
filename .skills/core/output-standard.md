---
name: output-standard
description: Mandatory structured result format for every skill execution
phase: core
priority: critical
inputs: [completed-work]
outputs: [result-document]
dependencies: []
next_skills: [communication]
---

# Output Standard

Every skill execution ends with exactly this structure (all sections mandatory; use "None" when empty):

```markdown
# Result

## Status

PASS | FAIL | BLOCKED | NEEDS_REVIEW

## Summary

<1-3 sentences: what was done and why>

## Work Completed

- <verb + artifact>

## Files Changed

- <path> — created | modified | deleted (<+n/−m lines>)

## Tests

- <command> — exit <code> — <pass/fail summary>
  (or "Not run — <justification>" — NEVER claim pass without a run)

## Risks

- <risk — likelihood — mitigation>

## Issues

- <blocker/bug — needs action by whom>

## Next Steps

- <concrete, ordered actions>

## Handoff

→ Skill: <next skill path> | Needs: <inputs this result provides> | Status: <ready/waiting>
```

## Status Semantics

| Status       | When                                                                           |
| ------------ | ------------------------------------------------------------------------------ |
| PASS         | All validation checks green, criteria met                                      |
| FAIL         | Validation failed — do not hand off until fixed                                |
| BLOCKED      | External dependency/decision missing — stated who unblocks                     |
| NEEDS_REVIEW | Correct but requires human/agent review before merge (e.g. security-sensitive) |

## Self-Validation Checklist (run before emitting)

- [ ] Every claim backed by evidence (command output, file, link)?
- [ ] Tests section truthful — commands actually executed?
- [ ] Files Changed exactly matches `git status`/scope?
- [ ] Risks honestly assessed (not "None" reflexively)?
- [ ] Next Steps actionable by the next executor without asking what to do?
- [ ] Handoff names a real skill and its inputs?
- [ ] `.ai/project-state.md` updated?
