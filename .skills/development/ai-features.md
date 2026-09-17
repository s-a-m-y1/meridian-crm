---
name: ai-features
description: Build LLM-powered features — RAG, agents, evals, prompt engineering, guardrails
phase: development
priority: medium
inputs: [architecture, requirements]
outputs: [ai-feature-spec]
dependencies: [architecture/api, security/api-security, security/secrets]
next_skills: [testing/unit, observability/monitoring]
---

# AI / LLM Features

## Rules

1. **Evals before prompts**: you cannot improve what you don't measure. Every LLM feature has an eval suite (golden set: inputs → expected outputs) that runs in CI. No prompt change merges without eval pass.
2. **Prompt engineering = software engineering**: prompts are versioned, tested, reviewed like code. Use structured prompts (system/user/assistant roles), few-shot examples from evals, strict output schemas (JSON mode / function calling).
3. **RAG over fine-tuning**: retrieval beats fine-tuning for knowledge tasks — chunking strategy, embedding model, reranker, citation required. Every answer must cite sources; no citation = low confidence.
4. **Guardrails before prod**: input validation (PII redaction, injection detection), output validation (schema, allowed topics, refusal on policy violation), rate limits per user, cost caps per request.
5. **Observability**: log every request (prompt hash, model, tokens, latency, cost, user feedback). Alerts on: error rate, latency p95, cost/user, hallucination rate (via eval).
6. **Cost control**: token budgets per request; cache embeddings; semantic cache for repeated queries; model routing (cheap model for simple, expensive for complex).
7. **Human-in-the-loop** for high-stakes: medical/legal/financial outputs require human review before user sees; audit trail mandatory.

## Workflow

1. **Define the task** precisely: input schema, output schema, acceptance criteria (from `discovery/acceptance-criteria.md`), failure modes.
2. **Build eval set**: 50-200 representative inputs + gold outputs (human-written). Store in repo (`evals/golden.jsonl`).
3. **Prompt development**: iterate on prompt + few-shots against eval set. Use structured output (function calling / JSON schema) — no regex parsing of free text.
4. **Build RAG if knowledge needed**: chunking (semantic, ~500 tokens), embedding model (text-embedding-3-small or open-source), vector DB, reranker (cross-encoder), citation extraction.
5. **Guardrails**: input sanitizer (PII, prompt injection), output validator (schema + policy), cost/token limits, rate limit per user.
6. **Eval gate in CI**: eval suite runs on every prompt/model change; regression = block merge.
7. **Observability**: log request/response (sanitized), tokens, latency, cost, user feedback (thumbs up/down). Dashboards per `observability/monitoring.md`.
8. **Human review queue** for high-stakes: flag low-confidence or policy-sensitive outputs for human review before user delivery.

## Eval Gates (must pass to merge)

- Accuracy on golden set ≥ threshold (task-specific, e.g. ≥90% for classification, ≥85% F1 for extraction)
- Hallucination rate < 2% (citations verified)
- Schema compliance 100%
- Cost per request ≤ budget
- Latency p95 ≤ budget

## Handoff

→ `testing/unit.md` (eval suite runs in CI), `observability/monitoring.md` (AI dashboards), `security/api-security.md` (rate limits, injection), `security/secrets.md` (API keys).
