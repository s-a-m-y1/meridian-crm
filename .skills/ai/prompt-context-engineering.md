---
name: prompt-context-engineering
description: Design prompts and context windows as engineered artifacts
domain: ai
phase: ai
priority: high
inputs: [ai-feature-spec]
outputs: [prompt-system]
dependencies: [development/ai-features]
next_skills: [ai/structured-output, ai/agent-design]
---

# Prompt & Context Engineering

Prompts are SOFTWARE (per `development/ai-features.md` rule 2 — this skill is its engineering discipline). Applies to: product LLM features, internal AI tooling, and agents themselves (the skills system's own prompts per `agents/contract.md`).

## 1. Prompt Architecture (structure beats cleverness)

- **System prompt = the constitution**: role, capabilities, hard rules (never-guess per `core/agent-rules.md` style), output contract. Stable, versioned, reviewed like code
- **User/instruction layer**: the task + constraints + the INPUT clearly delimited (input-marking: ```data fences — model must never confuse instructions with data: the prompt-injection defense layer 1 per `ai/ai-security.md`)
- **Few-shot examples**: 2-5 covering the decision-boundaries (the hard cases, not easy ones — examples teach the EDGES); examples versioned with the prompt (an example change = behavior change = eval run per `development/ai-features.md` eval-gate rule)
- **Chain-of-thought where reasoning-heavy**: explicit scratchpad/plan-then-answer structure for multi-step tasks (structured per `core/task-management.md` decomposition philosophy — same discipline, tokenized)

## 2. Context Engineering (the scarce-resource discipline — per `core/context-management.md`, extended)

- **Budgeted context**: system + instructions + examples + data must fit budget WITH room for output; per-component token budgets declared; over-budget = TRUNCATION POLICY designed (which layer shrinks first — data-summaries before rules — never silent mid-cut)
- **Relevance-first loading**: only task-relevant context enters (the skills-system's minimum-read protocol generalized: grep-then-read, never dump-whole-repo — context bloat degrades reasoning per `core/context-management.md` cost rule)
- **Context ordering**: stable positions (rules first/last per model-attention realities — tested per `ai/ai-evaluation.md`, not folklore); recency-critical data placed deliberately
- **State across turns**: conversation-state design (what carries forward: summarized, not raw — rolling summary discipline; per `agents/protocol.md` disk-over-memory philosophy: state OUTLIVES the window via files/checkpoints)

## 3. Versioning & Change Discipline

- Prompts version-controlled with owners + change-log (what behavioral change + why — per `core/decision-log.md` bar: re-derivable-in-a-week = logged)
- **Every prompt change runs evals before merge** (per `development/ai-features.md` eval-gate — THE gate; no "small tweak" exceptions: prompt diffs are behavior diffs)
- A/B of prompt variants = experiment discipline (per `product/experimentation.md` one-variable + pre-declared bars — applied to prompt variants)

## 4. Anti-Patterns (the review checklist)

- Instruction-in-datum confusion (unmarked input — injection surface per `ai/ai-security.md`)
- Kitchen-sink prompts (10 tasks in one — decompose per `core/task-management.md`; multi-task prompts degrade all tasks)
- Unversioned "live" prompt edits ("quick prod fix" — the eval-bypass classic)
- Context-as-dump (whole-file/whole-repo loading — the budget violation)
- Negative-only rules ("don't do X, Y, Z..." — 20-line; replace with ONE positive spec of correct behavior where possible — clearer + shorter)

## Validation Checklist

- [ ] System prompt versioned + reviewed; examples teach boundaries
- [ ] Token budgets per layer + designed truncation policy; relevance-loaded
- [ ] Eval-gate wired on every prompt change (CI-enforced)
- [ ] Anti-pattern scan clean (injection-delimiters, decomposition, versioning)

## Handoff

→ output contracts: `ai/structured-output.md`; agent-shaped prompts: `ai/agent-design.md`; evaluation: `ai/ai-evaluation.md`.
