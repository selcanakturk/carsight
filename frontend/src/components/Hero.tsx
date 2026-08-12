export function Hero() {
  return (
    <header className="hero-v2">
      <div className="hero-grid" aria-hidden="true" />
      <nav className="topbar" aria-label="Ana navigasyon">
        <a className="brand-v2" href="/" aria-label="CarSight AI ana sayfa">
          <span className="brand-symbol">CS</span>
          <span>CarSight <em>AI</em></span>
        </a>
        <a className="nav-cta" href="#valuation">Değerlemeye Başla <span>↘</span></a>
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

        <div className="vehicle-stage" aria-hidden="true">
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <svg className="car-visual" viewBox="0 0 680 320" role="img">
            <defs>
              <linearGradient id="carBody" x1="0" x2="1">
                <stop offset="0" stopColor="#172d27" />
                <stop offset="0.48" stopColor="#5a755d" />
                <stop offset="1" stopColor="#15241f" />
              </linearGradient>
              <linearGradient id="window" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#bed4cc" stopOpacity=".8" />
                <stop offset="1" stopColor="#1a3530" stopOpacity=".95" />
              </linearGradient>
              <filter id="glow"><feGaussianBlur stdDeviation="8" /></filter>
            </defs>
            <ellipse cx="348" cy="260" rx="280" ry="22" fill="#a4e56a" opacity=".2" filter="url(#glow)" />
            <path d="M57 219C70 188 98 173 148 165l89-70c19-15 43-23 68-23h126c27 0 45 9 65 28l64 60 45 14c31 10 43 28 43 52v18H50c-3-9-1-17 7-25Z" fill="url(#carBody)" stroke="#779379" strokeWidth="2" />
            <path d="m225 160 52-55c10-10 24-16 38-16h94c21 0 35 8 50 22l47 49H225Z" fill="url(#window)" stroke="#9db4ab" strokeOpacity=".42" />
            <path d="M376 90v70M217 161h299" stroke="#9fb2aa" strokeOpacity=".35" strokeWidth="2" />
            <path d="M78 201h63M566 188h48" stroke="#b7f77a" strokeWidth="6" strokeLinecap="round" opacity=".9" />
            <path d="M155 229h390" stroke="#0c1713" strokeWidth="5" opacity=".65" />
            <circle cx="177" cy="237" r="54" fill="#0b1210" stroke="#52625c" strokeWidth="6" />
            <circle cx="177" cy="237" r="27" fill="#78917e" stroke="#d5dfda" strokeWidth="4" />
            <circle cx="531" cy="237" r="54" fill="#0b1210" stroke="#52625c" strokeWidth="6" />
            <circle cx="531" cy="237" r="27" fill="#78917e" stroke="#d5dfda" strokeWidth="4" />
            <path d="M267 183h53M417 183h42" stroke="#abc2b8" strokeWidth="3" strokeLinecap="round" opacity=".55" />
          </svg>
          <div className="scan-line" />
          <div className="data-chip chip-one"><span>ML MODEL</span><strong>Random Forest</strong></div>
          <div className="data-chip chip-two"><span>ANALİZ</span><strong>6 araç özelliği</strong></div>
        </div>
      </div>
      <div className="road-lines" aria-hidden="true"><span /><span /><span /></div>
    </header>
  );
}
