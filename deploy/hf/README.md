---
title: Meridian CRM API
emoji: 🏢
sdk: docker
app_port: 7860
---

# Meridian CRM API (Hugging Face Space)

Docker space running the Meridian CRM NestJS backend with an embedded
ephemeral Redis (queue broker). PostgreSQL is hosted on Neon and provided
via space secrets (`PGHOST`/`PGUSER`/`PGPASSWORD`/`PGDATABASE` + `PGSSL=true`).

This space repo is **generated** from the main monorepo — do not edit it
directly. See `deploy/hf/` in the main repo.
