# CarSight Architecture

## Overview

CarSight uses a simple two-part web application backed by a single offline-trained machine learning pipeline:

- A React and TypeScript frontend collects vehicle details and presents results.
- A FastAPI backend validates requests, runs preprocessing and model inference, and returns a structured response.
- Pandas, NumPy, and Scikit-learn support offline data preparation, model training, evaluation, and inference.

The MVP has no database, authentication layer, background worker, live scraper, or separate model-serving system. User submissions and prediction results are not persisted.

## Planned Project Structure

```text
CarSight/
├── data/
│   ├── raw/
│   └── processed/
├── notebooks/
├── models/
├── backend/            # FastAPI application
├── frontend/           # React and TypeScript application
├── docs/
└── README.md
```

Exact backend and frontend subdirectories will be introduced during their implementation sprints. The structure should remain small and organized by responsibility.

## Components

### `data/raw`

Stores original source datasets in their acquired form. Raw files are treated as immutable inputs: cleaning, normalization, and feature engineering must not overwrite them.

Large or restricted datasets should not be committed to source control. Their source, license, acquisition date, schema, currency, and units should be documented so the data can be obtained and interpreted reproducibly.

### `data/processed`

Stores cleaned or transformed datasets used for analysis and model training, when materialized files are useful. Processed data must be reproducible from `data/raw` through documented transformations.

Artifacts in this directory should record or imply the transformation version, reference date used for vehicle age, feature schema, and dataset split. Generated data should normally remain outside source control when it is large or reproducible.

### `notebooks`

Contains focused notebooks for dataset research, exploratory data analysis, model experiments, and result communication. Notebooks support investigation but should not become the only definition of production preprocessing or inference behavior.

Reusable preprocessing and the finalized model workflow must use deterministic Scikit-learn-compatible components that can be loaded by the backend. Notebooks should use clear names or numbering so their intended order is obvious.

### `models`

Contains serialized, versioned model artifacts and associated metadata produced by training. The preferred inference artifact is a single fitted Scikit-learn pipeline containing both preprocessing and the regression model, which prevents training-serving transformation differences.

Model metadata should include:

- Model and artifact version.
- Training dataset or data version.
- Required input schema, category handling, units, and currency.
- Vehicle-age reference date or derivation rule.
- Training configuration and random seed.
- Evaluation metrics and known limitations.
- Price-classification thresholds.
- Prediction-range and explanation methods.

Generated binary artifacts need not be committed when they can be recreated; the repository should document how the active artifact is produced and selected.

### FastAPI Backend

The backend is a single FastAPI application responsible for the prediction boundary. It will:

- Load the approved fitted Scikit-learn pipeline and metadata once at startup.
- Expose a small prediction interface for one vehicle evaluation at a time.
- Validate required fields, supported categories, numeric bounds, and relationships such as model year and vehicle age.
- Pass model features to the fitted pipeline in the exact schema used during training.
- Generate the estimated fair market price and uncertainty range.
- Compare the user-provided asking price with documented thresholds to assign `Below Market`, `Fair Price`, or `Above Market`.
- Produce or format the short factor explanation using the validated explanation approach.
- Return a consistent response or a clear client-safe validation error.

The asking price is required for classification but must not be used as a predictor of fair market price. The backend does not save requests or results.

### React Frontend

The frontend is a React application written in TypeScript. It will:

- Present the vehicle detail and asking-price form.
- Use clear units, currency, supported choices, and field guidance.
- Perform basic client-side validation for fast feedback.
- Submit a structured request to the FastAPI backend.
- Show loading and error states.
- Display the asking price, fair market estimate, price classification, prediction range, and factor explanation.
- Allow another evaluation by editing the form and resubmitting it.

The frontend is responsible for presentation and interaction only. It does not duplicate the trained preprocessing logic, decide authoritative classification thresholds, or persist user data.

## Offline Model Development Flow

Model development is separate from user-facing prediction:

```text
Raw Dataset
→ Data Validation and Cleaning
→ Feature Engineering
→ Train / Validation / Test Split
→ Scikit-learn Preprocessing and Regression Pipeline
→ Evaluation and Selection
→ Versioned Model Artifact and Metadata
```

The raw dataset remains unchanged. Transformations are fitted using training data only. Validation data supports model selection, and the held-out test set is used for final evaluation. The selected fitted pipeline and its metadata are then made available to the FastAPI application.

## Future Prediction Flow

```text
User Input
→ React Form
→ FastAPI API
→ Preprocessing Pipeline
→ Trained Scikit-learn Model
→ Prediction Response
→ Results Dashboard
```

### Flow Details

1. **User Input:** The user provides vehicle attributes and the listing's asking price.
2. **React Form:** The frontend checks required fields and basic formats, then sends a typed request to the backend.
3. **FastAPI API:** The backend performs authoritative validation and separates the asking price from model features.
4. **Preprocessing Pipeline:** The fitted Scikit-learn preprocessing steps transform numeric and categorical vehicle attributes exactly as they were transformed during training.
5. **Trained Scikit-learn Model:** The regression model estimates the vehicle's fair market price. The backend applies the approved uncertainty, classification, and explanation logic.
6. **Prediction Response:** The backend returns a structured response containing the estimate, classification, lower and upper range bounds, and factor explanation.
7. **Results Dashboard:** The React frontend formats and presents the response without changing its meaning.

## Request and Response Boundaries

The planned request contains:

- Brand.
- Model.
- Model year.
- Mileage.
- Fuel type.
- Transmission type.
- Body type.
- Engine size.
- Vehicle age, preferably derived consistently from model year.
- City.
- Asking price.

The planned response contains:

- Estimated fair market price.
- Price classification.
- Lower and upper prediction bounds.
- A short factor explanation.
- Model or response metadata needed to interpret currency, units, and version.

The exact field names and allowed values will be finalized after dataset research and recorded as one shared contract for frontend, API, and model inference.

## Architecture Principles

- **Keep one prediction service:** FastAPI owns validation and inference; no separate model microservice is needed.
- **Keep one fitted pipeline:** Preprocessing and regression travel together in a Scikit-learn pipeline artifact.
- **Separate offline and online work:** Dataset processing and training happen offline; the API only loads an approved artifact and predicts.
- **Keep the frontend presentation-focused:** React collects inputs and renders outputs, while backend rules remain authoritative.
- **Avoid persistence:** The MVP stores neither users, listings, nor prediction history.
- **Make uncertainty explicit:** Results include a range and avoid presenting the estimate as guaranteed value.
- **Version the contract:** Model metadata, expected inputs, units, currency, thresholds, and response meaning remain traceable to the active model.
- **Fail clearly:** Invalid or unsupported inputs result in actionable validation errors rather than silent coercion or unreliable output.

## Explicitly Excluded Architecture

The MVP does not introduce Supabase, Docker, Redis, Celery, cloud storage, microservices, a database, or any other unplanned infrastructure. Deployment should consist only of the React frontend, the FastAPI backend, and the required local model artifact using the technologies already selected for CarSight.
