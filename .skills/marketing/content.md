---
name: content-marketing
description: Build and run a content engine that compounds — strategy, calendar, production
phase: marketing
priority: high
inputs: [gtm-plan, market-research]
outputs: [content-strategy, editorial-calendar]
dependencies: [business/gtm]
next_skills: [marketing/seo, business/growth]
---

# Content Marketing

## Workflow

1. **Strategy before volume** — pick ONE content bet that matches the beachhead (`business/gtm.md`):
   - Problem-content (answers the pain our segment Googles/asks) — default for most B2B/tools
   - Education-content (how to do the job better, product-adjacent)
   - Proof-content (case studies, benchmarks, teardowns) — highest trust, slowest
   - Match to segment evidence from `market-research.md` (where they gather, what they read) — not to our preferences
2. **Content map**: 1 pillar topic (the product's domain) → 8-12 cluster pieces (questions the segment actually asks — sourced from research/support/interviews, not invented) + 2-3 "money pages" that convert (comparison, alternatives, pricing-guide) linked from every cluster piece.
3. **Editorial calendar** (90-day, realistic cadence — quality beats frequency):
   - Columns: date | working title | target keyword/question | funnel stage (TOFU/MOFU/BOFU) | owner | status (IDEA→DRAFTING→REVIEW→SCHEDULED→PUBLISHED→MEASURED)
   - Every piece: 1 primary keyword/question + 1 CTA (trial/demo/newsletter — declared)
4. **Production rules**:
   - Brief before draft: audience segment, target question, outline, CTA, pass bar (per `business/validation.md` discipline)
   - Draft standards: answer-first structure (the answer in the first 100 words), scannable, evidence over adjectives, examples with real numbers
   - Review gate: one reviewer for accuracy + one for segment-language fit (per `review/code-review.md` spirit — implementer≠reviewer)
5. **Distribution per piece** (a piece published and not distributed doesn't exist): 2-4 channel-specific derivatives (social thread, newsletter item, community answer) — planned in the calendar, not improvised.
6. **Measurement loop**: per piece — traffic, rankings, signups attributed (pass bars declared at publication); monthly content review: double down on what works, documented kills of what doesn't (log in `.ai/context/growth-log.md` per `business/growth.md`).

## Validation Checklist

- [ ] ONE content bet chosen and justified by segment evidence
- [ ] Calendar filled with target question + CTA + pass bar per piece
- [ ] Every published piece has distribution plan + measured result
- [ ] Monthly review loop scheduled

## Handoff

→ `seo.md` (search performance), `business/growth.md` (experiments register).
