# Design: Sample Service

## Architecture Overview

The Sample Service is a minimal REST API built with FastAPI demonstrating Context Hive methodology. It follows a simple, stateless architecture with no external dependencies.

### System Context

```
┌─────────────┐
│   Client    │
│ (Browser/   │
│  curl/etc)  │
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────────────────┐
│   Sample Service        │
│   (FastAPI + Uvicorn)   │
│                         │
│   - Root endpoint (/)   │
│   - Health endpoint     │
│   - API docs            │
└─────────────────────────┘
```

### Key Design Decisions

1. **Stateless**: No database, no sessions, pure REST API
2. **Minimal**: Only essential endpoints to demonstrate structure
3. **Self-documenting**: OpenAPI spec auto-generated
4. **Production-ready patterns**: Proper error handling, logging, health checks

## Components

### Application Structure

```
services/sample_service/
├── app/
│   └── main.py          # FastAPI application
├── tests/
│   ├── __init__.py
│   ├── test_main.py     # API tests
│   └── conftest.py      # pytest fixtures
├── service.meta.yaml    # Hub metadata
└── README.md            # Service documentation
```

### main.py (FastAPI Application)

**Responsibilities**:
- Define FastAPI application instance
- Register API endpoints
- Configure CORS and middleware
- Set up logging

**Key classes/functions**:
```python
app = FastAPI(title="Sample Service")

@app.get("/")
def read_root() -> dict

@app.get("/health")
def health() -> dict
```

## Data Models

### Response Models

**RootResponse**:
```python
{
  "message": str  # Service status message
}
```

**HealthResponse**:
```python
{
  "status": "ok" | "degraded"  # Health status
}
```

**ErrorResponse**:
```python
{
  "error": str,         # Error message
  "timestamp": str,     # ISO8601 timestamp
  "request_id": str     # UUID for tracing
}
```

## API Contracts

### GET /

**Description**: Returns service information

**Request**: None

**Response** (200 OK):
```json
{
  "message": "Sample Service is running"
}
```

**Error Responses**: None (always returns 200)

### GET /health

**Description**: Health check for monitoring

**Request**: None

**Response** (200 OK):
```json
{
  "status": "ok"
}
```

**Response** (503 Service Unavailable):
```json
{
  "status": "degraded",
  "reason": "description of issue"
}
```

### GET /docs

**Description**: Interactive API documentation (Swagger UI)

**Request**: None

**Response**: HTML page with interactive docs

### GET /redoc

**Description**: Alternative API documentation (ReDoc)

**Request**: None

**Response**: HTML page with documentation

## Error Handling

### Error Response Format

All errors return JSON with consistent structure:

```json
{
  "error": "Human-readable error message",
  "timestamp": "2025-10-11T10:30:00Z",
  "request_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### HTTP Status Codes

- **200 OK**: Successful request
- **404 Not Found**: Endpoint doesn't exist
- **500 Internal Server Error**: Unexpected server error
- **503 Service Unavailable**: Service is unhealthy

### Error Handling Strategy

1. Catch all exceptions at application level
2. Log full error details (including stack trace) server-side
3. Return sanitized error message to client (no stack traces)
4. Include request_id for correlation between logs and responses

## Security Considerations

### Authentication

**Current**: None (this is a sample service)

**Production Recommendation**: Add API key or JWT authentication

### CORS (Cross-Origin Resource Sharing)

**Development**: Allow all origins (`["*"]`)

**Production**: Configure specific allowed origins via environment variable

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

### Security Headers

**Recommended headers**:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### Input Validation

- FastAPI automatically validates request schemas
- Path parameters validated by Pydantic
- No user input in this minimal service (only GET endpoints)

## Scalability Considerations

### Horizontal Scaling

**Strategy**: Stateless design enables easy horizontal scaling

**Load Balancing**: Place multiple instances behind load balancer (nginx, ALB, etc.)

**Session Management**: N/A (no sessions)

### Performance Optimization

1. **Async/Await**: Use FastAPI's async capabilities for I/O operations
2. **Connection Pooling**: Not needed (no database)
3. **Caching**: Not needed (no expensive computations)
4. **Rate Limiting**: Add if needed (e.g., using slowapi)

### Resource Limits

- **Memory**: Target < 128MB per instance
- **CPU**: Single core sufficient for 100 req/s
- **Connections**: Uvicorn default (auto-calculated)

## Deployment Architecture

### Development Environment

```
Developer Machine
├── Python 3.9+
├── Virtual Environment
│   └── pip install -r requirements.txt
└── uvicorn app.main:app --reload
```

**Access**: http://localhost:8000

### Production Environment (Example)

```
┌─────────────────────────────────┐
│         Load Balancer           │
│         (nginx/ALB)             │
│       - HTTPS termination       │
│       - Health checks           │
└────────────┬────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼───┐         ┌───▼───┐
│ App 1 │         │ App 2 │
│ Port  │         │ Port  │
│ 8000  │         │ 8001  │
└───────┘         └───────┘
```

**Process Manager**: systemd or supervisor

**Monitoring**: Health endpoint polled by monitoring system

### Configuration Management

**Environment Variables**:
```bash
export PORT=8000
export HOST=0.0.0.0
export LOG_LEVEL=INFO
export CORS_ORIGINS=https://example.com,https://app.example.com
```

**Configuration File** (.env):
```
PORT=8000
HOST=0.0.0.0
LOG_LEVEL=INFO
CORS_ORIGINS=*
```

## Logging Strategy

### Log Format

**Structure**: JSON (for easy parsing)

**Fields**:
- `timestamp`: ISO8601
- `level`: DEBUG|INFO|WARNING|ERROR
- `message`: Log message
- `request_id`: UUID (for request correlation)
- `path`: Request path
- `method`: HTTP method
- `status_code`: Response status
- `duration_ms`: Request duration

**Example**:
```json
{
  "timestamp": "2025-10-11T10:30:00Z",
  "level": "INFO",
  "message": "Request completed",
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "path": "/health",
  "method": "GET",
  "status_code": 200,
  "duration_ms": 5
}
```

### Log Levels

- **DEBUG**: Detailed diagnostic information
- **INFO**: General informational messages
- **WARNING**: Warning messages for recoverable issues
- **ERROR**: Error messages for failures

### What to Log

**DO log**:
- All requests (path, method, status, duration)
- Application startup/shutdown
- Errors and exceptions
- Health check results

**DON'T log**:
- Passwords or secrets
- Personal identifiable information (PII)
- Full request/response bodies (unless debugging)

## Testing Strategy

### Test Pyramid

```
      ┌─────────────┐
      │   E2E (5%)  │
      ├─────────────┤
      │Integration  │
      │   (20%)     │
      ├─────────────┤
      │    Unit     │
      │   (75%)     │
      └─────────────┘
```

### Unit Tests

**Target**: Individual functions in isolation

**Tools**: pytest

**Coverage**: ≥80%

**Example**:
```python
def test_read_root_returns_message():
    """Test root endpoint returns correct message"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Sample Service is running"}
```

### Integration Tests

**Target**: API endpoints end-to-end

**Tools**: FastAPI TestClient + pytest

**Coverage**: All endpoints, all status codes

**Example**:
```python
def test_health_endpoint_returns_ok():
    """Test health endpoint returns ok status"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
```

### Test Organization

```
tests/
├── __init__.py
├── conftest.py          # pytest fixtures
├── test_main.py         # API endpoint tests
└── test_models.py       # Data model tests (if any)
```

## Monitoring and Observability

### Health Checks

**Endpoint**: GET /health

**Check Frequency**: Every 30 seconds

**Timeout**: 5 seconds

**Success Criteria**: 200 response with `{"status": "ok"}`

### Metrics to Monitor

**Application Metrics**:
- Request rate (req/s)
- Response time (p50, p95, p99)
- Error rate (%)
- 4xx rate (client errors)
- 5xx rate (server errors)

**System Metrics**:
- CPU usage (%)
- Memory usage (MB)
- Active connections
- Thread count

### Alerting Rules

**Critical Alerts**:
- Service down (health check fails)
- Error rate > 5%
- Response time p95 > 1s

**Warning Alerts**:
- Error rate > 1%
- Response time p95 > 500ms
- Memory usage > 100MB

## Technology Stack Rationale

### FastAPI

**Why**:
- Fast (async/await support)
- Auto-generated OpenAPI docs
- Type hints for validation
- Excellent developer experience

**Alternatives Considered**:
- Flask: Simpler but no async, manual docs
- Django: Too heavy for minimal API

### Uvicorn

**Why**:
- ASGI server (required for FastAPI)
- Production-ready
- Good performance

**Alternatives Considered**:
- Gunicorn + Uvicorn workers: Better for production, overkill for sample

### pytest

**Why**:
- Industry standard for Python testing
- Rich fixture system
- Excellent plugins (pytest-cov)

**Alternatives Considered**:
- unittest: Built-in but more verbose

## Future Enhancements (Out of Scope)

If this were a real service, consider:

1. **Authentication**: Add JWT or API key auth
2. **Rate Limiting**: Prevent abuse
3. **Caching**: Add Redis for expensive operations
4. **Database**: Add PostgreSQL for data persistence
5. **Message Queue**: Add async processing with Celery
6. **Containerization**: Docker + Docker Compose
7. **CI/CD**: GitHub Actions for testing and deployment
8. **Observability**: Add Prometheus metrics, OpenTelemetry tracing

## References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Uvicorn Documentation](https://www.uvicorn.org/)
- [pytest Documentation](https://docs.pytest.org/)
- [REST API Best Practices](https://restfulapi.net/)
