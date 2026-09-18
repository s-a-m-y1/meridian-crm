# Changelog — E-commers-Crm

All notable changes. Format: Keep a Changelog style.

## [0.4.0] — 2026-09-18

### Added

- Phase 4 Backend/Frontend Integration complete:
  - AuthContext with JWT token management, refresh rotation, auto-retry
  - Login page at /login with email/password validation, show/hide password
  - Register page at /register with name, email, password, confirm password
  - Dashboard at /dashboard with protected route (redirects to login if not auth)
  - AuthProvider with JWT token management, auto-refresh, route guards
  - Providers wrapper for root layout (server-compatible)
  - TypeScript typecheck clean
  - Build successful with Next.js 15 + React 19 on Node.js 20

### Changed

- Updated IMPLEMENTATION_STATUS.md with Phase 4 completion
- Updated project-state to Phase 4 complete
- Updated T-400 task to DONE

## [0.3.0] — 2026-09-18

### Added

- Phase 3 Core Frontend CRM complete:
  - Next.js 15 + React 19 + TypeScript + Tailwind v3 + shadcn/ui
  - UI Components: Button, Input, Card, Badge, Select, Textarea, Label, Separator
  - API Client: Axios with JWT auth, refresh rotation, auto-retry
  - Dashboard: Stats grid, recent leads table, upcoming tasks, recent activities, quick stats
  - DashboardSkeleton for loading states
  - API utilities, formatting helpers
  - TypeScript + typecheck clean
  - Build successful with Next.js 15 + React 19 on Node.js 20

### Changed

- Updated IMPLEMENTATION_STATUS.md with Phase 3 completion
- Updated project-state to Phase 3 complete
- Updated T-300 task to DONE

## [0.2.0] — 2026-09-17

### Added

- Phase 2 Core Backend CRM complete:
  - Customers module: CRUD, pagination, filtering, sorting, search
  - Leads module: CRUD, AI fields (score, classification, reasons), search, filtering
  - Properties module: CRUD, search, filtering by category/status/location/price
  - Deals module: CRUD, AI forecast (close probability), stage filtering
  - Tasks module: CRUD, due dates, completion tracking, status filtering
  - Activities module: append-only log (CALL/EMAIL/VIEWING/NOTE/WHATSAPP), lead-scoped
  - Notes module: CRUD, lead-scoped, user ownership
  - Full-text search: tsvector + GIN indexes on leads/customers/properties with auto-update triggers
  - Swagger/OpenAPI decorators on all endpoints
  - Org-scoping + role-based access (owner/admin/manager/agent) on all endpoints
  - Restricted-to-own-records support for leads/tasks/notes
  - 24 unit tests + 12 e2e tests (36 total passing)
  - Database migrations for all new tables (customers, leads, properties, deals, tasks, activities, notes)
  - Search migration with tsvector + GIN indexes + auto-update triggers

### Changed

- Updated IMPLEMENTATION_STATUS.md with Phase 2 completion
- Updated project-state to Phase 2 complete
- Updated T-201 task to DONE

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