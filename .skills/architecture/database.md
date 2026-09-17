---
name: database-architecture
description: Design database architecture — engine, modeling approach, scaling, backup
phase: architecture
priority: high
inputs: [system-design, requirements-specification]
outputs: [database-architecture-document]
dependencies: [system-design]
next_skills: [development/database]
---

# Database Architecture

## Workflow

1. **Engine selection** against access patterns (ADR required): default SQL (PostgreSQL); NoSQL only when a dominant access pattern + scale genuinely fits (document lookups, massive write streams, flexible schema).
2. **Modeling approach**: relational with constraints (FK, unique, not-null) as primary integrity layer; JSON columns for genuinely schemaless payloads — never as a general dumping ground.
3. **Scale plan staged** (revisit by trigger, not preemptively):
   - Stage 0: single primary + read replicas
   - Trigger points → connection pooling → caching layer → partitioning → sharding (last resort, one-way door)
4. **Multi-tenant decision**: schema-per-tenant / shared schema with tenant_id / DB-per-tenant — ADR with reversibility analysis (hardest decision to undo later).
5. **Backup & recovery** to meet RTO/RPO from NFRs: automated backups, PITR, tested restore procedure (an untested backup is not a backup).
6. **Data lifecycle**: retention rules, PII classification, archival, deletion paths (GDPR right-to-erasure).
7. Document per-table expectations: growth rate, read/write ratio, index strategy headroom.

## Validation Checklist

- [ ] Engine choice ADR'd with access-pattern evidence
- [ ] Multi-tenancy decision made explicitly + ADR'd
- [ ] RPO/RTO met by a _tested_ restore procedure
- [ ] Data lifecycle (PII, retention, deletion) defined

## Handoff

→ `development/database.md` (schema design + migration standards).
