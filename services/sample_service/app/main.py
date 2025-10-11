"""Sample Service - FastAPI Implementation

This service demonstrates Context Hive methodology with production-ready patterns:
- CORS configuration
- Structured error responses with request IDs
- Health checks with degraded state support
- Structured JSON logging
- Request tracking
"""

import logging
import os
import uuid
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json

# Configure structured logging
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format='%(message)s'
)
logger = logging.getLogger(__name__)


class StructuredLogger:
    """Structured JSON logger for requests and errors"""

    @staticmethod
    def log_request(request_id: str, method: str, path: str, status_code: int, duration_ms: float):
        """Log request with structured format"""
        log_data = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": "INFO",
            "message": "Request completed",
            "request_id": request_id,
            "method": method,
            "path": path,
            "status_code": status_code,
            "duration_ms": round(duration_ms, 2)
        }
        logger.info(json.dumps(log_data))

    @staticmethod
    def log_error(request_id: str, error: str, path: str):
        """Log error with structured format"""
        log_data = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": "ERROR",
            "message": "Request failed",
            "request_id": request_id,
            "error": error,
            "path": path
        }
        logger.error(json.dumps(log_data))


# Initialize FastAPI application
app = FastAPI(
    title="Sample Service",
    description="A minimal service demonstrating Context Hive methodology",
    version="1.0.0"
)

# Configure CORS
cors_origins = os.getenv("CORS_ORIGINS", "*")
allowed_origins = cors_origins.split(",") if cors_origins != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


# Middleware for request tracking and logging
@app.middleware("http")
async def track_requests(request: Request, call_next):
    """Track requests with unique IDs and log structured data"""
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id

    # Record start time
    start_time = datetime.utcnow()

    try:
        response = await call_next(request)

        # Calculate duration
        duration = (datetime.utcnow() - start_time).total_seconds() * 1000

        # Log successful request
        StructuredLogger.log_request(
            request_id=request_id,
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            duration_ms=duration
        )

        # Add request ID to response headers
        response.headers["X-Request-ID"] = request_id

        return response

    except Exception as e:
        # Log error
        StructuredLogger.log_error(
            request_id=request_id,
            error=str(e),
            path=request.url.path
        )

        # Return structured error response
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "Internal server error",
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "request_id": request_id
            }
        )


# Service health state (can be modified for testing degraded state)
_service_healthy = True


def set_service_health(healthy: bool):
    """Set service health state (for testing)"""
    global _service_healthy
    _service_healthy = healthy


@app.get("/")
def read_root():
    """
    Root endpoint returning service information.

    Returns:
        dict: Service status message
    """
    return {"message": "Sample Service is running"}


@app.get("/health")
def health():
    """
    Health check endpoint for monitoring.

    Returns 200 OK when service is healthy, 503 when degraded.

    Returns:
        dict: Health status (ok or degraded)
    """
    if _service_healthy:
        return {"status": "ok"}
    else:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "degraded",
                "reason": "Service is experiencing issues"
            }
        )


@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    """Handle 404 errors with structured response"""
    request_id = getattr(request.state, "request_id", str(uuid.uuid4()))

    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={
            "error": "Resource not found",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "request_id": request_id
        }
    )


@app.exception_handler(500)
async def internal_error_handler(request: Request, exc):
    """Handle 500 errors with structured response"""
    request_id = getattr(request.state, "request_id", str(uuid.uuid4()))

    # Log error
    StructuredLogger.log_error(
        request_id=request_id,
        error=str(exc),
        path=request.url.path
    )

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal server error",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "request_id": request_id
        }
    )


# Startup event
@app.on_event("startup")
async def startup_event():
    """Log application startup"""
    log_data = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "level": "INFO",
        "message": "Sample Service started",
        "cors_origins": allowed_origins
    }
    logger.info(json.dumps(log_data))


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Log application shutdown"""
    log_data = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "level": "INFO",
        "message": "Sample Service shutting down"
    }
    logger.info(json.dumps(log_data))
