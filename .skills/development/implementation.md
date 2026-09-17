---
name: implementation
description: Master code execution protocol — Understand, Plan, Implement, Validate, Test, Review
phase: development
priority: critical
inputs: [task-file, architecture-summary]
outputs: [implemented-task, test-evidence]
dependencies: [core/task-management, architecture]
next_skills: [testing/strategy, review/code-review]
---

# Implementation Protocol

Every code change follows this loop. **Never blindly modify code.**

## 1. Understand

- Read the task file: objective, requirements, ACs, declared file scope.
- Read `core/context-management.md` protocol → load the minimum context set.
- For each target file: read it **entirely** before editing. Understand imports, callers, and side effects (`grep` for usages).
- Identify invariants the code relies on (what must NOT change).

## 2. Plan

- For changes touching ≥3 files or any risky area: write the plan in the task file first (ordered steps, files, expected diff shape).
- Identify the smallest change satisfying the ACs. Anything beyond → separate task (rule: no drive-bys).
- Pre-plan tests: what proves each AC? Test names written before implementation for core logic (TDD where logic is non-trivial).
- Check parallel-agent constraints (`core/multi-agent.md`): are all target files within my declared ownership?

## 3. Implement

- One logical change at a time; commit-sized steps (per `devops/git.md`).
- Follow the codebase conventions you read in step 1 — naming, structure, error patterns. Consistency with neighbors beats personal preference.
- Adhere to the domain skill for the layer: `development/frontend.md`, `backend.md`, `database.md`, `api.md`.
- No commented-out dead code left behind; no TODO without a task reference (`TODO(T-0123)`).

## 4. Validate

Run in order, fix before proceeding:

1. Lint (fix all new violations)
2. Typecheck (zero new errors)
3. Build (must succeed)

## 5. Test

- Run the **full affected test set**, not just new tests: any pre-existing failure blocks the task (agent-rules: never ignore failing tests).
- Cover each AC with at least one test; paste commands + exit codes into the task file's Validation section.

## 6. Review

- Self-review the complete diff (`git diff`) as if reviewing a stranger's code, using `review/code-review.md` criteria.
- Then hand off for review (human or reviewer agent). Status → REVIEW.

## Failure Handling

- Unexpected behavior discovered → stop expanding scope; assess: bug? pre-existing? file an issue in `.ai/bugs/` or fold into current task if in-scope; never silently "also fix" unrelated code.
- Blocked (missing dependency/decision) → status BLOCKED + reason + who unblocks. Never work around by guessing.

## Handoff

→ `testing/strategy.md`/`review/code-review.md`. On DONE: update task file + `.ai/project-state.md`.
