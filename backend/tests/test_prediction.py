import pytest
from fastapi.testclient import TestClient

from app.main import app


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
