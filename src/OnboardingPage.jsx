import { useState } from 'react';

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
    desc: 'Deenme mendukung jadwal sholat Cairo dan Tangerang. Pilih sesuai lokasi kamu sekarang — bisa diubah kapan saja di pengaturan.',
    cta: 'Masuk ke Deenme →',
    isTz: true,
  },
];

export function OnboardingPage({ userName, onDone }) {
  const [step, setStep]     = useState(0);
  const [tz, setTz]         = useState('ID');
  const [exiting, setExiting] = useState(false);

  const current = STEPS[step];
  const isLast  = step === STEPS.length - 1;

  const next = () => {
    if (isLast) {
      setExiting(true);
      setTimeout(() => onDone(tz), 400);
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', fontFamily: 'var(--f-head)',
      padding: '32px 24px',
      opacity: exiting ? 0 : 1,
      transition: 'opacity .4s ease',
    }}>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 48 }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 24 : 8, height: 8,
            borderRadius: 4,
            background: i <= step ? 'var(--gold)' : 'var(--border-2)',
            transition: 'all .3s cubic-bezier(.22,1,.36,1)',
          }} />
        ))}
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 420,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 24, overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,.08)',
      }}>
        {/* Top accent */}
        <div style={{ height: 3, background: 'linear-gradient(90deg, var(--gold), #a7c957, var(--gold))' }} />

        <div style={{ padding: '32px 28px' }}>
          {/* Emoji */}
          <div style={{ fontSize: 52, marginBottom: 16, textAlign: 'center' }}>
            {current.emoji}
          </div>

          {/* Arabic */}
          <div style={{
            fontFamily: 'var(--f-ar)', fontSize: 18,
            color: 'var(--gold)', direction: 'rtl',
            textAlign: 'center', marginBottom: 16,
            opacity: .85,
          }}>
            {current.ar}
          </div>

          {/* Title */}
          <h2 style={{
            fontWeight: 800, fontSize: 22, color: 'var(--text)',
            letterSpacing: '-.03em', textAlign: 'center',
            marginBottom: 14, lineHeight: 1.2,
          }}>
            {current.title(userName)}
          </h2>

          {/* Desc */}
          <p style={{
            fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8,
            textAlign: 'center', marginBottom: 24,
          }}>
            {current.desc}
          </p>

          {/* Step 2 — rank mini preview */}
          {current.mini && (
            <div style={{
              display: 'flex', justifyContent: 'center', gap: 12,
              marginBottom: 24,
            }}>
              {current.mini.map(r => (
                <div key={r.rank} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, margin: '0 auto 6px',
                    background: `${r.color}15`,
                    border: `2px solid ${r.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: 16, color: r.color,
                    boxShadow: `0 0 14px -4px ${r.color}80`,
                  }}>
                    {r.rank}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text-3)', fontWeight: 600 }}>
                    {r.label}
                  </div>
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
                }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{t.flag}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 2 }}>
                    {t.label}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>
                    {t.sub}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* CTA button */}
          <button
            onClick={next}
            className="btn gold"
            style={{ width: '100%', padding: '14px 0', fontSize: 15, fontWeight: 700 }}
          >
            {current.cta}
          </button>

          {/* Skip link — hanya di step bukan terakhir */}
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

      {/* Footer note */}
      <div style={{ marginTop: 24, fontSize: 12, color: 'var(--text-3)', textAlign: 'center' }}>
        Hadiah kecil dari Dar Dev · untuk keluarga Talqeeh 🌿
      </div>
    </div>
  );
}
