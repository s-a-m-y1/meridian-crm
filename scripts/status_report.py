#!/usr/bin/env python3
"""Generate a quick project status report to .ai/status.md.

Runs lightweight health checks (DB port, backend API, frontend port, git state)
and writes a markdown summary. Never raises — a check that cannot run is
reported as UNKNOWN.

Usage:
    python3 scripts/status_report.py
"""

import socket
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / ".ai" / "status.md"


def check_port(host: str, port: int) -> str:
    try:
        with socket.create_connection((host, port), timeout=2):
            return "UP"
    except OSError:
        return "DOWN"


def check_http(url: str) -> str:
    try:
        import urllib.request

        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req, timeout=3):
            return "OK"
    except Exception:
        return "UNREACHABLE"


def git(cmd: list[str]) -> str:
    try:
        result = subprocess.run(
            ["git", *cmd], cwd=ROOT, capture_output=True, text=True, timeout=10
        )
        return result.stdout.strip() or "n/a"
    except Exception:
        return "n/a"


def main() -> int:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    checks = [
        ("PostgreSQL (5432)", check_port("127.0.0.1", 5432)),
        ("Redis (6379)", check_port("127.0.0.1", 6379)),
        ("Backend health", check_http("http://127.0.0.1:4000/api/v1/health/liveness")),
        ("Frontend (3000)", check_port("127.0.0.1", 3000)),
    ]

    branch = git(["rev-parse", "--abbrev-ref", "HEAD"])
    dirty = git(["status", "--porcelain"]).count("\n") + (
        1 if git(["status", "--porcelain"]) else 0
    )

    lines = [
        "# Project Status",
        "",
        f"_Generated {now} by `scripts/status_report.py`_",
        "",
        "## Services",
        "",
        "| Check | Status |",
        "| ----- | ------ |",
    ]
    lines += [f"| {name} | {status} |" for name, status in checks]

    lines += [
        "",
        "## Repository",
        "",
        f"- Branch: `{branch}`",
        f"- Uncommitted changes: {dirty}",
        "",
    ]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(lines), encoding="utf-8")

    print(f"Status report written to {OUT}")
    for name, status in checks:
        print(f"  {name}: {status}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
