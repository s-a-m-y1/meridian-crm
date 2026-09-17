---
name: security-research
description: Security-focused research — CVEs, attack trends, pattern security evaluation
domain: research
phase: research
priority: medium
inputs: [threat-model, candidate-technologies]
outputs: [security-assessment-input]
dependencies: [research/technical-research, security/threat-modeling]
next_skills: [security/owasp-top10, security/dependency-security]
---

# Security Research

Extends `research/technical-research.md` when the research question is security-shaped: candidate tech with CVE history, novel attack classes affecting our stack, compliance-driven security requirements (pen-test findings, audit requests).

## When To Use

- Evaluating a dependency/service with a security-relevant surface (auth, payments, file handling, parsing untrusted input) — feeds `security/dependency-security.md`
- Incident/pen-test reveals an attack class we haven't assessed (new threat-model boundary — `security/threat-modeling.md` refresh trigger)
- Before adopting a pattern handling sensitive data (where does it leak?)

## Workflow

1. **CVE history on candidates** (dependency/service):
   - Past CVEs: count, severity, TIME-TO-PATCH (responds in days vs months = culture indicator), repeat classes (same root cause recurring = structural neglect)
   - Source: OSV/NVD/GHSA advisories — check the ADVISORY, not just "latest version fixed"
2. **Attack-surface assessment for OUR usage**:
   - Which features do we actually use? (reachability — a vuln in code we never call is low priority per `security/dependency-security.md` triage)
   - Input paths: does the candidate parse untrusted data (deserializers, parsers = classic RCE vectors)?
   - Trust boundaries crossed: does it call out / execute / elevate? (`security/threat-modeling.md` STRIDE on the new boundary)
3. **Secure defaults check**: ship-safe defaults? (auth on by default, safe parsers) or footguns requiring configuration discipline? Document required hardening steps into the deployment checklist (`security/hardening.md`)
4. **Disclosure & response posture**: security.txt, coordinated disclosure policy, published postmortems — vendor transparency predicts future incident behavior
5. **Output feeds existing skills** (no parallel security track): findings → `security/threat-modeling.md` refresh; dependency verdicts → `security/dependency-security.md` triage; config requirements → `security/hardening.md`; overall posture → `security/owasp-top10.md` audit items

## Rules

- Security research is time-sensitive: findings dated + revisit cadence (new CVEs land without code changes — `security/dependency-security.md` scheduled scans remain the safety net)
- Never trust "we're SOC2" as sufficient — check the SPECIFIC surface we integrate with
- No security finding argued away without reachability analysis (both directions: don't panic-invest, don't dismiss)

## Validation Checklist

- [ ] CVE history incl. time-to-patch + repeat-class analysis
- [ ] Reachability assessed (our usage vs marketed surface)
- [ ] Hardening requirements documented into hardening checklist
- [ ] Findings routed into existing security skills (no orphan research)

## Handoff

→ `security/threat-modeling.md` (boundary update), `security/dependency-security.md` (triage), `security/hardening.md` (config).
