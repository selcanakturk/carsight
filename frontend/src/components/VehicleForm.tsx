import type { ReactNode } from "react";

import { FormErrors, FormValues } from "../types";

const transmissionOptions = ["Otomatik", "Yarı Otomatik", "Düz"];
const fuelOptions = ["Benzin", "Dizel", "LPG & Benzin", "Hibrit", "Elektrik"];
const bodyOptions = ["Sedan", "Hatchback/5", "Hatchback/3", "SUV", "Station wagon", "Coupe", "Cabrio", "Roadster", "MPV"];
const drivetrainOptions = ["Önden Çekiş", "Arkadan İtiş", "4WD (Sürekli)"];
const enginePowerOptions = [
  "51 - 75 HP", "65 hp", "70 hp", "75 hp", "76 - 100 HP", "80 hp", "90 hp",
  "95 hp", "100 hp", "101 - 125 HP", "105 hp", "110 hp", "115 hp", "120 hp",
  "125 hp", "126 - 150 HP", "136 hp", "150 hp", "151 - 175 HP", "170 hp", "176 - 200 HP",
];
const engineVolumeOptions = [
  "1200 cm3' e kadar", "999 cc", "1199 cc", "1201 - 1400 cm3", "1248 cc",
  "1364 cc", "1368 cc", "1390 cc", "1398 cc", "1399 cc", "1401 - 1600 cm3",
  "1461 cc", "1493 cc", "1499 cc", "1560 cc", "1595 cc", "1596 cc", "1598 cc",
  "1601 - 1800 cm3", "1801 - 2000 cm3", "1968 cc", "1995 cc", "1998 cc",
  "2001 - 2500 cm3", "2501 - 3000 cm3", "3001 - 3500 cm3", "3501 - 4000 cm3",
  "4001 - 4500 cm3",
];

interface VehicleFormProps {
  step: number;
  form: FormValues;
  errors: FormErrors;
  requestError: string;
  currentYear: number;
  onChange: (field: keyof FormValues, value: string) => void;
  onBack: () => void;
}

const stepContent = {
  1: ["Aracınızla başlayalım", "Temel araç bilgilerini girin."],
  2: ["Teknik detayları ekleyin", "Modelin değerlendireceği motor ve sürüş özelliklerini seçin."],
  3: ["Araç kondisyonunu belirtin", "13 gövde parçasının mevcut durum dağılımını girin."],
  4: ["Bilgileri gözden geçirin", "AI analizini başlatmadan önce tüm bilgilerinizi kontrol edin."],
} as const;

export function VehicleForm(props: VehicleFormProps) {
  const { step, form, errors, requestError, currentYear, onChange, onBack } = props;
  const conditionTotal = [
    form.orjinal_parça_sayısı, form.lokal_boyalı_parça_sayısı,
    form.boyalı_parça_sayısı, form.değişen_parça_sayısı,
  ].reduce((sum, value) => sum + Number(value || 0), 0);

  return (
    <div className="step-panel" key={step}>
      <div className="step-copy">
        <p>ADIM 0{step}</p>
        <h3>{stepContent[step as keyof typeof stepContent][0]}</h3>
        <span>{stepContent[step as keyof typeof stepContent][1]}</span>
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
        <div className="technical-section">
          <div className="form-grid technical-grid">
            <Field label="Kilometre" error={errors.kilometre_Km} htmlFor="kilometre_Km">
              <div className="input-with-unit"><input id="kilometre_Km" type="number" min="0" step="1" value={form.kilometre_Km} onChange={(e) => onChange("kilometre_Km", e.target.value)} placeholder="Örn. 80000" aria-invalid={Boolean(errors.kilometre_Km)} /><span>km</span></div>
            </Field>
            <SelectField id="vitesTipi" label="Vites Tipi" value={form.vitesTipi} options={transmissionOptions} error={errors.vitesTipi} onChange={(value) => onChange("vitesTipi", value)} />
            <SelectField id="yakitTuru" label="Yakıt Türü" value={form.yakitTuru} options={fuelOptions} error={errors.yakitTuru} onChange={(value) => onChange("yakitTuru", value)} />
            <SelectField id="kasaTipi" label="Kasa Tipi" value={form.kasaTipi} options={bodyOptions} error={errors.kasaTipi} onChange={(value) => onChange("kasaTipi", value)} />
          </div>
          <div className="form-subsection"><span>Motor ve Aktarma</span><i /></div>
          <div className="form-grid technical-grid three-up">
            <SelectField id="motorGucu_HP" label="Motor Gücü" value={form.motorGucu_HP} options={enginePowerOptions} error={errors.motorGucu_HP} onChange={(value) => onChange("motorGucu_HP", value)} />
            <SelectField id="motorHacmi_Cc" label="Motor Hacmi" value={form.motorHacmi_Cc} options={engineVolumeOptions} error={errors.motorHacmi_Cc} onChange={(value) => onChange("motorHacmi_Cc", value)} />
            <SelectField id="cekisTipi" label="Çekiş Tipi" value={form.cekisTipi} options={drivetrainOptions} error={errors.cekisTipi} onChange={(value) => onChange("cekisTipi", value)} />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="condition-section">
          <div className="condition-header"><span>Gövde parçası dağılımı</span><strong className={conditionTotal > 13 ? "invalid" : ""}>{conditionTotal} / 13</strong></div>
          <div className="condition-grid">
            <CountField id="orjinal_parça_sayısı" label="Orijinal" caption="İşlem görmemiş" value={form.orjinal_parça_sayısı} error={errors.orjinal_parça_sayısı} onChange={onChange} />
            <CountField id="lokal_boyalı_parça_sayısı" label="Lokal Boyalı" caption="Kısmi boya" value={form.lokal_boyalı_parça_sayısı} error={errors.lokal_boyalı_parça_sayısı} onChange={onChange} />
            <CountField id="boyalı_parça_sayısı" label="Boyalı" caption="Tam boya" value={form.boyalı_parça_sayısı} error={errors.boyalı_parça_sayısı} onChange={onChange} />
            <CountField id="değişen_parça_sayısı" label="Değişen" caption="Parça değişimi" value={form.değişen_parça_sayısı} error={errors.değişen_parça_sayısı} onChange={onChange} />
          </div>
          {errors.conditionTotal && <div className="condition-error" role="alert">{errors.conditionTotal}</div>}
          <p className="condition-help">Dört kategorinin toplamı aracın 13 değerlendirilebilir gövde parçasını aşmamalıdır.</p>
        </div>
      )}

      {step === 4 && <ReviewSummary form={form} />}
      {requestError && <div className="alert" role="alert">{requestError}</div>}

      <div className="form-actions">
        {step > 1 && <button className="back-button" type="button" onClick={onBack}>← Geri</button>}
        <button className={`primary-button ${step === 4 ? "analysis-button" : ""}`} type="submit">
          {step === 4 ? <><i aria-hidden="true">✦</i> AI Analizini Başlat</> : <>Devam Et <span>→</span></>}
        </button>
      </div>
    </div>
  );
}

function ReviewSummary({ form }: { form: FormValues }) {
  return (
    <div className="review-groups">
      <ReviewGroup title="Araç Bilgileri" items={[["Marka", form.marka], ["Model Yılı", form.yıl]]} />
      <ReviewGroup title="Teknik Özellikler" items={[
        ["Kilometre", `${Number(form.kilometre_Km).toLocaleString("tr-TR")} km`], ["Vites", form.vitesTipi],
        ["Yakıt", form.yakitTuru], ["Kasa", form.kasaTipi], ["Motor Gücü", form.motorGucu_HP],
        ["Motor Hacmi", form.motorHacmi_Cc], ["Çekiş", form.cekisTipi],
      ]} />
      <ReviewGroup title="Kondisyon" items={[
        ["Orijinal", form.orjinal_parça_sayısı], ["Lokal Boyalı", form.lokal_boyalı_parça_sayısı],
        ["Boyalı", form.boyalı_parça_sayısı], ["Değişen", form.değişen_parça_sayısı],
      ]} />
    </div>
  );
}

function ReviewGroup({ title, items }: { title: string; items: string[][] }) {
  return <section className="review-group"><h4>{title}</h4><div>{items.map(([label, value]) => <p key={label}><span>{label}</span><strong>{value}</strong></p>)}</div></section>;
}

function CountField({ id, label, caption, value, error, onChange }: { id: keyof FormValues; label: string; caption: string; value: string; error?: string; onChange: (field: keyof FormValues, value: string) => void }) {
  return <div className={`count-card ${error ? "has-error" : ""}`}><label htmlFor={id}><strong>{label}</strong><span>{caption}</span></label><input id={id} type="number" min="0" max="13" step="1" inputMode="numeric" value={value} onChange={(e) => onChange(id, e.target.value)} aria-invalid={Boolean(error)} placeholder="0" />{error && <small>{error}</small>}</div>;
}

function Field({ children, error, htmlFor, label }: { children: ReactNode; error?: string; htmlFor: string; label: string }) {
  return <div className="field"><label htmlFor={htmlFor}>{label}</label>{children}{error && <span className="field-error">{error}</span>}</div>;
}

function SelectField({ error, id, label, onChange, options, value }: { error?: string; id: keyof FormValues; label: string; onChange: (value: string) => void; options: string[]; value: string }) {
  return <Field label={label} error={error} htmlFor={id}><select id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)}><option value="">Seçiniz</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></Field>;
}
