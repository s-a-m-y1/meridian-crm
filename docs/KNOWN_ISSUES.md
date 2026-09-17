# Known Issues — E-commers-Crm

Open issues found during audit/planning. Empty repo → no code issues yet; this file tracks design-level risks and blocked questions.

## Open

| ID | Issue | Impact | Owner | Status |
| -- | ----- | ------ | ----- | ------ |
| K-001 | No existing repository to audit — greenfield confirmed by user | Scope framing | Agent 5 | RESOLVED (user chose build fresh) |
| K-002 | Payments/billing requirements undefined | Deferred per prompt §31 | — | DEFERRED |
| K-003 | File/media upload requirements undefined (property images?) | Deferred until confirmed | — | DEFERRED |
| K-004 | AI providers/models/config to be chosen at Phase 6 | Affects abstraction defaults | Agent 3 | OPEN |
| K-005 | Redis version / BullMQ version pinning TBD | DevOps | Agent 5 | OPEN |
| K-006 | Deployment target (cloud provider / VPS) unspecified | DevOps | Agent 5 | OPEN |
| K-007 | Email/WhatsApp sending provider unspecified (follow-ups) | Agent 3 | — | OPEN |
| K-008 | Stale HISN tasks in `.ai/tasks/` (T-100..T-103) not relevant to this repo | Memory hygiene | — | OPEN — pending removal confirmation |

## Closed

- (none yet)