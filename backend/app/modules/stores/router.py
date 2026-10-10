from fastapi import APIRouter

from app.core.deps import DbSession
from app.modules.stores import service
from app.modules.stores.schemas import StoreOut

router = APIRouter(prefix="/stores", tags=["stores"])


@router.get("", response_model=list[StoreOut])
def list_stores(db: DbSession, kind: str | None = None, min_free: int | None = None):
    return service.search(db, kind, min_free)


@router.get("/{store_id}", response_model=StoreOut)
def get_store(store_id: int, db: DbSession):
    return service.get_store(db, store_id)