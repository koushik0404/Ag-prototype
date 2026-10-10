from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.core.database import SessionLocal
from app.core.errors import SlotFull, register_error_handlers


def test_error_handler_returns_code():
    app = FastAPI()
    register_error_handlers(app)

    @app.get("/boom")
    def boom():
        raise SlotFull("Store is full")

    r = TestClient(app).get("/boom")
    assert r.status_code == 409
    assert r.json()["error"] == "slot_full"


def test_database_session_opens():
    db = SessionLocal()
    db.close()
