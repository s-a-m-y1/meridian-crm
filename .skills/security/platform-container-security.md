---
name: platform-container-security
description: Infrastructure, container, supply-chain and audit-logging security
domain: security
phase: security
priority: high
inputs: [deployment, ci-pipeline]
outputs: [infra-security]
dependencies: [security/hardening, devops/docker, devops/ci]
next_skills: [security/vulnerability-management, compliance/audit]
---

# Platform & Infrastructure Security

## 1. Infrastructure Security (the substrate)

- **Least-privilege everywhere**: service accounts per service (one role each — never shared creds per `security/secrets.md`); cloud IAM reviewed quarterly (permissions-creep is the quiet breach path); DB app-users minimal (no DDL/superuser per `security/hardening.md` checklist)
- **Network segmentation**: DB/cache internal-only (per `security/hardening.md` infra section); admin surfaces behind VPN/SSO; egress rules where feasible (SSRF blast-radius reduction per `security/xss-csrf.md`)
- **Access logging + review**: admin actions logged (per audit section below); periodic access reviews (who still has prod? — leavers deprovisioned same-day — the classic post-departure ghost-access finding)

## 2. Container Security (per `devops/docker.md` build rules — the runtime layer)

- Base images: pinned digests (not tags — `latest` is a supply-chain roulette), minimal variants, scanned per `security/dependency-security.md` scheduled cadence (image CVEs land between code changes)
- Runtime: non-root (per `security/hardening.md`), read-only FS, no new privileges (security-opt flags), resource limits (DoS-neighbor protection per `devops/docker.md`)
- Registry hygiene: private registry, signed images where tooling allows, no `--force` pulls of stale digests; image promotion path intact (CI-built → deployed, never hand-built per `devops/ci.md` artifact rules)

## 3. Supply-Chain Security (the dependency attack surface)

- **SBOM per build** (software bill of materials — what's IN our artifacts, answerable when the next log4j-scale event asks "are we exposed?"); lockfile discipline (per `development/dependency-management.md` — manager-only changes, serialized per `core/multi-agent.md`)
- **Provenance**: pinned versions + integrity (lockfile hashes); CI runs pinned too (actions pinned to SHAs, not floating tags — the CI-is-the-attack-vector decade)
- New-dependency evaluation gate (per `development/dependency-management.md` scorecard — supply-chain weight evaluated BEFORE adoption: transitive surface, maintainer posture per `research/security-research.md`)

## 4. Audit Logging (the "who did what" record — feeds `compliance/legal.md` §4)

- Logged events: authentication (success/fail/lockout per `security/auth-security.md`), authorization changes (role grants/revokes), admin/mutation actions on sensitive resources, data exports, secret/config changes, pipeline runs (who/what deployed)
- **Integrity**: append-only storage (WORM/immutable tier per `data/data-governance-quality.md` immutability rules — tamperable audit logs are decoration); access-controlled (auditors read, nobody edits)
- Content: who + what + when + from-where + outcome; NO secrets/PII payloads (per `observability/logging.md` security discipline)
- Retention per compliance contract (SOX-class years vs. GDPR-balance — per `compliance/legal.md` review; longer-retention justified + documented)

## Validation Checklist

- [ ] Least-privilege IAM + network segmentation verified by probe/scan
- [ ] Images pinned + scanned; runtime flags enforced; SBOM per build
- [ ] Audit events complete + append-only + retention-compliant

## Handoff

→ findings → `security/vulnerability-management.md` lifecycle; audit evidence → `compliance/legal.md` §4.
