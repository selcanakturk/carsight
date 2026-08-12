from datetime import date
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class CarPredictionRequest(BaseModel):
    """Validated raw vehicle attributes accepted by the prediction API."""

    model_config = ConfigDict(extra="forbid")

    marka: str = Field(min_length=1, description="Vehicle brand.")
    yıl: int = Field(
        ge=1900,
        le=date.today().year,
        description="Vehicle model year.",
    )
    kilometre_Km: int = Field(ge=0, description="Vehicle mileage in kilometres.")
    vitesTipi: str = Field(min_length=1, description="Transmission type.")
    yakitTuru: str = Field(min_length=1, description="Fuel type.")
    kasaTipi: str = Field(min_length=1, description="Vehicle body type.")

    @field_validator("marka", "vitesTipi", "yakitTuru", "kasaTipi")
    @classmethod
    def validate_non_empty_string(cls, value: str) -> str:
        """Trim text input and reject values containing only whitespace."""
        value = value.strip()
        if not value:
            raise ValueError("must not be empty")
        return value


class PredictionResponse(BaseModel):
    """Price prediction returned to an API client."""

    predicted_price: int = Field(ge=0, description="Estimated price in TRY.")
    currency: Literal["TRY"] = "TRY"
