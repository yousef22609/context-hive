#!/usr/bin/env python3
# SPDX-License-Identifier: MIT
"""Cross-reference consistency checks for codex."""

from __future__ import annotations

import argparse
import re
from pathlib import Path
from typing import Iterable, List, Mapping, Optional, Tuple

from codex_audit_utils import ensure_relative, load_config, repo_root, write_report

LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")


def iter_links(text: str) -> Iterable[Tuple[str, str]]:
    for match in LINK_RE.finditer(text):
        yield match.group(0), match.group(2).strip()


def find_doc(docs_dir: Path, candidates: Iterable[str]) -> Optional[Path]:
    wanted = {candidate.lower(): candidate for candidate in candidates}
    for path in docs_dir.glob("*.md"):
        name = path.name.lower()
        if name in wanted:
            return path
    return None


def extract_section_content(text: str, heading: str) -> Optional[str]:
    pattern = re.compile(rf"^{re.escape(heading)}\s*$", re.MULTILINE)
    match = pattern.search(text)
    if not match:
        return None

    start = match.end()
    following = re.compile(r"^##\s", re.MULTILINE)
    next_match = following.search(text, start)
    if next_match:
        return text[start:next_match.start()].strip()
    return text[start:].strip()


def link_targets_to_paths(
    link_target: str, doc_path: Path
) -> Tuple[Optional[Path], Optional[str]]:
    if link_target.startswith(("http://", "https://", "mailto:")):
        return None, None
    if link_target.startswith("#"):
        return doc_path, link_target[1:]
    target, anchor = link_target, None
    if "#" in link_target:
        target, anchor = link_target.split("#", 1)
    resolved = (doc_path.parent / target).resolve()
    return resolved, anchor


def main() -> None:
    parser = argparse.ArgumentParser(description="Codex reference checks.")
    parser.add_argument(
        "--root",
        type=Path,
        default=None,
        help="Repository root",
    )
    parser.add_argument(
        "--output",
        type=Path,
        required=True,
        help="Output JSON report path",
    )
    args = parser.parse_args()

    script_dir = Path(__file__).resolve()
    root = args.root or repo_root(script_dir)
    config = load_config(root)

    docs_dir = root / "docs"
    issues: List[Mapping[str, object]] = []

    required_docs = [
        root / Path(item) for item in config.get("required_docs", [])
    ]

    for doc_path in sorted(docs_dir.glob("*.md")):
        text = doc_path.read_text(encoding="utf-8")
        rel_path = ensure_relative(doc_path, root)
        for _, link in iter_links(text):
            resolved, _ = link_targets_to_paths(link, doc_path)
            if resolved is None:
                continue
            if resolved.is_dir():
                continue

            try:
                rel_resolved = resolved.relative_to(root)
            except ValueError:
                continue

            top_level = rel_resolved.parts[0] if rel_resolved.parts else ""
            if top_level in {"hub", "examples", "template"} and not resolved.exists():
                issues.append(
                    {
                        "file": rel_path,
                        "line": 0,
                        "severity": "ERROR",
                        "message": f"参照先が存在しません: {link}",
                        "ref": "link:cross-module",
                    }
                )

    # Applicability required section content
    applicability_paths = [
        doc for doc in required_docs if doc.name.lower() == "applicability.md"
    ]
    applicability = applicability_paths[0] if applicability_paths else None
    if applicability and applicability.exists():
        text = applicability.read_text(encoding="utf-8")
        section = extract_section_content(text, "## 不適用ケース")
        if section is None:
            issues.append(
                {
                    "file": ensure_relative(applicability, root),
                    "line": 0,
                    "severity": "ERROR",
                    "message": "「## 不適用ケース」セクションが見つかりません。",
                    "ref": "applicability:missing-section",
                }
            )
        elif not section.strip():
            issues.append(
                {
                    "file": ensure_relative(applicability, root),
                    "line": 0,
                    "severity": "ERROR",
                    "message": "「## 不適用ケース」セクションの本文が空です。",
                    "ref": "applicability:empty-section",
                }
            )
    else:
        issues.append(
            {
                "file": "docs/APPLICABILITY.md",
                "line": 0,
                "severity": "ERROR",
                "message": "必須ドキュメント docs/APPLICABILITY.md が存在しません。",
                "ref": "structure:required-doc",
            }
        )

    # DESIGN <-> RULES mutual references
    design_path = find_doc(docs_dir, ("DESIGN.md", "design.md"))
    rules_path = find_doc(docs_dir, ("RULES.md", "rules.md"))
    if design_path and rules_path:
        design_text = design_path.read_text(encoding="utf-8")
        rules_text = rules_path.read_text(encoding="utf-8")

        def has_reference(source_path: Path, source_text: str, target_path: Path) -> bool:
            for _, link in iter_links(source_text):
                resolved, _ = link_targets_to_paths(link, source_path)
                if resolved and resolved.exists() and resolved.samefile(target_path):
                    return True
            return False

        if not has_reference(design_path, design_text, rules_path):
            issues.append(
                {
                    "file": ensure_relative(design_path, root),
                    "line": 0,
                    "severity": "ERROR",
                    "message": "DESIGN ドキュメントから RULES への参照が見つかりません。",
                    "ref": "cross-ref:design-to-rules",
                }
            )
        if not has_reference(rules_path, rules_text, design_path):
            issues.append(
                {
                    "file": ensure_relative(rules_path, root),
                    "line": 0,
                    "severity": "ERROR",
                    "message": "RULES ドキュメントから DESIGN への参照が見つかりません。",
                    "ref": "cross-ref:rules-to-design",
                }
            )
    else:
        if not design_path:
            issues.append(
                {
                    "file": "docs/DESIGN.md",
                    "line": 0,
                    "severity": "ERROR",
                    "message": "DESIGN ドキュメントが見つかりません。",
                    "ref": "structure:design-missing",
                }
            )
        if not rules_path:
            issues.append(
                {
                    "file": "docs/RULES.md",
                    "line": 0,
                    "severity": "ERROR",
                    "message": "RULES ドキュメントが見つかりません。",
                    "ref": "structure:rules-missing",
                }
            )

    write_report(
        tool="check_refs",
        issues=issues,
        output_path=args.output,
    )


if __name__ == "__main__":
    main()
