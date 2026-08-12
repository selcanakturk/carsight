"""Model loading, preprocessing, and prediction services."""

from functools import lru_cache
from pathlib import Path
from typing import Any, Protocol

import joblib
import numpy as np
import pandas as pd

from app.schemas import CarPredictionRequest


PROJECT_ROOT = Path(__file__).resolve().parents[3]
MODEL_PATH = PROJECT_ROOT / "models" / "random_forest_model.pkl"


class PredictionModel(Protocol):
    """Minimal interface required from the serialized estimator."""

    feature_names_in_: Any

    def predict(self, input_data: pd.DataFrame) -> Any:
        """Return predictions for encoded input rows."""
        ...


class PredictionServiceError(RuntimeError):
    """Raised when the prediction service cannot produce a valid result."""


def load_prediction_model(model_path: Path) -> PredictionModel:
    """Load and validate a trusted serialized prediction model."""
    if not model_path.is_file():
        raise PredictionServiceError(f"Model artifact not found: {model_path}")

    try:
        model = joblib.load(model_path)
    except Exception as exc:
        raise PredictionServiceError("The model artifact could not be loaded.") from exc

    if not callable(getattr(model, "predict", None)):
        raise PredictionServiceError("Loaded model does not provide predict().")
    if not hasattr(model, "feature_names_in_"):
        raise PredictionServiceError(
            "Loaded model does not contain its training feature names."
        )

    return model


def prepare_input(
    car: CarPredictionRequest,
    feature_columns: list[str],
) -> pd.DataFrame:
    """Encode one validated request and align it with the training columns."""
    car_data = {
        "marka": car.marka,
        "yıl": car.yıl,
        "kilometre(Km)": car.kilometre_Km,
        "vitesTipi": car.vitesTipi,
        "yakitTuru": car.yakitTuru,
        "kasaTipi": car.kasaTipi,
    }

    input_df = pd.DataFrame([car_data])
    input_encoded = pd.get_dummies(input_df)
    return input_encoded.reindex(columns=feature_columns, fill_value=False)


def predict_price(
    car: CarPredictionRequest,
    model: PredictionModel,
    feature_columns: list[str],
) -> int:
    """Return a rounded, non-negative TRY price for one validated request."""
    input_encoded = prepare_input(car, feature_columns)

    try:
        prediction = float(model.predict(input_encoded)[0])
    except Exception as exc:
        raise PredictionServiceError("Model inference failed.") from exc

    if not np.isfinite(prediction) or prediction < 0:
        raise PredictionServiceError("The model returned an invalid prediction.")

    return round(prediction)


class PredictionService:
    """Reusable facade around the loaded model and its feature contract."""

    def __init__(self, model_path: Path = MODEL_PATH) -> None:
        """Load the model once for this service instance."""
        self.model = load_prediction_model(model_path)
        self.feature_columns = list(self.model.feature_names_in_)

    def prepare_input(self, car: CarPredictionRequest) -> pd.DataFrame:
        """Prepare a request using the model's encoded feature columns."""
        return prepare_input(car, self.feature_columns)

    def predict(self, car: CarPredictionRequest) -> int:
        """Predict a price for one validated request."""
        return predict_price(car, self.model, self.feature_columns)


@lru_cache(maxsize=1)
def get_prediction_service() -> PredictionService:
    """Return the process-wide service, loading the model only once."""
    return PredictionService()
