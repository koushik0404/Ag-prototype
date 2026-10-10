from sqlalchemy.orm import Session

from app.core.errors import NotFound
from app.modules.bookings import get_booking
from app.modules.receipts import repository
from app.modules.receipts.models import Receipt
from app.modules.stores import get_store


def issue_receipt(db: Session, booking_id: int) -> Receipt:
    # Asking twice for the same booking returns the same receipt, never a second one.
    existing = repository.get_by_booking(db, booking_id)
    if existing:
        return existing

    booking = get_booking(db, booking_id)  # raises NotFound if missing
    store = get_store(db, booking.store_id)
    receipt = Receipt(
        booking_id=booking.id,
        store_name=store.name,
        town=store.town,
        crop=booking.crop,
        quintals=booking.quintals,
        insured_per_tonne=store.insured_per_tonne,
        advance=booking.advance,
    )
    return repository.add(db, receipt)


def get_receipt(db: Session, receipt_id: int) -> Receipt:
    receipt = repository.get_by_id(db, receipt_id)
    if receipt is None:
        raise NotFound("Receipt not found")
    return receipt