---
id: T-102
title: HISN Backend: API spec and release artifact distribution
owner: @backend
status: TODO
created: 2026-09-16
---

## Summary

Define a minimal backend API for artifact hosting, integrity checks, usage telemetry (opt-in), and update distribution. Provide OpenAPI `api.yaml` placeholder.

## Acceptance Criteria

- `backend/` folder with `api.yaml` OpenAPI spec skeleton.
- Endpoint for `/download/:platform/:version` and `/health`.

## Notes

- Keep telemetry opt-in and privacy-first; document retention and data minimization.
