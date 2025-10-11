#!/usr/bin/env python3
# SPDX-License-Identifier: MIT
"""Lint markdown documents for codex audit."""

from __future__ import annotations

import argparse
import re
from collections import defaultdict
from pathlib import Path
from typing import Dict, Iterable, List, Mapping, MutableMapping, Optional, Set, Tuple

from codex_audit_utils import (
    ensure_relative,
    load_config,
    repo_root,
    write_report,
)

Heading = Tuple[int, int, str]

HEADING_RE = re.compile(r"^(#{1,6})\s+(.*)")
LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
FULLWIDTH_ALNUM_RE = re.compile(r"[\uff10-\uff19\uff21-\uff3a\uff41-\uff5a]")


def slugify(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"\s+", "-", text)
    return text


def extract_headings(lines: Iterable[str]) -> List[Heading]:
    headings: List[Heading] = []
    inside_code = False
    for idx, line in enumerate(lines, start=1):
        stripped = line.strip()
        if stripped.startswith("```"):
            inside_code = not inside_code
            continue
        if inside_code:
            continue
        match = HEADING_RE.match(stripped)
        if not match:
            continue
        level = len(match.group(1))
        title = match.group(2).strip()
        headings.append((idx, level, title))
    return headings


def compute_toc_required(headings: List[Heading]) -> bool:
    h2_count = sum(1 for _, level, _ in headings if level == 2)
    return h2_count >= 3


def gather_bullet_markers(lines: Iterable[str]) -> Set[str]:
    markers: Set[str] = set()
    for line in lines:
        stripped = line.lstrip()
        if stripped.startswith(("- ", "* ", "+ ")):
            markers.add(stripped[0])
    return markers


def detect_case_variations(text: str, tokens: Iterable[str]) -> List[Tuple[str, Set[str]]]:
    findings: List[Tuple[str, Set[str]]] = []
    for token in tokens:
        pattern = re.compile(rf"\b({re.escape(token)})\b", re.IGNORECASE)
        matches = {match.group(0) for match in pattern.finditer(text)}
        if len(matches) > 1:
            findings.append((token, matches))
    return findings


def collect_anchors(path: Path) -> Set[str]:
    if not path.exists():
        return set()
    headings = extract_headings(path.read_text(encoding="utf-8").splitlines())
    return {slugify(title) for _, _, title in headings}


def lint_file(
    path: Path,
    anchors_cache: MutableMapping[Path, Set[str]],
    ignore_patterns: List[re.Pattern[str]],
    required_sections: List[str],
    required_doc: bool,
    section_presence: MutableMapping[str, Set[Path]],
    repo: Path,
) -> List[Mapping[str, object]]:
    issues: List[Mapping[str, object]] = []
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    headings = extract_headings(lines)

    # H1 rules
    h1s = [h for h in headings if h[1] == 1]
    if not h1s:
        issues.append(
            {
                "file": ensure_relative(path, repo),
                "line": 1,
                "severity": "ERROR",
                "message": "ドキュメント先頭に H1 見出しが存在しません。",
                "ref": "heading:h1",
            }
        )
    else:
        first_non_empty = None
        for idx, line in enumerate(lines, start=1):
            if line.strip():
                first_non_empty = (idx, line)
                break
        if first_non_empty and not first_non_empty[1].startswith("# "):
            issues.append(
                {
                    "file": ensure_relative(path, repo),
                    "line": first_non_empty[0],
                    "severity": "ERROR",
                    "message": "最初の非空行は H1 見出しである必要があります。",
                    "ref": "heading:h1",
                }
            )
        if len(h1s) > 1:
            issues.append(
                {
                    "file": ensure_relative(path, repo),
                    "line": h1s[1][0],
                    "severity": "ERROR",
                    "message": "H1 見出しはドキュメント内で 1 度のみ使用してください。",
                    "ref": "heading:h1",
                }
            )

    # Heading jumps
    last_level = 1
    for line_no, level, title in headings:
        if level == 1:
            last_level = 1
            continue
        if level > last_level + 1:
            issues.append(
                {
                    "file": ensure_relative(path, repo),
                    "line": line_no,
                    "severity": "INFO",
                    "message": f"見出しレベルが飛び級しています: H{last_level} → H{level} ({title})",
                    "ref": "heading:hierarchy",
                }
            )
        last_level = level

    # Table of contents when required
    if compute_toc_required(headings):
        if not re.search(r"table of contents|目次", text, re.IGNORECASE):
            issues.append(
                {
                    "file": ensure_relative(path, repo),
                    "line": 1,
                    "severity": "INFO",
                    "message": "大項目が複数あるため目次セクションの追加を推奨します。",
                    "ref": "structure:toc",
                }
            )

    # Bullet markers consistency
    markers = gather_bullet_markers(lines)
    if len(markers) > 1:
        issues.append(
            {
                "file": ensure_relative(path, repo),
                "line": 1,
                "severity": "INFO",
                "message": f"箇条書き記号が混在しています: {', '.join(sorted(markers))}",
                "ref": "style:bullet-markers",
            }
        )

    # Case variations for core document names
    case_findings = detect_case_variations(
        text,
        tokens=("vision", "requirements", "design", "rules"),
    )
    for base, variants in case_findings:
        issues.append(
            {
                "file": ensure_relative(path, repo),
                "line": 1,
                "severity": "INFO",
                "message": f"表記ゆれを検出しました: {sorted(variants)}",
                "ref": f"style:case-{base}",
            }
        )

    # Fullwidth characters
    inside_code = False
    for idx, line in enumerate(lines, start=1):
        stripped_line = line.strip()
        if stripped_line.startswith("```"):
            inside_code = not inside_code
            continue
        if inside_code:
            continue
        if FULLWIDTH_ALNUM_RE.search(line):
            issues.append(
                {
                    "file": ensure_relative(path, repo),
                    "line": idx,
                    "severity": "WARN",
                    "message": "英数字の全角文字を検出しました。",
                    "ref": "style:fullwidth",
                }
            )

    # Link validation
    local_anchors = {slugify(title) for _, _, title in headings}
    anchors_cache[path] = local_anchors
    parent = path.parent

    inside_code = False
    for idx, line in enumerate(lines, start=1):
        stripped_line = line.strip()
        if stripped_line.startswith("```"):
            inside_code = not inside_code
            continue
        if inside_code:
            continue
        for match in LINK_RE.finditer(line):
            link = match.group(2).strip()
            if any(pattern.match(link) for pattern in ignore_patterns):
                continue
            if re.match(r"^[a-z]+://", link):
                continue
            if link.startswith("mailto:"):
                continue

            target, anchor = link, None
            if "#" in link:
                target, anchor = link.split("#", 1)
                anchor = slugify(anchor)

            if not target or target == "":
                # same document anchor
                if anchor and anchor not in local_anchors:
                    issues.append(
                        {
                            "file": ensure_relative(path, repo),
                            "line": idx,
                            "severity": "ERROR",
                            "message": f"アンカー '{anchor}' が見つかりません。",
                            "ref": "link:anchor",
                        }
                    )
                continue

            target_path = (parent / target).resolve()
            if not target_path.exists():
                issues.append(
                    {
                        "file": ensure_relative(path, repo),
                        "line": idx,
                        "severity": "ERROR",
                        "message": f"参照先ファイルが存在しません: {target}",
                        "ref": "link:missing",
                    }
                )
                continue

            if anchor:
                if target_path not in anchors_cache:
                    anchors_cache[target_path] = collect_anchors(target_path)
                if anchor not in anchors_cache[target_path]:
                    issues.append(
                        {
                            "file": ensure_relative(path, repo),
                            "line": idx,
                            "severity": "ERROR",
                            "message": f"参照先アンカーが見つかりません: {target}#{anchor}",
                            "ref": "link:anchor",
                        }
                    )

    if required_doc:
        for section in required_sections:
            if re.search(rf"^{re.escape(section)}\s*$", text, re.MULTILINE):
                section_presence.setdefault(section, set()).add(path)

    return issues


def main() -> None:
    parser = argparse.ArgumentParser(description="Lint codex markdown documents.")
    parser.add_argument("--root", type=Path, default=None, help="Repository root.")
    parser.add_argument(
        "--output",
        type=Path,
        required=True,
        help="Output JSON file for lint results.",
    )
    args = parser.parse_args()

    script_dir = Path(__file__).resolve()
    root = args.root or repo_root(script_dir)
    config = load_config(root)

    docs_dir = root / "docs"
    anchors_cache: MutableMapping[Path, Set[str]] = {}

    ignore_patterns = [
        re.compile(pattern) for pattern in config.get("link_ignore_patterns", [])
    ]
    required_docs = [
        root / Path(doc_path)
        for doc_path in config.get("required_docs", [])
    ]
    required_docs_set = {doc.resolve() for doc in required_docs}
    required_sections = list(config.get("required_sections", []))

    issues: List[Mapping[str, object]] = []
    section_presence: MutableMapping[str, Set[Path]] = defaultdict(set)

    # Required docs existence
    for req_doc in required_docs:
        if not req_doc.exists():
            issues.append(
                {
                    "file": ensure_relative(req_doc, root),
                    "line": 0,
                    "severity": "ERROR",
                    "message": "必須ドキュメントが存在しません。",
                    "ref": "structure:required-doc",
                }
            )

    if docs_dir.exists():
        for path in sorted(docs_dir.rglob("*.md")):
            rel = ensure_relative(path, root)
            is_required = path.resolve() in required_docs_set
            issues.extend(
                lint_file(
                    path=path,
                    anchors_cache=anchors_cache,
                    ignore_patterns=ignore_patterns,
                    required_sections=required_sections,
                    required_doc=is_required,
                    section_presence=section_presence,
                    repo=root,
                )
            )
    else:
        issues.append(
            {
                "file": ensure_relative(docs_dir, root),
                "line": 0,
                "severity": "ERROR",
                "message": "/docs ディレクトリが存在しません。",
                "ref": "structure:docs-missing",
            }
        )

    for section in required_sections:
        if not section_presence.get(section):
            issues.append(
                {
                    "file": "docs",
                    "line": 0,
                    "severity": "ERROR",
                    "message": f"必須セクションがどの必須ドキュメントにも存在しません: {section}",
                    "ref": "structure:required-section",
                }
            )

    write_report(
        tool="lint_docs",
        issues=issues,
        output_path=args.output,
        extra={"checked_files": len(list(docs_dir.rglob('*.md'))) if docs_dir.exists() else 0},
    )


if __name__ == "__main__":
    main()
