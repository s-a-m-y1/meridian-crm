---
name: dependency-security
description: Scan, triage and remediate dependency vulnerabilities
phase: security
priority: high
inputs: [lockfile]
outputs: [audit-report, patches]
dependencies: [development/dependency-management]
next_skills: [review/security-review, release]
---

# Dependency Security

## Workflow

1. **Scan**: audit tool on every CI run (lockfile changes) + scheduled full scan (new CVEs appear without code changes).
2. **Triage each finding** (severity ≠ priority):
   - Is the vulnerable code path actually reachable in OUR usage? (a vuln in a feature we never call = low priority; verify, don't assume)
   - Exploit conditions: network-adjacent? auth needed? user interaction?
   - Effective severity = tool severity × reachability.
3. **Remediate by severity**:
   - CRITICAL/HIGH reachable → **emergency path**: patch immediately (bypass normal update cadence per `development/dependency-management.md`), expedited release
   - MEDIUM → next scheduled update
   - LOW/unreachable → record in `.ai/risks/` with revisit date
4. No patch available? Mitigations (config, wrapper, disable feature path) + risk record; document in the risk file.
5. Verify: full suite after patch + deploy smoke (regression rules per `testing/regression.md`).

## Output

Audit report: findings, reachability analysis, remediation status, verification evidence. Recorded in `.ai/risks/` or changelog as appropriate.

## Validation Checklist

- [ ] Every finding triaged with reachability (not just severity copy-through)
- [ ] Criticals patched via emergency path + verified
- [ ] Scheduled re-scan exists (new CVEs found without code changes)

## Handoff

→ evidence to Gate 5 (`quality-gates/gates.md`); patches through `testing/regression.md`.
