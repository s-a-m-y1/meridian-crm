---
name: debugging
description: Systematic root cause analysis and safe bug fixing
phase: development
priority: high
inputs: [bug-report-or-symptom]
outputs: [root-cause, fix]
dependencies: [implementation]
next_skills: [bug-fix-workflow, testing/regression]
---

# Debugging — Root Cause Analysis

## Workflow

1. **Reproduce first** — no repro, no fix. Deterministic repro script/test. Intermittent → narrow the window (load? concurrency? time? env?).
2. **Read the error completely** — message, stack, line numbers, logs around the event, trace if available (`observability/`).
3. **Form hypotheses** ranked by likelihood; list what evidence each predicts.
4. **Binary-search the system**: logs/metrics bisect WHERE things diverge from expectation — input vs processing vs output; recent diffs (`git log`) around first occurrence.
5. **Prove the hypothesis before fixing**: a fix that "works" without explaining WHY the bug happened is a coincidence, not a fix. Write a test that fails BEFORE the fix and passes AFTER (this becomes the regression test).
6. **Fix the cause, not the symptom**: wrapping in try/catch, adding a null check, or retrying harder is treating symptoms — find why the invalid state existed.
7. **Check the blast radius**: same pattern elsewhere? Same class of bug in sibling code? (grep for the pattern).
8. Document: repro → root cause → fix → regression test in `.ai/bugs/B-<id>.md`.

## Debug Anti-Patterns (never)

- Changing multiple things at once (no causal attribution)
- "Fixing" by deleting the failing test/assertion
- Shotgun-patching until the symptom vanishes
- Fixing an adjacent-but-unrelated issue mid-debug (file it; stay focused)

## Validation Checklist

- [ ] Repro script exists and is deterministic (or window quantified)
- [ ] Root cause stated in one sentence — the _why_, not the _what_
- [ ] Fails-before/passes-after regression test written
- [ ] Blast radius checked (same pattern grep'd)

## Handoff

→ `development/bug-fix.md` (formal fix workflow), `testing/regression.md`.
