---
name: setup-documentation
description: Environment setup and troubleshooting guides
phase: documentation
priority: medium
inputs: [readme, environment-config]
outputs: [setup-guide, troubleshooting-guide]
dependencies: [readme]
next_skills: [quality-gates]
---

# Setup & Troubleshooting Docs

## Setup Guide

```markdown
# Setup

## Prerequisites (exact versions — pin them; "latest" breaks eventually)

## Steps: install → configure (.env walk-through: each variable, purpose, example) →

         database (migrate + seed) → run (dev) → verify (command + expected output)

## Common Setup Issues (top 5 actual failures: symptom → cause → fix)

## Full env matrix (dev/staging/prod — how they differ)
```

## Rules

1. Every step executed during a clean-env test — setup docs rot fastest of all docs.
2. Each env var documented: name, purpose, required?, example value (fake), where the real value lives (`security/secrets.md` — never real values here).
3. Troubleshooting entries from real incidents: every SEV with a setup/config cause adds an entry (RCA action item channel — per `observability/root-cause-analysis.md`).
4. Troubleshooting format: **Symptom (what you see) → Cause → Fix (exact command/change)** — scannable in an emergency, greppable by error message.

## Runbooks (referenced from alerts per `monitoring.md`)

Per alert: what it means, first checks (dashboard/link), mitigation steps, escalation contact. Keep with the service code or docs — referenced from the alert itself.

## Validation Checklist

- [ ] Clean-environment walkthrough executed successfully
- [ ] All env vars documented with fake examples
- [ ] Top troubleshooting entries cover observed reality (not guesses)

## Handoff

→ Gate 7; runbooks feed `incident-response.md`.
