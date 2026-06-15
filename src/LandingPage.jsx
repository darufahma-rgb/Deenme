import { useState, useEffect, useRef } from 'react';

export function LandingPage({ onEnter }) {
  const [scrolled, setScrolled] = useState(false);
  const [mounted,  setMounted]  = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.dataset.section]));
          }
        });
      },
      { threshold: 0.15 }
    );
    setTimeout(() => {
      document.querySelectorAll('[data-section]').forEach(el => observer.observe(el));
    }, 100);
    return () => observer.disconnect();
  }, []);

  const isVisible = (section) => visibleSections.has(section);

  const C = {
    bg:      '#0f1710',
    surface: '#161f17',
    border:  'rgba(56,102,65,.18)',
    green:   '#3ecf8e',
    greenDk: '#386641',
    lime:    '#a7c957',
    text:    '#f0ede6',
    textSub: 'rgba(240,237,230,.55)',
    textMut: 'rgba(240,237,230,.28)',
    cream:   '#f5edda',
  };

  const RANKS = [
    { rank: 'E',   label: 'Mubtadi',    color: '#94a3b8', pts: '0' },
    { rank: 'D',   label: 'Mutaallim',  color: '#6688cc', pts: '100' },
    { rank: 'C',   label: 'Mutawassit', color: '#3ecf8e', pts: '300' },
    { rank: 'B',   label: 'Mutaqaddim', color: '#6a994e', pts: '600' },
    { rank: 'A',   label: 'Muttaqin',   color: '#a7c957', pts: '1k' },
    { rank: 'S',   label: 'Wali',       color: '#f59e0b', pts: '2k' },
    { rank: 'SS',  label: 'Shiddiq',    color: '#ef4444', pts: '5k' },
    { rank: 'SSS', label: 'Ulul Albab', color: '#a855f7', pts: '10k' },
  ];

  return (
    <div style={{ minHeight: '100dvh', background: C.bg, fontFamily: 'var(--f-head)', color: C.text, overflowX: 'hidden' }}>

      {/* ══════════ NAVBAR ══════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: isMobile ? 52 : 60,
        background: scrolled ? 'rgba(15,23,16,.94)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: `1px solid ${scrolled ? C.border : 'transparent'}`,
        transition: 'background .3s, border-color .3s',
        display: 'flex', alignItems: 'center',
        padding: `0 ${isMobile ? '18px' : 'clamp(20px, 5vw, 48px)'}`,
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 800, fontSize: isMobile ? 14 : 16, color: C.text, letterSpacing: '-.02em' }}>Deenme</span>
        </div>

        {!isMobile && (
          <div style={{ display: 'flex', gap: 28, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            {['Fitur', 'Rank', 'Talqeeh'].map(l => (
              <button key={l}
                onClick={() => document.getElementById(l.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                style={{ background: 'none', border: 'none', color: C.textSub, fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'color .15s', padding: 0 }}
                onMouseEnter={e => e.currentTarget.style.color = C.text}
                onMouseLeave={e => e.currentTarget.style.color = C.textSub}
              >{l}</button>
            ))}
          </div>
        )}

        <button onClick={onEnter} style={{
          background: C.green, color: '#0a1a0c',
          border: 'none', borderRadius: 8,
          padding: isMobile ? '7px 16px' : '8px 20px',
          fontFamily: 'var(--f-head)', fontWeight: 800,
          fontSize: isMobile ? 12 : 13,
          cursor: 'pointer', letterSpacing: '-.01em',
          boxShadow: `0 0 16px ${C.green}40`,
          transition: 'transform .12s',
          WebkitTapHighlightColor: 'transparent',
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Masuk →
        </button>
      </nav>

      {/* ══════════ HERO ══════════ */}
      <section style={{
        minHeight: '100dvh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: isMobile
          ? '88px 24px 56px'
          : 'clamp(100px, 15vh, 140px) clamp(20px, 5vw, 48px) clamp(60px, 8vh, 80px)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Dot matrix BG */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `radial-gradient(circle, rgba(62,207,142,.18) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          animation: 'dotDrift 20s linear infinite',
          maskImage: 'radial-gradient(ellipse 85% 70% at 50% 40%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 70% at 50% 40%, black 30%, transparent 100%)',
        }} />

        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '5%', left: '50%', width: isMobile ? 400 : 800, height: isMobile ? 300 : 600, background: `radial-gradient(ellipse, ${C.green}16 0%, transparent 65%)`, filter: 'blur(40px)', pointerEvents: 'none', animation: 'orbFloat 12s ease-in-out infinite', transform: 'translateX(-50%)' }} />
        <div style={{ position: 'absolute', top: '30%', left: '10%', width: isMobile ? 200 : 360, height: isMobile ? 200 : 360, background: `radial-gradient(ellipse, rgba(167,201,87,.07) 0%, transparent 65%)`, filter: 'blur(60px)', pointerEvents: 'none', animation: 'orbFloat 16s ease-in-out infinite reverse' }} />

        <div style={{ position: 'relative', width: '100%', maxWidth: isMobile ? '100%' : 760, zIndex: 1 }}>

          {/* Logo mark */}
          <div style={{
            display: 'flex', justifyContent: 'center',
            marginBottom: isMobile ? 14 : 18,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'scale(1)' : 'scale(.5)',
            transition: 'opacity .5s, transform .6s cubic-bezier(.34,1.56,.64,1)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px -4px rgba(167,201,87,.3)',
            }}>
              <img src="./assets/Deenme_logo.png" alt="Deenme" style={{
                width: isMobile ? 34 : 38,
                filter: 'brightness(0) saturate(100%) invert(78%) sepia(30%) saturate(500%) hue-rotate(55deg) brightness(95%)',
              }} />
            </div>
          </div>

          {/* Arabic — di atas judul */}
          <div style={{
            fontFamily: 'var(--f-ar)',
            fontSize: isMobile ? 14 : 'clamp(14px, 2vw, 18px)',
            color: 'rgba(62,207,142,.6)', direction: 'rtl',
            marginBottom: isMobile ? 18 : 24,
            opacity: mounted ? .8 : 0, transition: 'opacity .6s .1s',
          }}>
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </div>

          {/* Headline */}
          <h1 style={{
            fontWeight: 800,
            fontSize: isMobile ? 'clamp(42px, 12vw, 60px)' : 'clamp(52px, 7.5vw, 88px)',
            lineHeight: 1.0, letterSpacing: '-.04em', color: C.text,
            margin: '0 0 4px',
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity .6s .15s, transform .6s .15s',
          }}>
            Jaga ibadahmu,
          </h1>
          <h1 style={{
            fontWeight: 800,
            fontSize: isMobile ? 'clamp(42px, 12vw, 60px)' : 'clamp(52px, 7.5vw, 88px)',
            lineHeight: 1.0, letterSpacing: '-.04em', margin: '0 0 24px',
            background: `linear-gradient(135deg, ${C.green} 0%, ${C.lime} 60%, ${C.green} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity .6s .2s, transform .6s .2s',
          }}>
            setiap hari.
          </h1>

          {/* Eyebrow — di bawah judul */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: `rgba(62,207,142,.08)`, border: `1px solid rgba(62,207,142,.2)`,
            borderRadius: 999, padding: isMobile ? '5px 12px' : '5px 14px',
            marginBottom: isMobile ? 18 : 28,
            opacity: mounted ? 1 : 0, transition: 'opacity .5s .25s',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.green, flexShrink: 0, boxShadow: `0 0 6px ${C.green}` }} />
            <span style={{ fontSize: isMobile ? 11 : 12, fontWeight: 600, color: C.green, letterSpacing: '.04em' }}>
              🎁 Hadiah eksklusif untuk member Talqeeh
            </span>
          </div>

          {/* Sub */}
          <p style={{
            fontSize: isMobile ? 15 : 'clamp(15px, 1.8vw, 18px)',
            color: C.textSub, lineHeight: 1.75,
            maxWidth: isMobile ? '100%' : 520,
            margin: isMobile ? '0 0 28px' : '0 auto 36px',
            padding: isMobile ? '0 4px' : 0,
            opacity: mounted ? 1 : 0, transition: 'opacity .6s .3s',
          }}>
            Tracker sholat, dzikir, dan amalan harian dengan sistem rank, streak, dan bank doa.
            Dirancang untuk istiqamah — satu hari satu langkah.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 10, justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
            opacity: mounted ? 1 : 0, transition: 'opacity .6s .38s',
          }}>
            <button onClick={onEnter} style={{
              background: C.green, color: '#0a1a0c',
              border: 'none', borderRadius: 12,
              padding: isMobile ? '15px 0' : '14px 32px',
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? 360 : 'none',
              fontFamily: 'var(--f-head)', fontWeight: 800,
              fontSize: isMobile ? 16 : 15,
              cursor: 'pointer',
              boxShadow: `0 0 32px ${C.green}50, 0 4px 12px rgba(0,0,0,.3)`,
              transition: 'transform .15s, box-shadow .15s',
              WebkitTapHighlightColor: 'transparent',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Mulai Sekarang →
            </button>
            <button
              onClick={() => document.getElementById('fitur')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'rgba(240,237,230,.05)', color: C.textSub,
                border: `1px solid ${C.border}`, borderRadius: 12,
                padding: isMobile ? '14px 0' : '13px 28px',
                width: isMobile ? '100%' : 'auto',
                maxWidth: isMobile ? 360 : 'none',
                fontFamily: 'var(--f-head)', fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer', transition: 'border-color .15s, color .15s',
                WebkitTapHighlightColor: 'transparent',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(62,207,142,.3)'; e.currentTarget.style.color = C.text; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; }}
            >
              Lihat Fitur
            </button>
          </div>
          <p style={{ fontSize: 12, color: C.textMut, opacity: mounted ? 1 : 0, transition: 'opacity .5s .5s' }}>
            Masukkan kode undangan dari Talqeeh untuk masuk
          </p>
        </div>
      </section>

      {/* ══════════ STATS STRIP ══════════ */}
      <div data-section="stats" style={{
        borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
        padding: `${isMobile ? '20px' : '24px'} clamp(20px,5vw,48px)`,
        background: 'rgba(62,207,142,.03)',
        opacity: isVisible('stats') ? 1 : 0,
        transform: isVisible('stats') ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity .5s, transform .5s',
      }}>
        <div style={{
          maxWidth: 760, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? '16px 12px' : '12px 40px',
          textAlign: 'center',
        }}>
          {[
            { val: '50+', label: 'Doa & Dzikir Shahih' },
            { val: '8',   label: 'Rank Sistem' },
            { val: '5',   label: 'Waktu Sholat' },
            { val: '2',   label: 'Zona Waktu' },
          ].map(({ val, label }) => (
            <div key={label}>
              <div style={{ fontWeight: 800, fontSize: isMobile ? 24 : 'clamp(20px,3vw,28px)', color: C.green, letterSpacing: '-.03em', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: isMobile ? 11 : 12, color: C.textMut, marginTop: 5, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ BENTO FEATURES ══════════ */}
      <section id="fitur" data-section="features" style={{ padding: `clamp(48px,8vw,96px) ${isMobile ? '18px' : 'clamp(20px,5vw,48px)'}`, maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 32 : 48 }}>
          <div style={{ fontWeight: 700, fontSize: 11, color: C.green, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 12 }}>Fitur Unggulan</div>
          <h2 style={{ fontWeight: 800, fontSize: isMobile ? 'clamp(22px,6vw,30px)' : 'clamp(24px,3.5vw,38px)', color: C.text, letterSpacing: '-.03em', lineHeight: 1.15, margin: 0 }}>
            Semua yang kamu butuhkan<br />untuk ibadah yang lebih baik
          </h2>
        </div>

        {/* Bento grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: 12,
          gridTemplateAreas: isMobile ? 'none' : `"full full" "a b" "c d"`,
        }}>
          {/* Full-width card — Tracker Sholat */}
          <div style={{
            gridArea: isMobile ? 'unset' : 'full',
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 18,
            padding: isMobile ? '22px 18px' : '32px 36px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? 16 : 40,
            position: 'relative', overflow: 'hidden',
            opacity: isVisible('features') ? 1 : 0,
            transform: isVisible('features') ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity .5s, transform .5s, border-color .2s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `rgba(62,207,142,.4)`}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: `radial-gradient(circle, ${C.green}08, transparent 65%)`, pointerEvents: 'none' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>🕌</div>
              <div style={{ fontFamily: 'var(--f-ar)', fontSize: 11, color: `${C.green}70`, direction: 'rtl', marginBottom: 6 }}>مَوَاقِيتُ الصَّلَاة</div>
              <h3 style={{ fontWeight: 800, fontSize: isMobile ? 18 : 22, color: C.text, letterSpacing: '-.02em', marginBottom: 8 }}>Tracker Sholat</h3>
              <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.75, margin: 0 }}>
                Catat 5 waktu sholat harian — tepat waktu, telat, atau qadha. Jadwal otomatis dengan metode Egyptian Authority & KEMENAG.
              </p>
            </div>
            {!isMobile && (
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 6, width: 180 }}>
                {[
                  { name: 'Subuh',   time: '04:37', done: true },
                  { name: 'Dzuhur',  time: '11:54', done: true },
                  { name: 'Ashar',   time: '15:16', done: false },
                  { name: 'Maghrib', time: '17:47', done: false },
                  { name: 'Isya',    time: '19:02', done: false },
                ].map(p => (
                  <div key={p.name} style={{
                    background: p.done ? `rgba(62,207,142,.1)` : 'rgba(240,237,230,.03)',
                    border: `1px solid ${p.done ? 'rgba(62,207,142,.25)' : 'rgba(240,237,230,.07)'}`,
                    borderRadius: 8, padding: '7px 10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: p.done ? C.green : C.textMut }}>{p.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: C.textMut }}>{p.time}</span>
                      {p.done && <span style={{ color: C.green, fontSize: 12 }}>✓</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Half cards */}
          {[
            { icon: '📿', title: 'Misi Amalan',   ar: 'مُهِمَّاتُ العِبَادَة',      desc: 'Panduan dzikir & doa setelah setiap sholat. Bacaan Arab, latin, arti, dalil, dan keutamaan.' },
            { icon: '🤲', title: 'Bank Doa',       ar: 'بَنْكُ الأَدْعِيَة',        desc: '50+ doa dari Al-Quran & hadits shahih. Lengkap kisah latar belakang dan faedah.' },
            { icon: '📖', title: 'Jurnal Harian',  ar: 'يَوْمِيَّاتٌ شَخْصِيَّة',   desc: 'Tulis refleksi harian. Rapikan AI dan Tafsir Mimpi berbasis kecerdasan buatan.' },
            { icon: '📊', title: 'Statistik',      ar: 'إِحْصَائِيَّاتٌ يَوْمِيَّة', desc: 'Laporan dengan grade A–F, heatmap kalender, bar chart, dan rekap qadha otomatis.' },
          ].map((f, i) => (
            <div key={f.title} style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 16, padding: isMobile ? '20px 18px' : '24px 22px',
              position: 'relative', overflow: 'hidden',
              opacity: isVisible('features') ? 1 : 0,
              transform: isVisible('features') ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity .5s ${(i + 1) * 80}ms, transform .5s ${(i + 1) * 80}ms cubic-bezier(.22,1,.36,1), border-color .2s`,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(62,207,142,.35)`; if (!isMobile) e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ position: 'absolute', bottom: -30, right: -20, width: 120, height: 120, background: `radial-gradient(circle, ${C.green}06, transparent 65%)`, pointerEvents: 'none' }} />
              <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontFamily: 'var(--f-ar)', fontSize: 10, color: `${C.green}60`, direction: 'rtl', marginBottom: 4 }}>{f.ar}</div>
              <h3 style={{ fontWeight: 700, fontSize: 15, color: C.text, letterSpacing: '-.01em', marginBottom: 6 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.75, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ DARK HIGHLIGHT — RANK SYSTEM ══════════ */}
      <section id="rank" data-section="rank" style={{
        background: 'rgba(0,0,0,.25)', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
        padding: `clamp(48px,8vw,96px) ${isMobile ? '18px' : 'clamp(20px,5vw,48px)'}`,
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(62,207,142,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(62,207,142,.04) 1px, transparent 1px)`, backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 400, background: `radial-gradient(ellipse, rgba(62,207,142,.06), transparent 65%)`, filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontWeight: 700, fontSize: 11, color: C.green, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 12 }}>Sistem Gamifikasi</div>
          <h2 style={{ fontWeight: 800, fontSize: isMobile ? 'clamp(22px,6vw,30px)' : 'clamp(24px,3.5vw,38px)', color: C.text, letterSpacing: '-.03em', marginBottom: 14 }}>
            Naiki rank lewat ibadah
          </h2>
          <p style={{ fontSize: isMobile ? 14 : 15, color: C.textSub, lineHeight: 1.8, maxWidth: 460, margin: `0 auto ${isMobile ? '32px' : '48px'}` }}>
            Setiap sholat, dzikir, dan amalan menghasilkan XP. Dari Mubtadi hingga Ulul Albab — perjalanan istiqamahmu tercatat.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : 'repeat(8, 1fr)',
            gap: 10,
            justifyItems: 'center',
          }}>
            {RANKS.map((r, i) => (
              <div key={r.rank} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? 6 : 8,
                opacity: isVisible('rank') ? 1 : 0,
                transform: isVisible('rank') ? 'translateY(0) scale(1)' : 'translateY(20px) scale(.8)',
                transition: `opacity .4s ${i * 60}ms, transform .4s ${i * 60}ms cubic-bezier(.34,1.56,.64,1)`,
              }}>
                <div style={{
                  width: isMobile ? 44 : 60, height: isMobile ? 44 : 60,
                  borderRadius: isMobile ? 12 : 16,
                  background: `rgba(240,237,230,.03)`,
                  border: `1.5px solid ${r.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--f-head)', fontWeight: 900,
                  fontSize: isMobile ? 15 : 20, color: r.color,
                  boxShadow: `0 0 ${isMobile ? 16 : 24}px -6px ${r.color}80`,
                  transition: 'transform .15s',
                  WebkitTapHighlightColor: 'transparent',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {r.rank}
                </div>
                <div style={{ fontWeight: 700, fontSize: isMobile ? 9 : 11, color: C.textMut, textAlign: 'center', lineHeight: 1.2 }}>
                  {isMobile ? r.label.split(' ')[0] : r.label}
                </div>
                {!isMobile && <div style={{ fontSize: 10, color: `${r.color}60`, fontWeight: 600 }}>{r.pts} XP</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TALQEEH CTA ══════════ */}
      <section id="talqeeh" data-section="talqeeh" style={{
        padding: `clamp(56px,9vw,100px) ${isMobile ? '24px' : 'clamp(20px,5vw,48px)'}`,
        textAlign: 'center', position: 'relative', overflow: 'hidden',
        background: `linear-gradient(160deg, rgba(56,102,65,.4) 0%, rgba(45,90,39,.3) 100%)`,
        borderTop: `1px solid rgba(62,207,142,.15)`,
      }}>
        <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: isMobile ? 400 : 700, height: isMobile ? 300 : 500, background: `radial-gradient(ellipse, ${C.lime}18, transparent 65%)`, filter: 'blur(40px)', pointerEvents: 'none' }} />
        {!isMobile && <div style={{ position: 'absolute', top: 16, right: 48, fontFamily: 'var(--f-ar)', fontSize: 140, color: 'rgba(255,255,255,.04)', userSelect: 'none', pointerEvents: 'none', lineHeight: 1 }}>الله</div>}

        <div style={{ position: 'relative', maxWidth: 580, margin: '0 auto' }}>
          <div style={{ fontWeight: 700, fontSize: 10, color: C.lime, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 16 }}>Dari kami, untuk Talqeeh</div>
          <div style={{
            fontFamily: 'var(--f-ar)', fontSize: isMobile ? 20 : 'clamp(20px,3vw,28px)', color: '#ecf39e', direction: 'rtl', marginBottom: 18, lineHeight: 1.7,
            opacity: isVisible('talqeeh') ? .9 : 0,
            transform: isVisible('talqeeh') ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity .6s .1s, transform .6s .1s',
          }}>جَزَاكُمُ اللهُ خَيْرًا</div>
          <h2 style={{
            fontWeight: 800, fontSize: isMobile ? 'clamp(20px,6vw,28px)' : 'clamp(22px,4vw,38px)', color: C.cream, letterSpacing: '-.03em', lineHeight: 1.2, marginBottom: 16,
            opacity: isVisible('talqeeh') ? 1 : 0,
            transform: isVisible('talqeeh') ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity .6s .2s, transform .6s .2s',
          }}>
            Terima kasih sudah menjadi<br />bagian dari keluarga Talqeeh
          </h2>
          <p style={{ fontSize: isMobile ? 14 : 15, color: 'rgba(245,237,218,.7)', lineHeight: 1.85, marginBottom: 10 }}>
            Deenme adalah wujud syukur kami. Semoga setiap amalan yang tercatat menjadi saksi kebaikan di hari yang paling kita harapkan.
          </p>
          <p style={{ fontSize: 14, color: 'rgba(245,237,218,.45)', marginBottom: 36, fontStyle: 'italic' }}>Barakallahu fiikum. 🌿</p>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 12, justifyContent: 'center',
            alignItems: 'center',
            opacity: isVisible('talqeeh') ? 1 : 0,
            transform: isVisible('talqeeh') ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity .6s .4s, transform .6s .4s',
          }}>
            <button onClick={onEnter} style={{
              background: C.cream, color: '#1a2e1c', border: 'none', borderRadius: 10,
              padding: isMobile ? '15px 0' : '14px 32px',
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? 360 : 'none',
              fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 15, cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,.25)', transition: 'transform .15s, box-shadow .15s',
              WebkitTapHighlightColor: 'transparent',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,.25)'; }}
            >
              Masuk ke Deenme →
            </button>
            <a href="https://talqeeh.vercel.app" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              color: '#ecf39e', border: '1.5px solid rgba(236,243,158,.3)',
              borderRadius: 10,
              padding: isMobile ? '14px 0' : '13px 24px',
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? 360 : 'none',
              justifyContent: 'center',
              fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 14, textDecoration: 'none',
              transition: 'border-color .15s, background .15s',
              WebkitTapHighlightColor: 'transparent',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(236,243,158,.7)'; e.currentTarget.style.background = 'rgba(236,243,158,.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(236,243,158,.3)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Kunjungi Talqeeh
            </a>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{
        background: 'rgba(0,0,0,.3)', borderTop: `1px solid ${C.border}`,
        padding: isMobile ? '32px 24px 28px' : 'clamp(40px,5vw,64px) clamp(20px,5vw,48px) 32px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {isMobile ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
                <img src="./assets/Deenme_logo.png" alt="Deenme" style={{ width: 22, filter: 'brightness(0) invert(.5)' }} />
                <span style={{ fontWeight: 800, fontSize: 14, color: C.textSub }}>Deenme</span>
              </div>
              <p style={{ fontSize: 12, color: C.textMut, lineHeight: 1.7, marginBottom: 20 }}>
                Ibadah tracker untuk Muslim yang ingin istiqamah setiap hari.
              </p>
              <a href="https://talqeeh.vercel.app" target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.green, textDecoration: 'none', fontWeight: 700, marginBottom: 24 }}>
                Kunjungi Talqeeh →
              </a>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, fontSize: 11, color: C.textMut }}>
                © 2026 Deenme · Dar Dev · untuk keluarga Talqeeh
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(3, 1fr)', gap: 40, marginBottom: 48 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <img src="./assets/Deenme_logo.png" alt="Deenme" style={{ width: 26, filter: 'brightness(0) invert(.5)' }} />
                    <span style={{ fontWeight: 800, fontSize: 15, color: C.textSub }}>Deenme</span>
                  </div>
                  <p style={{ fontSize: 13, color: C.textMut, lineHeight: 1.75, maxWidth: 220, margin: 0 }}>
                    Ibadah tracker untuk Muslim yang ingin istiqamah setiap hari.
                  </p>
                </div>
                {[
                  { title: 'Produk',    links: ['Tracker Sholat', 'Misi Amalan', 'Bank Doa', 'Jurnal', 'Statistik'] },
                  { title: 'Sistem',    links: ['Rank & XP', 'Badge', 'Streak Shield', 'Timbangan Amal'] },
                  { title: 'Komunitas', links: ['Talqeeh', 'Dar Dev', 'Cairo 2026'] },
                ].map(({ title, links }) => (
                  <div key={title}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: C.textSub, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>{title}</div>
                    {links.map(l => (
                      <div key={l} style={{ fontSize: 13, color: C.textMut, marginBottom: 8, cursor: 'default' }}>{l}</div>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ fontSize: 12, color: C.textMut }}>
                  © 2026 Deenme · Dibuat oleh Dar Dev untuk keluarga Talqeeh
                </div>
                <a href="https://talqeeh.vercel.app" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: C.green, textDecoration: 'none', fontWeight: 600 }}>
                  talqeeh.vercel.app →
                </a>
              </div>
            </>
          )}
        </div>
      </footer>

    </div>
  );
}
