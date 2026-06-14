import { useState, useEffect } from 'react';

export function LandingPage({ onLogin, onEnter }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  const handleLogin = onLogin || onEnter;

  const FEATURES = [
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="2" y1="18" x2="4" y2="18"/><line x1="20" y1="18" x2="22" y2="18"/><line x1="19.78" y1="10.22" x2="18.36" y2="11.64"/></svg>,
      title: 'Tracker Sholat',
      desc: 'Catat 5 waktu sholat harian — tepat waktu, telat, atau qadha. Lengkap dengan jadwal otomatis per kota.',
    },
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
      title: 'Amalan Harian',
      desc: 'Panduan amalan per waktu sholat — dari Tahajud hingga Isya. Lengkap dengan bacaan Arab, latin, arti, dalil, dan keutamaan.',
    },
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
      title: 'Sistem Rank & XP',
      desc: 'Dari Rank E (Mubtadi) hingga SSS (Ulul Albab). Kumpulkan XP dari ibadah, naiki rank, dan jaga streak harianmu.',
    },
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
      title: 'Bank Doa',
      desc: '50+ doa dari Al-Quran & hadits shahih. Lengkap dengan kisah di balik doa, faedah, dan sumber rujukan.',
    },
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
      title: 'Jurnal Harian',
      desc: 'Tulis catatan harian dengan editor sederhana. Ada fitur Rapikan AI dan Tafsir Mimpi berbasis kecerdasan buatan.',
    },
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
      title: 'Statistik Ibadah',
      desc: 'Laporan harian & mingguan dengan grade A–F, heatmap, bar chart, dan rekap qadha otomatis.',
    },
  ];

  const RANKS = [
    { rank: 'E',   label: 'Mubtadi',    color: '#888' },
    { rank: 'D',   label: 'Mutaallim',  color: '#6688cc' },
    { rank: 'C',   label: 'Mutawassit', color: '#386641' },
    { rank: 'B',   label: 'Mutaqaddim', color: '#6a994e' },
    { rank: 'A',   label: 'Muttaqin',   color: '#a7c957' },
    { rank: 'S',   label: 'Wali',       color: '#f0a500' },
    { rank: 'SS',  label: 'Shiddiq',    color: '#bc4749' },
    { rank: 'SSS', label: 'Ulul Albab', color: '#8b5cf6' },
  ];

  return (
    <div style={{ minHeight: '100dvh', background: '#f2e8cf', fontFamily: 'var(--f-head)', color: '#1a2e1c', overflowX: 'hidden' }}>

      {/* ── NAVBAR ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(242,232,207,.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #ddd4b0', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: '#386641', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--f-ar)', fontSize: 16, color: '#f2e8cf' }}>د</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-.01em', color: '#1a2e1c' }}>Deenme</span>
        </div>
        <button
          onClick={handleLogin}
          style={{ background: '#386641', color: '#f2e8cf', border: 'none', borderRadius: 10, padding: '8px 20px', fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
        >
          Masuk
        </button>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: '80px 32px 64px', maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'color-mix(in srgb, #386641 10%, transparent)', border: '1px solid color-mix(in srgb, #386641 25%, transparent)', borderRadius: 999, padding: '5px 14px', marginBottom: 24 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#386641' }} />
          <span style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 12, color: '#386641', letterSpacing: '.04em' }}>Personal Islamic Ibadah Tracker</span>
        </div>
        <h1 style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 'clamp(32px, 6vw, 52px)', lineHeight: 1.1, letterSpacing: '-.03em', color: '#1a2e1c', marginBottom: 20 }}>
          Jaga ibadahmu,<br />
          <span style={{ color: '#386641' }}>satu hari satu langkah.</span>
        </h1>
        <p style={{ fontSize: 16, color: '#386641', lineHeight: 1.75, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
          Deenme membantu kamu melacak sholat, mengamalkan dzikir, mencatat jurnal, dan memantau progress ibadah harian — dengan sistem gamifikasi yang bikin istiqamah terasa menyenangkan.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleLogin}
            style={{ background: '#386641', color: '#f2e8cf', border: 'none', borderRadius: 12, padding: '14px 32px', fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 20px rgba(56,102,65,.25)' }}
          >
            Mulai Sekarang →
          </button>
          <button
            onClick={() => document.getElementById('fitur').scrollIntoView({ behavior: 'smooth' })}
            style={{ background: 'transparent', color: '#386641', border: '1px solid color-mix(in srgb, #386641 35%, transparent)', borderRadius: 12, padding: '14px 28px', fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
          >
            Lihat Fitur
          </button>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{ background: '#386641', padding: '28px 32px', display: 'flex', justifyContent: 'center', gap: 'clamp(24px, 6vw, 80px)', flexWrap: 'wrap' }}>
        {[
          { val: '50+', label: 'Doa & Dzikir' },
          { val: '8',   label: 'Waktu Ibadah' },
          { val: '8',   label: 'Rank Sistem' },
          { val: '2',   label: 'Zona Waktu' },
        ].map(({ val, label }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 28, color: '#ecf39e', letterSpacing: '-.02em', lineHeight: 1 }}>{val}</div>
            <div style={{ fontFamily: 'var(--f-head)', fontSize: 12, color: 'rgba(242,232,207,.7)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section id="fitur" style={{ padding: '72px 32px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 11, color: '#6a994e', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 12 }}>Fitur Unggulan</div>
          <h2 style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 'clamp(24px, 4vw, 36px)', color: '#1a2e1c', letterSpacing: '-.02em', margin: 0 }}>
            Semua yang kamu butuhkan<br />untuk ibadah yang lebih baik
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div key={i}
              style={{ background: i % 2 === 0 ? '#faf4e4' : '#fff', border: '1px solid #ddd4b0', borderRadius: 16, padding: '24px 22px', transition: 'transform .15s', cursor: 'default' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'color-mix(in srgb, #386641 10%, transparent)', border: '1px solid color-mix(in srgb, #386641 20%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#386641', marginBottom: 16 }}>
                {f.icon}
              </div>
              <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 15, color: '#1a2e1c', marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: '#386641', lineHeight: 1.75 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── RANK SYSTEM ── */}
      <section style={{ background: '#faf4e4', borderTop: '1px solid #ddd4b0', borderBottom: '1px solid #ddd4b0', padding: '72px 32px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 11, color: '#6a994e', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 12 }}>Sistem Gamifikasi</div>
          <h2 style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 'clamp(22px, 4vw, 32px)', color: '#1a2e1c', letterSpacing: '-.02em', marginBottom: 12 }}>
            Naiki rank lewat ibadah
          </h2>
          <p style={{ fontSize: 14, color: '#386641', lineHeight: 1.75, marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
            Setiap sholat, dzikir, dan amalan menghasilkan XP. Kumpulkan XP untuk naik rank — dari Mubtadi hingga Ulul Albab.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {RANKS.map((r, i) => (
              <div key={r.rank} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)', transition: `opacity .4s ${i * 60}ms, transform .4s ${i * 60}ms` }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f2e8cf', border: `1.5px solid ${r.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-head)', fontWeight: 900, fontSize: 18, color: r.color, boxShadow: `0 0 12px -4px ${r.color}60` }}>
                  {r.rank}
                </div>
                <div style={{ fontFamily: 'var(--f-head)', fontSize: 10, fontWeight: 600, color: '#6a994e', textAlign: 'center', lineHeight: 1.3 }}>{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ZONA WAKTU ── */}
      <section style={{ padding: '72px 32px', maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 11, color: '#6a994e', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 12 }}>Untuk Masisir & Indonesia</div>
        <h2 style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 'clamp(22px, 4vw, 32px)', color: '#1a2e1c', letterSpacing: '-.02em', marginBottom: 16 }}>
          Jadwal sholat otomatis<br />Cairo & Tangerang
        </h2>
        <p style={{ fontSize: 14, color: '#386641', lineHeight: 1.75, marginBottom: 32 }}>
          Ganti zona waktu dengan satu klik. Jadwal sholat menyesuaikan otomatis — Cairo dengan metode Egyptian General Authority, Tangerang dengan metode KEMENAG.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { flag: '🇪🇬', city: 'Cairo',     tz: 'EEST · UTC+3 (musim panas)', method: 'Egyptian Authority' },
            { flag: '🇮🇩', city: 'Tangerang', tz: 'WIB · UTC+7', method: 'KEMENAG' },
          ].map(z => (
            <div key={z.city} style={{ background: '#faf4e4', border: '1px solid #ddd4b0', borderRadius: 14, padding: '18px 24px', minWidth: 180, textAlign: 'left' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{z.flag}</div>
              <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 15, color: '#1a2e1c', marginBottom: 4 }}>{z.city}</div>
              <div style={{ fontFamily: 'var(--f-head)', fontSize: 12, color: '#6a994e', marginBottom: 2 }}>{z.tz}</div>
              <div style={{ fontFamily: 'var(--f-head)', fontSize: 11, color: '#aaa', marginTop: 4 }}>Metode: {z.method}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#386641', padding: '72px 32px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--f-ar)', fontSize: 22, color: '#ecf39e', direction: 'rtl', marginBottom: 16, opacity: .8 }}>
          وَاعْبُدْ رَبَّكَ حَتَّىٰ يَأْتِيَكَ الْيَقِينُ
        </div>
        <div style={{ fontFamily: 'var(--f-head)', fontSize: 13, color: 'rgba(242,232,207,.7)', marginBottom: 32 }}>
          "Dan sembahlah Tuhanmu sampai datang kepadamu keyakinan." — QS. Al-Hijr: 99
        </div>
        <h2 style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 'clamp(22px, 4vw, 36px)', color: '#f2e8cf', letterSpacing: '-.02em', marginBottom: 12 }}>
          Mulai istiqamah hari ini
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(242,232,207,.75)', marginBottom: 32, lineHeight: 1.75 }}>
          Daftar dengan kode member dan mulai lacak ibadahmu.
        </p>
        <button
          onClick={handleLogin}
          style={{ background: '#ecf39e', color: '#1a2e1c', border: 'none', borderRadius: 12, padding: '14px 36px', fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}
        >
          Masuk ke Deenme →
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#1a2e1c', padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: '#386641', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--f-ar)', fontSize: 13, color: '#f2e8cf' }}>د</span>
          </div>
          <span style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 13, color: '#f2e8cf' }}>Deenme</span>
        </div>
        <div style={{ fontFamily: 'var(--f-head)', fontSize: 11, color: 'rgba(242,232,207,.4)' }}>
          Dibuat dengan ♥ oleh Dar Dev · 2026
        </div>
      </footer>

    </div>
  );
}
