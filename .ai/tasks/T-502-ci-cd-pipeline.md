---
id: T-502
title: "CI/CD: GitHub Actions pipeline for backend + frontend"
owner: @ops
status: TODO
created: 2026-09-22
---

# Summary

Create GitHub Actions workflow for CI/CD: lint, typecheck, test, build, docker, deploy.

# Acceptance Criteria

- `.github/workflows/ci.yml` runs on push/PR
- Backend: typecheck, lint, test, build
- Frontend: typecheck, lint, test (playwright), build
- Docker images build successfully
- Artifacts uploaded for review

# Implementation Steps

1. Create `.github/workflows/ci.yml`
2. Backend job: checkout, setup node, cache, install, typecheck, lint, test, build
3. Frontend job: checkout, setup node, cache, install, typecheck, lint, test, build
4. Docker job: build backend/frontend images
5. Add required secrets (if any)
6. Test pipeline on push

# Tests

- Push to feature branch → CI runs
- All jobs pass
- Docker images build

# Risks

- Playwright needs browser installation in CI
- Database needed for backend tests (use testcontainers or sqlite)
- Node version compatibility

# Next Steps

- T-503: Staging deployment
- T-504: Production deployment with k8s