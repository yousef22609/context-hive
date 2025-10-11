# Getting Started with Context Hive (30-Minute Guide)

This guide will walk you through your first Context Hive experience in 30 minutes. By the end, you'll understand how to work with AI as a team member from Day 0.

## What You'll Build

A simple Task Management API using FastAPI - but more importantly, you'll learn the Context Hive workflow:
1. Creating shared context documents
2. Collaborating with AI from Day 0
3. Implementing with AI using documented decisions

## Prerequisites

- Basic understanding of REST APIs
- Familiarity with Python (or any programming language)
- Access to an AI assistant (Claude, ChatGPT, etc.)
- Text editor and terminal

No prior Context Hive experience needed!

## The 30-Minute Journey

### Phase 0: Setup (5 minutes)

#### Step 1: Create Project Structure
```bash
mkdir my-task-api
cd my-task-api
mkdir docs
```

#### Step 2: Decide to Use Context Hive
Ask yourself:
- ✅ Is this a greenfield project? (Yes - new API)
- ✅ Do I have clear goals? (Yes - task management)
- ✅ Am I willing to write docs first? (Yes - that's why we're here!)
- ✅ Am I open to AI collaboration? (Yes!)

All yes? Great! Context Hive fits this project.

### Phase 1: Documentation (15 minutes)

You'll create 4 core documents. We'll use our minimal template as a starting point.

#### Step 3: Create Vision Document (4 minutes)

Create `docs/VISION.md`:

```markdown
## Task Management API - Vision

## Problem Statement
Developers need a simple API to manage tasks for their personal projects. Existing solutions are too complex or lack proper REST API design.

## Target Users
- Solo developers
- Small teams (2-5 people)
- Students learning web development

## Core Value Proposition
A clean, well-documented REST API for task management that can be understood and deployed in under 30 minutes.

## Success Criteria
1. Full CRUD operations for tasks
2. RESTful API design
3. OpenAPI documentation
4. Deployable to any Python-compatible host
5. Complete in under 200 lines of code

## Out of Scope (v1)
- User authentication
- Task sharing between users
- Real-time updates
- Mobile apps
```

**What just happened?** You defined the "why" and "what" of your project. AI now understands your business context.

#### Step 4: Create Requirements Document (4 minutes)

Create `docs/REQUIREMENTS.md`:

```markdown
## Task Management API - Requirements

## Functional Requirements

### FR1: Create Task
- Endpoint: `POST /tasks`
- Input: title (required), description (optional), status (default: "pending")
- Output: Created task with generated ID and timestamp
- Validation: Title must be 1-200 characters

### FR2: List Tasks
- Endpoint: `GET /tasks`
- Query params: status (optional filter)
- Output: Array of tasks
- Sorting: By creation date (newest first)

### FR3: Get Task
- Endpoint: `GET /tasks/{id}`
- Output: Single task or 404 error
- Include all task fields

### FR4: Update Task
- Endpoint: `PUT /tasks/{id}`
- Input: Any task field (title, description, status)
- Output: Updated task
- Validation: Same as create

### FR5: Delete Task
- Endpoint: `DELETE /tasks/{id}`
- Output: 204 No Content on success, 404 if not found

## Non-Functional Requirements

### NFR1: Performance
- Response time < 100ms for single operations
- Support 100 concurrent requests

### NFR2: Data Storage
- Use in-memory storage (no database for v1)
- Data lost on restart (acceptable for v1)

### NFR3: API Documentation
- Automatic OpenAPI/Swagger documentation
- Include request/response examples

### NFR4: Error Handling
- Proper HTTP status codes
- JSON error responses with message and details

## Constraints
- Python 3.8+
- No external database
- Single server (no distributed system)
```

**What just happened?** You specified exactly what the system must do. AI now has concrete implementation targets.

#### Step 5: Create Design Document (4 minutes)

Create `docs/DESIGN.md`:

```markdown
## Task Management API - Design

## Technology Stack
- **Framework**: FastAPI (for auto-docs and performance)
- **Language**: Python 3.8+
- **Storage**: In-memory dictionary
- **Validation**: Pydantic models
- **Server**: Uvicorn

## Architecture

### High-Level Structure
```
main.py              # Entry point, FastAPI app, routes
models.py            # Pydantic models for validation
storage.py           # In-memory storage management
```

### Data Model
```python
Task:
  - id: UUID (auto-generated)
  - title: str (1-200 chars)
  - description: str | None
  - status: "pending" | "in_progress" | "completed"
  - created_at: datetime (auto-generated)
  - updated_at: datetime (auto-updated)
```

### API Routes
```
POST   /tasks          → create_task()
GET    /tasks          → list_tasks()
GET    /tasks/{id}     → get_task()
PUT    /tasks/{id}     → update_task()
DELETE /tasks/{id}     → delete_task()
GET    /               → root() [health check]
```

### Storage Design
```python
## Global in-memory store
tasks: Dict[UUID, Task] = {}

## Thread-safe access using FastAPI's dependency injection
## (FastAPI is async-safe by default)
```

## Error Handling Strategy
- 400: Validation errors (Pydantic handles automatically)
- 404: Task not found
- 500: Unexpected errors (FastAPI handles automatically)

## API Documentation
FastAPI provides automatic OpenAPI docs at:
- `/docs` - Swagger UI
- `/redoc` - ReDoc UI
```

**What just happened?** You made all the technical decisions. AI now knows exactly how to structure the code.

#### Step 6: Create Rules Document (3 minutes)

Create `docs/RULES.md`:

```markdown
## Task Management API - Rules

## Code Style
- Follow PEP 8 Python style guide
- Use type hints for all functions
- Maximum line length: 100 characters
- Use descriptive variable names

## Project Structure
```
my-task-api/
├── docs/              # These documents
├── app/
│   ├── main.py       # FastAPI app and routes
│   ├── models.py     # Pydantic models
│   └── storage.py    # Storage management
├── tests/
│   └── test_api.py   # API tests
├── requirements.txt
└── README.md
```

## Coding Conventions

### Import Order
1. Standard library
2. Third-party packages
3. Local modules

### Function Documentation
Use docstrings for all public functions:
```python
def create_task(task_data: TaskCreate) -> Task:
    """Create a new task.

    Args:
        task_data: Task creation data

    Returns:
        Created task with generated ID and timestamps
    """
```

### Error Handling
```python
## Use FastAPI's HTTPException
from fastapi import HTTPException

if task_id not in tasks:
    raise HTTPException(status_code=404, detail="Task not found")
```

## Testing Requirements
- Use pytest
- Test all CRUD operations
- Test error cases (404, validation errors)
- Minimum 80% code coverage

## Dependencies
Minimal dependencies only:
```
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
pytest==7.4.3
```

## Git Practices
- Commit messages: Present tense ("Add feature" not "Added feature")
- Branch naming: feature/description, fix/description
- One feature per commit when possible
```

**What just happened?** You established quality standards. AI will follow these conventions in generated code.

### Phase 2: AI Collaboration (8 minutes)

#### Step 7: Share Context with AI (2 minutes)

Open your AI assistant and provide all four documents:

```
I'm building a Task Management API using Context Hive methodology.
I've created four foundational documents. Please read them carefully
as they contain all the decisions we've made together.

[Paste or upload docs/VISION.md]
[Paste or upload docs/REQUIREMENTS.md]
[Paste or upload docs/DESIGN.md]
[Paste or upload docs/RULES.md]

Do you understand the project? Please summarize the key points.
```

**AI should confirm understanding and summarize the project.**

#### Step 8: Request Implementation (1 minute)

```
Now, please implement the complete Task Management API according
to the documentation. Create all necessary files:
- app/main.py
- app/models.py
- app/storage.py
- requirements.txt

Follow the design and rules exactly as documented.
```

**AI will generate all the code based on your documentation.**

#### Step 9: Review and Refine (5 minutes)

The AI will create code. Review it:

✅ **Check against docs**:
- Does it match the design?
- Does it follow the rules?
- Does it implement all requirements?

✅ **Common issues to watch for**:
- Missing validation
- Incorrect status codes
- Style violations
- Missing documentation

If something doesn't match, tell AI:
```
The create_task function should return 201 status code, not 200.
Please update according to REST best practices.
```

### Phase 3: Testing (2 minutes)

#### Step 10: Run the Implementation

```bash
## Install dependencies
pip install -r requirements.txt

## Run the server
uvicorn app.main:app --reload

## Open browser
open http://localhost:8000/docs
```

Try the API through Swagger UI:
1. Create a task
2. List tasks
3. Update a task
4. Delete a task

**It should work!** If not, debug with AI using the docs as reference.

## What You Just Learned

### The Context Hive Workflow

```
Phase 0: Pre-start (Before any code)
  ├─ Create vision.md (the why)
  ├─ Create requirements.md (the what)
  ├─ Create design.md (the how)
  └─ Create rules.md (the standards)

Phase 1: Implementation (With AI)
  ├─ Share all docs with AI
  ├─ Request implementation
  ├─ Review against docs
  └─ Iterate until complete

Phase 2: Evolution (As project grows)
  ├─ Update docs when decisions change
  ├─ AI always reads updated docs
  └─ Docs and code stay in sync
```

### Key Insights

1. **Documentation First, Code Second**
   - Decisions made before coding are better decisions
   - AI implements better with clear specifications
   - Less rework during implementation

2. **AI as Team Member, Not Tool**
   - AI participated from Day 0 (through doc review)
   - AI has full context, not just a single prompt
   - AI follows team standards (from rules.md)

3. **Shared Context Reduces Errors**
   - Both you and AI work from same source of truth
   - Misunderstandings caught during doc review
   - Consistency across entire implementation

## Next Steps

### Try It Yourself
1. Modify the vision (add new feature)
2. Update requirements (specify the feature)
3. Update design (how to implement)
4. Ask AI to implement the change

**Notice**: AI adapts based on updated docs!

### Explore More

- **Check the full example**: [examples/minimal/](../examples/minimal/) - See a complete working implementation
- **Use templates**: [template/minimal/](../template/minimal/) - Start your own project
- **Read the theory**: [THEORY.md](../THEORY.md) - Understand deeper concepts
- **Check applicability**: [APPLICABILITY.md](../APPLICABILITY.md) - Is Context Hive right for your project?

### Common Questions

**Q: Do I always need all 4 documents?**
A: For Context Hive, yes. They form the complete shared context. Each serves a specific purpose.

**Q: Can I use this with [my favorite AI]?**
A: Yes! Context Hive works with any AI that can read and understand documentation (Claude, ChatGPT, Gemini, etc.)

**Q: What if requirements change?**
A: Update the docs, then tell AI. The docs are living documents, not set in stone.

**Q: How does this scale to larger projects?**
A: Unknown! That's a limitation we're honest about. Start small and experiment.

**Q: Can I use this for existing projects?**
A: It's harder. Context Hive works best for greenfield. You can try documenting new features this way.

## Troubleshooting

### AI Doesn't Follow the Docs
- Explicitly reference the document: "According to design.md, we should use FastAPI"
- Paste the relevant section again
- Ask: "Does this match the requirements in requirements.md?"

### Implementation Doesn't Work
- Check that AI followed all requirements
- Review design decisions (might need adjustment)
- Debug with AI, referencing docs: "The error contradicts design.md section 3..."

### Docs Feel Too Detailed
- That's the point! Detail = clarity for AI
- You can start lighter and add detail when AI gets confused
- Better to over-document than under-document

### Running Out of Time
- Focus on vision and requirements first
- Design and rules can be lighter initially
- Iterate and add detail as needed

## Success Checklist

After completing this guide, you should have:

- ✅ Created 4 core documents (vision, requirements, design, rules)
- ✅ Shared them with AI to establish context
- ✅ AI generated working code from those docs
- ✅ Tested the implementation
- ✅ Understood the Context Hive workflow
- ✅ Seen how documentation enables better AI collaboration

## Keep Learning

Context Hive is young and evolving. We're learning together:
- Share your experience (success or failure!)
- Suggest improvements to templates
- Try it on different project types
- Report what works and what doesn't

See [CONTRIBUTING.md](../CONTRIBUTING.md) for how to share your experience.

---

**Congratulations!** You've completed your first Context Hive project. You now understand how to treat AI as a team member from Day 0.

**Next**: Try it on your own project. Start small, document first, collaborate with AI.

**Remember**: AI as team member, not as tool. Documentation as shared context, not as burden.
