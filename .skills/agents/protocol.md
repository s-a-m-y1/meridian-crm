---
name: agent-protocol
description: Communication protocol between agents — formats, addressing, disagreement resolution
phase: agents
priority: high
inputs: []
outputs: [message-protocol]
dependencies: [core/communication, core/delegation]
next_skills: [agents/lifecycle]
---

# Inter-Agent Protocol

All agent-to-agent communication is **on disk, structured, addressed** — never chat, never implicit.

## 1. Message Format (`.ai/context/messages/M-<seq>.md`)

```markdown
---
from: QA | to: DEV-BE | task: T-0042 | type: FINDING | severity: HIGH
date: <ts> | status: OPEN | ACKED | RESOLVED
---

## Finding: <one-line>

- Evidence: <test/scan/probe output — command + exit code or log lines>
- Expected vs actual: <...>
- Suggested fix: <file:line + concrete change>
- Blocks: merge of T-0042 (Gate 4)

## Notes
```

## 2. Message Types

| Type       | Used by                 | Meaning                                                              |
| ---------- | ----------------------- | -------------------------------------------------------------------- |
| `HANDOFF`  | any → next              | "Your turn; here's the state" (Result format per output-standard.md) |
| `FINDING`  | QA/SEC/PERF/REV → owner | Problem + evidence + suggested fix                                   |
| `QUESTION` | worker → CORD           | Blocked on decision (CORD answers by updating the task file)         |
| `DECISION` | CORD/ARCH → all         | Recorded choice (also logged as ADR/D-record if durable)             |
| `ALERT`    | SRE → CORD              | Prod signal (incident workflow triggered)                            |
| `VETO`     | SEC/QA → CORD           | Gate FAIL — blocks progression; override only by human, recorded     |

## 3. Rules

1. **Address by role + session ID** (e.g. `DEV-BE/W-3`), never "the backend guy" — registry is the phone book.
2. **Evidence mandatory** in FINDING/VETO — no vibes (agent-rules: claims need proof).
3. **ACK discipline**: recipient sets `ACKED` within one work cycle; owner sets `RESOLVED` with fix commit ref. Un-ACKED > 1 cycle → CORD escalates.
4. **One thread per issue** — reply by appending to the same message file (`## Reply (DEV-BE/W-3): ...`), not new files.
5. **No side channels**: conclusions reached anywhere else (chat, memory) are written to the thread before they count.
6. **VETO override**: only a HUMAN may override a SEC/QA veto; the override + reason recorded in the message thread AND `.ai/risks/` (accepted risk).

## 4. Disagreement Resolution (agents conflict)

```
1. DEV vs REV (implementation detail):
   → REV states finding + rule reference; DEV complies or argues with evidence
   → unresolved after 1 round → CORD decides (decision recorded); architecture-taste conflicts → ARCH arbitrates
2. QA vs DEV (is it a bug?):
   → QA's evidence rules; if spec ambiguity is the cause → PM decides the spec, then DEV fixes
   → spec change → record assumption/decision, re-run AC
3. SEC/PERF vs anyone:
   → SEC/PERF findings cannot be argued away by implementers; either fix it (DEV) or
     get a human-signed risk acceptance (recorded). No agent overrides a security veto.
4. Two DEVs (overlapping change):
   → not a disagreement — an ownership violation → CORD re-splits scope (multi-agent.md).
```

Escalation cap: **2 rounds max** at any level, then the next authority decides. Endless debate burns context; the matrix (roles.md) exists to terminate it.

## 5. Broadcast Rules

Contract/schema/deploy-policy changes → `DECISION` message to ALL active sessions + each worker re-verifies against it before continuing (per multi-agent.md contract-freeze).

## Validation Checklist

- [ ] All messages on disk in the format; zero chat-only decisions
- [ ] Every FINDING has evidence + ACK/RESOLVED lifecycle visible
- [ ] Disagreements closed within 2 rounds with recorded decision

## Handoff

→ `agents/lifecycle.md` (session end-to-end), `core/delegation.md` (spawn mechanics).
