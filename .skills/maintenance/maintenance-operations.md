---
name: maintenance-operations
description: Bug triage SLAs, tech-debt operations, dep updates, security patches, followups
domain: maintenance
phase: maintenance
priority: high
inputs: [project-state]
outputs: [maintenance-ops]
dependencies: [development/bug-fix, documentation/maintenance]
next_skills: [workflows/dependency-update]
---

# Maintenance Operations

The ops-cadence layer: `documentation/maintenance.md` = the cadence calendar + debt philosophy. THIS = operational protocols for the recurring maintenance activities.

## 1. Bug Triage Protocol (the daily queue discipline)

- SLA by severity (per `workflows/bug-fix.md` triage — restated as queue-mechanics): SEV1 immediate; security-bugs at severity+1 (per `security/vulnerability-management.md` SLAs); everything else batched-triaged daily
- Triage decision-set (per bug, ≤2 min each): fix-now (severity warrants) / queue (priority-ranked per `product/prioritization.md` value×risk) / wontfix (documented with reason + revisit trigger — not silent graveyard) / duplicate (merged, evidence-linked)
- Aging rules: bugs > 90 days unaddressed get resolved-or-killed quarterly (a 400-open-bug backlog where nobody reads them = backlog theater — the queue exists to be WORKED per `core/communication.md` precise-verbs rule)
- Trend feed: recurring-cluster detection (same area × N = systemic — escalates from bug-fix to RCA per `observability/root-cause-analysis.md` preventive loop; feeds `product/user-feedback.md` weekly signals)

## 2. Technical Debt Operations (the debt-for-debt workstream)

- Debt register reviewed bi-weekly (per `documentation/maintenance.md` cadence): interest-rated items re-scored; new debt identified during reviews (per `review/code-review.md` MEDIUMs parked here with owner)
- Debt-sprint mechanics: the 20% capacity enforced by task-quota — debt tasks sized/scored like features (`product/prioritization.md`); work executes via `workflows/dependency-update.md`
- Paydown rules: at-touchpoint fixes ride PRs as separate commits (per `development/refactoring.md` — never mixed diffs); structural paydowns (module extractions per `architecture/architecture-migration.md`) get their own slices
- Debt-ceiling alerts: metrics crossing `documentation/maintenance.md` health signals (flake %, CI-time, coverage-drift) auto-create debt tasks (signals → work — the queue without the manual step)

## 3. Dependency Update Protocol (routine, ≠ security emergencies)

- Cadence: weekly batch per `documentation/maintenance.md`; executes via `workflows/dependency-update.md` (patch auto, minor tested, major planned)
- Rules restated-as-ops: lockfile via manager only; batch-PR per level; full-suite + contract tests per batch; majors get release-notes review + usage-grep + their own PR + changelog entry (per `development/dependency-management.md` gates — routine discipline, no shortcuts for "just a patch")

## 4. Security Patch Operations (the emergency lane)

- Trigger: critical/high reachable per `security/vulnerability-management.md` triage → BYPASSES cadence (per `security/dependency-security.md` emergency path — that's minutes-hours, this section exists so the routine lane never delays the emergency one)
- Ops mechanics: patch → full-suite → deploy via `workflows/hotfix.md` path → vuln-closure verification per `security/vulnerability-management.md` verify step + disclosure-timing respected (fix-then-announce per `security/security-testing.md` coordination rules)

## 5. Incident Followup (the post-incident work queue)

- Every SEV1/2 closes with action-items-as-tasks (per `observability/root-cause-analysis.md` no-wish rule — THIS section is the queue-ops: action items enter maintenance backlog with priority = the postmortem's, not the backlog's mood)
- Followup audit: 30-day post-incident check that action items actually landed (per `observability/incident-response.md` close discipline — unlanded items escalate to the original IC)
- Incident-metrics trend: recurrence-rate + time-to-followup tracked (per `security/vulnerability-management.md` metric philosophy — repeat incidents with open followups = process failure, visible on dashboards)

## Validation Checklist

- [ ] Triage SLAs held; >90d queue resolved-or-killed quarterly; clusters escalated
- [ ] 20% debt capacity quota visible; ceiling-signals auto-task
- [ ] Security lane bypasses routine without exception; followups audited at 30d

## Handoff

→ execution workflows (`workflows/dependency-update.md`, `dependency-update.md`, `hotfix.md`); trends → `product/user-feedback.md` + dashboards.
