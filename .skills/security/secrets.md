---
name: secrets-management
description: Handle secrets across dev, CI and production
phase: security
priority: critical
inputs: []
outputs: [secrets-policy, verified-no-leaks]
dependencies: []
next_skills: [devops/ci, devops/cd, security-review]
---

# Secrets Management

## Rules

1. **Never**: committed in code/config/files, hardcoded in scripts, pasted in logs/errors/chat, in `--build-arg` (visible in image history), in client-side code (anything shipped to the browser is public).
2. Storage: env vars from a secret manager (or CI secret store for pipelines); `.env` files gitignored — commit `.env.example` with placeholder values instead.
3. `.ai/` memory files must never contain real secrets — reference them ("secret name: DB_PASSWORD in vault") instead.
4. **Rotation**: all secrets rotatable by design; defaults/keys generated per environment (no shared prod/dev secret); rotation tested.
5. Least privilege: each service/CI job gets only its own secrets; DB user per service with minimum rights (no superuser in app runtime).
6. Detection: secret-pattern scan in CI (on diff and full repo); pre-commit hook optional but CI scan mandatory.

## Incident Path (secret leaked)

1. Treat as compromised immediately (git history is forever — even after removal).
2. Rotate the secret FIRST, then clean code/history, then check audit logs for abuse window, then record in `.ai/bugs/` + incident file.

## Validation Checklist

- [ ] CI scan for secret patterns green (evidence)
- [ ] `.env.example` placeholders only; no real values in repo
- [ ] No secrets in build args, logs, docs, memory files
- [ ] Rotation path tested for at least one secret

## Handoff

→ `devops/ci.md` + `cd.md` (secret injection in pipelines); findings to `review/security-review.md`.
