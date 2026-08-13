import type { CSSProperties } from "react";

const stages = [
  "Araç özellikleri hazırlanıyor",
  "Teknik ve kondisyon verileri işleniyor",
  "ML modeli tahmini hesaplıyor",
];

export function AnalysisState() {
  return (
    <div className="analysis-state" role="status" aria-live="polite">
      <div className="analysis-orbit" aria-hidden="true"><span>AI</span><i /><i /><i /></div>
      <p className="section-kicker">CARSIGHT AI</p>
      <h3>Aracınız analiz ediliyor...</h3>
      <p>Model, araç özelliklerinizi işleyerek fiyat tahminini hazırlıyor.</p>
      <ol className="analysis-stages">
        {stages.map((stage, index) => <li key={stage} style={{ "--delay": `${index * 0.55}s` } as CSSProperties}><span>{index + 1}</span>{stage}<i /></li>)}
      </ol>
    </div>
  );
}
