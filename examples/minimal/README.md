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