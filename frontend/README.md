# Meridian CRM — Frontend

Next.js 15 (App Router) + React 19 + Tailwind CSS frontend for the Real Estate CRM.

This is the frontend package of the monorepo. The repo root README documents the
AI Skills System (`.skills/`) — this README documents the frontend app only.

## Stack

- **Next.js 15** (App Router) + **React 19**
- **Tailwind CSS** + **lucide-react** icons
- **TanStack Query**-ready API client (`src/lib/api.ts`) with JWT refresh handling
- **React Hook Form + Zod** for forms
- **Playwright** for E2E tests

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
```

The frontend expects the backend at `http://localhost:4000/api/v1` (override with
`NEXT_PUBLIC_API_URL`). The fastest way to run the full stack:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run test` | Playwright E2E (auto-starts dev server) |

## Structure

```text
src/
  app/            # App Router pages (dashboard, leads, customers, ...)
  components/     # Feature components (ai/, dashboard/, layout/, ...) + ui/ primitives
  lib/            # api client, auth context, utils
  middleware.ts   # Auth route protection
public/           # Icons, manifest
e2e/              # Playwright specs
```

## Pages

- `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email` — auth
- `/dashboard` — stats, recent leads/tasks/activities, AI insights
- `/leads` — Kanban board with status pipeline
- `/customers`, `/properties`, `/deals`, `/tasks`, `/activities` — CRUD pages
- `/settings` — profile settings
