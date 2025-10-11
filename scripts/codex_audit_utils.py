#!/usr/bin/env python3
# SPDX-License-Identifier: MIT
"""Shared helpers for codex audit scripts."""

from __future__ import annotations

import json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Mapping, MutableMapping

import yaml

SEVERITIES = {"ERROR", "WARN", "INFO"}


def repo_root(script_path: Path) -> Path:
    """Return repository root based on current script location."""
    return script_path.resolve().parent.parent


def load_config(root: Path) -> Mapping[str, Any]:
    """Load codex audit configuration."""
    config_path = root / "codex_audit" / "config.yaml"
    if not config_path.exists():
        raise FileNotFoundError(
            f"codex audit config not found at {config_path}"
        )
    with config_path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle) or {}


def normalise_issue(tool: str, issue: Mapping[str, Any]) -> Dict[str, Any]:
    """Normalise issue payload."""
    severity = str(issue.get("severity", "INFO")).upper()
    if severity not in SEVERITIES:
        severity = "INFO"

    normalised: Dict[str, Any] = {
        "tool": tool,
        "file": str(issue.get("file", "")),
        "line": int(issue.get("line", 0) or 0),
        "severity": severity,
        "message": str(issue.get("message", "")),
        "ref": str(issue.get("ref", "")),
    }

    category = issue.get("category")
    if category:
        normalised["category"] = str(category)

    detail = issue.get("detail")
    if detail is not None:
        normalised["detail"] = detail

    return normalised


def write_report(
    tool: str,
    issues: Iterable[Mapping[str, Any]],
    output_path: Path,
    extra: Mapping[str, Any] | None = None,
) -> Dict[str, Any]:
    """Persist tool report and return payload."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    items: List[Dict[str, Any]] = [normalise_issue(tool, issue) for issue in issues]

    counts = Counter(item["severity"] for item in items)
    payload: Dict[str, Any] = {
        "tool": tool,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "summary": {
            "counts": dict(counts),
            "total": sum(counts.values()),
        },
        "items": items,
    }

    if extra:
        payload["extra"] = dict(extra)

    with output_path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)

    return payload


def ensure_relative(path: Path, root: Path) -> str:
    """Return path relative to repo root for reporting."""
    try:
        return str(path.resolve().relative_to(root.resolve()))
    except ValueError:
        return str(path)
