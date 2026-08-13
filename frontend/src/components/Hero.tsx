import { HeroVehicle } from "./HeroVehicle";

export function Hero() {
  return (
    <header className="hero-v2">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-fog fog-left" aria-hidden="true" />
      <div className="hero-fog fog-right" aria-hidden="true" />

      <nav className="topbar" aria-label="Ana navigasyon">
        <a className="brand-v2" href="/" aria-label="CarSight AI ana sayfa">
          <span className="brand-symbol">CS</span>
          <span>CarSight <em>AI</em></span>
        </a>
      </nav>

      <div className="hero-layout">
        <div className="hero-content">
          <div className="ai-pill"><i aria-hidden="true" /> AI POWERED VALUATION</div>
          <h1>Aracınızın gerçek piyasa değerini <span>yapay zekâ</span> ile keşfedin.</h1>
          <p>
            CarSight, araç özelliklerini makine öğrenmesi modeliyle analiz
            ederek saniyeler içinde tahmini piyasa değeri üretir.
          </p>
          <a className="hero-button" href="#valuation">Ücretsiz Değerle <span>→</span></a>
        </div>

        <HeroVehicle />
      </div>
      <div className="road-lines" aria-hidden="true"><span /><span /><span /></div>
    </header>
  );
}
