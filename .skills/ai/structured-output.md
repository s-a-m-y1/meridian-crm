---
name: structured-output
description: Force reliable machine-readable model outputs — schemas, validation, repair
domain: ai
phase: ai
priority: high
inputs: [prompt-system, consumer-contract]
outputs: [output-contract]
dependencies: [ai/prompt-context-engineering]
next_skills: [development/ai-features, ai/rag]
---

# Structured Output Engineering

Free-text LLM output consumed by software = parsing roulette. THIS skill makes model output a CONTRACT (extending `development/ai-features.md` rule 2's structured-prompts to the output side).

## The Layers (defense-in-depth — never rely on one)

### Layer 1 — Mode selection (strongest available)

- Native structured modes first (function-calling / JSON-mode / response-schemas per provider) — schema-CONSTRAINED decoding where available
- Weaker fallback: "respond ONLY with JSON matching this schema" in system prompt + example (prompt-only = weaker guarantee — layers 2-3 become mandatory)

### Layer 2 — Schema validation (always, regardless of mode)

- Output validated against the consumer's schema (per `security/input-validation.md` discipline — model output is EXTERNAL input to the consuming system: unknown fields rejected, types enforced, enums verified)
- **Schema design for reliability** (make success easy):
  - Flat > deeply-nested (depth = error-amp); fields independently checkable
  - Enums over free-strings wherever possible; constrained formats (dates ISO per `development/i18n-rtl.md` Intl rules)
  - Nullability declared per field (models hedge with null — make it legal where acceptable, reject where not)
  - `additionalProperties: false` — silent extra fields = drift (per `architecture/api.md` strict-schema philosophy applied to model output)

### Layer 3 — Repair path (validation-fail handling — designed, not hoped)

1. **Bounded self-repair**: one retry with the validation error appended ("your output failed: <error>. Return corrected JSON ONLY") — often fixes format-slip
2. **Deterministic repair**: mechanical fixes for common breaks (trailing-comma strip, fence-extraction) — only where provably safe
3. **Fail-safe**: repair-budget exhausted → fallback behavior per consumer criticality: default-value + flag / queue-for-review / hard-error — NEVER pass unvalidated output downstream (per `core/engineering-principles.md` fail-loud rule; silent-bad-data poisons per `data/data-governance-quality.md` quality doctrine)

## Workflow

1. Design the schema WITH the consumer (consumer-driven contract per `testing/advanced-test-types.md` consumer-pact philosophy — the consumer's validation rules ARE the schema)
2. Register schema in the prompt-contract (versioned with it per `ai/prompt-context-engineering.md` §3 — schema change = eval re-run: outputs are behavior)
3. Wire the three layers; repair-budget bounded (2 attempts default) + repair-rate METRICED (per `observability/metrics.md` — repair-rate trending up = prompt/schema rot early-warning)
4. Consumer treats output per `security/input-validation.md`: validate-then-trust, never trust-then-use

## Rules

- One schema per call-purpose (kitchen-sink schemas = validation failure farms)
- The model NEVER writes prose around the structure (mode-enforced or explicitly contracted; prose = parse-roulette)
- Repair attempts logged with the failure-shape (which field, which violation — feeds prompt improvements per `ai/ai-evaluation.md` failure-taxonomy loop)

## Validation Checklist

- [ ] Strongest mode used; schema consumer-driven + strict (additionalProperties false)
- [ ] Three layers wired; repair bounded + metriced; fail-safe per criticality
- [ ] Schema versioned with prompt; evals run on schema changes

## Handoff

→ feature integration per `development/ai-features.md`; evaluation cases per `ai/ai-evaluation.md`.
