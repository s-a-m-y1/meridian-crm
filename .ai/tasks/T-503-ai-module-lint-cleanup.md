---
id: T-503
title: "Backend: AI module - fix unused imports and dead code"
owner: @dev-be
status: TODO
created: 2026-09-22
---

# Summary

Clean up AI module lint warnings: 40+ unused imports/variables across AI services and controllers.

# Acceptance Criteria

- `npm run lint` shows 0 warnings for `backend/src/ai/**`
- All unused imports removed or prefixed with `_`
- Dead code removed
- No functional changes

# Implementation Steps

1. Fix `ai.module.ts`: remove unused `Global` import
2. Fix `ai.controller.ts`: prefix unused params with `_` or remove
3. Fix `ai-context.service.ts`: remove unused `NotFoundException`
4. Fix `ai-orchestrator.service.ts`: remove unused imports
5. Fix `ai-permissions.service.ts`: prefix unused params with `_`
6. Fix `ai-tools.service.ts`: prefix unused params with `_`
7. Fix `ai.service.ts`: remove unused type imports
8. Fix provider files: remove unused type imports
9. Fix service files: remove unused repository imports
10. Run `npm run lint --fix` then manual cleanup

# Tests

- `npm run lint` → 0 warnings for ai/**
- `npm run test` → all tests pass
- `npm run typecheck` → passes

# Risks

- Some unused params required by interface contracts
- AI module may have incomplete features (dead code)

# Next Steps

- T-504: Other module lint cleanup