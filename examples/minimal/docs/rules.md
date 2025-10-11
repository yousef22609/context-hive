# Hello World API - Rules

## Code Style

### Python Style Guide
- Follow PEP 8 strictly
- Use descriptive variable names (no single letters except loop counters)
- Maximum line length: 88 characters (Black default)
- Use double quotes for strings
- Use 4 spaces for indentation (never tabs)

### Naming Conventions
- Functions: `snake_case` (e.g., `read_root`, `health_check`)
- Variables: `snake_case` (e.g., `app`, `client`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `API_VERSION`)
- Classes: `PascalCase` (not used in this minimal example)

### Type Hints
Optional for this minimal example, but if used:
```python
def read_root() -> dict:
    return {"message": "Hello from Context Hive minimal example"}
```

## Project Structure

```
examples/minimal/
├── README.md           # Example overview and usage
├── docs/               # Context Hive documentation
│   ├── vision.md
│   ├── requirements.md
│   ├── design.md
│   └── rules.md       # This file
├── src/
│   ├── main.py        # FastAPI application
│   └── test_main.py   # Tests
└── requirements.txt   # Python dependencies
```

### File Purpose
- `main.py`: FastAPI application, route definitions only
- `test_main.py`: Tests for all endpoints
- `requirements.txt`: Exact dependency versions

## Coding Conventions

### Import Order
```python
# 1. Standard library imports
from typing import Dict

# 2. Third-party imports
from fastapi import FastAPI
from fastapi.testclient import TestClient

# 3. Local imports (none in this example)
```

### FastAPI App Configuration
```python
app = FastAPI(
    title="Context Hive Minimal Example",
    description="A minimal API demonstrating Context Hive methodology",
    version="1.0.0"
)
```

Include title, description, and version for auto-generated docs.

### Route Definitions
```python
@app.get("/")
def read_root():
    """Root endpoint - confirms API is running."""
    return {"message": "Hello from Context Hive minimal example"}
```

- Use docstrings for all route handlers
- Keep route logic in the handler (no external function calls for this example)
- Return plain dictionaries (FastAPI handles JSON serialization)

### Comments
- Use docstrings for functions
- Add comments only for non-obvious code
- Prefer self-documenting code over comments
- Link back to Context Hive docs when relevant:
  ```python
  # See docs/requirements.md FR1 for specification
  ```

## Testing Requirements

### Test Framework
- Use pytest
- Use FastAPI's `TestClient` for endpoint testing
- No mocking needed (no external dependencies)

### Test Structure
```python
def test_function_name():
    """Test description."""
    # Arrange
    client = TestClient(app)

    # Act
    response = client.get("/endpoint")

    # Assert
    assert response.status_code == 200
    assert response.json() == {"expected": "value"}
```

### Test Coverage
- Every endpoint must have at least one test
- Test both status code and response content
- Aim for > 80% coverage (should be ~90% for this simple example)

### Running Tests
```bash
# Run all tests
pytest src/test_main.py -v

# Run with coverage
pytest src/test_main.py -v --cov=src --cov-report=term-missing
```

## Dependencies

### requirements.txt
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
pytest==7.4.3
httpx==0.25.2
```

Pin exact versions for reproducibility.

### Adding Dependencies
For this minimal example: **Don't add dependencies**.

The goal is to stay minimal. If you're tempted to add a dependency, question whether it's truly needed for this learning example.

## Documentation Standards

### Code Documentation
- Docstrings for all functions (even simple ones)
- Follow Google docstring style:
  ```python
  def function_name(param: type) -> return_type:
      """Brief one-line description.

      Longer description if needed.

      Args:
          param: Description of parameter

      Returns:
          Description of return value
      """
  ```

### README Requirements
- Clear title
- What this example demonstrates
- How to run it
- Link to Context Hive documentation

### Context Hive Documents
- Keep all 4 documents (vision, requirements, design, rules) updated
- If code changes, update docs first
- Docs drive implementation, not the other way around

## Git Practices

### Commit Messages
```
Format: <type>: <description>

Examples:
feat: Add health check endpoint
fix: Correct response format for root endpoint
docs: Update requirements with health check specs
test: Add test for health endpoint
```

### What to Commit
- ✅ Source code (main.py, test_main.py)
- ✅ Documentation (all .md files)
- ✅ Configuration (requirements.txt)
- ❌ Virtual environment (venv/, .venv/)
- ❌ Cache files (__pycache__/, *.pyc)
- ❌ IDE files (.vscode/, .idea/)

### .gitignore
```
__pycache__/
*.pyc
.pytest_cache/
venv/
.venv/
*.egg-info/
.coverage
```

## Code Quality Checks

### Before Committing
1. Run tests: `pytest src/test_main.py -v`
2. Check code style: `black --check src/`
3. Run linter: `ruff check src/` (optional for this simple example)
4. Verify docs match code

### Formatting
Use Black for consistent formatting:
```bash
black src/
```

No configuration needed - accept Black defaults.

## Patterns to Use

### ✅ Simple Direct Code
```python
@app.get("/health")
def health():
    return {"status": "ok"}
```

Simple, clear, no abstraction.

### ✅ Explicit Returns
```python
def read_root():
    return {"message": "Hello from Context Hive minimal example"}
```

Not:
```python
def read_root():
    msg = "Hello from Context Hive minimal example"
    return {"message": msg}
```

## Patterns to Avoid

### ❌ Over-Engineering
```python
# DON'T DO THIS in this example:
class MessageService:
    def get_welcome_message(self) -> str:
        return "Hello from Context Hive minimal example"

@app.get("/")
def read_root(service: MessageService = Depends()):
    message = service.get_welcome_message()
    return {"message": message}
```

This is over-engineered for a minimal example. Keep it simple.

### ❌ Unnecessary Abstractions
```python
# DON'T DO THIS:
def create_response(message: str) -> dict:
    return {"message": message}

@app.get("/")
def read_root():
    return create_response("Hello from Context Hive minimal example")
```

Direct return is clearer.

### ❌ Premature Optimization
```python
# DON'T DO THIS:
import functools

@functools.lru_cache(maxsize=1)
def get_health_status() -> dict:
    return {"status": "ok"}
```

No caching needed for a static response.

## Development Workflow

### Setup
```bash
# 1. Create virtual environment
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run server
uvicorn src.main:app --reload

# 4. Test in browser
# Visit http://localhost:8000
# Visit http://localhost:8000/docs for API documentation
```

### Development Cycle
1. Update Context Hive docs if requirements change
2. Implement code changes
3. Run tests
4. Verify endpoints manually
5. Commit with clear message

## Context Hive Alignment

These rules demonstrate Context Hive principles:
- ✅ Standards defined before implementation
- ✅ AI can follow these rules to generate consistent code
- ✅ Simplicity prioritized (this is a learning example)
- ✅ Documentation first, code second

When implementing:
- Read **vision.md** to understand why we prioritize simplicity
- Read **requirements.md** to know what to build
- Read **design.md** to understand the technical approach
- Follow **rules.md** (this document) for code quality

## Example: Perfect Implementation

Here's what the perfect `main.py` looks like following all these rules:

```python
"""Context Hive Minimal Example - FastAPI Application.

This minimal API demonstrates Context Hive methodology:
documentation-driven development with AI as a team member from Day 0.

See docs/ directory for complete Context Hive documentation.
"""

from fastapi import FastAPI

app = FastAPI(
    title="Context Hive Minimal Example",
    description="A minimal API demonstrating Context Hive methodology",
    version="1.0.0",
)


@app.get("/")
def read_root():
    """Root endpoint - confirms API is running.

    Returns:
        dict: Welcome message

    Example:
        >>> GET /
        {"message": "Hello from Context Hive minimal example"}
    """
    return {"message": "Hello from Context Hive minimal example"}


@app.get("/health")
def health():
    """Health check endpoint for monitoring and deployment.

    Returns:
        dict: Health status

    Example:
        >>> GET /health
        {"status": "ok"}
    """
    return {"status": "ok"}
```

Total: ~30 lines including docstrings. Clear, simple, well-documented.

## Quality Checklist

Before considering this example complete:

- [ ] Code follows all PEP 8 rules
- [ ] All functions have docstrings
- [ ] Tests exist for both endpoints
- [ ] Tests pass with > 80% coverage
- [ ] Context Hive docs (vision, requirements, design, rules) are complete
- [ ] Code matches design.md specifications exactly
- [ ] No unnecessary dependencies
- [ ] Total code < 50 lines
- [ ] README explains how to run the example
- [ ] Links to Context Hive methodology docs

---

**Remember**: This is a minimal example for learning. Simplicity and clarity trump best practices. Show the Context Hive workflow, not advanced FastAPI patterns.
