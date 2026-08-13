import { PredictionResponse } from "../services/prediction";
import { FormValues } from "../types";

const priceFormatter = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });

export function PredictionResult({ form, result, onReset }: { form: FormValues; result: PredictionResponse; onReset: () => void }) {
  return (
    <div className="result-dashboard result-v2" aria-live="polite">
      <div className="result-main">
        <div className="result-badge"><span>✓</span> V2 ANALİZ TAMAMLANDI</div>
        <p>Tahmini Piyasa Değeri</p>
        <h3>{priceFormatter.format(result.predicted_price)}</h3>
        <small>13 araç özelliğini değerlendiren ML Pipeline tahminidir.</small>
      </div>
      <div className="result-summary">
        <p>DEĞERLENDİRİLEN ARAÇ</p>
        <h4>{form.marka} <span>•</span> {form.yıl}</h4>
        <ResultGroup label="Teknik" values={[
          `${Number(form.kilometre_Km).toLocaleString("tr-TR")} km`, form.vitesTipi,
          form.yakitTuru, form.kasaTipi, form.motorGucu_HP, form.motorHacmi_Cc, form.cekisTipi,
        ]} />
        <ResultGroup label="Kondisyon" values={[
          `${form.orjinal_parça_sayısı} orijinal`, `${form.lokal_boyalı_parça_sayısı} lokal boyalı`,
          `${form.boyalı_parça_sayısı} boyalı`, `${form.değişen_parça_sayısı} değişen`,
        ]} />
        <p className="disclaimer">Bu sonuç, girdiğiniz özellikler ve eğitilmiş model verileri temelinde üretilir; ekspertiz veya kesin satış fiyatı değildir.</p>
        <button type="button" className="new-analysis" onClick={onReset}>Yeni Analiz Başlat <span>↗</span></button>
      </div>
    </div>
  );
}

function ResultGroup({ label, values }: { label: string; values: string[] }) {
  return <section className="result-detail-group"><strong>{label}</strong><div>{values.map((value) => <span key={value}>{value}</span>)}</div></section>;
}
