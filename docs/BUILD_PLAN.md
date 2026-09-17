# Build Plan — E-commers-Crm

Executes the master prompt build order (Phases 0-17). Each phase ends with a **checkpoint** (all 5 agents: PASS / PASS WITH WARNINGS / BLOCKED). No phase advances while BLOCKED. Every task follows: PLAN → IMPLEMENT → TEST → REVIEW → FIX → INTEGRATE → VERIFY → DOCUMENT.

## Phase 0 — Repository Audit (DONE)

- [x] Audit folder → empty, greenfield confirmed
- [x] Produce docs set (ARCHITECTURE, IMPLEMENTATION_STATUS, DECISIONS, KNOWN_ISSUES, SECURITY_STATUS, TEST_STATUS)
- [x] Shared doc skeletons (API, DATABASE, AI, TESTING, DEPLOYMENT, CHANGELOG)
- [x] This build plan + memory init
- **Checkpoint**: pending user sign-off

## Phase 1 — Foundation: DB + Auth + Organizations

- Init repo: git, linter, TS config, monorepo layout (`backend/`, `frontend/`)
- PostgreSQL + TypeORM setup, migrations
- Entities: organizations, organization_members, organization_settings, users
- Auth module: register/login/logout, password hashing (argon2/bcrypt), JWT + refresh, password reset, email verification, rate limiting
- Org scoping foundation (guards, decorators)
- Owner: Agent 1 · Review: Agents 2-5
- **Tests**: auth integration, org scoping

## Phase 2 — Core Backend CRM

- Modules: customers, leads, properties, deals, tasks, activities, notes
- Each: module/controller/service/entity/DTO/validation/tests
- Search (tsvector + GIN), pagination, filtering, sorting, consistent errors
- Swagger/OpenAPI
- Roles/authorization backend-enforced (`restricted_to_own_records`)
- **Checkpoint**

## Phase 3 — Core Frontend CRM

- Next.js shell, design system (shadcn/ui, Tailwind, cmdk), RTL/Arabic support
- Auth pages, layouts, protected routes
- CRM pages: leads/customers/properties/deals/tasks (+ detail pages)
- Tables (search/filter/sort/pagination), forms (validation, disabled submit), Kanban (drag/drop, optimistic + rollback), Cmd+K global search
- Loading/empty/error/success states, skeletons, error boundaries, toasts, a11y
- **Checkpoint**

## Phase 4 — Backend/Frontend Integration

- Wire API client (TanStack Query), env config, auth flow, error handling (401/403/409/422/429/500/timeout/network)
- Verify all CRM pages live against backend
- **Checkpoint**

## Phase 5 — Core Tests

- Unit + integration + E2E for CRM core; regression baseline
- **Checkpoint**

## Phase 6 — AI Foundation

- `src/ai` module, provider abstraction (interfaces), ai-provider service
- ai_usage_logs, conversations/messages entities
- Trace IDs, structured AI logging
- **Checkpoint**

## Phase 7 — AI Tools + Permissions + Chat

- Tool registry (read/write/destructive) with AuthContext validation
- Confirmation flow for writes/destructives
- Conversation/chat endpoints, system prompt + guardrails
- **Checkpoint**

## Phase 8 — AI CRM Features

- Lead scoring, summaries, next action, follow-up generation, property matching, deal forecasting, sales analytics, neglect detection, daily briefing, copilot
- Redis caching per AI.md rules
- **Checkpoint**

## Phase 9 — AI Frontend

- AI components (AIBadge, AIScoreBar, AINextAction, AISummaryPanel, AIFollowUpGenerator, AIPropertyMatches, AIDealForecast, AICopilotPanel, AIDailyBriefing, AIUsageWidget, AIConfirmDialog, AICommandBar)
- AI-derived values visibly labeled as AI
- **Checkpoint**

## Phase 10 — Dashboards

- Main dashboard (pipeline, tasks today, recent activity, briefing), copilot, analytics (revenue/pipeline/conversion/funnel/deals by stage/natural-language), team performance, AI usage
- **Checkpoint**

## Phase 11 — Redis + BullMQ

- Jobs: DailyBriefing, NeglectDetection, MaterializedViewRefresh, LeadScoring (event-driven, debounced)
- Retry/backoff/idempotency/logging/failure/dead-letter
- Materialized view + refresh
- **Checkpoint**

## Phase 12 — Observability

- Structured logs, per-AI-request metrics, audit log, tracing propagation (backend→provider→tools→jobs)
- **Checkpoint**

## Phase 13 — Security Hardening + Red-Team (Agent 4)

- Cross-tenant, IDOR, privilege escalation, JWT abuse, rate-limit bypass, SQLi, XSS, CSRF, uploads, prompt injection, tool abuse, AI permission bypass, data/secret leakage
- Fix every finding + regression test
- **Checkpoint**

## Phase 14 — Performance Optimization

- Backend: N+1, pagination, indexes, pool; Frontend: bundle, requests, rerenders, lazy load; Redis cache audit; AI timeouts/token/cost limits
- **Checkpoint**

## Phase 15 — CI/CD + Docker + Deployment

- Docker compose (backend/frontend/worker/postgres/redis) with health checks
- CI pipeline (install/lint/typecheck/unit/integration/build/E2E/security)
- Deploy dev→staging→prod, migrations, backups + restore verification
- **Checkpoint**

## Phase 16 — Full QA

- Full test suite, load tests, failure tests, regression sweep, accessibility pass
- **Checkpoint**

## Phase 17 — Final Production Audit + Report

- Agent 5 coordinates; all 5 agents verify their domain
- Final report (46 sections): status per COMPLETE/PARTIAL/INCOMPLETE/DEFERRED/UNVERIFIED
- No unverified claims of completion
- **Checkpoint / go-live decision**

## Standing Rules

- Small logical commits; never commit secrets/.env.
- Every phase ends with checkpoint; BLOCKED stops work.
- Update `.ai/` memory + docs after every phase.
- DoD per master prompt §44 for every feature.