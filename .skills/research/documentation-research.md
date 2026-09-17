---
name: documentation-research
description: Research from existing documentation and knowledge sources before decisions
domain: research
phase: research
priority: low
inputs: [research-question]
outputs: [documented-findings]
dependencies: []
next_skills: [research/technical-research]
---

# Documentation Research

## Purpose

The cheapest research tier: before spiking (`research/proof-of-concept.md`) or benchmarking (`research/benchmark.md`), extract what's already documented — then spike ONLY the gaps. Prevents spending time rediscovering written knowledge.

## When To Use

- New library/framework/API: official docs + changelogs + migration guides BEFORE PoC (per `research/proof-of-concept.md` "when NOT to use" — don't benchmark what docs state)
- Error messages/edge behaviors: docs often define semantics that explain production behavior
- Version upgrade planning: migration guides = the real cost estimate input (`documentation/ops-guides.md` §2 target)

## Workflow

1. **Source hierarchy** (prefer in order — lower = more authoritative for a given claim):
   1. Official reference/spec (behavior contracts)
   2. Changelog / release notes / migration guides (what CHANGED and breaks)
   3. Source code + tests of the lib (ground truth when docs are vague)
   4. Issue tracker (known caveats, unreleased fixes)
   5. Blog posts/Stack Overflow (LAST — dated, version-drifted, unverified)
2. **Extract with version pinning**: every finding tagged with the version it was verified against ("true for pg 16.x, not 14") — undated doc findings rot silently
3. **Contradiction check**: docs vs source mismatch → trust source, note the doc bug (worth an upstream issue)
4. **Findings memo** (into the research report):

   ```markdown
   # Doc Findings: <topic> — <date>

   - <finding> — source: <URL/repo path> — verified: <version>
   - Gaps (docs don't answer): <list> → route to PoC/benchmark
   ```

5. **Route the gaps**: unanswered questions become spike questions — never "assume it works" (`core/agent-rules.md` no-guessing)

## Rules

- Time-boxed: docs research > half a day → the question needs a spike (reading has diminishing returns)
- Never cite blog-level claims in decisions without version verification (citation without verification = `research/benchmark.md` post-hoc sin)
- Recency: check the docs' LAST-UPDATED signal; stale docs on fast-moving tech = gap by default

## Validation Checklist

- [ ] Findings version-pinned + source-linked
- [ ] Contradictions resolved against source with notes
- [ ] Gaps explicitly routed to spike/benchmark (not assumed away)

## Handoff

→ feeds `research/technical-research.md`; gaps → `research/proof-of-concept.md`.
