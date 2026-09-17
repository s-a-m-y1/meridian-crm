---
name: monitoring-modes
description: Uptime, synthetic checks, performance and capacity monitoring modes
domain: observability
phase: observability
priority: medium
inputs: [metrics, slo-system]
outputs: [monitoring-modes]
dependencies: [observability/monitoring, observability/slo]
next_skills: [observability/alerting-tracing]
---

# Monitoring Modes (Synthetic, Uptime, Performance, Capacity)

Extends `observability/monitoring.md` (dashboards + health endpoints + detection doctrine) with the four external/proactive modes — and internal performance/capacity watching.

## 1. Synthetic Monitoring (proactive user-journey probes)

- What: scripted journeys (login → core action → logout) run from OUTSIDE against prod on a schedule, measuring availability + latency from the user's seat
- Coverage: every critical journey per `testing/e2e.md` selection (money-paths — same criteria); multi-region probes (availability is a WHERE question); transaction synthetic = the E2E test suite's smoke subset re-used as monitors (one selection, two duties per `testing/strategy.md` tier logic)
- Distinct value: catches what internal metrics miss (DNS, TLS expiry, CDN failure, region-specific breakage — "metrics green, site down" class); wired to SEV1 pages per `observability/alerting-tracing.md` tiers (synthetic failing = user-facing, by definition)
- Anti-flake: retries-then-alert (one blip ≠ outage), probe-runbook per check (what a failed probe means + first steps per `observability/monitoring.md` runbook rules)

## 2. Uptime Monitoring

- External uptime checks (the simple pings: `/healthz` from outside per `observability/monitoring.md` health endpoints) — cheap, public-status-page-able, independent of internal tooling (internal monitoring dead + site down = need BOTH layers per `architecture/disaster-recovery.md` monitoring-of-monitoring logic)
- Status page: public posture during incidents (per `observability/incident-response.md` comms cadence — updates auto-triggered by SEV1, honest granularity)

## 3. Performance Monitoring (the continuous perf watch)

- RUM (real-user monitoring): Core Web Vitals from actual users (per `development/performance-frontend.md` budgets — now continuously sampled, not just CI-time); segmented (device/locale/`development/i18n-rtl.md` region — aggregates hide the slow 10%)
- Backend continuous: p95/p99 trending per endpoint (per `observability/metrics.md` RED); regression alerts on trend (p95 +20% week-over-week = ticket-tier alert per `observability/alerting-tracing.md` — perf rot caught early, not at incident-time)
- Budget coupling: perf SLOs where latency is contractual (per `observability/slo.md` latency SLIs — burn alerting applies to perf too)

## 4. Capacity Monitoring (the proactive scale watch)

- USE-metric trending per `devops/backups-scaling-cost.md` capacity rules (headroom floors + forecast reviews — the monitoring side: dashboards + predictive alerts)
- Saturation-proxies: queue depth/age (per `architecture/event-driven.md` alerts), DB connection-pool pressure, disk-growth trend (predictive: "full in N days" alerts — the disk-full 3am page prevented weeks earlier)

## Validation Checklist

- [ ] Synthetics on all critical journeys, multi-region, retry-then-page
- [ ] External uptime + status page independent of internal tooling
- [ ] RUM segmented + perf-regression trend alerts; capacity predictive alerts wired

## Handoff

→ probes/UX failures → `observability/incident-response.md`; perf trends → `development/performance-*`; capacity → `devops/backups-scaling-cost.md`.
