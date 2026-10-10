from sqlalchemy.orm import Session

from app.core.errors import StoreNotFound
from app.modules.stores import repository
from app.modules.stores.models import Store


def _sample_stores() -> list[Store]:
    return [
        Store(name="Sri Lakshmi Cold Storage", town="Guntur", kind="cold_store",
              lat=16.3067, lon=80.4365, rate=38, capacity=5000, free=2400, insured_per_tonne=80000),
        Store(name="Vijaya Warehousing Corp", town="Tenali", kind="warehouse",
              lat=16.2430, lon=80.6400, rate=24, capacity=3000, free=850, insured_per_tonne=60000),
        Store(name="Kisan Agri Godown", town="Mangalagiri", kind="warehouse",
              lat=16.4307, lon=80.5525, rate=19, capacity=2000, free=120, insured_per_tonne=50000),
    ]


def seed_if_empty(db: Session) -> None:
    if repository.count(db) == 0:
        repository.add_many(db, _sample_stores())


def search(db: Session, kind: str | None = None, min_free: int | None = None) -> list[Store]:
    return repository.list_stores(db, kind, min_free)


def get_store(db: Session, store_id: int) -> Store:
    store = repository.get_by_id(db, store_id)
    if store is None:
        raise StoreNotFound("Store not found")
    return store