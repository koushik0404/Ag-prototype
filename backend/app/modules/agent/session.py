from dataclasses import dataclass

from app.modules.agent.guardrails import is_no, is_yes


@dataclass
class AgentSession:
    """What one voice conversation remembers. Only this code can record the farmer's yes."""

    draft: dict | None = None
    awaiting_confirmation: bool = False
    confirmed: bool = False
    booking_id: int | None = None

    def set_draft(self, draft: dict) -> None:
        self.draft = draft
        self.awaiting_confirmation = True
        self.confirmed = False  # a changed order needs a fresh yes

    def hear(self, farmer_text: str) -> None:
        """Call this with what the farmer actually said (from speech-to-text)."""
        if not self.awaiting_confirmation:
            return
        if is_yes(farmer_text):
            self.confirmed = True
            self.awaiting_confirmation = False
        elif is_no(farmer_text):
            self.draft = None
            self.confirmed = False
            self.awaiting_confirmation = False

    def finish_booking(self, booking_id: int) -> None:
        self.booking_id = booking_id
        self.draft = None
        self.confirmed = False
        self.awaiting_confirmation = False