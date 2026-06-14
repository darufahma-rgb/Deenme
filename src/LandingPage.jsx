import { useEffect, useState, useRef } from 'react';

export function LandingPage({ onEnter }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div className="landing-root">

      {/* ── HERO ── */}
      <section className="lp-hero">
        <div className={'lp-hero-content' + (visible ? ' lp-visible' : '')}>

          <div className="lp-bismillah">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</div>

          {/* Logo */}
          <div className="lp-logo-wrap">
            <div className="lp-logo-icon">
              <img src="./assets/Deenme_logo.png" alt="Deenme"
                style={{ width: 28, height: 'auto', filter: 'brightness(0) saturate(100%) invert(40%) sepia(40%) saturate(400%) hue-rotate(90deg)' }} />
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

        {/* Phone mockup */}
        <div className={'lp-phone-wrap' + (visible ? ' lp-visible' : '')}>
          <div className="lp-phone">
            <div className="lp-phone-screen">
              <div className="lp-mock-header">
                <div className="lp-mock-date">الأحد، ١٤ يونيو ٢٠٢٦</div>
                <div className="lp-mock-title">Minggu, 14 Juni 2026</div>
              </div>

              {/* Timbangan Amal — sama seperti dashboard */}
              <div className="lp-mock-timbangan">
                <div className="lp-mock-timb-label">⚖️ TIMBANGAN AMAL</div>
                <div className="lp-mock-timb-bar">
                  <div className="lp-mock-timb-fill" style={{ width: '62%' }} />
                </div>
                <div className="lp-mock-timb-rank">مُتَقَدِّم Mutaqaddim</div>
              </div>

              {/* Stat chips — sama seperti dashboard */}
              <div className="lp-mock-stats">
                <div className="lp-mock-stat">
                  <div className="lp-mock-stat-num">12</div>
                  <div className="lp-mock-stat-label">streak</div>
                </div>
                <div className="lp-mock-stat">
                  <div className="lp-mock-stat-num">84%</div>
                  <div className="lp-mock-stat-label">skor</div>
                </div>
                <div className="lp-mock-stat">
                  <div className="lp-mock-stat-num">4/5</div>
                  <div className="lp-mock-stat-label">solat</div>
                </div>
              </div>

              {/* Prayer cards */}
              <div className="lp-mock-section-label">WAKTU SHOLAT</div>
              {[
                { name: 'Subuh',   time: '04:37', done: true  },
                { name: 'Dzuhur',  time: '11:54', done: true  },
                { name: 'Ashar',   time: '15:16', done: true  },
                { name: 'Maghrib', time: '17:47', done: false },
                { name: 'Isya',    time: '19:02', done: false },
              ].map((s) => (
                <div key={s.name} className={'lp-mock-prayer' + (s.done ? ' done' : '')}>
                  <div className="lp-mock-ring">{s.name[0]}</div>
                  <div>
                    <div className="lp-mock-prayer-name">{s.name}</div>
                    <div className="lp-mock-prayer-time">{s.time}</div>
                  </div>
                  <span className="lp-mock-status">{s.done ? '✓' : '○'}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lp-phone-glow" />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="lp-features">
        <div className="lp-section-label">Apa yang ada di Deenme?</div>
        <h2 className="lp-section-title">Semua yang kamu butuhkan<br/>untuk istiqomah</h2>
        <div className="lp-features-grid">
          {[
            { icon: '🕌', title: 'Tracker Solat',  desc: 'Catat 5 waktu solat dengan status tepat, telat, atau qadha. Lengkap dengan jam aktual otomatis.' },
            { icon: '📿', title: 'Misi Amalan',    desc: 'Setiap selesai sholat, muncul misi dzikir, rawatib, dan doa yang dianjurkan. Gamifikasi yang bermakna.' },
            { icon: '🔥', title: 'Streak & Level', desc: 'Bangun streak harian, kumpulkan poin amal, dan naik level dari Mubtadi hingga Muttaqi.' },
            { icon: '📖', title: 'Jurnal Harian',  desc: 'Tulis refleksi harianmu secara bebas. AI membantu merapikan dengan format yang indah.' },
            { icon: '🤲', title: 'Bank Doa',       desc: 'Koleksi doa dari Al-Quran dan hadits shahih, terorganisir per situasi dan waktu sholat.' },
            { icon: '📊', title: 'Statistik',      desc: 'Lihat progress ibadahmu lewat grafik mingguan, heatmap bulanan, dan ringkasan streak.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="lp-feature-card">
              <div className="lp-feature-icon">{icon}</div>
              <h3 className="lp-feature-title">{title}</h3>
              <p className="lp-feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUOTE ── */}
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
          <img src="./assets/Deenme_logo.png" alt="Deenme"
            style={{ width: 20, height: 'auto', filter: 'brightness(0) invert(.7) sepia(.3)', opacity: .7 }} />
          Deenme
        </div>
        <div className="lp-footer-sub">Dibuat dengan ❤️ oleh Dar Dev · Cairo, 2026</div>
      </footer>

    </div>
  );
}
