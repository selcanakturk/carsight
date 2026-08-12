from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

from app.routes.prediction import router as prediction_router
from app.services.prediction import PredictionServiceError


app = FastAPI(title="CarSight API")
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
