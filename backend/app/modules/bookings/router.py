from fastapi import APIRouter

from app.core.deps import DbSession
from app.modules.bookings import service
from app.modules.bookings.schemas import BookingIn, BookingOut

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.post("", response_model=BookingOut, status_code=201)
def create_booking(body: BookingIn, db: DbSession):
    return service.create_booking(db, body)


@router.get("", response_model=list[BookingOut])
def list_bookings(db: DbSession):
    return service.list_bookings(db)


@router.get("/{booking_id}", response_model=BookingOut)
def get_booking(booking_id: int, db: DbSession):
    return service.get_booking(db, booking_id)