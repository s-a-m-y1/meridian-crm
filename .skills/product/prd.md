---
name: prd
description: Generate the Product Requirements Document consolidating all planning artifacts
phase: product
priority: high
inputs: [requirements-specification, discovery-brief]
outputs: [prd]
dependencies: [requirements]
next_skills: [mvp, architecture/system-design]
---

# PRD Generation

## Workflow

1. Assemble from existing artifacts — do not invent new content at this stage.
2. Structure (order matters: context before detail):

   ```markdown
   # PRD — <project>

   1. Overview — one paragraph; problem + proposed solution + success metric
   2. Background & Goals — from discovery brief (goals with metrics)
   3. Target Users & Personas
   4. Functional Requirements — FR table from requirements (with MoSCoW)
   5. Non-Functional Requirements — NFR table (quantified)
   6. User Experience Summary — key flows at milestone level (detail → design phase)
   7. Scope — In / Out (from brief + MVP deferral list)
   8. Dependencies & Integrations — external systems, accounts, data sources
   9. Risks & Mitigations
   10. Success Metrics — how we'll know it worked (activation, retention, latency SLOs)
   11. Milestones — summary level (detail → roadmap.md)
   12. Open Questions — each with owner and needed-by date
   ```

3. Review pass: every section traceable to source artifact; any "new" content → go update the source artifact instead.

## Validation Checklist

- [ ] A new engineer could build the right thing from this doc alone
- [ ] No internal contradictions (FR vs NFR, scope vs goals)
- [ ] Open Questions are real and owned (not "TBD" filler)
- [ ] Success metrics measurable post-launch (monitoring plan exists — `observability/metrics.md`)

## Handoff

→ `mvp.md` (cut scope), `architecture/system-design.md` (technical response), `design/ux.md` (experience design).
