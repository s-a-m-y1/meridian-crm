---
name: email-lifecycle
description: Email marketing — list building, lifecycle sequences, deliverability
phase: marketing
priority: medium
inputs: [gtm-plan, pricing]
outputs: [email-program]
dependencies: [business/gtm]
next_skills: [business/growth]
---

# Email Lifecycle

## Rules

1. **Consent only** (GDPR/CAN-SPAM): double opt-in or documented legitimate interest; unsubscribe one-click, honored ≤ 10 days (usually instant); sender identity real — compliance here is not optional (legal risk = product risk)
2. Every email has ONE job (one CTA) + declared purpose (activation/promo/education) + pass bar for its sequence
3. Segments decide content, not blasts: behavior > demographics

## Lifecycle Sequences (the core asset)

| Sequence              | Trigger         | Job                                                              | Typical length      |
| --------------------- | --------------- | ---------------------------------------------------------------- | ------------------- |
| Welcome               | signup          | set expectations + deliver first value fast                      | 2-3 emails          |
| Onboarding/Activation | signup          | reach first-value moment (activation def from `business/gtm.md`) | 4-6, behavior-gated |
| Re-engagement         | inactive N days | honest win-back or graceful sunset                               | 2-3                 |
| Renewal/upsell        | usage signals   | expand right-fit users (never blast non-fit)                     | 2                   |
| Transactional         | system events   | receipts, security — reliability = trust                         | —                   |

- Behavior gates: if user did X, skip/branch (clicked ≠ opened ≠ nothing) — static sequences ignoring behavior train users to ignore email
- Copy rules: subject = one clear promise (curiosity-gap headlines die in spam filters and trust); preview text extends it; skimmable body; one CTA repeated ≤ 2 times
- Onboarding content answers "what do I DO first" — product-relevant, not feature tours

## Deliverability Engineering

- SPF + DKIM + DMARC set (DNS, verified by test tools) — non-negotiable, affects ALL email
- Warm-up new domains/IPs gradually; monitor (bounce < 2%, complaints < 0.1%, list hygiene: remove inactive 6-12 months)
- Never buy lists (spam traps + legal exposure + dead deliverability)
- Engagement-based sending: prioritize active segments; sunset chronic non-openers

## Measurement

Per sequence: open, click, completion, and the PRODUCT metric it drives (activation rate for onboarding — open-rate vanity is banned per `business/growth.md` North-star discipline). A/B subjects with pre-declared bars; log everything to the growth log.

## Validation Checklist

- [ ] Compliance mechanical (double opt-in, unsubscribe, SPF/DKIM/DMARC verified)
- [ ] Sequences behavior-gated, each with job + pass bar
- [ ] Product metrics (not vanity) tracked per sequence

## Handoff

→ data to `business/growth.md`; activation sequences coordinate with product activation definition.
