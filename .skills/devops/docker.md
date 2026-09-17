---
name: docker
description: Build production-safe container images
phase: devops
priority: high
inputs: [build-config]
outputs: [dockerfile, image]
dependencies: [security/secrets]
next_skills: [ci, cd]
---

# Docker / Containers

## Dockerfile Rules

1. **Multi-stage builds**: build stage (full toolchain) → runtime stage (runtime-only); runtime image carries no compilers, no source, no build secrets.
2. **Base images**: official + version-pinned (never `latest`), slim/alpine variants where compatible; minimal = smaller supply-chain surface. Rebuild cadence for base-image CVEs (`security/dependency-security.md` scheduled scans apply to images too).
3. **Non-root user** — mandatory; read-only filesystem where possible; explicit `EXPOSE` only.
4. Secrets at build: `--secret` mounts / buildkit secret mounts, NEVER `ARG`/`ENV` (persisted in layers — per `security/secrets.md`).
5. Layers: deps first (cached), code last; `.dockerignore` complete (`.git`, `.env`, `node_modules`, test artifacts, `.ai/` unless needed at runtime — it's not).
6. Deterministic: lockfiles copied + installed before code copy; image tagged with git SHA + semver (never floating `latest` for deploys).
7. Healthcheck defined in the image (per `observability/monitoring.md` liveness/readiness).

## Runtime Config

- Config via env vars only (12-factor); container is disposable — no state in the container (volumes for data, per `architecture/database.md`)
- Resource limits (memory/CPU) set in orchestrator/compose — containers that can OOM the host take neighbors down
- Logs to stdout/stderr (structured — `observability/logging.md`); never to files inside the container

## Validation Checklist

- [ ] Multi-stage; runtime non-root; no build secrets in layers
- [ ] Image pinned + tagged with SHA; `.dockerignore` complete
- [ ] Runs with read-only FS in dev at least once (proves no hidden state)

## Handoff

→ image into `ci.md` (build) and `cd.md` (deploy).
