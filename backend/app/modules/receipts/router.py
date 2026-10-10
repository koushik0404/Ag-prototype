from fastapi import APIRouter

from app.core.deps import DbSession
from app.modules.receipts import service
from app.modules.receipts.schemas import ReceiptIn, ReceiptOut

router = APIRouter(prefix="/receipts", tags=["receipts"])


@router.post("", response_model=ReceiptOut)
def issue_receipt(body: ReceiptIn, db: DbSession):
    return service.issue_receipt(db, body.booking_id)


@router.get("/{receipt_id}", response_model=ReceiptOut)
def get_receipt(receipt_id: int, db: DbSession):
    return service.get_receipt(db, receipt_id)