from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.receipts.models import Receipt


def get_by_id(db: Session, receipt_id: int) -> Receipt | None:
    return db.get(Receipt, receipt_id)


def get_by_booking(db: Session, booking_id: int) -> Receipt | None:
    return db.scalar(select(Receipt).where(Receipt.booking_id == booking_id))


def add(db: Session, receipt: Receipt) -> Receipt:
    db.add(receipt)
    db.flush()  # gives the receipt its id, which the number is built from
    receipt.number = f"GDM-{datetime.now(timezone.utc).year}-{receipt.id:04d}"
    db.commit()
    db.refresh(receipt)
    return receipt