from fastapi import APIRouter, Depends

from app.schemas import CarPredictionRequest, PredictionResponse
from app.services.prediction import PredictionService, get_prediction_service


router = APIRouter(prefix="/api", tags=["prediction"])


@router.post("/predict", response_model=PredictionResponse)
def predict_price(
    car: CarPredictionRequest,
    service: PredictionService = Depends(get_prediction_service),
) -> PredictionResponse:
    """Estimate a vehicle's price from validated listing attributes."""
    predicted_price = service.predict(car)
    return PredictionResponse(predicted_price=predicted_price)
