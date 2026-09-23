---
id: T-500
title: "Backend: Fix lint warnings (unused vars, no-case-declarations)"
owner: @dev-be
status: TODO
created: 2026-09-22
---

# Summary

Clean up 149 lint warnings in backend: unused variables, no-case-declarations, and other eslint issues.

# Acceptance Criteria

- `npm run lint` passes with 0 errors, 0 warnings
- All unused imports removed or prefixed with `_`
- Switch case blocks use proper block scoping
- No functional changes to code behavior

# Implementation Steps

1. Fix `no-case-declarations` in `dashboard.service.ts` (already done)
2. Fix `no-unsafe-function-type` in `validation.pipe.ts` (already done)
3. Remove unused imports across all files (prefix with `_` or remove)
4. Fix unused function parameters (prefix with `_`)
5. Run `npm run lint --fix` to auto-fix where possible
6. Manually fix remaining warnings

# Tests

- `npm run lint` → 0 errors, 0 warnings
- `npm run test` → all 24 tests pass
- `npm run typecheck` → passes

# Risks

- Some unused params may be required by interface (prefix with `_` instead of removing)
- Auto-fix may not catch all cases

# Next Steps

- T-501: Frontend E2E test infrastructure
- T-502: CI/CD pipeline setup