# Context Hive - Minimal Template Collection

Copy these four templates to start your Context Hive project. Fill them in order: Vision → Requirements → Design → Rules.

---

## Template 1: vision.md

```markdown
# [Project Name] - Vision

## Problem Statement
[What problem are you solving? Who experiences this problem? Why does it matter?]

Example:
"Developers need a simple way to manage tasks for personal projects. Existing solutions are either too complex (enterprise tools) or too limited (todo.txt). This leads to friction in personal productivity."

## Target Users
[Who will use this? Be specific about user personas and their contexts.]

Example:
- Solo developers working on side projects
- Small teams (2-5 people) building MVPs
- Students learning software development
- Freelancers managing client work

## Core Value Proposition
[What's the unique value? Why would someone choose this over alternatives?]

Example:
"A clean, well-documented REST API for task management that can be understood and deployed in under 30 minutes, with zero configuration required."

## Success Criteria
[How do you know if this succeeds? What are the measurable outcomes?]

Example:
1. Complete CRUD operations for tasks
2. Deployment to production in < 1 hour
3. API response time < 100ms
4. Complete documentation with examples
5. 5+ GitHub stars from actual users within 3 months

## Out of Scope (v1)
[What are you explicitly NOT building? This is critical for focus.]

Example:
- User authentication (single-user only for v1)
- Task sharing between users
- Real-time collaboration
- Mobile apps
- Email notifications
- Recurring tasks
- Task dependencies
- File attachments

## Future Vision (Optional)
[What might come later? Keep this light - it's aspirational, not committed.]

Example:
- Multi-user support with authentication
- WebSocket for real-time updates
- Mobile SDKs
- Third-party integrations (Slack, GitHub)
```

---

## Template 2: requirements.md

```markdown
# [Project Name] - Requirements

## Functional Requirements

### FR1: [Requirement Name]
- **Description**: [What this requirement does]
- **Input**: [What data/parameters are required]
- **Output**: [What the system produces]
- **Validation**: [What rules must be enforced]
- **Error Handling**: [What happens when things go wrong]

Example:
### FR1: Create Task
- **Description**: Create a new task with title and optional description
- **Input**:
  - title (string, required, 1-200 chars)
  - description (string, optional, max 2000 chars)
  - status (enum, optional, default: "pending")
- **Output**: Created task with generated UUID and timestamps
- **Validation**:
  - Title must not be empty or whitespace only
  - Status must be one of: pending, in_progress, completed
- **Error Handling**:
  - 400 Bad Request if validation fails
  - Return validation error details in response

### FR2: [Next Requirement]
[Continue for all functional requirements]

## Non-Functional Requirements

### NFR1: Performance
[Define performance expectations]

Example:
- API response time < 100ms for single operations
- Support 100 concurrent requests without degradation
- Startup time < 5 seconds
- Memory usage < 256MB under normal load

### NFR2: Scalability
[Define scale expectations]

Example:
- Support up to 10,000 tasks per user
- Handle 1,000 API requests per minute
- No database required (in-memory for v1)

### NFR3: Security
[Define security requirements]

Example:
- Input validation on all endpoints
- SQL injection prevention (N/A for in-memory)
- XSS prevention in responses
- Rate limiting (basic, 100 req/min per IP)

### NFR4: Reliability
[Define reliability expectations]

Example:
- 99% uptime for API endpoints
- Graceful error handling (no crashes)
- Data loss acceptable on restart (in-memory storage)

### NFR5: Maintainability
[Define maintainability needs]

Example:
- Code coverage > 80%
- All public functions documented
- Type hints throughout
- Automated tests for all features

### NFR6: Usability (API Design)
[Define API usability]

Example:
- RESTful design following HTTP standards
- Automatic OpenAPI documentation
- Clear error messages with details
- Consistent response format

## Constraints
[Technical and business constraints that must be respected]

Example:
- Must use Python 3.8+ (team requirement)
- No external database (keep deployment simple)
- Must run on single server (no distributed systems)
- Budget: $0/month for hosting (must support free tiers)

## Priorities
[Rank requirements by importance]

Example:
**Must Have (P0)**:
- FR1: Create Task
- FR2: List Tasks
- FR3: Get Task
- NFR1: Performance < 100ms

**Should Have (P1)**:
- FR4: Update Task
- FR5: Delete Task
- NFR6: API Documentation

**Nice to Have (P2)**:
- FR6: Filter by status
- NFR4: 99% uptime

## Dependencies
[External dependencies this project requires]

Example:
- Python 3.8 or higher
- FastAPI framework
- Pydantic for validation
- No database required
```

---

## Template 3: design.md

```markdown
# [Project Name] - Design

## Technology Stack

### Core Technologies
[List primary technologies with brief justification]

Example:
- **Language**: Python 3.8+ (team expertise, rich ecosystem)
- **Framework**: FastAPI (auto-docs, performance, type safety)
- **Validation**: Pydantic (integrated with FastAPI)
- **Server**: Uvicorn (ASGI server for FastAPI)
- **Testing**: pytest (standard Python testing)

### Storage
[Define data storage approach]

Example:
- **Type**: In-memory dictionary (v1 simplicity)
- **Persistence**: None (acceptable for v1)
- **Future**: SQLite or PostgreSQL (v2)

### Deployment
[Define deployment approach]

Example:
- **Platform**: Any Python-compatible host (Heroku, Railway, fly.io)
- **Containerization**: Docker (optional but recommended)
- **Environment**: Single instance (no clustering in v1)

## Architecture

### High-Level Structure
[Describe the overall architecture]

Example:
```
┌─────────────────────────────────────────┐
│          HTTP/JSON API                   │
├─────────────────────────────────────────┤
│  FastAPI Application (main.py)          │
│  ┌─────────────────────────────────┐   │
│  │ Routes: /tasks, /tasks/{id}     │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  Business Logic (services/)             │
│  ┌─────────────────────────────────┐   │
│  │ Task validation & operations     │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  Data Models (models.py)                │
│  ┌─────────────────────────────────┐   │
│  │ Pydantic schemas                 │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  Storage Layer (storage.py)             │
│  ┌─────────────────────────────────┐   │
│  │ In-memory dict: Dict[UUID,Task] │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Project Structure
[Define file and directory organization]

Example:
```
project/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI app, routes, startup
│   ├── models.py        # Pydantic models (Task, TaskCreate, TaskUpdate)
│   ├── storage.py       # In-memory storage management
│   └── config.py        # Configuration (optional)
├── tests/
│   ├── __init__.py
│   ├── test_api.py      # API endpoint tests
│   └── test_models.py   # Model validation tests
├── docs/                # Context Hive docs
│   ├── vision.md
│   ├── requirements.md
│   ├── design.md
│   └── rules.md
├── requirements.txt     # Python dependencies
├── Dockerfile          # Docker config (optional)
├── README.md
└── .gitignore
```

## Data Model

### Core Entities
[Define your data structures]

Example:
```python
Task:
  id: UUID                    # Auto-generated, unique identifier
  title: str                  # 1-200 chars, required
  description: str | None     # Optional, max 2000 chars
  status: TaskStatus          # Enum: pending | in_progress | completed
  created_at: datetime        # Auto-generated, ISO 8601 format
  updated_at: datetime        # Auto-updated on changes

TaskCreate:
  title: str                  # Required for creation
  description: str | None     # Optional
  status: TaskStatus          # Optional, defaults to "pending"

TaskUpdate:
  title: str | None           # All fields optional for updates
  description: str | None
  status: TaskStatus | None
```

### Data Relationships
[Describe how entities relate, if applicable]

Example:
"In v1, there are no relationships. Each task is independent. In v2, we may add:
- User → Tasks (one-to-many)
- Task → Subtasks (hierarchical)"

## API Design

### Endpoints
[Define all API endpoints with details]

Example:
```
POST   /tasks
       Body: TaskCreate
       Response: 201 Created, Task
       Errors: 400 Bad Request

GET    /tasks
       Query: ?status={status} (optional filter)
       Response: 200 OK, List[Task]
       Sorting: By created_at DESC

GET    /tasks/{id}
       Params: id (UUID)
       Response: 200 OK, Task
       Errors: 404 Not Found

PUT    /tasks/{id}
       Params: id (UUID)
       Body: TaskUpdate
       Response: 200 OK, Task
       Errors: 404 Not Found, 400 Bad Request

DELETE /tasks/{id}
       Params: id (UUID)
       Response: 204 No Content
       Errors: 404 Not Found

GET    /
       Health check / root endpoint
       Response: 200 OK, {"message": "API is running"}
```

### Response Format
[Define standard response structure]

Example:
```json
// Success (single resource)
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Build API",
  "description": "Create REST API for tasks",
  "status": "in_progress",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T14:22:00Z"
}

// Success (collection)
[
  { /* Task 1 */ },
  { /* Task 2 */ }
]

// Error
{
  "detail": "Task not found"
}

// Validation error (FastAPI auto-generates)
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

## Component Interactions

### Request Flow
[Describe how requests flow through the system]

Example:
```
1. HTTP Request → FastAPI Router
2. Router → Route Handler (in main.py)
3. Route Handler → Validate Input (Pydantic auto)
4. Route Handler → Storage Layer (storage.py)
5. Storage Layer → In-memory Dict (CRUD operation)
6. Storage Layer → Route Handler (return result)
7. Route Handler → FastAPI (serialize to JSON)
8. FastAPI → HTTP Response
```

## Error Handling

### Error Strategy
[Define how errors are handled]

Example:
- **Validation Errors**: FastAPI + Pydantic handle automatically → 400
- **Not Found**: Raise HTTPException(404, detail="Task not found")
- **Internal Errors**: FastAPI handles uncaught exceptions → 500
- **Logging**: Use Python logging to stderr

## Performance Considerations

### Optimization Strategy
[How will you ensure performance requirements are met?]

Example:
- In-memory storage ensures < 1ms lookup time
- No database queries = no query optimization needed
- FastAPI async support for concurrent requests
- Response caching not needed for v1 (consider for v2)

## Security Considerations

### Security Strategy
[How will you address security requirements?]

Example:
- Input validation via Pydantic (prevents injection)
- UUID for IDs (prevents enumeration)
- No authentication in v1 (single-user assumption)
- CORS configuration for web clients (if needed)

## Testing Strategy

### Test Approach
[How will components be tested?]

Example:
- **Unit Tests**: Test models and storage layer in isolation
- **Integration Tests**: Test full API endpoints via TestClient
- **Test Database**: Use separate in-memory instance for tests
- **Coverage Goal**: > 80% line coverage

## Deployment Architecture

### Deployment Strategy
[How will this be deployed and run?]

Example:
```
Development:
  uvicorn app.main:app --reload
  Access at http://localhost:8000

Production:
  Docker container with uvicorn
  Environment variables for config
  Single instance deployment
  No load balancer needed (v1)
```

## Key Technical Decisions

### Decision Log
[Record important technical decisions and rationale]

Example:
1. **Why FastAPI over Flask?**
   - Auto-generated OpenAPI docs
   - Better type safety with Pydantic
   - Async support for future scaling

2. **Why in-memory storage?**
   - Simplifies deployment (no DB setup)
   - Sufficient for v1 requirements
   - Easy migration to DB in v2

3. **Why UUID over auto-increment IDs?**
   - Prevents ID enumeration
   - Easier for distributed systems (future)
   - More secure

## Future Enhancements (Technical)
[Technical improvements for future versions]

Example:
- Add PostgreSQL/SQLite persistence layer
- Add Redis for caching
- Add WebSocket support for real-time updates
- Add message queue for async operations
```

---

## Template 4: rules.md

```markdown
# [Project Name] - Rules

## Code Style

### Language-Specific Style
[Define style guide for your language]

Example (Python):
- Follow PEP 8 style guide
- Use `black` formatter with default settings
- Use `pylint` or `ruff` for linting
- Maximum line length: 100 characters (black default: 88)
- Use double quotes for strings (black default)

### Naming Conventions
[Define naming patterns]

Example (Python):
- Variables/functions: `snake_case`
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Private methods: `_leading_underscore`
- Files: `snake_case.py`

### Type Hints
[Define type usage]

Example (Python):
```python
# Required for all public functions
def create_task(title: str, description: str | None = None) -> Task:
    ...

# Required for function parameters and return types
# Optional for local variables (but recommended)
tasks: Dict[UUID, Task] = {}
```

## Project Structure

### Directory Organization
[Define where things go]

Example:
```
app/
  main.py           # FastAPI app, routes only
  models.py         # Pydantic models, data schemas
  storage.py        # Storage layer, CRUD operations
  config.py         # Configuration, environment variables

tests/
  test_*.py         # All test files start with test_

docs/
  *.md              # All documentation as markdown

Root level:
  requirements.txt  # Production dependencies
  requirements-dev.txt  # Development dependencies (optional)
  README.md
  .gitignore
  Dockerfile        # If using Docker
```

### File Naming
[Rules for file names]

Example:
- Test files: `test_<module>.py`
- Models: `models.py` (single file in small projects)
- Avoid generic names like `utils.py` (be specific: `string_helpers.py`)

## Coding Conventions

### Import Order
[Define import organization]

Example (Python PEP 8):
```python
# 1. Standard library
import json
from datetime import datetime
from typing import Dict, List
from uuid import UUID, uuid4

# 2. Third-party packages
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# 3. Local application
from app.models import Task, TaskCreate
from app.storage import TaskStorage
```

### Function Structure
[Define function best practices]

Example:
```python
def function_name(param: Type) -> ReturnType:
    """Brief description of what this does.

    Args:
        param: Description of parameter

    Returns:
        Description of return value

    Raises:
        ExceptionType: When this exception is raised
    """
    # Implementation
    ...
```

### Error Handling
[Define error handling patterns]

Example (FastAPI):
```python
# Use HTTPException for API errors
from fastapi import HTTPException

if task_id not in storage:
    raise HTTPException(
        status_code=404,
        detail=f"Task {task_id} not found"
    )

# Use standard exceptions for internal logic
if not title:
    raise ValueError("Title cannot be empty")
```

### Comments and Documentation
[Define comment standards]

Example:
- Docstrings required for all public functions and classes
- Inline comments for complex logic only (code should be self-documenting)
- TODO comments must include name and date: `# TODO(name, 2025-01-15): ...`
- No commented-out code in commits (use git history)

## Testing Requirements

### Testing Framework
[Define test tools and approach]

Example (Python):
```python
# Use pytest
# Use FastAPI's TestClient for API tests
from fastapi.testclient import TestClient

# Test file structure mirrors app structure
# app/models.py → tests/test_models.py
```

### Test Coverage
[Define coverage requirements]

Example:
- Minimum 80% line coverage
- All API endpoints must have tests
- All error cases must be tested
- Use `pytest-cov` to measure coverage

### Test Structure
[Define test organization]

Example:
```python
def test_create_task_success():
    """Test successful task creation."""
    # Arrange
    client = TestClient(app)
    task_data = {"title": "Test", "description": "Test task"}

    # Act
    response = client.post("/tasks", json=task_data)

    # Assert
    assert response.status_code == 201
    assert response.json()["title"] == "Test"

def test_create_task_invalid_title():
    """Test task creation with invalid title."""
    # ... test error case
```

### What to Test
[Define testing scope]

Example:
- ✅ All CRUD operations
- ✅ Validation errors (empty title, invalid status)
- ✅ Not found errors (GET/PUT/DELETE non-existent ID)
- ✅ Edge cases (very long strings, special characters)
- ❌ Don't test FastAPI framework itself
- ❌ Don't test Pydantic validation (but test your validation logic)

## Dependencies

### Dependency Management
[Define how dependencies are managed]

Example:
```
# requirements.txt (production)
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0

# requirements-dev.txt (development)
pytest==7.4.3
pytest-cov==4.1.0
black==23.12.0
ruff==0.1.8
```

### Version Pinning
[Define version strategy]

Example:
- Pin exact versions in requirements.txt (reproducibility)
- Use `pip freeze > requirements.txt` after testing
- Update dependencies monthly (security patches)

### Adding New Dependencies
[Define process for new dependencies]

Example:
1. Evaluate if truly needed (avoid dependency bloat)
2. Check license compatibility (MIT, Apache 2.0, BSD okay)
3. Check maintenance status (active development?)
4. Add to requirements.txt with version
5. Document why it's needed (comment or in PR)

## Git Practices

### Commit Messages
[Define commit message format]

Example:
```
Format: <type>: <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes (formatting)
- refactor: Code refactoring
- test: Adding tests
- chore: Maintenance tasks

Examples:
feat: Add task filtering by status
fix: Handle empty title validation correctly
docs: Update API documentation with examples
```

### Branch Naming
[Define branch naming conventions]

Example:
```
feature/<description>  # New features
fix/<description>      # Bug fixes
docs/<description>     # Documentation
refactor/<description> # Refactoring

Examples:
feature/add-task-filtering
fix/empty-title-validation
docs/update-getting-started
```

### Pull Request Guidelines
[Define PR standards]

Example:
- One feature/fix per PR (keep focused)
- Include tests for new code
- Update docs if behavior changes
- Pass all tests and linting
- Request review from at least one person

## Code Review Standards

### What to Review
[Define review checklist]

Example:
- ✅ Code follows style guide
- ✅ Tests included and passing
- ✅ Documentation updated
- ✅ No security issues
- ✅ Error handling appropriate
- ✅ Performance acceptable
- ✅ Matches requirements/design docs

## Security Guidelines

### Security Practices
[Define security requirements]

Example:
- Never commit secrets (.env in .gitignore)
- Validate all user input (Pydantic handles this)
- Use parameterized queries if adding DB later
- Keep dependencies updated (security patches)
- Review external dependencies for security issues

### Secrets Management
[Define how to handle secrets]

Example:
```python
# Use environment variables
import os

SECRET_KEY = os.getenv("SECRET_KEY")

# Never:
SECRET_KEY = "hardcoded-secret-key"  # ❌ NEVER DO THIS
```

## Performance Guidelines

### Performance Requirements
[Define performance standards]

Example:
- API endpoints must respond in < 100ms
- No N+1 query patterns (when DB added later)
- Use pagination for list endpoints > 100 items
- Profile before optimizing (premature optimization is evil)

## Documentation Standards

### Code Documentation
[Define code doc requirements]

Example:
- All public APIs must have docstrings
- Docstrings follow Google style (or NumPy style)
- Include examples for complex functions
- Keep docs updated when code changes

### External Documentation
[Define project doc requirements]

Example:
- README.md with quick start instructions
- API documentation auto-generated (FastAPI /docs)
- Context Hive docs updated when design changes
- Keep docs/vision.md, requirements.md, design.md, rules.md current

## Patterns to Use

### Recommended Patterns
[Define preferred patterns]

Example (FastAPI):
```python
# Dependency injection for shared resources
def get_storage() -> TaskStorage:
    return task_storage

@app.post("/tasks")
def create_task(task: TaskCreate, storage: TaskStorage = Depends(get_storage)):
    ...

# Pydantic models for validation
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    ...
```

## Patterns to Avoid

### Anti-Patterns
[Define patterns to avoid]

Example:
```python
# ❌ Don't use mutable default arguments
def create_task(tags: list = []):  # ❌ BAD
    ...

def create_task(tags: list | None = None):  # ✅ GOOD
    tags = tags or []
    ...

# ❌ Don't catch all exceptions silently
try:
    ...
except:  # ❌ BAD
    pass

try:
    ...
except SpecificException as e:  # ✅ GOOD
    logger.error(f"Error: {e}")
    raise
```

## Development Workflow

### Local Development
[Define dev environment setup]

Example:
```bash
# 1. Clone and setup
git clone <repo>
cd <project>
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# 2. Install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt

# 3. Run server
uvicorn app.main:app --reload

# 4. Run tests
pytest

# 5. Format and lint
black app/ tests/
ruff check app/ tests/
```

## Tools Configuration

### Tool Settings
[Define configuration for tools]

Example:
```toml
# pyproject.toml
[tool.black]
line-length = 100

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = "test_*.py"
python_functions = "test_*"

[tool.coverage.run]
source = ["app"]
omit = ["tests/*"]

[tool.coverage.report]
fail_under = 80
```

---

## Using These Templates

1. **Copy each template** to your project's `docs/` folder
2. **Fill in each section** - replace examples with your project specifics
3. **Remove irrelevant sections** - if a section doesn't apply, delete it
4. **Add project-specific sections** - these templates are starting points, not limits
5. **Keep them updated** - docs should evolve with your project

## Template Customization

### For Different Languages
- Adjust code style to language conventions (PEP 8 for Python, Airbnb for JS, etc.)
- Update dependency management (npm, cargo, maven, etc.)
- Change file structure to match language patterns

### For Different Frameworks
- Update architecture to match framework patterns (MVC, microservices, etc.)
- Adjust testing frameworks (Jest, JUnit, etc.)
- Update deployment sections for framework requirements

### For Different Project Types
- **API**: Focus on endpoint design, request/response formats
- **CLI**: Focus on command structure, argument parsing
- **Library**: Focus on public API, versioning, backward compatibility
- **Web App**: Add frontend architecture, state management

---

**Next Steps**:
1. Copy templates to your project
2. Fill them out (work with AI if helpful!)
3. Share with AI to start implementation
4. See [examples/minimal/](../../examples/minimal/) for a complete example
