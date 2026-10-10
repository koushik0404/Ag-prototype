"""Public interface of the stores module. Other modules import only from here."""
from app.modules.stores.service import get_store, reserve_space

__all__ = ["get_store", "reserve_space"]