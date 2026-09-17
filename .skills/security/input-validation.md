---
name: input-validation
description: Validate all input; prevent injection classes at the source
phase: security
priority: high
inputs: [implementation]
outputs: [validated-boundaries]
dependencies: [development/backend]
next_skills: [security-review]
---

# Input Validation & Injection Prevention

## Rules

1. **Validate at the boundary, before any logic**: schema validation (type/enum/size/format) on every external input — HTTP body/query/params/headers, webhook payloads, queue messages, file uploads, config.
2. **Deny by default**: unknown fields rejected (strict schema), never silently coerced — `"5"` ≠ 5 unless the schema says so explicitly.
3. **Bound everything**: max body size, max field lengths, max array sizes, pagination caps (`limit ≤ 100`). Unbounded = DoS invitation.
4. **Canonicalize then validate**: decode/normalize first (URL, unicode, path), then check allowlists — checking the pre-canonical form is bypassable.
5. **Allowlist, don't blocklist**: file extensions, accepted content-types, redirect hosts, sortable fields — enum of known-good, never blocklist of known-bad.

## Injection Classes (specific defenses)

| Class                | Defense                                                                                 |
| -------------------- | --------------------------------------------------------------------------------------- |
| SQL                  | Parameterized/ORM only — zero string-concatenated SQL (grep in review)                  |
| NoSQL                | Operator injection — don't pass client objects as query operators                       |
| Command              | No shell with interpolated input; if unavoidable: fixed argv array + allowlisted values |
| Path traversal       | Never build paths from input; allowlist + basename + serve from jailed root             |
| Header/log injection | Strip CR/LF from anything logged or placed in headers                                   |
| Template/expression  | Never `eval`/`exec` user content; sandboxed renderers only                              |

6. Output side: encode by context (HTML/body/attr/JS/URL — different rules); rendering user HTML/markdown requires sanitize-then-allowlist.
7. Error responses: generic messages (no reflected input, no internals); validation failures say which field, not the schema.

## Validation Checklist

- [ ] Every external entry point has a schema (grep for routes without validators)
- [ ] Bounds on all sizes/lengths/caps
- [ ] Zero string-built SQL/commands (grep evidence)
- [ ] File/path handling allowlisted

## Handoff

→ probes to `testing/api-testing.md`; verification in `review/security-review.md`.
