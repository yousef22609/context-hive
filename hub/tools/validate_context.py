"""
Context Validator

Validates that all referenced documents exist and are consistent.
"""

import json
from pathlib import Path

def validate_context():
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

    # Check service dependencies
    for service_name, service_data in graph["services"].items():
        deps = service_data.get("dependencies", [])
        for dep in deps:
            if not Path(dep).exists():
                errors.append(f"Missing dependency: {dep} (referenced by service {service_name})")

        # Check task documents
        tasks = service_data.get("tasks", {})
        for task_name, task_data in tasks.items():
            documents = task_data.get("documents", [])
            for doc in documents:
                if not Path(doc).exists():
                    errors.append(f"Missing task document: {doc} (referenced by {service_name}/{task_name})")

            # Warn if estimated_tokens is missing
            if "estimated_tokens" not in task_data:
                warnings.append(f"Missing estimated_tokens in {service_name}/{task_name}")

    # Check Mermaid graph references
    if mmd_path.exists():
        with open(mmd_path, 'r') as f:
            mmd_content = f.read()
            # Extract document references from Mermaid (simple pattern matching)
            import re
            doc_refs = re.findall(r'docs/[\w\-]+\.md', mmd_content)
            for doc_ref in set(doc_refs):
                if not Path(doc_ref).exists():
                    errors.append(f"Missing document in graph.mmd: {doc_ref}")
    else:
        warnings.append("graph.mmd not found")

    # Check for four pillar documents
    pillars = [
        "docs/vision.md",
        "docs/requirements.md",
        "docs/design.md",
        "docs/rules.md"
    ]
    for pillar in pillars:
        if not Path(pillar).exists():
            errors.append(f"Missing Phase 0 pillar document: {pillar}")

    # Display results
    if errors:
        print("❌ Validation failed:")
        for error in errors:
            print(f"  - {error}")

    if warnings:
        print("\n⚠️  Warnings:")
        for warning in warnings:
            print(f"  - {warning}")

    if not errors:
        print("✅ All context references are valid")
        if warnings:
            print("   (but see warnings above)")
        return True
    return False

if __name__ == "__main__":
    validate_context()
