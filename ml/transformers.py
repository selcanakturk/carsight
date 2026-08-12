"""Custom, inference-safe transformers used by CarSight pipelines."""

import re
from typing import Any

import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin


class EngineValueTransformer(TransformerMixin, BaseEstimator):
    """Convert engine power/displacement text into numeric values.

    Exact readings use their stated value. Closed intervals use their midpoint.
    Single-bound bands such as ``1200 cm3'e kadar`` use the stated boundary as
    a conservative proxy. Missing or unparseable values remain NaN so the next
    pipeline step can impute them using statistics learned from training data.
    """

    def fit(self, X: Any, y: Any = None) -> "EngineValueTransformer":
        """Learn no parameters and retain Scikit-learn transformer semantics."""
        return self

    def transform(self, X: Any) -> np.ndarray:
        """Parse each supplied engine column and return a numeric array."""
        frame = pd.DataFrame(X).copy()
        return np.column_stack(
            [frame.iloc[:, index].map(self._parse_value).to_numpy(dtype=float)
             for index in range(frame.shape[1])]
        )

    def get_feature_names_out(self, input_features: Any = None) -> np.ndarray:
        """Preserve input column names for feature-importance reporting."""
        if input_features is None:
            return np.asarray([], dtype=object)
        return np.asarray(input_features, dtype=object)

    @staticmethod
    def _parse_value(value: Any) -> float:
        """Parse one exact value, range, or single-bound band."""
        if pd.isna(value):
            return np.nan

        numbers = [
            float(token.replace(",", "."))
            for token in re.findall(r"\d+(?:[.,]\d+)?", str(value))
        ]
        if len(numbers) == 1:
            return numbers[0]
        if len(numbers) >= 2:
            return (numbers[0] + numbers[1]) / 2
        return np.nan
