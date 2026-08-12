export interface PredictionRequest {
  marka: string;
  yıl: number;
  kilometre_Km: number;
  vitesTipi: string;
  yakitTuru: string;
  kasaTipi: string;
}

export interface PredictionResponse {
  predicted_price: number;
  currency: "TRY";
}

interface ValidationErrorItem {
  msg?: string;
}

interface ErrorResponse {
  detail?: string | ValidationErrorItem[];
}

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "/backend"
).replace(/\/$/, "");

export class PredictionApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PredictionApiError";
  }
}

async function getErrorMessage(response: Response): Promise<string> {
  if (response.status === 422) {
    try {
      const body = (await response.json()) as ErrorResponse;
      if (Array.isArray(body.detail)) {
        const message = body.detail.find((item) => item.msg)?.msg;
        return message
          ? `Lütfen araç bilgilerini kontrol edin: ${message}`
          : "Lütfen araç bilgilerini kontrol edip tekrar deneyin.";
      }
    } catch {
      // Use the stable validation message below for non-JSON responses.
    }
    return "Lütfen araç bilgilerini kontrol edip tekrar deneyin.";
  }

  if (response.status >= 500) {
    return "Tahmin servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.";
  }

  return "Tahmin alınamadı. Lütfen tekrar deneyin.";
}

export async function requestPrediction(
  payload: PredictionRequest,
): Promise<PredictionResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new PredictionApiError(
      "Sunucuya bağlanılamadı. Backend servisinin çalıştığından emin olun.",
    );
  }

  if (!response.ok) {
    throw new PredictionApiError(await getErrorMessage(response));
  }

  try {
    return (await response.json()) as PredictionResponse;
  } catch {
    throw new PredictionApiError(
      "Sunucudan beklenmeyen bir yanıt alındı. Lütfen tekrar deneyin.",
    );
  }
}
