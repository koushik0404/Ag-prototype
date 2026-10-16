from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.core.errors import register_error_handlers
from app.modules.agent.router import router as agent_router
from app.modules.bookings.router import router as bookings_router
from app.modules.payments.router import router as payments_router
from app.modules.receipts.router import router as receipts_router
from app.modules.stores import service as stores_service
from app.modules.stores.router import router as stores_router
from app.modules.understand.router import router as understand_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        stores_service.seed_if_empty(db)
    yield


app = FastAPI(title="Godam API", version="0.1.0", lifespan=lifespan)
register_error_handlers(app)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(stores_router, prefix="/api")
app.include_router(bookings_router, prefix="/api")
app.include_router(receipts_router, prefix="/api")
app.include_router(payments_router, prefix="/api")
app.include_router(agent_router, prefix="/api")
app.include_router(understand_router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok", "demo_mode": settings.demo_mode}