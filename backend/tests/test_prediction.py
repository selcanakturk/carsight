import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services.prediction import PredictionServiceError, get_prediction_service


client = TestClient(app)

VALID_PAYLOAD = {
    "marka": "BMW",
    "yıl": 2020,
    "kilometre_Km": 80000,
    "vitesTipi": "Otomatik",
    "yakitTuru": "Dizel",
    "kasaTipi": "Sedan",
}


def test_successful_prediction_request() -> None:
    response = client.post("/api/predict", json=VALID_PAYLOAD)

    assert response.status_code == 200
    assert response.json()["predicted_price"] >= 0


def test_prediction_response_contains_price_and_currency() -> None:
    response = client.post("/api/predict", json=VALID_PAYLOAD)

    assert response.status_code == 200
    assert set(response.json()) == {"predicted_price", "currency"}
    assert isinstance(response.json()["predicted_price"], int)
    assert response.json()["currency"] == "TRY"


def test_negative_mileage_is_rejected() -> None:
    payload = {**VALID_PAYLOAD, "kilometre_Km": -1}

    response = client.post("/api/predict", json=payload)

    assert response.status_code == 422


@pytest.mark.parametrize("field", ["marka", "vitesTipi", "yakitTuru", "kasaTipi"])
def test_empty_required_string_is_rejected(field: str) -> None:
    payload = {**VALID_PAYLOAD, field: "   "}

    response = client.post("/api/predict", json=payload)

    assert response.status_code == 422


def test_missing_required_input_is_rejected() -> None:
    payload = {key: value for key, value in VALID_PAYLOAD.items() if key != "marka"}

    response = client.post("/api/predict", json=payload)

    assert response.status_code == 422


def test_future_model_year_is_rejected() -> None:
    payload = {**VALID_PAYLOAD, "yıl": 9999}

    response = client.post("/api/predict", json=payload)

    assert response.status_code == 422


def test_unexpected_input_is_rejected() -> None:
    payload = {**VALID_PAYLOAD, "unknown_field": "unexpected"}

    response = client.post("/api/predict", json=payload)

    assert response.status_code == 422


def test_prediction_service_failure_returns_safe_error() -> None:
    class UnavailablePredictionService:
        def predict(self, car: object) -> int:
            raise PredictionServiceError("Internal model details")

    app.dependency_overrides[get_prediction_service] = UnavailablePredictionService
    try:
        response = client.post("/api/predict", json=VALID_PAYLOAD)
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 503
    assert response.json() == {
        "detail": "Prediction service is temporarily unavailable."
    }
