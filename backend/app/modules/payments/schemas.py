from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PaymentIn(BaseModel):
    # extra="forbid": if anyone sends a "pin" field, the request is rejected.
    model_config = ConfigDict(extra="forbid")

    booking_id: int


class PaymentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    booking_id: int
    amount: int
    status: str
    provider_ref: str
    created_at: datetime