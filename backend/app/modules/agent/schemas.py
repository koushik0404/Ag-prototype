from pydantic import BaseModel, Field


class ChatIn(BaseModel):
    session_id: str | None = None  # empty on the first message
    message: str = Field(min_length=1, max_length=1000)  # what the farmer said (from speech-to-text)


class ChatOut(BaseModel):
    session_id: str
    reply: str
    awaiting_confirmation: bool
    booking_id: int | None = None