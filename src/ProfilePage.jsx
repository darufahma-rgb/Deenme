import { useState, useEffect } from 'react';
import { supabase } from './supabase.js';
import { BADGES, getRank, getLevel, getNextRank, RANK_SYSTEM } from './dashboard.jsx';

function getInitials(name) {
  return (name || 'A').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function RankBadge({ rank, size = 48 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: `rgba(245,237,218,.06)`,
      border: `2px solid ${rank.color}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--f-head)', fontWeight: 900,
      fontSize: size * 0.36, color: rank.color,
      boxShadow: `0 0 ${size * 0.4}px -${size * 0.1}px ${rank.color}`,
      flexShrink: 0,
    }}>
      {rank.rank}
    </div>
  );
}

export function ProfilePage({
  userName, codeId,
  totalPoints, streak, freeze,
  prayers, misiDone, unlockedBadges,
  onUpdateName, onLogout,
}) {
  const [tab, setTab]           = useState('profile');
  const [editName, setEditName] = useState(userName);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [memberInfo, setMemberInfo] = useState(null);

  const rank      = getRank(totalPoints);
  const nextRank  = getNextRank(totalPoints);
  const level     = getLevel(totalPoints);
  const doneCount = Object.values(prayers || {}).filter(v => v).length;
  const misiCount = Object.keys(misiDone || {}).length;

  useEffect(() => {
    if (!codeId) return;
    supabase.from('member_codes').select('name, code, created_at').eq('id', codeId).single()
      .then(({ data }) => { if (data) setMemberInfo(data); });
  }, [codeId]);

  const handleSaveName = async () => {
    if (!editName.trim() || editName === userName) return;
    setSaving(true);
    await supabase.from('member_codes').update({ name: editName.trim() }).eq('id', codeId);
    onUpdateName(editName.trim());
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const pct = level.next ? ((totalPoints - level.low) / (level.next - level.low)) * 100 : 100;

  return (
    <div className="main fade-in">
      <div className="content scrl" style={{ paddingBottom: 100 }}>

        {/* ── HERO CARD ── */}
        <div style={{
          background: `linear-gradient(145deg, #1a2e1c, ${rank.bg || '#1a2e1c'})`,
          border: `1px solid ${rank.border || 'rgba(56,102,65,.3)'}`,
          borderRadius: 18, padding: '24px 20px', marginBottom: 16,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 160, height: 160, borderRadius: '50%',
            background: `radial-gradient(circle, ${rank.glow || 'rgba(56,102,65,.3)'}, transparent 65%)`,
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, position: 'relative' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18, flexShrink: 0,
              background: `linear-gradient(135deg, ${rank.color}33, ${rank.color}11)`,
              border: `2px solid ${rank.color}66`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 22, color: rank.color,
            }}>
              {getInitials(userName)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 20, color: '#f5edda', letterSpacing: '-.02em', lineHeight: 1.1 }}>
                {userName}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                <RankBadge rank={rank} size={28} />
                <div>
                  <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 12, color: rank.color }}>
                    Rank {rank.rank} · {rank.label}
                  </div>
                  <div style={{ fontFamily: 'var(--f-ar)', fontSize: 11, color: `${rank.color}99`, direction: 'rtl' }}>
                    {RANK_SYSTEM.find(r => r.rank === rank.rank) ? level.ar : ''}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: 'rgba(245,237,218,.5)', fontFamily: 'var(--f-head)' }}>
                    {totalPoints} XP
                  </span>
                  {nextRank && (
                    <span style={{ fontSize: 11, color: 'rgba(245,237,218,.4)', fontFamily: 'var(--f-head)' }}>
                      {nextRank.minPts - totalPoints} XP → Rank {nextRank.rank}
                    </span>
                  )}
                </div>
                <div style={{ height: 5, background: 'rgba(245,237,218,.1)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    background: `linear-gradient(90deg, ${rank.color}, ${nextRank?.color || rank.color})`,
                    width: `${Math.min(pct, 100)}%`,
                    transition: 'width 1s cubic-bezier(.22,1,.36,1)',
                    boxShadow: `0 0 8px ${rank.color}`,
                  }} />
                </div>
              </div>
            </div>
          </div>

          {memberInfo && (
            <div style={{
              marginTop: 16, paddingTop: 14,
              borderTop: `1px solid rgba(245,237,218,.08)`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 11, color: 'rgba(245,237,218,.35)', fontFamily: 'var(--f-head)' }}>
                Kode member
              </span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 14, color: rank.color, letterSpacing: 2 }}>
                {memberInfo.code}
              </span>
            </div>
          )}
        </div>

        {/* ── STATS ROW ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'Streak',  val: streak,           unit: 'hari',    icon: '🔥' },
            { label: 'Sholat',  val: `${doneCount}/5`, unit: 'hari ini', icon: '🕌' },
            { label: 'XP',      val: totalPoints,      unit: 'total',   icon: '⭐' },
            { label: 'Misi',    val: misiCount,        unit: 'selesai', icon: '✓' },
          ].map(({ label, val, icon }) => (
            <div key={label} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '12px 10px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 16, marginBottom: 4 }}>{icon}</div>
              <div style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 18, color: 'var(--gold)', letterSpacing: '-.02em', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: 9, color: 'var(--text-3)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'var(--elevated)', borderRadius: 10, padding: 4 }}>
          {[
            { id: 'profile',  label: 'Profil' },
            { id: 'rank',     label: 'Rank' },
            { id: 'badges',   label: 'Badge' },
            { id: 'settings', label: 'Pengaturan' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '8px 0', borderRadius: 7, border: 'none',
              background: tab === t.id ? 'var(--surface)' : 'transparent',
              color: tab === t.id ? 'var(--gold)' : 'var(--text-3)',
              fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 12,
              cursor: 'pointer', transition: 'all .15s',
              boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,.08)' : 'none',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ════ TAB: PROFIL ════ */}
        {tab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--elevated)' }}>
                <span style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.1em' }}>
                  Info Akun
                </span>
              </div>
              {[
                { label: 'Nama', val: userName },
                { label: 'Bergabung', val: memberInfo ? new Date(memberInfo.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
                { label: 'Rank saat ini', val: `${rank.rank} · ${rank.label}` },
                { label: 'Total XP', val: `${totalPoints} poin` },
                { label: 'Freeze tersisa', val: `${freeze} shield` },
              ].map(({ label, val }, i, arr) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '13px 16px',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <span style={{ fontSize: 13, color: 'var(--text-2)', fontFamily: 'var(--f-head)', fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: 13, color: 'var(--text)', fontFamily: 'var(--f-head)', fontWeight: 600 }}>{val}</span>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--elevated)' }}>
                <span style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.1em' }}>
                  Progress Hari Ini
                </span>
              </div>
              <div style={{ padding: '14px 16px' }}>
                {[
                  { label: 'Sholat wajib', pct: (doneCount / 5) * 100, val: `${doneCount}/5` },
                  { label: 'Misi amalan',  pct: Math.min((misiCount / 20) * 100, 100), val: `${misiCount} selesai` },
                ].map(({ label, pct: p, val }) => (
                  <div key={label} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--f-head)', fontWeight: 600 }}>{label}</span>
                      <span style={{ fontSize: 12, color: 'var(--gold)', fontFamily: 'var(--f-head)', fontWeight: 700 }}>{val}</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--elevated)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 3,
                        background: 'linear-gradient(90deg, var(--gold), #a7c957)',
                        width: `${p}%`, transition: 'width 1s cubic-bezier(.22,1,.36,1)',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════ TAB: RANK ════ */}
        {tab === 'rank' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {RANK_SYSTEM.map((r) => {
              const isCurrentRank = r.rank === rank.rank;
              const isUnlocked = totalPoints >= r.minPts;
              return (
                <div key={r.rank} style={{
                  background: isCurrentRank ? `linear-gradient(135deg, ${r.bg || 'var(--surface)'}, var(--surface))` : 'var(--surface)',
                  border: `1px solid ${isCurrentRank ? r.color : 'var(--border)'}`,
                  borderRadius: 14, padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  opacity: isUnlocked ? 1 : .45,
                  transition: 'all .2s',
                }}>
                  <RankBadge rank={r} size={isCurrentRank ? 52 : 40} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 15, color: isCurrentRank ? r.color : 'var(--text)' }}>
                        {r.label}
                      </span>
                      {isCurrentRank && (
                        <span style={{ fontSize: 10, background: `${r.color}22`, color: r.color, border: `1px solid ${r.color}44`, borderRadius: 4, padding: '2px 7px', fontWeight: 700 }}>
                          RANK KAMU
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3, fontFamily: 'var(--f-head)' }}>
                      {r.minPts.toLocaleString()} XP {!isUnlocked && `· butuh ${(r.minPts - totalPoints).toLocaleString()} XP lagi`}
                    </div>
                    {isCurrentRank && nextRank && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ height: 4, background: 'rgba(245,237,218,.1)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', borderRadius: 2, width: `${pct}%`,
                            background: `linear-gradient(90deg, ${r.color}, ${nextRank.color})`,
                            transition: 'width 1s cubic-bezier(.22,1,.36,1)',
                          }} />
                        </div>
                        <div style={{ fontSize: 10, color: 'rgba(245,237,218,.35)', marginTop: 4, fontFamily: 'var(--f-head)' }}>
                          {totalPoints - r.minPts} / {nextRank.minPts - r.minPts} XP menuju Rank {nextRank.rank}
                        </div>
                      </div>
                    )}
                  </div>
                  {isUnlocked && !isCurrentRank && <div style={{ fontSize: 16 }}>✓</div>}
                  {!isUnlocked && <div style={{ fontSize: 18 }}>🔒</div>}
                </div>
              );
            })}
          </div>
        )}

        {/* ════ TAB: BADGES ════ */}
        {tab === 'badges' && (
          <div>
            <div style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 12, color: 'var(--text-3)', marginBottom: 12 }}>
              {unlockedBadges?.length || 0} dari {BADGES.length} badge diraih
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {BADGES.map(b => {
                const unlocked = (unlockedBadges || []).includes(b.id);
                return (
                  <div key={b.id} style={{
                    background: unlocked
                      ? 'linear-gradient(135deg, var(--elevated), color-mix(in srgb, var(--gold) 8%, transparent))'
                      : 'var(--surface)',
                    border: `1px solid ${unlocked ? 'var(--gold-line)' : 'var(--border)'}`,
                    borderRadius: 14, padding: '16px 14px',
                    opacity: unlocked ? 1 : .45,
                    transition: 'all .2s',
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 8, filter: unlocked ? 'none' : 'grayscale(1)' }}>{b.icon}</div>
                    <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 13, color: unlocked ? 'var(--text)' : 'var(--text-3)', marginBottom: 3 }}>
                      {b.name}
                    </div>
                    <div style={{ fontFamily: 'var(--f-ar)', fontSize: 10, color: 'var(--gold)', opacity: unlocked ? .8 : .4, direction: 'rtl', marginBottom: 5 }}>
                      {b.nameAr}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.6 }}>{b.desc}</div>
                    {unlocked && <div style={{ marginTop: 8, fontSize: 10, color: 'var(--gold)', fontWeight: 700 }}>✓ Diraih</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════ TAB: SETTINGS ════ */}
        {tab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--elevated)' }}>
                <span style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.1em' }}>
                  Edit Profil
                </span>
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8, fontFamily: 'var(--f-head)', fontWeight: 600 }}>
                  Nama Tampilan
                </div>
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
                  style={{ width: '100%', padding: '11px 0', fontSize: 13, opacity: editName.trim() && editName !== userName ? 1 : .5 }}
                  onClick={handleSaveName}
                  disabled={saving || !editName.trim() || editName === userName}
                >
                  {saving ? '⟳ Menyimpan...' : saved ? '✓ Tersimpan!' : 'Simpan Nama'}
                </button>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 8, lineHeight: 1.6 }}>
                  Nama ini akan muncul di profil dan diketahui oleh admin.
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--elevated)' }}>
                <span style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.1em' }}>
                  Tentang Deenme
                </span>
              </div>
              {[
                { label: 'Versi',       val: '1.0.0' },
                { label: 'Dibuat oleh', val: 'Dar Dev' },
                { label: 'Untuk',       val: 'Keluarga Talqeeh 🌿' },
              ].map(({ label, val }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-2)', fontFamily: 'var(--f-head)' }}>{label}</span>
                  <span style={{ fontSize: 13, color: 'var(--text)', fontFamily: 'var(--f-head)', fontWeight: 600 }}>{val}</span>
                </div>
              ))}
              <div style={{ padding: '12px 16px' }}>
                <a href="https://talqeeh.vercel.app" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 13, color: 'var(--gold)', fontFamily: 'var(--f-head)', fontWeight: 700, textDecoration: 'none' }}>
                  🔗 Kunjungi Talqeeh →
                </a>
              </div>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid color-mix(in srgb, var(--danger) 25%, transparent)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--elevated)' }}>
                <span style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 11, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '.1em' }}>
                  Keluar
                </span>
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 12, lineHeight: 1.6 }}>
                  Data ibadah kamu tersimpan di server. Kamu bisa masuk kembali kapan saja dengan kode yang sama.
                </div>
                <button
                  onClick={() => { if (confirm('Keluar dari Deenme?')) onLogout(); }}
                  style={{
                    width: '100%', padding: '11px 0', borderRadius: 10,
                    background: 'transparent',
                    border: '1.5px solid color-mix(in srgb, var(--danger) 50%, transparent)',
                    color: 'var(--danger)', fontFamily: 'var(--f-head)',
                    fontWeight: 700, fontSize: 13, cursor: 'pointer',
                    transition: 'background .15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--danger) 8%, transparent)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  Keluar dari Deenme
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
