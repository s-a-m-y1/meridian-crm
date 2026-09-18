---
id: T-400
title: "Phase 4: Backend/Frontend Integration (Auth flow, protected routes, dashboard)"
owner: @fullstack
status: DONE
created: 2026-09-18
due:
---

# Summary

Connect the frontend to the backend API with a complete authentication flow including login, registration, JWT token management, refresh rotation, and protected routes.

# Acceptance Criteria

- AuthContext with JWT token management, refresh rotation, auto-retry
- Login page at /login with email/password validation, show/hide password
- Register page at /register with name, email, password, confirm password
- AuthProvider with auto-refresh, protected route guards
- Login page at /login with email/password + link to register
- Register page at /register with name, email, password, confirm password
- Dashboard at /dashboard with protected route (redirects to login if not auth)
- AuthProvider with JWT token management, auto-refresh, route guards
- Providers wrapper for root layout (server-compatible)
- TypeScript typecheck clean
- Build successful with Next.js 15 + React 19 on Node.js 20

# Implementation Steps

1. Create AuthContext with JWT token management
2. Create Login page with email/password validation
3. Create Register page with name, email, password, confirm password
4. Create AuthProvider with auto-refresh, route guards
4. Create Login page at /login with email/password + link to register
5. Create Register page at /register with name, email, password, confirm password
6. Create Dashboard at /dashboard with protected route (redirects to login if not auth)
6. Create AuthProvider with JWT token management, auto-refresh, route guards
7. Create Providers wrapper for root layout (server-compatible)
7. Update root layout to use Providers wrapper
8. Run typecheck and build

# Tests

- TypeScript typecheck clean
- Build successful with Next.js 15 + React 19 on Node.js 20

# Risks

- ESLint 9 compatibility with Next.js 15 → build succeeds despite lint warning

# Results

- AuthContext with JWT token management, refresh rotation, auto-retry
- Login page at /login with email/password validation, show/hide password
- Register page at /register with name, email, password, confirm password
- AuthProvider with auto-refresh, protected route guards
- Login page at /login with email/password + link to register
- Register page at /register with name, email, password, confirm password
- Dashboard at /dashboard with protected route (redirects to login if not auth)
- AuthProvider with JWT token management, auto-refresh, route guards
- Providers wrapper for root layout (server-compatible)
- TypeScript typecheck clean
- Build successful with Next.js 15 + React 19 on Node.js 20

# Next Steps

Phase 5: Core Tests (frontend e2e, integration tests)