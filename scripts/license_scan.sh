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

python3 <<'PY' "$ROOT" "$OUTPUT"
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List

root = Path(__import__("sys").argv[1]).resolve()
output = Path(__import__("sys").argv[2])

issues: List[Dict[str, object]] = []

def rel(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(root))
    except ValueError:
        return str(path)

root_license = root / "LICENSE"
if not root_license.exists():
    issues.append(
        {
            "tool": "license_scan",
            "file": "LICENSE",
            "line": 0,
            "severity": "ERROR",
            "message": "プロジェクト直下に LICENSE ファイルが存在しません。",
            "ref": "license:root-missing",
        }
    )
else:
    text = root_license.read_text(encoding="utf-8", errors="ignore")
    if "SPDX-License-Identifier" not in text:
        issues.append(
            {
                "tool": "license_scan",
                "file": "LICENSE",
                "line": 1,
                "severity": "WARN",
                "message": "LICENSE に SPDX ライセンス識別子が含まれていません。",
                "ref": "license:spdx-missing",
            }
        )

target_dirs = ["docs", "hub", "examples", "template", "services"]
for directory in target_dirs:
    base = root / directory
    if not base.exists():
        continue
    has_license = any(
        path.name.lower().startswith("license") and path.is_file()
        for path in base.glob("LICENSE*")
    )
    if not has_license:
        issues.append(
            {
                "tool": "license_scan",
                "file": rel(base),
                "line": 0,
                "severity": "WARN",
                "message": f"{directory} にライセンス情報ファイルが見つかりません。",
                "ref": "license:fragment-missing",
            }
        )

# SPDX header check（scripts と hub/tools に限定）
header_targets = []
header_targets.extend((root / "scripts").glob("*.sh"))
if (root / "hub" / "tools").exists():
    header_targets.extend((root / "hub" / "tools").rglob("*.py"))

for path in header_targets:
    head = path.read_text(encoding="utf-8", errors="ignore").splitlines()[:5]
    if not any("SPDX-License-Identifier" in line for line in head):
        issues.append(
            {
                "tool": "license_scan",
                "file": rel(path),
                "line": 1,
                "severity": "WARN",
                "message": "SPDX-License-Identifier の記載がありません。",
                "ref": "license:header-missing",
            }
        )

# External code citation heuristic
for md_file in (root / "docs").rglob("*.md"):
    lines = md_file.read_text(encoding="utf-8", errors="ignore").splitlines()
    inside_code = False
    code_start = 0
    for idx, line in enumerate(lines, start=1):
        stripped = line.strip()
        if stripped.startswith("```"):
            if not inside_code:
                inside_code = True
                code_start = idx
            else:
                inside_code = False
            continue
        if inside_code and "http" in stripped.lower():
            window = lines[idx : idx + 3]
            if not any("source" in w.lower() or "引用" in w for w in window):
                issues.append(
                    {
                        "tool": "license_scan",
                        "file": rel(md_file),
                        "line": idx,
                        "severity": "WARN",
                        "message": "外部参照コードに出典表記がありません（ヒューリスティック）。",
                        "ref": "license:external-citation",
                    }
                )

counts = {}
for issue in issues:
    counts[issue["severity"]] = counts.get(issue["severity"], 0) + 1

payload = {
    "tool": "license_scan",
    "generated_at": datetime.now(timezone.utc).isoformat(),
    "summary": {"counts": counts, "total": len(issues)},
    "items": issues,
}

output.parent.mkdir(parents=True, exist_ok=True)
with output.open("w", encoding="utf-8") as handle:
    json.dump(payload, handle, ensure_ascii=False, indent=2)
PY
