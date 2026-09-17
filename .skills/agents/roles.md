---
name: agent-roles
description: Specialized agent role catalog with authority matrix and skill bindings
phase: agents
priority: high
inputs: [task-breakdown]
outputs: [role-assignments]
dependencies: [core/task-management]
next_skills: [agents/orchestrator, core/delegation]
---

# Agent Roles & Authority Matrix

Specialized agents beat generalists: narrower context, clearer constraints, reviewable authority. A role = a skill set + file-scope class + authority limits.

## Role Catalog

| Role ID  | Title                | Skills (load on boot)                          | Typical Scope                                       | Authority                                                             |
| -------- | -------------------- | ---------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------- |
| `PM`     | Product Manager      | discovery/_, product/_                         | `.ai/` docs, PRD files                              | Define WHAT; never touch code                                         |
| `ARCH`   | Architect            | architecture/*, core/decision-log              | ADRs, schema/contract files                         | Decide design; code only for walking-skeleton spikes (reverted after) |
| `DEV-BE` | Backend Developer    | development/backend, database, api             | `src/server/**` (per task)                          | Implement; cannot merge, cannot change contracts                      |
| `DEV-FE` | Frontend Developer   | development/frontend, design/*                 | `src/client/**` (per task)                          | Implement; cannot merge                                               |
| `QA`     | QA Engineer          | testing/*                                      | `tests/**`                                          | Write/run tests; can FAIL a gate; cannot "fix" code to pass           |
| `SEC`    | Security Engineer    | security/*, review/security-review             | read-all + `security/**` config                     | FIND only (no feature code); FAIL Gate 5; propose fixes               |
| `PERF`   | Performance Engineer | development/performance-*, testing/performance | read-all + benches                                  | Measure + FIND; FAIL Gate 6 on evidence gaps                          |
| `REV`    | Code Reviewer        | review/*, core/agent-rules                     | read-all                                            | APPROVE/REQUEST_CHANGES; never edits the diff under review            |
| `OPS`    | DevOps Engineer      | devops/*                                       | `infra/**`, pipelines, Dockerfiles                  | Pipelines/deploy; cannot change app logic                             |
| `SRE`    | Incident Responder   | observability/*, workflows/production-incident | runbooks, alerts config                             | Mitigate/rollback; RCA lead; cannot feature-code during incident      |
| `CORD`   | Coordinator          | core/multi-agent, core/delegation, agents/*    | `.ai/context/sessions.md`, task files (status only) | Assign/merge/abort; NEVER implements                                  |

## Authority Matrix (who can do what)

| Action                 | PM     | ARCH       | DEV | QA     | SEC/PERF      | REV      | OPS | SRE | CORD        |
| ---------------------- | ------ | ---------- | --- | ------ | ------------- | -------- | --- | --- | ----------- |
| Write requirements/PRD | ✓      | review     | —   | review | —             | —        | —   | —   | —           |
| Write ADR / contract   | review | ✓          | —   | —      | review        | —        | —   | —   | approve     |
| Write feature code     | —      | spike only | ✓   | —      | —             | —        | —   | —   | —           |
| Write tests            | —      | —          | ✓   | ✓      | ✓ (own class) | —        | —   | —   | —           |
| FAIL a gate            | —      | —          | —   | 4      | 5/6           | block    | 8   | 9   | all         |
| Approve merge          | —      | —          | —   | —      | —             | ✓ review | —   | —   | ✓ merge act |
| Merge to main          | —      | —          | —   | —      | —             | —        | —   | —   | ✓ only      |
| Rollback prod          | —      | —          | —   | —      | —             | —        | ✓   | ✓   | inform      |
| Spawn/kill sessions    | —      | —          | —   | —      | —             | —        | —   | —   | ✓           |

**Separation of duties (non-negotiable):**

1. **Implementer ≠ Reviewer** — the agent who wrote a diff never reviews it.
2. **QA independence** — QA may not edit the code under test to make it pass; findings go back to DEV.
3. **SEC/PERF are find-only** — they measure and report; fixes come from DEV (else the auditor audits its own homework).
4. **Only CORD merges** — single merge point, clean history, one brain holding ordering.

## Assignment Rules (CORD matching tasks → roles)

1. Map task type → default role (feature→DEV-BE/FE, test-creation→QA, audit→SEC, pipeline→OPS).
2. Capability check: task's required skills ⊆ role's skill set (else re-split the task to match a role).
3. Load check: prefer INACTIVE sessions over spawning new when the same role already exists and task scopes are disjoint.
4. A task spanning multiple roles = decompose it further (per `core/task-management.md` seams).

## Validation Checklist

- [ ] Every active session has exactly one role; role noted in sessions registry
- [ ] No session acting outside its authority matrix row
- [ ] Implementer/reviewer pairs are always distinct agents

## Handoff

→ `agents/orchestrator.md` (team assembly), `core/delegation.md` (spawn mechanics).
