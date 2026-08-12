import { FormEvent, useState } from "react";

import {
  PredictionApiError,
  PredictionResponse,
  requestPrediction,
} from "./services/prediction";

interface FormValues {
  marka: string;
  yıl: string;
  kilometre_Km: string;
  vitesTipi: string;
  yakitTuru: string;
  kasaTipi: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const currentYear = new Date().getFullYear();

const initialValues: FormValues = {
  marka: "",
  yıl: "",
  kilometre_Km: "",
  vitesTipi: "",
  yakitTuru: "",
  kasaTipi: "",
};

const transmissionOptions = ["Otomatik", "Yarı Otomatik", "Manuel"];
const fuelOptions = ["Benzin", "Dizel", "LPG & Benzin", "Hibrit", "Elektrik"];
const bodyOptions = [
  "Sedan",
  "Hatchback/5",
  "SUV",
  "Station wagon",
  "Coupe",
  "Cabrio",
  "MPV",
];

const priceFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

function App() {
  const [form, setForm] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [requestError, setRequestError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updateField(field: keyof FormValues, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validateForm(): FormErrors {
    const nextErrors: FormErrors = {};

    for (const field of Object.keys(form) as (keyof FormValues)[]) {
      if (!form[field].trim()) {
        nextErrors[field] = "Bu alan zorunludur.";
      }
    }

    const year = Number(form.yıl);
    if (form.yıl && (!Number.isInteger(year) || year < 1900 || year > currentYear)) {
      nextErrors.yıl = `Yıl 1900 ile ${currentYear} arasında olmalıdır.`;
    }

    const mileage = Number(form.kilometre_Km);
    if (
      form.kilometre_Km &&
      (!Number.isInteger(mileage) || mileage < 0)
    ) {
      nextErrors.kilometre_Km = "Kilometre sıfır veya daha büyük olmalıdır.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setResult(null);
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
      });
      setResult(prediction);
    } catch (error) {
      setRequestError(
        error instanceof PredictionApiError
          ? error.message
          : "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <header className="hero">
        <a className="brand" href="/" aria-label="CarSight ana sayfa">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>CarSight</span>
        </a>
        <div className="hero-copy">
          <p className="eyebrow">VERİ DESTEKLİ ARAÇ DEĞERLEME</p>
          <h1>Aracınızın piyasa değerini saniyeler içinde öğrenin.</h1>
          <p>
            Temel araç bilgilerini girin; makine öğrenmesi modelimiz size
            tahmini piyasa değerini sunsun.
          </p>
        </div>
      </header>

      <section className="workspace" aria-labelledby="form-heading">
        <div className="form-card">
          <div className="section-heading">
            <span>01</span>
            <div>
              <h2 id="form-heading">Araç Bilgileri</h2>
              <p>Değer tahmini için aşağıdaki alanları doldurun.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <FormField label="Marka" error={errors.marka} htmlFor="marka">
                <input
                  id="marka"
                  value={form.marka}
                  onChange={(event) => updateField("marka", event.target.value)}
                  placeholder="Örn. BMW"
                  autoComplete="off"
                  aria-invalid={Boolean(errors.marka)}
                />
              </FormField>

              <FormField label="Model Yılı" error={errors.yıl} htmlFor="yıl">
                <input
                  id="yıl"
                  type="number"
                  min="1900"
                  max={currentYear}
                  step="1"
                  value={form.yıl}
                  onChange={(event) => updateField("yıl", event.target.value)}
                  placeholder="Örn. 2020"
                  aria-invalid={Boolean(errors.yıl)}
                />
              </FormField>

              <FormField
                label="Kilometre"
                error={errors.kilometre_Km}
                htmlFor="kilometre_Km"
              >
                <div className="input-with-unit">
                  <input
                    id="kilometre_Km"
                    type="number"
                    min="0"
                    step="1"
                    value={form.kilometre_Km}
                    onChange={(event) =>
                      updateField("kilometre_Km", event.target.value)
                    }
                    placeholder="Örn. 80000"
                    aria-invalid={Boolean(errors.kilometre_Km)}
                  />
                  <span>km</span>
                </div>
              </FormField>

              <SelectField
                id="vitesTipi"
                label="Vites Tipi"
                value={form.vitesTipi}
                options={transmissionOptions}
                error={errors.vitesTipi}
                onChange={(value) => updateField("vitesTipi", value)}
              />

              <SelectField
                id="yakitTuru"
                label="Yakıt Türü"
                value={form.yakitTuru}
                options={fuelOptions}
                error={errors.yakitTuru}
                onChange={(value) => updateField("yakitTuru", value)}
              />

              <SelectField
                id="kasaTipi"
                label="Kasa Tipi"
                value={form.kasaTipi}
                options={bodyOptions}
                error={errors.kasaTipi}
                onChange={(value) => updateField("kasaTipi", value)}
              />
            </div>

            {requestError && (
              <div className="alert" role="alert">{requestError}</div>
            )}

            <button className="submit-button" type="submit" disabled={isLoading}>
              {isLoading ? "Tahmin hesaplanıyor…" : "Araç Değerini Hesapla"}
              {!isLoading && <span aria-hidden="true">→</span>}
            </button>
          </form>
        </div>

        <aside className={`result-card ${result ? "has-result" : ""}`} aria-live="polite">
          <p className="result-label">TAHMİN SONUCU</p>
          {result ? (
            <>
              <h2>Tahmini Araç Değeri</h2>
              <p className="price">
                {priceFormatter.format(result.predicted_price)}
              </p>
              <p className="result-note">
                Bu değer, girdiğiniz bilgiler ve mevcut model verileri temel
                alınarak hesaplanmıştır.
              </p>
            </>
          ) : (
            <div className="empty-result">
              <div className="gauge" aria-hidden="true"><span /></div>
              <h2>Sonucunuz burada görünecek</h2>
              <p>Araç bilgilerini doldurup hesaplama butonuna tıklayın.</p>
            </div>
          )}
        </aside>
      </section>

      <footer>
        <p>CarSight tahminleri bilgilendirme amaçlıdır.</p>
      </footer>
    </main>
  );
}

interface FormFieldProps {
  children: React.ReactNode;
  error?: string;
  htmlFor: string;
  label: string;
}

function FormField({ children, error, htmlFor, label }: FormFieldProps) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

interface SelectFieldProps {
  error?: string;
  id: keyof FormValues;
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}

function SelectField({
  error,
  id,
  label,
  onChange,
  options,
  value,
}: SelectFieldProps) {
  return (
    <FormField label={label} error={error} htmlFor={id}>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
      >
        <option value="">Seçiniz</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </FormField>
  );
}

export default App;
