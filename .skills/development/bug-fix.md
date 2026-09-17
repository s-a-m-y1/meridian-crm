---
name: bug-fix
description: Formal bug fix protocol from report to regression-proof closure
phase: development
priority: high
inputs: [bug-report, repro]
outputs: [fix, regression-test]
dependencies: [debugging]
next_skills: [review/code-review, testing/regression]
---

# Bug Fix Protocol

## Workflow

1. **Triage** the report → `.ai/bugs/B-<id>.md`: severity (S1 prod-down … S4 cosmetic), affected version, affected users, workaround. Prioritize: S1 > security bugs > S2 > rest.
2. **Reproduce** (per `development/debugging.md` — no repro no fix).
3. **Root cause** — one sentence; log it in the bug file.
4. **Fix** following `development/implementation.md` with the smallest change that eliminates the _cause_.
5. **Regression test** — fails before, passes after; added to the permanent suite (never a manual-only check).
6. **Verify scope**: did the fix touch shared code? Run the full suite + affected API contract tests; check dependent features.
7. **Review** (code review; security review if the bug is security-related) → close with evidence: repro output before/after, test exit codes.
8. **Postmortem-lite for S1/S2** (via `observability/root-cause-analysis.md`): why did it happen (bad test? bad assumption? missing check?), why didn't we catch it, and the preventive fix (what test/check/monitor prevents recurrence).

## Rules

- Hotfix path (prod-down): smallest safe fix, expedited review (still reviewed!), full RCA after the fire is out — see `workflows/production-incident.md`.
- Never close a bug "cannot reproduce" without recording the investigation, environment hypotheses, and monitoring added to catch it again.

## Validation Checklist

- [ ] Bug file updated end-to-end (report → RCA → fix → test evidence)
- [ ] Regression test permanent in suite
- [ ] Shared-code blast radius checked
- [ ] Preventive measure identified for S1/S2

## Handoff

→ `review/code-review.md`; `workflows/bug-fix.md` orchestrates the full chain.
