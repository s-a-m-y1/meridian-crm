---
name: agent-permissions-security-audit
description: Agent permissions, security boundaries, cost control, and audit trails
domain: agents
phase: agents
priority: high
inputs: [agents-roles, registry]
outputs: [agent-security-system]
dependencies: [agents/roles, agents/agent-operations]
next_skills: [security/security-review]
---

# Agent Permissions, Security & Audit

The security-trust layer of the fleet: WHO can do WHAT, PROVEN (roles define authority; THIS enforces + verifies it). Extends `agents/roles.md` matrix + `security/platform-container-security.md` least-privilege — agent-shaped.

## 1. Agent Permissions (least-privilege, mechanically enforced — the matrix made executable)

- **Permission manifests per role** (extends `agents/contract.md` identity-block): file-scope-classes (declare-exact globs per `core/task-standard.md` scope), tool-access (which tools per `ai/agent-design.md` tool-schemas — same principle), command-allowlists (dev-tools per role: linters yes, deploys no per `agents/roles.md` authority), data-access-classes (per `data/data-governance-quality.md` classifications — agents touching PII get redaction-aware scopes)
- **Enforcement at chokepoints** (per `security/auth-security.md` deny-by-default philosophy, agentized): pre-execution guards (scope-check before file-write — the sandbox layer); tools-gated (tool-invocations pass the manifest); commits/merges gated (per `devops/git.md` CORD-only-merges — mechanically: CI rejects non-CORD-author merges to main)
- **Elevation path**: scope-needs-growth → NEW TASK not expanded-scope (per `core/task-standard.md` rule — restated as the security-rule: silent-scope-growth is a violation even when the code's correct)

## 2. Agent Security (the fleet as attack-surface — per `ai/ai-security-observability-lifecycle.md` threat-classes applied INTERNALLY)

- **Instruction-integrity**: agent-task-files + messages are the control-channel (per `agents/protocol.md` disk-is-interface) — task-file writes restricted to: task-owner + CORD (permission-manifests cover `.ai/tasks/**` — a compromised/rogue worker can't re-task peers per injection-vectors per `ai/ai-security-observability-lifecycle.md` prompt-injection lanes)
- **Untrusted-content lanes for agents** (per `ai/agent-design.md` results-are-data): agents processing external-content (code-from-web, user-input-analysis tasks) get HARDER defaults: no-deploy-tools, no-secrets-scope, output-reviewed-before-use (content from outside never becomes instructions without human gate — per `review/security-review.md` boundary discipline)
- **Credential isolation**: per-agent credentials scoped-minimal (per `security/secrets.md` least-privilege — no fleet-shared god-tokens; per-role service-identities per `security/platform-container-security.md` IAM rules), expiry on session-end per `agents/lifecycle.md` termination (credentials die with sessions — no ghost-access)

## 3. Agent Audit (the complete "which agent did what" record — per `compliance/legal.md` §4 evidence-system, agent-coverage)

- **Audit events** (per `security/platform-container-security.md` event-classes + agent-additions): task-claim/status-changes, file-writes (agent→files touched), tool-invocations, merge-events (CORD actions per `devops/git.md`), permission-elevations/violations, contract-versions-used (per `agents/contract.md` — which rules-governed each action: reproducibility)
- **Integrity**: append-only per audit-log rules (per `security/platform-container-security.md` immutability — agents can't rewrite their own trail); CORD+human-only read-access beyond the audit-service (per `security/hardening.md` access-discipline)
- **Reconstruction-capability**: from audit-trail alone — who-worked-what, which-changes-which-agent, under-which-contract-version (the forensic answer to "how did THIS line get here" — per `observability/root-cause-analysis.md` timeline-dependency, made queryable)

## 4. Fleet Security Review (per `review/security-review.md` + `review/specialized-reviews.md` — the agent-extension checklist)

- [ ] Permission-manifests ↔ roles-matrix coherence (no role granted beyond its authority-row per `agents/roles.md`)
- [ ] Chokepoint-enforcement verified (a scope-violation attempt BLOCKED mechanically — tested per `testing/api-testing.md` negative-probe philosophy, agentized: plant a deliberately-out-of-scope action, verify the guard)
- [ ] Task-file write-paths closed to non-owners; untrusted-content-roles have the harder-defaults
- [ ] Audit-trail reconstruction-tested (spot-check: replay one task's audit-events → correct story)

## 5. Human Oversight Points (per `ai/agent-design.md` HITL — where the fleet REQUIRES humans)

- Irreversible-by-fleet (per `core/agent-rules.md`): force-push, prod-destructive-commands, secret-rotation — human-gated ALWAYS (mechanically: the permission-manifest simply doesn't contain them — enforcement by absence)
- Fleet-anomalies (per `agents/agent-operations.md` monitoring): violation-epidemics, cost-anomalies → human-review queue (per `observability/alerting-tracing.md` tiers)

## Validation Checklist

- [ ] Manifests enforce the matrix at chokepoints; elevation = new-task-only
- [ ] Control-channel writes owner-restricted; untrusted-content-roles hardened; credentials session-scoped
- [ ] Audit-trail complete + append-only + reconstruction-proven

## Handoff

→ review: `review/security-review.md` agent-extensions; incidents: `observability/incident-response.md` (agent-VIOLATION class); evidence: `compliance/legal.md` §4.
