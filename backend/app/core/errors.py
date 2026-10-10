from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class AppError(Exception):
    """Base class for every error the app raises on purpose."""

    status = 400
    code = "error"

    def __init__(self, message: str = ""):
        super().__init__(message)
        self.message = message


class NotFound(AppError):
    status = 404
    code = "not_found"


class StoreNotFound(NotFound):
    code = "store_not_found"


class SlotFull(AppError):
    status = 409
    code = "slot_full"


class NotConfirmed(AppError):
    status = 422
    code = "not_confirmed"


class InvalidOtp(AppError):
    status = 401
    code = "invalid_otp"


class PaymentFailed(AppError):
    status = 402
    code = "payment_failed"


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def handle_app_error(request: Request, exc: AppError):
        return JSONResponse(
            status_code=exc.status,
            content={"error": exc.code, "message": exc.message},
        )
