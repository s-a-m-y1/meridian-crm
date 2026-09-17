# Testing — E-commers-Crm

Strategy summary. Details in `docs/TEST_STATUS.md`.

## Layers

1. **Unit** (Jest): services, permissions, scoring, forecasting, parsers, utilities.
2. **Integration**: DB/repos, API, auth, authorization, Redis, BullMQ.
3. **E2E** (Playwright): full user journeys incl. Arabic UI.
4. **Security** (Agent 4): tenant isolation, IDOR, privilege escalation, prompt injection, tool abuse, secret protection.
5. **AI eval**: deterministic assertions — grounding, hallucination, injection, Arabic/Egyptian/English, missing/conflicting data, provider failure, timeouts.
6. **Load** (later): endpoints + jobs.

## Rules

- Run and record exit codes before claiming pass (agent-rules #2).
- Every bug fix → regression test.
- Never advance past a failed gate.
- Quality gates per `.skills/quality-gates/gates.md`.