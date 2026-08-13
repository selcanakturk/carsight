"""Production v2 model loading and prediction services."""

from functools import lru_cache
from pathlib import Path
import sys
from typing import Any, Protocol

import joblib
import numpy as np
import pandas as pd

from app.schemas import CarPredictionRequest


PROJECT_ROOT = Path(__file__).resolve().parents[3]
MODEL_PATH = PROJECT_ROOT / "models" / "random_forest_model.pkl"
EXPECTED_MODEL_COLUMNS = [
    "marka",
    "yıl",
    "kilometre(Km)",
    "vitesTipi",
    "yakitTuru",
    "kasaTipi",
    "motorGucu(HP)",
    "motorHacmi(Cc)",
    "cekisTipi",
    "orjinal_parça_sayısı",
    "lokal_boyalı_parça_sayısı",
    "boyalı_parça_sayısı",
    "değişen_parça_sayısı",
]


class PredictionModel(Protocol):
    """Minimal interface required from the fitted v2 Pipeline."""

    feature_names_in_: Any

    def predict(self, input_data: pd.DataFrame) -> Any:
        """Return predictions for raw input rows."""
        ...


class PredictionServiceError(RuntimeError):
    """Raised when the prediction service cannot produce a valid result."""


def load_prediction_model(model_path: Path) -> PredictionModel:
    """Load and validate the trusted production v2 Pipeline artifact."""
    if not model_path.is_file():
        raise PredictionServiceError(f"Model artifact not found: {model_path}")

    # The fitted Pipeline contains the project-owned ml.transformers class.
    project_root = str(PROJECT_ROOT)
    if project_root not in sys.path:
        sys.path.insert(0, project_root)

    try:
        model = joblib.load(model_path)
    except Exception as exc:
        raise PredictionServiceError("The model artifact could not be loaded.") from exc

    if not callable(getattr(model, "predict", None)):
        raise PredictionServiceError("Loaded model does not provide predict().")
    if not hasattr(model, "named_steps") or "preprocessor" not in model.named_steps:
        raise PredictionServiceError("Loaded artifact is not the v2 preprocessing Pipeline.")

    model_columns = list(getattr(model, "feature_names_in_", []))
    if model_columns != EXPECTED_MODEL_COLUMNS:
        raise PredictionServiceError("The model input schema does not match API v2.")

    return model


def prepare_input(car: CarPredictionRequest) -> pd.DataFrame:
    """Map one validated API request to the Pipeline's raw training schema."""
    return pd.DataFrame(
        [
            {
                "marka": car.marka,
                "yıl": car.yıl,
                "kilometre(Km)": car.kilometre_Km,
                "vitesTipi": car.vitesTipi,
                "yakitTuru": car.yakitTuru,
                "kasaTipi": car.kasaTipi,
                "motorGucu(HP)": car.motorGucu_HP,
                "motorHacmi(Cc)": car.motorHacmi_Cc,
                "cekisTipi": car.cekisTipi,
                "orjinal_parça_sayısı": car.orjinal_parça_sayısı,
                "lokal_boyalı_parça_sayısı": car.lokal_boyalı_parça_sayısı,
                "boyalı_parça_sayısı": car.boyalı_parça_sayısı,
                "değişen_parça_sayısı": car.değişen_parça_sayısı,
            }
        ],
        columns=EXPECTED_MODEL_COLUMNS,
    )


def predict_price(car: CarPredictionRequest, model: PredictionModel) -> int:
    """Run raw input through the fitted v2 Pipeline and return a valid TRY price."""
    raw_input = prepare_input(car)

    try:
        prediction = float(model.predict(raw_input)[0])
    except Exception as exc:
        raise PredictionServiceError("Model inference failed.") from exc

    if not np.isfinite(prediction) or prediction < 0:
        raise PredictionServiceError("The model returned an invalid prediction.")

    return round(prediction)


class PredictionService:
    """Reusable facade around the cached production v2 Pipeline."""

    def __init__(self, model_path: Path = MODEL_PATH) -> None:
        """Load and retain one Pipeline for this service instance."""
        self.model = load_prediction_model(model_path)

    def prepare_input(self, car: CarPredictionRequest) -> pd.DataFrame:
        """Map an API request to one raw model input row."""
        return prepare_input(car)

    def predict(self, car: CarPredictionRequest) -> int:
        """Predict a price using the fitted preprocessing and model Pipeline."""
        return predict_price(car, self.model)


@lru_cache(maxsize=1)
def get_prediction_service() -> PredictionService:
    """Return the process-wide service, loading the Pipeline only once."""
    return PredictionService()
