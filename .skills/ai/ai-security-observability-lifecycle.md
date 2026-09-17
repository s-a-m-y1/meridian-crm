---
name: ai-security-observability-lifecycle
description: AI security, observability, privacy, and feature lifecycle management
domain: ai
phase: ai
priority: high
inputs: [ai-feature, model-ops]
outputs: [ai-prod-readiness]
dependencies: [ai/ai-evaluation-guardrails, ai/model-operations]
next_skills: [quality-gates, observability/monitoring]
---

# AI Security, Observability & Lifecycle

The production-operation trio for AI features: keeping them SAFE, SEEN, and MANAGED over their lifetime.

## 1. AI Security (extending `security/threat-modeling.md` STRIDE — the AI attack-surface additions)

### The AI threat-classes (add to every threat-model covering AI surfaces)

| Threat                                           | Vector                                                                                                                                   | Control                                                                                                                                                                                                                                                           |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Prompt injection**                             | untrusted-content-as-instructions (user-input / tool-results / retrieved-docs per `ai/rag-embeddings-search.md` — the three trust-lanes) | delimiting + content-instruction separation + instruction-detection; tools with least-privilege (injected instructions can only DO what tools allow — minimize the blast per `ai/agent-design.md` minimal-toolset)                                                |
| **Data exfiltration via model**                  | prompts engineered to reveal context/system                                                                                              | output-filters (secrets/PII patterns per `security/secrets.md` scan rules, output-side); context-hygiene (never load what must-not-leak into a context that renders output — per `ai/prompt-context-engineering.md` relevance-loading doubles as exfil-reduction) |
| **Training-data poisoning** (future fine-tuning) | tainted feedback/corpus                                                                                                                  | corpus-provenance per `data/data-governance-quality.md` lineage; feedback-validation before it enters training sets                                                                                                                                               |
| **Model supply-chain**                           | model-artifacts/providers                                                                                                                | provider-DPA per `compliance/legal.md` (models are subprocessors — registered); artifact-provenance where self-hosted (per `security/platform-container-security.md` supply-chain rules generalized)                                                              |
| **Abuse/cost-DoS**                               | adversarial usage patterns                                                                                                               | rate-limits + budgets per `ai/model-operations.md` §5 + anomaly-alerts on usage-shapes                                                                                                                                                                            |

### AI-specific review additions (per `review/security-review.md` — the checklist extension)

- injection-lanes reviewed (all three untrusted-input classes delimited?)
- tool-permissions vs autonomy-level coherence (per `ai/agent-design.md` — L2 autonomy + over-broad tools = the classic combo-finding)
- redaction-coverage vs data-classification (per `data/data-governance-quality.md` — every classified column that can reach a model-context: redacted-or-justified)

## 2. AI Observability (per `observability/metrics.md` RED/USE philosophy + `development/ai-features.md` rule 5 — the metric-set)

- **Quality-in-prod** (the hardest + most important): sampled human-review scores (per `maintenance/customer-support.md` CSAT mechanics — AI outputs rated where user-visible); automated proxies (citation-validity for RAG per `ai/rag-embeddings-search.md`, schema-validation-rate per `ai/structured-output.md` repair-metrics, refusal-rates, HITL-override-rate — rising overrides = quality-rot signal per `ai/ai-evaluation-guardrails.md` correction-capture)
- **Standard ops**: per-model RED (latency p95/p99, error-rate, throughput) + token-consumption + cost-per-request-class (per `ai/model-operations.md` unit-cost dashboards) + cache-hit-rates + fallback-chain-trigger-rates (provider health per `architecture/scalability-reliability.md` dependency-pattern — models included)
- **Tracing**: prompt-hash + model + route + token-counts + latency + outcome per request (per `observability/logging.md` structured discipline — PII-redacted: prompts CAN contain user content — the log gets the hash + metadata, raw-prompt storage only under data-classification rules per `compliance/legal.md` retention)
- **Alerts**: cost-burn (per `observability/alerting-tracing.md` budget-burn doctrine — AI cost-rot caught early), quality-proxy drift (validation-rate drop = ticket-tier per its severity tiers; hallucination-signal = page-tier when user-facing)
- Dashboards: per-feature AI panels (quality + cost + latency together — the trade-off-triangle visible per `review/performance-review.md` evidence standards)

## 3. Privacy & Data-Flow duties (per `data/data-governance-quality.md` + `compliance/legal.md` — the AI-shaped obligations)

- Model-inputs = data-leaving-perimeter classification (what user-data flows to WHICH provider — provider-registry per `compliance/legal.md` §1; retention-by-provider reviewed: zero-retention modes where available per `research/api-research.md` data-posture evaluation)
- Training-on-user-data: OFF by default; any opt-in flow = explicit consent per `compliance/legal.md` §3 mechanics (consent-gated, withdrawable, logged)
- DSAR-cascade includes model-contexts where persisted (per `data/data-governance-quality.md` deletion-contract — RAG-stores/logs with user content: the erasure-map covers them)

## 4. AI Feature Lifecycle (per `product/product-lifecycle.md` stages — AI-specific mechanics)

- Introduction: eval-bars live + canary-per `quality-gates/gates.md` gate-8 + guardrails-on; kill-switch = feature-flag (per `development/feature-flags.md` — AI features degrade-gracefully: flag-off → pre-AI experience per `development/implementation-lifecycle.md` graceful degradation — the fallback IS designed)
- Growth: cost-quality trade-tuning (per `ai/model-operations.md` ladder — route-down as evals allow); eval-set expansion from prod-failures (per `ai/ai-evaluation-guardrails.md` golden-growth rule)
- Maturity: drift-watch (providers change: scheduled re-baseline per §1 eval-cadence); cost-reviews (per `business/finance.md` — mature AI features on the cost-dashboard like infra)
- Sunset: flag-off → removal per `maintenance/deprecation.md` windows; eval-suite retired WITH the feature (per `development/implementation-lifecycle.md` dead-code rules — orphan evals = rot)

## Validation Checklist

- [ ] AI threat-classes in the threat model; injection-lanes + tool-permissions + redaction reviewed
- [ ] Quality + cost + latency dashboards live; cost-burn + drift alerts wired; prompt-logs PII-redacted
- [ ] Data-flow registry covers providers; lifecycle stages mapped incl. graceful-degradation flag

## Handoff

→ incidents: `observability/incident-response.md` (+ AI cost/quality anomalies route there); gates: `quality-gates/gates.md`; reviews: `review/security-review.md` AI-extensions.
