---
id: T-506
title: "Frontend: Expand E2E test coverage"
owner: @qa
status: TODO
created: 2026-09-22
---

# Summary

Add more comprehensive E2E tests for core CRM features: leads, customers, deals, properties, tasks, activities.

# Acceptance Criteria

- E2E tests for: leads CRUD, customers CRUD, deals pipeline, properties, tasks, activities
- Tests cover happy paths and error cases
- All tests pass in CI
- Coverage >80% of user flows

# Implementation Steps

1. Add test fixtures/data setup
2. Create page objects for common interactions
3. Write tests for:
   - Leads: list, create, edit, convert, delete
   - Customers: list, create, edit, delete
   - Deals: pipeline view, create, stage change, close
   - Properties: list, create, edit, delete
   - Tasks: list, create, complete, delete
   - Activities: list, create, filter
4. Add API mocking for isolated tests
5. Run full test suite

# Tests

- `npm run test` → all new tests pass
- No flaky tests

# Risks

- Tests require backend API (integration vs unit)
- Test data management complexity
- Authentication state management

# Next Steps

- T-507: Performance testing setup