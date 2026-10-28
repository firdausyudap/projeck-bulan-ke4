from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="Pajajaran Digital - Python Service",
    description="Layanan pendukung untuk pencarian dan pemrosesan metadata",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGIN", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "python-service"}


@app.get("/search/suggest")
def suggest(q: str = ""):
    """Placeholder endpoint for search suggestions."""
    return {"query": q, "suggestions": []}
