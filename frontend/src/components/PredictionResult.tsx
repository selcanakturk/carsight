import { PredictionResponse } from "../services/prediction";
import { FormValues } from "../types";

const priceFormatter = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });

export function PredictionResult({ form, result, onReset }: { form: FormValues; result: PredictionResponse; onReset: () => void }) {
  return (
    <div className="result-dashboard" aria-live="polite">
      <div className="result-main">
        <div className="result-badge"><span>✓</span> ANALİZ TAMAMLANDI</div>
        <p>Tahmini Piyasa Değeri</p>
        <h3>{priceFormatter.format(result.predicted_price)}</h3>
        <small>Makine öğrenmesi modelinin sağladığı tahmini değerdir.</small>
      </div>
      <div className="result-summary">
        <p>DEĞERLENDİRİLEN ARAÇ</p>
        <h4>{form.marka} <span>•</span> {form.yıl}</h4>
        <div><span>{Number(form.kilometre_Km).toLocaleString("tr-TR")} km</span><span>{form.vitesTipi}</span><span>{form.yakitTuru}</span><span>{form.kasaTipi}</span></div>
        <p className="disclaimer">Bu sonuç, girdiğiniz özellikler ve eğitilmiş model verileri temelinde üretilir; ekspertiz veya kesin satış fiyatı değildir.</p>
        <button type="button" className="new-analysis" onClick={onReset}>Yeni Analiz Başlat <span>↗</span></button>
      </div>
    </div>
  );
}
