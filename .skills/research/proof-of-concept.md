---
name: proof-of-concept
description: Run technical spikes and PoCs that de-risk decisions with evidence
domain: research
phase: research
priority: high
inputs: [research-question]
outputs: [poc-report, evidence]
dependencies: [research/technical-research]
next_skills: [architecture/adr]
---

# Proof of Concept & Technical Spike

## When To Use

- A decision depends on an UNVERIFIED claim (performance, integration feasibility, edge-case behavior)
- Novel combination (our stack + candidate tech) with no precedent evidence
- Estimates need calibration (a 2-day spike prevents a 2-week wrong-path build)

## When NOT To Use

- Verifiable by reading docs/source (spending hours to learn what's written down)
- Production features disguised as PoCs (spike code that ships = the riskiest code in the repo)

## Workflow

1. **Define the question + kill criteria FIRST** (per `business/validation.md` pre-declared bars):
   "PoC answers: can Postgres full-text search handle 10M rows < 100ms p95 for OUR query shapes?
   Kill if: p95 > 200ms or relevance unacceptable vs Elasticsearch baseline"
2. **Timebox** (2h-2d; over 2d = decompose or escalate — spikes that sprawl are projects)
3. **Build the thinnest thing that answers**: realistic data volume + shape (10M rows of synthetic-but-realistic — 100-row demos answer nothing), the ACTUAL scenario (our queries, our auth, our payload sizes)
4. **Measure honestly** (`testing/performance.md` evidence rules): median-of-3 runs, cold+warm, conditions documented; negative results are RESULTS
5. **PoC report**:

   ```markdown
   # PoC: <question> — <date> (timebox: Xh, spent: Yh)

   Answer: YES/NO/PARTIAL (with the numbers)
   Evidence: commands + outputs (repro script committed under /spikes/)
   Constraints found: (surprises — the real value of PoCs)
   Recommendation: proceed/adjust/kill option — feeds the research report
   ```

6. **Dispose properly**: spike code goes to `/spikes/` (or a branch, archived) — NEVER merges to main as-is; if prod-bound, it re-enters via full `development/implementation.md` loop (a PoC "promoted" by copy-paste is un-reviewed, un-tested code with a halo)

## Rules

- One question per spike (multi-question spikes answer nothing well)
- Timebox overflow = answer "question too big, split it" — not "give me more time"
- PoC evidence expires: note re-validation trigger (version upgrades, data growth)

## Validation Checklist

- [ ] Question + kill criteria written BEFORE building
- [ ] Timeboxed; realistic data/conditions
- [ ] Answer with numbers + repro script
- [ ] Spike code quarantined (not merged)

## Handoff

→ report attached to the research decision (`research/technical-research.md` step 6 → ADR).
