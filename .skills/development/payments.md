---
name: payments
description: Payment integration — providers, subscriptions, webhooks, dunning, refunds
phase: development
priority: high
inputs: [pricing, bmc, finance]
outputs: [payment-integration]
dependencies: [security/api-security, security/secrets, development/api]
next_skills: [testing/api-testing, observability/monitoring]
---

# Payments & Billing

## Rules

1. **Correctness first**: a single charge error = lost trust + legal risk. All money code uses the payment provider's **test mode + idempotency keys** exclusively until production smoke passes.
2. **Provider abstraction**: internal code talks to a thin adapter (interface), not the provider SDK directly — swap Stripe ↔ Paddle without touching business logic.
3. **Idempotency mandatory**: every charge, refund, subscription action carries an idempotency key stored + replayed on retry (no double-charges ever).
4. **Webhooks are the source of truth**: subscription status, invoice.payment_failed, customer.updated — your DB mirrors the provider via webhooks; polling = fallback only.
5. **PCI scope minimized**: never handle raw card data — use hosted elements (Stripe Elements, Paddle Checkout) so card data never touches your servers.
6. **Dunning is automatic**: provider's retry logic + our webhook handler = grace period emails → access downgrade on final failure → data retention policy (per `legal-compliance.md`).
7. **Refunds traceable**: every refund linked to charge + reason code; partial refunds supported; idempotent; audit logged (per `observability/logging.md` discipline).
8. **Currency & tax**: prices stored in minor units (cents); tax via provider (Stripe Tax / Paddle handles VAT/MOSS) or separate service — never hardcode rates.

## Integration Checklist

- [ ] Adapter interface covers: create checkout, create subscription, cancel, pause, resume, update payment method, one-time charge, refund, webhook verification
- [ ] Test mode end-to-end: signup → trial → charge → cancel → refund → webhook replay
- [ ] Webhook signature verification on every handler (never trust raw body)
- [ ] Idempotency keys stored with unique constraint; retries replay same key
- [ ] Dunning emails configured (provider or custom): grace period → warning → downgrade → cancel
- [ ] Refund API: idempotent, audit logged, partial supported
- [ ] Currency stored as integer minor units; tax handled by provider or external service
- [ ] PCI: no card data in logs, DB, or code — only tokens from hosted elements

## Failure Handling

| Failure                              | Response                                                                   |
| ------------------------------------ | -------------------------------------------------------------------------- |
| Charge declined (insufficient funds) | Dunning starts; user notified; access grace period per policy              |
| Webhook signature invalid            | Reject 400; alert security; log for audit                                  |
| Provider outage                      | Idempotency + local queue → replay when back; user sees "processing" state |
| Refund failed                        | Alert ops; manual intervention with audit trail                            |

## Handoff

→ `testing/api-testing.md` (charge/refund/subscription webhooks), `observability/monitoring.md` (payment success rate, webhook latency), `legal-compliance.md` (tax, data retention).
