---
name: third-party-integrations
description: Integration domain guide — the catalog of standard integration patterns
domain: integrations
phase: development
priority: medium
inputs: [api-research]
outputs: [integration-patterns]
dependencies: [research/api-research, development/integration-implementation]
next_skills: [testing/api-testing]
---

# Third-Party Integrations — Domain Catalog

The DECISION layer: `research/api-research.md` (evaluate/select). The IMPLEMENTATION discipline: `development/integration-implementation.md` (adapters/webhooks). THIS = the pattern catalog per integration-category — what's category-specific beyond the universal adapter rules.

## Payments (Stripe/Paddle-class — the money category)

- Full engine: `development/payments.md` (provider abstraction, webhooks-as-truth, idempotency, dunning, PCI minimization). Category-addition: **financial reconciliation** (provider balance vs our records — scheduled job, variance alerts; per `data/data-governance-quality.md` correctness checks applied to money)

## OAuth (the identity category — per `architecture/auth-architecture.md` models)

- OAuth-in (we consume: social login/OIDC): state-parameter validated (CSRF per `security/xss-csrf.md`), token-storage per client-type (never localStorage per `security/auth-security.md`), provider-depersistence (provider outage ≠ login-lockout: fallback path per `architecture/scalability-reliability.md` degradation)
- OAuth-out (we ARE a provider: API access for consumers): per `architecture/api.md` consumer contracts — scopes minimal + docs + token-lifecycle (rotation/revocation per `security/auth-security.md` rules); consumer rate-limits per `security/api-security.md`

## Email/SMS/Notifications (the messaging category)

- Deliverability engineering: `marketing/email.md` (SPF/DKIM/DMARC, warm-up, hygiene) for email; SMS: consent EXPLICIT (regulatory-strict per `compliance/legal.md` — text-to-confirm patterns), cost-guards (SMS = per-message money: budgets + per-user caps per `development/ai-features.md` cost-control philosophy)
- Multi-channel routing: per `platform/platform-services.md` notification-platform (preference-aware, event-driven) — integrations register as channels, features never call them directly

## Analytics (the measurement category)

- Consent-gated loading (per `development/legal-compliance.md` cookie rules: no non-essential scripts pre-consent); event taxonomy per `marketing/analytics.md` — integrations carry the taxonomy OUT (server-side event forwarding where possible: ad-blockers/delight both improve)
- Attribution data flows per `marketing/funnel.md` definitions (single-source rule — the integration transports, never re-defines)

## Storage/CDN (the content category)

- Per `architecture/infrastructure-designs.md` storage tiering + signed URLs; CDN: cache-keys + invalidation discipline (its cache contract), asset-integrity (SRI for third-party scripts per `security/hardening.md` headers)

## Search (the discovery category)

- Index-sync integrations per `architecture/infrastructure-designs.md` search design (event-driven indexing, lag-SLO, reindex path) — vendor swap = one adapter rewrite per the ADR exit-plan (`research/api-research.md`)

## Maps/Geo (the spatial category — when product needs them)

- Client-side: API-key restrictions (referrer + API-scoped keys per `security/secrets.md` — a leaked unrestricted map-key = someone else's bill); tile-cost budgets (impressions = money)
- Server-side geocoding: batch + cache (per `architecture/infrastructure-designs.md` caching rules — geocode-the-same-address-1000× = the classic waste)

## External Services — General (everything else: CRMs, helpdesks, ERPs)

- The universal rules apply in full (`development/integration-implementation.md`); category-additions: **sync-direction declared** (who-owns-which-fields per `data/data-governance-quality.md` ownership — two-way sync without field-ownership = data-corruption machine); **conflict policy explicit** (last-write-wins/merge-rules — declared per field-pair, tested per `testing/advanced-test-types.md` contract tests)

## Validation Checklist

- [ ] Every active integration: category-patterns applied + universal rules (the parent skill's checklist)
- [ ] Money/identity categories use their dedicated engine skills (not this catalog alone)
- [ ] Sync-direction + conflict policy documented where bidirectional

## Handoff

→ new integration: `research/api-research.md` first; implementation + this catalog; testing per `testing/api-testing.md`.
