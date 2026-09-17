---
name: architecture-review
description: Verify implementation conforms to decided architecture
phase: review
priority: medium
inputs: [diff-or-design, adr-catalog, architecture-summary]
outputs: [conformance-findings]
dependencies: [architecture/adr, architecture/system-design]
next_skills: [quality-gates]
---

# Architecture Review

## Checklist

1. **ADR compliance**: does the change follow accepted ADRs? Any decision being silently violated or implicitly changed?
2. **Layer/boundary discipline**: imports respect module boundaries; no layer-skipping (controller→repo); no feature reaching into another feature's internals (only its public API).
3. **Contract integrity**: API schema, DB schema, event contracts changed only via documented, versioned change — with consumers updated in the same release or a compat plan.
4. **Cross-cutting consistency**: new endpoints have auth/validation/logging/rate-limiting like everything else; new components use design tokens not raw values.
5. **Fit for NFR drivers**: does the change preserve the scalability/reliability properties the architecture promised (stateless app tier, no new SPOFs, no chatty cross-service calls in hot paths)?
6. **New implicit decisions**: anything that _is_ an architectural decision (new datastore, new process, breaking change) appearing without an ADR → flag CRITICAL.

## Findings Format

Same severity model as `code-review.md`. Typical: `[CRITICAL] undocumented architectural decision`, `[HIGH] boundary violation: orders imports billing internals`, `[MEDIUM] contract change without version bump`.

## When

- Any change touching: contracts, data model, auth model, process/infra topology, or adding a dependency of architectural weight
- Gate 2 (architecture gate) at design time; re-check at Gate 8 pre-release

## Handoff

→ findings to implementer; compliance status to `quality-gates/gates.md`.
