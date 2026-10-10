from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.core.errors import register_error_handlers
from app.modules.stores import service as stores_service
from app.modules.stores.router import router as stores_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        stores_service.seed_if_empty(db)
    yield


app = FastAPI(title="Godam API", version="0.1.0", lifespan=lifespan)
register_error_handlers(app)
app.include_router(stores_router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok", "demo_mode": settings.demo_mode}