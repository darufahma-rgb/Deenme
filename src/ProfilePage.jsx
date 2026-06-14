import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase.js';
import { BADGES, getRank, getLevel, getNextRank, RANK_SYSTEM } from './dashboard.jsx';

function getInitials(name) {
  return (name || 'A').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// ── Animated counter ─────────────────────────────────────────────────────────
function Counter({ to, duration = 1200 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!to) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * to));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to]);
  return val.toLocaleString();
}

// ── Rank badge ────────────────────────────────────────────────────────────────
function RankBadge({ rank, size = 52, pulse = false }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: size * 0.25,
      background: `linear-gradient(145deg, rgba(245,237,218,.04), rgba(245,237,218,.01))`,
      border: `2px solid ${rank.color}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--f-head)', fontWeight: 900,
      fontSize: size * 0.38, color: rank.color,
      boxShadow: `0 0 ${size * 0.5}px -${size * 0.1}px ${rank.color}80, inset 0 1px 0 rgba(255,255,255,.06)`,
      flexShrink: 0,
      animation: pulse ? 'rankGlowPulse 2.5s ease-in-out infinite' : 'none',
      position: 'relative',
    }}>
      {rank.rank}
    </div>
  );
}

// ── XP bar ────────────────────────────────────────────────────────────────────
function XPBar({ pct, color, nextColor, shimmer = true }) {
  return (
    <div style={{ height: 6, background: 'rgba(245,237,218,.06)', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
      <div style={{
        height: '100%', borderRadius: 3,
        background: `linear-gradient(90deg, ${color}, ${nextColor || color})`,
        width: `${Math.min(pct, 100)}%`,
        transition: 'width 1.2s cubic-bezier(.22,1,.36,1)',
        boxShadow: `0 0 12px ${color}80`,
        position: 'relative', overflow: 'hidden',
      }}>
        {shimmer && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,.25) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'dm-shimmer 2s ease-in-out infinite',
          }} />
        )}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function ProfilePage({
  userName, codeId,
  totalPoints, streak, freeze,
  prayers, misiDone, unlockedBadges,
  onUpdateName, onLogout,
}) {
  const [tab, setTab]             = useState('profile');
  const [editName, setEditName]   = useState(userName);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [memberInfo, setMemberInfo] = useState(null);
  const [mounted, setMounted]     = useState(false);

  const rank     = getRank(totalPoints);
  const nextRank = getNextRank(totalPoints);
  const level    = getLevel(totalPoints);
  const doneCount = Object.values(prayers || {}).filter(v => v).length;
  const misiCount = Object.keys(misiDone || {}).length;
  const pct = level.next
    ? ((totalPoints - level.low) / (level.next - level.low)) * 100
    : 100;

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
    if (!codeId) return;
    supabase.from('member_codes').select('name, code, created_at').eq('id', codeId).single()
      .then(({ data }) => { if (data) setMemberInfo(data); });
  }, [codeId]);

  const handleSaveName = async () => {
    if (!editName.trim() || editName === userName || saving) return;
    setSaving(true);
    await supabase.from('member_codes').update({ name: editName.trim() }).eq('id', codeId);
    onUpdateName(editName.trim());
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const TABS = [
    { id: 'profile',  label: 'Profil',      icon: '👤' },
    { id: 'rank',     label: 'Rank',         icon: '⚔️' },
    { id: 'badges',   label: 'Badge',        icon: '🏆' },
    { id: 'settings', label: 'Pengaturan',   icon: '⚙️' },
  ];

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg)', fontFamily: 'var(--f-head)' }}>
      <div style={{ overflowY: 'auto', paddingBottom: 100 }}>

        {/* ══════════════ HERO ══════════════ */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          background: `linear-gradient(160deg, #060d08 0%, ${rank.bg || '#0a1a0d'} 50%, #060d08 100%)`,
          minHeight: 280,
        }}>
          {/* Grid pattern */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `linear-gradient(rgba(56,102,65,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(56,102,65,.06) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }} />

          {/* Rank glow orb */}
          <div style={{
            position: 'absolute', top: -60, right: -60, width: 320, height: 320,
            background: `radial-gradient(circle, ${rank.color}25, transparent 65%)`,
            filter: 'blur(30px)', pointerEvents: 'none',
            animation: 'rankGlowPulse 3s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', bottom: -80, left: -40, width: 260, height: 260,
            background: `radial-gradient(circle, ${rank.glow || 'rgba(56,102,65,.15)'}, transparent 65%)`,
            filter: 'blur(40px)', pointerEvents: 'none',
          }} />

          {/* Decorative rank text */}
          <div style={{
            position: 'absolute', top: 12, right: 20,
            fontFamily: 'var(--f-head)', fontWeight: 900,
            fontSize: 120, color: `${rank.color}06`,
            lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
            letterSpacing: '-.05em',
          }}>
            {rank.rank}
          </div>

          {/* Content */}
          <div style={{ position: 'relative', padding: '28px 24px 24px' }}>

            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
              {/* Avatar */}
              <div style={{
                width: 72, height: 72, borderRadius: 20, flexShrink: 0,
                background: `linear-gradient(145deg, ${rank.color}22, ${rank.color}08)`,
                border: `2px solid ${rank.color}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--f-head)', fontWeight: 900, fontSize: 28,
                color: rank.color,
                boxShadow: `0 0 24px ${rank.color}30, inset 0 1px 0 rgba(255,255,255,.08)`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'scale(1)' : 'scale(.7)',
                transition: 'opacity .5s, transform .5s cubic-bezier(.34,1.56,.64,1)',
              }}>
                {getInitials(userName)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Name */}
                <div style={{
                  fontWeight: 800, fontSize: 26, color: '#f0ede6',
                  letterSpacing: '-.03em', lineHeight: 1.1, marginBottom: 6,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(-12px)',
                  transition: 'opacity .5s .1s, transform .5s .1s',
                }}>
                  {userName}
                </div>

                {/* Rank row */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  opacity: mounted ? 1 : 0, transition: 'opacity .5s .2s',
                }}>
                  <RankBadge rank={rank} size={32} pulse />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: rank.color, letterSpacing: '.02em' }}>
                      Rank {rank.rank} · {rank.label}
                    </div>
                    <div style={{ fontFamily: 'var(--f-ar)', fontSize: 11, color: `${rank.color}88`, direction: 'rtl', marginTop: 1 }}>
                      {level.ar}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* XP section */}
            <div style={{
              opacity: mounted ? 1 : 0, transition: 'opacity .5s .3s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: 'rgba(240,237,230,.4)', fontWeight: 600 }}>
                  <Counter to={totalPoints} /> XP
                </span>
                {nextRank && (
                  <span style={{ fontSize: 12, color: 'rgba(240,237,230,.3)' }}>
                    {nextRank.minPts - totalPoints} XP → Rank {nextRank.rank}
                  </span>
                )}
              </div>
              <XPBar pct={pct} color={rank.color} nextColor={nextRank?.color} />
            </div>

            {/* Stats row */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 20,
              opacity: mounted ? 1 : 0, transition: 'opacity .5s .4s',
            }}>
              {[
                { icon: '🔥', val: streak,            label: 'Streak' },
                { icon: '🕌', val: `${doneCount}/5`,  label: 'Sholat' },
                { icon: '⭐', val: totalPoints,        label: 'XP' },
                { icon: '✓',  val: misiCount,          label: 'Misi' },
              ].map(({ icon, val, label }) => (
                <div key={label} style={{
                  background: 'rgba(245,237,218,.04)',
                  border: '1px solid rgba(245,237,218,.07)',
                  borderRadius: 12, padding: '10px 8px', textAlign: 'center',
                  backdropFilter: 'blur(8px)',
                }}>
                  <div style={{ fontSize: 14, marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 17, color: rank.color, letterSpacing: '-.02em', lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: 9, color: 'rgba(240,237,230,.3)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Member code */}
            {memberInfo && (
              <div style={{
                marginTop: 16, paddingTop: 14,
                borderTop: '1px solid rgba(245,237,218,.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                opacity: mounted ? 1 : 0, transition: 'opacity .5s .5s',
              }}>
                <span style={{ fontSize: 11, color: 'rgba(240,237,230,.25)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>
                  Kode Member
                </span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 15, color: `${rank.color}cc`, letterSpacing: 3 }}>
                  {memberInfo.code}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ══════════════ TABS ══════════════ */}
        <div style={{
          display: 'flex', background: '#0a0f0b',
          borderBottom: '1px solid rgba(56,102,65,.15)',
          position: 'sticky', top: 0, zIndex: 5,
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '12px 0',
              background: 'none', border: 'none',
              borderBottom: `2px solid ${tab === t.id ? rank.color : 'transparent'}`,
              color: tab === t.id ? rank.color : 'rgba(240,237,230,.3)',
              fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 11,
              cursor: 'pointer', transition: 'color .15s, border-color .15s',
              textTransform: 'uppercase', letterSpacing: '.06em',
            }}>
              <div style={{ fontSize: 14, marginBottom: 2 }}>{t.icon}</div>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════ CONTENT ══════════════ */}
        <div style={{ padding: '20px 20px', background: 'var(--bg)' }}>

          {/* ── PROFIL TAB ── */}
          {tab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { section: 'Info Akun', rows: [
                  { label: 'Nama', val: userName },
                  { label: 'Bergabung', val: memberInfo ? new Date(memberInfo.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
                  { label: 'Rank', val: `${rank.rank} · ${rank.label}`, color: rank.color },
                  { label: 'Total XP', val: `${totalPoints.toLocaleString()} poin`, color: 'var(--gold)' },
                  { label: 'Freeze Shield', val: `${freeze} tersisa` },
                ]},
                { section: 'Progress Hari Ini', rows: [
                  { label: 'Sholat Wajib', val: `${doneCount}/5`, bar: (doneCount / 5) * 100, color: rank.color },
                  { label: 'Misi Amalan', val: `${misiCount}`, bar: Math.min((misiCount / 20) * 100, 100), color: rank.color },
                ]},
              ].map(({ section, rows }) => (
                <div key={section} style={{
                  background: 'rgba(245,237,218,.03)',
                  border: '1px solid rgba(245,237,218,.07)',
                  borderRadius: 16, overflow: 'hidden',
                }}>
                  <div style={{
                    padding: '10px 16px',
                    borderBottom: '1px solid rgba(245,237,218,.06)',
                    background: 'rgba(245,237,218,.02)',
                    fontWeight: 700, fontSize: 10,
                    color: rank.color, textTransform: 'uppercase', letterSpacing: '.12em',
                  }}>
                    {section}
                  </div>
                  {rows.map(({ label, val, color, bar }, i, arr) => (
                    <div key={label} style={{
                      padding: '13px 16px',
                      borderBottom: i < arr.length - 1 ? '1px solid rgba(245,237,218,.05)' : 'none',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, color: 'rgba(240,237,230,.45)', fontWeight: 500 }}>{label}</span>
                        <span style={{ fontSize: 13, color: color || 'rgba(240,237,230,.8)', fontWeight: 700 }}>{val}</span>
                      </div>
                      {bar !== undefined && (
                        <div style={{ marginTop: 8 }}>
                          <XPBar pct={bar} color={color || rank.color} shimmer={false} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* ── RANK TAB ── */}
          {tab === 'rank' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 12, color: 'rgba(240,237,230,.3)', marginBottom: 4, textAlign: 'center' }}>
                Kumpulkan XP dari ibadah untuk naik rank
              </div>
              {RANK_SYSTEM.map((r, i) => {
                const isCurrent  = r.rank === rank.rank;
                const isUnlocked = totalPoints >= r.minPts;
                const nextR      = RANK_SYSTEM[i + 1];
                return (
                  <div key={r.rank} style={{
                    background: isCurrent
                      ? `linear-gradient(135deg, ${r.color}10, rgba(245,237,218,.02))`
                      : 'rgba(245,237,218,.02)',
                    border: `1px solid ${isCurrent ? r.color + '55' : 'rgba(245,237,218,.07)'}`,
                    borderRadius: 14, padding: '14px 16px',
                    display: 'flex', alignItems: 'center', gap: 14,
                    opacity: isUnlocked ? 1 : .35,
                    transition: 'all .2s',
                    transform: isCurrent ? 'scale(1.01)' : 'scale(1)',
                  }}>
                    <RankBadge rank={r} size={isCurrent ? 52 : 40} pulse={isCurrent} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 800, fontSize: 16, color: isCurrent ? r.color : 'rgba(240,237,230,.7)' }}>
                          {r.label}
                        </span>
                        {isCurrent && (
                          <span style={{
                            fontSize: 9, background: `${r.color}20`, color: r.color,
                            border: `1px solid ${r.color}44`, borderRadius: 4,
                            padding: '2px 7px', fontWeight: 800, letterSpacing: '.06em',
                          }}>
                            ► RANK KAMU
                          </span>
                        )}
                      </div>
                      <div style={{ fontFamily: 'var(--f-ar)', fontSize: 11, color: `${r.color}70`, direction: 'rtl', marginBottom: 6 }}>
                        {r.label === 'Mubtadi' ? 'مُبْتَدِئ' : r.label === 'Mutaallim' ? 'مُتَعَلِّم' : r.label === 'Mutawassit' ? 'مُتَوَسِّط' : r.label === 'Mutaqaddim' ? 'مُتَقَدِّم' : r.label === 'Muttaqin' ? 'مُتَّقِن' : r.label === 'Wali' ? 'وَلِيّ' : r.label === 'Shiddiq' ? 'صِدِّيق' : 'أُولُو الأَلْبَاب'}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(240,237,230,.3)' }}>
                        {r.minPts.toLocaleString()} XP
                        {!isUnlocked && ` · butuh ${(r.minPts - totalPoints).toLocaleString()} XP lagi`}
                      </div>
                      {isCurrent && nextR && (
                        <div style={{ marginTop: 8 }}>
                          <XPBar pct={pct} color={r.color} nextColor={nextR.color} />
                          <div style={{ fontSize: 10, color: 'rgba(240,237,230,.25)', marginTop: 4 }}>
                            {totalPoints - r.minPts} / {nextR.minPts - r.minPts} XP menuju Rank {nextR.rank}
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: isUnlocked ? 18 : 16, flexShrink: 0 }}>
                      {isCurrent ? '' : isUnlocked ? '✓' : '🔒'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── BADGES TAB ── */}
          {tab === 'badges' && (
            <div>
              <div style={{ fontSize: 12, color: 'rgba(240,237,230,.3)', marginBottom: 14, textAlign: 'center' }}>
                {(unlockedBadges || []).length} / {BADGES.length} badge diraih
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {BADGES.map((b, i) => {
                  const unlocked = (unlockedBadges || []).includes(b.id);
                  return (
                    <div key={b.id} style={{
                      background: unlocked
                        ? `linear-gradient(145deg, ${rank.color}12, rgba(245,237,218,.03))`
                        : 'rgba(245,237,218,.02)',
                      border: `1px solid ${unlocked ? rank.color + '44' : 'rgba(245,237,218,.07)'}`,
                      borderRadius: 14, padding: '16px 14px',
                      opacity: unlocked ? 1 : .4,
                      transition: 'all .2s',
                      position: 'relative', overflow: 'hidden',
                    }}>
                      {unlocked && (
                        <div style={{
                          position: 'absolute', top: -20, right: -20, width: 80, height: 80,
                          background: `radial-gradient(circle, ${rank.color}20, transparent 65%)`,
                          pointerEvents: 'none',
                        }} />
                      )}
                      <div style={{ fontSize: 30, marginBottom: 10, filter: unlocked ? 'none' : 'grayscale(1)' }}>
                        {b.icon}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: 13, color: unlocked ? 'rgba(240,237,230,.9)' : 'rgba(240,237,230,.4)', marginBottom: 2 }}>
                        {b.name}
                      </div>
                      <div style={{ fontFamily: 'var(--f-ar)', fontSize: 10, color: unlocked ? `${rank.color}88` : 'rgba(240,237,230,.2)', direction: 'rtl', marginBottom: 6 }}>
                        {b.nameAr}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(240,237,230,.3)', lineHeight: 1.6 }}>{b.desc}</div>
                      {unlocked && (
                        <div style={{ marginTop: 10, fontSize: 10, color: rank.color, fontWeight: 800, letterSpacing: '.06em' }}>
                          ✦ DIRAIH
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {tab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Edit nama */}
              <div style={{ background: 'rgba(245,237,218,.03)', border: '1px solid rgba(245,237,218,.07)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(245,237,218,.06)', fontWeight: 700, fontSize: 10, color: rank.color, textTransform: 'uppercase', letterSpacing: '.12em' }}>
                  Edit Profil
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: 12, color: 'rgba(240,237,230,.4)', marginBottom: 8, fontWeight: 600 }}>Nama Tampilan</div>
                  <input
                    className="tinput"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); }}
                    placeholder="Nama kamu"
                    style={{ width: '100%', boxSizing: 'border-box', marginBottom: 10 }}
                  />
                  <button
                    className="btn gold"
                    style={{ width: '100%', padding: '11px 0', fontSize: 13, opacity: editName.trim() && editName !== userName ? 1 : .4 }}
                    onClick={handleSaveName}
                    disabled={saving || !editName.trim() || editName === userName}
                  >
                    {saving ? '⟳ Menyimpan...' : saved ? '✦ Tersimpan!' : 'Simpan Nama'}
                  </button>
                  <div style={{ fontSize: 11, color: 'rgba(240,237,230,.25)', marginTop: 8, lineHeight: 1.6 }}>
                    Perubahan nama langsung terlihat oleh admin.
                  </div>
                </div>
              </div>

              {/* App info */}
              <div style={{ background: 'rgba(245,237,218,.03)', border: '1px solid rgba(245,237,218,.07)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(245,237,218,.06)', fontWeight: 700, fontSize: 10, color: rank.color, textTransform: 'uppercase', letterSpacing: '.12em' }}>
                  Tentang Deenme
                </div>
                {[
                  { label: 'Versi', val: '1.0.0' },
                  { label: 'Dibuat oleh', val: 'Dar Dev' },
                  { label: 'Untuk', val: 'Keluarga Talqeeh 🌿' },
                ].map(({ label, val }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(245,237,218,.05)' }}>
                    <span style={{ fontSize: 13, color: 'rgba(240,237,230,.4)' }}>{label}</span>
                    <span style={{ fontSize: 13, color: 'rgba(240,237,230,.75)', fontWeight: 600 }}>{val}</span>
                  </div>
                ))}
                <div style={{ padding: '12px 16px' }}>
                  <a href="https://talqeeh.vercel.app" target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 13, color: rank.color, fontWeight: 700, textDecoration: 'none' }}>
                    🔗 Kunjungi Talqeeh →
                  </a>
                </div>
              </div>

              {/* Logout */}
              <div style={{ background: 'rgba(188,71,73,.04)', border: '1px solid rgba(188,71,73,.2)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(188,71,73,.1)', fontWeight: 700, fontSize: 10, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '.12em' }}>
                  Keluar
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: 12, color: 'rgba(240,237,230,.3)', marginBottom: 12, lineHeight: 1.7 }}>
                    Data ibadahmu tersimpan di server. Kamu bisa masuk kembali kapan saja dengan kode yang sama.
                  </div>
                  <button
                    onClick={() => { if (confirm('Keluar dari Deenme?')) onLogout(); }}
                    style={{
                      width: '100%', padding: '11px 0', borderRadius: 10,
                      background: 'rgba(188,71,73,.08)',
                      border: '1px solid rgba(188,71,73,.3)',
                      color: 'var(--danger)', fontFamily: 'var(--f-head)',
                      fontWeight: 700, fontSize: 13, cursor: 'pointer',
                      transition: 'background .15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(188,71,73,.16)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(188,71,73,.08)'}
                  >
                    Keluar dari Deenme
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
