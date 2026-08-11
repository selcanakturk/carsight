from functools import lru_cache
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd

from app.schemas import CarPredictionRequest


PROJECT_ROOT = Path(__file__).resolve().parents[3]
MODEL_PATH = PROJECT_ROOT / "models" / "random_forest_model.pkl"


class PredictionService:
    def __init__(self, model_path: Path = MODEL_PATH) -> None:
        if not model_path.is_file():
            raise FileNotFoundError(f"Model artifact not found: {model_path}")

        self.model: Any = joblib.load(model_path)

        if not hasattr(self.model, "predict"):
            raise TypeError("Loaded model does not provide a predict method.")
        if not hasattr(self.model, "feature_names_in_"):
            raise TypeError("Loaded model does not contain its training feature names.")

        self.feature_columns = list(self.model.feature_names_in_)

    def prepare_input(self, car: CarPredictionRequest) -> pd.DataFrame:
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
        return input_encoded.reindex(
            columns=self.feature_columns,
            fill_value=False,
        )

    def predict(self, car: CarPredictionRequest) -> int:
        input_encoded = self.prepare_input(car)
        prediction = float(self.model.predict(input_encoded)[0])

        if not np.isfinite(prediction) or prediction < 0:
            raise ValueError("The model returned an invalid price prediction.")

        return round(prediction)


@lru_cache(maxsize=1)
def get_prediction_service() -> PredictionService:
    """Return the process-wide prediction service and load the model only once."""
    return PredictionService()
