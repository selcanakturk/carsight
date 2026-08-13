# CarSight Deployment Preparation

CarSight is prepared for a Vercel frontend and a Render backend. This document describes configuration only; it does not deploy either service.

## Prerequisites

- The production model must be present at `models/random_forest_model.pkl` in the repository used for deployment.
- The repository must include the `ml` package because the fitted Pipeline deserializes its custom engine-value transformer.
- Never commit `.env` files or credentials. Configure production values in the hosting dashboards.

## Render Backend

Create a Python web service connected to the repository, or use the root-level `render.yaml` Blueprint.

| Setting | Value |
| --- | --- |
| Root directory | Repository root (leave blank in Render) |
| Build command | `pip install -r backend/requirements.txt` |
| Start command | `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Health check path | `/health` |
| Python version | `3.13.2` |

Do not set the Render root directory to `backend`: the application needs the root-level `models` and `ml` directories.

### Backend Environment Variables

Set `FRONTEND_ORIGINS` to a comma-separated allowlist of browser origins. Use the final Vercel production origin and any explicitly required preview origins. Origins must include the scheme and hostname but no path or trailing slash.

```text
FRONTEND_ORIGINS=https://your-project.vercel.app
```

Render supplies `PORT`; do not set it manually. The deployed backend URL will follow a format such as:

```text
https://your-render-service.onrender.com
```

The first startup loads the model artifact into process memory. Select a Render instance with sufficient memory for the 54 MB artifact plus the Python scientific runtime.

## Vercel Frontend

Import the same repository as a Vercel project.

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Root directory | `frontend` |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |

Set the production environment variable to the Render service origin, without `/api/predict` and preferably without a trailing slash:

```text
VITE_API_BASE_URL=https://your-render-service.onrender.com
```

Vite embeds this value at build time. Redeploy the frontend after adding or changing it. Local development can continue to use `VITE_API_BASE_URL=/backend`, which uses the existing Vite proxy.

After Vercel assigns the production domain, add that exact origin to the Render `FRONTEND_ORIGINS` value and restart the backend service. If a custom domain is added later, add its origin as well.

## Post-Deploy Verification

1. Open `https://<render-host>/health` and confirm the API reports `status: ok`.
2. Open `https://<render-host>/docs` and confirm the Swagger interface loads.
3. Submit a valid 13-field request to `POST https://<render-host>/api/predict` and confirm it returns an integer `predicted_price` with `currency: TRY`.
4. Open the live Vercel frontend and confirm the four-step interface loads without console or CORS errors.
5. Complete one end-to-end prediction and confirm the result dashboard and deterministic insights render.
6. Confirm invalid input remains blocked in the frontend and produces validation responses from the API when called directly.

## Local Production Checks

Backend tests from the repository root:

```bash
cd backend
.venv/bin/python -m pytest -q
```

Frontend production build:

```bash
cd frontend
npm ci
npm run build
```
