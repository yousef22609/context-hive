# Sample Service

A minimal FastAPI service demonstrating Context Hive methodology and structure.

## Purpose

This service demonstrates:
- Context Hive service structure (app/, tests/, tasks/, service.meta.yaml)
- Hub integration with dependency tracking
- Four-pillar documentation approach (vision, requirements, design, rules)
- Test-driven development with ≥80% coverage goal
- Production-ready patterns including:
  - CORS configuration (environment-based)
  - Structured error responses with request IDs and timestamps
  - Health checks with degraded state support (200 OK / 503 Service Unavailable)
  - Structured JSON logging for all requests
  - Request tracking with unique UUIDs

## Structure

```
services/sample_service/
├── app/
│   └── main.py              # FastAPI application
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # pytest fixtures
│   └── test_main.py         # API tests
├── tasks/
│   └── implement_api.yaml   # Task definitions
├── service.meta.yaml        # Hub metadata
└── README.md                # This file
```

## Quick Start

### Prerequisites

- Python 3.9 or higher
- pip

### Installation

```bash
# From the repository root
cd services/sample_service

# Install dependencies
pip install -r ../../requirements.txt
```

### Running the Service

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The service will be available at:
- API: http://localhost:8000/
- Health check: http://localhost:8000/health
- API docs (Swagger): http://localhost:8000/docs
- API docs (ReDoc): http://localhost:8000/redoc

### Running Tests

```bash
# Run tests with coverage
pytest tests/ --cov=app --cov-report=term-missing

# Run tests in verbose mode
pytest tests/ -v

# Run specific test file
pytest tests/test_main.py
```

## API Endpoints

### GET /

Returns service status message.

**Response** (200 OK):
```json
{
  "message": "Sample Service is running"
}
```

### GET /health

Health check endpoint for monitoring.

**Response** (200 OK):
```json
{
  "status": "ok"
}
```

## Context Hive Integration

This service is fully integrated with Context Hive Hub:

### Dependencies

As defined in `service.meta.yaml`, this service depends on:
- `docs/vision.md` - Project vision
- `docs/requirements.md` - Functional requirements
- `docs/design.md` - Technical design
- `docs/rules.md` - Development standards

### Tasks

Defined tasks for AI-driven development:
- `implement_api`: Implement REST API endpoints

### Generating Reading Lists

```bash
# From repository root
python hub/tools/gen_reading_list.py sample_service implement_api
```

This generates an optimized reading list at:
`hub/meta/reading_lists/sample_service/implement_api.md`

## Development Workflow

### 1. Update Documentation First

Before making changes:
```bash
# Update relevant docs (vision, requirements, design, rules)
vim docs/requirements.md

# Validate context
python hub/tools/validate_context.py

# Regenerate dependency graph
python hub/tools/build_graph.py
```

### 2. Implement Changes

```bash
# Edit code
vim app/main.py

# Run tests
pytest tests/
```

### 3. Verify

```bash
# Check coverage
pytest tests/ --cov=app --cov-report=term-missing

# Ensure ≥80% coverage
```

## Configuration

Environment variables:
- `PORT`: Port to run on (default: 8000)
- `HOST`: Host to bind to (default: 0.0.0.0)
- `LOG_LEVEL`: Logging level (default: INFO)
- `CORS_ORIGINS`: Allowed CORS origins (default: *)

Example `.env` file:
```
PORT=8000
HOST=0.0.0.0
LOG_LEVEL=INFO
CORS_ORIGINS=*
```

## Testing Guidelines

Tests follow Context Hive best practices:

- **File naming**: `test_*.py`
- **Test naming**: `test_[function]_[scenario]_[expected]`
- **Coverage target**: ≥80%
- **Test organization**: One test file per module

Example test:
```python
def test_health_returns_ok_status(client):
    """Test health endpoint returns ok status"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
```

## Troubleshooting

### Import Errors

If you get `ModuleNotFoundError: No module named 'app'`:
```bash
# Run from services/sample_service/ directory
cd services/sample_service
uvicorn app.main:app --reload
```

### Test Failures

If tests fail with import errors:
```bash
# Install test dependencies
pip install pytest pytest-cov httpx

# Run from services/sample_service/ directory
pytest tests/
```

## Template Usage

Use this service as a template for new services:

```bash
# Copy structure
cp -r services/sample_service services/my_service

# Update service.meta.yaml
vim services/my_service/service.meta.yaml

# Update app/main.py with your logic
vim services/my_service/app/main.py

# Regenerate Hub metadata
python hub/tools/build_graph.py
```

## References

- [Context Hive Documentation](../../docs/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [pytest Documentation](https://docs.pytest.org/)
