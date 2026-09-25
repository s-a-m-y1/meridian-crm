# Changelog

All notable changes to this project are documented here.
Format: Keep a Changelog (see `.skills/documentation/changelog.md`). Versioning: SemVer.

## [Unreleased]

### Added

- 2026-09-24 — **Online demo deployed**: Vercel frontend (https://meridian-crm-xi.vercel.app) + Neon PostgreSQL (eu-central-1) + backend/Redis on dev machine exposed via Cloudflare quick tunnel. Demo login works over the public URL.
- `scripts/online-demo.sh` — manages the live demo (start/stop/status/url; re-points Vercel env + redeploys on tunnel URL rotation).
- `backend/scripts/sync-schema.ts` — one-off TypeORM schema sync to any Postgres (SSL-aware), used to provision Neon.
- `deploy/hf/` — Dockerfile + start.sh + docs for a Hugging Face Space build (backend with embedded Redis). Not deployed: HF now requires PRO for Docker Spaces; kept for reuse on other Docker hosts.
- Backend: `PGSSL=true` env now enables TLS for the TypeORM connection (needed for Neon/managed Postgres) — `configuration.ts` + `app.module.ts`.

### Changed

- README/DEPLOYMENT updated with the live URLs and demo operations.

- 2026-09-25 — **Permanent serverless deploy**: backend now runs on Vercel
  (`meridian-crm-api` → https://meridian-crm-api-two.vercel.app) with Neon
  PostgreSQL — demo is online 24/7 with zero card-required services.
  Frontend repointed via `NEXT_PUBLIC_API_URL_INTERNAL`.
- `api/index.ts` + `src/app-bootstrap.ts` (shared Nest factory) + `vercel.json` (v2 rewrites).
- Conditional modules: `QUEUES_ENABLED` / `REALTIME_ENABLED` env flags lazy-load
  QueueModule (BullMQ) and RealtimeModule — required because `@nestjs/bullmq` is
  ESM-only and crashes Vercel's CJS runtime even when unused.
- `AI_PROVIDER=mock` explicit opt-in allowed in production (demo tier without AI keys).
- security.controller.ts alias imports → relative (esbuild compatibility).

## 2026-09-16 — HISN audit scaffold

- Added `.ai/tasks/T-100-HISN-website.md`, `T-101-HISN-android.md`, `T-102-HISN-backend.md`, `T-103-HISN-security.md`.
- Added `website/` skeleton with WebGL canvas and SVG fallback.
- Updated project phase to Discovery.

### Changed

-

### Fixed

-

### Security

-
