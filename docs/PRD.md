# CarSight Product Requirements Document

## 1. Product Overview

CarSight is an ML-powered decision platform that helps users evaluate used car listings. A user provides a vehicle's key characteristics and listing price, and CarSight compares the listing with patterns learned from used car market data. The product returns an estimated fair market price, a price classification, an uncertainty estimate, and a concise explanation of the factors that most influenced the prediction.

The MVP is a focused, single-session web experience. It does not require accounts, store user data, or collect live marketplace listings.

## 2. Problem Statement

Used car pricing is difficult for non-experts because prices vary according to vehicle specifications, age, mileage, location, and market conditions. Buyers and sellers often have to compare many inconsistent listings and may still struggle to determine whether an asking price is reasonable.

CarSight addresses this problem by turning a standard set of vehicle details into a consistent, data-informed price assessment. It is intended to support a user's decision, not replace an inspection, valuation, or professional advice.

## 3. Target Users

- Used car buyers who want to assess whether a listing price is competitive.
- Private sellers who want a reference point when setting an asking price.
- Casual market researchers who want a quick estimate based on vehicle attributes.

The primary MVP user is a used car buyer reviewing a specific listing.

## 4. Value Proposition

CarSight gives users a quick and understandable answer to the question: “Is this used car priced fairly?” It combines a predicted market value with a clear classification and explanation, reducing the time and uncertainty involved in manually comparing listings.

The core value is:

- A standardized assessment based on relevant vehicle and location data.
- A simple comparison between the asking price and estimated fair market price.
- Visible uncertainty through a confidence or prediction range.
- A short explanation of the most influential factors.

## 5. MVP User Flow

1. The user opens the CarSight web application.
2. The user enters the vehicle details and the listing's asking price.
3. The interface validates that all required values are present and plausible.
4. The user submits the form for evaluation.
5. The backend applies the same preprocessing steps used during model training.
6. The trained model estimates the vehicle's fair market price and prediction range.
7. The system compares the asking price with the estimate and assigns a price classification.
8. The dashboard displays the estimated price, classification, prediction range, and a short factor explanation.
9. The user may change the inputs and run another evaluation without saving either result.

## 6. Functional Requirements

### Vehicle input

- The system must provide a form for entering all required vehicle attributes.
- The system must accept the listing's asking price so that it can classify the listing relative to the predicted fair market price.
- The system must validate required fields, numeric ranges, and allowed categorical values before requesting a prediction.
- The system must show clear validation messages for missing or invalid input.

### Prediction

- The system must transform submitted data with the preprocessing pipeline used during model training.
- The system must return an estimated fair market price in the product's configured currency.
- The system must calculate a price classification of `Below Market`, `Fair Price`, or `Above Market` by comparing the asking price with the estimate using documented thresholds.
- The system must return a confidence or prediction range around the estimated price.
- The system must provide a short, plain-language explanation of the most important factors affecting the result.
- The system must handle unsupported or invalid input without returning a misleading prediction.

### Results presentation

- The dashboard must clearly distinguish the estimated market price from the user's asking price.
- The price classification must be prominent and understandable without technical knowledge.
- The prediction range and explanation must be displayed alongside the estimate.
- The interface must allow the user to revise inputs and submit another evaluation.

## 7. Non-Functional Requirements

- **Usability:** A first-time user should be able to complete an evaluation without instructions beyond the labels and guidance in the form.
- **Performance:** Under normal MVP conditions, a prediction response should be returned within two seconds, excluding initial application startup and network conditions outside the system's control.
- **Reliability:** The training and inference pipelines must apply consistent preprocessing and produce reproducible results for identical inputs and model versions.
- **Maintainability:** Data preparation, model training, API behavior, and frontend presentation should remain clearly separated.
- **Explainability:** Explanations must use plain language and must not imply certainty beyond the model's measured performance.
- **Privacy:** The MVP must not persist submitted vehicle details or listing evaluations.
- **Accessibility:** The form and results should support keyboard use, readable labels, clear validation states, and sufficient visual contrast.
- **Compatibility:** The web application should support current major desktop browsers and remain usable on common mobile browser widths, without being a native mobile application.

## 8. Input Fields

| Field | Type | Requirement and validation notes |
| --- | --- | --- |
| Brand | Categorical text | Required; selected from values supported by the model. |
| Model | Categorical text | Required; valid options should correspond to the selected brand. |
| Model year | Integer | Required; must be a plausible production year and not later than the current year unless explicitly supported. |
| Mileage | Non-negative number | Required; displayed with a clearly stated distance unit. |
| Fuel type | Categorical | Required; limited to categories supported by the training data. |
| Transmission type | Categorical | Required; limited to supported categories. |
| Body type | Categorical | Required; limited to supported categories. |
| Engine size | Positive number | Required; displayed with a clearly stated unit, such as liters. |
| Vehicle age | Non-negative integer | Required by the model contract; should be consistent with model year and the reference year. It may be derived automatically in the interface to avoid contradictory input. |
| City | Categorical text | Required; selected from locations supported by the model. |
| Asking price | Positive number | Required for price classification; displayed in the configured currency. |

The final allowed values, units, and numeric limits will be based on the selected dataset and recorded with the model contract.

## 9. Output Fields

| Field | Description |
| --- | --- |
| Estimated fair market price | The model's point estimate of the vehicle's market value. |
| Price classification | `Below Market`, `Fair Price`, or `Above Market`, based on the asking price relative to documented thresholds around the estimate. |
| Confidence or prediction range | A lower and upper price bound that communicates prediction uncertainty using the selected evaluation method. |
| Factor explanation | A short summary of the vehicle attributes that most influenced the result, stated in user-friendly language. |

Outputs must include consistent currency formatting. They should be presented as estimates based on available data rather than guarantees of sale value or vehicle condition.

## 10. Out-of-Scope Features

The following are explicitly outside the MVP:

- User authentication.
- A database.
- Saved listings or saved prediction results.
- Live marketplace scraping.
- Price history.
- Seller analysis.
- Damage detection.
- Image analysis.
- A recommendation system.
- Expected selling time.
- A mobile application.

## 11. Success Criteria

The MVP will be considered successful when:

- A user can complete the full input-to-result flow using the required fields.
- Valid submissions consistently return all four required outputs.
- Invalid submissions receive clear validation feedback and do not produce a prediction.
- Model performance is evaluated on held-out data using documented regression metrics, including MAE, RMSE, and R².
- The selected model improves on a simple baseline and meets a target error threshold established after dataset exploration.
- Prediction-range coverage is measured and documented when the range method is selected.
- The same preprocessing pipeline is used for model evaluation and API inference.
- Typical prediction requests meet the two-second response target under expected MVP load.
- Usability testing confirms that target users can interpret the price classification and uncertainty range correctly.

Dataset-dependent numeric targets must be set after Sprint 1, when data coverage, currency, price distribution, and quality are known.

## 12. Risks and Assumptions

### Risks

- Available datasets may be incomplete, outdated, regionally biased, or based on asking prices rather than completed sales.
- Some brands, models, cities, fuel types, or body types may have too few examples for reliable predictions.
- Market prices can shift over time, causing model performance to degrade.
- Inconsistent units, duplicate listings, missing values, and extreme prices may distort training results.
- Vehicle age and model year can become inconsistent if both are accepted independently.
- A prediction range may be misunderstood as a guarantee rather than an uncertainty estimate.
- Global feature importance may not accurately explain every individual prediction; the explanation method must be validated.
- Classification thresholds that are too narrow may overstate meaningful differences between the asking price and prediction.

### Assumptions

- A suitable legally usable dataset containing the required input attributes and a price target can be obtained.
- Dataset prices use one known currency, or can be normalized before training.
- Mileage and engine size use known, consistent units after cleaning.
- The asking price is supplied for each evaluation even though it is not used as a feature in the fair-price prediction.
- Vehicle age is derived from model year and a documented reference date wherever possible.
- Price-classification thresholds will be defined using model error and product testing rather than chosen arbitrarily.
- The MVP serves predictions from a single versioned preprocessing pipeline and trained model artifact.
- Predictions are informational and do not account for unprovided factors such as exact condition, accident history, maintenance history, trim, or optional equipment.
