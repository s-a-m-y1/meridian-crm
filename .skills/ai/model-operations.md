---
name: model-operations
description: Model selection, routing, fallback, token & cost management
domain: ai
phase: ai
priority: high
inputs: [ai-feature-spec, cost-budgets]
outputs: [model-ops]
dependencies: [development/ai-features]
next_skills: [ai/ai-observability, devops/cost-optimization]
---

# Model Operations — Selection, Routing, Fallback, Tokens, Cost

The model-portfolio operations layer (evals that VALIDATE choices: `ai/ai-evaluation.md`; this skill = choosing/routing/paying).

## 1. Model Selection (per capability — a dependency decision per `research/framework-library-evaluation.md`)

- Scorecard per candidate: task-fit (eval-scored on OUR golden set per `development/ai-features.md` evals — never leaderboard-proxy), latency (p95 per budget), cost (per 1k tokens → per-feature-request math), context-window fit, output-mode support (structured per `ai/structured-output.md`), data-residency/privacy posture (per `compliance/legal.md` — model providers are subprocessors: DPA register applies), regional availability
- **Per-capability portfolio**: different tasks → different models (classification on cheap-small; complex-generation on frontier) — never one-model-fits-all by default
- Re-selection cadence: model market moves quarterly — scheduled re-eval of the portfolio (per `research/technical-research.md` freshness-triggers); upgrades = migration discipline (behavior changes = new evals first per `ai/ai-evaluation.md`)

## 2. Routing (requests → the right model)

- Route by task-class + input-complexity: complexity-gate cheap-first (simple → small model; confidence-low or complexity-signals → escalate per `core/agent-rules.md` no-guessing — routing is a measured decision, metriced)
- Route-matrix versioned (per `core/decision-log.md`); routing changes = eval-gated (routing IS behavior)
- Per-user/tenant plan-aware routing where billing differentiates (per `platform/platform-services.md` entitlement matrix — model tier as plan feature, server-side enforced)

## 3. Fallback Chain (resilience per `architecture/scalability-reliability.md` patterns — models are dependencies like any other)

- Chain declared per capability: primary → fallback (degraded-but-acceptable model) → terminal behavior (queue/retry-later/honest-failure per `development/implementation-lifecycle.md` graceful degradation — NEVER silent-wrong-output)
- Provider-outage tolerance: multi-provider chains where data-posture allows (per `research/api-research.md` exit-plan discipline — single-provider = concentration risk on the ADR)
- Rate/quota: per-provider budgets + 429-handling + backoff (per `development/integration-implementation.md` universal rules — model APIs are external APIs, all rules apply)

## 4. Token Management (the unit-economics of every request)

- Per-request budgets: input-max + output-max + total (enforced at the adapter — over-budget inputs rejected/truncated per `ai/prompt-context-engineering.md` truncation POLICY, designed not silent)
- Streaming for long outputs (UX + timeout-avoidance per `design/ui.md` loading states); stop-conditions + max-tokens tuned per task (open-ended generation + no cap = cost-roulette)
- Context-reuse where providers support (prompt/response caching: system+fewshot blocks cached — per `business/finance.md` cost-discipline; cache-hit metrics per `ai/ai-observability.md`)

## 5. Cost Control (the growth-leaky faucet)

- **Per-feature unit-cost instrumented**: tokens × price per request-class → cost-per-feature-action → cost-per-active-user (per `business/finance.md` unit economics — AI features with uncapped marginal cost = inverse-margin machines; the dashboard shows it)
- Budgets + caps: per-user soft-caps (per `security/api-security.md` rate-limit classes — AI endpoints = expensive endpoints, tighter tiers), per-feature monthly budgets with alerts (per `observability/alerting-tracing.md` — burn-rate alerts on cost like SLO-burn on reliability)
- Optimization ladder (evidence-first per `devops/backups-scaling-cost.md` ladder discipline): cache-hits (semantic-cache per `development/ai-features.md`) → route-down where evals-say-safe → prompt-shorten (per `ai/prompt-context-engineering.md` budgets) → batch async-able work — NEVER quality-cutting without eval-delta recorded (cost-optimized-into-hallucination = false economy)

## Validation Checklist

- [ ] Portfolio per-capability, eval-scored, re-eval scheduled; routing versioned + metriced
- [ ] Fallback chains per capability incl. terminal-honest-failure; provider rules per universal integration discipline
- [ ] Token budgets enforced; unit-cost per feature on dashboards; caps + burn alerts live

## Handoff

→ metrics wiring per `ai/ai-observability.md`; cost reviews per `business/finance.md`; eval gates per `ai/ai-evaluation.md`.
