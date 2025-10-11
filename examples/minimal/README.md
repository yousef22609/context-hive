# Context Hive - Minimal Example

A complete working example of Context Hive in action. This example shows how to build a simple Hello World API using the Context Hive methodology.

## What This Demonstrates

This example shows the full Context Hive workflow:
1. **Phase 0 (Pre-start)**: Creating 4 core documents before coding
2. **Phase 1 (Implementation)**: Using those docs to guide AI collaboration
3. **Result**: A working FastAPI application with clean code and tests

## What's Inside

### Documentation (docs/)
- `vision.md` - Why we're building this and what success looks like
- `requirements.md` - Functional and non-functional requirements
- `design.md` - Technical architecture and decisions
- `rules.md` - Coding standards and conventions

### Implementation (src/)
- `main.py` - FastAPI application (~20 lines)
- `test_main.py` - Basic tests

### Total Size
- 4 document files
- 2 Python files
- ~40 lines of actual code
- Built in ~30 minutes using Context Hive

## How This Was Built

### Step 1: Documentation First (Day 0)
Before writing any code, we created the 4 core documents:

1. **Vision** (10 minutes): Defined that we're building a minimal API example to demonstrate Context Hive, with success being clarity and simplicity.

2. **Requirements** (10 minutes): Specified two endpoints (/ and /health), FastAPI framework, and response time < 100ms.

3. **Design** (10 minutes): Chose FastAPI, defined API structure, documented the endpoints.

4. **Rules** (5 minutes): Established Python/FastAPI conventions, testing requirements.

### Step 2: AI Collaboration (Day 0)
```
Human: "I've created 4 Context Hive documents. Please read them."
[Shares all 4 documents]

AI: "I understand. You're building a minimal FastAPI example with
     two endpoints following the documented requirements and rules."
```

### Reading Order and Review Process (Required)

When working with this example or creating your own service, follow this workflow:

1. **Generate Reading List**: Run `hub/tools/gen_reading_list.py` to generate the optimal reading order for your task
2. **Provide Context to AI**: Share the generated reading list with Claude/ChatGPT to get implementation proposals
3. **Human Review**: Review the AI's proposal for:
   - Discrepancies with documentation
   - Missing assumptions or context
   - Edge cases not covered
4. **Validate**: Run `hub/tools/validate_context.py --strict` to ensure zero inconsistencies between docs and implementation

This process ensures that both AI and humans are working from the same shared context, minimizing miscommunication and rework.

## Try It Yourself

### Running the Example
```bash
# Install dependencies
pip install -r requirements.txt

# Run the API
uvicorn examples.minimal.src.main:app --reload

# Run tests
pytest examples/minimal/src/test_main.py
```

### Using This as a Template
1. Copy the `docs/` structure
2. Fill in your own vision, requirements, design, and rules
3. Generate a reading list for your task
4. Share with AI and iterate
5. Validate with `validate_context.py --strict`

## Key Takeaways

- **Documentation is not overhead** - It's the foundation for AI collaboration
- **30 minutes of planning** saves hours of corrections
- **Shared context** means AI understands your full intent
- **Validation catches drift** before it becomes technical debt

This example proves that Context Hive works even for tiny projects. Scale is TBD.
