---
name: workflow-security-audit
description: Full security audit — OWASP, infra, supply-chain, threat-model refresh
domain: workflows
phase: security
priority: high
inputs: [codebase, infrastructure]
outputs: [audit-report, fix-tasks]
dependencies:
  [
    security/owasp-top10,
    security/security-testing,
    security/vulnerability-management,
  ]
next_skills: [workflows/hotfix]
---

# Workflow: Security Audit

```
1.  Scope            → surfaces in-scope (app/infra/agents/integrations) + threat-model refresh triggers
2.  Threat model     → security/threat-modeling.md — refresh against CURRENT architecture (trust boundaries moved?)
3.  OWASP audit      → security/owasp-top10.md — A01-A10 checklist w/ evidence          [GATE 5 evidence]
4.  Infra/container  → security/hardening.md (env probes) + platform-container-security.md (IAM/images/SBOM)
5.  Dependency/supply → security/dependency-security.md (scheduled-scan triage) + vulnerability-management.md (aging findings)
6.  Testing layers   → security/security-testing.md: SAST/DAST runs + pen-test scheduling (if due per triggers)
7.  Agent-surface    → agents/agent-permissions-security-audit.md checklist (if fleet active)
8.  Findings register→ all → vulnerability-management.md lifecycle (severity × reachability, SLAs)
9.  Remediate        → criticals via workflows/hotfix.md; others via normal feature-flow w/ compliance-priority
10. Verify           → re-test per security-testing.md layer-4; class-scan per vulnerability-management.md
11. Report           → verdict (PASS/FAIL per gate-5) + evidence archive (compliance/audit.md registry)
```

Rules: audit WITHOUT remediation-plan = incomplete (findings enter the vuln-lifecycle same-day per `security/vulnerability-management.md` intake rules); verdict honest (per `quality-gates/gates.md` — CRITICALs fail gate 5, no exceptions).
