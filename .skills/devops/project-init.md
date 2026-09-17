---
name: project-init
description: Initialize a project — repo, structure, conventions, env, validation
phase: initialization
priority: high
inputs: [project-decision]
outputs: [initialized-repository, conventions]
dependencies: []
next_skills: [devops/git, devops/docker, devops/ci, workflows/new-project]
---

# Project Initialization (Phase 0)

One-time scaffolding for a new project. Run before any feature work.

## Workflow

1. **Repo init**: `git init` + initial `.gitignore` (language-appropriate + `.env` + editor/artifact dirs); first commit = scaffolding only. Default branch `main`.
2. **Folder structure** (layered by `architecture/backend.md`/`frontend.md` — minimal skeleton now, grows by convention):
   - `src/` (code: app/features/components/services per arch skills)
   - `tests/` (mirrors src; unit/integration/e2e dirs per `testing/strategy.md`)
   - `docs/` (generated docs live here per `documentation/*`)
   - `scripts/` (setup/seed/dev utilities)
   - `infra/` (Dockerfiles, CI, deploy configs — per `devops/*`)
3. **Conventions file** (`CONVENTIONS.md` or section in README) — decide once, apply forever:
   - Naming: files (kebab/Pascal per language norm), variables, branches (`feat/T-<id>-<slug>` per `devops/git.md`), tasks (`T-<id>`)
   - Coding standards: linter + formatter configs **committed** (the config is the standard — no debate), lint-staged pre-commit
   - Import order, error handling pattern, test naming — mirror the rules in `development/*` skills
4. **Environment setup**:
   - `.env.example` with every required var documented (name/purpose/fake example — per `security/secrets.md`)
   - `.env` gitignored; config validated at boot (fail-fast)
   - `scripts/setup.sh` (or equivalent): install deps, copy env, migrate, seed — one command to running
5. **Dependency baseline**: minimal initial deps only (framework, linter, test runner); every addition goes through `development/dependency-management.md` evaluation — even at init.
6. **Dev environment validation** (prove it works before anyone builds on it):
   ```bash
   git clone <repo> && ./scripts/setup.sh && <run cmd>  # → service up
   <test cmd>                                         # → suite green
   ```
   Executed fresh-clone in a clean dir; results recorded — this is what `documentation/setup.md` will later document.
7. **CI day one** (`.github/workflows/` or equivalent): lint+typecheck+unit at minimum per `devops/ci.md` — green main from commit #1, not "later".
8. Init `.ai/` memory if not present (per `core/memory-management.md`).

## Validation Checklist

- [ ] Fresh-clone + one-command setup verified (evidence pasted)
- [ ] Linter/formatter configs committed; pre-commit active
- [ ] `.env.example` complete; `.env` ignored
- [ ] CI green on initial pipeline
- [ ] Conventions documented where contributors look first

## Handoff

→ `workflows/new-project.md` (the project content begins), `devops/git.md` (branch discipline).
