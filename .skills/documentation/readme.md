---
name: readme-generation
description: Generate and maintain the project README
phase: documentation
priority: high
inputs: [project-state, architecture-summary]
outputs: [readme]
dependencies: []
next_skills: [setup-docs]
---

# README Generation

## Required Sections (in order)

```markdown
# <Project>

One-liner: what it does, for whom.

## Quick Start

clone → install → configure (.env.example copy) → run → verify (a curl/command proving it's alive)
The shortest path to RUNNING, not exhaustive setup (link setup docs for the rest).

## What It Does (3-6 bullets — features, not implementation)

## Architecture (summary + one diagram link → architecture-docs.md output)

## Development

setup (link), run, test, lint — exact commands, tested by a fresh agent

## Deployment (link to deployment docs; env matrix dev/staging/prod)

## Contributing (task/branch conventions per devops/git.md; review requirements)

## License / Contact as applicable
```

## Rules

1. **Commands must work copy-paste** — verify every command in Quick Start and Development by executing it; a broken README command fails Gate 7.
2. Written for a **newcomer** (new dev or fresh agent — the README's #1 reader is an agent bootstrapping context per `core/context-management.md`).
3. Sync triggers: new top-level feature, command changes, env var changes, architecture change — README updates ride along with those PRs (per agent-rules "update docs").
4. Keep short: detail lives in `setup.md` / `architecture-docs.md` / `api-docs.md`; README links, never duplicates (duplication rots).

## Validation Checklist

- [ ] Every command executed successfully
- [ ] Fresh-boot test: a new agent can go 0→running using README alone
- [ ] No duplicated detail that lives elsewhere (links instead)

## Handoff

→ `setup.md` (deep setup), `architecture-docs.md`, `api-docs.md`.
