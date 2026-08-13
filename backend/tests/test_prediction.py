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
    "motorGucu_HP": "126 - 150 HP",
    "motorHacmi_Cc": "1401 - 1600 cm3",
    "cekisTipi": "Arkadan İtiş",
    "orjinal_parça_sayısı": 10,
    "lokal_boyalı_parça_sayısı": 1,
    "boyalı_parça_sayısı": 1,
    "değişen_parça_sayısı": 0,
}


def test_successful_v2_prediction_request() -> None:
    response = client.post("/api/predict", json=VALID_PAYLOAD)

    assert response.status_code == 200
    assert response.json()["predicted_price"] >= 0


def test_prediction_response_contains_integer_price_and_currency() -> None:
    response = client.post("/api/predict", json=VALID_PAYLOAD)

    assert response.status_code == 200
    assert set(response.json()) == {"predicted_price", "currency"}
    assert isinstance(response.json()["predicted_price"], int)
    assert response.json()["currency"] == "TRY"


def test_missing_new_required_field_is_rejected() -> None:
    payload = {key: value for key, value in VALID_PAYLOAD.items() if key != "motorGucu_HP"}

    response = client.post("/api/predict", json=payload)

    assert response.status_code == 422


def test_negative_mileage_is_rejected() -> None:
    response = client.post(
        "/api/predict",
        json={**VALID_PAYLOAD, "kilometre_Km": -1},
    )

    assert response.status_code == 422


@pytest.mark.parametrize(
    "field",
    [
        "orjinal_parça_sayısı",
        "lokal_boyalı_parça_sayısı",
        "boyalı_parça_sayısı",
        "değişen_parça_sayısı",
    ],
)
def test_negative_condition_part_count_is_rejected(field: str) -> None:
    response = client.post("/api/predict", json={**VALID_PAYLOAD, field: -1})

    assert response.status_code == 422


def test_impossible_condition_part_count_is_rejected() -> None:
    response = client.post(
        "/api/predict",
        json={**VALID_PAYLOAD, "boyalı_parça_sayısı": 14},
    )

    assert response.status_code == 422


@pytest.mark.parametrize(
    "field",
    [
        "marka",
        "vitesTipi",
        "yakitTuru",
        "kasaTipi",
        "motorGucu_HP",
        "motorHacmi_Cc",
        "cekisTipi",
    ],
)
def test_empty_required_string_is_rejected(field: str) -> None:
    response = client.post("/api/predict", json={**VALID_PAYLOAD, field: "   "})

    assert response.status_code == 422


def test_future_model_year_is_rejected() -> None:
    response = client.post("/api/predict", json={**VALID_PAYLOAD, "yıl": 9999})

    assert response.status_code == 422


def test_unexpected_input_is_rejected() -> None:
    response = client.post(
        "/api/predict",
        json={**VALID_PAYLOAD, "unknown_field": "unexpected"},
    )

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
