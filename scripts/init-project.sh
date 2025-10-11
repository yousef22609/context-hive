#!/bin/bash
# SPDX-License-Identifier: MIT
# Context Hive Project Initializer

set -e  # Exit on error

echo "🚀 Initializing Context Hive project..."

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p docs
mkdir -p hub/meta/reading_lists
mkdir -p hub/tools
mkdir -p services
mkdir -p scripts

# Copy templates if they exist
if [ -d "template/minimal/docs" ]; then
    echo "📄 Copying template documents..."
    cp template/minimal/docs/*.md docs/ 2>/dev/null || true
fi

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
*.egg-info/
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Hub generated files (optional - you may want to commit these)
# hub/meta/reading_lists/

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local
EOF
fi

# Create requirements.txt if it doesn't exist
if [ ! -f "requirements.txt" ]; then
    echo "📦 Creating requirements.txt..."
    cat > requirements.txt << 'EOF'
# Core dependencies
pyyaml==6.0.1

# Optional: for service implementation
fastapi==0.104.1
uvicorn==0.24.0

# Optional: for testing
pytest==7.4.3
pytest-cov==4.1.0
EOF
fi

# Install dependencies if Python is available
if command -v python3 &> /dev/null; then
    echo "🐍 Installing Python dependencies..."
    python3 -m pip install -r requirements.txt --quiet || echo "⚠️  Failed to install dependencies. Install manually: pip install -r requirements.txt"
elif command -v python &> /dev/null; then
    echo "🐍 Installing Python dependencies..."
    python -m pip install -r requirements.txt --quiet || echo "⚠️  Failed to install dependencies. Install manually: pip install -r requirements.txt"
else
    echo "⚠️  Python not found. Install dependencies manually: pip install -r requirements.txt"
fi

# Make Hub tools executable
if [ -d "hub/tools" ]; then
    chmod +x hub/tools/*.py 2>/dev/null || true
fi

echo ""
echo "✅ Context Hive project initialized successfully!"
echo ""
echo "📋 Next steps:"
echo "  1. Fill in docs/ with your project details:"
echo "     - docs/VISION.md (project vision and goals)"
echo "     - docs/REQUIREMENTS.md (functional requirements)"
echo "     - docs/DESIGN.md (technical architecture)"
echo "     - docs/RULES.md (development standards)"
echo ""
echo "  2. Create your first service in services/"
echo "     - mkdir -p services/my_service/app"
echo "     - Create services/my_service/service.meta.yaml"
echo ""
echo "  3. Build the dependency graph:"
echo "     - python hub/tools/build_graph.py"
echo ""
echo "  4. Validate your context:"
echo "     - python hub/tools/validate_context.py"
echo ""
echo "  5. Generate reading lists for tasks:"
echo "     - python hub/tools/gen_reading_list.py <service> <task>"
echo ""
echo "📚 Documentation: See README.md and docs/ for more information"
echo ""
