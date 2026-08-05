from fastapi import FastAPI


app = FastAPI(title="CarSight API")


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "carsight-api",
    }
