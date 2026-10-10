import json
import uuid

from anthropic import Anthropic
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.errors import AppError
from app.modules.agent.schemas import ChatOut
from app.modules.agent.session import AgentSession
from app.modules.agent.tools import TOOL_SPECS, run_tool

SYSTEM_PROMPT = """You are Godam's voice assistant. You help a farmer in Andhra Pradesh find a storage \
room for his crop and book it.

Rules:
- Reply in the language the farmer speaks (Telugu or English). Keep sentences short and simple.
- Use search_stores to find stores, then prepare_booking for the one he picks.
- After prepare_booking, read back the store, crop, quintals, months, total fee and advance, \
and ask him to say yes or no. Never call create_booking before he has answered.
- You cannot pay. After booking, tell him to enter his UPI PIN on his phone himself. \
Never ask for his PIN or OTP, and tell him not to say it aloud.
- Only talk about storing crops. Do not offer loans or anything else."""

MAX_ROUNDS = 5


class Conversation:
    def __init__(self) -> None:
        self.session = AgentSession()
        self.messages: list[dict] = []


_conversations: dict[str, Conversation] = {}


def get_client() -> Anthropic:
    if not settings.anthropic_api_key:
        raise AppError("The assistant is not set up yet: add ANTHROPIC_API_KEY to .env")
    return Anthropic(api_key=settings.anthropic_api_key)


def chat(db: Session, session_id: str | None, text: str) -> ChatOut:
    client = get_client()
    session_id = session_id or uuid.uuid4().hex
    convo = _conversations.setdefault(session_id, Conversation())

    # Our own code reads the farmer's yes or no. The AI never sets it.
    convo.session.hear(text)
    convo.messages.append({"role": "user", "content": text})

    reply = ""
    for _ in range(MAX_ROUNDS):
        response = client.messages.create(
            model=settings.agent_model,
            max_tokens=1000,
            system=SYSTEM_PROMPT,
            tools=TOOL_SPECS,
            messages=convo.messages,
        )
        convo.messages.append({"role": "assistant", "content": response.content})
        reply = "".join(b.text for b in response.content if b.type == "text")
        if response.stop_reason != "tool_use":
            break
        results = []
        for block in response.content:
            if block.type == "tool_use":
                output = run_tool(db, convo.session, block.name, block.input)
                results.append(
                    {
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": json.dumps(output, ensure_ascii=False),
                    }
                )
        convo.messages.append({"role": "user", "content": results})

    return ChatOut(
        session_id=session_id,
        reply=reply,
        awaiting_confirmation=convo.session.awaiting_confirmation,
        booking_id=convo.session.booking_id,
    )