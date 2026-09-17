---
name: workflow-bug-fix
description: Chain from bug report to regression-proof closure
phase: workflow
priority: high
inputs: [bug-report]
outputs: [closed-bug, regression-test]
dependencies: [development/debugging, development/bug-fix, testing, review]
next_skills: [workflow-production-incident]
---

# Workflow: Bug Fix

```
1.  Triage           → severity, affected users/version, workaround → .ai/bugs/B-<id>.md
2.  Reproduce        → deterministic repro (script/test) — no repro = investigate env, don't guess
3.  Root cause       → development/debugging.md (evidence-based; one-sentence cause)
4.  Fix              → development/bug-fix.md (smallest change fixing the CAUSE)
5.  Regression test  → fails-before/passes-after, permanent in suite
6.  Regression sweep → testing/regression.md (blast radius: shared code? run consumers' tests)
7.  Review           → review/code-review.md (+ security-review.md if bug touched auth/data)
8.  Docs             → changelog.md "Fixed" entry; troubleshooting entry if ops-relevant
9.  Deploy           → normal path via cd.md; hotfix path ONLY if SEV1 (production-incident.md)
10. Verify in env    → smoke + monitoring window per deployment.md [GATE 8]
```

## Rules

1. Step 2 blocks step 3 — fixing an un-reproduced bug is guessing (and unverifiable).
2. Step 3 produces a one-sentence root cause; "fixed the symptom" outputs are rejected at review.
3. Blast-radius grep is mandatory (same pattern elsewhere) per `development/debugging.md`.
4. SEV1/S2 bugs get the postmortem-lite (preventive fix per `development/bug-fix.md` step 8) — "what catches this next time?" must have an answer.

## Completion

Bug file complete (report→RCA→fix→test evidence), regression suite permanently protected, changelog entry merged, deployed and verified.
