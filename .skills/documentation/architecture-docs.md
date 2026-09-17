---
name: architecture-documentation
description: Keep architecture docs synchronized with reality
phase: documentation
priority: medium
inputs: [adr-catalog, architecture-summary]
outputs: [architecture-docs]
dependencies: [architecture/adr, architecture/system-design]
next_skills: [quality-gates]
---

# Architecture Documentation

## Structure

```markdown
# Architecture — <project>

## Overview (what + why of the system, 1 paragraph + C1 diagram)

## Containers (C2: each with responsibility, tech, owner domain)

## Key Decisions (ADR index — links, status, one-line each)

## Data Flows (critical flows step-by-step: request lifecycle, async jobs, payments/webhooks)

## Data Model (ER summary + why-it's-shaped-that-way pointers to ADRs)

## Cross-Cutting (auth, caching, observability, error taxonomy)

## Operational Notes (scaling knobs, known limits, failure modes per container)
```

## Rules

1. **Docs = reality**: any ADR-accepted decision updates this doc in the same PR; an architecture doc describing last year's system is worse than none (agents will trust it — per `core/context-management.md` this doc is boot context).
2. Diagrams as code (mermaid/plantuml) in-repo — version-controlled, reviewable in diffs.
3. Explain **why** over what — the what is the code; the why is ADRs + this doc's value.
4. `.ai/architecture.md` stays the live summary (fast agent context); this doc is the full reference — summary links to reference, never duplicates detail.

## Validation Checklist

- [ ] C1/C2 diagrams match current deploys
- [ ] Every accepted ADR reflected/indexed
- [ ] Failure modes documented per container (matches `monitoring.md` reality)

## Handoff

→ Gate 7; feeds onboarding via `readme.md` link.
