import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

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


def test_receipt_copies_booking_and_store_details(client):
    booking_id = make_booking(client)
    r = client.post("/api/receipts", json={"booking_id": booking_id})
    assert r.status_code == 200
    data = r.json()
    assert data["store_name"] == "Vijaya Warehousing Corp"
    assert data["quintals"] == 20
    assert data["advance"] == 144
    assert data["number"].startswith("GDM-") and data["number"].endswith("-0001")


def test_same_booking_gets_the_same_receipt(client):
    booking_id = make_booking(client)
    first = client.post("/api/receipts", json={"booking_id": booking_id}).json()
    second = client.post("/api/receipts", json={"booking_id": booking_id}).json()
    assert first["id"] == second["id"]


def test_get_receipt_by_id(client):
    booking_id = make_booking(client)
    rid = client.post("/api/receipts", json={"booking_id": booking_id}).json()["id"]
    assert client.get(f"/api/receipts/{rid}").json()["booking_id"] == booking_id


def test_receipt_for_unknown_booking_is_404(client):
    r = client.post("/api/receipts", json={"booking_id": 999})
    assert r.status_code == 404
    assert r.json()["error"] == "not_found"