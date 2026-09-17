---
name: example/announce-release
description: Example skill that prepares a release announcement
version: 0.1.0
inputs:
  - release_notes
outputs:
  - announcement_md
---

# Purpose

Generate a release announcement markdown from `release_notes` and templates.

# Steps

1. Validate `release_notes` exist in `.ai/` context.
2. Render announcement using templates in `documentation/`.
3. Create PR with `announcement.md` in `docs/`.

# Quality Gates

- Release notes reviewed by product owner
- Markdown lint passes

# Example invocation

Load skill `example/announce-release` with `release_notes` set to `.ai/release-notes/v1.2.0.md`.
