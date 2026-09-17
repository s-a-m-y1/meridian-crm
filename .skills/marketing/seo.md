---
name: seo
description: Search engine optimization — technical, on-page, authority building
phase: marketing
priority: medium
inputs: [content-strategy, site-implementation]
outputs: [seo-audit, seo-requirements]
dependencies: [marketing/content]
next_skills: [development/frontend, observability/metrics]
---

# SEO

## Rules

1. SEO is a **product requirement, not a plugin**: decisions (SSR vs SPA, URL structure, page speed budgets) affect rankings — so SEO requirements enter `architecture/frontend.md` BEFORE build (per `architecture/frontend-framework-guide.md` rendering-strategy row).
2. No black-hat tactics (link farms, keyword stuffing, cloaking) — short-term rank, permanent penalty; risk recorded and rejected by default (per `core/agent-rules.md` — no guessing shortcuts).

## 1. Technical SEO (engineering checklist)

- [ ] Render strategy per route: content pages crawlable (SSR/SSG — per framework guide); app islands don't hide money pages
- [ ] URLs: stable, readable, one canonical per page (`<link rel="canonical">`); no session IDs in URLs
- [ ] Sitemap.xml + robots.txt generated from routes automatically; submitted to Search Console
- [ ] Structured data (schema.org) on key pages: Product, FAQ, HowTo, Breadcrumb
- [ ] Core Web Vitals budgets enforced in CI (`development/performance-frontend.md` — SEO and UX share the budgets)
- [ ] 404s real (soft-404 = waste crawl budget); redirects 301, chains ≤ 1 hop
- [ ] hreflang if multi-language; trailing-slash/case policy consistent

## 2. On-Page (per content piece — feeds `marketing/content.md` briefs)

- Primary question in `<title>` (front-loaded) + H1; natural language, no stuffing
- Meta description = the answer's promise (CTR is the metric, not description length)
- H2/H3 outline = the question's sub-questions; one intent per page
- Internal links: cluster piece → pillar + money page (3-5 internal links, contextual)
- Images: alt = what it shows, compressed, modern formats

## 3. Authority (the slow part — no shortcuts)

- Earn links via: original data/benchmarks, free tools, genuinely-cited content — the 3 linkable asset types that work
- Digital PR: pitch journalists with the data, not the product
- NEVER buy links — recorded risk + penalty math makes it a losing bet

## 4. Measurement

Search Console + analytics wired from day 1: impressions, CTR, position per cluster, conversions from organic. Monthly review with the content calendar (`marketing/content.md` loop); technical audit quarterly (CI-automatable checks above).

## Validation Checklist

- [ ] Technical checklist green in CI (automatable items automated)
- [ ] Every published page: title/H1/canonical/structured data verified
- [ ] Organic conversions instrumented (not just traffic)

## Handoff

→ perf requirements to `development/performance-frontend.md`; rankings feed content loop.
