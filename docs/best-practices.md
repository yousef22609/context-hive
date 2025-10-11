# Best Practices for Context Hive

This guide provides practical best practices for using Context Hive effectively.

## Documentation Best Practices

### Keep Documents Focused and Small

**Rule of thumb**: Each document should be under 2000 tokens (~1500 words).

**Why**:
- Easier to maintain
- More efficient to load selectively
- Reduces AI context waste

**Bad example**:
```
docs/
└── everything.md  # 10,000 tokens, covers vision + requirements + design
```

**Good example**:
```
docs/
├── vision.md       # 1,500 tokens
├── requirements.md # 1,800 tokens
└── design.md       # 2,000 tokens
```

### Update Documents Before Code

**Principle**: Documentation is the source of truth.

**Workflow**:
1. Realize design needs to change
2. Update `docs/DESIGN.md` first
3. Regenerate reading lists: `python hub/tools/gen_reading_list.py ...`
4. Then implement code changes

**Anti-pattern**:
```
## Wrong order
1. Change code
2. Tests fail
3. Fix code
4. Maybe update docs later (or forget)
```

**Correct order**:
```
## Right order
1. Update docs/DESIGN.md
2. Regenerate graph: python hub/tools/build_graph.py
3. Generate reading list
4. AI implements based on updated docs
5. Tests pass because design was thought through
```

### Use Consistent Section Structure

Define standard sections for each document type:

**vision.md**:
```markdown
## Vision

## Problem Statement
## Target Users
## Desired Outcome
## Success Metrics
```

**requirements.md**:
```markdown
## Requirements

## Functional Requirements
## Non-Functional Requirements
## Constraints
## Out of Scope
```

**design.md**:
```markdown
## Design

## Architecture Overview
## Components
## Data Models
## API Contracts
## Security Considerations
```

This consistency helps AI know where to find specific information.

### Use Relative Links Between Documents

**Bad**:
```markdown
See design.md for details.
```

**Good**:
```markdown
See [design.md](./design.md) for details.
```

**Why**: Explicit links help both humans and validation tools.

### Version Your Documents

Use Git effectively:

```bash
## Tag major documentation milestones
git tag -a docs-v1.0 -m "Phase 0 complete"
git tag -a docs-v2.0 -m "Phase 2 documentation complete"
```

This lets you roll back if needed and track documentation evolution.

## Hub Usage Best Practices

### Run validate_context.py Before Major Changes

**When to run**:
- Before Phase transitions
- After adding new services
- After refactoring document structure
- Before generating reading lists for critical tasks

**Example workflow**:
```bash
## Add new service
vim services/new_service/service.meta.yaml

## Validate everything is consistent
python hub/tools/validate_context.py

## If validation passes, regenerate graph
python hub/tools/build_graph.py
```

### Generate Reading Lists for Complex Tasks

**Rule**: If a task requires reading more than 3 documents, generate a reading list.

**Don't do this**:
```
AI, please implement the authentication service.
Make sure to read:
- docs/REQUIREMENTS.md
- docs/DESIGN.md
- services/auth_service/service.meta.yaml
- docs/security_guidelines.md
- docs/api_standards.md
```

**Do this instead**:
```bash
## Generate optimized reading list
python hub/tools/gen_reading_list.py auth_service implement_auth

## AI reads the generated list in optimal order
```

**Benefit**: Reading list ensures:
- Correct order (dependencies first)
- Nothing is missed
- Token usage is estimated

### Keep service.meta.yaml Up to Date

**When to update**:
- Adding new dependencies
- Adding new tasks
- Changing document references

**Example service.meta.yaml evolution**:

```yaml
## Initial version
name: auth_service
version: 1.0.0
dependencies:
  - docs/REQUIREMENTS.md
  - docs/DESIGN.md
tasks:
  implement_auth:
    documents:
      - docs/REQUIREMENTS.md
      - docs/DESIGN.md
      - services/auth_service/service.meta.yaml
    estimated_tokens: 5000

## Later, after adding OAuth
name: auth_service
version: 1.1.0
dependencies:
  - docs/REQUIREMENTS.md
  - docs/DESIGN.md
  - docs/oauth_integration.md  # New dependency
tasks:
  implement_auth:
    documents:
      - docs/REQUIREMENTS.md
      - docs/DESIGN.md
      - docs/oauth_integration.md  # Added
      - services/auth_service/service.meta.yaml
    estimated_tokens: 6500  # Updated estimate
  implement_oauth:  # New task
    documents:
      - docs/oauth_integration.md
      - services/auth_service/service.meta.yaml
    estimated_tokens: 3000
```

### Visualize Your Dependency Graph

The Hub generates `graph.mmd` (Mermaid diagram). Use it!

**View in GitHub**: GitHub renders Mermaid automatically.

**View locally**: Use Mermaid CLI or IDE extensions.

**Update process**:
```bash
## After changes, regenerate graph
python hub/tools/build_graph.py

## View graph.mmd in your IDE or GitHub
```

**Use cases**:
- Onboarding new team members (show them the graph)
- Architectural reviews (visual representation)
- Identifying circular dependencies
- Planning refactoring

## Service Development Best Practices

### One Service = One Responsibility

**Bad**:
```
services/
└── everything_service/  # Handles auth, data, UI, everything
```

**Good**:
```
services/
├── auth_service/     # Only authentication
├── data_service/     # Only data access
└── api_gateway/      # Only routing
```

**Why**:
- Clearer dependencies
- Easier to understand and maintain
- AI can focus on one responsibility at a time

### Define Tasks Explicitly in YAML

**Bad**: Vague task descriptions
```yaml
tasks:
  build_it:
    documents:
      - docs/REQUIREMENTS.md
```

**Good**: Explicit task with clear context
```yaml
tasks:
  implement_login_endpoint:
    description: Implement POST /api/auth/login endpoint
    documents:
      - docs/REQUIREMENTS.md
      - docs/DESIGN.md
      - docs/api_standards.md
      - services/auth_service/service.meta.yaml
    estimated_tokens: 4500
    priority: high
    steps:
      - Validate username/password format
      - Check credentials against database
      - Generate JWT token
      - Return token with expiry
    validation:
      - Returns 200 with valid token on success
      - Returns 401 on invalid credentials
      - Returns 400 on malformed input
```

**Why**: Clear task definitions enable AI autonomy.

### Use Consistent Service Structure

Standardize your service layout:

```
services/
└── [service_name]/
    ├── README.md                # Service overview
    ├── service.meta.yaml        # Metadata for Hub
    ├── app/                     # Implementation
    │   ├── main.py
    │   └── ...
    ├── tasks/                   # Task definitions
    │   ├── implement_api.yaml
    │   └── implement_tests.yaml
    └── tests/                   # Tests
        └── test_main.py
```

This consistency:
- Makes it easy for AI to navigate
- Simplifies onboarding
- Enables tooling and automation

## Working with AI Best Practices

### Load Context in the Right Order

**Principle**: Read dependencies before dependents.

**Bad order**:
```
1. Read services/auth_service/service.meta.yaml
2. Read docs/DESIGN.md
3. Read docs/REQUIREMENTS.md
```

**Good order** (generated by reading list):
```
1. Read docs/REQUIREMENTS.md       # Foundational
2. Read docs/DESIGN.md              # Builds on requirements
3. Read services/auth_service/service.meta.yaml  # Specific to task
```

**How to ensure this**: Use generated reading lists, don't guess.

### Provide Explicit Instructions

**Bad prompt**:
```
Build the auth service.
```

**Good prompt**:
```
Read the following documents in order:
1. docs/REQUIREMENTS.md
2. docs/DESIGN.md
3. services/auth_service/service.meta.yaml

Then implement the authentication service according to the specifications,
following the coding standards in docs/RULES.md.

Implement:
- POST /api/auth/login endpoint
- JWT token generation
- Password validation
- Error handling

Write unit tests with >80% coverage.
```

**Even better**: Use generated reading lists
```
Read the documents in hub/meta/reading_lists/auth_service/implement_auth.md
in the specified order.

Then implement the authentication endpoints as described in the task
definition at services/auth_service/tasks/implement_auth.yaml.
```

### Review AI Output Systematically

Don't blindly trust AI. Use this checklist:

**Code review**:
- [ ] Matches design specification
- [ ] Follows coding standards (docs/RULES.md)
- [ ] Handles errors appropriately
- [ ] Has adequate tests
- [ ] No obvious security issues

**Test review**:
- [ ] Tests actually test the requirements
- [ ] Edge cases are covered
- [ ] Mocks are used appropriately
- [ ] Tests pass

**Documentation review**:
- [ ] Code comments are clear
- [ ] README is updated if needed
- [ ] API documentation matches implementation

### Iterate on Context, Not Just Code

**Anti-pattern**: AI makes mistake → fix code → AI makes same mistake again

**Better pattern**: AI makes mistake → fix docs → regenerate reading list → AI fixes code correctly

**Example**:
```
Problem: AI implemented authentication but missed rate limiting

Wrong fix:
1. Manually add rate limiting to code
2. Continue

Right fix:
1. Add rate limiting requirements to docs/REQUIREMENTS.md
2. Add rate limiting design to docs/DESIGN.md
3. Regenerate: python hub/tools/build_graph.py
4. Have AI re-implement with updated context
5. Now AI knows to include rate limiting in future similar tasks
```

## Testing Best Practices

### Define Testing Requirements in Phase 0

In `docs/RULES.md`, specify:

```markdown
## Testing Requirements

### Coverage
- Minimum 80% code coverage
- 100% coverage for critical paths (auth, payments)

### Test Types
- Unit tests: Test individual functions/classes
- Integration tests: Test service interactions
- E2E tests: Test complete user flows

### Test Structure
- Use pytest framework
- One test file per module: `test_[module].py`
- Group related tests in classes
- Use descriptive test names: `test_[function]_[scenario]_[expected]`

### Mocking
- Mock external APIs
- Mock database in unit tests
- Use real database in integration tests
```

This gives AI clear guidance on testing expectations.

### Test Requirements, Not Implementation

**Bad test** (tests implementation):
```python
def test_login_uses_bcrypt():
    """Test that bcrypt is used for password hashing"""
    # This test breaks if we switch from bcrypt to argon2
```

**Good test** (tests requirement):
```python
def test_login_accepts_valid_credentials():
    """Test that valid username/password returns a token"""
    # This test works regardless of hashing algorithm
```

### Generate Test Data Consistently

Create fixtures or factories:

```python
## tests/fixtures.py
@pytest.fixture
def valid_user():
    return {
        "username": "testuser",
        "password": "TestPass123!",
        "email": "test@example.com"
    }

@pytest.fixture
def invalid_user():
    return {
        "username": "test",
        "password": "weak",  # Too weak
        "email": "invalid"   # Invalid email
    }
```

This ensures consistent test data across the project.

## Phase Transition Best Practices

### Don't Rush Phase 0

**Common mistake**: "Phase 0 is taking too long, let's start coding."

**Why this is wrong**:
- Incomplete docs → AI makes wrong assumptions
- Missing requirements → rework later
- Inadequate design → architectural problems

**Rule**: Phase 0 is done when:
- All four pillar documents are complete
- All service metadata is defined
- `validate_context.py` passes
- Stakeholders have approved
- You can generate reading lists for initial tasks

**Time investment**: Budget 10-20% of project time for Phase 0. This is not wasted time - it's preventive investment.

### Validate Before Phase Transitions

Before moving to the next phase:

```bash
## Check that all context is valid
python hub/tools/validate_context.py

## Regenerate graph to ensure it's current
python hub/tools/build_graph.py

## Review reading lists for key tasks
ls -la hub/meta/reading_lists/
```

### Document Phase Exit Criteria

In your project, create `PHASES.md`:

```markdown
## Phase Exit Criteria

## Phase 0 → Phase 1
- [ ] All four pillar documents exist
- [ ] All planned services have service.meta.yaml
- [ ] Hub validation passes
- [ ] Stakeholder approval obtained

## Phase 1 → Phase 2
- [ ] All requirements are specific and testable
- [ ] Priorities agreed upon
- [ ] Risk assessment complete

## Phase 2 → Phase 3
- [ ] All APIs fully specified
- [ ] All data models defined
- [ ] Reading lists generated for all tasks
- [ ] Technical review complete

## Phase 3 → Phase 4
- [ ] All features implemented
- [ ] Tests written and passing
- [ ] Code review complete
- [ ] Documentation updated

## Phase 4 → Phase 5
- [ ] All tests pass (unit, integration, E2E)
- [ ] No critical bugs
- [ ] Performance validated
- [ ] Security scan passes
- [ ] Stakeholder acceptance
```

This makes transitions explicit and measurable.

## Team Collaboration Best Practices

### Assign Document Ownership

**Example OWNERS file**:
```yaml
## docs/OWNERS
docs/VISION.md:
  - product_owner

docs/REQUIREMENTS.md:
  - business_analyst
  - product_owner

docs/DESIGN.md:
  - tech_lead
  - architect

docs/RULES.md:
  - tech_lead
  - team_lead
```

Clear ownership ensures documents stay current.

### Review Documentation Like Code

Use pull requests for documentation changes:

```bash
## Create branch for doc changes
git checkout -b docs/add-oauth-requirements

## Make changes
vim docs/REQUIREMENTS.md
vim docs/DESIGN.md
vim services/auth_service/service.meta.yaml

## Validate
python hub/tools/validate_context.py

## Commit and create PR
git add docs/ services/
git commit -m "Add OAuth integration requirements and design"
git push origin docs/add-oauth-requirements

## Create PR for review
```

**PR checklist for documentation**:
- [ ] All referenced documents exist
- [ ] Validation passes
- [ ] Reading lists regenerated if needed
- [ ] Stakeholders have reviewed
- [ ] Technical accuracy verified

### Communicate Phase Changes

When transitioning phases, notify the team:

**Example Slack message**:
```
🚀 Phase Transition: Phase 2 → Phase 3

We've completed documentation and are now moving to implementation.

✅ Completed:
- All APIs specified
- Data models defined
- Reading lists generated

📚 Resources:
- Design docs: /docs/DESIGN.md
- Reading lists: /hub/meta/reading_lists/

Next steps:
- Begin implementation using reading lists
- Follow task definitions in services/*/tasks/
- Update docs if we discover issues

Questions? Ask in #context-hive
```

## Common Pitfalls and How to Avoid Them

### Pitfall 1: Skipping Validation

**Symptom**: AI gets confused or references non-existent files

**Cause**: Broken references in documents

**Solution**: Run validation regularly
```bash
## Add to Git pre-commit hook
python hub/tools/validate_context.py || exit 1
```

### Pitfall 2: Outdated Dependency Graph

**Symptom**: Reading lists are incorrect or missing dependencies

**Cause**: Forgot to run `build_graph.py` after changes

**Solution**: Automate graph generation
```bash
## Add to Git pre-commit hook
python hub/tools/build_graph.py
git add hub/meta/graph.json
```

### Pitfall 3: Document Sprawl

**Symptom**: Hundreds of small documents, hard to navigate

**Cause**: Over-splitting documents

**Solution**: Balance granularity
- Aim for 1500-2000 tokens per document
- Don't split just to split
- Group related concepts

### Pitfall 4: Ignoring Token Estimates

**Symptom**: AI runs out of context or gets slow

**Cause**: Loading too much context

**Solution**: Monitor token usage
```yaml
## In service.meta.yaml, track estimates
tasks:
  implement_api:
    estimated_tokens: 5000  # Update this after changes
```

### Pitfall 5: Testing After Implementation

**Symptom**: Tests are superficial or don't match requirements

**Cause**: Tests written as an afterthought

**Solution**: Define test requirements in Phase 0
- Specify coverage requirements in docs/RULES.md
- Include test scenarios in requirements
- Have AI write tests alongside implementation

## Maintenance Best Practices

### Regular Context Audits

Monthly or quarterly, review:
- Are all documents still accurate?
- Are there broken references?
- Has the dependency graph grown too complex?
- Are token estimates still accurate?

```bash
## Audit script
python hub/tools/validate_context.py
python hub/tools/build_graph.py

## Check for large documents
find docs -name "*.md" -exec wc -w {} + | awk '$1 > 2000 {print}'

## Review reading lists
ls -lh hub/meta/reading_lists/
```

### Archive Obsolete Documents

Don't delete - archive:

```
docs/
├── active/         # Current documents
│   ├── vision.md
│   └── ...
└── archive/        # Historical documents
    └── 2024/
        └── old_design.md
```

Update references and regenerate graph after archiving.

### Keep Tooling Simple

Resist the urge to over-engineer Hub tools.

**Good**: Simple Python scripts that anyone can understand
**Bad**: Complex framework with plugins, hooks, and configuration DSL

**Principle**: If a team member can't understand and modify a tool in 5 minutes, it's too complex.

## Summary Checklist

Use this checklist for every Context Hive project:

**Phase 0**:
- [ ] All four pillar documents written
- [ ] Documents are under 2000 tokens each
- [ ] All services have service.meta.yaml
- [ ] Hub validation passes
- [ ] Reading lists can be generated

**During Development**:
- [ ] Update docs before code
- [ ] Run validation before phase transitions
- [ ] Use reading lists for complex tasks
- [ ] Review AI output systematically
- [ ] Keep dependency graph current

**Maintenance**:
- [ ] Regular context audits
- [ ] Archive obsolete documents
- [ ] Monitor token usage
- [ ] Keep tooling simple
- [ ] Document ownership assigned

Following these best practices will help you get the most out of Context Hive and enable productive AI collaboration.
