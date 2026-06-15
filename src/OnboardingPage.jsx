import { useState, useEffect } from 'react';

const STEPS = [
  {
    emoji: '🤲',
    ar: 'أَهْلاً وَسَهْلاً',
    title: (name) => `Ahlan wa sahlan, ${name}!`,
    desc: 'Deenme adalah hadiah kecil dari Talqeeh untuk menemanimu menjaga ibadah setiap hari. Mulai dari sholat, dzikir, hingga amalan sunnah — semuanya ada di sini.',
    cta: 'Mulai →',
  },
  {
    emoji: '⚔️',
    ar: 'نِظَامُ الدَّرَجَات',
    title: () => 'Sistem Rank & XP',
    desc: 'Setiap ibadah menghasilkan XP. Kumpulkan XP untuk naik rank dari Mubtadi hingga Ulul Albab. Jaga streak harianmu dan raih badge spesial.',
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
    desc: 'Deenme mendukung jadwal sholat Cairo dan Tangerang. Pilih sesuai lokasimu — bisa diubah kapan saja.',
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
      setTimeout(() => onDone(tz), 380);
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      fontFamily: 'var(--f-head)',
      opacity: visible && !exiting ? 1 : 0,
      transition: 'opacity .38s ease',
    }}>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            height: 8,
            width: i === step ? 28 : 8,
            borderRadius: 4,
            background: i <= step ? 'var(--gold)' : 'var(--border-2)',
            transition: 'all .3s cubic-bezier(.22,1,.36,1)',
          }} />
        ))}
      </div>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 440,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,.1), 0 4px 16px rgba(0,0,0,.06)',
      }}>
        {/* Top accent bar */}
        <div style={{ height: 3, background: 'linear-gradient(90deg, var(--gold), #a7c957, var(--gold))' }} />

        <div style={{ padding: '36px 32px' }}>
          {/* Emoji */}
          <div style={{ fontSize: 56, textAlign: 'center', marginBottom: 16, lineHeight: 1 }}>
            {current.emoji}
          </div>

          {/* Arabic */}
          <div style={{
            fontFamily: 'var(--f-ar)', fontSize: 20,
            color: 'var(--gold)', direction: 'rtl',
            textAlign: 'center', marginBottom: 14,
          }}>
            {current.ar}
          </div>

          {/* Title */}
          <h2 style={{
            fontWeight: 800, fontSize: 24, color: 'var(--text)',
            letterSpacing: '-.03em', textAlign: 'center',
            margin: '0 0 12px', lineHeight: 1.2,
          }}>
            {current.title(userName)}
          </h2>

          {/* Desc */}
          <p style={{
            fontSize: 14, color: 'var(--text-2)', lineHeight: 1.85,
            textAlign: 'center', margin: '0 0 24px',
          }}>
            {current.desc}
          </p>

          {/* Step 2 — rank preview */}
          {current.mini && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 24 }}>
              {current.mini.map(r => (
                <div key={r.rank} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 13,
                    margin: '0 auto 6px',
                    background: `${r.color}15`,
                    border: `2px solid ${r.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: 17, color: r.color,
                    boxShadow: `0 0 16px -4px ${r.color}80`,
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
            <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
              {[
                { val: 'ID', flag: '🇮🇩', label: 'Tangerang', sub: 'WIB · UTC+7' },
                { val: 'EG', flag: '🇪🇬', label: 'Cairo',     sub: 'EET · UTC+3' },
              ].map(t => (
                <button key={t.val} onClick={() => setTz(t.val)} style={{
                  flex: 1, padding: '14px 12px', borderRadius: 12,
                  background: tz === t.val ? 'var(--gold-soft)' : 'var(--elevated)',
                  border: `2px solid ${tz === t.val ? 'var(--gold)' : 'var(--border)'}`,
                  cursor: 'pointer', textAlign: 'center',
                  transition: 'all .15s',
                  WebkitTapHighlightColor: 'transparent',
                }}>
                  <div style={{ fontSize: 32, marginBottom: 6 }}>{t.flag}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 2 }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{t.sub}</div>
                </button>
              ))}
            </div>
          )}

          {/* CTA */}
          <button
            onClick={next}
            className="btn gold"
            style={{ width: '100%', padding: '14px 0', fontSize: 15, fontWeight: 700 }}
          >
            {current.cta}
          </button>

          {/* Skip */}
          {!isLast && step > 0 && (
            <button
              onClick={() => setStep(STEPS.length - 1)}
              style={{
                display: 'block', margin: '12px auto 0',
                background: 'none', border: 'none',
                color: 'var(--text-3)', fontSize: 12,
                cursor: 'pointer', fontFamily: 'var(--f-head)',
              }}
            >
              Lewati →
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 24, fontSize: 12, color: 'var(--text-3)', textAlign: 'center' }}>
        Hadiah kecil dari Dar Dev · untuk keluarga Talqeeh 🌿
      </div>
    </div>
  );
}
