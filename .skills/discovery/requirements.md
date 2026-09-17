---
name: requirements
description: Produce functional and non-functional requirements from the discovery brief
phase: discovery
priority: high
inputs: [discovery-brief]
outputs: [requirements-specification]
dependencies: [idea-analysis]
next_skills: [user-stories, prd]
---

# Requirements Discovery

## Workflow

1. Read the discovery brief; read `.ai/context/assumptions.md` — confirm UNVERIFIED assumptions with the user first.
2. Elicit **functional requirements** — what the system does. Each: `FR-<n>: <actor> shall <action> so that <value>`.
3. Elicit **non-functional requirements** with hard numbers — each NFR gets an ID (`NFR-<n>`):

   | Category        | Must quantify                                                |
   | --------------- | ------------------------------------------------------------ |
   | Performance     | p95 latency, throughput                                      |
   | Availability    | % uptime, RTO/RPO                                            |
   | Scalability     | concurrent users, data volume at 1y/3y                       |
   | Security        | auth level, OWASP conformance, encryption at rest/in transit |
   | Compliance      | GDPR/HCSS/etc if applicable                                  |
   | Maintainability | coverage floor, lint/typecheck clean                         |
   | Accessibility   | WCAG 2.1 AA                                                  |
   | Compatibility   | browsers, OS, API consumers                                  |

4. Resolve conflicts (security vs. usability, cost vs. scale) — decisions logged via `core/decision-log.md`.
5. Assign each FR a priority: MoSCoW (Must/Should/Could/Won't — this feeds `product/mvp.md`).
6. Traceability: every FR/NFR maps to a goal from the brief; unmatched goal → missing requirement.

## Output — Requirements Specification

```markdown
# Requirements — <project>

## Functional Requirements

| ID | Requirement | Priority (MoSCoW) | Source (goal) |

## Non-Functional Requirements

| ID | Category | Requirement (quantified) | Verification method |

## Constraints & Assumptions

## Open Questions
```

## Validation Checklist

- [ ] Every FR testable as written (no "fast", "user-friendly" — numbers)
- [ ] Every NFR has a verification method (test, audit, monitor)
- [ ] Conflicts resolved and logged
- [ ] Priorities assigned
- [ ] No requirement invented without source (goal/user/constraint)

## Handoff

→ `user-stories.md` and `product/prd.md`.
