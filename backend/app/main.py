from fastapi import FastAPI
from app.core.config import settings
from app.core.errors import register_error_handlers

app = FastAPI(title="Godam API", version="0.1.0")
register_error_handlers(app)


@app.get("/health")
def health():
    return {"status": "ok", "demo_mode": settings.demo_mode}
