# API — E-commers-Crm

Status: PLANNED. Full spec generated during Phase 2 (backend). NestJS Swagger/OpenAPI will be the source of truth.

## Planned Endpoints (v1)

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `POST /auth/password/reset`

### Organizations
- `GET/PATCH /organizations/me`
- `GET/POST/DELETE /organizations/members`
- `PATCH /organizations/members/:id`

### CRM resources (all org-scoped, paginated, filterable)
- `GET/POST /customers`, `GET/PATCH/DELETE /customers/:id`
- `GET/POST /leads`, `GET/PATCH/DELETE /leads/:id`
- `GET/POST /properties`, `GET/PATCH/DELETE /properties/:id`
- `GET/POST /deals`, `GET/PATCH/DELETE /deals/:id`
- `GET/POST /tasks`, `GET/PATCH/DELETE /tasks/:id`
- `GET/POST /activities`, `GET/DELETE /activities/:id`
- `GET/POST /notes`, `GET/PATCH/DELETE /notes/:id`
- `GET /search?q=` (leads/customers/properties)

### Dashboard / Analytics
- `GET /dashboard/summary`
- `GET /analytics/*`, `GET /team/performance`

### AI
- `GET/POST /ai/conversations`, `GET/POST /ai/conversations/:id/messages`
- `GET /ai/leads/:id/score`, `GET /ai/leads/:id/summary`
- `GET /ai/leads/:id/next-action`, `GET /ai/leads/:id/follow-up`
- `GET /ai/properties/:id/matches`, `GET /ai/deals/:id/forecast`
- `GET /ai/copilot`, `GET /ai/daily-briefing`
- `GET /ai/usage` (per-org), `POST /ai/actions` (confirmation-gated writes)

## Error Shape (consistent)

```json
{ "statusCode": 422, "message": "Validation failed", "errors": [] }
```

## Rules

- Every endpoint authenticated; every query org-scoped.
- Write/destructive AI actions require confirmation.
- Never return password_hash, tokens, secrets.