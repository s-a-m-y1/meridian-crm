---
name: feature-specification
description: Write complete feature specs — the single source of truth for a feature
domain: product
phase: product
priority: high
inputs: [feature-request, requirements]
outputs: [feature-spec]
dependencies: [discovery/requirements]
next_skills: [core/task-management, design/ux]
---

# Feature Specification

## Position

Between PRD (portfolio of features) and tasks (build units): ONE feature, everything needed to build it correctly. The anti-ambiguity artifact — if two people read the spec and imagine different things, the spec is broken.

## Format (per feature)

```markdown
# FS-<n>: <feature name>

- Source: <story/request/strategic pillar link> | Priority | Status: draft/review/approved
- Objective: one sentence — the outcome (the membership test for every detail below)

## Scope

In: <explicit> | Out: <explicit, with revisit triggers per `discovery/scope-management.md`>

## User-facing behavior

- Personas served (from `marketing/personas.md`)
- User stories + ACs (Given/When/Then per `discovery/acceptance-criteria.md` — failure paths mandatory)
- States: empty/loading/error/boundary (per `design/ui.md` — specified HERE, not improvised by the builder)
- Edge cases: enumerated with expected behavior (longest string, concurrency, permission denial)

## Interactions & flows

- Flow diagrams or step lists (from `discovery/user-journey.md` / `design/ux.md`)
- Copy/UI notes (per `marketing/copywriting.md` — key strings drafted here: empty states, error messages, success confirmations)

## Technical requirements (links, not duplication)

- Architecture fit: ADR references + contract impact (`architecture/api.md` drift check)
- Data: schema/migration implications (`development/database.md` — two-step for breaking)
- Security: auth matrix row, validation surface (`security/auth-security.md`, `security/input-validation.md`)
- Performance: budget (p95 target, N+1 ban per `review/performance-review.md`)
- Observability: metrics/logs to add (`observability/metrics.md`)
- Flags: rollout strategy (`development/feature-flags.md` — flag name + rollout plan)

## Non-goals (explicit)

## Open questions (each: question, owner, needed-by, blocking-status)

## Measurement

- Success metric + target (metric tree link — how we KNOW it worked post-launch)
```

## Workflow

1. Draft from the request (evidence: persona + pain per `discovery/requirements.md` bar)
2. **Ambiguity hunt**: every vague term ("fast", "valid", "admin") replaced with numbers/enums/named roles — the spec review hunts ONLY for ambiguity (a spec review debating solutions instead of precision = wrong meeting)
3. Review: builder-facing (can I build this without asking questions? — the completeness test) + stakeholder-facing (does it match the objective?)
4. Approve → tasks via `core/task-management.md` decomposition (spec's technical section maps directly to task seams)
5. **Spec changes during build**: recorded in the spec + re-review (the spec stays the truth — a feature built from an outdated spec is undocumented work)

## Rules

- Specs link to standards, never restate them (duplication rots — one source per rule per `core/agent-rules.md` docs-sync)
- The completeness test is THE bar: zero builder questions needed = spec done
- Success metric mandatory (unmeasurable feature = why are we building it?)

## Validation Checklist

- [ ] Zero ambiguous terms (the ambiguity hunt ran)
- [ ] ACs with failure paths; all UI states specified
- [ ] Technical sections are links not duplications
- [ ] Success metric + target declared

## Handoff

→ `core/task-management.md` (decompose), `design/ux.md` (detailed flows if UI-heavy).
