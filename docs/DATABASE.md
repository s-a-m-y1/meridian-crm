# Database — E-commers-Crm

Status: PLANNED. Final schema and migrations land in Phase 1.

## Engine

PostgreSQL 16. TypeORM migrations. `search_vector` tsvector + GIN indexes on leads/customers/properties.

## Core Tables

- `organizations` (id, name, currency, timezone, created_at, updated_at)
- `organization_members` (org_id, user_id, role, restricted_to_own_records)
- `organization_settings`
- `users` (id, email, name, password_hash)
- `customers` (id, org_id, name, phone, email, search_vector)
- `leads` (id, org_id, customer_id, owner_id, status, source, budget_min/max, requested_property_type, requested_location, AI: ai_score, ai_classification, ai_score_reasons, ai_scored_at, search_vector)
- `properties` (id, org_id, name, description, category, price, bedrooms, location, status [available/reserved/sold], search_vector)
- `deals` (id, org_id, lead_id, owner_id, property_id, value, stage, closed_at, AI: ai_close_probability, ai_forecast_updated_at)
- `tasks` (id, org_id, owner_id, lead_id, title, due_at, completed, completed_at)
- `activities` (id, org_id, lead_id, user_id, type [call/email/viewing/note/whatsapp], content) — append-oriented
- `notes` (id, org_id, lead_id, user_id, content)

## AI Tables

- `ai_usage_logs` (org_id, user_id, request_type, model, provider, input/output tokens, estimated_cost_usd, latency_ms, tool_calls, success, error_message)
- `ai_conversations` (org_id, user_id, title)
- `ai_messages` (conversation_id, role, content, tool_calls)
- `daily_briefings` (org_id, user_id, content, period)
- `lead_alerts`

## Engineering Rules

- Every tenant-owned entity has `organization_id` (FK, indexed).
- Every query org-scoped — enforced in service layer + data-source filters.
- FK constraints, unique constraints, check constraints, transactions.
- Index priority: org_id, org_id+owner_id, created_at, updated_at, FKs.
- tsvector columns maintained via triggers; GIN indexes.
- Materialized view `agent_performance` (agent, org, deals won, deals open, conversion) with unique index, refreshed by job — never on request.
- No blind index addition; verify query plans where needed.