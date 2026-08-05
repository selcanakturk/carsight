# CarSight MVP Roadmap

This roadmap organizes the CarSight MVP into eight sequential sprints. Each sprint should leave the project in a reviewable state and document decisions that affect later work.

## Sprint 0: Project Setup

### Goal

Establish a clear, reproducible project structure and development workflow for data work, model development, the API, and the frontend.

### Tasks

- Confirm the MVP scope, terminology, and acceptance criteria.
- Define the repository structure for raw data, processed data, notebooks, model artifacts, backend, frontend, tests, and documentation.
- Record the supported Python and frontend runtime versions.
- Define dependency management and local configuration conventions.
- Add appropriate ignore rules for local environments, generated data, model artifacts, and secrets.
- Establish basic formatting, linting, and test conventions without implementing product features.
- Document data and model artifact naming and versioning conventions.

### Deliverables

- Agreed repository structure.
- Initial product, roadmap, and architecture documentation.
- Documented development and configuration conventions.
- A prioritized MVP backlog.

### Completion Criteria

- The team can identify where each project artifact belongs.
- MVP scope and exclusions are documented and agreed.
- Runtime and dependency conventions are recorded.
- No secret, local environment, generated dataset, or generated model artifact is intended for source control by default.

## Sprint 1: Dataset Research and EDA

### Goal

Select a suitable used car dataset and understand its coverage, quality, limitations, and relationship to the MVP inputs and price target.

### Tasks

- Identify candidate datasets and review their licenses and permitted use.
- Compare candidate schemas with the required MVP input fields.
- Document currency, geographic coverage, collection period, price meaning, mileage units, and engine-size units.
- Load the selected raw dataset without altering the source copy.
- Profile row counts, data types, missing values, duplicates, category frequencies, and cardinality.
- Explore price distributions and relationships between price and core vehicle attributes.
- Identify potential leakage, suspicious records, bias, and underrepresented segments.
- Establish preliminary evaluation metrics and a simple reference baseline.

### Deliverables

- Dataset selection record with source and license information.
- Exploratory data analysis notebook and summary.
- Data-quality and coverage report.
- Initial data dictionary.
- Preliminary model evaluation plan.

### Completion Criteria

- The selected dataset is legally usable and includes a viable price target.
- Required MVP fields are available or an explicitly documented adjustment is approved.
- Currency, units, geography, and collection period are known.
- Major quality issues and representation gaps are quantified.
- The team has a clear decision to proceed, replace the dataset, or revise assumptions.

## Sprint 2: Data Cleaning and Feature Engineering

### Goal

Create a reproducible transformation process that converts raw listings into model-ready data without leakage.

### Tasks

- Define validation rules for numeric and categorical fields.
- Standardize category labels, text casing, currency, mileage units, and engine-size units.
- Remove or resolve duplicates, invalid records, and impossible values using documented rules.
- Define a defensible approach to missing values and outliers.
- Derive vehicle age from model year and a documented reference date.
- Select the features used for training and explicitly exclude asking price from prediction features.
- Build preprocessing for numeric and categorical features using Scikit-learn-compatible components.
- Split data into training, validation, and test sets before any data-dependent fitting.
- Save or reproducibly generate the processed dataset.
- Add checks for schema, transformations, and leakage.

### Deliverables

- Documented cleaning rules.
- Reproducible preprocessing pipeline.
- Model-ready train, validation, and test datasets or a reproducible process that creates them.
- Finalized feature dictionary and inference input contract.
- Data validation checks.

### Completion Criteria

- The cleaning and preprocessing process runs consistently from the unmodified raw data.
- Training and inference transformations use the same definitions.
- No target or asking-price leakage is present in model features.
- Split strategy and random seeds are documented.
- Processed features satisfy the agreed schema and quality checks.

## Sprint 3: Baseline Regression Model

### Goal

Train and evaluate a simple regression baseline that establishes the minimum performance future models must exceed.

### Tasks

- Implement a naive reference prediction, such as the training-set median price.
- Train a simple regression model using the preprocessing pipeline.
- Measure MAE, RMSE, and R² on validation data.
- Compare results with the naive reference.
- Review residuals and errors across price ranges and important vehicle segments.
- Record training configuration, feature set, random seed, and evaluation results.
- Save the baseline preprocessing-and-model artifact for reproducible inference.

### Deliverables

- Naive reference and baseline regression results.
- Baseline model evaluation report.
- Residual and segment error analysis.
- Reproducible baseline pipeline artifact.

### Completion Criteria

- The complete baseline pipeline trains and predicts without manual transformation steps.
- Metrics are calculated on data not used to fit the model.
- Performance is compared with the naive reference.
- Known failure cases and high-error segments are documented.
- Results can be reproduced from the recorded configuration.

## Sprint 4: Model Evaluation and Improvement

### Goal

Select a model that provides the best justified balance of predictive performance, robustness, speed, and explainability for the MVP.

### Tasks

- Establish dataset-informed target metrics and acceptance thresholds.
- Compare a small set of appropriate Scikit-learn regression models.
- Tune promising candidates using training and validation data only.
- Evaluate cross-validation stability where appropriate.
- Perform error analysis by brand, age, mileage, city, and price segment.
- Select and validate a method for producing prediction or confidence ranges.
- Define price-classification thresholds based on model error and product meaning.
- Select and validate a method for short factor explanations.
- Evaluate the chosen pipeline once on the held-out test set.
- Record the final model, preprocessing pipeline, schema, metrics, and limitations.

### Deliverables

- Model comparison report.
- Final evaluation report with overall and segment metrics.
- Documented uncertainty-range method.
- Documented classification thresholds.
- Explanation approach and example outputs.
- Versioned final model pipeline artifact and metadata.

### Completion Criteria

- The final model outperforms the naive and Sprint 3 baselines on agreed metrics.
- Test performance meets the target established after EDA, or any exception is explicitly accepted.
- Important segment disparities and limitations are documented.
- Prediction ranges have measured coverage or a clearly stated interpretation.
- Classification thresholds and explanations are deterministic, reviewable, and understandable.
- The saved pipeline accepts the same schema planned for the API.

## Sprint 5: FastAPI Prediction API

### Goal

Expose the finalized local prediction pipeline through a small, validated FastAPI interface.

### Tasks

- Define request and response schemas from the documented model contract.
- Load the versioned preprocessing-and-model artifact at application startup.
- Implement a prediction operation for a single vehicle evaluation.
- Validate required fields, categories, numeric ranges, and field consistency.
- Calculate the price classification using the approved thresholds.
- Return the estimate, range, classification, and factor explanation.
- Define consistent client-safe error responses.
- Add API unit and integration tests, including invalid and boundary cases.
- Document local API usage and response semantics.

### Deliverables

- FastAPI prediction service.
- Versioned request and response schemas.
- Automated API tests.
- Local API documentation and example payloads.

### Completion Criteria

- A valid request returns all required MVP outputs in the documented format.
- Invalid or unsupported inputs return clear errors and no misleading prediction.
- The service uses the exact finalized preprocessing-and-model pipeline.
- Automated tests cover successful, invalid, boundary, and repeatability cases.
- Typical local prediction latency meets the MVP performance target.

## Sprint 6: React Dashboard

### Goal

Create a clear React and TypeScript interface for entering listing details and understanding the prediction result.

### Tasks

- Build the vehicle details and asking-price form.
- Use supported categorical values and clearly label units and currency.
- Add client-side required-field and range validation.
- Connect form submission to the FastAPI prediction interface.
- Display loading, validation, API error, and retry states.
- Present the asking price, estimate, classification, range, and factor explanation clearly.
- Allow users to revise values and run another evaluation.
- Review keyboard navigation, labels, contrast, responsiveness, and result comprehension.
- Add focused component and user-flow tests.

### Deliverables

- React and TypeScript MVP dashboard.
- Integrated vehicle evaluation form and results view.
- Frontend validation and error states.
- Frontend tests for critical interactions.

### Completion Criteria

- A user can complete the full evaluation flow from the browser.
- The interface displays every required output and distinguishes asking price from estimated price.
- Loading, invalid-input, and server-error states are understandable.
- Critical interactions work with keyboard navigation and common viewport sizes.
- The dashboard uses only the documented API contract.

## Sprint 7: Testing, Deployment and README

### Goal

Verify the complete MVP, prepare a simple deployment, and provide enough documentation for another contributor to run and evaluate the project.

### Tasks

- Run end-to-end tests across frontend, API, preprocessing, and model inference.
- Add regression tests for representative and boundary prediction cases.
- Verify model artifact compatibility and startup failure behavior.
- Test performance, error handling, accessibility basics, and browser compatibility.
- Review the product against the PRD scope and acceptance criteria.
- Document model limitations, dataset provenance, prediction semantics, and non-advisory use.
- Prepare the FastAPI backend and React frontend for a simple deployment environment.
- Configure environment-specific API settings without adding unplanned infrastructure.
- Complete the README with setup, local execution, testing, architecture, and usage guidance.
- Perform a release smoke test in the deployment environment.

### Deliverables

- Passing automated test suite and end-to-end test report.
- Deployed MVP frontend and backend.
- Completed project README.
- Release checklist and known-limitations record.

### Completion Criteria

- The deployed full flow returns correct, contract-compliant results for representative inputs.
- Critical automated tests pass in a clean environment.
- No out-of-scope service or feature is required to operate the MVP.
- Setup, testing, deployment, dataset, and model limitations are documented.
- A final review confirms that all PRD success criteria are met or explicitly records accepted exceptions.
