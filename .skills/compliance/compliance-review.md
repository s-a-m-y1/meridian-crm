---
name: compliance-review
description: Periodic compliance verification against the obligation registry
domain: compliance
phase: compliance
priority: medium
inputs: [legal-compliance-program]
outputs: [compliance-verdict]
dependencies: [compliance/legal]
next_skills: [quality-gates]
---

# Compliance Review

The verification loop of the compliance program (the PROGRAM: `compliance/legal.md`; the ENGINEERING baseline: `development/legal-compliance.md`). Runs: quarterly + at triggers (regulation change, market expansion, data-class additions, audit requests, post-incident).

## Workflow

1. **Scope from the registry**: obligations registered in `compliance/legal.md` §1 = the checklist source (not generic best-practices — OUR obligations, per OUR product-shape). Each obligation maps to its evidence-source per §4.

2. **Verify mechanically where possible, flag where judgment** (the boundary discipline):

   | Area               | Mechanical checks (agent-executable)                                                                                                                                                                        |
   | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Privacy policy     | live version matches registry version; dated + accessible; change-history intact                                                                                                                            |
   | Consent            | banner behavior per spec (granular/equal-reject per `development/legal-compliance.md`); consent-proofs retrievable (sampled DSAR-style check); withdraw-paths work + propagate per `compliance/legal.md` §3 |
   | DSAR readiness     | response-time simulated (a test request executed end-to-end per `data/data-governance-quality.md` deletion-contract testing)                                                                                |
   | Retention          | schedule vs actual purge-job records per `maintenance/data-operations.md` evidence                                                                                                                          |
   | DPAs               | register complete vs actual subprocessor list (cross-checks `development/integration-implementation.md` adapter inventory — an unregistered integration = finding)                                          |
   | Breach readiness   | 72h-path testable per `compliance/legal.md` §5; drill records present per `architecture/disaster-recovery.md`                                                                                               |
   | Audit logs         | append-only integrity per `security/platform-container-security.md`; retention-contract match                                                                                                               |
   | Regulatory changes | registry delta since last review (new/changed obligations → tasked)                                                                                                                                         |

3. **Findings** (per `review/code-review.md` format+severity — compliance-grade):
   - CRITICAL: regulatory exposure live (unregistered subprocessor, consent-broken, DSAR-overdue-capability)
   - HIGH: evidence-gaps on binding obligations; MEDIUM: register-stale/process drift; INFO: improvement notes
   - Every finding: LEGAL-REVIEW-REQUIRED where interpretation involved + owner + remediation window (tightened by contract deadlines per `security/vulnerability-management.md` SLA philosophy)

4. **Verdict + record**: PASS (evidence-backed per area) / FAIL (any CRITICAL/high — remediation before affected releases per `quality-gates/gates.md` gate-5 interaction) — verdict + evidence archived in the audit registry (this review is ITSELF evidence per `compliance/legal.md` §4: self-inspection documented)

5. **Feed forward**: findings → `core/task-management.md` with compliance-priority; systemic findings (repeated area) → process fix in the program skill per `observability/root-cause-analysis.md` preventive loop

## Validation Checklist

- [ ] Scope = registry obligations (ours, not generic); evidence-linked per area
- [ ] Judgment areas flagged + human-reviewed; findings owned + windowed
- [ ] Verdict archived as self-inspection evidence

## Handoff

→ remediation tasks → owners; CRITICALs → release gating per `quality-gates/gates.md`; records → audit registry.
