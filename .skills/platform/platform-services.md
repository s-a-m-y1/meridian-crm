---
name: platform-services
description: Platform-level services — tenancy, billing, subscriptions, search-as-platform
domain: platform
phase: development
priority: medium
inputs: [architecture, payments, auth]
outputs: [platform-services]
dependencies: [development/payments, architecture/auth-architecture]
next_skills: [testing/integration]
---

# Platform Services

The cross-feature capabilities every serious SaaS needs — designed ONCE at platform level (not re-built per feature): multi-tenancy, billing/subscriptions, notifications platform, search, storage.

## 1. Multi-Tenancy (the decision that shades everything — ADR required)

| Model                     | Isolation    | Cost           | When                                                   |
| ------------------------- | ------------ | -------------- | ------------------------------------------------------ |
| Shared schema + tenant_id | logical only | cheapest       | default start — with ROW-LEVEL enforcement (see rules) |
| Schema-per-tenant         | medium       | migrations × N | compliance-tier demands, moderate tenant count         |
| DB-per-tenant             | strong       | ops × N        | enterprise/few large tenants                           |

- **Shared-schema rules (the model with the most rope)**: tenant_id on EVERY tenant-scoped row (constraint-enforced); **row-level security in the DB** (Postgres RLS or equivalent — NOT app-code-only filters: one missed WHERE = cross-tenant leak, the SaaS catastroph); connection/context sets tenant per request (middleware-established, per `architecture/auth-architecture.md` guard chokepoint philosophy); tenant isolation TESTS per CRUD surface (per `testing/api-testing.md` IDOR-style probes — cross-tenant data access = CRITICAL)
- Tenant lifecycle: provisioning (seed data + admin user), suspension (data-preserved denial per billing state), deletion (export + purge per `data/data-governance-quality.md` §5 —GDPR applies to tenants' end-users too)

## 2. Billing Platform (per `development/payments.md` engine discipline, platform-ized)

- Plan/entitlement model: plan → features/limits matrix (per `business/pricing.md` tiers) driving **server-side enforcement** (entitlement checks in the authorization layer per `security/api-security.md` mass-assignment + tier rules — client-side gating is decoration)
- Subscription state machine: trial → active → past_due (dunning per `development/payments.md`) → suspended → cancelled (events emitted per `architecture/event-driven.md` — features react: suspension → access-grace → lock)
- Usage metering (usage-priced plans): metered events → aggregation → invoicing (idempotent per event id per `development/background-services.md`); meter accuracy tested (billing disputes are trust events)

## 3. Platform Notification Service (per `development/background-services.md` — the internal platform)

- One service: event-driven, preference-aware, multi-channel (in-app/email/push); features NEVER call email/SMS directly — they emit domain events, the platform maps them (per `architecture/event-driven.md` decoupling)
- Templates + locales centralized (per `development/i18n-rtl.md`); digest/batching rules; per-tenant branding hooks (B2B: white-label sender)

## 4. Platform Search & Storage

- Search: the platform exposes search-as-service over indexed entities (per `architecture/infrastructure-designs.md` search design — indexing pipeline + entity registration); features declare searchable fields, not build their own engines
- Storage: platform bucket policy (per-entity prefixes, signed-URL issuance service, quota per plan per billing matrix); features request storage-scoped tokens, never raw credentials

## Rules

- Platform = product for developers (internal DX per `core/engineering-principles.md` DX attribute): clean APIs, docs, versioned contracts — features consuming it are its users
- Build platform services JUST-IN-TIME: 2nd-or-3rd consumer extraction (per `design/design-system.md` ≥2-use rule — premature platform = speculative architecture)

## Validation Checklist

- [ ] Tenancy model ADR'd; RLS enforced + cross-tenant tests green
- [ ] Entitlement matrix server-side enforced; subscription state machine evented
- [ ] Notifications/search/storage consumed via platform APIs only

## Handoff

→ isolation tests `testing/api-testing.md`; state events → `architecture/event-driven.md` consumers.
