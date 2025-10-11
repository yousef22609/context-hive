# Rules: Development Standards and Guidelines

This document defines the development standards, conventions, and constraints for Context Hive projects.

## Documentation Standards

### Document Structure

**All documents must**:
- Start with a single H1 title
- Use H2 for main sections, H3 for subsections
- Stay under 2000 tokens (~1500 words) per file
- Include clear section headers
- Use relative links to other documents

**Example structure**:
```markdown
# Document Title

## Section 1
Content...

### Subsection 1.1
Content...

## Section 2
Content...
```

### Writing Style

**Be clear and specific**:
- Use active voice
- Write in present tense
- Avoid jargon unless defined
- Include examples for complex concepts
- Use bullet points for lists

**Bad**: "The system might handle requests in various ways depending on configuration."
**Good**: "The system handles requests using these methods: 1) Synchronous HTTP, 2) Async message queue."

### Document Maintenance

**Update documents BEFORE code**:
1. Identify what needs to change
2. Update relevant documents (vision, requirements, design, rules)
3. Run `python hub/tools/validate_context.py`
4. Regenerate graph: `python hub/tools/build_graph.py`
5. Then implement code changes

**Document ownership**:
- Each document must have an owner (specified in OWNERS file)
- Changes require review from document owner
- Breaking changes require team consensus

## Code Standards

### General Principles

1. **Readability over cleverness**: Code is read 10x more than written
2. **Explicit over implicit**: No magic, clear intent
3. **Simple over complex**: Solve problems with simplest solution
4. **Tested over trusted**: If it's not tested, it's broken

### Python Code (Hub Tools)

**Style**:
- Follow PEP 8
- Use type hints for function signatures
- Maximum line length: 100 characters
- Use meaningful variable names (no single letters except in loops)

**Structure**:
```python
"""
Module docstring explaining purpose.
"""

import standard_library
import third_party
import local_modules


def function_name(param: str) -> bool:
    """
    Function docstring with:
    - Purpose
    - Parameters
    - Return value
    """
    # Implementation
    return True
```

**Error handling**:
```python
# Good: Explicit error handling
try:
    with open(file_path) as f:
        data = json.load(f)
except FileNotFoundError:
    print(f"❌ File not found: {file_path}")
    return False
except json.JSONDecodeError:
    print(f"❌ Invalid JSON: {file_path}")
    return False

# Bad: Bare except
try:
    data = json.load(open(file_path))
except:
    pass
```

### Service Implementation Code

**Language-agnostic principles**:
- One file per class/module
- Maximum function length: 50 lines
- Maximum file length: 500 lines
- Cyclomatic complexity: <10 per function

**API endpoints**:
```python
# Good: Clear, documented endpoint
@app.post("/api/auth/login")
def login(credentials: LoginRequest) -> LoginResponse:
    """
    Authenticate user and return JWT token.

    Args:
        credentials: Username and password

    Returns:
        JWT token and expiry

    Raises:
        401: Invalid credentials
        400: Malformed request
    """
    # Implementation
```

**Error responses**:
- Use standard HTTP status codes
- Include error message and error code
- Never expose stack traces in production
- Log detailed errors server-side

### Service Structure

**Mandatory directories**:
```
services/[service_name]/
├── README.md                 # Service overview
├── service.meta.yaml         # Metadata for Hub
├── app/                      # Implementation
│   ├── __init__.py
│   ├── main.py              # Entry point
│   ├── models.py            # Data models
│   ├── routes.py            # API routes
│   └── utils.py             # Utilities
├── tasks/                    # Task definitions
│   └── *.yaml
└── tests/                    # Test suite
    ├── __init__.py
    ├── test_*.py
    └── fixtures/
```

## Testing Requirements

### Coverage Requirements

**Minimum coverage**:
- Overall: 80% line coverage
- Critical paths (auth, payments, data loss): 100%
- New features: 90%
- Bug fixes: Include regression test

**Coverage reports**:
- Run coverage on every PR
- Block merge if coverage drops
- Review uncovered lines in code review

### Test Types

**1. Unit Tests**
- Test individual functions/classes in isolation
- Mock external dependencies
- Fast execution (<1ms per test)
- No database, no network, no file I/O

```python
# Good unit test
def test_validate_email_format():
    """Test email validation accepts valid formats"""
    assert validate_email("user@example.com") is True
    assert validate_email("invalid") is False
    assert validate_email("") is False
```

**2. Integration Tests**
- Test interactions between components
- Use test database
- Mock external APIs only
- Run in isolated environment

```python
# Good integration test
def test_create_user_stores_in_database(test_db):
    """Test user creation persists to database"""
    user_service = UserService(test_db)
    user = user_service.create_user("test@example.com", "password")

    retrieved = test_db.get_user(user.id)
    assert retrieved.email == "test@example.com"
```

**3. End-to-End Tests**
- Test complete user flows
- Use staging environment
- No mocking
- Run before deployment

```python
# Good E2E test
def test_complete_login_flow(api_client):
    """Test user can register, login, and access protected resource"""
    # Register
    response = api_client.post("/register", json={
        "email": "test@example.com",
        "password": "SecurePass123!"
    })
    assert response.status_code == 201

    # Login
    response = api_client.post("/login", json={
        "email": "test@example.com",
        "password": "SecurePass123!"
    })
    assert response.status_code == 200
    token = response.json()["token"]

    # Access protected resource
    response = api_client.get(
        "/api/protected",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
```

### Test Organization

**File naming**:
- `test_*.py` for test files
- Match source file names: `routes.py` → `test_routes.py`

**Test naming**:
- `test_[function]_[scenario]_[expected]`
- Examples:
  - `test_login_valid_credentials_returns_token`
  - `test_login_invalid_password_returns_401`
  - `test_login_missing_fields_returns_400`

**Test structure**:
```python
def test_function_scenario_expected():
    """Human-readable description of what's being tested"""
    # Arrange: Set up test data
    user = User(email="test@example.com")

    # Act: Perform the operation
    result = authenticate(user, "password")

    # Assert: Verify the outcome
    assert result.success is True
    assert result.token is not None
```

### Fixtures and Mocks

**Use pytest fixtures**:
```python
@pytest.fixture
def valid_user():
    """Fixture for a valid user object"""
    return User(
        id=1,
        email="test@example.com",
        is_active=True
    )

def test_authentication_with_valid_user(valid_user):
    result = authenticate(valid_user, "password")
    assert result.success is True
```

**Mock external dependencies**:
```python
def test_fetch_user_profile(mocker):
    """Test user profile fetching mocks external API"""
    mock_api = mocker.patch('app.external_api.fetch_profile')
    mock_api.return_value = {"name": "Test User"}

    profile = get_user_profile(user_id=1)
    assert profile["name"] == "Test User"
    mock_api.assert_called_once_with(1)
```

## Security Guidelines

### Authentication & Authorization

**Requirements**:
- Use industry-standard protocols (OAuth 2.0, JWT)
- Never store passwords in plain text (use bcrypt/argon2)
- Implement rate limiting on auth endpoints
- Use HTTPS only (no HTTP in production)
- Implement session timeout (15-30 minutes idle)

**Password requirements**:
- Minimum 8 characters
- At least 1 uppercase, 1 lowercase, 1 number
- No common passwords (check against known lists)
- No password hints or security questions

### Input Validation

**Always validate**:
- Type (string, int, email, etc.)
- Length (min/max)
- Format (regex for patterns)
- Range (for numbers)
- Allowed values (enums)

**Sanitize inputs**:
- Escape HTML/SQL
- Strip dangerous characters
- Validate file uploads (type, size, content)

### Secrets Management

**Never commit secrets**:
- Use environment variables
- Use secret management services (AWS Secrets Manager, etc.)
- Add secrets to `.gitignore`
- Rotate secrets regularly

**In code**:
```python
# Good
import os
api_key = os.environ.get("API_KEY")

# Bad
api_key = "sk-1234567890abcdef"
```

### Data Protection

**Sensitive data**:
- Encrypt at rest
- Encrypt in transit (TLS 1.3)
- Minimize data collection
- Implement data retention policies
- Provide data export/deletion (GDPR compliance)

**Logging**:
- Never log passwords, tokens, or PII
- Sanitize logs before storage
- Implement log rotation
- Restrict log access

## Performance Requirements

### Response Times

**API endpoints**:
- Simple queries: <100ms (p95)
- Complex queries: <500ms (p95)
- Batch operations: <2s (p95)

**Database queries**:
- Use indexes for all WHERE/JOIN clauses
- Limit result sets (pagination)
- Use connection pooling
- Monitor slow queries (>100ms)

### Resource Limits

**Memory**:
- Service maximum: 512MB per instance
- Request maximum: 10MB
- File upload maximum: 50MB

**CPU**:
- No operations blocking event loop >10ms
- Use async/await for I/O operations
- Offload heavy computation to background jobs

### Caching

**Cache when**:
- Data changes infrequently
- Read/write ratio > 10:1
- Computation is expensive

**Cache strategy**:
```python
# Good: Cache with TTL
@cache(ttl=300)  # 5 minutes
def get_user_profile(user_id: int):
    return db.query(User).filter(User.id == user_id).first()

# Bad: Cache without invalidation
@cache()
def get_user_profile(user_id: int):
    return db.query(User).filter(User.id == user_id).first()
```

## Code Review Requirements

### Pre-Review Checklist

Before requesting review:
- [ ] All tests pass locally
- [ ] Coverage meets requirements (80%+)
- [ ] Code follows style guide
- [ ] Documentation updated (if needed)
- [ ] No commented-out code
- [ ] No debug print statements
- [ ] Secrets removed
- [ ] Hub validation passes

### Review Process

**All changes require**:
- At least 1 approving review
- All CI checks passing
- No merge conflicts
- Updated documentation

**Reviewers must check**:
- Code correctness
- Test coverage
- Security implications
- Performance impact
- Documentation accuracy

**Review turnaround**:
- Small PRs (<100 lines): 24 hours
- Medium PRs (100-500 lines): 48 hours
- Large PRs (>500 lines): Split into smaller PRs

## Git Workflow

### Branch Naming

**Convention**:
- `feature/short-description` - New features
- `fix/short-description` - Bug fixes
- `docs/short-description` - Documentation changes
- `refactor/short-description` - Code refactoring

### Commit Messages

**Format**:
```
<type>: <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Test additions/changes
- `refactor`: Code refactoring
- `chore`: Maintenance tasks

**Example**:
```
feat: Add user authentication endpoint

Implement POST /api/auth/login endpoint with JWT token generation.
Includes rate limiting (5 attempts per minute) and password validation.

Closes #123
```

### Commit Guidelines

- One logical change per commit
- Write clear, descriptive messages
- Reference issue numbers
- Keep commits small (<500 lines)

## Deployment Standards

### Environment Separation

**Required environments**:
- Development (local)
- Staging (pre-production)
- Production

**Configuration**:
- Environment-specific config files
- Never share secrets between environments
- Test deployments in staging first

### Deployment Process

**Steps**:
1. Merge to main branch
2. CI/CD runs all tests
3. Build Docker image (if applicable)
4. Deploy to staging
5. Run smoke tests
6. Manual approval required
7. Deploy to production
8. Monitor metrics for 30 minutes

**Rollback plan**:
- Keep previous version ready
- Rollback in <5 minutes if issues
- Post-mortem for production incidents

### Monitoring

**Required metrics**:
- Request rate
- Error rate
- Response time (p50, p95, p99)
- CPU/memory usage
- Database connections

**Alerting**:
- Error rate >1%: Warning
- Error rate >5%: Critical
- Response time >1s (p95): Warning
- Service down: Critical

## Documentation Requirements

### Service README

**Must include**:
- Service purpose
- Dependencies
- Setup instructions
- API documentation (or link)
- Testing instructions
- Deployment process

### API Documentation

**For each endpoint**:
- Method and path
- Description
- Authentication requirements
- Request schema (with example)
- Response schema (with example)
- Error responses
- Rate limits

### Code Comments

**When to comment**:
- Complex algorithms (explain why, not what)
- Non-obvious business logic
- Workarounds for bugs/limitations
- TODO items with ticket reference

**When NOT to comment**:
- Obvious code (don't state what's clear)
- Redundant docstrings
- Outdated comments (remove them!)

## Exception Process

### When Rules Can Be Broken

Rules can be relaxed for:
- Prototypes and spikes
- Emergency hotfixes (with follow-up)
- Experimental features (clearly marked)

**Process**:
1. Document reason in PR
2. Get explicit approval from tech lead
3. Create follow-up ticket to address
4. Add TODO comment in code

### Adding New Rules

**Process**:
1. Propose rule in team discussion
2. Document rationale
3. Get team consensus
4. Update this document
5. Communicate to team
6. Grace period for adoption (2 weeks)

## Summary

These rules exist to:
- Maintain code quality
- Enable AI collaboration
- Ensure security and performance
- Make codebase maintainable

When in doubt, ask: "Does this make the codebase better for humans AND AI?"
