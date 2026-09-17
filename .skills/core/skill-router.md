---
name: skill-router
description: Determine which skill to activate for any user request; prevents random skill selection
phase: core
priority: critical
inputs: [user-request, project-state]
outputs: [selected-skill, loaded-context]
dependencies: [project-state]
next_skills: [any]
---

# Skill Router

## Decision Pipeline

```
User Request
  → 1. Analyze Intent (verb + noun + artifact)
  → 2. Identify Project Phase (.ai/project-state.md)
  → 3. Identify Required Skill (routing table below)
  → 4. Check Dependencies (does skill have required inputs? if not → prerequisite skill first)
  → 5. Load Required Context (context-management.md — minimum viable files)
  → 6. Execute Skill (follow its workflow exactly)
  → 7. Validate Result (skill's validation checklist)
  → 8. Update Project State (.ai/project-state.md)
  → 9. Continue Workflow (skill's handoff section)
```

## Routing Table

| Intent Signals                                          | Phase | Skill                                                                                     |
| ------------------------------------------------------- | ----- | ----------------------------------------------------------------------------------------- |
| "new app", "start project", blank repo                  | 0     | `workflows/new-project.md`                                                                |
| "market research", "is there a market", "competitors"   | B     | `business/market-research.md` → `business/competitive-analysis.md`                        |
| "business model", "pricing", "revenue", "make money"    | B     | `business/bmc.md` → `business/pricing.md`                                                 |
| "validate the idea", "should I build"                   | B     | `business/validation.md`                                                                  |
| "launch", "go to market", "acquire users"               | B     | `business/gtm.md` → `business/growth.md`                                                  |
| "content", "blog", "seo", "rank"                        | M     | `marketing/content.md` → `marketing/seo.md`                                               |
| "ads", "campaign", "paid traffic"                       | M     | `marketing/paid.md` (preconditions checked first)                                         |
| "email", "newsletter", "drip"                           | M     | `marketing/email.md`                                                                      |
| "social", "community", "twitter/linkedin"               | M     | `marketing/social.md`                                                                     |
| "copy", "landing page text", "messaging"                | M     | `marketing/copywriting.md`                                                                |
| "attribution", "utm", "funnel analytics"                | M     | `marketing/analytics.md`                                                                  |
| "payments", "stripe", "billing", "subscription"         | 8     | `development/payments.md`                                                                 |
| "privacy", "gdpr", "terms", "cookie", "legal"           | 8     | `development/legal-compliance.md`                                                         |
| "i18n", "rtl", "arabic", "localization"                 | 8     | `development/i18n-rtl.md`                                                                 |
| "ai", "llm", "rag", "prompt", "agent"                   | 8     | `development/ai-features.md`                                                              |
| "feature flag", "experiment", "rollout", "kill switch"  | 8     | `development/feature-flags.md`                                                            |
| "mobile", "react native", "flutter", "ios", "android"   | 8     | `development/mobile.md`                                                                   |
| "data pipeline", "etl", "dbt", "analytics", "warehouse" | 8     | `development/data-pipelines.md`                                                           |
| "support", "ticket", "helpdesk", "csat", "nps"          | 16    | `maintenance/customer-support.md`                                                         |
| "research", "compare", "which stack/library/framework"  | R     | `research/technical-research.md` → `research/framework-library-evaluation.md`             |
| "spike", "poc", "prove it works"                        | R     | `research/proof-of-concept.md`                                                            |
| "benchmark", "measure X vs Y"                           | R     | `research/benchmark.md`                                                                   |
| "external api", "vendor", "should we integrate"         | R     | `research/api-research.md`                                                                |
| "monolith vs micro", "serverless?", "event-driven?"     | R     | `research/architecture-research.md` → `architecture/architecture-styles.md`               |
| "feasible", "can we build"                              | R     | `research/feasibility-study.md`                                                           |
| "dr", "disaster", "rto", "rpo", "failover"              | A     | `architecture/disaster-recovery.md` → `workflows/disaster-recovery.md`                    |
| "migrate the system", "strangler", "rewrite"            | A     | `architecture/architecture-migration.md`                                                  |
| "stakeholders", "who signs off"                         | 1     | `discovery/stakeholder-analysis.md`                                                       |
| "journey map", "use case"                               | 1     | `discovery/user-journey.md` / `discovery/use-cases.md`                                    |
| "scope creep", "in/out scope"                           | 1     | `discovery/scope-management.md`                                                           |
| "product strategy", "pillars", "bets"                   | 2     | `product/strategy.md`                                                                     |
| "north star", "metric tree", "guardrails"               | 2     | `product/product-metrics.md`                                                              |
| "a/b test", "experiment"                                | 2     | `product/experimentation.md`                                                              |
| "feature spec"                                          | 2     | `product/feature-specification.md`                                                        |
| "user feedback", "what users want"                      | 2     | `product/user-feedback.md`                                                                |
| "cohort", "retention analysis"                          | 2     | `product/product-analytics.md`                                                            |
| "release content", "what ships next"                    | 2     | `product/release-planning.md`                                                             |
| "persona", "brand voice"                                | M     | `marketing/personas.md` / `marketing/brand.md`                                            |
| "cro", "conversion", "landing page optimize"            | M     | `marketing/cro.md`                                                                        |
| "referral", "affiliate", "ambassador"                   | M     | `marketing/referral.md`                                                                   |
| "funnel stages", "aarrr"                                | M     | `marketing/funnel.md`                                                                     |
| "win-back", "churn save", "at-risk users"               | M     | `marketing/retention.md`                                                                  |
| "prompt", "llm feature", "rag", "ai agent design"       | AI    | `ai/prompt-context-engineering.md` → `ai/rag-embeddings-search.md` → `ai/agent-design.md` |
| "model selection", "routing", "token cost"              | AI    | `ai/model-operations.md`                                                                  |
| "evals", "ai testing", "guardrails"                     | AI    | `ai/ai-evaluation-guardrails.md`                                                          |
| "tenancy", "multi-tenant", "entitlements", "plans"      | P     | `platform/platform-services.md`                                                           |
| "data lineage", "classification", "data quality"        | D     | `data/data-governance-quality.md`                                                         |
| "gdpr", "privacy program", "consent", "dpa"             | C     | `compliance/legal.md` → `compliance/compliance-review.md`                                 |
| "iac", "terraform", "drift"                             | 13    | `devops/infrastructure-as-code.md`                                                        |
| "blue-green", "canary", "zero-downtime"                 | 13    | `devops/deployment-strategies.md`                                                         |
| "backup verify", "capacity", "cloud cost"               | 13    | `devops/backups-scaling-cost.md`                                                          |
| "slo", "error budget"                                   | 15    | `observability/slo.md`                                                                    |
| "tracing", "alert fatigue"                              | 15    | `observability/alerting-tracing.md`                                                       |
| "synthetic", "uptime", "rum"                            | 15    | `observability/monitoring-modes.md`                                                       |
| "triage", "tech debt ops", "deprecation"                | 16    | `maintenance/maintenance-operations.md` / `maintenance/deprecation.md`                    |
| "onboard this agent/dev"                                | —     | `workflows/onboarding.md`                                                                 |
| "archive the project"                                   | —     | `workflows/project-archival.md`                                                           |
| "idea for...", "want to build"                          | 1     | `discovery/idea-analysis.md`                                                              |
| "requirements", "spec", "what are we building"          | 1     | `discovery/requirements.md`                                                               |
| "user stories", "acceptance criteria"                   | 1-2   | `discovery/user-stories.md` → `acceptance-criteria.md`                                    |
| "PRD", "roadmap", "MVP", "prioritize"                   | 2     | `product/prd.md` / `mvp.md` / `roadmap.md`                                                |
| "architecture", "design the system", "which stack"      | 3     | `architecture/system-design.md`                                                           |
| "ADR", "why did we choose"                              | 3     | `architecture/adr.md`                                                                     |
| "UX", "user flow", "wireframe", "design"                | 4     | `design/ux.md` / `ui.md`                                                                  |
| "schema", "migration", "index", "table"                 | 5     | `development/database.md`                                                                 |
| "endpoint", "API", "route" (design)                     | 6     | `architecture/api.md` then `development/api.md`                                           |
| "build feature", "implement", "add X"                   | 8     | `workflows/new-feature.md`                                                                |
| "bug", "broken", "error", "fails"                       | 8/16  | `workflows/bug-fix.md`                                                                    |
| "refactor", "clean up", "tech debt"                     | 16    | `workflows/refactor.md`                                                                   |
| "test", "coverage", "QA"                                | 9     | `testing/strategy.md` then relevant test skill                                            |
| "review", "look at this PR/diff"                        | 10    | `review/code-review.md`                                                                   |
| "security", "vulnerable", "OWASP"                       | 11    | `security/threat-modeling.md` → `review/security-review.md`                               |
| "slow", "performance", "latency", "optimize"            | 12    | `testing/performance.md` → `development/*` perf skills                                    |
| "Docker", "CI", "CD", "pipeline"                        | 13    | `devops/docker.md` / `ci.md` / `cd.md`                                                    |
| "deploy", "release", "ship"                             | 14    | `workflows/release.md` → `devops/deployment.md`                                           |
| "monitor", "logs", "alert", "metrics"                   | 15    | `observability/monitoring.md`                                                             |
| "incident", "down", "outage", "prod broken"             | 15-16 | `workflows/production-incident.md`                                                        |
| "document", "README", "changelog"                       | 17    | `documentation/*`                                                                         |
| "multiple agents", "parallel", "split work"             | multi | `core/multi-agent.md`                                                                     |
| ambiguous                                               | —     | Ask the user one clarifying question; never guess                                         |

## Dependency Check Rules

1. Look up the skill in its front-matter `dependencies` and `inputs`.
2. For each required input, check `.ai/` or the repo for the artifact.
3. Missing input → route to the producing skill first, or ask the user to supply it.
4. **Never execute a skill with fabricated inputs.** If the user says "skip to implementation" with no requirements, record minimal assumptions in `.ai/context/assumptions.md` and get confirmation.

## Routing Output

```markdown
# Routing Decision

- Intent: <one-line>
- Phase: <0-17 from project-state>
- Selected Skill: <path>
- Prerequisites Met: yes/no (+ what runs first if no)
- Context Loaded: <file list>
- Workflow Continues To: <next skill from selected skill's handoff>
```
