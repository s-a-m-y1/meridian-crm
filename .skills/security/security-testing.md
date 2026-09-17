---
name: security-testing
description: Security testing execution — SAST, DAST, pen-test coordination, vulnerability validation
domain: security
phase: testing
priority: high
inputs: [threat-model, api-implementation]
outputs: [security-test-results]
dependencies: [security/threat-modeling, testing/advanced-test-types]
next_skills: [security/vulnerability-management, review/security-review]
---

# Security Testing

## The Layers (automated floor → human ceiling)

### 1. SAST (static — CI stage per `devops/ci.md` security stages)

- Linter-security rules + static analyzers (per language); findings triaged NOT auto-trusted: false-positive rate known + tuned (a noisy SAST gate trains everyone to click-through — worse than none)
- Secret scans (per `security/secrets.md` — patterns + history scans, same discipline)

### 2. DAST (dynamic — running app)

- Automated scanners (OWASP ZAP-class) against staging with authenticated crawling (login-aware — scanning only public pages = theater for logged-in apps)
- Scheduled + pre-release runs; findings correlated with the threat model (per `security/threat-modeling.md` — scanner noise vs. actual attack-surface priorities)
- The API security probes already in `testing/api-testing.md` = the DAST baseline written by us (injection/malformed/oversized/permission probes — scanners ADD, not replace)

### 3. Penetration Testing (human-orchestrated — agents coordinate, humans/ specialists execute)

- When: pre-launch (major), annually (compliance per `compliance/compliance-review.md`), after major auth/payment surface changes, per `security/threat-modeling.md` refresh triggers
- Agent's job = the PREP + the TRIAGE, not the pen-test itself:
  - Prep: scope doc (endpoints, roles, environments, rules-of-engagement), threat-model top-risks handed to testers (they test OUR priorities, not generic checklists), test-env with realistic data (per `testing/test-infrastructure.md` — NOT prod, NOT prod data per `compliance/legal.md`)
  - Triage: findings → severity via `review/code-review.md` model + REACHABILITY (per `security/dependency-security.md` triage discipline — exploit-conditions × our-usage); re-test after fixes (validation, not trust)
- Report handling: findings NEVER public before fixed; coordinated disclosure per `research/security-research.md` vendor-transparency rules

### 4. Vulnerability Validation (the step everyone skips)

- Every finding (scanner/pen-test/CVE): VALIDATED — reproduced or reachability-proven before it drives work (phantom vulns burn cycles; dismissed-real vulns burn companies — validation is the difference, per `development/debugging.md` evidence discipline)
- Fix verification: re-scan/re-test + regression suite per `testing/regression.md` (security fixes are code changes — full loop)

## Validation Checklist

- [ ] SAST tuned (FP rate known); DAST authenticated; both in CI/pre-release
- [ ] Pen-tests scheduled per triggers; agent prep/triage protocol followed
- [ ] Every finding validated-before-worked; fixes verified-by-re-test

## Handoff

→ validated findings → `security/vulnerability-management.md` (the management lifecycle); gate evidence → Gate 5.
