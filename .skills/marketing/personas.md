---
name: personas
description: Evidence-based customer personas and journey mapping
domain: marketing
phase: discovery
priority: medium
inputs: [market-research, user-stories]
outputs: [persona-set, journey-maps]
dependencies: [business/market-research]
next_skills: [marketing/copywriting, design/ux]
---

# Customer Personas & Journey

## When To Use

- Copy/messaging needs segment-specific language (`marketing/copywriting.md` "customer's words" rule)
- UX flows need context of use (`design/ux.md`)
- Sales/support needs empathy maps (objection handling)
- NOT for: engineering decisions (use `product/prd.md` directly)

## Persona Format (evidence-based — every field sourced per `business/market-research.md` rules)

```markdown
## Persona: <Name> — <role title>

- Evidence: interviews n=X, survey n=Y (no invented personas)
- Context: company size / situation / tools they use today
- Goals: what success looks like for THEM (their words)
- Pains: current workarounds + cost of the workaround
- Trigger: what makes them start looking for a solution
- Objections: why they hesitate (trust, switching cost, price, priority)
- Decision role: buyer / user / influencer / blocker (B2B: multiple personas per deal)
- Watering holes: where they learn (communities, newsletters)
```

Rules: 2-4 personas max (a persona per user is segmentation, not personas); each maps to a segment from research; negative persona allowed ("who we do NOT serve — and why" prevents drift).

## Journey Map (per persona × per critical flow)

| Stage    | Trigger         | Actions              | Thoughts                 | Emotions          | Barriers            | Our job               |
| -------- | --------------- | -------------------- | ------------------------ | ----------------- | ------------------- | --------------------- |
| Aware    | pain recognized | googles, asks peer   | "is this normal?"        | frustrated        | naming the problem  | content that names it |
| Evaluate | comparing       | trial, demo          | "will this work for ME?" | hopeful+skeptical | setup effort, trust | fastest first-value   |
| Buy      | decision        | pricing page, signup | "am I sure?"             | anxious           | price clarity, risk | proof + reversal      |
| Use      | onboarding      | first project        | "does it deliver?"       | impatient         | friction            | activation path       |
| Advocate | value received  | shares, refers       | "others need this"       | proud             | friction to share   | referral moment       |

- Journey feeds: content per stage (`marketing/content.md` funnel mapping), UX flows (`design/ux.md`), email sequences (`marketing/email.md`)
- Emotion dips = churn-risk points — each barrier gets an owner (product or marketing task)

## Validation Checklist

- [ ] Every persona field evidence-sourced (no fictional demographics)
- [ ] 2-4 personas; negative persona defined
- [ ] Critical journeys mapped with barriers tasked to owners

## Handoff

→ personas feed copy (`marketing/copywriting.md`), UX (`design/ux.md`), objection handling (`maintenance/customer-support.md`).
