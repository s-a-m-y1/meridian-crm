---
name: skills-index
description: Master catalog of all skills with phase, inputs, outputs, dependencies and successors
version: 1.0.0
---

# Skills Index — Complete Catalog

Routing: start at `core/skill-router.md`. Gates: `quality-gates/gates.md`.

## research/ (NEW)

| Skill                           | Purpose                                                           |
| ------------------------------- | ----------------------------------------------------------------- |
| technical-research.md           | Research → compare → trade-offs → decide → document (the mandate) |
| framework-library-evaluation.md | Framework + library scorecards (weights pre-declared)             |
| proof-of-concept.md             | Spikes + PoCs — timeboxed, kill-criteria-first, quarantined       |
| benchmark.md                    | Fair reproducible benchmarks (integrity rules)                    |
| api-research.md                 | External API/service evaluation + exit-plans                      |
| architecture-research.md        | Pattern research — problem-first, migration-cost included         |
| security-research.md            | CVE history, attack-surface, disclosure posture                   |
| documentation-research.md       | Doc research tier — version-pinned findings                       |
| feasibility-study.md            | Technical/operational/economic — GO with conditions or NO-GO      |

## data/ (NEW)

| Skill                      | Purpose                                                             |
| -------------------------- | ------------------------------------------------------------------- |
| data-governance-quality.md | Modeling, quality-SLAs, classification, lineage, retention, privacy |

## integrations/ (NEW)

| Skill              | Purpose                                                               |
| ------------------ | --------------------------------------------------------------------- |
| third-party-api.md | Integration pattern-catalog per category (payments/OAuth/email/maps…) |

## compliance/ (NEW)

| Skill                | Purpose                                                                  |
| -------------------- | ------------------------------------------------------------------------ |
| legal.md             | The compliance-PROGRAM — registry, consent-ops, evidence, legal-boundary |
| compliance-review.md | Periodic verification vs the obligation-registry                         |

## ai/ (NEW)

| Skill                                  | Purpose                                                        |
| -------------------------------------- | -------------------------------------------------------------- |
| prompt-context-engineering.md          | Prompts as software — architecture, budgets, versioning        |
| structured-output.md                   | Schema-validated model output — 3-layer defense + repair       |
| rag-embeddings-search.md               | RAG pipeline — chunking, hybrid retrieval, citations, sync-SLO |
| model-operations.md                    | Model selection/routing/fallback + token/cost control          |
| agent-design.md                        | Autonomy-levels, tool-contracts, loops, recovery               |
| ai-evaluation-guardrails.md            | Eval tiers, guardrail-stack, HITL design, release-gates        |
| ai-security-observability-lifecycle.md | AI threats, prod metrics, privacy duties, lifecycle            |

## platform/ (NEW)

| Skill                | Purpose                                                                            |
| -------------------- | ---------------------------------------------------------------------------------- |
| platform-services.md | Multi-tenancy (RLS), billing/entitlements, notification/search/storage-as-platform |

## business/

| Skill                        | Purpose                                                | Depends On                            | Feeds                            |
| ---------------------------- | ------------------------------------------------------ | ------------------------------------- | -------------------------------- |
| market-research.md           | Market size, segments, trends — evidence-based         | —                                     | competitive-analysis, validation |
| competitive-analysis.md      | Competitor rings + defensible wedge                    | market-research                       | bmc, validation                  |
| bmc.md                       | Business model canvas + unit economics (LTV/CAC)       | market-research, competitive-analysis | pricing, validation              |
| pricing.md                   | Value-based pricing, tiers, testing                    | bmc                                   | gtm, prd                         |
| validation.md                | Lean validation — kill/pivot/build before building     | market-research                       | mvp, prd                         |
| gtm.md                       | Beachhead, positioning, launch, funnel targets         | bmc, validation                       | growth                           |
| growth.md                    | Retention-first engine, loops, experiments, North-star | gtm                                   | metrics, maintenance             |
| finance.md                   | Cost/revenue model, runway, trigger decisions          | bmc, pricing                          | roadmap                          |
| business-model-innovation.md | Evolve the model — levers, grandfathering, 90d reviews | bmc, growth-metrics                   | pricing, gtm                     |
| partnerships.md              | Reseller/referral/alliance structures + pilot bars     | bmc, competitive-analysis             | gtm, integrations                |

## marketing/

| Skill          | Purpose                                                | Depends On                | Feeds                        |
| -------------- | ------------------------------------------------------ | ------------------------- | ---------------------------- |
| content.md     | Content engine — strategy, calendar, distribution loop | gtm, market-research      | seo, growth                  |
| seo.md         | Technical + on-page SEO, authority (no black-hat)      | content                   | frontend perf, metrics       |
| paid.md        | Paid ads — structure, testing, kill criteria           | pricing, finance          | growth                       |
| email.md       | Lifecycle sequences + deliverability compliance        | gtm                       | growth                       |
| social.md      | Social + community — ≤2 channels, 90-10 rule           | gtm, content              | growth                       |
| copywriting.md | Conversion copy standards + review gate                | gtm                       | all marketing + product copy |
| analytics.md   | Event taxonomy, attribution, funnel dashboards         | growth, metrics           | growth                       |
| brand.md       | Positioning, voice, identity-system                    | gtm, competitive-analysis | copywriting, design-system   |
| personas.md    | Evidence-based personas + journey maps                 | market-research           | copywriting, ux, support     |
| cro.md         | Research-first conversion optimization                 | analytics, copywriting    | growth                       |
| referral.md    | Referral/affiliate/ambassador programs                 | pricing, growth           | analytics                    |
| funnel.md      | AARRR funnel model + stage-economics                   | gtm, analytics            | growth, paid                 |
| retention.md   | Lifecycle marketing — at-risk, save-flows, win-back    | email, growth             | growth                       |

## agents/

| Skill                               | Purpose                                                      | Depends On                  | Feeds                      |
| ----------------------------------- | ------------------------------------------------------------ | --------------------------- | -------------------------- |
| roles.md                            | 11-role catalog + authority matrix + separation of duties    | task-management             | orchestrator               |
| orchestrator.md                     | Team assembly, scaling protocol, CORD command loop           | roles, delegation           | parallel-feature-execution |
| protocol.md                         | Disk-based messaging, VETO rules, disagreement resolution    | communication, delegation   | lifecycle                  |
| lifecycle.md                        | Session boot→checkpoint→resume→terminate + audit trail       | delegation, protocol        | memory-management          |
| contract.md                         | The one-page boot contract every spawned session receives    | roles, protocol, delegation | —                          |
| agent-operations.md                 | Registry, selection, monitoring, evals, cost, recovery       | orchestrator, lifecycle     | protocol                   |
| agent-permissions-security-audit.md | Permission-manifests, control-channel integrity, audit-trail | roles, agent-operations     | security-review            |

## core/

| Skill                     | Purpose                                                     | Depends On                   | Feeds                      |
| ------------------------- | ----------------------------------------------------------- | ---------------------------- | -------------------------- |
| agent-rules.md            | Global never/always rules                                   | —                            | everything                 |
| engineering-principles.md | Core engineering values                                     | —                            | everything                 |
| context-management.md     | Read only what's needed                                     | —                            | everything                 |
| task-standard.md          | Canonical task format                                       | —                            | task-management            |
| task-management.md        | Task lifecycle                                              | task-standard                | implementation             |
| memory-management.md      | .ai/ memory protocol                                        | —                            | everything                 |
| multi-agent.md            | Orchestration, ownership, worktrees                         | task-management              | workflows                  |
| delegation.md             | Spawn worker sessions, disk-based handoff, no context bloat | task-management, multi-agent | parallel-feature-execution |
| communication.md          | Reporting standards                                         | output-standard              | everything                 |
| output-standard.md        | Structured result format                                    | —                            | everything                 |
| skill-router.md           | Intent → skill routing                                      | this index                   | everything                 |
| decision-log.md           | ADR/decision recording                                      | —                            | architecture               |

## discovery/

| Skill                   | Purpose                                              | Depends On        | Feeds               |
| ----------------------- | ---------------------------------------------------- | ----------------- | ------------------- |
| idea-analysis.md        | Raw idea → structured problem                        | —                 | requirements        |
| requirements.md         | Functional + non-functional reqs                     | idea-analysis     | prd                 |
| user-stories.md         | Reqs → stories + AC                                  | requirements      | mvp                 |
| acceptance-criteria.md  | Given/When/Then criteria                             | user-stories      | testing             |
| stakeholder-analysis.md | Power/interest map, sign-off gates                   | idea-analysis     | requirements        |
| user-journey.md         | JTBD journeys — emotions, barriers, moments-of-truth | personas          | ux, e2e             |
| use-cases.md            | Actor/goal modeling w/ extensions = test-seeds       | requirements      | acceptance-criteria |
| scope-management.md     | Scope charter + anti-creep tests                     | requirements, mvp | prd                 |

## product/

| Skill                    | Purpose                                   | Depends On                     | Feeds                 |
| ------------------------ | ----------------------------------------- | ------------------------------ | --------------------- |
| prd.md                   | Product Requirements Document             | requirements                   | architecture          |
| mvp.md                   | MVP scope definition                      | prd, user-stories              | prioritization        |
| prioritization.md        | Value/effort/risk ranking                 | mvp                            | roadmap               |
| roadmap.md               | Milestones + releases                     | prioritization                 | new-project wf        |
| strategy.md              | Choices — pillars, bets, won't-dos        | bmc, competitive-analysis      | roadmap               |
| product-metrics.md       | North Star + inputs + guardrails tree     | strategy, analytics            | growth, monitoring    |
| experimentation.md       | Pre-declared A/B + honest stats           | product-metrics, feature-flags | growth                |
| feature-specification.md | The one-feature spec — zero ambiguity     | requirements                   | task-management       |
| user-feedback.md         | 6-source inbox → clusters → routed action | customer-support, analytics    | feature-specification |
| product-analytics.md     | Cohort/funnel/feature-value analyses      | analytics, product-metrics     | user-feedback         |
| release-planning.md      | Next-release content + sequencing + comms | roadmap, changelog             | release wf            |
| product-lifecycle.md     | Intro→growth→mature→decline per feature   | product-metrics                | deprecation           |

## architecture/

| Skill                       | Purpose                                                    | Depends On             | Feeds                |
| --------------------------- | ---------------------------------------------------------- | ---------------------- | -------------------- |
| system-design.md            | C4 system architecture                                     | prd                    | all arch skills      |
| frontend.md                 | FE architecture                                            | system-design          | development/frontend |
| backend.md                  | BE architecture                                            | system-design          | development/backend  |
| database.md                 | DB architecture                                            | system-design          | development/database |
| api.md                      | API contract architecture                                  | system-design          | development/api      |
| auth-architecture.md        | AuthN/AuthZ architecture                                   | system-design          | security/auth        |
| frontend-framework-guide.md | React/Next.js default stack profile                        | frontend               | development/frontend |
| adr.md                      | Architecture Decision Records                              | system-design          | memory               |
| scalability-reliability.md  | The three -ilities: scale paths, SPOF, resilience patterns | system-design          | slo, deployment      |
| event-driven.md             | Events/queues — contracts, semantics, sagas                | system-design, backend | backend-impl         |
| architecture-styles.md      | Monolith/microservices/serverless profiles + hybrid        | architecture-research  | migration            |
| infrastructure-designs.md   | Caching tiers, storage classes, search, realtime           | system-design          | backend-impl         |
| disaster-recovery.md        | RTO/RPO, scenarios, backups, drills                        | database, nfrs         | dr wf                |
| architecture-migration.md   | Strangler, expand/contract, slicing                        | architecture-research  | migration wf         |

## design/

| Skill                    | Purpose                                                 | Depends On        | Feeds                |
| ------------------------ | ------------------------------------------------------- | ----------------- | -------------------- |
| ux.md                    | Research + user flows                                   | prd               | wireframes           |
| ui.md                    | UI spec + states (error/loading/empty)                  | ux                | development/frontend |
| design-system.md         | Tokens + components                                     | ui                | development/frontend |
| accessibility.md         | WCAG compliance                                         | ui                | testing/a11y         |
| design-implementation.md | Research modes, IA, wireframes, interaction, responsive | ux, ui            | frontend             |
| design-qa.md             | Pre-handoff spec-conformance QA                         | ui, design-system | code-review          |

## development/

| Skill                         | Purpose                                                                | Depends On                       | Feeds               |
| ----------------------------- | ---------------------------------------------------------------------- | -------------------------------- | ------------------- |
| implementation.md             | Master build workflow (Understand→Plan→Implement→Validate→Test→Review) | task-management                  | testing             |
| frontend.md                   | FE implementation standards                                            | architecture/frontend, design/ui | testing/unit        |
| backend.md                    | BE layers (controllers/services/repos)                                 | architecture/backend             | testing/integration |
| database.md                   | Schema + migrations                                                    | architecture/database            | testing             |
| api.md                        | REST/GraphQL endpoints                                                 | architecture/api                 | testing/api         |
| refactoring.md                | Safe refactor protocol                                                 | implementation                   | review/code-review  |
| debugging.md                  | Root cause analysis                                                    | implementation                   | bug-fix wf          |
| bug-fix.md                    | Bug fix protocol                                                       | debugging                        | regression          |
| payments.md                   | Payment providers, subscriptions, webhooks, dunning, PCI               | pricing, api                     | monitoring          |
| legal-compliance.md           | GDPR, privacy policy, terms, DPA, cookie consent                       | secrets, input-validation        | payments, setup     |
| i18n-rtl.md                   | Locales, RTL layouts, ICU messages, logical CSS                        | design-system                    | frontend, testing   |
| ai-features.md                | LLM/RAG, prompt engineering, evals, guardrails                         | api, security                    | testing, monitoring |
| feature-flags.md              | Release/experiment/kill-switch, targeting, cleanup                     | api, metrics                     | growth, paid        |
| mobile.md                     | React Native/Flutter, EAS, OTA, store, performance                     | frontend, design-system          | e2e, ci, cd         |
| data-pipelines.md             | ELT, dbt, contracts, freshness, governance                             | database, monitoring             | growth, finance     |
| implementation-lifecycle.md   | Code-gen, legacy, config/env, degradation, cron                        | implementation                   | testing             |
| background-services.md        | Jobs, queues, notifications implementation                             | event-driven, backend            | integration         |
| integration-implementation.md | Adapters, webhooks-in/out, file-storage                                | api-research, backend            | api-testing         |

## testing/

| Skill                  | Purpose                                              | Depends On            | Feeds           |
| ---------------------- | ---------------------------------------------------- | --------------------- | --------------- |
| strategy.md            | Test pyramid + coverage targets                      | architecture          | all test skills |
| unit.md                | Unit tests                                           | strategy              | coverage        |
| integration.md         | Integration tests                                    | strategy              | review          |
| api-testing.md         | API contract tests                                   | strategy              | review          |
| e2e.md                 | E2E scenarios                                        | strategy              | release gate    |
| regression.md          | Regression suites                                    | all tests             | release gate    |
| performance.md         | Load/stress tests                                    | strategy              | perf review     |
| coverage.md            | Coverage analysis                                    | unit, integration     | quality gate 4  |
| test-infrastructure.md | Factories, mocking, envs, isolation, flake, visual   | strategy              | all test skills |
| advanced-test-types.md | Contract, snapshot, mutation, a11y, security, compat | strategy, api-testing | test-review     |

## review/

| Skill                  | Purpose                                               | Depends On            | Feeds     |
| ---------------------- | ----------------------------------------------------- | --------------------- | --------- |
| code-review.md         | Diff review, CRITICAL..INFO                           | implementation        | merge     |
| architecture-review.md | Design conformance                                    | system-design         | gate 2    |
| security-review.md     | OWASP review                                          | security skills       | gate 5    |
| performance-review.md  | Perf evidence review                                  | performance           | gate 6    |
| specialized-reviews.md | PR process + API/DB/UX/a11y/release/production lenses | code-review           | gates 3-8 |
| test-review.md         | Anti-theater — assertion quality, coverage honesty    | code-review, strategy | gate 4    |
| docs-review.md         | Accuracy (executed), freshness, no-duplication        | specialized-reviews   | gate 7    |

## security/

| Skill                          | Purpose                                        | Depends On                       | Feeds                    |
| ------------------------------ | ---------------------------------------------- | -------------------------------- | ------------------------ |
| threat-modeling.md             | STRIDE threat model                            | architecture                     | all security             |
| auth-security.md               | AuthN/AuthZ impl                               | auth-architecture                | security-review          |
| api-security.md                | Rate limits, validation                        | architecture/api                 | security-review          |
| input-validation.md            | Injection prevention                           | backend                          | security-review          |
| xss-csrf.md                    | XSS/CSRF/SSRF prevention                       | frontend                         | security-review          |
| owasp-top10.md                 | Full OWASP Top 10 audit                        | security-review, threat-modeling | gate 5                   |
| hardening.md                   | Environment hardening checklist                | api-security, secrets            | gate 5/8                 |
| secrets.md                     | Secret handling                                | —                                | devops, gates            |
| dependency-security.md         | CVE scanning                                   | —                                | gate 5                   |
| security-testing.md            | SAST/DAST/pen-test-coordination/validation     | threat-modeling                  | vulnerability-management |
| vulnerability-management.md    | Intake→triage→remediate→verify→close lifecycle | security-testing                 | incident-response        |
| platform-container-security.md | Infra, containers, supply-chain, audit-logs    | hardening, docker                | compliance/audit         |

## devops/

| Skill                     | Purpose                                            | Depends On                      | Feeds             |
| ------------------------- | -------------------------------------------------- | ------------------------------- | ----------------- |
| project-init.md           | Repo scaffolding + conventions + env validation    | —                               | git, docker, ci   |
| git.md                    | Branch strategy + commits                          | —                               | multi-agent       |
| docker.md                 | Containers                                         | —                               | ci                |
| ci.md                     | Build + test pipelines                             | docker                          | cd                |
| cd.md                     | Deploy pipelines                                   | ci                              | deployment        |
| deployment.md             | Env deploy + rollback                              | cd                              | observability     |
| release-management.md     | Versioning + releases                              | cd                              | workflows/release |
| infrastructure-as-code.md | IaC — modules, drift-detection, plan-review        | project-init, platform-security | ci, cd            |
| deployment-strategies.md  | Blue-green/canary/rolling — traffic-shift patterns | deployment                      | monitoring        |
| backups-scaling-cost.md   | Backup-ops, capacity, cloud-cost ladder            | disaster-recovery, metrics      | dr wf, finance    |

## observability/

| Skill                  | Purpose                                  | Depends On        | Feeds             |
| ---------------------- | ---------------------------------------- | ----------------- | ----------------- |
| logging.md             | Structured logs + log security           | —                 | monitoring        |
| metrics.md             | RED/USE metrics                          | logging           | monitoring        |
| monitoring.md          | Dashboards + health                      | metrics           | incident-response |
| incident-response.md   | Incident command                         | monitoring        | rca               |
| root-cause-analysis.md | RCA + postmortem                         | incident-response | maintenance       |
| slo.md                 | SLI/SLO/error-budget governance          | metrics, nfrs     | alerting, gates   |
| alerting-tracing.md    | Alert quality-bars + distributed tracing | slo, monitoring   | incident-response |
| monitoring-modes.md    | Synthetic, uptime, RUM, capacity watch   | monitoring, slo   | alerting          |

## documentation/

| Skill                | Purpose                                              | Depends On             | Feeds             |
| -------------------- | ---------------------------------------------------- | ---------------------- | ----------------- |
| readme.md            | README generation                                    | —                      | onboarding        |
| api-docs.md          | API reference                                        | architecture/api       | docs gate         |
| architecture-docs.md | Arch docs                                            | adr                    | docs gate         |
| setup.md             | Setup + run guides                                   | readme                 | onboarding        |
| changelog.md         | Keep-a-Changelog                                     | release-management     | release           |
| troubleshooting.md   | Symptom-fix guides + alert runbooks                  | incident-response      | incident-response |
| maintenance.md       | Tech debt + dep updates                              | rca                    | maintenance       |
| developer-guides.md  | CONTRIBUTING, coding-standards, dev/user guides, FAQ | readme, setup          | docs-review       |
| ops-guides.md        | Deployment, migration, release-notes, security docs  | deployment, migrations | docs-review       |

## maintenance/

| Skill                     | Purpose                                                      | Depends On                | Feeds                |
| ------------------------- | ------------------------------------------------------------ | ------------------------- | -------------------- |
| customer-support.md       | Tickets, SLAs, KB, CSAT, feedback loop                       | growth, incident-response | maintenance, bug-fix |
| maintenance-operations.md | Triage SLAs, debt-ops, dep-updates, patches, followups       | bug-fix, maintenance      | dep-update wf        |
| data-operations.md        | DB-routines, cleanup sweeps, removal staging, migrations-ops | data-governance, database | deprecation          |
| deprecation.md            | Deprecation records, windows, sunset governance              | product-lifecycle         | removal wf           |

## quality-gates/

| Skill    | Purpose                                                         |
| -------- | --------------------------------------------------------------- |
| gates.md | The 9 mandatory gates + per-gate detail (gates 1-9 as sections) |

## workflows/

| Workflow                      | Chain                                                                              |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| new-project.md                | discovery→product→architecture→design→tasks→build→test→review→security→docs→deploy |
| new-feature.md                | requirements→design→arch check→tasks→build→test→review→docs                        |
| bug-fix.md                    | report→repro→RCA→fix→regression→review→docs                                        |
| refactor.md                   | analyze→risk→plan→refactor→test→perf→review                                        |
| release.md                    | freeze→test→security→perf→build→deploy→health→monitor                              |
| production-incident.md        | alert→triage→mitigate→RCA→postmortem→hardening                                     |
| parallel-feature-execution.md | Multi-agent feature delivery                                                       |
| security-audit.md             | threat-model refresh → OWASP → infra → supply → pen → lifecycle                    |
| performance-optimization.md   | baseline → diagnose → hypothesize → fix → verify → guard                           |
| database-migration.md         | classify → design → test → pre-flight → execute → watch                            |
| dependency-update.md          | classify → research → update → verify (+ tech-debt paydown chain)                  |
| hotfix.md                     | qualify → minimal-fix → branch-from-tag → test → fast-review → ship                |
| feedback-to-feature.md        | capture → cluster → qualify → validate → spec → build → measure → close-loop       |
| deprecated-feature-removal.md | verify-record → usage-check → audit → remove → grace → close                       |
| major-version-upgrade.md      | justify → research → slice → safety-net → execute → verify                         |
| disaster-recovery.md          | declare → runbook-execute → verify → RCA → DR-metrics                              |
| onboarding.md                 | boot-read → setup → verify → orientation → first-task → first-review               |
| project-archival.md           | user-sunset → data-preserve → infra-sundown → code-archive                         |
