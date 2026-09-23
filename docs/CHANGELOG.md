# Changelog — E-commers-Crm

All notable changes. Format: Keep a Changelog style.

## [1.0.0] — 2026-09-18

### Added

- Phase 13 CI/CD + Docker + Deployment complete:
  - Backend Dockerfile: Multi-stage build (deps, builder, runner) with non-root user
  - Frontend Dockerfile: Multi-stage build with Next.js standalone output
  - Development Docker Compose: Hot reload for backend/frontend with debug port
  - Production Docker Compose: Multi-replica with health checks, resource limits
  - Nginx reverse proxy: Rate limiting, SSL termination, caching, security headers
  - GitHub Actions CI/CD: Test (lint, typecheck, unit, e2e), build, push to GHCR, deploy staging/production
  - Kubernetes (Kustomize): Base + staging/production overlays, HPA, ingress with TLS
  - .env.example with all required variables
  - DEPLOYMENT.md with comprehensive deployment guide
  - All TypeScript typecheck clean, build passes, tests pass

### Changed

- Updated IMPLEMENTATION_STATUS.md with Phase 13 completion
- Updated project-state to Phase 13 complete (PROJECT COMPLETE)
- Updated T-1300 task to DONE

## [0.12.0] — 2026-09-18

### Added

- Phase 12 Security hardening + Red-team complete:
  - Security Headers Middleware: CSP, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy, HSTS
  - Enhanced Rate Limiting: Per-endpoint limits (auth: 10/min, AI: 30/min, default: 300/min) with IP+UA+path keys
  - Input Validation & Sanitization: Class-validator + class-transformer + DOMPurify HTML sanitization
  - Password Strength Validation: zxcvbn integration with minimum score 3, real-time feedback
  - Security Audit Service: Automated scanning for password policies, auth secrets, authorization, data protection, API security, infrastructure, logging
  - Security Audit API: Endpoints for password check, scan, and markdown report (owner/admin only)
  - Security Module: Centralized security configuration with ThrottlerModule, guards, pipes, middleware
  - All TypeScript typecheck clean, build passes

### Changed

- Updated IMPLEMENTATION_STATUS.md with Phase 12 completion
- Updated project-state to Phase 12 complete
- Updated T-1200 task to DONE

## [0.11.0] — 2026-09-18

### Added

- Phase 11 Observability + Audit + Tracing complete:
  - Metrics Service: Prometheus metrics for HTTP, business, AI, queue, system metrics
  - Logging Service: Winston structured logging with daily rotation, HTTP, business, security, AI, queue event logging
  - Tracing Service: OpenTelemetry distributed tracing with auto-instrumentation (HTTP, Express, NestJS, PostgreSQL)
  - Audit Service: Comprehensive audit logging for all sensitive operations (CRUD, auth, role changes, exports, AI operations)
  - Health Controller: Terminus-based health checks with liveness/readiness probes, queue health
  - Audit Log Entity: Persistent audit trail with query/filter capabilities and cleanup
  - All TypeScript typecheck clean, build passes

### Changed

- Updated IMPLEMENTATION_STATUS.md with Phase 11 completion
- Updated project-state to Phase 11 complete
- Updated T-1100 task to DONE

## [0.10.0] — 2026-09-18

### Added

- Phase 10 Redis + BullMQ Background Jobs complete:
  - Queue module with 6 queues: lead-scoring, daily-briefing, neglect-detection, deal-forecasting, property-matching, ai-tasks
  - Lead Scoring Processor: batch scoring with progress tracking, single lead scoring
  - Daily Briefing Processor: generates briefings for users
  - Neglect Detection Processor: detects leads with no activity (configurable threshold)
  - Deal Forecasting Processor: AI-powered deal close probability
  - Property Matching Processor: matches leads to properties
  - Scheduled Jobs Service: cron-based scheduling for daily scoring, briefings, neglect detection, forecasting
  - Queue Service: job management, queue stats, pause/resume/clean operations
  - Redis configuration via environment variables
  - All TypeScript typecheck clean, build passes

### Changed

- Updated IMPLEMENTATION_STATUS.md with Phase 10 completion
- Updated project-state to Phase 10 complete
- Updated T-1000 task to DONE

## [0.9.0] — 2026-09-18

### Added

- Phase 9 Dashboard + Analytics API endpoints complete:
  - Dashboard stats endpoint: total leads, active deals, tasks due, overdue tasks, meetings today
  - Recent leads endpoint with customer info (joined via query builder)
  - Upcoming tasks endpoint with lead info (joined via query builder)
  - Recent activities endpoint with lead and user info (joined via query builder)
  - Pipeline summary by stage with deal counts and values
  - Sales analytics: total deals, won/lost/active, revenue, avg deal size, conversion rate
  - Conversion metrics: lead→qualified, qualified→converted, deal conversion rates (week/month/quarter/year)
  - Revenue analytics: monthly revenue trends, total revenue, avg deal size
  - Team performance: per-user leads, deals, revenue, tasks, activities
  - Dashboard frontend updated to fetch real data via API with loading skeletons
  - All TypeScript typecheck clean, build passes

### Changed

- Updated IMPLEMENTATION_STATUS.md with Phase 9 completion
- Updated project-state to Phase 9 complete
- Updated T-900 task to DONE

## [0.8.0] — 2026-09-18

### Added

- Phase 8 CRM Frontend Pages complete:
  - Leads page: Kanban board with drag-and-drop status updates, search, filters, pagination, create/edit/detail modals
  - Customers page: Table with search, pagination, create/edit/detail modals
  - Properties page: Table with search, filters (category, status, price range), pagination, create/edit/detail modals
  - Deals page: Pipeline Kanban with drag-and-drop stage updates, summary cards, search, filters, create/edit/detail modals
  - Tasks page: Table with search, filters (status, lead), overdue highlighting, pagination, create/edit/detail modals
  - Global Search (Cmd+K): Cross-entity search across leads, customers, properties, deals, tasks with keyboard shortcut
  - Navigation sidebar with responsive layout, user profile, logout
  - Next.js middleware for authentication (protects all CRM routes, redirects to login with redirect param)
  - All pages use dynamic rendering with force-dynamic for API calls
  - Login/Register pages updated with Suspense boundaries for useSearchParams
  - All TypeScript typecheck clean, build passes

### Changed

- Updated IMPLEMENTATION_STATUS.md with Phase 8 completion
- Updated project-state to Phase 8 complete
- Updated T-800 task to DONE

## [0.7.0] — 2026-09-18

### Added

- Phase 7 AI Frontend Integration complete:
  - AI Copilot: Floating chat widget with conversation history, streaming responses
  - Quick actions: Top leads, closing deals, daily briefing, neglected leads
  - AI Insights Panel: Dashboard widget with daily briefing, priorities, opportunities, risks, neglected leads
  - API Client extended with AI endpoints (chat, lead scoring, property matching, deal forecasting, briefing, analytics, neglected leads, follow-up generation)
  - Integrated into Dashboard with floating copilot button and insights panel in sidebar
  - ScrollArea UI component for chat history
  - All TypeScript typecheck clean, build passes

### Changed

- Updated IMPLEMENTATION_STATUS.md with Phase 7 completion
- Updated project-state to Phase 7 complete
- Updated T-700 task to DONE

## [0.6.0] — 2026-09-18

### Added

- Phase 6 AI Foundation complete (previously blocked by TypeScript errors):
  - AI Provider abstraction: OpenAI + Anthropic with streaming support (async iterables)
  - AI Tools framework: 17 tools (read/write/destructive) with role-based access
  - AI Permissions: Role-based (owner/admin/manager/agent) with restricted-to-own-records
  - AI Context Service: Fetches CRM data (leads, deals, properties, tasks, users, org) for LLM context
  - AI Conversation Service: Persistent chat history with messages (TypeORM entities)
  - Lead Scoring Service: Budget, activity, source-based scoring algorithm
  - Property Matching Service: Match leads to properties with scoring
  - Deal Forecasting Service: AI-powered deal close probability with reasoning
  - Sales Analytics Service: Natural language sales data analysis
  - Neglect Detection Service: Detect leads with no recent activity
  - Daily Briefing Service: AI-generated daily briefing for agents
  - AI Orchestrator: Coordinates all AI services and tools
  - All TypeScript compilation errors fixed, build passes

### Changed

- Updated IMPLEMENTATION_STATUS.md with Phase 6 completion
- Updated project-state to Phase 6 complete
- Updated T-600 task to DONE

## [0.5.0] — 2026-09-18

### Added

- Phase 5 Core Tests complete:
  - Backend: 24 unit tests + 12 e2e tests = 36 passing
  - Frontend: 24 e2e tests passing (auth flow, login, register, dashboard) + 14 skipped (require backend)
  - Lint + typecheck clean (backend)

### Changed

- Updated IMPLEMENTATION_STATUS.md with Phase 5 completion
- Updated project-state to Phase 5 complete
- Updated T-500 task to DONE

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