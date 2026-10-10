from fastapi import FastAPI
from app.core.config import settings

app = FastAPI(title="Godam API", version="0.1.0")


@app.get("/health")
def health():
    return {"status": "ok", "demo_mode": settings.demo_mode}
