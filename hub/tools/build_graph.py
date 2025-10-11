"""
Dependency Graph Builder

Scans service metadata and generates dependency graph.
"""

import json
import yaml
from pathlib import Path

def build_graph():
    """Build dependency graph from service metadata."""
    services_dir = Path("services")
    graph = {
        "version": "1.0.0",
        "services": {}
    }

    # Scan services
    for service_path in services_dir.glob("*/service.meta.yaml"):
        with open(service_path) as f:
            meta = yaml.safe_load(f)
            service_name = service_path.parent.name
            graph["services"][service_name] = meta

    # Save graph
    output_path = Path("hub/meta/graph.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(graph, f, indent=2)

    print(f"✅ Graph saved to {output_path}")

if __name__ == "__main__":
    build_graph()
