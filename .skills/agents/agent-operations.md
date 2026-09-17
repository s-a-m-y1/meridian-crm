---
name: agent-operations
description: Agent registry, capabilities, selection, monitoring, evaluation, recovery, cost
domain: agents
phase: agents
priority: high
inputs: [sessions-registry, task-breakdown]
outputs: [agent-ops]
dependencies: [agents/orchestrator, agents/lifecycle]
next_skills: [agents/protocol]
---

# Agent Operations

The ops layer of the multi-agent system (structure: `agents/roles.md` + `agents/orchestrator.md` + `agents/protocol.md` + `agents/lifecycle.md` + `agents/contract.md` — THIS adds the operational services that keep the fleet healthy).

## 1. Agent Registry & Capabilities (the fleet-inventory — extends `.ai/context/sessions.md` from live-view to system-of-record)

- **Capability registry** (per role): skills-loaded + tool-access + file-scope-classes + proven-performance (from evaluation below) — the CORD's assignment INPUT beyond the static role-catalog (per `agents/roles.md` — this is its DYNAMIC layer: which agents have EVIDENCE for which work-classes)
- Registry records: role + active-sessions + historical-performance + cost-profile (per §5) — queryable BEFORE assignment ("which available agent has the best evidence for API-work?")

## 2. Agent Selection (assignment beyond role-match — extends `agents/orchestrator.md` assembly)

- Selection = role-fit (authority matrix per `agents/roles.md`) + capability-evidence (registry above) + **load-state** (context-budget available — a half-full specialist beats a fresh generalist for precision-work per `core/context-management.md` cost-calculus, generalized) + cost (per §5)
- **Evidence-based escalation**: junior→senior-capability assignments as complexity-signals fire (retry-count, eval-failures per `development/debugging.md` hypothesis discipline — assignment is an observable decision, recorded per `core/decision-log.md`)

## 3. Agent Monitoring (fleet-observability — per `observability/metrics.md` philosophy, agent-shaped)

- Per-agent/per-cohort metrics: task-completion-rate, review-findings-per-task (implementer-quality signal — per `review/code-review.md` findings feeding BACK into selection), BLOCKED-frequency + unblock-latency (coordination-health per `agents/orchestrator.md` command-loop), context-exhaustion-rate (per `agents/lifecycle.md` STALE — trending = tasks-mis-shaped signal), message-ACK latency (per `agents/protocol.md` discipline — protocol-rot detector)
- Fleet-alerts: STALE-epidemic (many agents stale = systemic cause → orchestrator investigation per `observability/incident-response.md` triage philosophy — agent-fleet incidents are incidents), review-findings-spike per agent (quality-rot → re-assignment or contract-repair per `agents/contract.md`)

## 4. Agent Evaluation (the fleet gets evals — per `ai/agent-evaluation-guardrails.md` discipline, applied to OUR agents)

- Per-role evals: the role's skills exercised on standard-scenarios (code-review-agent evaluated on seeded-diff-findings — did it catch the planted CRITICALs per `testing/test-infrastructure.md` seeded-defect philosophy, generalized to agent-testing)
- Findings-loop: review-findings attributed to agents → eval-cases → contract/skill-improvements (per `observability/root-cause-analysis.md` preventive-loop — an agent's repeated mistake is a SYSTEM finding: fix the contract/skill, not blame the instance)

## 5. Agent Cost Control (per `ai/model-operations.md` token-cost discipline — agents ARE the cost-shape)

- Per-agent/per-task token + tool-call accounting (per `agents/protocol.md` disk-records — results already carry the data; aggregation is the dashboard)
- **Cost-per-task-class** budgeted (per `business/finance.md` unit-economics — an agent-class costing 3× peers on same work-class = investigation); over-budget runs checkpoint-reviewed (per `agents/lifecycle.md` CONTEXT-FULL — cost-full is its sibling)
- Fleet-level caps: concurrent-sessions × per-session-budgets (per `agents/orchestrator.md` caps — economic not just coordination)

## 6. Agent Recovery & Failure-Handling (extends `agents/lifecycle.md` termination-types with the systematic layer)

- **Recovery playbook per failure-class**: STALE → checkpoint-resume (per `core/delegation.md`); VIOLATION → revert + audit (per `agents/roles.md` kill-rules); repeated-VIOLATION per agent-instance → quarantine + human-review (per `security/vulnerability-management.md` repeat-class discipline — pattern-recurrence = systemic)
- **Failure attribution recorded** (per `observability/root-cause-analysis.md` blameless-system philosophy — "agent failed" is a SYMPTOM: the RCA asks what task-shaping/contract/context caused it; blameless = the fix lands in skills/contracts per `agents/protocol.md` escalation-rules)
- Cascade-containment: a failing agent's downstream (dependents per task-dependencies) notified + re-planned per `agents/orchestrator.md` unblock-mechanics — failure never silently-propagates (per `core/communication.md` blocker-reporting)

## Validation Checklist

- [ ] Capability registry live + used in selection; assignments recorded
- [ ] Fleet metrics + alerts wired; evals per role with findings-loops
- [ ] Cost per task-class on dashboards with caps; recovery playbook per failure-class

## Handoff

→ fleet-incidents → `observability/incident-response.md`; protocol-violations → `agents/protocol.md` escalation; contract-repairs → `agents/contract.md`.
