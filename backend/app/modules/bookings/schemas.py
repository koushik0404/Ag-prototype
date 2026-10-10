from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class BookingIn(BaseModel):
    store_id: int
    crop: str
    quintals: int = Field(gt=0, le=5000)
    months: Literal[2, 3, 6]
    confirmed: bool = False  # must be true: the farmer said yes to the read-back


class BookingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    store_id: int
    crop: str
    quintals: int
    months: int
    fee: int
    advance: int
    status: str
    created_at: datetime