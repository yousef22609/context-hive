#!/usr/bin/env bash
set -eu

# Usage: ./scripts/make_readinglist.sh <service_name> <task_name>

if [ $# -ne 2 ]; then
    echo "Usage: $0 <service_name> <task_name>"
    echo ""
    echo "Example: $0 sample_service implement_api"
    echo ""
    echo "Available services:"
    for service in services/*/; do
        if [ -d "$service" ]; then
            service_name=$(basename "$service")
            echo "  - $service_name"
            if [ -f "$service/service.meta.yaml" ]; then
                echo "    Tasks:"
                python3 -c "import yaml; meta = yaml.safe_load(open('$service/service.meta.yaml')); [print(f'      - {task}') for task in meta.get('tasks', {}).keys()]" 2>/dev/null || true
            fi
        fi
    done
    exit 1
fi

SERVICE_NAME=$1
TASK_NAME=$2

echo "=========================================="
echo "Generating reading list for:"
echo "  Service: $SERVICE_NAME"
echo "  Task:    $TASK_NAME"
echo "=========================================="
echo ""

# Ensure graph is up to date
echo "1. Building dependency graph..."
python hub/tools/build_graph.py
echo ""

# Generate reading list
echo "2. Generating reading list..."
python hub/tools/gen_reading_list.py "$SERVICE_NAME" "$TASK_NAME"
echo ""

# Display the reading list
READING_LIST="hub/meta/reading_lists/$SERVICE_NAME/$TASK_NAME.md"
if [ -f "$READING_LIST" ]; then
    echo "=========================================="
    echo "Reading List Generated:"
    echo "=========================================="
    cat "$READING_LIST"
    echo ""
    echo "=========================================="
    echo "✅ Reading list saved to: $READING_LIST"
    echo "=========================================="
else
    echo "❌ Failed to generate reading list"
    exit 1
fi
