---
name: infrastructure-as-code
description: Infrastructure as code — provisioning, environments, drift detection
domain: devops
phase: devops
priority: high
inputs: [architecture, dr-plan]
outputs: [iac]
dependencies: [devops/project-init, security/platform-container-security]
next_skills: [devops/ci, devops/cd]
---

# Infrastructure as Code (IaC)

## Rules

1. **Everything reproducible**: infra defined in code (Terraform/Pulumi/CDK-class) — hand-clicked console changes = the #1 drift source (a resource only God and one engineer's memory can explain)
2. **Declarative + stateful**: desired-state files + managed state (state backend locked/remote — never local-state-on-laptop); plan-review before apply (the diff discipline per `devops/git.md` review rules applies to infra diffs too)
3. **No console mutations in prod** (read-only console day-to-day; emergency console change → reconciled into IaC within 24h with a postmortem note — per `observability/incident-response.md` timeline discipline)
4. **Modularity per environment-shape**: reusable modules (network, db, app-service) instantiated per env (dev/staging/prod differ by PARAMETERS per `devops/cd.md` values-only rule) — never copy-pasted env files drifting apart
5. **Secrets never in IaC state** (state files contain values — remote state encrypted + access-controlled per `security/secrets.md`; secret VALUES injected at deploy-time, references only in code)
6. **Least-privilege provisioning identities**: CI/CD deploy-role scoped to what it provisions (per `security/platform-container-security.md` IAM rules); apply-role ≠ admin-role

## Workflow

1. Define module per infra-unit (documented inputs/outputs — modules are internal products per `platform/platform-services.md` DX rule)
2. Env instantiation: tfvars/config per env (values-only diffs per env)
3. Change process: plan → review (plan-diff in the PR) → apply via CI only (applies are pipeline events with audit trails per `compliance/legal.md` §4)
4. **Drift detection**: scheduled plan against real infra — non-empty plan = drift alert (someone clicked something; reconcile or remove the click — per `observability/monitoring.md` alert-with-runbook rule)
5. Cost visibility: IaC feeds cost reports (per `devops/backups-scaling-cost.md` — every resource tagged: env/owner/service; untagged = unbillable = unmanageable)

## Validation Checklist

- [ ] 100% of prod infra in code; empty-plan drift checks scheduled
- [ ] Plans reviewed like PR diffs; applies only via CI
- [ ] Modules parameterized; envs differ by values; secrets never in state
- [ ] Resources tagged (env/service/owner) feeding cost reports

## Handoff

→ CI/CD provisioning steps per `devops/ci.md`/`cd.md`; DR rebuild path per `architecture/disaster-recovery.md`.
