from fastapi import APIRouter
from pydantic import BaseModel

from app.understand import understand_booking

router = APIRouter(prefix="/understand", tags=["understand"])


class UnderstandIn(BaseModel):
    text: str


@router.post("/booking")
def understand_booking_endpoint(body: UnderstandIn):
    return understand_booking(body.text)