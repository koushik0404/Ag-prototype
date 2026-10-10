from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ReceiptIn(BaseModel):
    booking_id: int


class ReceiptOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    number: str
    booking_id: int
    store_name: str
    town: str
    crop: str
    quintals: int
    grade: str
    insured_per_tonne: int
    advance: int
    status: str
    issued_at: datetime