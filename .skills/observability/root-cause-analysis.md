---
name: root-cause-analysis
description: Blameless postmortems and systemic prevention
phase: maintenance
priority: medium
inputs: [incident-timeline, logs, metrics]
outputs: [postmortem, preventive-actions]
dependencies: [incident-response]
next_skills: [development/bug-fix, documentation/changelog]
---

# Root Cause Analysis (RCA)

## 5 Whys Protocol

Start from the symptom; ask "why" until reaching a **systemic** cause (process/tooling gap — never a person):

```
Users couldn't log in (SEV1)
→ why? Session table hit 100% disk
→ why? Session cleanup job silently failed 3 days ago
→ why? Job errors weren't alerted (logged only)
→ why? Alerting covered endpoints, not jobs (metrics.md gap)
→ why? Observability checklist never included background jobs (process gap)
Fixes: (1) alert on job failure+age (2) cleanup + disk headroom alert (3) job observability standard
```

## Postmortem Template (`.ai/bugs/` or incidents dir)

```markdown
# Postmortem — <title> — <date>

- Severity, duration, impact (users/requests/$ quantified)

## Timeline (from scribe log — actions + observations, timestamps)

## Root Cause (systemic — the 5th why, not the 1st)

## What Went Well / What Went Wrong

## Action Items (each: owner, date, task ID in .ai/tasks/)

## Lessons (what standard/checklist changes — .skills feedback loop)
```

## Rules

1. **Blameless** — human error is a symptom; the fix is making the system prevent/detect it (guardrail, alert, checklist).
2. Every action item becomes a real task (`.ai/tasks/`) with owner + date — postmortems without tasks are rituals.
3. Quantify impact (honest numbers) — feeds reliability reporting and NFR/SLO review (`metrics.md`).
4. "Unknown root cause" is allowed only after exhausting evidence — then monitoring is the action item (detect it next time).
5. Check for the same latent bug in sibling systems (per `development/debugging.md` blast-radius rule).

## Validation Checklist

- [ ] Systemic cause (a person is never the final why)
- [ ] Action items all tasked with owners/dates
- [ ] Impact quantified; timeline complete

## Handoff

→ tasks via `core/task-management.md`; lessons fold back into the relevant skill files.
