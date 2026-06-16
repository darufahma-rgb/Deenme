import { useState, useEffect } from 'react';

const STEPS = [
  {
    emoji: '🤲',
    ar: 'أَهْلاً وَسَهْلاً',
    title: (name) => `Ahlan wa sahlan, ${name}!`,
    desc: 'Deenme adalah hadiah kecil dari Talqeeh untuk menemanimu menjaga ibadah setiap hari — sholat, dzikir, amalan, dan lebih banyak lagi.',
    cta: 'Lihat Fitur →',
  },
  {
    emoji: '⚔️',
    ar: 'نِظَامُ الدَّرَجَات',
    title: () => 'Kumpulkan XP, Naik Rank',
    desc: 'Setiap ibadah menghasilkan XP. Naik dari Mubtadi hingga Ulul Albab. Jaga streak harian dan raih badge spesial.',
    cta: 'Lanjut →',
    mini: [
      { rank: 'E', label: 'Mubtadi',    color: '#94a3b8' },
      { rank: 'C', label: 'Mutawassit', color: '#386641' },
      { rank: 'A', label: 'Muttaqin',   color: '#a7c957' },
      { rank: 'S', label: 'Wali',       color: '#f59e0b' },
    ],
  },
  {
    emoji: '🕌',
    ar: 'اخْتَرْ مِنْطَقَتَكَ',
    title: () => 'Pilih Zona Waktumu',
    desc: 'Jadwal sholat otomatis menyesuaikan lokasimu. Bisa diubah kapan saja di pengaturan.',
    cta: 'Masuk ke Deenme →',
    isTz: true,
  },
];

export function OnboardingOverlay({ userName, onDone }) {
  const [step, setStep]       = useState(0);
  const [tz, setTz]           = useState('ID');
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  const current = STEPS[step];
  const isLast  = step === STEPS.length - 1;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => setVisible(true));
    return () => { document.body.style.overflow = ''; };
  }, []);

  const next = () => {
    if (isLast) {
      setExiting(true);
      setTimeout(() => onDone(tz), 350);
    } else {
      setStep(s => s + 1);
    }
  };

  const back = () => { if (step > 0) setStep(s => s - 1); };

  const skip = () => { setExiting(true); setTimeout(() => onDone('ID'), 350); };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      fontFamily: 'var(--f-head)',
      opacity: visible && !exiting ? 1 : 0,
      transition: 'opacity .35s ease',
    }}>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 460, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i <= step ? 'var(--gold)' : 'var(--border)',
              transition: 'background .3s ease',
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>
            {step + 1} / {STEPS.length}
          </span>
          {!isLast && (
            <button onClick={skip} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 11, color: 'var(--text-3)',
              fontFamily: 'var(--f-head)', padding: 0,
            }}>
              Lewati →
            </button>
          )}
        </div>
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 460,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 24, overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,.1)',
      }}>
        <div style={{ height: 3, background: 'linear-gradient(90deg, var(--gold), #a7c957)' }} />

        <div style={{ padding: '30px 28px' }}>
          {/* Emoji */}
          <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 12, lineHeight: 1 }}>
            {current.emoji}
          </div>

          {/* Arabic */}
          <div style={{
            fontFamily: 'var(--f-ar)', fontSize: 16,
            color: 'var(--gold)', direction: 'rtl',
            textAlign: 'center', marginBottom: 10,
          }}>
            {current.ar}
          </div>

          {/* Title */}
          <h2 style={{
            fontWeight: 800, fontSize: 20, color: 'var(--text)',
            letterSpacing: '-.03em', textAlign: 'center',
            margin: '0 0 10px', lineHeight: 1.2,
          }}>
            {current.title(userName)}
          </h2>

          {/* Desc */}
          <p style={{
            fontSize: 13, color: 'var(--text-2)', lineHeight: 1.8,
            textAlign: 'center', margin: '0 0 20px',
          }}>
            {current.desc}
          </p>

          {/* Step 2 — rank mini preview */}
          {current.mini && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
              {current.mini.map(r => (
                <div key={r.rank} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    margin: '0 auto 5px',
                    background: `${r.color}15`,
                    border: `2px solid ${r.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: 16, color: r.color,
                    boxShadow: `0 0 14px -4px ${r.color}60`,
                  }}>
                    {r.rank}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text-3)', fontWeight: 600 }}>{r.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3 — timezone picker */}
          {current.isTz && (
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {[
                { val: 'ID', flag: '🇮🇩', label: 'Tangerang', sub: 'WIB · UTC+7' },
                { val: 'EG', flag: '🇪🇬', label: 'Cairo',     sub: 'EET · UTC+3' },
              ].map(t => (
                <button key={t.val} onClick={() => setTz(t.val)} style={{
                  flex: 1, padding: '14px 10px', borderRadius: 12,
                  background: tz === t.val ? 'var(--gold-soft)' : 'var(--elevated)',
                  border: `2px solid ${tz === t.val ? 'var(--gold)' : 'var(--border)'}`,
                  cursor: 'pointer', textAlign: 'center',
                  transition: 'all .15s',
                  WebkitTapHighlightColor: 'transparent',
                }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{t.flag}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', marginBottom: 2 }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{t.sub}</div>
                </button>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            {step > 0 && (
              <button onClick={back} style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'var(--elevated)', border: '1px solid var(--border)',
                color: 'var(--text-2)', fontSize: 16, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>←</button>
            )}
            <button onClick={next} className="btn gold"
              style={{ flex: 1, padding: '13px 0', fontSize: 14, fontWeight: 700 }}>
              {current.cta}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 20, fontSize: 11, color: 'var(--text-3)', textAlign: 'center' }}>
        Hadiah kecil dari Dar Dev · untuk keluarga Talqeeh 🌿
      </div>
    </div>
  );
}
