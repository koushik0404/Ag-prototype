from sqlalchemy import Boolean, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Store(Base):
    __tablename__ = "stores"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    town: Mapped[str] = mapped_column(String(60), index=True)
    kind: Mapped[str] = mapped_column(String(12), index=True)  # "warehouse" or "cold_store"
    lat: Mapped[float] = mapped_column(Float)
    lon: Mapped[float] = mapped_column(Float)
    rate: Mapped[int] = mapped_column(Integer)  # rupees per quintal per month
    capacity: Mapped[int] = mapped_column(Integer)  # quintals
    free: Mapped[int] = mapped_column(Integer)  # quintals still free
    insured_per_tonne: Mapped[int] = mapped_column(Integer)  # rupees
    registered: Mapped[bool] = mapped_column(Boolean, default=True)
    