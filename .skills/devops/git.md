---
name: git-workflow
description: Branch strategy, commit discipline, merge rules
phase: devops
priority: high
inputs: []
outputs: [branch, commits, merge]
dependencies: [core/multi-agent]
next_skills: [review/code-review, devops/ci]
---

# Git Workflow

## Branch Strategy (trunk-based, agent-friendly)

- **main**: always releasable — protected, CI-gated, no direct pushes
- **feat/T-<id>-<slug>**: one task = one branch (parallel agents isolated per `core/multi-agent.md`)
- **fix/B-<id>-<slug>**, **hotfix/<id>**: bugs; hotfix branches from main (prod-fix path)
- Short-lived branches (merge fast after review) — long-lived branches rot and conflict

## Commit Discipline

- Conventional commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`, `perf:` (+ scope: `feat(auth):`)
- Atomic commits: one logical change, green at every commit (bisectable)
- Message body explains **why** when non-obvious; never `.`/`stuff`/`updated files`
- No secrets in commits (pre-scan per `security/secrets.md`); no unrelated files in a feature commit (scope discipline per `core/task-standard.md`)

## Merge Rules

1. PR/merge request required (even agent→agent); title = task ID + summary
2. CI green is a precondition to merge — never bypass, never `--no-verify` (agent-rules #15)
3. Reviewed per `review/code-review.md` before merge (APPROVE required)
4. Squash or clean-merge per repo convention (one chosen, recorded, consistent)
5. After merge: task status → TESTING or DONE + update `.ai/project-state.md`; delete branch

## History Hygiene

- Rebase local branches before merge (linear history for readable logs + clean bisection)
- Never rewrite shared branch history; force-push only to your own unmerged branch, with `-force-with-lease`

## Validation Checklist

- [ ] Branch named for task/bug; scope matches task files
- [ ] Commits atomic + conventional; every commit green
- [ ] CI green + review APPROVE before merge

## Handoff

→ merged code goes to `testing/regression.md` via CI; releases via `release-management.md`.
