import { useState, useEffect } from 'react';

const STEPS = [
  // ── 1. Welcome ───────────────────────────────────────────────
  {
    type: 'welcome',
    emoji: '🤲',
    ar: 'أَهْلاً وَسَهْلاً',
    title: (name) => `Ahlan wa sahlan, ${name}!`,
    desc: 'Deenme adalah hadiah kecil dari Talqeeh untuk menemanimu menjaga ibadah setiap hari.',
    cta: 'Mulai Tour →',
    accent: '#386641',
  },

  // ── 2. Tracker Sholat ────────────────────────────────────────
  {
    type: 'feature',
    emoji: '🕌',
    ar: 'مَوَاقِيتُ الصَّلَاة',
    title: () => 'Tracker Sholat',
    desc: 'Catat 5 waktu sholat setiap hari — tepat waktu, telat, atau qadha. Jadwal otomatis menyesuaikan lokasi dan timezone.',
    cta: 'Lanjut →',
    accent: '#386641',
    preview: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '0 0 22px' }}>
        {[
          { name: 'Subuh',   time: '04:37', done: true,  icon: '🌅' },
          { name: 'Dzuhur',  time: '11:54', done: true,  icon: '☀️' },
          { name: 'Ashar',   time: '15:16', done: false, icon: '🌤️' },
          { name: 'Maghrib', time: '17:47', done: false, icon: '🌆' },
          { name: 'Isya',    time: '19:02', done: false, icon: '🌙' },
        ].map(p => (
          <div key={p.name} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 14px', borderRadius: 10,
            background: p.done ? 'rgba(56,102,65,.1)' : 'var(--elevated)',
            border: `1px solid ${p.done ? 'rgba(56,102,65,.3)' : 'var(--border)'}`,
            transition: 'all .15s',
          }}>
            <span style={{ fontSize: 14 }}>{p.icon}</span>
            <span style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 13, color: 'var(--text)', flex: 1 }}>
              {p.name}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--f-head)' }}>{p.time}</span>
            <div style={{
              width: 22, height: 22, borderRadius: 6, flexShrink: 0,
              background: p.done ? '#386641' : 'transparent',
              border: `2px solid ${p.done ? '#386641' : 'var(--border-2)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: '#fff',
            }}>
              {p.done ? '✓' : ''}
            </div>
          </div>
        ))}
      </div>
    ),
  },

  // ── 3. Misi Amalan ───────────────────────────────────────────
  {
    type: 'feature',
    emoji: '📿',
    ar: 'مُهِمَّاتُ العِبَادَة',
    title: () => 'Misi Amalan',
    desc: 'Setiap selesai sholat, muncul misi dzikir & doa yang dianjurkan. Tap untuk hitung dzikir, centang saat selesai.',
    cta: 'Lanjut →',
    accent: '#6a994e',
    preview: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '0 0 22px' }}>
        {[
          { name: 'Sayyidul Istighfar', ar: 'أَسْتَغْفِرُ اللهَ', type: 'Dzikir', count: '1×',       done: true  },
          { name: 'Ayat Kursi',         ar: 'آيَةُ الكُرْسِيّ',  type: 'Dzikir', count: '1×',       done: true  },
          { name: 'Rawatib Subuh',      ar: 'رَاتِبَةُ الفَجْر', type: 'Sholat', count: '2 rakaat', done: false },
        ].map((m, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', borderRadius: 10,
            background: m.done ? 'var(--gold-soft)' : 'var(--elevated)',
            border: `1px solid ${m.done ? 'var(--gold-line)' : 'var(--border)'}`,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 12, color: 'var(--text)', marginBottom: 2 }}>
                {m.name}
              </div>
              <div style={{ fontFamily: 'var(--f-ar)', fontSize: 11, color: 'var(--gold)', direction: 'rtl' }}>
                {m.ar}
              </div>
            </div>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
              background: m.type === 'Dzikir' ? 'rgba(106,153,78,.15)' : 'rgba(56,102,65,.1)',
              color: m.type === 'Dzikir' ? '#6a994e' : '#386641',
            }}>{m.type}</span>
            <div style={{
              width: 22, height: 22, borderRadius: 6, flexShrink: 0,
              background: m.done ? 'var(--gold)' : 'transparent',
              border: `2px solid ${m.done ? 'var(--gold)' : 'var(--border-2)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: 'var(--bg)',
            }}>
              {m.done ? '✓' : ''}
            </div>
          </div>
        ))}
        <div style={{
          textAlign: 'center', fontSize: 11, color: 'var(--text-3)',
          fontFamily: 'var(--f-head)', fontStyle: 'italic',
        }}>
          ✦ Dzikir dengan jumlah — ada counter tap otomatis
        </div>
      </div>
    ),
  },

  // ── 4. Rank & XP ─────────────────────────────────────────────
  {
    type: 'feature',
    emoji: '⭐',
    ar: 'الدَّرَجَاتُ وَالنُّقَاط',
    title: () => 'Sistem Rank & XP',
    desc: 'Setiap ibadah menghasilkan XP. Naik rank dari Mubtadi hingga Ulul Albab. Jaga streak harian dan raih badge spesial.',
    cta: 'Lanjut →',
    accent: '#f59e0b',
    preview: (
      <div style={{ margin: '0 0 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 14 }}>
          {[
            { rank: 'E',   color: '#94a3b8', label: 'Mubtadi'    },
            { rank: 'C',   color: '#386641', label: 'Mutawassit' },
            { rank: 'A',   color: '#a7c957', label: 'Muttaqin'   },
            { rank: 'S',   color: '#f59e0b', label: 'Wali'       },
            { rank: 'SSS', color: '#a855f7', label: 'Ulul Albab' },
          ].map(r => (
            <div key={r.rank} style={{ textAlign: 'center' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 11, margin: '0 auto 5px',
                background: `${r.color}15`,
                border: `2px solid ${r.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: 13, color: r.color,
                boxShadow: `0 0 12px -4px ${r.color}80`,
              }}>{r.rank}</div>
              <div style={{ fontSize: 8, color: 'var(--text-3)', fontWeight: 600, lineHeight: 1.2 }}>{r.label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--elevated)', borderRadius: 10, padding: '10px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--f-head)', fontWeight: 600 }}>0 XP</span>
            <span style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'var(--f-head)', fontWeight: 700 }}>100 XP → Rank D</span>
          </div>
          <div style={{ height: 6, background: 'var(--border-2)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 3, width: '5%',
              background: 'linear-gradient(90deg, var(--gold), #a7c957)',
            }} />
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-3)', textAlign: 'center', fontFamily: 'var(--f-head)' }}>
            Centang sholat = +10 XP · Selesaikan misi = +5–20 XP
          </div>
        </div>
      </div>
    ),
  },

  // ── 5. Bank Doa & Jurnal ─────────────────────────────────────
  {
    type: 'feature',
    emoji: '📖',
    ar: 'بَنْكُ الأَدْعِيَة وَالمُذَكِّرَات',
    title: () => 'Bank Doa & Jurnal',
    desc: 'Koleksi 50+ doa dari Al-Quran & hadits shahih. Tulis jurnal harian — ada fitur Rapikan AI dan Tafsir Mimpi.',
    cta: 'Lanjut →',
    accent: '#386641',
    preview: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '0 0 22px' }}>
        {[
          {
            icon: '🤲', title: 'Bank Doa',
            items: ['Per Waktu Solat', 'Saat Galau', 'Saat Sakit', 'Minta Rezeki', '+50 doa lagi'],
            color: '#386641',
          },
          {
            icon: '📝', title: 'Jurnal Harian',
            items: ['Tulis bebas', 'Rapikan AI ✨', 'Tafsir Mimpi 🌙', 'Tersimpan aman'],
            color: '#6a994e',
          },
        ].map(card => (
          <div key={card.title} style={{
            background: 'var(--elevated)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '14px 12px',
          }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{card.icon}</div>
            <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 12, color: 'var(--text)', marginBottom: 8 }}>
              {card.title}
            </div>
            {card.items.map(item => (
              <div key={item} style={{
                fontSize: 11, color: 'var(--text-3)', marginBottom: 4,
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: card.color, flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    ),
  },

  // ── 6. Timezone ──────────────────────────────────────────────
  {
    type: 'tz',
    emoji: '🕌',
    ar: 'اخْتَرْ مِنْطَقَتَكَ',
    title: () => 'Pilih Zona Waktumu',
    desc: 'Deenme mendukung jadwal sholat Cairo dan Jakarta. Bisa diubah kapan saja di pengaturan.',
    cta: 'Masuk ke Deenme →',
    accent: '#386641',
  },
];

export function OnboardingOverlay({ userName, onDone }) {
  const [step, setStep]       = useState(0);
  const [tz, setTz]           = useState('ID');
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [animDir, setAnimDir] = useState(1);

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
      return;
    }
    setAnimDir(1);
    setStep(s => s + 1);
  };

  const back = () => {
    if (step === 0) return;
    setAnimDir(-1);
    setStep(s => s - 1);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'var(--bg)',
      overflowY: 'auto',
      fontFamily: 'var(--f-head)',
      opacity: visible && !exiting ? 1 : 0,
      transition: 'opacity .38s ease',
    }}>
    <div style={{
      minHeight: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '20px 24px',
    }}>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 480, marginBottom: 28 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              onClick={() => { if (i < step) setStep(i); }}
              style={{
                flex: 1, height: 3, borderRadius: 2,
                background: i <= step ? 'var(--gold)' : 'var(--border-2)',
                transition: 'background .3s ease',
                cursor: i < step ? 'pointer' : 'default',
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>
            {step + 1} / {STEPS.length}
          </span>
          {step < STEPS.length - 1 && (
            <button
              onClick={() => setStep(STEPS.length - 1)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 11, color: 'var(--text-3)',
                fontFamily: 'var(--f-head)', padding: 0,
              }}
            >
              Lewati semua →
            </button>
          )}
        </div>
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 480,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 24, overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,.1)',
      }}>
        {/* Accent bar — warna sesuai step */}
        <div style={{
          height: 3,
          background: `linear-gradient(90deg, ${current.accent}, #a7c957, ${current.accent})`,
          transition: 'background .4s ease',
        }} />

        <div style={{ padding: '28px 28px 28px' }}>
          {/* Emoji */}
          <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 12, lineHeight: 1 }}>
            {current.emoji}
          </div>

          {/* Arabic label */}
          <div style={{
            fontFamily: 'var(--f-ar)', fontSize: 16,
            color: 'var(--gold)', direction: 'rtl',
            textAlign: 'center', marginBottom: 12, opacity: .85,
          }}>
            {current.ar}
          </div>

          {/* Title */}
          <h2 style={{
            fontWeight: 800, fontSize: 22, color: 'var(--text)',
            letterSpacing: '-.03em', textAlign: 'center',
            margin: '0 0 10px', lineHeight: 1.2,
          }}>
            {current.title(userName)}
          </h2>

          {/* Desc */}
          <p style={{
            fontSize: 13, color: 'var(--text-2)', lineHeight: 1.85,
            textAlign: 'center', margin: '0 0 20px',
          }}>
            {current.desc}
          </p>

          {/* Feature preview (React node) */}
          {current.preview}

          {/* Timezone picker */}
          {current.type === 'tz' && (
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {[
                { val: 'ID', flag: '🇮🇩', label: 'Jakarta',   sub: 'WIB · UTC+7',  method: 'KEMENAG'            },
                { val: 'EG', flag: '🇪🇬', label: 'Cairo',     sub: 'EET · UTC+3',  method: 'Egyptian Authority' },
              ].map(t => (
                <button key={t.val} onClick={() => setTz(t.val)} style={{
                  flex: 1, padding: '16px 12px', borderRadius: 14,
                  background: tz === t.val ? 'var(--gold-soft)' : 'var(--elevated)',
                  border: `2px solid ${tz === t.val ? 'var(--gold)' : 'var(--border)'}`,
                  cursor: 'pointer', textAlign: 'center',
                  transition: 'all .15s',
                  WebkitTapHighlightColor: 'transparent',
                }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{t.flag}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 2 }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4 }}>{t.sub}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', opacity: .7 }}>{t.method}</div>
                </button>
              ))}
            </div>
          )}

          {/* Nav buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            {step > 0 && (
              <button
                onClick={back}
                style={{
                  flex: '0 0 44px', height: 44, borderRadius: 12,
                  background: 'var(--elevated)', border: '1px solid var(--border)',
                  color: 'var(--text-2)', fontSize: 16, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background .15s',
                }}
              >
                ←
              </button>
            )}
            <button
              onClick={next}
              className="btn gold"
              style={{ flex: 1, padding: '13px 0', fontSize: 14, fontWeight: 700 }}
            >
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
    </div>
  );
}
