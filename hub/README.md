# Hub: Context Management System

## Purpose
The Hub is the central nervous system of Context Hive, managing:
- Service dependency graphs
- AI context generation
- Document reading order optimization

## Components

### meta/
- `graph.json`: Dependency graph in machine-readable format
- `graph.mmd`: Mermaid diagram for visualization
- `reading_lists/`: Generated AI reading orders per service/task

### tools/
- `build_graph.py`: Generates dependency graphs from service metadata
- `validate_context.py`: Validates context consistency and completeness
- `gen_reading_list.py`: Generates optimized document reading lists for AI

## Usage

```bash
# Generate dependency graph
python hub/tools/build_graph.py

# Validate context
python hub/tools/validate_context.py

# Generate reading list for a specific task
python hub/tools/gen_reading_list.py sample_service implement_api
```

## Theory
See [THEORY.md](../THEORY.md) for the conceptual foundation of Hub architecture.
