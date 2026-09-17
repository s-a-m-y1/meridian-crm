---
name: legal-compliance
description: GDPR, privacy policy, terms of service, data processing agreements, cookie consent
phase: development
priority: high
inputs: [market-research, bmc, finance]
outputs: [compliance-pack]
dependencies: [security/secrets, security/input-validation, marketing/email]
next_skills: [payments, documentation/setup]
---

# Legal & Compliance

## Rules

1. **Privacy by default**: no PII collected unless strictly necessary; purpose limitation written in the privacy policy; retention periods explicit (delete/anon after purpose fulfilled).
2. **GDPR compliance** (if EU users or global):
   - Lawful basis per data type (consent / contract / legitimate interest — documented)
   - Data subject rights automated where possible: access, rectification, erasure, portability, restriction, objection
   - DPIA (impact assessment) for high-risk processing (profiling, large-scale, sensitive)
   - DPO contact published if required
   - International transfers: adequacy decision or SCCs; no unsafe transfers
3. **Privacy Policy** (generated from data map, not copy-pasted):
   - What we collect, why, legal basis, retention, sharing, rights, DPO contact, complaint authority
   - Written in plain language (not legalese); versioned; change notifications
4. **Terms of Service**:
   - Acceptable use, IP ownership, user content license, disclaimers, liability cap, termination, governing law
   - No unfair terms (auto-renew without clear notice, unilateral changes without notice)
5. **Cookie Consent** (ePrivacy/GDPR):
   - Banner with granular categories (necessary / analytics / marketing / functional)
   - No pre-checked non-essential; reject-all as easy as accept; consent logged (timestamp + version)
   - Non-essential scripts blocked until consent
6. **Data Processing Agreements (DPAs)** with every subprocessors (analytics, email, payments, hosting, support tools) — signed, stored, reviewed annually.
7. **Data Retention & Deletion**:
   - Schedule per data type (e.g., invoices 7y tax, logs 1y security, inactive user data 2y then anon)
   - Automated purge jobs or documented manual process; verified quarterly
8. **Breach Response** (per `observability/incident-response.md` + GDPR 72h):
   - Detect → contain → assess risk → notify authority (72h) → notify users if high risk → postmortem

## Compliance Pack (deliverable)

```markdown
# Compliance Pack — <date>

Data map (what, where, basis, retention) | Privacy policy (vX) | Terms (vX) | Cookie banner config
DPA register (subprocessors + expiry) | Retention schedule + purge jobs | Breach response plan
```

## Validation Checklist

- [ ] Data map complete (every PII field accounted)
- [ ] Privacy policy + terms versioned, accessible, plain language
- [ ] Cookie banner: granular, reject-all easy, consent logged
- [ ] DPAs signed for all subprocessors; register current
- [ ] Retention schedule has purge jobs (or documented manual) + quarterly verification
- [ ] Breach response plan tested (tabletop drill recorded)

## Handoff

→ `payments.md` (tax, data retention), `marketing/email.md` (consent), `security/secrets.md` (PII handling), `documentation/setup.md` (user-facing links).
