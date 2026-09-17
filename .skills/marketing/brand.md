---
name: brand-strategy
description: Brand positioning, voice, and identity system
domain: marketing
phase: marketing
priority: medium
inputs: [gtm, competitive-analysis, market-research]
outputs: [brand-guide]
dependencies: [business/gtm]
next_skills: [marketing/copywriting, design/design-system]
---

# Brand Strategy

## Workflow

1. **Brand positioning** (from `business/gtm.md` positioning statement — brand operationalizes it):
   - What we want to own in the customer's head (one attribute: fastest, safest, simplest — pick ONE)
   - Proof we can own it (from product reality; unprovable claims are marketing debt)
2. **Voice & tone**:
   - 3 adjectives (e.g. direct, precise, human) + 1 anti-pattern ("never corporate-jargon")
   - Tone modulation per context: support ticket (warm + direct) vs incident page (calm + factual)
3. **Naming system**: product names, feature names (metaphor families — consistent mental model), internal codenames
4. **Visual identity** (interface with `design/design-system.md` — brand feeds tokens):
   - Color meaning (primary + semantic), typography personality, imagery rules (real screenshots > stock people)
5. **Brand do/don't**: concrete examples — "We say 'ship', not 'deploy to production environment'" (voice made actionable)
6. **Consistency application**: same voice in product UI empty states (`design/ui.md` states copy), error messages, invoices, support macros — brand is every surface, not the logo

## Rules

- One attribute — brands trying to own "fast AND safe AND premium AND friendly" own nothing
- Every brand claim traceable to product proof (per `marketing/copywriting.md` proof ladder)
- Boring + consistent beats exciting + scattered (recognition compounds)

## Validation Checklist

- [ ] One owned attribute + proof path
- [ ] Voice guide with do/don't examples (not adjectives alone)
- [ ] Applied to at least: landing page, product empty states, support macros, changelog

## Handoff

→ `marketing/copywriting.md` (all copy), `design/design-system.md` (visual tokens).
