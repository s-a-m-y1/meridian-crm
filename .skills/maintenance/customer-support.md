---
name: customer-support
description: Support operations — tickets, feedback loop, CSAT, knowledge base, escalation
phase: maintenance
priority: medium
inputs: [gtm-plan, finance]
outputs: [support-program]
dependencies: [business/growth, observability/incident-response]
next_skills: [documentation/maintenance, development/bug-fix]
---

# Customer Support

## Rules

1. **Support is a feedback loop, not a cost center**: every ticket is a product signal. Tags + volume + sentiment → roadmap input (`product/roadmap.md`).
2. **Tiered support with SLAs**:
   - Tier 1 (self-serve): knowledge base, chatbot, community — 80% of volume
   - Tier 2 (human): email/chat — 4h first response, 24h resolution target
   - Tier 3 (engineering): bugs/escalations — 1h acknowledgment, fix per severity
3. **Ticket lifecycle**: open → triage (tag, priority, assign) → in-progress → waiting-on-customer → resolved → closed (auto-close after 72h no reply, reopen allowed).
4. **Knowledge base** (living document):
   - Article per top-20 issues (from tags), updated when fix ships
   - Searchable, linked from product UI, in-app widget
   - Analytics: views, helpful votes, search failures → new articles
5. **CSAT/NPS**: survey on close (1-5 + optional comment); NPS quarterly. Alert on CSAT < 4.0 or NPS drop > 10pts.
6. **Feedback loop**: weekly "top 5 signals from support" → product meeting (tags + volume + sentiment). Product owner triages: bug → `development/bug-fix.md`, feature → `product/roadmap.md`, doc → `documentation/*`.
7. **Escalation paths**: security → `observability/incident-response.md` + `security/threat-modeling.md`; billing → `payments.md`; legal → `legal-compliance.md`; outage → `observability/incident-response.md`.
8. **Tools**: helpdesk (Linear/Zendesk/Intercom) + knowledge base (Notion/GitBook) + in-app widget — all integrated with auth for user context.

## Validation Checklist

- [ ] SLA targets defined per tier + measured
- [ ] Tag taxonomy stable; top-10 tags reviewed monthly
- [ ] KB article per top-20 tags; updated within 48h of related fix
- [ ] CSAT/NPS tracked; alert on threshold breach
- [ ] Weekly support→product signal handoff documented

## Handoff

→ `product/roadmap.md` (signals), `development/bug-fix.md` (bugs), `documentation/*` (KB), `business/growth.md` (NPS/churn signals).
