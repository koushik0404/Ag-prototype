from sqlalchemy.orm import Session

from app.core.errors import NotFound, NotConfirmed
from app.modules.bookings import repository
from app.modules.bookings.models import Booking
from app.modules.bookings.schemas import BookingIn
from app.modules.stores import get_store, reserve_space


def create_booking(db: Session, data: BookingIn) -> Booking:
    # The confirm gate: no hold, no booking, unless the farmer said yes to the read-back.
    if not data.confirmed:
        raise NotConfirmed("The farmer must confirm the details first")

    store = get_store(db, data.store_id)  # raises StoreNotFound if missing
    fee = store.rate * data.quintals * data.months
    advance = round(fee * 0.1)

    reserve_space(db, data.store_id, data.quintals)  # raises SlotFull if not enough space
    booking = Booking(
        store_id=data.store_id,
        crop=data.crop,
        quintals=data.quintals,
        months=data.months,
        fee=fee,
        advance=advance,
    )
    return repository.add(db, booking)


def get_booking(db: Session, booking_id: int) -> Booking:
    booking = repository.get_by_id(db, booking_id)
    if booking is None:
        raise NotFound("Booking not found")
    return booking


def list_bookings(db: Session) -> list[Booking]:
    return repository.list_all(db)