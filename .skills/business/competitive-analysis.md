---
name: competitive-analysis
description: Map competitors and define defensible differentiation
phase: business
priority: high
inputs: [market-research]
outputs: [competitive-landscape, differentiation-strategy]
dependencies: [market-research]
next_skills: [business/bmc, business/validation]
---

# Competitive Analysis

## Workflow

1. **Identify competitors in 3 rings**:
   - Direct: same customer, same problem
   - Indirect: same customer, different solution (incl. "spreadsheet + WhatsApp" — the most underestimated competitor)
   - Status quo: doing nothing (the real competitor when pain is tolerable)
2. **Profile each direct competitor** (table): positioning, pricing, target, strengths, weaknesses, last-release activity. Sources cited per `market-research.md` rules.
3. **Positioning map**: 2 axes that actually matter to the priority segment (e.g. simplicity↔power, cheap↔premium); plot direct competitors + our intended position.
4. **Wedge analysis** (the key output): what underserved slice can we win first?
   - Where competitors are weak: a segment they ignore, a channel they don't use, a job they do badly, a price band they don't serve
   - Why is that wedge defensible > 6 months (proprietary data, workflow depth, niche focus, distribution)?
   - If NO wedge is defensible, say so — proceeding without differentiation is a business risk to be recorded in `.ai/risks/` (agent-rules: honesty over optimism)
5. **Response scenarios**: what happens when the biggest player copies us? (Move fast / go deeper niche / aggregate their weakness / price-war trap — never fight a price war you can't win)
6. Output feeds positioning (in `bmc.md` customer/value blocks) and roadmap priorities (`product/roadmap.md` — wedge features first).

## Output

```markdown
# Competitive Landscape — <date>

1. Competitor table (3 rings)
2. Positioning map
3. Our wedge + defensibility argument
4. Copy-us scenarios + responses
5. Verdict: differentiation is REAL / THIN / ABSENT (with implications)
```

## Validation Checklist

- [ ] Status-quo + indirect competitors included (not just direct)
- [ ] Wedge defended with argument, not hope
- [ ] "Copy-us" scenario honestly answered
- [ ] No competitor claims without sources

## Handoff

→ `bmc.md` (value prop + channels), `validation.md` (test differentiation with real users).
