#!/usr/bin/env python3
# SPDX-License-Identifier: MIT
"""Staleness and TODO ageing checks."""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable, Mapping, Sequence

from codex_audit_utils import ensure_relative, load_config, repo_root, write_report


def iter_target_files(root: Path) -> Iterable[Path]:
    targets = [
        root / "docs",
        root / "hub",
        root / "examples",
        root / "template",
    ]
    for base in targets:
        if base.exists():
            for path in base.rglob("*"):
                if path.is_file():
                    yield path


def detect_todos(path: Path) -> Sequence[tuple[int, str]]:
    findings = []
    text = path.read_text(encoding="utf-8", errors="ignore")
    for idx, line in enumerate(text.splitlines(), start=1):
        if "TODO:" in line or "FIXME:" in line:
            findings.append((idx, line.strip()))
    return findings


def main() -> None:
    parser = argparse.ArgumentParser(description="Codex staleness checks.")
    parser.add_argument("--root", type=Path, default=None, help="Repository root")
    parser.add_argument(
        "--output",
        type=Path,
        required=True,
        help="Output JSON path",
    )
    args = parser.parse_args()

    script_dir = Path(__file__).resolve()
    root = args.root or repo_root(script_dir)
    config = load_config(root)

    threshold_days = int(config.get("staleness_threshold_days", 90))
    todo_threshold = int(config.get("allow_todo_days", 30))

    now = datetime.now(timezone.utc)

    issues: list[Mapping[str, object]] = []

    for path in iter_target_files(root):
        rel_path = ensure_relative(path, root)
        stat = path.stat()
        mtime = datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc)
        age_days = (now - mtime).days

        if age_days > threshold_days:
            issues.append(
                {
                    "file": rel_path,
                    "line": 0,
                    "severity": "WARN",
                    "message": f"{age_days} 日更新がありません（閾値 {threshold_days} 日）。",
                    "ref": "staleness:file-age",
                }
            )

        for line_no, line_text in detect_todos(path):
            severity = "ERROR" if age_days > todo_threshold else "WARN"
            issues.append(
                {
                    "file": rel_path,
                    "line": line_no,
                    "severity": severity,
                    "message": f"TODO/FIXME が存在します（最終更新 {age_days} 日前）: {line_text}",
                    "ref": "staleness:todo",
                }
            )

    write_report(
        tool="staleness",
        issues=issues,
        output_path=args.output,
        extra={
            "threshold_days": threshold_days,
            "todo_threshold_days": todo_threshold,
        },
    )


if __name__ == "__main__":
    main()
