"""Context Hive Minimal Example - FastAPI Application.

This minimal API demonstrates Context Hive methodology:
documentation-driven development with AI as a team member from Day 0.

See docs/ directory for complete Context Hive documentation:
- docs/vision.md - Why we built this
- docs/requirements.md - What it must do
- docs/design.md - How it's structured
- docs/rules.md - Coding standards
"""

from fastapi import FastAPI

app = FastAPI(
    title="Context Hive Minimal Example",
    description="A minimal API demonstrating Context Hive methodology",
    version="1.0.0",
)


@app.get("/")
def read_root():
    """Root endpoint - confirms API is running.

    Returns:
        dict: Welcome message

    Example:
        >>> GET /
        {"message": "Hello from Context Hive minimal example"}
    """
    return {"message": "Hello from Context Hive minimal example"}


@app.get("/health")
def health():
    """Health check endpoint for monitoring and deployment.

    Returns:
        dict: Health status

    Example:
        >>> GET /health
        {"status": "ok"}
    """
    return {"status": "ok"}
