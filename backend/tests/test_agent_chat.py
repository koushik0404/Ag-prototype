from types import SimpleNamespace as NS

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import settings
from app.core.database import Base, get_db
from app.main import app
from app.modules.agent import service as agent_service
from app.modules.stores import service as stores_service


class FakeClaude:
    """Plays back a fixed list of replies instead of calling the real API."""

    def __init__(self, replies):
        self.replies = list(replies)
        self.messages = self

    def create(self, **kwargs):
        return self.replies.pop(0)


def says(t):
    return NS(stop_reason="end_turn", content=[NS(type="text", text=t)])


def calls(name, args, call_id="t1"):
    return NS(stop_reason="tool_use", content=[NS(type="tool_use", id=call_id, name=name, input=args)])


ORDER = {"store_id": 2, "crop": "Dry chilli", "quintals": 20, "months": 3}


@pytest.fixture()
def client(monkeypatch):
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
    with Session() as db:
        stores_service.seed_if_empty(db)

    def override_db():
        db = Session()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_db
    agent_service._conversations.clear()
    yield TestClient(app), monkeypatch
    app.dependency_overrides.clear()


def use_fake(monkeypatch, replies):
    monkeypatch.setattr(agent_service, "get_client", lambda: FakeClaude(replies))


def test_full_conversation_books_after_the_farmers_yes(client):
    http, mp = client
    use_fake(mp, [calls("prepare_booking", ORDER), says("20 quintals, fee 1440. Is that right?")])
    r1 = http.post("/api/agent/chat", json={"message": "Store 20 quintals of chilli for 3 months"})
    assert r1.status_code == 200
    first = r1.json()
    assert first["awaiting_confirmation"] is True and first["booking_id"] is None

    use_fake(mp, [calls("create_booking", {}), says("Booked. Enter your PIN on the phone.")])
    r2 = http.post("/api/agent/chat", json={"session_id": first["session_id"], "message": "yes"})
    second = r2.json()
    assert second["booking_id"] is not None
    assert http.get("/api/stores/2").json()["free"] == 830


def test_claude_cannot_book_without_the_farmers_yes(client):
    http, mp = client
    use_fake(mp, [calls("prepare_booking", ORDER), says("Is that right?")])
    sid = http.post("/api/agent/chat", json={"message": "book it"}).json()["session_id"]

    # Claude tries to book on its own, but the farmer said something else.
    use_fake(mp, [calls("create_booking", {}), says("Sorry, I need your yes first.")])
    r = http.post("/api/agent/chat", json={"session_id": sid, "message": "how much is the advance?"})
    assert r.json()["booking_id"] is None
    assert http.get("/api/stores/2").json()["free"] == 850


def test_missing_api_key_gives_a_clear_error(client, monkeypatch):
    http, _ = client
    monkeypatch.setattr(settings, "anthropic_api_key", "")
    r = http.post("/api/agent/chat", json={"message": "hello"})
    assert r.status_code == 400