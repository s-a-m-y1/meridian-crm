---
name: use-cases
description: Structured use-case modeling — actors, flows, extensions for complex interactions
domain: discovery
phase: discovery
priority: medium
inputs: [requirements, personas]
outputs: [use-case-model]
dependencies: [discovery/requirements]
next_skills: [discovery/acceptance-criteria, testing/api-testing]
---

# Use-Case Modeling

## When To Use

Interactions with real branching complexity: multi-actor flows (approval chains, multi-sided actions), business rules heavy (eligibility, limits, state machines), or workflow products (checkout, onboarding, claims). Simple CRUD → `discovery/user-stories.md` alone suffices; use-cases where the FLOW is the requirement.

## Format (per use case)

```markdown
## UC-<n>: <goal as actor phrases it>

- Primary actor: <persona/role> | Secondary: <who else touches it>
- Trigger: what starts it (user action / time / event)
- Preconditions: what must be true (auth, state, data)
- Main success scenario (numbered, actor-system alternating):
  1. Actor: does X
  2. System: validates + responds Y
     ...
- Business rules: (the invariants — eligibility, limits, calculations with formulas)
- Extensions (the failure branches — EACH is a future test case):
  4a. Invalid input at step 4: system responds Z
  7a. Timeout at step 7: system compensates W
  7b. Concurrent attempt: system locks/rejects per rule R2
- Postconditions: state after success (auditable)
- Open issues: unresolved questions + owner
```

## Workflow

1. **Actor inventory** (from personas/stakeholders incl. SYSTEM actors: scheduler, webhook receiver)
2. **Use-case list**: actor × goal matrix ("what does each actor want to accomplish?") — goals in actor language ("submit expense report" not "call POST /expenses")
3. **Model the complex ones** (format above); link simple ones to user stories (avoid double-maintenance — one artifact per flow)
4. **Extensions = test plan seeds**: every extension branch maps to a test case ID at the right level (`testing/strategy.md` assignment: business-rule → unit; multi-system flow → integration/E2E) — the traceability chain extends: requirement → use case → extension → test
5. **Cross-check**: every requirement covered by ≥1 use case or story (gap check per `discovery/requirements.md` traceability); every use case traces to a requirement (no invented flows)

## Rules

- Main scenario stays sunny-side (extensions carry the rain — a 30-step main flow means the design is wrong)
- Business rules with FORMULAS (limits, calculations, eligibility) written precisely — these become unit-test cases verbatim
- Use-case ≠ user-story format: don't force As-a/I-want onto system-actor flows (scheduler jobs etc.)

## Validation Checklist

- [ ] Every complex flow modeled with extensions + business rules
- [ ] Extensions mapped to test IDs (traceability chain intact)
- [ ] Requirement ↔ use-case cross-check done (both directions)

## Handoff

→ ACs from main+extension branches (`discovery/acceptance-criteria.md`); test mapping → `testing/strategy.md`.
