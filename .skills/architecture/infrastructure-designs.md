---
name: caching-storage-search-realtime
description: Cross-cutting infrastructure design — caching, storage, search, realtime
domain: architecture
phase: architecture
priority: medium
inputs: [system-design, nfrs]
outputs: [infrastructure-designs]
dependencies: [architecture/system-design]
next_skills: [development/backend, development/frontend]
---

# Cross-Cutting Infrastructure: Caching, Storage, Search, Realtime

Four infrastructure designs in one place (each typically ADR-worthy). Implementation rules live in `development/backend.md` + adapter skills; THIS is the design layer.

## 1. Caching (multi-tier)

- **Tier map**: CDN (static, immutable assets) → app HTTP cache (short, public) → application cache (Redis-class: computed results, sessions) → DB cache (query/OS) — each tier: what it holds, TTL, invalidation
- **The invalidation contract** (per `development/performance-backend.md` guardrail — cache without invalidation = correctness bug with good latency): write-through/write-around/TTL-expire chosen per data type; explicit eviction on change events (per `architecture/event-driven.md`); hit-rate metric per cache (`observability/metrics.md`) — unmeasured caches get deleted in incidents (nobody trusts what they can't see)
- Stampede protection (hot-key expiry → 1 loader, N waiters); per-key TTL jitter (thundering-herd prevention)

## 2. Storage (files/blobs)

- Classify content first (per `security/input-validation.md` upload rules): user-content (UNTRUSTED — served from separate origin, forced content-type, never executed), app-assets (versioned, CDN-backed), data-exports (access-controlled, expiring URLs)
- Object-store layout + naming (collision-safe: uuid/ulid keys); access via short-lived signed URLs (no proxy-through-app for large files — bandwidth economics)
- Tiering: hot (standard) → cool (30d) → archive (compliance retention per `compliance/legal.md`); lifecycle rules automated
- Limits enforced: per-file size, type allowlist (magic-byte check, not extension), per-user quota

## 3. Search

- **Start with the DB** (Postgres full-text) — dedicated engine only when: relevance quality, faceting, typo-tolerance, or index-update rate genuinely exceed it (spike per `research/proof-of-concept.md` — our data shape decides, not benchmarks)
- Index design: source-of-truth data → indexing pipeline (event-driven sync per `architecture/event-driven.md` — CDC or outbox) → index schema (fields, analyzers per language incl. Arabic per `development/i18n-rtl.md`)
- Sync discipline: indexing lag SLO + monitor (stale index = silently wrong search results — the worst kind of wrong); reindex-from-source path (the index is REBUILDABLE, always — it's a derived artifact per `data/data-governance-quality.md` lineage rules)

## 4. Realtime (websockets/SSE)

- **Pick the shape**: SSE (server→client one-way: notifications, progress — simpler, proxy-friendly) vs WebSocket (bidirectional: collaborative editing, chat) — SSE by default, WS only when interactivity demands
- Connection economics: horizontal scale needs a pub/sub backbone (Redis pub/sub or broker) — instance-affinity breaks scale; presence/heartbeat design (dead connections cost money)
- Auth on upgrade path (handshake validates — per `security/auth-security.md`; an unauthenticated socket = unauthenticated API); backpressure + message budgets per connection (per `architecture/scalability-reliability.md`)
- Degradation: realtime is an ENHANCEMENT — app functions via polling fallback (per resilience graceful-degradation — realtime dying must not kill the product)

## Validation Checklist

- [ ] Every cache tier: contents + TTL + invalidation + hit-rate metric assigned
- [ ] Storage: content classified, signed URLs, quotas + type checks enforced
- [ ] Search: sync lag SLO + reindex path; realtime: fallback works, auth on upgrade

## Handoff

→ implementation per `development/backend.md` (adapters, jobs); ADRs for engine choices.
