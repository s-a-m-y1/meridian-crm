# Changelog — E-commers-Crm

All notable changes. Format: Keep a Changelog style.

## [0.1.0] — 2026-09-17

### Added

- Phase 1 foundation complete:
  - Monorepo init with git, lint, typecheck, test scripts
  - Backend: NestJS 10 + TypeORM + PostgreSQL
  - Database migrations (users, organizations, organization_members, organization_settings, refresh_tokens)
  - Auth module: register, login, logout, JWT + refresh rotation, bcryptjs (12 rounds)
  - Refresh token family + reuse detection + rotation
  - Password reset + email verification (dev mode)
  - Rate limiting (global + auth-specific)
  - Organizations + members + roles (owner/admin/manager/agent) + restricted records
  - Org-scoping guards (JWT → OrgMember → Roles)
  - PostgreSQL + Redis via Docker Compose
  - Migrations run on dev + test DBs
  - 13 unit tests + 12 e2e tests (25 total passing)
  - Lint + typecheck clean

### Added (Phase 0)

- Phase 0 planning: architecture, implementation status, decisions, known issues, security status, test status, API/Database/AI/TESTING/DEPLOYMENT docs, build plan (13 docs)
- Skills system installed (`.skills/`, `.ai/`, `AGENT.md`, `README.md`) from System Delgate Skils base.