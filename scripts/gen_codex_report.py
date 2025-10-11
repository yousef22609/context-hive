#!/usr/bin/env python3
# SPDX-License-Identifier: MIT
"""Generate aggregated codex audit report."""

from __future__ import annotations

import argparse
import json
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Iterable, List, Mapping, Sequence

from codex_audit_utils import load_config, repo_root

SEVERITY_ORDER = {"ERROR": 0, "WARN": 1, "INFO": 2}


def gather_reports(reports_dir: Path) -> List[Dict[str, object]]:
    reports: List[Dict[str, object]] = []
    for path in sorted(reports_dir.glob("*.json")):
        if path.name in {"audit.json"}:
            continue
        with path.open("r", encoding="utf-8") as handle:
            try:
                reports.append(json.load(handle))
            except json.JSONDecodeError as exc:
                reports.append(
                    {
                        "tool": path.stem,
                        "generated_at": "",
                        "summary": {"counts": {"ERROR": 1}, "total": 1},
                        "items": [
                            {
                                "tool": path.stem,
                                "file": str(path),
                                "line": 0,
                                "severity": "ERROR",
                                "message": f"JSON 読み込みに失敗しました: {exc}",
                                "ref": "report:invalid-json",
                            }
                        ],
                    }
                )
    return reports


def combine_items(reports: Iterable[Mapping[str, object]]) -> List[Dict[str, object]]:
    items: List[Dict[str, object]] = []
    for report in reports:
        for entry in report.get("items", []):
            if "tool" not in entry:
                entry["tool"] = report.get("tool", "unknown")
            entry.setdefault("severity", "INFO")
            items.append(entry)
    return items


def severity_key(issue: Mapping[str, object]) -> int:
    return SEVERITY_ORDER.get(issue.get("severity", "INFO"), 2)


def classify_responsibility(file_path: str) -> str:
    if not file_path:
        return "unknown"
    prefix = file_path.split("/", 1)[0]
    if prefix in {"docs", "hub", "examples", "template", "services"}:
        return prefix
    return "other"


def build_summary(
    items: Sequence[Mapping[str, object]]
) -> Mapping[str, object]:
    counts = Counter(entry.get("severity", "INFO") for entry in items)
    by_tool: Dict[str, Counter] = defaultdict(Counter)
    responsibility: Counter[str] = Counter()

    for entry in items:
        tool = entry.get("tool", "unknown")
        severity = entry.get("severity", "INFO")
        by_tool[tool][severity] += 1
        responsibility[classify_responsibility(entry.get("file", ""))] += 1

    return {
        "counts": dict(counts),
        "total": sum(counts.values()),
        "tools": {tool: dict(counter) for tool, counter in by_tool.items()},
        "responsibility": dict(responsibility),
    }


def evaluate_gating(items: Sequence[Mapping[str, object]]) -> Mapping[str, object]:
    summary = build_summary(items)
    counts = summary["counts"]

    errors = counts.get("ERROR", 0)
    warns = counts.get("WARN", 0)
    staleness_errors = sum(
        1 for item in items if item.get("tool") == "staleness" and item.get("severity") == "ERROR"
    )
    secrets_hits = sum(
        1 for item in items if item.get("tool") == "secrets_scan" and item.get("severity") in {"ERROR", "WARN"}
    )
    required_doc_missing = any(
        item.get("ref") in {"structure:required-doc", "structure:docs-missing"}
        for item in items
    )

    status = "PASS"
    reasons: List[str] = []

    if errors > 0:
        status = "FAIL"
        reasons.append("ERROR が存在します。")
    if warns > 10:
        status = "FAIL"
        reasons.append("WARN が 10 件を超過しました。")
    if staleness_errors > 0:
        status = "FAIL"
        reasons.append("スタレネス検査で ERROR が発生しました。")
    if secrets_hits > 0:
        status = "FAIL"
        reasons.append("シークレット検査で検出がありました。")
    if required_doc_missing:
        status = "FAIL"
        reasons.append("必須ドキュメントの欠落が検出されました。")

    return {
        "status": status,
        "reasons": reasons,
        "counts": summary["counts"],
        "totals": summary,
        "staleness_errors": staleness_errors,
        "secrets_hits": secrets_hits,
        "warn_threshold_exceeded": warns > 10,
        "required_doc_missing": required_doc_missing,
    }


def build_recommendations(items: Sequence[Mapping[str, object]], limit: int = 10) -> List[Mapping[str, object]]:
    prioritised = sorted(
        items,
        key=lambda item: (
            severity_key(item),
            item.get("tool", ""),
            item.get("file", ""),
            item.get("line", 0),
        ),
    )
    return [
        {
            "priority": idx + 1,
            "tool": entry.get("tool"),
            "file": entry.get("file"),
            "line": entry.get("line"),
            "severity": entry.get("severity"),
            "message": entry.get("message"),
            "ref": entry.get("ref"),
        }
        for idx, entry in enumerate(prioritised[:limit])
    ]


def write_json_report(
    output_path: Path,
    items: Sequence[Mapping[str, object]],
    summary: Mapping[str, object],
    gating: Mapping[str, object],
    recommendations: Sequence[Mapping[str, object]],
) -> None:
    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "summary": summary,
        "gating": gating,
        "recommendations": list(recommendations),
        "items": list(items),
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)


def write_html_report(
    output_path: Path,
    summary: Mapping[str, object],
    gating: Mapping[str, object],
    recommendations: Sequence[Mapping[str, object]],
    items: Sequence[Mapping[str, object]],
) -> None:
    status = gating.get("status", "PASS")
    reasons = gating.get("reasons", [])
    counts = summary.get("counts", {})
    responsibility = summary.get("responsibility", {})

    html_template = f"""<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <title>Codex Audit Report</title>
  <style>
    body {{ font-family: Arial, sans-serif; margin: 2rem; }}
    h1 {{ margin-bottom: 0.2rem; }}
    .status.FAIL {{ color: #c0392b; }}
    .status.PASS {{ color: #27ae60; }}
    table {{ border-collapse: collapse; width: 100%; margin-top: 1.5rem; }}
    th, td {{ border: 1px solid #ddd; padding: 0.5rem; font-size: 0.9rem; }}
    th {{ background: #f4f4f4; }}
    tr:nth-child(even) {{ background: #fafafa; }}
    .filters {{ margin: 1rem 0; }}
    .badge {{ display: inline-block; padding: 0.2rem 0.6rem; border-radius: 0.4rem; margin-right: 0.5rem; }}
    .badge.ERROR {{ background: #e74c3c; color: white; }}
    .badge.WARN {{ background: #f1c40f; color: #333; }}
    .badge.INFO {{ background: #3498db; color: white; }}
    .badge.docs {{ background: #9b59b6; color: white; }}
    .badge.hub {{ background: #16a085; color: white; }}
    .badge.examples {{ background: #2c3e50; color: white; }}
    .badge.template {{ background: #8e44ad; color: white; }}
    .badge.services {{ background: #34495e; color: white; }}
  </style>
</head>
<body>
  <h1>Codex Audit Report</h1>
  <p class="status {status}">ステータス: <strong>{status}</strong></p>
  <div>
    <span class="badge ERROR">ERROR: {counts.get('ERROR', 0)}</span>
    <span class="badge WARN">WARN: {counts.get('WARN', 0)}</span>
    <span class="badge INFO">INFO: {counts.get('INFO', 0)}</span>
  </div>
  <div>
    {"".join(f'<span class="badge {key}">{key}: {value}</span>' for key, value in responsibility.items())}
  </div>
  {"<ul>" + "".join(f"<li>{reason}</li>" for reason in reasons) + "</ul>" if reasons else "<p>重大な問題は検出されませんでした。</p>"}
  <h2>推奨対応順序 (上位 {len(recommendations)} 件)</h2>
  <ol>
    {"".join(f"<li>[{rec['severity']}] {rec['file']} (line {rec['line']}): {rec['message']}</li>" for rec in recommendations)}
  </ol>
  <div class="filters">
    <label>Severity:
      <select id="severityFilter">
        <option value="">All</option>
        <option value="ERROR">ERROR</option>
        <option value="WARN">WARN</option>
        <option value="INFO">INFO</option>
      </select>
    </label>
    <label>Directory:
      <select id="responsibilityFilter">
        <option value="">All</option>
        <option value="docs">docs</option>
        <option value="hub">hub</option>
        <option value="examples">examples</option>
        <option value="template">template</option>
        <option value="services">services</option>
        <option value="other">other</option>
        <option value="unknown">unknown</option>
      </select>
    </label>
  </div>
  <table id="auditTable">
    <thead>
      <tr>
        <th>Severity</th>
        <th>Tool</th>
        <th>File</th>
        <th>Line</th>
        <th>Message</th>
        <th>Ref</th>
      </tr>
    </thead>
    <tbody>
      {"".join(f"<tr data-severity='{item.get('severity','')}' data-resp='{classify_responsibility(item.get('file',''))}'><td>{item.get('severity')}</td><td>{item.get('tool')}</td><td>{item.get('file')}</td><td>{item.get('line')}</td><td>{item.get('message')}</td><td>{item.get('ref')}</td></tr>" for item in items)}
    </tbody>
  </table>
  <script>
    const severityFilter = document.getElementById('severityFilter');
    const responsibilityFilter = document.getElementById('responsibilityFilter');
    const rows = document.querySelectorAll('#auditTable tbody tr');

    function applyFilters() {{
      const severity = severityFilter.value;
      const responsibility = responsibilityFilter.value;
      rows.forEach(row => {{
        const rowSeverity = row.getAttribute('data-severity');
        const rowResp = row.getAttribute('data-resp');
        const matchesSeverity = !severity || rowSeverity === severity;
        const matchesResp = !responsibility || rowResp === responsibility;
        row.style.display = matchesSeverity && matchesResp ? '' : 'none';
      }});
    }}

    severityFilter.addEventListener('change', applyFilters);
    responsibilityFilter.addEventListener('change', applyFilters);
  </script>
</body>
</html>
"""

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(html_template, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate codex audit report.")
    parser.add_argument(
        "--reports-dir",
        type=Path,
        required=True,
        help="Directory containing tool JSON reports.",
    )
    parser.add_argument(
        "--output-json",
        type=Path,
        required=True,
        help="Aggregated JSON output.",
    )
    parser.add_argument(
        "--output-html",
        type=Path,
        required=True,
        help="Aggregated HTML output.",
    )
    parser.add_argument(
        "--config",
        type=Path,
        default=None,
        help="Optional config override path.",
    )
    parser.add_argument("--root", type=Path, default=None, help="Repository root.")

    args = parser.parse_args()
    reports_dir = args.reports_dir
    root = args.root or repo_root(Path(__file__).resolve())

    if args.config:
        config_path = args.config
    else:
        config_path = root / "codex_audit" / "config.yaml"
    if not config_path.exists():
        raise FileNotFoundError(f"config not found: {config_path}")

    # Currently config not directly used but keep parity
    _ = load_config(root)

    reports = gather_reports(reports_dir)
    items = combine_items(reports)
    summary = build_summary(items)
    gating = evaluate_gating(items)
    recommendations = build_recommendations(items)

    write_json_report(args.output_json, items, summary, gating, recommendations)
    write_html_report(args.output_html, summary, gating, recommendations, items)


if __name__ == "__main__":
    main()
