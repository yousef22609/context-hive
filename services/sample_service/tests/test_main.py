"""Tests for sample_service API endpoints"""

import pytest
from fastapi.testclient import TestClient


def test_read_root_returns_200(client):
    """Test root endpoint returns 200 status code"""
    response = client.get("/")
    assert response.status_code == 200


def test_read_root_returns_message(client):
    """Test root endpoint returns correct message"""
    response = client.get("/")
    data = response.json()
    assert "message" in data
    assert data["message"] == "Sample Service is running"


def test_health_returns_200(client):
    """Test health endpoint returns 200 status code"""
    response = client.get("/health")
    assert response.status_code == 200


def test_health_returns_ok_status(client):
    """Test health endpoint returns ok status"""
    response = client.get("/health")
    data = response.json()
    assert "status" in data
    assert data["status"] == "ok"


def test_health_response_format(client):
    """Test health endpoint returns correct JSON structure"""
    response = client.get("/health")
    assert response.headers["content-type"] == "application/json"
    data = response.json()
    assert isinstance(data, dict)


def test_root_response_format(client):
    """Test root endpoint returns correct JSON structure"""
    response = client.get("/")
    assert response.headers["content-type"] == "application/json"
    data = response.json()
    assert isinstance(data, dict)


def test_nonexistent_endpoint_returns_404(client):
    """Test that requesting a non-existent endpoint returns 404"""
    response = client.get("/nonexistent")
    assert response.status_code == 404


def test_docs_endpoint_accessible(client):
    """Test that API documentation is accessible"""
    response = client.get("/docs")
    assert response.status_code == 200


def test_redoc_endpoint_accessible(client):
    """Test that ReDoc documentation is accessible"""
    response = client.get("/redoc")
    assert response.status_code == 200
