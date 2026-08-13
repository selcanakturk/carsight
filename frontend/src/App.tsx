import { FormEvent, useState } from "react";

import { AnalysisState } from "./components/AnalysisState";
import { Hero } from "./components/Hero";
import { PredictionResult } from "./components/PredictionResult";
import { PredictionStepper } from "./components/PredictionStepper";
import { VehicleForm } from "./components/VehicleForm";
import {
  PredictionApiError,
  PredictionResponse,
  requestPrediction,
} from "./services/prediction";
import { FormErrors, FormValues } from "./types";

const currentYear = new Date().getFullYear();
const conditionFields: (keyof FormValues)[] = [
  "orjinal_parça_sayısı",
  "lokal_boyalı_parça_sayısı",
  "boyalı_parça_sayısı",
  "değişen_parça_sayısı",
];

const initialValues: FormValues = {
  marka: "",
  yıl: "",
  kilometre_Km: "",
  vitesTipi: "",
  yakitTuru: "",
  kasaTipi: "",
  motorGucu_HP: "",
  motorHacmi_Cc: "",
  cekisTipi: "",
  orjinal_parça_sayısı: "",
  lokal_boyalı_parça_sayısı: "",
  boyalı_parça_sayısı: "",
  değişen_parça_sayısı: "",
};

const fieldsByStep: Record<number, (keyof FormValues)[]> = {
  1: ["marka", "yıl"],
  2: [
    "kilometre_Km", "vitesTipi", "yakitTuru", "kasaTipi",
    "motorGucu_HP", "motorHacmi_Cc", "cekisTipi",
  ],
  3: conditionFields,
  4: [],
};

function validateFields(form: FormValues, fields: (keyof FormValues)[]): FormErrors {
  const errors: FormErrors = {};

  for (const field of fields) {
    if (!form[field].trim()) errors[field] = "Bu alan zorunludur.";
  }

  if (fields.includes("yıl") && form.yıl) {
    const year = Number(form.yıl);
    if (!Number.isInteger(year) || year < 1900 || year > currentYear) {
      errors.yıl = `Yıl 1900 ile ${currentYear} arasında olmalıdır.`;
    }
  }

  if (fields.includes("kilometre_Km") && form.kilometre_Km) {
    const mileage = Number(form.kilometre_Km);
    if (!Number.isInteger(mileage) || mileage < 0) {
      errors.kilometre_Km = "Kilometre sıfır veya daha büyük olmalıdır.";
    }
  }

  if (conditionFields.some((field) => fields.includes(field))) {
    for (const field of conditionFields) {
      if (!form[field]) continue;
      const value = Number(form[field]);
      if (!Number.isInteger(value) || value < 0 || value > 13) {
        errors[field] = "0 ile 13 arasında tam sayı girin.";
      }
    }

    const allCountsValid = conditionFields.every((field) => {
      const value = Number(form[field]);
      return form[field] !== "" && Number.isInteger(value) && value >= 0 && value <= 13;
    });
    const total = conditionFields.reduce((sum, field) => sum + Number(form[field] || 0), 0);
    if (allCountsValid && total > 13) {
      errors.conditionTotal = `Parça sayılarının toplamı en fazla 13 olabilir. Mevcut toplam: ${total}.`;
    }
  }

  return errors;
}

function App() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [requestError, setRequestError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updateField(field: keyof FormValues, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, conditionTotal: undefined }));
    setResult(null);
    setRequestError("");
  }

  function goToNextStep() {
    const nextErrors = validateFields(form, fieldsByStep[step]);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setStep((current) => Math.min(4, current + 1));
  }

  function goToStep(nextStep: number) {
    if (nextStep >= step || isLoading) return;
    setErrors({});
    setRequestError("");
    setStep(nextStep);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 4) {
      goToNextStep();
      return;
    }

    const nextErrors = validateFields(form, [
      ...fieldsByStep[1], ...fieldsByStep[2], ...fieldsByStep[3],
    ]);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStep(nextErrors.marka || nextErrors.yıl ? 1 :
        fieldsByStep[2].some((field) => nextErrors[field]) ? 2 : 3);
      return;
    }

    setIsLoading(true);
    setRequestError("");
    setResult(null);

    try {
      const prediction = await requestPrediction({
        marka: form.marka.trim(),
        yıl: Number(form.yıl),
        kilometre_Km: Number(form.kilometre_Km),
        vitesTipi: form.vitesTipi,
        yakitTuru: form.yakitTuru,
        kasaTipi: form.kasaTipi,
        motorGucu_HP: form.motorGucu_HP,
        motorHacmi_Cc: form.motorHacmi_Cc,
        cekisTipi: form.cekisTipi,
        orjinal_parça_sayısı: Number(form.orjinal_parça_sayısı),
        lokal_boyalı_parça_sayısı: Number(form.lokal_boyalı_parça_sayısı),
        boyalı_parça_sayısı: Number(form.boyalı_parça_sayısı),
        değişen_parça_sayısı: Number(form.değişen_parça_sayısı),
      });
      setResult(prediction);
    } catch (error) {
      setRequestError(error instanceof PredictionApiError
        ? error.message
        : "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  }

  function resetFlow() {
    setForm(initialValues);
    setErrors({});
    setResult(null);
    setRequestError("");
    setStep(1);
  }

  return (
    <main className="page-shell">
      <Hero />
      <section className="valuation-shell" id="valuation" aria-labelledby="valuation-title">
        <div className="valuation-card">
          <div className="card-intro">
            <div><p className="section-kicker">AKILLI DEĞERLEME V2</p><h2 id="valuation-title">Aracınızı tanımlayın</h2></div>
            <span className="secure-note"><i aria-hidden="true" /> Verileriniz kaydedilmez</span>
          </div>
          <PredictionStepper currentStep={step} onStepSelect={goToStep} />
          <form onSubmit={handleSubmit} noValidate>
            {isLoading ? <AnalysisState /> : result ? (
              <PredictionResult form={form} result={result} onReset={resetFlow} />
            ) : (
              <VehicleForm step={step} form={form} errors={errors} requestError={requestError}
                currentYear={currentYear} onChange={updateField}
                onBack={() => setStep((current) => Math.max(1, current - 1))} />
            )}
          </form>
        </div>
      </section>
      <footer className="product-footer">
        <div className="footer-brand"><span>CS</span><strong>CarSight AI</strong></div>
        <p>Powered by React <i>•</i> FastAPI <i>•</i> Scikit-Learn</p>
        <small>Sonuçlar makine öğrenmesi tahminidir ve profesyonel ekspertiz yerine geçmez.</small>
      </footer>
    </main>
  );
}

export default App;
