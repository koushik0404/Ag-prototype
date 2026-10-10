import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.main import app
from app.modules.stores import service


@pytest.fixture()
def client():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
    with Session() as db:
        service.seed_if_empty(db)

    def override_db():
        db = Session()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_db
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_lists_three_stores_cheapest_first(client):
    data = client.get("/api/stores").json()
    assert len(data) == 3
    assert data[0]["name"] == "Kisan Agri Godown"


def test_filter_cold_store(client):
    data = client.get("/api/stores", params={"kind": "cold_store"}).json()
    assert [s["town"] for s in data] == ["Guntur"]


def test_min_free_hides_full_stores(client):
    data = client.get("/api/stores", params={"min_free": 500}).json()
    assert len(data) == 2


def test_unknown_store_is_404(client):
    r = client.get("/api/stores/999")
    assert r.status_code == 404
    assert r.json()["error"] == "store_not_found"