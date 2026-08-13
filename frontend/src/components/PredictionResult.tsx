import { PredictionResponse } from "../services/prediction";
import { FormValues } from "../types";
import { generateVehicleInsights, VehicleInsight } from "../utils/vehicleInsights";

const priceFormatter = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });

export function PredictionResult({ form, result, onReset }: { form: FormValues; result: PredictionResponse; onReset: () => void }) {
  const insights = generateVehicleInsights(form);

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
      <section className="insights-panel" aria-labelledby="insights-title">
        <div className="insights-heading">
          <div>
            <p>ŞEFFAF KURAL TABANLI AÇIKLAMA</p>
            <h4 id="insights-title">AI Değerlendirmesi</h4>
          </div>
          <span>CarSight tahmini; motor gücü, model yılı, kilometre, teknik yapı ve kondisyon bilgilerini birlikte değerlendirir.</span>
        </div>
        <div className="insight-grid">
          {insights.map((insight) => <InsightCard key={insight.title} insight={insight} />)}
        </div>
        <p className="insight-method-note">Bu açıklamalar, girilen araç özellikleri ve modelin bilinen global özellik önemleri üzerinden deterministik kurallarla oluşturulur; kişisel SHAP analizi veya gerçek zamanlı piyasa karşılaştırması değildir.</p>
      </section>
    </div>
  );
}

function ResultGroup({ label, values }: { label: string; values: string[] }) {
  return <section className="result-detail-group"><strong>{label}</strong><div>{values.map((value) => <span key={value}>{value}</span>)}</div></section>;
}

function InsightCard({ insight }: { insight: VehicleInsight }) {
  return (
    <article className={`insight-card ${insight.tone}`}>
      <i aria-hidden="true"><span /></i>
      <div><h5>{insight.title}</h5><p>{insight.description}</p></div>
    </article>
  );
}
