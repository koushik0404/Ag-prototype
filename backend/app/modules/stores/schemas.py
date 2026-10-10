from pydantic import BaseModel, ConfigDict


class StoreOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    town: str
    kind: str
    lat: float
    lon: float
    rate: int
    capacity: int
    free: int
    insured_per_tonne: int
    registered: bool