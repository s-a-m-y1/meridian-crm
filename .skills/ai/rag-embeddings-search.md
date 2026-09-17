---
name: rag-embeddings-search
description: Retrieval-augmented generation — chunking, embeddings, vector search, citations
domain: ai
phase: ai
priority: high
inputs: [knowledge-sources, feature-spec]
outputs: [rag-pipeline]
dependencies: [development/ai-features]
next_skills: [ai/ai-evaluation, ai/ai-observability]
---

# RAG, Embeddings & Vector Search

The knowledge layer for LLM features (positioning per `development/ai-features.md` rule 3: RAG over fine-tuning for knowledge tasks).

## Pipeline (the five decisions)

### 1. Chunking (retrieval quality is decided HERE — not at query time)

- Semantic chunking (~200-800 tokens) at natural boundaries (headings/paragraphs — never mid-sentence arbitrary splits)
- **Chunk metadata mandatory**: source-doc, section-path, version/date, permissions-class (per `security/auth-security.md` object-level rules — retrieval must respect document ACLs: a user must never retrieve what they can't read; the metadata carries the check)
- Overlap 10-20% where boundary-loss risk exists; tables/structured content: whole-unit chunks (split tables = garbage retrieval)

### 2. Embedding selection (per `research/framework-library-evaluation.md` scorecard — model choice is a dependency decision)

- Multilingual where the corpus is (Arabic per `development/i18n-rtl.md` — embedding models vary WILDLY by language; test with OUR data per `research/benchmark.md` rules: our-docs retrieval quality, not leaderboard claims)
- Dimensions × corpus-size = the storage/query cost model (per `business/finance.md` — embeddings are recurring cost, budget-checked)
- Version-pinned: embedding-model changes require FULL re-embedding (output space differs) — upgrade = migration project per `architecture/architecture-migration.md` staged discipline

### 3. Index & retrieval mechanics

- Vector store: pgvector-class to start (SQL we already run per `architecture/database.md` Postgres default — dedicated engine only when scale/needs demand per `research/architecture-research.md` burden-of-proof)
- Hybrid retrieval default: vector + keyword (BM25-style) — hybrid beats pure-semantic on exact-terms (IDs, error codes, function names per `research/benchmark.md` evidence rules)
- **Reranking**: cross-encoder reranker on top-k (retrieval recall → rerank precision — the standard quality lever; costs latency per stage budget)
- Filters-first: metadata pre-filter (permissions + recency + source-class) BEFORE similarity — never filter after retrieval (post-filter = user-sees-then-hides = ACL hole per `security/auth-security.md`)

### 4. Generation with citations

- **Citation mandatory** (per `development/ai-features.md` rule 3): every factual claim links its chunk; no-citation = low-confidence presentation (per its guardrail rules — the answer SAYS so, doesn't guess)
- Context assembly: retrieved-chunks + query + "answer ONLY from context, cite, say-when-absent" contract (per `ai/prompt-context-engineering.md` delimiting discipline — retrieval-content is DATA, never instructions: the injection defense)
- Chunk-count budget: more ≠ better (context-dilution degrades answers — tune via evals per `ai/ai-evaluation.md`)

### 5. Freshness & sync (knowledge rots)

- Source→index sync: event-driven per `architecture/event-driven.md` (doc-updated → re-embed-chunk); sync-lag SLO + monitor (stale-index = confidently-wrong answers — the worst failure mode per `architecture/infrastructure-designs.md` search discipline)
- Full re-index path always ready (index = derived artifact, rebuildable per `data/data-governance-quality.md` lineage rule)

## Evaluation (the quality gates — full protocol: `ai/ai-evaluation.md`)

- Retrieval metrics: recall@k + precision on golden queries (our-real-questions set); citation-accuracy (cited-chunk actually supports the claim); hallucination-rate per `development/ai-features.md` gate (<2%)
- Freshness test: doc-update → retrievable within SLO (the sync promise tested, not trusted)

## Validation Checklist

- [ ] Chunks semantic + permission-metadata'd; embedding version-pinned + language-tested on OUR corpus
- [ ] Hybrid + rerank; filter-before-similarity (ACL-safe); citations mandatory
- [ ] Sync event-driven with lag-SLO; re-index path proven; retrieval evals in CI

## Handoff

→ evals per `ai/ai-evaluation.md`; cost/latency monitoring per `ai/ai-observability.md`; security review per `ai/ai-security.md`.
