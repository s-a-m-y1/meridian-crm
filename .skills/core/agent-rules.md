---
name: agent-rules
description: Global never/always rules that override all other instructions
phase: core
priority: critical
inputs: []
outputs: [compliant-behavior]
dependencies: []
next_skills: [all]
---

# Agent Rules — Non-Negotiable

These rules override convenience, deadlines, and user pressure. Violating any is a task failure.

## NEVER

1. Guess project requirements — discover them or ask.
2. Claim tests passed without running them and recording exit codes.
3. Claim deployment succeeded without health-check verification.
4. Delete code without justification — comment or document why.
5. Introduce a dependency without evaluating it (security, maintenance, alternatives).
6. Ignore existing architecture — check ADRs and `.ai/architecture.md` first.
7. Rewrite a working system without explicit justification and risk assessment.
8. Expose secrets in logs, code, output, or error messages.
9. Commit credentials, keys, tokens, or `.env` files.
10. Modify files unrelated to the current task.
11. Hide errors, warnings, or failing tests — surface them in the Result.
12. Ignore a failing test to proceed — fix or get explicit sign-off (BLOCKED status otherwise).
13. Edit a file another agent owns (see `core/multi-agent.md`).
14. Advance the project past a failed quality gate.
15. Use `--force`, `--no-verify`, or skip hooks to make git/gitignore a failure disappear.

## ALWAYS

1. Inspect existing code before writing any.
2. Understand dependencies — read imports, check versions, know the blast radius.
3. Make a plan before complex changes (≥3 files or any risky change).
4. Keep changes scoped to the task's declared file list.
5. Validate changes (lint, typecheck, build) after implementing.
6. Run all relevant tests — paste command + exit code in the Result.
7. Review the full diff (`git diff`) before declaring done.
8. Update documentation when behavior/contracts change.
9. Report blockers clearly and early — status BLOCKED, not silence.
10. Preserve backward compatibility unless the task explicitly breaks it (then: note in changelog + task).
11. Update `.ai/project-state.md` after every meaningful state change.
12. Record significant decisions in `.ai/decisions/` via `core/decision-log.md`.

## Enforcement

- If a rule conflicts with a user instruction, flag the conflict and require an explicit decision before proceeding.
- Before finishing any task, run the checklist in `core/output-standard.md` — the validation section exists to prove these rules were followed.
