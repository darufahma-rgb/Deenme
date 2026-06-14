import { useState, useEffect } from 'react';

export function LandingPage({ onEnter }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const FEATURES = [
    { icon: '🕌', title: 'Tracker Sholat', ar: 'مَوَاقِيتُ الصَّلَاة', desc: 'Catat 5 waktu sholat — tepat waktu, telat, atau qadha. Jadwal otomatis per kota.' },
    { icon: '📿', title: 'Misi Amalan',    ar: 'مُهِمَّاتُ العِبَادَة', desc: 'Panduan dzikir & doa setelah setiap sholat. Lengkap bacaan Arab, latin, arti, dan dalil.' },
    { icon: '⭐', title: 'Rank & XP',      ar: 'الدَّرَجَاتُ وَالنُّقَاط', desc: 'Dari Mubtadi hingga Ulul Albab. Setiap ibadah menghasilkan XP dan menaikkan rankmu.' },
    { icon: '🤲', title: 'Bank Doa',       ar: 'بَنْكُ الأَدْعِيَة',      desc: '50+ doa dari Al-Quran & hadits shahih. Lengkap kisah latar belakang dan faedah.' },
    { icon: '📖', title: 'Jurnal Harian',  ar: 'يَوْمِيَّاتٌ شَخْصِيَّة', desc: 'Tulis refleksi harian. Rapikan AI dan Tafsir Mimpi berbasis kecerdasan buatan.' },
    { icon: '📊', title: 'Statistik',      ar: 'إِحْصَائِيَّاتٌ يَوْمِيَّة', desc: 'Laporan harian & mingguan dengan grade A–F, heatmap, bar chart, dan rekap qadha.' },
  ];

  const RANKS = [
    { rank: 'E',   label: 'Mubtadi',    ar: 'مُبْتَدِئ',        color: '#94a3b8' },
    { rank: 'D',   label: 'Mutaallim',  ar: 'مُتَعَلِّم',       color: '#6688cc' },
    { rank: 'C',   label: 'Mutawassit', ar: 'مُتَوَسِّط',       color: '#386641' },
    { rank: 'B',   label: 'Mutaqaddim', ar: 'مُتَقَدِّم',       color: '#6a994e' },
    { rank: 'A',   label: 'Muttaqin',   ar: 'مُتَّقِن',         color: '#a7c957' },
    { rank: 'S',   label: 'Wali',       ar: 'وَلِيّ',           color: '#f59e0b' },
    { rank: 'SS',  label: 'Shiddiq',    ar: 'صِدِّيق',          color: '#ef4444' },
    { rank: 'SSS', label: 'Ulul Albab', ar: 'أُولُو الأَلْبَاب', color: '#a855f7' },
  ];

  const C = {
    bg:       '#f5edda',
    surface:  '#faf5e8',
    border:   '#e2d9c0',
    green:    '#2d5a27',
    greenMid: '#386641',
    greenLt:  '#6a994e',
    lime:     '#a7c957',
    text:     '#1a2e1c',
    textMid:  '#3d5c3f',
    textMuted:'#7a8f7a',
    dark:     '#111c12',
    darkMid:  '#1a2e1c',
    cream:    '#f5edda',
  };

  return (
    <div style={{ minHeight: '100dvh', background: C.bg, fontFamily: 'var(--f-head)', color: C.text, overflowX: 'hidden' }}>

      {/* ════════════ NAVBAR ════════════ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(245,237,218,.9)', backdropFilter: 'blur(28px)',
        borderBottom: `1px solid ${C.border}`,
        padding: '0 clamp(20px, 5vw, 48px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="./assets/Deenme_logo.png" alt="Deenme" style={{
            width: 38, height: 'auto',
            filter: 'brightness(0) saturate(100%) invert(22%) sepia(35%) saturate(700%) hue-rotate(95deg) brightness(80%)',
          }} />
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-.02em', color: C.green }}>Deenme</span>
        </div>
        <button onClick={onEnter} style={{
          background: C.greenMid, color: C.cream,
          border: 'none', borderRadius: 10, padding: '9px 22px',
          fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 14,
          cursor: 'pointer', letterSpacing: '-.01em',
          boxShadow: '0 2px 12px rgba(56,102,65,.3)',
          transition: 'background .15s, transform .12s, box-shadow .15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = C.green; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = C.greenMid; e.currentTarget.style.transform = 'translateY(0)'; }}
        >Masuk</button>
      </nav>

      {/* ════════════ HERO ════════════ */}
      <section style={{
        minHeight: 'calc(100dvh - 60px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(48px, 8vh, 80px) clamp(20px, 5vw, 48px)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>

        {/* BG decorative orb */}
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 500, borderRadius: '50%',
          background: `radial-gradient(ellipse, color-mix(in srgb, ${C.greenMid} 12%, transparent), transparent 68%)`,
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        {/* Fine grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `linear-gradient(${C.border}55 1px, transparent 1px), linear-gradient(90deg, ${C.border}55 1px, transparent 1px)`,
          backgroundSize: '52px 52px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 40%, transparent 100%)',
        }} />

        <div style={{ position: 'relative', maxWidth: 700, zIndex: 1 }}>

          {/* Bismillah */}
          <div style={{
            fontFamily: 'var(--f-ar)', fontSize: 'clamp(16px, 2.5vw, 22px)',
            color: C.greenLt, direction: 'rtl', marginBottom: 20,
            opacity: mounted ? .9 : 0, transition: 'opacity .6s .1s',
            letterSpacing: '.04em', lineHeight: 1.8,
          }}>
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </div>

          {/* Headline */}
          <h1 style={{
            fontWeight: 800, fontSize: 'clamp(38px, 6vw, 64px)',
            lineHeight: 1.05, letterSpacing: '-.04em',
            color: C.text, margin: '0 0 8px',
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity .6s .15s, transform .6s .15s',
          }}>
            Jaga ibadahmu,<br />
            <span style={{
              color: C.greenMid,
              backgroundImage: `linear-gradient(135deg, ${C.greenMid}, ${C.lime})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>setiap hari.</span>
          </h1>

          {/* Tagline badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `rgba(56,102,65,.08)`, border: `1px solid rgba(56,102,65,.2)`,
            borderRadius: 999, padding: '6px 16px', margin: '18px 0 22px',
            opacity: mounted ? 1 : 0, transition: 'opacity .6s .25s',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.greenMid }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: C.greenMid, letterSpacing: '.04em' }}>
              🎁 Hadiah eksklusif untuk member Talqeeh
            </span>
          </div>

          {/* Sub */}
          <p style={{
            fontSize: 'clamp(15px, 1.8vw, 17px)', color: C.textMid, lineHeight: 1.8,
            maxWidth: 500, margin: '0 auto 36px',
            opacity: mounted ? 1 : 0, transition: 'opacity .6s .3s',
          }}>
            Tracker sholat, dzikir, dan amalan harian dengan sistem rank, streak, dan bank doa.
            Dirancang untuk kamu yang ingin istiqamah.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
            marginBottom: 16,
            opacity: mounted ? 1 : 0, transition: 'opacity .6s .38s',
          }}>
            <button onClick={onEnter} style={{
              background: `linear-gradient(135deg, ${C.greenMid}, ${C.green})`,
              color: C.cream, border: 'none', borderRadius: 14,
              padding: '15px 36px', fontFamily: 'var(--f-head)', fontWeight: 700,
              fontSize: 16, cursor: 'pointer', letterSpacing: '-.01em',
              boxShadow: `0 6px 28px rgba(56,102,65,.35), 0 2px 8px rgba(56,102,65,.2)`,
              transition: 'transform .15s, box-shadow .15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 10px 36px rgba(56,102,65,.45), 0 4px 12px rgba(56,102,65,.25)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 6px 28px rgba(56,102,65,.35), 0 2px 8px rgba(56,102,65,.2)`; }}
            >
              Mulai Sekarang →
            </button>
            <button onClick={() => document.getElementById('fitur')?.scrollIntoView({ behavior: 'smooth' })} style={{
              background: 'transparent', color: C.greenMid,
              border: `1.5px solid rgba(56,102,65,.28)`,
              borderRadius: 14, padding: '14px 28px',
              fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 15,
              cursor: 'pointer', transition: 'border-color .15s, background .15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(56,102,65,.6)`; e.currentTarget.style.background = `rgba(56,102,65,.05)`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `rgba(56,102,65,.28)`; e.currentTarget.style.background = 'transparent'; }}
            >
              Lihat Fitur
            </button>
          </div>
          <p style={{ fontSize: 12, color: C.textMuted, opacity: mounted ? 1 : 0, transition: 'opacity .6s .45s' }}>
            Masukkan kode undangan dari Talqeeh untuk masuk
          </p>
        </div>
      </section>

      {/* ════════════ STATS STRIP ════════════ */}
      <div style={{ background: C.greenMid, padding: '22px clamp(20px,5vw,48px)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '12px 32px' }}>
          {[
            { val: '50+', label: 'Doa & Dzikir' },
            { val: '8',   label: 'Waktu Ibadah' },
            { val: '8',   label: 'Rank Level' },
            { val: '2',   label: 'Zona Waktu' },
          ].map(({ val, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: 'clamp(22px, 3vw, 30px)', color: C.lime, letterSpacing: '-.03em', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: 12, color: 'rgba(245,237,218,.65)', marginTop: 5, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════ TALQEEH BANNER ════════════ */}
      <div style={{
        background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
        padding: 'clamp(28px, 4vw, 40px) clamp(20px, 5vw, 48px)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ fontWeight: 700, fontSize: 10, color: C.greenLt, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 10 }}>
            Tentang Deenme
          </div>
          <p style={{ fontWeight: 600, fontSize: 'clamp(14px, 2vw, 16px)', color: C.text, lineHeight: 1.75, marginBottom: 18 }}>
            Deenme lahir sebagai hadiah kecil untuk para anggota Talqeeh —
            komunitas belajar Islam yang memberi ruang tumbuh, belajar, dan saling menguatkan.
          </p>
          <a href="https://talqeeh.vercel.app" target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: C.greenMid, border: `1.5px solid rgba(56,102,65,.3)`,
            borderRadius: 10, padding: '9px 20px',
            fontWeight: 700, fontSize: 13, textDecoration: 'none',
            transition: 'border-color .15s, background .15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.greenMid; e.currentTarget.style.background = `rgba(56,102,65,.06)`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `rgba(56,102,65,.3)`; e.currentTarget.style.background = 'transparent'; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Kunjungi Talqeeh
          </a>
        </div>
      </div>

      {/* ════════════ FEATURES ════════════ */}
      <section id="fitur" style={{ padding: 'clamp(56px,8vw,88px) clamp(20px,5vw,48px)', maxWidth: 1040, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontWeight: 700, fontSize: 11, color: C.greenLt, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 12 }}>
            Fitur Unggulan
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 'clamp(24px,3.5vw,38px)', color: C.text, letterSpacing: '-.03em', lineHeight: 1.15, margin: 0 }}>
            Semua yang kamu butuhkan<br />untuk ibadah yang lebih baik
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(285px, 1fr))', gap: 14 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 18, padding: '22px 20px',
              transition: 'transform .18s cubic-bezier(.22,1,.36,1), border-color .15s, box-shadow .18s',
              cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `rgba(56,102,65,.4)`; e.currentTarget.style.boxShadow = `0 12px 32px rgba(56,102,65,.1)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: 28, marginBottom: 14, lineHeight: 1 }}>{f.icon}</div>
              <div style={{ fontFamily: 'var(--f-ar)', fontSize: 11, color: C.greenLt, direction: 'rtl', marginBottom: 5, opacity: .8 }}>{f.ar}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: C.textMid, lineHeight: 1.75 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ RANK SYSTEM ════════════ */}
      <section style={{
        background: C.dark, padding: 'clamp(56px,8vw,88px) clamp(20px,5vw,48px)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: `radial-gradient(ellipse, rgba(167,201,87,.07), transparent 65%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontWeight: 700, fontSize: 11, color: C.lime, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 12 }}>
            Sistem Gamifikasi
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 'clamp(22px,3.5vw,34px)', color: C.cream, letterSpacing: '-.03em', marginBottom: 12 }}>
            Naiki rank lewat ibadah
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(245,237,218,.5)', lineHeight: 1.8, maxWidth: 420, margin: '0 auto 44px' }}>
            Setiap sholat, dzikir, dan amalan menghasilkan XP. Dari Mubtadi hingga Ulul Albab — perjalanan istiqamahmu tercatat.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {RANKS.map((r, i) => (
              <div key={r.rank} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(18px)',
                transition: `opacity .45s ${i * 55}ms, transform .45s ${i * 55}ms cubic-bezier(.22,1,.36,1)`,
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 15,
                  background: `rgba(245,237,218,.04)`,
                  border: `1.5px solid ${r.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: 18, color: r.color,
                  boxShadow: `0 0 20px -6px ${r.color}`,
                  fontFamily: 'var(--f-head)',
                }}>
                  {r.rank}
                </div>
                <div style={{ fontWeight: 600, fontSize: 10, color: 'rgba(245,237,218,.45)', textAlign: 'center' }}>{r.label}</div>
                <div style={{ fontFamily: 'var(--f-ar)', fontSize: 10, color: 'rgba(245,237,218,.25)', direction: 'rtl' }}>{r.ar}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ TALQEEH CTA ════════════ */}
      <section style={{
        background: `linear-gradient(160deg, ${C.greenMid} 0%, ${C.green} 100%)`,
        padding: 'clamp(64px,9vw,100px) clamp(20px,5vw,48px)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 500, background: `radial-gradient(ellipse, rgba(167,201,87,.18), transparent 65%)`, filter: 'blur(20px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 20, right: 40, fontFamily: 'var(--f-ar)', fontSize: 120, color: 'rgba(255,255,255,.04)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>الله</div>

        <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
          <div style={{ fontWeight: 700, fontSize: 10, color: C.lime, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 18 }}>
            Dari kami, untuk Talqeeh
          </div>
          <div style={{ fontFamily: 'var(--f-ar)', fontSize: 'clamp(20px, 3vw, 28px)', color: '#ecf39e', direction: 'rtl', marginBottom: 20, lineHeight: 1.7 }}>
            جَزَاكُمُ اللهُ خَيْرًا
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 'clamp(22px,4vw,38px)', color: C.cream, letterSpacing: '-.03em', lineHeight: 1.2, marginBottom: 18 }}>
            Terima kasih sudah jadi bagian<br />dari keluarga Talqeeh
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(245,237,218,.75)', lineHeight: 1.85, marginBottom: 10 }}>
            Deenme adalah wujud syukur kami atas kepercayaan kalian.
            Semoga setiap amalan yang tercatat menjadi saksi kebaikan di hari yang paling kita harapkan.
          </p>
          <p style={{ fontSize: 14, color: 'rgba(245,237,218,.5)', marginBottom: 38, fontStyle: 'italic' }}>Barakallahu fiikum. 🌿</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onEnter} style={{
              background: C.cream, color: C.green, border: 'none',
              borderRadius: 14, padding: '14px 32px',
              fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 15,
              cursor: 'pointer', transition: 'transform .15s, box-shadow .15s',
              boxShadow: '0 4px 20px rgba(0,0,0,.2)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,.2)'; }}
            >
              Masuk ke Deenme →
            </button>
            <a href="https://talqeeh.vercel.app" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              color: '#ecf39e', border: '1.5px solid rgba(236,243,158,.3)',
              borderRadius: 14, padding: '13px 24px',
              fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 14,
              textDecoration: 'none', transition: 'border-color .15s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(236,243,158,.7)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(236,243,158,.3)'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Kunjungi Talqeeh
            </a>
          </div>
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer style={{
        background: C.darkMid,
        padding: '20px clamp(20px,5vw,48px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 10,
        borderTop: `1px solid rgba(56,102,65,.2)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="./assets/Deenme_logo.png" alt="Deenme" style={{
            width: 24, height: 24,
            filter: 'brightness(0) invert(.6)',
          }} />
          <span style={{ fontWeight: 700, fontSize: 13, color: 'rgba(245,237,218,.7)' }}>Deenme</span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(245,237,218,.3)', fontFamily: 'var(--f-head)' }}>
          Hadiah kecil dari Dar Dev · untuk keluarga Talqeeh · 2026
        </div>
      </footer>

    </div>
  );
}
