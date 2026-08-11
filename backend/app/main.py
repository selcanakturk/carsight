from fastapi import FastAPI

from app.routes.prediction import router as prediction_router


app = FastAPI(title="CarSight API")
app.include_router(prediction_router)


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "carsight-api",
    }
