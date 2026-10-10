from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.stores.models import Store


def list_stores(db: Session, kind: str | None = None, min_free: int | None = None) -> list[Store]:
    query = select(Store).where(Store.registered.is_(True))
    if kind:
        query = query.where(Store.kind == kind)
    if min_free:
        query = query.where(Store.free >= min_free)
    return list(db.scalars(query.order_by(Store.rate)))


def get_by_id(db: Session, store_id: int) -> Store | None:
    return db.get(Store, store_id)


def count(db: Session) -> int:
    return len(list(db.scalars(select(Store.id))))


def add_many(db: Session, stores: list[Store]) -> None:
    db.add_all(stores)
    db.commit()