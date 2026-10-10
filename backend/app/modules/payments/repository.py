from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.payments.models import Payment


def get_by_id(db: Session, payment_id: int) -> Payment | None:
    return db.get(Payment, payment_id)


def get_by_booking(db: Session, booking_id: int) -> Payment | None:
    return db.scalar(select(Payment).where(Payment.booking_id == booking_id))


def add(db: Session, payment: Payment) -> Payment:
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment