---
name: scope-management
description: Define, defend and change scope — anti-scope-creep discipline
domain: discovery
phase: discovery
priority: medium
inputs: [requirements, mvp-definition]
outputs: [scope-charter]
dependencies: [discovery/requirements, product/mvp]
next_skills: [product/prd, core/task-management]
---

# Scope Definition & Management

## Workflow

### 1. Define (the scope charter)

```markdown
# Scope Charter — <project/milestone>

- Objective (one sentence — the test for everything entering scope)
- IN: explicit list (feature/statement level — "password reset via email link")
- OUT: explicit list (the honest anti-backlog: "social login — revisit trigger: 1000+ password resets/month", "admin analytics dashboard — post-MVP")
- Constraints: budget/deadline/compliance that bind the scope
- Change control: who approves scope changes (named role, not "the team")
```

Rules: OUT-list as deliberate as IN (per `product/mvp.md` deferral discipline — every OUT item has a revisit trigger, not "someday"); the objective sentence is the membership test — "does X serve it?"

### 2. Defend (creep detection — the recurring battle)

Every incoming request passes:

| Test         | Question                           | Creep signal                           |
| ------------ | ---------------------------------- | -------------------------------------- |
| Objective    | serves the one-sentence objective? | "nice to have"                         |
| Persona      | which persona, which pain?         | "users might want" (no persona)        |
| Value/effort | worth it NOW vs milestone cost?    | small asks stacking ("just one field") |
| MVP          | in the MVP definition?             | gold-plating                           |

Responses to creep (in order of preference): NO (with revisit trigger — recorded, not offended), DEFER (next milestone — logged), SWAP (what leaves scope to make room? — scope is zero-sum and honest swaps make that visible), RARELY: accept with re-prioritization (something moves down).

### 3. Change (controlled scope change)

New requirement discovered mid-build (legitimate — discovery happens during building too):

1. Validate: real requirement or solution-hunting? (`discovery/requirements.md` bar: persona + pain)
2. Impact analysis: files × effort × schedule × gate re-open (which gates re-run per `quality-gates/gates.md` re-gate rules)
3. Decision by the charter's change-control role; recorded via `core/decision-log.md` + charter updated
4. Cost made visible: "yes + 3 days" or "yes, swap out Y" — never silent absorption (silent scope growth is how projects die politely)

## Rules

- Mid-task scope growth → NEW task, never task-morphing (`core/task-standard.md` rule 4 — this skill is its charter-side partner)
- The builder flags scope pressure to the decision-maker (agents report creep signals, don't absorb them — per `core/communication.md`)
- Zero-sum honesty: every accept names its swap or delay

## Validation Checklist

- [ ] Charter with IN/OUT (OUT with triggers), objective test + change-control owner
- [ ] Creep tests applied to every post-charter request (log of requests + dispositions)
- [ ] Changes impact-analyzed + recorded; swaps explicit

## Handoff

→ charter feeds `product/prd.md` scope section; change log → `.ai/decisions/`.
