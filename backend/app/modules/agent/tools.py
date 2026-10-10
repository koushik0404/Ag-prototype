"""The tools the agent may call. Note what is missing: no pay tool, and nothing takes a PIN."""
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.core.errors import AppError, NotConfirmed, SlotFull
from app.modules.agent.session import AgentSession
from app.modules.bookings import BookingIn, create_booking
from app.modules.stores import get_store, search

TOOL_SPECS = [
    {
        "name": "search_stores",
        "description": "Find registered stores with enough free space, with the storage fee for each.",
        "input_schema": {
            "type": "object",
            "properties": {
                "quintals": {"type": "integer"},
                "months": {"type": "integer", "enum": [2, 3, 6]},
                "kind": {"type": "string", "enum": ["warehouse", "cold_store"]},
            },
            "required": ["quintals", "months"],
        },
    },
    {
        "name": "prepare_booking",
        "description": (
            "Work out the fee for one order and save it as a draft. Does NOT book. "
            "Afterwards read the details back to the farmer and wait for his answer."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "store_id": {"type": "integer"},
                "crop": {"type": "string"},
                "quintals": {"type": "integer"},
                "months": {"type": "integer", "enum": [2, 3, 6]},
            },
            "required": ["store_id", "crop", "quintals", "months"],
        },
    },
    {
        "name": "create_booking",
        "description": (
            "Book the prepared order. Refused unless the farmer has said yes to the read-back. "
            "Takes no arguments."
        ),
        "input_schema": {"type": "object", "properties": {}},
    },
]


def run_tool(db: Session, session: AgentSession, name: str, args: dict) -> dict:
    """Runs one tool. Always returns a dict, so the agent can read errors and explain them."""
    try:
        if name == "search_stores":
            return _search(db, args)
        if name == "prepare_booking":
            return _prepare(db, session, args)
        if name == "create_booking":
            return _create(db, session)
        return {"error": "unknown_tool", "message": f"There is no tool called {name}"}
    except AppError as e:
        return {"error": e.code, "message": e.message}
    except (ValidationError, ValueError, TypeError, KeyError):
        return {"error": "invalid_request", "message": "Those details are not valid"}


def _search(db: Session, args: dict) -> dict:
    quintals, months = int(args["quintals"]), int(args["months"])
    if quintals <= 0 or months not in (2, 3, 6):
        raise ValueError("bad quantity or months")
    stores = search(db, kind=args.get("kind"), min_free=quintals)
    return {
        "stores": [
            {
                "id": s.id,
                "name": s.name,
                "town": s.town,
                "kind": s.kind,
                "rate": s.rate,
                "free": s.free,
                "fee": s.rate * quintals * months,
            }
            for s in stores
        ]
    }


def _prepare(db: Session, session: AgentSession, args: dict) -> dict:
    order = BookingIn(
        store_id=args.get("store_id"),
        crop=args.get("crop"),
        quintals=args.get("quintals"),
        months=args.get("months"),
    )
    store = get_store(db, order.store_id)
    if store.free < order.quintals:
        raise SlotFull("Not enough free space in this store")
    fee = store.rate * order.quintals * order.months
    session.set_draft(order.model_dump(exclude={"confirmed"}))
    return {
        "store_name": store.name,
        "town": store.town,
        "crop": order.crop,
        "quintals": order.quintals,
        "months": order.months,
        "fee": fee,
        "advance": round(fee * 0.1),
        "next_step": "Read these details back to the farmer in his language and wait for his answer. Do not book yet.",
    }


def _create(db: Session, session: AgentSession) -> dict:
    if not session.confirmed or session.draft is None:
        raise NotConfirmed("The farmer has not said yes to the read-back yet")
    booking = create_booking(db, BookingIn(**session.draft, confirmed=True))
    session.finish_booking(booking.id)
    return {
        "booking_id": booking.id,
        "fee": booking.fee,
        "advance": booking.advance,
        "next_step": "Tell the farmer to enter his UPI PIN on the phone screen himself. Never ask for the PIN or listen for it.",
    }