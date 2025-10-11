"""Tests for Context Hive Minimal Example API.

These tests verify that the implementation matches the requirements
specified in docs/requirements.md.
"""

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_read_root():
    """Test root endpoint returns correct message.

    Verifies FR1 from docs/requirements.md:
    - Endpoint: GET /
    - Status: 200 OK
    - Response: {"message": "Hello from Context Hive minimal example"}
    """
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello from Context Hive minimal example"}


def test_health():
    """Test health check endpoint returns healthy status.

    Verifies FR2 from docs/requirements.md:
    - Endpoint: GET /health
    - Status: 200 OK
    - Response: {"status": "ok"}
    """
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_openapi_docs_available():
    """Test that automatic OpenAPI documentation is available.

    Verifies NFR3 from docs/requirements.md:
    - Auto-generated docs at /openapi.json
    """
    response = client.get("/openapi.json")
    assert response.status_code == 200
    openapi_spec = response.json()
    assert openapi_spec["info"]["title"] == "Context Hive Minimal Example"
    assert "/" in openapi_spec["paths"]
    assert "/health" in openapi_spec["paths"]
