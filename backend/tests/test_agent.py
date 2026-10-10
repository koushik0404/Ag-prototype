import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import app.main  # noqa: F401  (makes sure every table is registered)
from app.core.database import Base
from app.modules.agent.guardrails import is_no, is_yes
from app.modules.agent.session import AgentSession
from app.modules.agent.tools import TOOL_SPECS, run_tool
from app.modules.stores import get_store
from app.modules.stores import service as stores_service


@pytest.fixture()
def db():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
    with Session() as db:
        stores_service.seed_if_empty(db)
        yield db


def order(**changes):
    data = {"store_id": 2, "crop": "Dry chilli", "quintals": 20, "months": 3}
    data.update(changes)
    return data


def test_yes_and_no_in_english_and_telugu():
    assert is_yes("yes") and is_yes("అవును") and is_yes("avunu") and is_yes("Okay, correct")
    assert not is_yes("no") and is_no("కాదు")
    assert is_no("not right") and not is_yes("not right")


def test_search_returns_only_stores_with_space_and_the_fee(db):
    result = run_tool(db, AgentSession(), "search_stores", {"quintals": 200, "months": 3})
    fees = {s["id"]: s["fee"] for s in result["stores"]}
    assert set(fees) == {1, 2}  # Kisan has only 120 quintals free
    assert fees[2] == 24 * 200 * 3


def test_prepare_gives_the_summary_and_waits_for_yes(db):
    s = AgentSession()
    result = run_tool(db, s, "prepare_booking", order())
    assert result["fee"] == 1440 and result["advance"] == 144
    assert s.awaiting_confirmation and not s.confirmed


def test_create_is_refused_without_the_farmers_yes(db):
    s = AgentSession()
    run_tool(db, s, "prepare_booking", order())
    result = run_tool(db, s, "create_booking", {})
    assert result["error"] == "not_confirmed"
    assert get_store(db, 2).free == 850  # no space was taken


def test_a_yes_before_any_order_does_nothing(db):
    s = AgentSession()
    s.hear("yes")
    assert not s.confirmed


def test_full_flow_books_after_yes(db):
    s = AgentSession()
    run_tool(db, s, "prepare_booking", order())
    s.hear("అవును")
    result = run_tool(db, s, "create_booking", {})
    assert result["advance"] == 144
    assert get_store(db, 2).free == 830
    assert s.booking_id == result["booking_id"] and not s.confirmed


def test_no_clears_the_draft(db):
    s = AgentSession()
    run_tool(db, s, "prepare_booking", order())
    s.hear("no")
    assert s.draft is None
    assert run_tool(db, s, "create_booking", {})["error"] == "not_confirmed"


def test_changing_the_order_removes_the_yes(db):
    s = AgentSession()
    run_tool(db, s, "prepare_booking", order())
    s.hear("yes")
    run_tool(db, s, "prepare_booking", order(quintals=30))
    assert not s.confirmed
    assert run_tool(db, s, "create_booking", {})["error"] == "not_confirmed"


def test_no_tool_can_pay_or_take_a_pin():
    for spec in TOOL_SPECS:
        assert "pay" not in spec["name"]
        for field in spec["input_schema"]["properties"]:
            assert "pin" not in field.lower() and "otp" not in field.lower()


def test_unknown_store_is_reported(db):
    result = run_tool(db, AgentSession(), "prepare_booking", order(store_id=999))
    assert result["error"] == "store_not_found"


def test_bad_months_is_reported(db):
    result = run_tool(db, AgentSession(), "prepare_booking", order(months=5))
    assert result["error"] == "invalid_request"