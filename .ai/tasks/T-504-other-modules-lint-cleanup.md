---
id: T-504
title: "Backend: Other modules - fix unused imports and dead code"
owner: @dev-be
status: TODO
created: 2026-09-22
---

# Summary

Clean up remaining backend lint warnings across modules: activities, auth, customers, dashboard, deals, files, leads, notes, properties, queues, security, tasks, users.

# Acceptance Criteria

- `npm run lint` shows 0 warnings for all backend modules
- All unused imports removed or prefixed with `_`
- No functional changes

# Implementation Steps

1. Fix `activities` module: unused imports/params
2. Fix `auth` module: unused imports in spec
3. Fix `customers` module: unused imports in spec
4. Fix `deals` module: unused DTO imports
5. Fix `files` module: unused AWS SDK imports, unused params
6. Fix `leads` module: unused entity imports, unused service imports
7. Fix `notes` module: unused DTO imports
8. Fix `properties` module: unused imports, unused params
9. Fix `queues` module: unused Worker import, unused variable
10. Fix `scheduled-jobs`: unused callback params
11. Fix `security` module: unused imports, unsafe Function type (already fixed)
12. Fix `observability` module: unused imports
13. Fix `app.module.ts`: unused HealthModule
14. Fix `database/data-source.ts`: unused variables
15. Fix `tests/auth.e2e-spec.ts`: unused variables

# Tests

- `npm run lint` → 0 warnings overall
- `npm run test` → all tests pass
- `npm run typecheck` → passes

# Risks

- Some unused params required by interface contracts
- Auto-fix may not catch all cases

# Next Steps

- T-505: Frontend typecheck/lint cleanup