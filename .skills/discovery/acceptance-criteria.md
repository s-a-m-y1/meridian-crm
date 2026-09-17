---
name: acceptance-criteria
description: Write unambiguous, testable Given/When/Then acceptance criteria
phase: discovery
priority: high
inputs: [story-backlog]
outputs: [testable-acceptance-criteria]
dependencies: [user-stories]
next_skills: [testing/strategy, task-standard]
---

# Acceptance Criteria

## Format

Every story's criteria are written as testable Given/When/Then:

```
AC-1: Given an unauthenticated visitor on the login page,
      When they submit valid credentials,
      Then they are redirected to the dashboard within 2 seconds,
      And a session cookie is set (HttpOnly, Secure, SameSite=Lax).
```

## Rules

1. **Observable outcome only** — "then" must be verifiable by test or inspection, never "it works".
2. **Numbers wherever possible** — timeouts, counts, statuses, redirects.
3. **Negative paths required** — every happy path gets its failure twins (wrong password, expired link, concurrent request, empty input).
4. **Edge cases enumerated** — boundaries: empty, max, unicode, concurrent, timeout, retry.
5. Each AC gets an ID — test suites and tasks cite these IDs (traceability: FR → story → AC → test → task).

## Validation Checklist

- [ ] Every story has ≥2 ACs (happy + at least one failure path)
- [ ] Every AC executable as a test without human interpretation
- [ ] IDs unique and referenced in the story

## Handoff

→ `testing/strategy.md` maps ACs to test levels; `core/task-standard.md` tasks cite AC IDs in Acceptance Criteria.
