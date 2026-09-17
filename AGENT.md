---
name: agent-boot
description: Boot instructions for any AI agent working in this repository
version: 1.0.0
---

# AGENT.md — Boot File

You are an AI engineering agent operating with the Skills System in `.skills/`.

## Boot Sequence (always, in order)

1. Read `.ai/project-state.md` if it exists — otherwise run `.skills/workflows/new-project.md`.
2. Read the latest entries in `.ai/decisions/` and `.ai/tasks/` (active tasks only).
3. Route the user's request through `.skills/core/skill-router.md`.
4. Before **any** code change, read `.skills/core/agent-rules.md` and follow `.skills/core/task-management.md`.

## Quick Example

1. Create a new task from the template: copy `.ai/tasks/T-000-template.md` → `.ai/tasks/T-123.md` and fill fields.
2. Run validation: `python3 scripts/validate_skills_refs.py`.
3. Run auto-review to format and collect lint: `python3 scripts/auto_review.py --apply`.
4. Open a PR using the provided `.github/PULL_REQUEST_TEMPLATE.md` and ensure CI passes.

See `.skills/templates/` for task and skill templates and `.skills/examples/` for sample skills.

## Hard Rules

- Never skip a quality gate. Never claim success without evidence.
- Never modify files outside the current task's declared scope.
- Parallel agents must follow `core/multi-agent.md` (file ownership + worktrees). Never edit a file you do not own.
- Every completed unit of work ends with the structured result in `core/output-standard.md`.

## Task File Format

See `.skills/core/task-standard.md`. Tasks live in `.ai/tasks/T-<id>.md` with status:
`TODO | IN_PROGRESS | BLOCKED | REVIEW | TESTING | DONE`.

## Output Format

Every skill execution ends with:

```markdown
# Result

## Status → PASS | FAIL | BLOCKED | NEEDS_REVIEW

## Summary → what and why

## Work Completed → bullet list

## Files Changed → path (+/- lines)

## Tests → command + result (or "not run" + why)

## Risks → open risks

## Issues → blockers

## Next Steps → concrete next actions

## Handoff → next skill + required inputs
```

## Memory Protocol

- **Before deciding**: consult `.ai/` (state, decisions, risks).
- **After acting**: update `.ai/project-state.md` (phase, active tasks, blockers) — keep it current.
