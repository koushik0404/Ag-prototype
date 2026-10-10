import json
import uuid

from google import genai
from google.genai import types
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


def _declarations() -> list[dict]:
    """Turns our tool list into Gemini's format. Gemini only allows enum on text, so number lists become a hint."""
    out = []
    for spec in TOOL_SPECS:
        schema = spec["input_schema"]
        decl = {"name": spec["name"], "description": spec["description"]}
        props = schema.get("properties", {})
        if props:  # Gemini refuses an empty parameter list
            clean = {}
            for key, prop in props.items():
                prop = dict(prop)
                if prop.get("type") == "integer" and "enum" in prop:
                    allowed = ", ".join(str(v) for v in prop.pop("enum"))
                    prop["description"] = f"One of: {allowed}"
                clean[key] = prop
            decl["parameters"] = {
                "type": "object",
                "properties": clean,
                "required": schema.get("required", []),
            }
        out.append(decl)
    return out


class Conversation:
    def __init__(self) -> None:
        self.session = AgentSession()
        self.messages: list = []


_conversations: dict[str, Conversation] = {}


def get_client():
    if not settings.gemini_api_key:
        raise AppError("The assistant is not set up yet: add GEMINI_API_KEY to .env")
    return genai.Client(api_key=settings.gemini_api_key)


def _plain(args) -> dict:
    """Gemini sends whole numbers as 3.0. Turn them back into 3."""
    return {k: int(v) if isinstance(v, float) and v.is_integer() else v for k, v in dict(args or {}).items()}


def chat(db: Session, session_id: str | None, text: str) -> ChatOut:
    client = get_client()
    session_id = session_id or uuid.uuid4().hex
    convo = _conversations.setdefault(session_id, Conversation())

    # Our own code reads the farmer's yes or no. The AI never sets it.
    convo.session.hear(text)
    convo.messages.append(types.Content(role="user", parts=[types.Part(text=text)]))

    config = types.GenerateContentConfig(
        system_instruction=SYSTEM_PROMPT,
        tools=[types.Tool(function_declarations=_declarations())],
        automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True),
    )

    reply = ""
    for _ in range(MAX_ROUNDS):
        response = client.models.generate_content(
            model=settings.agent_model,
            contents=convo.messages,
            config=config,
        )
        if not response.candidates or response.candidates[0].content is None:
            reply = "Sorry, I could not answer that. Please say it again."
            break
        content = response.candidates[0].content
        convo.messages.append(content)
        parts = content.parts or []
        reply = "".join(p.text for p in parts if p.text)
        calls = [p.function_call for p in parts if p.function_call]
        if not calls:
            break
        results = []
        for call in calls:
            output = run_tool(db, convo.session, call.name, _plain(call.args))
            results.append(
                types.Part.from_function_response(
                    name=call.name,
                    response={"result": json.loads(json.dumps(output, ensure_ascii=False))},
                )
            )
        convo.messages.append(types.Content(role="user", parts=results))

    return ChatOut(
        session_id=session_id,
        reply=reply,
        awaiting_confirmation=convo.session.awaiting_confirmation,
        booking_id=convo.session.booking_id,
    )