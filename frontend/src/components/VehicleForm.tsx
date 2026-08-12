import type { ReactNode } from "react";

import { FormErrors, FormValues } from "../types";

const transmissionOptions = ["Otomatik", "Yarı Otomatik", "Manuel"];
const fuelOptions = ["Benzin", "Dizel", "LPG & Benzin", "Hibrit", "Elektrik"];
const bodyOptions = ["Sedan", "Hatchback/5", "SUV", "Station wagon", "Coupe", "Cabrio", "MPV"];

interface VehicleFormProps {
  step: number;
  form: FormValues;
  errors: FormErrors;
  requestError: string;
  currentYear: number;
  onChange: (field: keyof FormValues, value: string) => void;
  onBack: () => void;
}

export function VehicleForm(props: VehicleFormProps) {
  const { step, form, errors, requestError, currentYear, onChange, onBack } = props;

  return (
    <div className="step-panel" key={step}>
      <div className="step-copy">
        <p>ADIM 0{step}</p>
        <h3>{step === 1 ? "Aracınızla başlayalım" : step === 2 ? "Teknik detayları ekleyin" : "Bilgileri gözden geçirin"}</h3>
        <span>{step === 1 ? "Temel araç bilgilerini girin." : step === 2 ? "Modelin değerlendireceği teknik özellikleri seçin." : "Analizi başlatmadan önce bilgilerinizi kontrol edin."}</span>
      </div>

      {step === 1 && (
        <div className="form-grid compact-grid">
          <Field label="Marka" error={errors.marka} htmlFor="marka">
            <input id="marka" value={form.marka} onChange={(e) => onChange("marka", e.target.value)} placeholder="Örn. BMW" autoComplete="off" aria-invalid={Boolean(errors.marka)} />
          </Field>
          <Field label="Model Yılı" error={errors.yıl} htmlFor="yıl">
            <input id="yıl" type="number" min="1900" max={currentYear} step="1" value={form.yıl} onChange={(e) => onChange("yıl", e.target.value)} placeholder="Örn. 2020" aria-invalid={Boolean(errors.yıl)} />
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="form-grid">
          <Field label="Kilometre" error={errors.kilometre_Km} htmlFor="kilometre_Km">
            <div className="input-with-unit">
              <input id="kilometre_Km" type="number" min="0" step="1" value={form.kilometre_Km} onChange={(e) => onChange("kilometre_Km", e.target.value)} placeholder="Örn. 80000" aria-invalid={Boolean(errors.kilometre_Km)} />
              <span>km</span>
            </div>
          </Field>
          <SelectField id="vitesTipi" label="Vites Tipi" value={form.vitesTipi} options={transmissionOptions} error={errors.vitesTipi} onChange={(value) => onChange("vitesTipi", value)} />
          <SelectField id="yakitTuru" label="Yakıt Türü" value={form.yakitTuru} options={fuelOptions} error={errors.yakitTuru} onChange={(value) => onChange("yakitTuru", value)} />
          <SelectField id="kasaTipi" label="Kasa Tipi" value={form.kasaTipi} options={bodyOptions} error={errors.kasaTipi} onChange={(value) => onChange("kasaTipi", value)} />
        </div>
      )}

      {step === 3 && <ReviewSummary form={form} />}

      {requestError && <div className="alert" role="alert">{requestError}</div>}

      <div className="form-actions">
        {step > 1 && <button className="back-button" type="button" onClick={onBack}>← Geri</button>}
        <button className={`primary-button ${step === 3 ? "analysis-button" : ""}`} type="submit">
          {step === 3 ? <><i aria-hidden="true">✦</i> AI Analizini Başlat</> : <>Devam Et <span>→</span></>}
        </button>
      </div>
    </div>
  );
}

function ReviewSummary({ form }: { form: FormValues }) {
  const items = [
    ["Marka", form.marka], ["Model Yılı", form.yıl],
    ["Kilometre", `${Number(form.kilometre_Km).toLocaleString("tr-TR")} km`],
    ["Vites", form.vitesTipi], ["Yakıt", form.yakitTuru], ["Kasa", form.kasaTipi],
  ];
  return <div className="review-grid">{items.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>;
}

function Field({ children, error, htmlFor, label }: { children: ReactNode; error?: string; htmlFor: string; label: string }) {
  return <div className="field"><label htmlFor={htmlFor}>{label}</label>{children}{error && <span className="field-error">{error}</span>}</div>;
}

function SelectField({ error, id, label, onChange, options, value }: { error?: string; id: keyof FormValues; label: string; onChange: (value: string) => void; options: string[]; value: string }) {
  return <Field label={label} error={error} htmlFor={id}><select id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)}><option value="">Seçiniz</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></Field>;
}
