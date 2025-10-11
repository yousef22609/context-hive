#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
set -eu

echo "=========================================="
echo "Context Hive - Development Bootstrap"
echo "=========================================="
echo ""

# Check Python version
echo "Checking Python version..."
python3 --version || { echo "Error: Python 3 is required"; exit 1; }
echo ""

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment already exists"
fi
echo ""

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate || {
    echo "Note: Run 'source venv/bin/activate' to activate the environment manually"
}
echo ""

# Install dependencies
echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt
echo "✅ Dependencies installed"
echo ""

# Install pre-commit hooks
echo "Installing pre-commit hooks..."
pip install pre-commit
pre-commit install
echo "✅ Pre-commit hooks installed"
echo ""

# Run initial validation
echo "Running initial validation..."
if bash scripts/validate_all.sh; then
    echo ""
    echo "=========================================="
    echo "✅ Bootstrap completed successfully!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "1. Activate the virtual environment: source venv/bin/activate"
    echo "2. Start developing!"
    echo "3. Before committing, run: scripts/validate_all.sh"
    echo ""
else
    echo ""
    echo "⚠️  Bootstrap completed with validation warnings"
    echo "Please fix the issues above before starting development"
    exit 1
fi
