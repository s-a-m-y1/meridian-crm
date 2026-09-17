---
id: T-200
title: "Phase 1: Repo init + DB + Auth + Organizations"
owner: @backend (Agent 1)
status: IN_PROGRESS
created: 2026-09-17
due:
---

# Summary

Foundation: initialize monorepo (backend/frontend), PostgreSQL + TypeORM + migrations, core entities (organizations, organization_members, organization_settings, users), and secure auth (register/login/logout, hashing, JWT+refresh, password reset, email verification, rate limiting) with org-scoping guards.

# Description

Per `docs/BUILD_PLAN.md` Phase 1. After Phase 0 sign-off only.

# Acceptance Criteria

- Git repo + lint + TS config; `backend/` NestJS + `frontend/` Next.js scaffolds
- PostgreSQL via Docker Compose, TypeORM migrations applied
- Entities + migrations: organizations, organization_members, organization_settings, users
- Auth module complete with hashing, JWT+refresh, rate limiting, no secrets exposed
- Org-scoping foundation (guards/decorators) — every query tenant-scoped
- Auth integration tests pass (exit codes recorded)

# Implementation Steps

1. Repo init + scaffolds
2. DB + migrations
3. Entities
4. Auth module
5. Org scoping
6. Tests
7. Checkpoint review

# Tests

- Jest integration: register/login/refresh/logout, org scoping, rate limit
- Command + exit code recorded in Result

# Risks

- Auth/security flaws → gated by Agent 4 review before proceeding
- Schema changes late → validate with migrations early

# Notes

- Blocks Phases 2+. Depends on Phase 0 sign-off.