"""Public interface of the bookings module. Other modules import only from here."""
from app.modules.bookings.service import get_booking

__all__ = ["get_booking"]