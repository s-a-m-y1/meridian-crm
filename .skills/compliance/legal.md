---
name: legal-compliance-domain
description: Legal review flags, privacy ops, ToS/privacy-policy maintenance, consent, audits
domain: compliance
phase: compliance
priority: high
inputs: [legal-compliance-implementation]
outputs: [compliance-program]
dependencies: [development/legal-compliance]
next_skills: [compliance/compliance-review]
---

# Legal & Compliance Domain

The COMPLIANCE-PROGRAM layer: `development/legal-compliance.md` = the engineering implementation (privacy-by-default, GDPR mechanics, docs generation). THIS = ongoing program ops + the legal-boundary discipline.

## The Prime Directive (agent-legal boundary)

**Agents never present legal conclusions as fact.** Every legal-output carries: `LEGAL-REVIEW-REQUIRED` flags where judgment is involved + the distinction between EXECUTION (mechanical compliance we can do: cookie banners, DPA registers) and ADVICE (interpretation: "does GDPR apply to X", contract risk, regulatory strategy). Templates drafted by agents get human counsel sign-off before publication (`business/partnerships.md` legal-flag rule, generalized).

## 1. Regulatory Requirements Mapping (the "what applies to us" registry)

- Applicable-regulation inventory by product reality (user geographies per `marketing/analytics.md` locale data, data classes per `data/data-governance-quality.md` classifications, industry rules — payments/health/kids each add regimes)
- Per regulation: obligations that bind US (as processor/controller per role) + rights we must honor + deadlines (72h breach per `development/legal-compliance.md`; DSAR windows) — the registry maintained per `.ai/decisions/` D-records as product-shape changes
- Registry reviewed: quarterly + at every market/data-class expansion trigger (per `data/data-governance-quality.md` classification-change triggers)

## 2. Legal Document Lifecycle (the docs as living contracts)

- **Terms of Service / Privacy Policy**: versioned + dated + change-notification mechanics (per `development/legal-compliance.md` generation rules + `maintenance/deprecation.md` window philosophy — material changes get notice windows, not silent edits)
- **Cookie/consent records**: consent-proof stored (timestamp + version + categories per `development/legal-compliance.md`) — consent is EVIDENCE: retrievable per user on demand (DSAR-support)
- **DPA register**: every subprocessor + signed agreement + review dates (per `development/legal-compliance.md` annual review — vendor-changes trigger same-day register updates per `core/agent-rules.md` docs-sync)

## 3. Consent Management (ops beyond the banner)

- Consent-state machine: granular categories (necessary/analytics/marketing/functional per `development/legal-compliance.md`), equal-accept/reject, withdraw-as-easy-as-grant (mechanics wired: withdraw → downstream integrations informed per `data/data-governance-quality.md` lineage — consent propagates to every consumer of the data)
- Consent-aware pipelines: non-consented categories EXCLUDED at ingest-or-forward (per `integrations/third-party-api.md` consent-gated analytics — not "collected and filtered later")

## 4. Audit & Records (the compliance evidence system)

- Evidence registry: what proves each obligation (DSAR-response logs, consent-proofs, DPA signatures, retention-execution proofs per `maintenance/data-operations.md` sweeps, breach-drill records per `architecture/disaster-recovery.md`)
- Audit-log integrity per `security/platform-container-security.md` (append-only, access-controlled) — compliance audits READ these; the registry maps obligations → their log-source (per `data/data-governance-quality.md` lineage discipline applied to evidence)
- Audit-readiness drill (annual): a mock request answered from the registry (e.g. "prove DSAR compliance for Q3") — readiness measured, not assumed (per `quality-gates/gates.md` evidence-or-didn't-happen)

## 5. Breach/Legal Incident Interface (where compliance meets incidents)

- Security-incident handler per `observability/incident-response.md`; THIS adds the legal-clock: 72h regulator assessment (per `development/legal-compliance.md` breach rules — the IC assigns a compliance-liaison role in the response structure), user-notification thresholds, privilege-discipline (counsel-involved investigation lanes per legal counsel direction — agents follow the human lawyer's process rules there)

## Validation Checklist

- [ ] Regulation registry current; every output judgment-flagged; counsel sign-offs recorded
- [ ] Docs versioned + change-noticed; consent-state machine + propagation tested
- [ ] Evidence registry mapped to logs; annual readiness drill run

## Handoff

→ review: `compliance/compliance-review.md`; engineering execution: `development/legal-compliance.md`; incidents: `observability/incident-response.md` (+ this skill's §5).
