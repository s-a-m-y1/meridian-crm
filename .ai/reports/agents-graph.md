---
title: Agents & Skills Graph
created: 2026-09-16
---

# Agents & Skills Graph

The diagram below visualizes major intent domains routed by `.skills/core/skill-router.md` and their primary skill folders. Use this as a high-level map of which skill to invoke for each intent.

```mermaid
flowchart LR
  subgraph Core
    SR["skill-router"]
  end

  subgraph Domains
    B[Business]
    M[Marketing]
    P[Product]
    D[Development]
    AI[AI]
    S[Security]
    OPS[DevOps/Infra]
    QA[Testing]
    DOCS[Documentation]
    MAINT[Maintenance]
  end

  SR --> B
  SR --> M
  SR --> P
  SR --> D
  SR --> AI
  SR --> S
  SR --> OPS
  SR --> QA
  SR --> DOCS
  SR --> MAINT

  B --> |"business/*"| BUS[business/*]
  M --> |"marketing/*"| MKT[marketing/*]
  P --> |"product/*"| PRD[product/*]
  D --> |"development/*"| DEV[development/*]
  AI --> |"ai/*"| AISK[ai/*]
  S --> |"security/*"| SEC[security/*]
  OPS --> |"devops/*"| DOPS[devops/*]
  QA --> |"testing/*"| TST[testing/*]
  DOCS --> |"documentation/*"| DOC[documentation/*]
  MAINT --> |"maintenance/*"| MNT[maintenance/*]

  %% Example connections
  AISK --> DEV
  DEV --> OPS
  SEC --> DEV
  TST --> DEV
  PRD --> BUS

  classDef group fill:#0b1220,stroke:#1f2937,color:#e6eef6;
  class Core,Domains group;
```

Notes:

- Open this file in VS Code and preview the Mermaid block, or use a Mermaid renderer to export to PNG/SVG.
- If you want a node-per-skill or a directed graph of specific files, tell me and I'll expand the diagram programmatically.
