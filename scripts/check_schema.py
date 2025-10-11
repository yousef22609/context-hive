#!/usr/bin/env python3
# SPDX-License-Identifier: MIT
"""Validate service.meta.yaml files against schema and references."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Dict, List, Mapping, Set

import yaml
from jsonschema import Draft202012Validator
from jsonschema.exceptions import ValidationError

from codex_audit_utils import ensure_relative, load_config, repo_root, write_report


def load_schema(schema_path: Path) -> Draft202012Validator:
    schema = json.loads(schema_path.read_text(encoding="utf-8"))
    return Draft202012Validator(schema)


def resolve_reference(root: Path, value: str, fallback_dir: Path) -> Path:
    candidate = value.strip()
    if not candidate:
        return fallback_dir
    if candidate.startswith("/"):
        candidate = candidate[1:]
    if any(
        candidate.startswith(prefix)
        for prefix in ("docs/", "hub/", "examples/", "template/", "services/")
    ):
        return (root / candidate).resolve()
    return (fallback_dir / candidate).resolve()


def collect_meta_files(root: Path) -> List[Path]:
    search_roots = [
        root / "services",
        root / "examples",
        root / "template",
    ]
    files: List[Path] = []
    for base in search_roots:
        if base.exists():
            files.extend(base.rglob("service.meta.yaml"))
    return sorted({path.resolve() for path in files})


def gather_existing_files(root: Path) -> Set[Path]:
    relevant_dirs = [
        root / "docs",
        root / "hub",
        root / "examples",
        root / "template",
        root / "services",
    ]
    existing: Set[Path] = set()
    for directory in relevant_dirs:
        if not directory.exists():
            continue
        for path in directory.rglob("*"):
            if path.is_file():
                existing.add(path.resolve())
    return existing


def detect_cycles(graph: Mapping[str, Set[str]]) -> List[List[str]]:
    visited: Set[str] = set()
    stack: Set[str] = set()
    cycles: List[List[str]] = []
    path_stack: List[str] = []

    def dfs(node: str) -> None:
        if node in stack:
            cycle_start = path_stack.index(node)
            cycles.append(path_stack[cycle_start:] + [node])
            return
        if node in visited:
            return
        visited.add(node)
        stack.add(node)
        path_stack.append(node)

        for neighbour in graph.get(node, set()):
            dfs(neighbour)

        stack.remove(node)
        path_stack.pop()

    for node in graph:
        if node not in visited:
            dfs(node)

    # Deduplicate cycles (as they may include closing node twice)
    deduped: List[List[str]] = []
    for cycle in cycles:
        if cycle not in deduped:
            deduped.append(cycle)
    return deduped


def main() -> None:
    parser = argparse.ArgumentParser(description="service.meta.yaml schema validation")
    parser.add_argument("--root", type=Path, default=None, help="Repository root")
    parser.add_argument(
        "--output",
        type=Path,
        required=True,
        help="Output JSON file",
    )
    args = parser.parse_args()

    script_dir = Path(__file__).resolve()
    root = args.root or repo_root(script_dir)
    config = load_config(root)

    schema_path = root / "hub" / "schema" / "service.meta.schema.json"
    if not schema_path.exists():
        raise FileNotFoundError(f"Schema not found: {schema_path}")
    validator = load_schema(schema_path)

    meta_files = collect_meta_files(root)
    existing_files = gather_existing_files(root)

    issues: List[Mapping[str, object]] = []
    dependency_graph: Dict[str, Set[str]] = {}

    required_docs = {root / Path(path) for path in config.get("required_docs", [])}

    for meta_file in meta_files:
        rel_meta = ensure_relative(meta_file, root)
        data = yaml.safe_load(meta_file.read_text(encoding="utf-8"))
        try:
            validator.validate(data)
        except ValidationError as exc:
            issues.append(
                {
                    "file": rel_meta,
                    "line": 0,
                    "severity": "ERROR",
                    "message": f"スキーマ検証エラー: {exc.message}",
                    "ref": "schema:validation",
                }
            )
            continue

        dependencies = data.get("dependencies", []) or []
        docs = data.get("docs", []) or []
        tasks = data.get("tasks", {}) or {}

        service_id = rel_meta
        dependency_graph.setdefault(service_id, set())

        def check_reference(value: str, context: str) -> None:
            placeholder_tokens = {"your_service_name", "your_task_name", "your_document"}
            if any(token in value for token in placeholder_tokens):
                return
            target = resolve_reference(root, value, meta_file.parent)
            if not target.exists():
                issues.append(
                    {
                        "file": rel_meta,
                        "line": 0,
                        "severity": "ERROR",
                        "message": f"{context} が存在しません: {value}",
                        "ref": "reference:missing",
                    }
                )
            elif target in required_docs and target.suffix.lower() == ".md":
                # OK, already verified existence
                pass

            if target.exists() and target.name == "service.meta.yaml":
                dep_id = ensure_relative(target, root)
                if dep_id != service_id:
                    dependency_graph[service_id].add(dep_id)

            if target.exists() and target.suffix.lower() == ".md":
                if target not in existing_files:
                    issues.append(
                        {
                            "file": rel_meta,
                            "line": 0,
                            "severity": "ERROR",
                            "message": f"{context} が docs に存在しません: {value}",
                            "ref": "reference:doc-missing",
                        }
                    )

        for dep in dependencies:
            check_reference(dep, "dependencies")

        for doc_ref in docs:
            check_reference(doc_ref, "docs")

        for task_name, task_body in tasks.items():
            for document in task_body.get("documents", []) or []:
                check_reference(document, f"tasks.{task_name}.documents")

    # Cycle detection
    cycles = detect_cycles(dependency_graph)
    for cycle in cycles:
        issues.append(
            {
                "file": cycle[0],
                "line": 0,
                "severity": "ERROR",
                "message": f"サービス依存に循環が存在します: {' -> '.join(cycle)}",
                "ref": "schema:dependency-cycle",
            }
        )

    write_report(
        tool="check_schema",
        issues=issues,
        output_path=args.output,
        extra={"checked_files": len(meta_files)},
    )


if __name__ == "__main__":
    main()
