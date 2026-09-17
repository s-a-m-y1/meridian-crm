---
name: copywriting
description: Marketing copy that converts — principles, formats, review gates
phase: marketing
priority: medium
inputs: [gtm-plan, messaging-ladder]
outputs: [copy-standards]
dependencies: [business/gtm]
next_skills: [any-marketing-execution]
---

# Copywriting

## Core Principles

1. **Clarity beats cleverness** — if a reader must re-read, it's broken. One idea per sentence.
2. **Specific > generic**: "reduce invoice processing from 3 days to 4 hours" beats "streamline your workflow". Numbers, names, outcomes — vagueness is invisible.
3. **Customer's words, not ours**: lift language from interviews/support tickets (`market-research.md` evidence) — the copy that converts is the words users already use to describe the pain
4. **Structure = inverted pyramid**: hook (the reader's problem in their words) → promise (the outcome) → proof (how/evidence) → CTA (one, specific)

## Format Standards

| Asset                    | Rules                                                                                                                                               |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Landing hero             | Headline = outcome, not product ("Close books 10× faster" not "Accounting software"); subhead = for whom + how; CTA verb-first ("Start free trial") |
| Value props (3 max)      | Each: benefit → mechanism → proof point; no feature lists masquerading as value                                                                     |
| CTA                      | One per view; verb + value + risk-reversal ("Start free — no card required")                                                                        |
| Ads                      | Hook ≤ 8 words; body = problem→promise→CTA; honest (fake urgency/trust bait banned per `business/growth.md`)                                        |
| Email subject            | One clear promise; no clickbait gap ("You won't believe…" = spam filter + trust death)                                                              |
| Pricing page             | Anchor value before price; tier choice obvious; FAQ handles top-3 objections from support data                                                      |
| Empty/error product copy | From `design/ui.md` states — say what happened + what to do next, never "Oops!" (applies to ALL product surfaces)                                   |

## Proof Ladder (use strongest available, in order)

Numbers from real usage > named customers/logos > specific mechanism claims > generic claims (banned — "best-in-class" says nothing).

## Review Gate (before publishing anything)

- [ ] Would the target segment say "that's my problem" at the hook? (their words — evidence-backed)
- [ ] Every claim has a proof path (specific number/mechanism/customer or it's cut)
- [ ] One CTA; is the next action obvious without thinking?
- [ ] Read-aloud test: any sentence needing re-read = rewritten
- [ ] Honesty check: no inflated claims the product can't back (support tickets will collect the debt)

## Testing

Headlines/CTAs A/B per `marketing/paid.md` protocol (pre-declared bars, one variable, failures logged) — copy is tested, not debated.

## Handoff

→ standards apply to every marketing skill + product UI copy (`design/ui.md`).
