from fastapi import APIRouter

from app.core.deps import DbSession
from app.modules.payments import service
from app.modules.payments.schemas import PaymentIn, PaymentOut

router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("", response_model=PaymentOut)
def pay(body: PaymentIn, db: DbSession):
    return service.pay_booking(db, body.booking_id)


@router.get("/{payment_id}", response_model=PaymentOut)
def get_payment(payment_id: int, db: DbSession):
    return service.get_payment(db, payment_id)