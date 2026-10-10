from datetime import datetime, timezone

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(primary_key=True)
    store_id: Mapped[int] = mapped_column(Integer, index=True)
    crop: Mapped[str] = mapped_column(String(30))
    quintals: Mapped[int] = mapped_column(Integer)
    months: Mapped[int] = mapped_column(Integer)
    fee: Mapped[int] = mapped_column(Integer)  # total storage fee, rupees
    advance: Mapped[int] = mapped_column(Integer)  # 10% paid now to hold the slot
    status: Mapped[str] = mapped_column(String(12), default="booked")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )