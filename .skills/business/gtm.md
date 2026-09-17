---
name: go-to-market
description: Launch and acquisition strategy — channels, messaging, metrics
phase: business
priority: medium
inputs: [bmc, validation, competitive-analysis]
outputs: [gtm-plan]
dependencies: [bmc, validation]
next_skills: [business/growth, product/roadmap]
---

# Go-To-Market

## Workflow

1. **Beachhead**: ONE priority segment from research (the wedge buyers) — GTM for "everyone" reaches no one.
2. **Positioning statement** (fill exactly):
   > For **<segment>** who **<problem context>**, **<product>** is a **<category>** that **<key benefit>**. Unlike **<main alternative>**, we **<defensible difference from competitive-analysis>**.
3. **Messaging ladder** (same core, 3 levels): one word/phrase hook → one sentence (the statement above) → one paragraph (how it works + proof). Consistency across every channel (per `core/communication.md` precision).
4. **Channel plan** (pick 1-2 to start — focus beats spread):
   - For each candidate: cost, control, speed, ceiling (e.g. content: low cost/slow/low control/high ceiling; ads: fast/high cost/medium ceiling; partnerships: slow/high ceiling; community: cheap/high trust/slow)
   - Match to where the segment gathers (research evidence, not vibes)
   - One primary acquisition channel until it saturates, then add — 5 channels at 20% each = 0 working channels
5. **Launch plan** (pick a lane — don't improvise):
   - **Betas**: private beta → public launch ladder (works with community/feedback loops)
   - **Big bang**: PR/launch-day (needs a hook + existing audience; risky without)
   - **Stealth drip**: build in public / SEO flywheel (slow compounding)
6. **Metrics + targets** (declare BEFORE launch):
   - Funnel: visitors → signups → activated (first value moment) → paid
   - Targets per stage with dates; channel-attributed where possible
   - Activation definition written precisely (e.g. "created first project + invited 1 teammate" — not "used the product")
7. **Timeline** (90-day GTM): pre-launch (waitlist/beta) → launch → learn-and-iterate loops (weekly metric reviews, per `core/memory-management.md` cadence discipline).

## Output — GTM Plan

```markdown
# GTM — <date>

Beachhead | Positioning statement | Messaging ladder
Channels (chosen + why, rejected + why)
Launch lane + plan | Funnel metrics + pre-declared targets | 90-day timeline
```

## Validation Checklist

- [ ] ONE beachhead segment (named specifically)
- [ ] 1-2 channels max initially, justified by segment evidence
- [ ] Activation defined as a measurable action
- [ ] Targets declared pre-launch (per validation discipline)

## Handoff

→ `growth.md` (post-launch engine), funnel metrics → `observability/metrics.md` business metrics (instrument from day one).
