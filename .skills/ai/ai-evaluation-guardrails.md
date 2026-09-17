---
name: ai-evaluation-guardrails
description: Evaluate AI systems — evals, agent evals, guardrails, hallucination prevention, HITL
domain: ai
phase: ai
priority: high
inputs: [ai-feature, prompts, golden-set]
outputs: [eval-system, guardrail-config]
dependencies: [development/ai-features]
next_skills: [quality-gates, ai/ai-observability]
---

# AI Evaluation & Guardrails

Consolidates the verification + safety family: `development/ai-features.md` holds the base gates (evals-first, guardrails-before-prod). THIS extends into the full eval-system + safety-stack discipline.

## 1. The Eval System (beyond the golden set)

- **Eval tiers** (per `testing/strategy.md` pyramid-philosophy, AI-shaped):
  - Unit: single-call correctness (input → expected-output-shape + key-content per `ai/structured-output.md` schema)
  - Scenario: multi-turn/tool-use flows (the agent-loop paths per `ai/agent-design.md` — state + recovery cases included: "tool-3 fails" branches eval'd like extension-branches per `discovery/use-cases.md`)
  - Adversarial: the attack set (below) + edge-corpus (the weird-input set per `testing/test-infrastructure.md` edge-seeds — unicode/RTL/empty/max applied to AI surfaces)
- **Golden set governance**: versioned in-repo; growth rule (every prod failure becomes an eval case per `development/bug-fix.md` regression discipline — the AI version); representative + boundary samples; HUMAN-written goldens for correctness-classes (agent-written gold-outputs = circular grading — banned)
- **Metrics per tier**: exact-match/F1 where extractable; LLM-as-judge ONLY with judge-validity (judge-prompt + rubric versioned + judge-agreement-sampled — an unvalidated judge = vibes with a scoreboard per `research/benchmark.md` integrity rules); pass-bars pre-declared per `business/validation.md` discipline (CI: regression = block)
- Eval cadence: every prompt/model/routing/schema change (per the parent rules — restated: ALL of these are behavior); scheduled drift-checks (model-providers change under you — same-prompt different-behavior happens)

## 2. Guardrail Stack (layered per `core/engineering-principles.md` defense-in-depth — AI-specific)

### Input side

- Prompt-injection defense: input-delimiting (per `ai/prompt-context-engineering.md`), instruction-detection on untrusted content (tool-results/retrieved-docs/user-input — three different trust-levels, three different rules per `ai/ai-security.md`)
- PII/secret redaction pre-model (per `security/secrets.md` + `data/data-governance-quality.md` classification — model-inputs leave your perimeter; classify-then-redact)
- Rate + size budgets (per `security/api-security.md` + `ai/model-operations.md` — cost-DoS is real)

### Output side

- Schema validation (per `ai/structured-output.md` layers — always)
- **Hallucination-prevention stack**: RAG-with-citations per `ai/rag-embeddings-search.md` (grounded by default); "say-when-absent" contracts (no-guessing prompt-rule per `core/agent-rules.md` philosophy); output-verification where checkable (claim → source-check → confidence-flag; automated where the domain allows: code-executes, math-computes)
- Content-policy checks (task-appropriate: medical/legal/financial per `development/ai-features.md` HITL — high-stakes domains gate to human review per `marketing/copywriting.md` proof discipline — unprovable claims don't ship)

### Behavioral

- Refusal-handling eval'd (graceful-refusal vs confusion per `design/ui.md` error-state philosophy — the AI equivalent of "honest error states")
- Bias spot-checks per domain-sensitivity (fairness-lens eval cases in the golden set where the feature touches people-decisions)

## 3. HITL Design (per `development/ai-features.md` rule 7 + `ai/agent-design.md` §5 — the workflow)

- Confidence-routing: low-confidence/blocked outputs → review-queue (not auto-ship) — thresholds from eval-distributions (per `ai/ai-evaluation.md` metric calibration, data-driven not vibes)
- Reviewer-UX: the review-surface shows: output + sources/confidence + the correction-affordance (corrections captured → eval-cases + fine-tuning/feedback signals per `product/user-feedback.md` loop — human effort compounds)

## 4. Release Gates for AI features (wiring into the gate-system per `quality-gates/gates.md`)

- Gate 4 (testing): eval-suite green in CI (treated as the test-suite — same evidence rules)
- Gate 5 (security): the guardrail-stack review (injection-surface, redaction, policy) per `review/security-review.md` + `ai/ai-security.md`
- Gate 8/9: canary with eval-metrics-live (quality metrics in prod per `ai/ai-observability.md` — an AI feature shipped without prod-quality-monitoring = flying deaf)

## Validation Checklist

- [ ] Three eval tiers in CI with pre-declared bars; failures become cases; judges validated
- [ ] Guardrail stack three-sides (input/output/behavioral) wired + adversarial evals in suite
- [ ] HITL confidence-routing + correction-capture; release gates wired

## Handoff

→ prod metrics per `ai/ai-observability.md`; gates per `quality-gates/gates.md`; security detail per `ai/ai-security.md`.
