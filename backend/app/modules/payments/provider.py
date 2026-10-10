import secrets
from typing import Protocol


class PaymentProvider(Protocol):
    def charge(self, amount: int, reference: str) -> dict:
        """Takes the money. The UPI PIN is entered on the phone and never reaches this code."""
        ...


class MockUpiProvider:
    def charge(self, amount: int, reference: str) -> dict:
        return {"status": "success", "provider_ref": "MOCK-" + secrets.token_hex(4).upper()}


def get_provider() -> PaymentProvider:
    return MockUpiProvider()