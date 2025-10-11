"""
Reading List Generator

Generates optimized document reading lists for AI context.
"""

import json
import sys
from datetime import datetime
from pathlib import Path

def estimate_tokens(file_path: Path) -> int:
    """Estimate token count for a file (rough approximation)."""
    if not file_path.exists():
        return 0
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Rough estimate: 1 token ≈ 4 characters
            return len(content) // 4
    except Exception:
        return 0


def get_document_purpose(doc_path: str) -> str:
    """Get purpose description for a document based on its type."""
    doc_path_lower = doc_path.lower()

    if 'vision' in doc_path_lower:
        return "Understand project vision, goals, and success criteria"
    elif 'requirements' in doc_path_lower:
        return "Understand functional and non-functional requirements"
    elif 'design' in doc_path_lower:
        return "Understand technical architecture and implementation approach"
    elif 'rules' in doc_path_lower:
        return "Understand development standards, testing requirements, and guidelines"
    elif 'service.meta.yaml' in doc_path_lower:
        return "Service-specific metadata, dependencies, and task definitions"
    elif doc_path_lower.endswith('.yaml') or doc_path_lower.endswith('.yml'):
        return "Configuration and metadata"
    else:
        return "Supporting documentation"

def gen_reading_list(service_name: str, task_name: str):
    """Generate reading list for a specific task."""
    graph_path = Path("hub/meta/graph.json")

    if not graph_path.exists():
        print("❌ graph.json not found. Run build_graph.py first.")
        return

    with open(graph_path) as f:
        graph = json.load(f)

    service = graph["services"].get(service_name)
    if not service:
        print(f"❌ Service '{service_name}' not found")
        return

    task = service["tasks"].get(task_name)
    if not task:
        print(f"❌ Task '{task_name}' not found in service '{service_name}'")
        return

    # Generate reading list
    output_dir = Path(f"hub/meta/reading_lists/{service_name}")
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / f"{task_name}.md"

    # Calculate token estimates
    total_tokens = 0
    doc_info = []
    for doc in task["documents"]:
        doc_path = Path(doc)
        tokens = estimate_tokens(doc_path)
        total_tokens += tokens
        doc_info.append((doc, tokens))

    # Generate timestamp
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(output_path, "w") as f:
        f.write(f"# Reading List: {service_name} - {task_name}\n\n")
        f.write(f"**Generated**: {timestamp}\n")
        f.write(f"**Estimated tokens**: {total_tokens}\n\n")
        f.write("## Read in this order:\n\n")

        for i, (doc, tokens) in enumerate(doc_info, 1):
            # Fix relative path: from hub/meta/reading_lists/SERVICE/ to root
            purpose = get_document_purpose(doc)
            f.write(f"{i}. [{doc}](../../../../{doc})\n")
            f.write(f"   - Purpose: {purpose}\n")
            f.write(f"   - Estimated tokens: ~{tokens}\n\n")

        f.write(f"**Total**: {total_tokens} tokens\n")

    print(f"✅ Reading list saved to {output_path}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python gen_reading_list.py <service_name> <task_name>")
        sys.exit(1)

    gen_reading_list(sys.argv[1], sys.argv[2])
