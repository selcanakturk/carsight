from datetime import date
from typing import Literal

from pydantic import BaseModel, Field, field_validator


class CarPredictionRequest(BaseModel):
    marka: str = Field(min_length=1)
    yıl: int = Field(ge=1900, le=date.today().year)
    kilometre_Km: int = Field(ge=0)
    vitesTipi: str = Field(min_length=1)
    yakitTuru: str = Field(min_length=1)
    kasaTipi: str = Field(min_length=1)

    @field_validator("marka", "vitesTipi", "yakitTuru", "kasaTipi")
    @classmethod
    def validate_non_empty_string(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("must not be empty")
        return value


class PredictionResponse(BaseModel):
    predicted_price: int
    currency: Literal["TRY"] = "TRY"
