from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.bookings.models import Booking


def add(db: Session, booking: Booking) -> Booking:
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


def get_by_id(db: Session, booking_id: int) -> Booking | None:
    return db.get(Booking, booking_id)


def list_all(db: Session) -> list[Booking]:
    return list(db.scalars(select(Booking).order_by(Booking.id.desc())))