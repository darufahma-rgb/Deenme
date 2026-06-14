import { useEffect, useState } from 'react';

export function LandingPage({ onEnter }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div className="landing-root">

      {/* ── HERO SECTION ── */}
      <section className="lp-hero">
        <div className={'lp-hero-content' + (visible ? ' lp-visible' : '')}>
          <div className="lp-bismillah">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</div>
          <div className="lp-logo-wrap">
            <div className="lp-logo-icon">
  <img src="/assets/Deenme_logo.png" alt="Deenme" style={{ width: 30, height: 'auto', filter: 'brightness(0) saturate(100%) invert(80%) sepia(30%) saturate(400%) hue-rotate(90deg)' }} />
</div>
            <span className="lp-logo-text">Deenme</span>
          </div>
          <h1 className="lp-headline">
            Jaga Ibadahmu.<br/>
            <span className="lp-headline-accent">Setiap Hari.</span>
          </h1>
          <p className="lp-sub">
            Tracker solat, dzikir, dan amalan harian yang dirancang untuk membantu kamu istiqomah — dengan sistem misi, streak, dan doa personal.
          </p>
          <button className="lp-cta" onClick={onEnter}>
            Mulai Sekarang
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <p className="lp-cta-sub">Butuh kode undangan untuk masuk</p>
        </div>

        {/* Floating mock phone */}
        <div className={'lp-phone-wrap' + (visible ? ' lp-visible' : '')}>
          <div className="lp-phone">
            <div className="lp-phone-screen">
              <div className="lp-mock-header">
                <div className="lp-mock-date">السبت، ١٣ يونيو</div>
                <div className="lp-mock-title">Sabtu, 13 Juni 2026</div>
              </div>
              <div className="lp-mock-streak">
                <span className="lp-mock-streak-num">12</span>
                <span className="lp-mock-streak-label">hari beruntun 🔥</span>
              </div>
              {['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'].map((s, i) => (
                <div key={s} className={'lp-mock-prayer' + (i < 3 ? ' done' : '')}>
                  <div className="lp-mock-ring">{s[0]}</div>
                  <span>{s}</span>
                  <span className="lp-mock-status">{i < 3 ? '✓' : '—'}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lp-phone-glow" />
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section className="lp-features">
        <div className="lp-section-label">Apa yang ada di Deenme?</div>
        <h2 className="lp-section-title">Semua yang kamu butuhkan<br/>untuk istiqomah</h2>
        <div className="lp-features-grid">
          {[
            { icon: '🕌', title: 'Tracker Solat', desc: 'Catat 5 waktu solat dengan status tepat, telat, atau qadha. Lengkap dengan jam aktual otomatis.' },
            { icon: '📿', title: 'Misi Amalan', desc: 'Setiap selesai sholat, muncul misi dzikir, rawatib, dan doa yang dianjurkan. Gamifikasi yang bermakna.' },
            { icon: '🔥', title: 'Streak & Level', desc: 'Bangun streak harian, kumpulkan poin amal, dan naik level dari Mubtadi hingga Muttaqi.' },
            { icon: '📖', title: 'Jurnal Harian', desc: 'Tulis refleksi harianmu secara bebas. AI membantu merapikan dengan format yang indah.' },
            { icon: '🤲', title: 'Bank Doa', desc: 'Koleksi doa dari Al-Quran dan hadits shahih, terorganisir per situasi dan waktu sholat.' },
            { icon: '📊', title: 'Statistik', desc: 'Lihat progress ibadahmu lewat grafik mingguan, heatmap bulanan, dan ringkasan streak.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="lp-feature-card">
              <div className="lp-feature-icon">{icon}</div>
              <h3 className="lp-feature-title">{title}</h3>
              <p className="lp-feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUOTE SECTION ── */}
      <section className="lp-quote">
        <div className="lp-quote-ar">وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ</div>
        <div className="lp-quote-tr">"Dan dirikanlah sholat, tunaikanlah zakat, dan rukuklah beserta orang-orang yang rukuk."</div>
        <div className="lp-quote-src">QS. Al-Baqarah: 43</div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="lp-final-cta">
        <h2 className="lp-final-title">Siap mulai istiqomah?</h2>
        <p className="lp-final-sub">Deenme hanya untuk mereka yang diundang.<br/>Hubungi admin untuk mendapatkan kode akses.</p>
        <button className="lp-cta" onClick={onEnter}>
          Masuk ke Deenme
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-footer-logo" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
  <img src="/assets/Deenme_logo.png" alt="Deenme" style={{ width: 20, height: 'auto', filter: 'brightness(0) saturate(100%) invert(80%) sepia(20%) saturate(300%) hue-rotate(90deg)', opacity: .7 }} />
  Deenme
</div>
        <div className="lp-footer-sub">Dibuat dengan ❤️ oleh Dar Dev · Cairo, 2026</div>
      </footer>
    </div>
  );
}
