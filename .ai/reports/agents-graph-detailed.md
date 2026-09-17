---
title: Agents & Skills Graph — Detailed
created: 2026-09-16
---

# Detailed Agents → Skills Graph

This diagram expands the high-level mapping into a node-per-skill view for core routes in `.skills/core/skill-router.md`.

```mermaid
flowchart LR
  SR["skill-router"]

  %% Product & Discovery
  SR --> NP["workflows/new-project.md"]
  SR --> RE["discovery/user-journey.md"]
  SR --> RS["research/technical-research.md"]

  %% Business & Marketing
  SR --> BM["business/market-research.md"]
  SR --> PM["marketing/content.md"]
  BM --> PM

  %% Product
  SR --> PD["product/feature-specification.md"]
  SR --> PRD["product/prd.md"]

  %% Development & APIs
  SR --> DEV["development/new-feature.md"]
  DEV --> API["development/api.md"]
  DEV --> DB["development/database.md"]

  %% AI
  SR --> AIF["ai/agent-design.md"]
  SR --> RAG["ai/rag-embeddings-search.md"]
  AIF --> RAG

  %% Mobile
  SR --> MOB["development/mobile.md"]

  %% Security
  SR --> SEC1["security/threat-modeling.md"]
  SR --> SEC2["review/security-review.md"]
  SEC1 --> SEC2

  %% DevOps / CI / Release
  SR --> CI["devops/ci.md"]
  SR --> REL["workflows/release.md"]
  CI --> REL

  %% Testing & Performance
  SR --> TST["testing/strategy.md"]
  SR --> PERF["testing/performance.md"]
  TST --> PERF

  %% Documentation & Maintenance
  SR --> DOCS["documentation/*"]
  SR --> MAINT["maintenance/maintenance-operations.md"]

  classDef core fill:#071822,stroke:#1f2937,color:#e6eef6;
  class SR core;
```

If you want, I can auto-generate a complete graph that enumerates every file under `.skills/` and `.ai/tasks/` and draws ownership arrows — say `yes` and I'll parse the repo and produce a full SVG export.
