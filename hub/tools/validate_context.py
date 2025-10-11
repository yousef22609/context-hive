"""
Context Validator

Validates that all referenced documents exist, checks schema compliance,
detects dependency cycles, and ensures consistency.
"""

import argparse
import json
import sys
import yaml
from pathlib import Path
from typing import Dict, List, Set, Tuple


def load_schema():
    """Load the JSON schema for service.meta.yaml."""
    schema_path = Path("hub/schema/service.meta.schema.json")
    if not schema_path.exists():
        return None
    with open(schema_path) as f:
        return json.load(f)


def validate_against_schema(meta: dict, service_path: Path) -> Tuple[List[str], List[str]]:
    """Validate service metadata against JSON schema."""
    errors = []
    warnings = []

    try:
        from jsonschema import validate, ValidationError, Draft202012Validator
        schema = load_schema()
        if not schema:
            warnings.append("Schema file not found - skipping schema validation")
            return errors, warnings

        validator = Draft202012Validator(schema)
        schema_errors = list(validator.iter_errors(meta))

        for error in schema_errors:
            path = ".".join(str(p) for p in error.path) if error.path else "root"
            errors.append(f"Schema validation failed in {service_path} at {path}: {error.message}")

    except ImportError:
        warnings.append("jsonschema not installed - skipping schema validation")
    except Exception as e:
        errors.append(f"Schema validation error in {service_path}: {str(e)}")

    return errors, warnings


def detect_dependency_cycles(graph: dict) -> List[str]:
    """Detect circular dependencies in the service dependency graph."""
    errors = []

    # Build adjacency list
    adj_list: Dict[str, Set[str]] = {}
    for service_name, service_data in graph["services"].items():
        adj_list[service_name] = set()
        deps = service_data.get("dependencies", [])
        # Extract service names from dependency paths
        for dep in deps:
            # If dependency is to another service, add edge
            if dep.startswith("services/"):
                dep_service = dep.split("/")[1]
                if dep_service != service_name:
                    adj_list[service_name].add(dep_service)

    # DFS-based cycle detection
    visited = set()
    rec_stack = set()

    def dfs(node: str, path: List[str]) -> bool:
        """Returns True if cycle detected."""
        visited.add(node)
        rec_stack.add(node)
        path.append(node)

        for neighbor in adj_list.get(node, set()):
            if neighbor not in visited:
                if dfs(neighbor, path.copy()):
                    return True
            elif neighbor in rec_stack:
                # Cycle detected
                cycle_start = path.index(neighbor)
                cycle = path[cycle_start:] + [neighbor]
                errors.append(f"Circular dependency detected: {' -> '.join(cycle)}")
                return True

        rec_stack.remove(node)
        return False

    for service in adj_list:
        if service not in visited:
            dfs(service, [])

    return errors


def check_file_exists(file_path: str, context: str) -> Tuple[bool, str]:
    """Check if a file exists and return status."""
    path = Path(file_path)
    if not path.exists():
        return False, f"Missing file: {file_path} (referenced by {context})"
    return True, ""


def validate_context(strict: bool = False):
    """Validate context consistency."""
    graph_path = Path("hub/meta/graph.json")
    mmd_path = Path("hub/meta/graph.mmd")

    if not graph_path.exists():
        print("❌ graph.json not found. Run build_graph.py first.")
        return False

    with open(graph_path) as f:
        graph = json.load(f)

    errors = []
    warnings = []

    # Check for four pillar documents
    pillars = [
        "docs/vision.md",
        "docs/requirements.md",
        "docs/design.md",
        "docs/rules.md"
    ]
    missing_pillars = []
    for pillar in pillars:
        if not Path(pillar).exists():
            missing_pillars.append(pillar)
            errors.append(f"Missing Phase 0 pillar document: {pillar}")

    # Validate each service
    services_dir = Path("services")
    for service_path in services_dir.glob("*/service.meta.yaml"):
        service_name = service_path.parent.name

        # Load and validate against schema
        with open(service_path) as f:
            try:
                meta = yaml.safe_load(f)
            except yaml.YAMLError as e:
                errors.append(f"Invalid YAML in {service_path}: {str(e)}")
                continue

        # Schema validation
        schema_errors, schema_warnings = validate_against_schema(meta, service_path)
        errors.extend(schema_errors)
        warnings.extend(schema_warnings)

        # Check service dependencies
        service_data = graph["services"].get(service_name, {})
        deps = service_data.get("dependencies", [])
        for dep in deps:
            exists, error = check_file_exists(dep, f"service {service_name}")
            if not exists:
                errors.append(error)

        # Check task documents
        tasks = service_data.get("tasks", {})
        for task_name, task_data in tasks.items():
            documents = task_data.get("documents", [])
            for doc in documents:
                exists, error = check_file_exists(doc, f"{service_name}/{task_name}")
                if not exists:
                    errors.append(error)

            # Warn if estimated_tokens is missing
            if "estimated_tokens" not in task_data:
                warnings.append(f"Missing estimated_tokens in {service_name}/{task_name}")

            # Warn if priority is missing
            if "priority" not in task_data:
                warnings.append(f"Missing priority in {service_name}/{task_name}")

    # Check Mermaid graph references
    if mmd_path.exists():
        with open(mmd_path, 'r') as f:
            mmd_content = f.read()
            import re
            doc_refs = re.findall(r'docs/[\w\-]+\.md', mmd_content)
            for doc_ref in set(doc_refs):
                exists, error = check_file_exists(doc_ref, "graph.mmd")
                if not exists:
                    errors.append(error)
    else:
        warnings.append("graph.mmd not found")

    # Detect circular dependencies
    cycle_errors = detect_dependency_cycles(graph)
    errors.extend(cycle_errors)

    # Check for orphaned documents
    all_referenced_docs = set()
    for service_data in graph["services"].values():
        for dep in service_data.get("dependencies", []):
            all_referenced_docs.add(dep)
        for task_data in service_data.get("tasks", {}).values():
            for doc in task_data.get("documents", []):
                all_referenced_docs.add(doc)

    # Find docs that exist but aren't referenced
    docs_dir = Path("docs")
    if docs_dir.exists():
        for doc_file in docs_dir.glob("*.md"):
            doc_path = str(doc_file)
            if doc_path not in all_referenced_docs and doc_path not in pillars:
                warnings.append(f"Orphaned document (not referenced by any service): {doc_path}")

    # Display results
    print("=" * 60)
    print("Context Hive - Validation Report")
    print("=" * 60)
    print()

    if missing_pillars:
        print("❌ Phase 0 Pillar Documents:")
        for pillar in pillars:
            status = "✅" if pillar not in missing_pillars else "❌"
            print(f"   {status} {pillar}")
        print()
    else:
        print("✅ All Phase 0 pillar documents present")
        print()

    if errors:
        print("❌ ERRORS:")
        for i, error in enumerate(errors, 1):
            print(f"   {i}. {error}")
        print()

    if warnings:
        print("⚠️  WARNINGS:")
        for i, warning in enumerate(warnings, 1):
            print(f"   {i}. {warning}")
        print()

    # Summary table
    print("-" * 60)
    print("Summary:")
    print(f"  Services validated: {len(graph['services'])}")
    print(f"  Errors found:       {len(errors)}")
    print(f"  Warnings found:     {len(warnings)}")
    print("-" * 60)
    print()

    # Final verdict
    if not errors and not warnings:
        print("✅ All context references are valid - no issues found!")
        return True
    elif not errors:
        print("✅ All context references are valid")
        print("   (but see warnings above)")
        if strict:
            print()
            print("❌ STRICT MODE: Warnings treated as errors")
            return False
        return True
    else:
        print("❌ Validation failed - please fix errors above")
        return False


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Validate Context Hive context consistency")
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Treat warnings as errors"
    )
    args = parser.parse_args()

    success = validate_context(strict=args.strict)
    sys.exit(0 if success else 1)
