from datetime import datetime, timezone

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Receipt(Base):
    __tablename__ = "receipts"

    id: Mapped[int] = mapped_column(primary_key=True)
    number: Mapped[str] = mapped_column(String(20), default="")
    booking_id: Mapped[int] = mapped_column(Integer, unique=True, index=True)
    # A copy of the details at the time of booking, so the receipt never changes.
    store_name: Mapped[str] = mapped_column(String(120))
    town: Mapped[str] = mapped_column(String(60))
    crop: Mapped[str] = mapped_column(String(30))
    quintals: Mapped[int] = mapped_column(Integer)
    grade: Mapped[str] = mapped_column(String(2), default="A")
    insured_per_tonne: Mapped[int] = mapped_column(Integer)
    advance: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String(12), default="active")
    issued_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )