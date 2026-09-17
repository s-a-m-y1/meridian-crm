---
name: market-research
description: Research the market — size, trends, segments, customers — evidence-based
phase: business
priority: high
inputs: [raw-idea]
outputs: [market-research-report]
dependencies: []
next_skills:
  [business/competitive-analysis, business/validation, discovery/idea-analysis]
---

# Market Research

## Rules

1. **No invented numbers.** Every figure has a source (public data, user-provided data, or explicit estimate marked `ESTIMATE — method`). Fabricated market data is a finding-level failure (agent-rules: never guess).
2. Research answers 4 questions only — don't drift: Is there a real problem? Is the market big enough? Who exactly is the customer? Is it moving toward or away from us?

## Workflow

1. **Problem validation** (the most important): who has this pain today, how do they cope without us, how painful is it (money/time lost, frequency)? "People would like it" ≠ market.
2. **Market sizing** (top-down + bottom-up, show both):
   - TAM: total market (from public reports — cite)
   - SAM: segment we can actually serve (filter by language/region/platform)
   - SOM: realistic 3-year capture (bottom-up: segments × conversion × price — show the math)
3. **Trends**: 3-5 relevant trends (tech, behavior, regulation), each marked tailwind/headwind + source + implication for us.
4. **Customer segments**: 2-4 segments; for each: who, context of pain, current workaround, willingness-to-pay signals (what they already pay for), where they gather (channels).
5. **Evidence log**: every claim → source row (URL/data/reference/user-interview). Claims without sources get flagged `UNVERIFIED` and go to `.ai/context/assumptions.md`.

## Output — Market Research Report

```markdown
# Market Research — <idea> — <date>

1. Problem & Evidence (pain quotes/numbers, current workarounds)
2. Market Size: TAM/SAM/SOM (both methods, math shown, sources)
3. Trends (tailwind/headwind + implications)
4. Customer Segments (2-4, with WTP signals + channels)
5. Evidence Log (claim → source table)
6. Verdict: GO / NO-GO / NEEDS-MORE-EVIDENCE + the single biggest unknown
```

## Validation Checklist

- [ ] Every number sourced or marked ESTIMATE with method
- [ ] Bottom-up SOM math shown (no "1% of a big market" hand-waving)
- [ ] At least one WTP signal per priority segment
- [ ] Verdict + biggest unknown stated (feeds `validation.md`)

## Handoff

→ `competitive-analysis.md` (who else solves this), `validation.md` (test the unknowns), `discovery/idea-analysis.md` (now grounded in evidence).
