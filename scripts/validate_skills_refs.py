#!/usr/bin/env python3
"""Validate that referenced .skills/ and .ai/ paths exist.

Scans markdown files at the repo root (and docs/) for inline references to
`.skills/...` and `.ai/...` paths and verifies each referenced file exists.

Usage:
    python3 scripts/validate_skills_refs.py
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Files that commonly reference skill/memory paths
SCAN_GLOBS = ["*.md", "docs/*.md", ".ai/*.md"]

# Match paths starting with .skills/ or .ai/ up to whitespace, quote, or paren
PATH_RE = re.compile(r"(\.(?:skills|ai)/[A-Za-z0-9_\-./]+)")


def referenced_paths(text: str):
    for match in PATH_RE.finditer(text):
        path = match.group(1).rstrip(".,;:)")
        yield path


# Local-only / generated files documented in README but not committed
SKIP_PATHS = {".ai/agent_token.env", ".ai/status.md"}


def strip_anchors(path: str) -> str:
    """Drop markdown heading anchors like `.ai/project-state.md#section`."""
    return path.split("#", 1)[0]


def main() -> int:
    missing: dict[str, set[str]] = {}
    checked = set()

    files = []
    for glob in SCAN_GLOBS:
        files.extend(ROOT.glob(glob))

    for md_file in sorted(set(files)):
        try:
            text = md_file.read_text(encoding="utf-8")
        except OSError:
            continue
        for ref in referenced_paths(text):
            ref = strip_anchors(ref)
            if ref.endswith("/"):
                continue
            if ref in SKIP_PATHS:
                continue
            if ref.endswith("-"):
                # truncated placeholder like `.ai/tasks/T-<id>`
                continue
            if ref in checked:
                continue
            checked.add(ref)
            if not (ROOT / ref).exists():
                missing.setdefault(str(md_file.relative_to(ROOT)), set()).add(ref)

    if missing:
        print("✖ Broken path references found:\n")
        for src, refs in sorted(missing.items()):
            print(f"  {src}:")
            for ref in sorted(refs):
                print(f"    - {ref}")
        return 1

    print(f"✓ All {len(checked)} referenced .skills/ and .ai/ paths exist.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
