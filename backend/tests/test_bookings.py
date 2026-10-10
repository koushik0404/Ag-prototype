import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.main import app
from app.modules.stores import service as stores_service

VIJAYA = 2  # rate 24, 850 quintals free
KISAN = 3   # rate 19, 120 quintals free


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


def body(**changes):
    data = {"store_id": VIJAYA, "crop": "Dry chilli", "quintals": 20, "months": 3, "confirmed": True}
    data.update(changes)
    return data


def test_booking_without_confirmation_is_refused(client):
    r = client.post("/api/bookings", json=body(confirmed=False))
    assert r.status_code == 422
    assert r.json()["error"] == "not_confirmed"
    assert client.get("/api/bookings").json() == []
    assert client.get(f"/api/stores/{VIJAYA}").json()["free"] == 850  # no space was taken


def test_confirmed_booking_works_and_takes_space(client):
    r = client.post("/api/bookings", json=body())
    assert r.status_code == 201
    data = r.json()
    assert data["fee"] == 24 * 20 * 3
    assert data["advance"] == 144
    assert client.get(f"/api/stores/{VIJAYA}").json()["free"] == 830


def test_full_store_is_refused(client):
    r = client.post("/api/bookings", json=body(store_id=KISAN, quintals=200))
    assert r.status_code == 409
    assert r.json()["error"] == "slot_full"


def test_unknown_store_is_404(client):
    r = client.post("/api/bookings", json=body(store_id=999))
    assert r.status_code == 404
    assert r.json()["error"] == "store_not_found"


def test_bad_months_is_rejected(client):
    r = client.post("/api/bookings", json=body(months=5))
    assert r.status_code == 422