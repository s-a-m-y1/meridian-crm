---
name: technical-research
description: Structured research before technical decisions — compare, evaluate, trade-offs, document
domain: research
phase: research
priority: high
inputs: [decision-question]
outputs: [research-report, documented-decision]
dependencies: []
next_skills: [architecture/adr, core/decision-log]
---

# Technical Research

## The Mandate

**Research → Compare → Evaluate → Identify Trade-offs → Decide → Document.** No important technical decision (new dependency, framework, datastore, architecture pattern, external service) without a research record. Guessing is a violation of `core/agent-rules.md`.

## When To Use

- Any decision matching `development/dependency-management.md` "gate before install"
- Architecture choices (before `architecture/system-design.md` commit)
- "Which X should we use" questions of any weight

## When NOT To Use

- Trivial choices (linter config) — record only if someone might ask why later (`core/decision-log.md` rule)
- Already-decided areas (check `.ai/decisions/` first — re-researching settled questions wastes context)

## Workflow

1. **Frame the question** precisely: what's being decided, what constraints bind (deadline, budget, existing stack, team skills), what the decision criteria ARE (write them BEFORE looking — prevents post-hoc rationalization)
2. **Gather candidates**: 3-5 options minimum (incl. "keep current approach" as baseline — doing nothing is an option)
3. **Evidence per candidate** (per `business/market-research.md` discipline — sources or marked ESTIMATE):
   - Maturity (releases, issue responsiveness, deprecation signals)
   - Community/ecosystem (talent pool, AI-training corpus — agents code better in popular stacks)
   - Operational fit (hosting, cost model, maintenance burden on OUR shape of project)
   - Security posture (audit results — `security/dependency-security.md`)
   - Migration cost from status quo
4. **Comparison matrix** (criteria × candidates, weighted):
   - Weights decided BEFORE scoring (from step 1 criteria — not after)
   - Each cell: score + one-line evidence
5. **Trade-off statement** (the heart — every option states what it COSTS):
   "Choose A → we accept X for benefit Y; revisit trigger Z"
6. **Decision** → ADR if architectural (`architecture/adr.md`), D-record otherwise (`core/decision-log.md`); one-way-door decisions get human sign-off (per `architecture/adr.md` rules)
7. **Freshness note**: research reports dated + revisit trigger (fast-moving domains — AI libs — expire in months, not years)

## Output — Research Report

```markdown
# Research: <question> — <date> (fresh until: <trigger>)

Decision framing | Criteria + weights | Candidates (3-5, incl. baseline)
Comparison matrix (evidence-linked) | Trade-off statements | Recommendation + ADR/D link
```

## Validation Checklist

- [ ] Criteria written before scoring; weights pre-declared
- [ ] ≥3 real options + do-nothing baseline
- [ ] Every score evidence-linked (no vibes)
- [ ] Trade-offs stated for ALL options (chosen AND rejected)
- [ ] Decision recorded (ADR or D-record) with revisit trigger

## Handoff

→ `architecture/adr.md` / `core/decision-log.md` for the record; implementation via domain skills.
