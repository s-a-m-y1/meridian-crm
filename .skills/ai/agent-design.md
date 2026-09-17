---
name: agent-design
description: Design AI agents — tool use, autonomy levels, loops, recovery
domain: ai
phase: ai
priority: high
inputs: [feature-spec, tool-inventory]
outputs: [agent-spec]
dependencies: [ai/prompt-context-engineering, ai/structured-output]
next_skills: [ai/agent-evaluation, agents/roles]
---

# AI Agent Design

Design of LLM-powered AGENTS (product-facing AI agents + internal tool-agents). NOTE the boundary: this skills SYSTEM's own multi-agent orchestration (roles/authority/protocol) lives in `agents/*` — THIS skill designs agent FEATURES generally.

## 1. Autonomy Design (the risk-dial, chosen deliberately)

| Level              | Agent behavior                                    | Guardrails required                                                                                                      |
| ------------------ | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| L0 Suggest         | proposes, human executes                          | minimal — display + sourcing                                                                                             |
| L1 Act-on-approve  | executes after per-action approval                | approval UI + diff-preview per action                                                                                    |
| L2 Act-in-scope    | executes freely within declared scope             | scope-enforcement (permissions per `agents/roles.md` authority matrix — the pattern generalizes), audit-log every action |
| L3 Autonomous-goal | decomposes + executes multi-step toward objective | strict sandbox + budget-caps + human-checkpoints at irreversible points                                                  |

- **Default low, earn high**: start L0/L1; autonomy increases on EVIDENCE (eval-success-rate per action-class per `ai/agent-evaluation.md`) — never launch-L3-hope (per `business/validation.md` pre-declared discipline applied to autonomy)
- Irreversible actions (delete, send-external, spend) STAY human-approved at every level (per `core/agent-rules.md` irreversible-safeguards — productized)

## 2. Tool Use (the agent's hands — interface discipline per `ai/prompt-context-engineering.md` delimiting)

- **Tool schema = API contract**: name + description (when-to-use vs when-NOT — negative-spaces prevent misuse) + typed parameters + error-taxonomy; schemas versioned (breaking tool changes = agent-behavior changes = eval re-run)
- **Tool results are DATA** (never instructions — the injection defense layer 1): result-delimiting enforced in tool-wrapper design
- **Minimal toolset**: every tool an agent can call is attack-surface + confusion-surface — cut tools that overlap (per `core/engineering-principles.md` simplicity, applied to affordances)
- Error-handling contracts: tools return structured errors the agent can RECOVER from (retry-with-what-changed, not string-crash — per `ai/structured-output.md` layers, applied toolward)

## 3. The Agent Loop (execution mechanics)

- **Plan → act → observe → re-plan** (bounded): max-iterations + stall-detection (no-progress N steps → escalate/stop per `core/communication.md` blocker-reporting — agents that can't stop = runaway cost + runaway errors)
- State on disk at checkpoints (per `core/delegation.md` disk-is-state philosophy generalized: a killed agent run resumes; work not lost)
- **Budgets per run**: iterations + tokens + wall-time + tool-calls (per `ai/model-operations.md` token-cost rules — agents are the cost-blast-radius shape; caps are the seatbelt)

## 4. Recovery Design (agents WILL fail — design the landing)

- Tool-failure: bounded retries → tool-skip-with-note → task-degrade (per `architecture/scalability-reliability.md` fallback ladder, agent-shaped)
- Confusion-states: self-check prompts ("list what you know / what's missing" — per `core/context-management.md` minimum-context discipline, applied mid-loop); escalate-to-human with CLEAN context (the ask contains: state + blockers + options — per `core/communication.md` decision-request format)
- Loop-patrol: repeated-identical-action detection (stuck-agent signature) → force-stop + report (the classic runaway shape caught mechanically)

## 5. Human-in-the-Loop Touchpoints (per `development/ai-features.md` HITL rules — designed, not bolted)

- Approval-points at: irreversible actions (always), budget-thresholds, confidence-low self-detection
- Review surfaces: action-log (per `security/platform-container-security.md` audit discipline — every agent action attributable, reviewable)
- Override + correction capture (human corrections = eval-gold per `ai/agent-evaluation.md` — the feedback loop compounds)

## Validation Checklist

- [ ] Autonomy level chosen per evidence-bar; irreversible = human-approved always
- [ ] Tool schemas versioned + results-delimited; minimal toolset
- [ ] Loop bounded (iterations/tokens/time) + stall-patrol; recovery paths designed
- [ ] HITL touchpoints + audit-log wired

## Handoff

→ evaluation per `ai/agent-evaluation.md`; security surface per `ai/ai-security.md`; internal-agent pattern: `agents/*` family.
