from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.errors import AppError, NotFound
from app.modules.bookings import get_booking
from app.modules.payments import repository
from app.modules.payments.models import Payment
from app.modules.payments.provider import get_provider


def pay_booking(db: Session, booking_id: int) -> Payment:
    if not settings.demo_mode:
        raise AppError("Real payments are not set up yet")

    # Paying twice for the same booking returns the same payment, never a second charge.
    existing = repository.get_by_booking(db, booking_id)
    if existing:
        return existing

    booking = get_booking(db, booking_id)  # raises NotFound if missing
    result = get_provider().charge(booking.advance, reference=f"booking-{booking.id}")
    payment = Payment(
        booking_id=booking.id,
        amount=booking.advance,
        status=result["status"],
        provider_ref=result["provider_ref"],
    )
    return repository.add(db, payment)


def get_payment(db: Session, payment_id: int) -> Payment:
    payment = repository.get_by_id(db, payment_id)
    if payment is None:
        raise NotFound("Payment not found")
    return payment