#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
set -euo pipefail

ROOT=""
OUTPUT=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --root)
      ROOT="$2"
      shift 2
      ;;
    --output)
      OUTPUT="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 2
      ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -z "$ROOT" ]]; then
  ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
fi

if [[ -z "$OUTPUT" ]]; then
  echo "--output is required" >&2
  exit 2
fi

if ! command -v gitleaks >/dev/null 2>&1 && ! command -v trufflehog >/dev/null 2>&1; then
  export SECRETS_SCAN_OUTPUT="$OUTPUT"
  python3 <<'PY'
import json
import os
import sys
output = os.environ.get("SECRETS_SCAN_OUTPUT")
if not output:
    print("SECRETS_SCAN_OUTPUT is not set", file=sys.stderr)
    sys.exit(1)
payload = {
    "tool": "secrets_scan",
    "generated_at": "",
    "summary": {"counts": {"ERROR": 1}, "total": 1},
    "items": [
        {
            "tool": "secrets_scan",
            "file": "",
            "line": 0,
            "severity": "ERROR",
            "message": "gitleaks または trufflehog が見つかりません。",
            "ref": "secrets:tool-missing",
        }
    ],
}
with open(output, "w", encoding="utf-8") as handle:
    json.dump(payload, handle, ensure_ascii=False, indent=2)
PY
  echo "Error: gitleaks or trufflehog is required." >&2
  exit 1
fi

tmp_report="$(mktemp)"
scanner=""
status=0

if command -v gitleaks >/dev/null 2>&1; then
  scanner="gitleaks"
  set +e
  gitleaks detect --source "$ROOT" --report-format json --report-path "$tmp_report" >/dev/null 2>&1
  status=$?
  set -e
elif command -v trufflehog >/dev/null 2>&1; then
  scanner="trufflehog"
  set +e
  trufflehog filesystem --json "$ROOT" >"$tmp_report"
  status=$?
  set -e
fi

if [[ "$scanner" == "gitleaks" && $status -gt 1 ]]; then
  echo "gitleaks execution failed (exit $status)" >&2
  exit $status
fi

if [[ "$scanner" == "trufflehog" && $status -gt 1 ]]; then
  echo "trufflehog execution failed (exit $status)" >&2
  exit $status
fi

export SECRETS_SCAN_ROOT="$ROOT"
export SECRETS_SCAN_OUTPUT="$OUTPUT"
export SECRETS_SCAN_REPORT="$tmp_report"
export SECRETS_SCAN_TOOL="$scanner"
python3 <<'PY'
import json
import os
import sys
from pathlib import Path
from datetime import datetime, timezone

root_env = os.environ.get("SECRETS_SCAN_ROOT")
output_env = os.environ.get("SECRETS_SCAN_OUTPUT")
report_env = os.environ.get("SECRETS_SCAN_REPORT")
scanner = os.environ.get("SECRETS_SCAN_TOOL", "")

if not root_env or not output_env or not report_env:
    print("Secrets scan environment not fully configured", file=sys.stderr)
    sys.exit(1)

root = Path(root_env).resolve()
output = Path(output_env)
report = Path(report_env)

items = []

def rel(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(root))
    except Exception:
        return str(path)

if scanner == "gitleaks":
    if report.exists() and report.stat().st_size > 0:
        data = json.loads(report.read_text(encoding="utf-8") or "[]")
        for finding in data:
            file_path = rel(root / finding.get("File", ""))
            items.append(
                {
                    "tool": "secrets_scan",
                    "file": file_path,
                    "line": finding.get("StartLine", 0) or 0,
                    "severity": "ERROR",
                    "message": f"{finding.get('RuleID', 'secret')} - {finding.get('Description', '').strip()}",
                    "ref": "secrets:gitleaks",
                    "detail": finding,
                }
            )
elif scanner == "trufflehog":
    entries = []
    if report.exists():
        content = report.read_text(encoding="utf-8")
        for line in content.splitlines():
            if not line.strip():
                continue
            try:
                entries.append(json.loads(line))
            except json.JSONDecodeError:
                continue
    for finding in entries:
        detector = finding.get("Detector", "trufflehog")
        file_path = rel(root / finding.get("SourceMetadata", {}).get("Data", {}).get("Filesystem", {}).get("file", ""))
        items.append(
            {
                "tool": "secrets_scan",
                "file": file_path,
                "line": finding.get("SourceMetadata", {}).get("Data", {}).get("Filesystem", {}).get("line", 0) or 0,
                "severity": "ERROR",
                "message": f"{detector} - {finding.get('Raw', '')}",
                "ref": "secrets:trufflehog",
                "detail": finding,
            }
        )

counts = {}
for issue in items:
    counts[issue["severity"]] = counts.get(issue["severity"], 0) + 1

payload = {
    "tool": "secrets_scan",
    "generated_at": datetime.now(timezone.utc).isoformat(),
    "summary": {"counts": counts, "total": len(items)},
    "items": items,
}

output.parent.mkdir(parents=True, exist_ok=True)
with output.open("w", encoding="utf-8") as handle:
    json.dump(payload, handle, ensure_ascii=False, indent=2)
PY

rm -f "$tmp_report"
