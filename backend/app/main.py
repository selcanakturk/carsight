import os

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routes.prediction import router as prediction_router
from app.services.prediction import PredictionServiceError


DEFAULT_FRONTEND_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173"


def get_frontend_origins() -> list[str]:
    """Return normalized, explicitly allowed frontend origins."""
    configured_origins = os.getenv("FRONTEND_ORIGINS", DEFAULT_FRONTEND_ORIGINS)
    return [origin.strip().rstrip("/") for origin in configured_origins.split(",") if origin.strip()]


app = FastAPI(title="CarSight API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_frontend_origins(),
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)
app.include_router(prediction_router)


@app.exception_handler(PredictionServiceError)
def handle_prediction_service_error(
    request: Request,
    exc: PredictionServiceError,
) -> JSONResponse:
    """Return a stable response when model loading or inference fails."""
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"detail": "Prediction service is temporarily unavailable."},
    )


@app.get("/health")
def health() -> dict[str, str]:
    """Report whether the API process is running."""
    return {
        "status": "ok",
        "service": "carsight-api",
    }
