#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPORT_DIR="$ROOT_DIR/reports/codex"
CONFIG_PATH="$ROOT_DIR/codex_audit/config.yaml"

mkdir -p "$REPORT_DIR"
find "$REPORT_DIR" -type f -name "*.json" -delete 2>/dev/null || true
find "$REPORT_DIR" -type f -name "*.html" -delete 2>/dev/null || true

echo "[codex-audit] Starting audit pipeline..."

python3 "$SCRIPT_DIR/lint_docs.py" \
  --root "$ROOT_DIR" \
  --output "$REPORT_DIR/lint_docs.json"

python3 "$SCRIPT_DIR/check_refs.py" \
  --root "$ROOT_DIR" \
  --output "$REPORT_DIR/check_refs.json"

python3 "$SCRIPT_DIR/check_schema.py" \
  --root "$ROOT_DIR" \
  --output "$REPORT_DIR/check_schema.json"

python3 "$SCRIPT_DIR/staleness.py" \
  --root "$ROOT_DIR" \
  --output "$REPORT_DIR/staleness.json"

"$SCRIPT_DIR/secrets_scan.sh" \
  --root "$ROOT_DIR" \
  --output "$REPORT_DIR/secrets_scan.json"

"$SCRIPT_DIR/license_scan.sh" \
  --root "$ROOT_DIR" \
  --output "$REPORT_DIR/license_scan.json"

python3 "$SCRIPT_DIR/gen_codex_report.py" \
  --root "$ROOT_DIR" \
  --reports-dir "$REPORT_DIR" \
  --output-json "$REPORT_DIR/audit.json" \
  --output-html "$REPORT_DIR/audit.html" \
  --config "$CONFIG_PATH"

echo "[codex-audit] Summary:"
export AUDIT_REPORT_PATH="${REPORT_DIR}/audit.json"
python3 <<'PY'
import json
import os
import sys
from pathlib import Path

report_env = os.environ.get("AUDIT_REPORT_PATH")
if not report_env:
    print("AUDIT_REPORT_PATH is not set", file=sys.stderr)
    sys.exit(1)

report_path = Path(report_env)
data = json.loads(report_path.read_text(encoding="utf-8"))
gating = data.get("gating", {})
summary = data.get("summary", {})
counts = summary.get("counts", {})

print(f"  Status : {gating.get('status', 'UNKNOWN')}")
print(f"  ERROR  : {counts.get('ERROR', 0)}")
print(f"  WARN   : {counts.get('WARN', 0)}")
print(f"  INFO   : {counts.get('INFO', 0)}")
if gating.get("reasons"):
    print("  Reasons:")
    for reason in gating["reasons"]:
        print(f"    - {reason}")

if gating.get("status") == "FAIL":
    sys.exit(1)
PY

echo "[codex-audit] Audit completed successfully."
