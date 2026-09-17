---
name: troubleshooting-documentation
description: Symptom-cause-fix troubleshooting guides and alert runbooks
phase: documentation
priority: medium
inputs: [incidents, alerts]
outputs: [troubleshooting-guide, runbooks]
dependencies: [observability/root-cause-analysis, observability/monitoring]
next_skills: [quality-gates]
---

# Troubleshooting Documentation

## Two Artifacts

1. **Troubleshooting guide** — for humans/agents hitting a problem
2. **Runbooks** — one per alert, for the responder mid-incident

## Troubleshooting Guide Format

Every entry = the symptom exactly as observed (greppable by error message):

```markdown
## <Symptom as seen — exact error text or behavior>

**Cause**: what's actually wrong (one sentence)
**Fix**: exact commands/changes
**Verify**: how to confirm it's resolved
**Prevention**: if recurring — the systemic fix (RCA link)
```

Sources of entries (never write speculative entries):

- Every SEV with a config/setup cause → entry added (RCA action per `observability/root-cause-analysis.md`)
- Every support/dev question answered twice → same question twice = documentation gap
- Fresh-agent setup walkthrough stumbles (`documentation/setup.md` clean-env test)

## Runbook Format (one per alert, linked FROM the alert per `observability/monitoring.md` rule)

```markdown
# Runbook: <alert name>

- Severity + what it means (plain language)
- Impact if ignored

1. First checks: dashboard link, log query to copy-paste, metric to look at
2. Mitigation steps (exact commands; ordered; "if X then step 3 else step 4")
3. Escalation: who/when
4. Related alerts / known causes history
```

## Rules

1. Runbooks live where responders look (near the service code or docs root) and are linked from the alert itself — an alert without its runbook violates `monitoring.md`.
2. Every incident closes with: does a runbook exist? does it cover this case? Update or create — postmortem action item.
3. Verify runbooks during game-days/incident drills: a runbook never executed is a guess dressed as documentation.

## Validation Checklist

- [ ] Every alert has a linked runbook
- [ ] Entries symptom-first (greppable by exact error)
- [ ] Last incident's cause has an entry

## Handoff

→ Gate 7; consumed by `observability/incident-response.md` responders.
