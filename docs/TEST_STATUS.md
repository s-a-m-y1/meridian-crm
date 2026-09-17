# Test Status — E-commers-Crm

Baseline: greenfield. No tests exist yet. Defines the testing strategy to be implemented per phase.

## Planned Coverage

| Layer | Tools | Scope |
| ----- | ----- | ----- |
| Unit | Jest | services, permissions, scoring, forecasting, parsers, utilities |
| Integration | Jest + Testcontainers/SQLite-in-memory + real PG | repositories, DB, Redis, BullMQ |
| E2E | Playwright | register→login→lead→deal→task→search→dashboard→AI flows, Arabic UI |
| Security | Dedicated suite (Agent 4) | tenant isolation, IDOR, prompt injection, unauthorized writes, rate limits, secret protection |
| AI eval | Deterministic assertions | tool selection, args, permissions, grounding, hallucination resistance, injection, Arabic/Egyptian/English, provider failure, timeouts |
| Load | k6 (later phases) | endpoints, jobs |

## Core Test Flows (E2E)

- register → login → create lead → edit lead → assign lead
- create property → create deal → move deal → create task → complete task
- search → dashboard
- AI chat → AI read tool → AI write confirmation → AI permission denial
- Arabic (RTL) UI

## Rules

- No feature DONE without its tests passing (Gates 3-6).
- Claiming tests passed requires running them and recording exit codes (agent-rules #2).
- Every bug fix ships a regression test.

## Current Status

| Gate | Status | Evidence |
| ---- | ------ | -------- |
| Unit tests | NOT STARTED | — |
| Integration tests | NOT STARTED | — |
| E2E | NOT STARTED | — |
| Security tests | NOT STARTED | — |
| AI eval suite | NOT STARTED | — |