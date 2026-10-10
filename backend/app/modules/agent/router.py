from fastapi import APIRouter

from app.core.deps import DbSession
from app.modules.agent import service
from app.modules.agent.schemas import ChatIn, ChatOut

router = APIRouter(prefix="/agent", tags=["agent"])


@router.post("/chat", response_model=ChatOut)
def chat(body: ChatIn, db: DbSession):
    return service.chat(db, body.session_id, body.message)