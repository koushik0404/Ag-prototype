import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import settings
from app.core.database import Base, get_db
from app.main import app
from app.modules.stores import service as stores_service


@pytest.fixture()
def client():
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
    yield TestClient(app)
    app.dependency_overrides.clear()


def make_booking(client):
    r = client.post(
        "/api/bookings",
        json={"store_id": 2, "crop": "Dry chilli", "quintals": 20, "months": 3, "confirmed": True},
    )
    assert r.status_code == 201
    return r.json()["id"]


def test_payment_charges_the_advance(client):
    booking_id = make_booking(client)
    r = client.post("/api/payments", json={"booking_id": booking_id})
    assert r.status_code == 200
    data = r.json()
    assert data["amount"] == 144
    assert data["status"] == "success"
    assert data["provider_ref"].startswith("MOCK-")


def test_paying_twice_gives_the_same_payment(client):
    booking_id = make_booking(client)
    first = client.post("/api/payments", json={"booking_id": booking_id}).json()
    second = client.post("/api/payments", json={"booking_id": booking_id}).json()
    assert first["id"] == second["id"]


def test_a_pin_in_the_request_is_rejected(client):
    booking_id = make_booking(client)
    r = client.post("/api/payments", json={"booking_id": booking_id, "pin": "123456"})
    assert r.status_code == 422


def test_payment_for_unknown_booking_is_404(client):
    r = client.post("/api/payments", json={"booking_id": 999})
    assert r.status_code == 404
    assert r.json()["error"] == "not_found"


def test_real_payments_are_off_outside_demo_mode(client, monkeypatch):
    booking_id = make_booking(client)
    monkeypatch.setattr(settings, "demo_mode", False)
    r = client.post("/api/payments", json={"booking_id": booking_id})
    assert r.status_code == 400