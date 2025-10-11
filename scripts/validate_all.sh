#!/usr/bin/env bash
set -eu

echo "=========================================="
echo "Context Hive - Validation Suite"
echo "=========================================="
echo ""

echo "1. Validating context consistency..."
python hub/tools/validate_context.py
echo ""

echo "2. Building dependency graph..."
python hub/tools/build_graph.py
echo ""

echo "3. Generating reading lists..."
python hub/tools/gen_reading_list.py
echo ""

echo "=========================================="
echo "✅ All validations passed!"
echo "=========================================="
