# ADR-009 — Greenfield Build in E-commers-Crm

- **Date**: 2026-09-17
- **Status**: PROPOSED (pending user sign-off)
- **Context**: Master Build Prompt V3 assumes an existing repo to audit; audit found `/home/sami/E-commers-Crm` empty (no code, no git). User chose "Plan first, build later".
- **Decision**: Build the Real Estate CRM greenfield in `/home/sami/E-commers-Crm` using the master prompt as the authoritative spec. Phase 0 produced the docs set in `/docs/`.
- **Consequences**: No legacy preservation needed. All features start at MISSING in the implementation matrix. Phased build per `docs/BUILD_PLAN.md` with per-phase checkpoints.
- **Risk**: Large scope; mitigated by phased checkpoints, gates, and no phase advancement while BLOCKED.