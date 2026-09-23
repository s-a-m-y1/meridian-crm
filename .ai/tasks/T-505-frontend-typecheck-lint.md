---
id: T-505
title: "Frontend: Fix typecheck and lint issues"
owner: @dev-fe
status: TODO
created: 2026-09-22
---

# Summary

Fix remaining frontend TypeScript and ESLint issues.

# Acceptance Criteria

- `npm run typecheck` passes with 0 errors
- `npm run lint` passes (or only deprecation warnings)
- No functional changes

# Implementation Steps

1. Verify all typecheck errors fixed (already done for verify-email, settings)
2. Run `npm run lint` and fix any issues
3. Check for React 19 / Next.js 15 compatibility issues
4. Ensure all components have proper types

# Tests

- `npm run typecheck` → 0 errors
- `npm run lint` → passes
- `npm run test` → E2E tests pass

# Risks

- Next.js 15 ESLint deprecation warning (can't fix, migration needed)
- Some type issues may require component refactoring

# Next Steps

- T-506: Add more E2E test coverage