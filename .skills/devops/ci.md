---
name: ci
description: Continuous integration pipeline — build, test, gates
phase: devops
priority: high
inputs: [repo, docker-image]
outputs: [ci-pipeline, verified-artifacts]
dependencies:
  [docker, testing/strategy, security/secrets, security/dependency-security]
next_skills: [cd, review]
---

# Continuous Integration

## Pipeline Stages (fail fast, cheapest first)

```
1. Lint + format check        (seconds — fail early)
2. Typecheck                  (fast)
3. Unit tests                 (< 60s budget)
4. Build                      (incl. Docker image build)
5. Integration tests          (containers: DB per testing/strategy.md)
6. API contract tests         (+ schema drift check)
7. Coverage                   (changed-code budget per testing/coverage.md)
8. Security: secret scan + dependency audit
9. Bundle/perf budgets        (frontend, per development/performance-frontend.md)
10. E2E (on main / pre-release; PR-critical journeys only)
```

## Rules

1. **PR-opened triggers full pipeline** (stages 1-9); merge to main adds E2E + release-readiness checks. main must stay releasable — this is Gate 3+4 enforcement in automation.
2. Red main = **stop-the-line**: fixing main outranks feature work (agent picks it up as highest-priority task — per incident discipline).
3. Secrets from CI secret store only, least-privilege tokens per `security/secrets.md`; never echo them.
4. Artifacts: build once, reuse the tested artifact in CD (test what you ship — build IDs, not "rebuild from same commit", which can drift).
5. Caching (deps, docker layers) with integrity-preserving keys; cache poisoning = broken CI trust.
6. Flake handling per `testing/strategy.md`: quarantine + expiry + owner; auto-retry only with failure-class detection, never blind retries that hide real flake.
7. Required status checks: pipeline green is a merge precondition (`devops/git.md`); no admin bypass recorded anywhere.

## Validation Checklist

- [ ] All 10 stages present and ordered (fail-fast)
- [ ] Zero secrets in logs/config; least-privilege tokens
- [ ] Artifact promotion path (same artifact to CD)
- [ ] Red-main stop-the-line policy documented

## Handoff

→ green artifact → `cd.md` for deployment.
