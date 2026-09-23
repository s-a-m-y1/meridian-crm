---
id: T-501
title: "Frontend: E2E test infrastructure with Playwright webServer"
owner: @qa
status: IN_PROGRESS
created: 2026-09-22
---

# Summary

Configure Playwright with webServer to auto-start Next.js dev server for reliable E2E testing.

# Acceptance Criteria

- `npm run test` starts dev server automatically via webServer
- All 38 E2E tests run (24 pass, 14 skipped)
- No manual server management needed
- Tests run reliably in CI

# Implementation Steps

1. Add `webServer` config to `playwright.config.ts` (DONE)
2. Verify tests run with auto-started server (DONE - 24 pass, 14 skipped)
3. Add CI configuration for Playwright
4. Document test running procedure

# Tests

- `npm run test` → 24 passed, 14 skipped
- No manual `npm run dev` needed beforehand

# Risks

- webServer timeout may need adjustment for CI
- Port conflicts if multiple test runs

# Results

- Added webServer config to playwright.config.ts
- Tests now auto-start dev server on port 3000
- 24/38 tests pass (auth flow, login, register, dashboard)
- 14 skipped (firefox not installed in environment)

# Next Steps

- T-502: CI/CD pipeline with Playwright
- T-503: Add more E2E test coverage