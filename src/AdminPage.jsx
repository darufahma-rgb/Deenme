import { useState, useEffect, useCallback } from 'react';
import { serverFetch } from './api.js';

const ADMIN_PIN = '1234';

function AdminPinGate({ onUnlock }) {
  const [pin, setPin]     = useState('');
  const [err, setErr]     = useState(false);
  const [shake, setShake] = useState(false);

  const check = (next) => {
    if (next === ADMIN_PIN) {
      sessionStorage.setItem('deenme-admin-pin', '1');
      onUnlock();
    } else {
      setErr(true);
      setShake(true);
      setPin('');
      setTimeout(() => setShake(false), 400);
    }
  };

  const tap = (d) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    setErr(false);
    if (next.length === 4) {
      setTimeout(() => check(next), 120);
    }
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', fontFamily: 'var(--f-head)' }}>
      <div style={{ textAlign: 'center', padding: 32 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🔐</div>
        <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--text)', letterSpacing: '-.02em', marginBottom: 4 }}>Admin Panel</div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 28 }}>Masukkan PIN untuk melanjutkan</div>

        <div style={{
          display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 28,
          animation: shake ? 'shake .35s ease' : 'none',
        }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              width: 16, height: 16, borderRadius: '50%',
              background: i < pin.length ? 'var(--gold)' : 'var(--border-2)',
              border: i < pin.length ? 'none' : '2px solid var(--border-2)',
              transition: 'background .15s',
              boxShadow: i < pin.length ? '0 0 8px var(--gold-line)' : 'none',
            }} />
          ))}
        </div>

        {err && <div style={{ fontSize: 12, color: 'var(--danger)', marginBottom: 16 }}>PIN salah. Coba lagi.</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, maxWidth: 240, margin: '0 auto' }}>
          {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((d, i) => (
            <button key={i} onClick={() => {
              if (d === '⌫') { setPin(p => p.slice(0,-1)); setErr(false); }
              else if (d !== '') tap(String(d));
            }} style={{
              height: 60, borderRadius: 14,
              background: d === '' ? 'transparent' : 'var(--surface)',
              border: d === '' ? 'none' : '1px solid var(--border)',
              fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 20,
              color: 'var(--text)', cursor: d === '' ? 'default' : 'pointer',
              transition: 'transform .1s, background .1s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
              onPointerDown={e => { if (d !== '') e.currentTarget.style.transform = 'scale(.93)'; }}
              onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function genCode() { return String(Math.floor(100000 + Math.random() * 900000)); }
function fmtDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
function fmtTime(str) {
  if (!str) return '—';
  return new Date(str).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}
function isToday(str) {
  if (!str) return false;
  return str.startsWith(new Date().toISOString().slice(0,10));
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '16px 18px', flex: 1, minWidth: 120,
    }}>
      <div style={{ fontSize: 20, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 28, color: color || 'var(--gold)', letterSpacing: '-.03em', lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 11, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 6 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

export function AdminPage({ onLogout }) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('deenme-admin-pin') === '1');
  const [tab, setTab]           = useState('dashboard');
  const [codes, setCodes]       = useState([]);
  const [userData, setUserData] = useState([]);
  const [search, setSearch]     = useState('');
  const [name, setName]         = useState('');
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const loadAll = useCallback(async () => {
    setLoadingData(true);
    const res = await serverFetch('/api/admin/members');
    if (res.ok) {
      const { codes: c, users: u } = await res.json();
      setCodes(c || []);
      setUserData(u || []);
    }
    setLoadingData(false);
  }, []);

  useEffect(() => { if (unlocked) loadAll(); }, [unlocked, loadAll]);

  if (!unlocked) return <AdminPinGate onUnlock={() => setUnlocked(true)} />;

  const activeCount   = codes.filter(c => c.is_active).length;
  const todayCodes    = codes.filter(c => isToday(c.created_at)).length;
  const todayActive   = userData.filter(u => isToday(u.updated_at)).length;
  const filteredCodes = codes.filter(c =>
    !search || (c.name || '').toLowerCase().includes(search.toLowerCase()) || c.code.includes(search)
  );
  const getUserData = (codeId) => userData.find(u => u.code_id === codeId);

  const generateCode = async () => {
    if (!name.trim() || loading) return;
    setLoading(true);
    const res = await serverFetch('/api/admin/codes', {
      method: 'POST',
      body: JSON.stringify({ name: name.trim() }),
    });
    if (res.ok) {
      const data = await res.json();
      setGenerated({ code: data.code, name: name.trim() });
      setName('');
      loadAll();
    }
    setLoading(false);
  };

  const toggleActive = async (id, current) => {
    await serverFetch(`/api/admin/codes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: !current }),
    });
    loadAll();
  };

  const deleteCode = async (id) => {
    if (!confirm('Hapus kode ini? User tidak bisa login lagi.')) return;
    await serverFetch(`/api/admin/codes/${id}`, { method: 'DELETE' });
    loadAll();
  };

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'generate',  label: 'Generate',  icon: '🔑' },
    { id: 'members',   label: 'Member',    icon: '👥' },
    { id: 'activity',  label: 'Aktivitas', icon: '📈' },
  ];

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', fontFamily: 'var(--f-head)' }}>

      {/* ── Header ── */}
      <div style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '0 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 56, position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>🛡️</span>
          <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)', letterSpacing: '-.02em' }}>Deenme Admin</span>
          {loadingData && <span style={{ fontSize: 11, color: 'var(--text-3)' }}>memuat...</span>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={loadAll} style={{
            background: 'var(--elevated)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '6px 12px', fontSize: 12, color: 'var(--text-2)',
            fontFamily: 'var(--f-head)', cursor: 'pointer', fontWeight: 600,
          }}>⟳ Refresh</button>
          <button onClick={() => { sessionStorage.removeItem('deenme-admin-pin'); onLogout(); }} style={{
            background: 'none', border: '1px solid var(--border)',
            borderRadius: 8, padding: '6px 12px', fontSize: 12,
            color: 'var(--danger)', fontFamily: 'var(--f-head)', cursor: 'pointer', fontWeight: 600,
          }}>Keluar</button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        display: 'flex', gap: 4, padding: '10px 24px',
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        overflowX: 'auto',
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 9, border: 'none',
            background: tab === t.id ? 'var(--gold-soft)' : 'transparent',
            color: tab === t.id ? 'var(--gold)' : 'var(--text-3)',
            fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 13,
            cursor: 'pointer', flexShrink: 0, transition: 'all .15s',
          }}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>

        {/* ════ DASHBOARD ════ */}
        {tab === 'dashboard' && (
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--text)', letterSpacing: '-.02em', marginBottom: 20 }}>
              Selamat datang, Admin 👋
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
              <StatCard icon="👥" label="Total Member" value={codes.length} sub={`${activeCount} aktif`} />
              <StatCard icon="✅" label="Member Aktif" value={activeCount} sub={`${codes.length - activeCount} nonaktif`} color="var(--ok)" />
              <StatCard icon="🔑" label="Kode Hari Ini" value={todayCodes} sub="baru dibuat" color="var(--text)" />
              <StatCard icon="🔥" label="Aktif Hari Ini" value={todayActive} sub="ada aktivitas" color="var(--mint)" />
            </div>

            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>
              Kode Terbaru
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {codes.slice(0, 5).map(c => {
                const ud = getUserData(c.id);
                return (
                  <div key={c.id} style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 12, padding: '12px 16px',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: c.is_active ? 'var(--gold-soft)' : 'var(--elevated)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 13, color: c.is_active ? 'var(--gold)' : 'var(--text-3)',
                      flexShrink: 0,
                    }}>
                      {(c.name || '?')[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{c.name || 'Tanpa nama'}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                        Kode: <span style={{ fontFamily: 'monospace', color: 'var(--gold)' }}>{c.code}</span>
                        {' · '}{fmtDate(c.created_at)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 11, color: c.is_active ? 'var(--ok)' : 'var(--danger)', fontWeight: 700 }}>
                        {c.is_active ? '● Aktif' : '● Nonaktif'}
                      </div>
                      {ud && (
                        <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>
                          {isToday(ud.updated_at) ? '🔥 aktif hari ini' : `terakhir ${fmtDate(ud.updated_at)}`}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => setTab('members')} style={{
              marginTop: 12, background: 'none', border: 'none',
              color: 'var(--gold)', fontFamily: 'var(--f-head)', fontWeight: 700,
              fontSize: 13, cursor: 'pointer', padding: 0,
            }}>
              Lihat semua member →
            </button>
          </div>
        )}

        {/* ════ GENERATE ════ */}
        {tab === 'generate' && (
          <div style={{ maxWidth: 480 }}>
            <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--text)', letterSpacing: '-.02em', marginBottom: 20 }}>
              Generate Kode Member 🔑
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>
                Buat Kode Baru
              </div>
              <input
                className="tinput"
                style={{ width: '100%', textAlign: 'left', padding: '11px 14px', marginBottom: 12, boxSizing: 'border-box' }}
                placeholder="Nama member (misal: Akbar)"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') generateCode(); }}
              />
              <button className="btn gold" style={{ width: '100%', padding: '12px 0', fontWeight: 700 }}
                onClick={generateCode} disabled={loading || !name.trim()}>
                {loading ? '⟳ Generating...' : '✦ Generate Kode'}
              </button>
            </div>

            {generated && (
              <div style={{
                background: 'var(--gold-soft)', border: '1px solid var(--gold-line)',
                borderRadius: 16, padding: 24, textAlign: 'center',
                animation: 'detailIn .3s ease',
              }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>
                  Kode untuk {generated.name}
                </div>
                <div style={{
                  fontFamily: 'monospace', fontWeight: 900,
                  fontSize: 48, color: 'var(--gold)', letterSpacing: 8,
                  margin: '12px 0',
                }}>
                  {generated.code}
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <button className="btn" style={{ flex: 1, padding: '10px 0', fontSize: 13 }}
                    onClick={() => { navigator.clipboard.writeText(generated.code); }}>
                    📋 Salin Kode
                  </button>
                  <button className="btn" style={{ flex: 1, padding: '10px 0', fontSize: 13 }}
                    onClick={() => { navigator.clipboard.writeText(`Kode Deenme kamu: ${generated.code}\nMasuk di: ${window.location.origin}`); }}>
                    📤 Salin Pesan
                  </button>
                </div>
                <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-3)' }}>
                  Bagikan kode ini ke {generated.name}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ MEMBERS ════ */}
        {tab === 'members' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--text)', letterSpacing: '-.02em' }}>
                Semua Member ({codes.length})
              </div>
              <input
                className="tinput"
                style={{ padding: '8px 14px', fontSize: 13, minWidth: 200, width: 'auto' }}
                placeholder="🔍 Cari nama atau kode..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredCodes.map(c => {
                const ud = getUserData(c.id);
                const todayAct = ud && isToday(ud.updated_at);
                return (
                  <div key={c.id} style={{
                    background: 'var(--surface)', border: `1px solid ${todayAct ? 'var(--gold-line)' : 'var(--border)'}`,
                    borderRadius: 14, padding: '14px 16px',
                    display: 'flex', alignItems: 'center', gap: 12,
                    transition: 'border-color .15s',
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                      background: c.is_active ? 'var(--gold-soft)' : 'var(--elevated)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 15, color: c.is_active ? 'var(--gold)' : 'var(--text-3)',
                    }}>
                      {(c.name || '?')[0].toUpperCase()}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{c.name || 'Tanpa nama'}</span>
                        {todayAct && <span style={{ fontSize: 10, background: 'var(--gold-soft)', color: 'var(--gold)', borderRadius: 4, padding: '2px 6px', fontWeight: 700 }}>🔥 Aktif hari ini</span>}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'monospace', color: 'var(--gold)', fontWeight: 700 }}>{c.code}</span>
                        <span>·</span>
                        <span>Dibuat {fmtDate(c.created_at)}</span>
                        {ud && <span>· Terakhir aktif {fmtTime(ud.updated_at)}</span>}
                      </div>
                      {ud && (
                        <div style={{ marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {ud.streak > 0 && <span style={{ fontSize: 10, color: 'var(--text-3)' }}>🔥 {ud.streak} hari streak</span>}
                          {ud.totalPoints > 0 && <span style={{ fontSize: 10, color: 'var(--text-3)' }}>⭐ {ud.totalPoints} XP</span>}
                          {ud.misiDone && <span style={{ fontSize: 10, color: 'var(--text-3)' }}>✓ {Object.keys(ud.misiDone || {}).length} misi</span>}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, alignItems: 'flex-end' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: c.is_active ? 'var(--ok)' : 'var(--danger)' }}>
                        {c.is_active ? '● Aktif' : '● Nonaktif'}
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => copyCode(c.code, c.id)} style={{
                          background: 'var(--elevated)', border: '1px solid var(--border)',
                          borderRadius: 7, padding: '5px 10px', fontSize: 11,
                          color: copiedId === c.id ? 'var(--ok)' : 'var(--text-2)',
                          fontFamily: 'var(--f-head)', fontWeight: 600, cursor: 'pointer',
                        }}>
                          {copiedId === c.id ? '✓ Disalin' : '📋'}
                        </button>
                        <button onClick={() => toggleActive(c.id, c.is_active)} style={{
                          background: 'var(--elevated)', border: `1px solid ${c.is_active ? 'var(--danger)' : 'var(--ok)'}`,
                          borderRadius: 7, padding: '5px 10px', fontSize: 11,
                          color: c.is_active ? 'var(--danger)' : 'var(--ok)',
                          fontFamily: 'var(--f-head)', fontWeight: 600, cursor: 'pointer',
                        }}>
                          {c.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                        <button onClick={() => deleteCode(c.id)} style={{
                          background: 'var(--elevated)', border: '1px solid var(--border)',
                          borderRadius: 7, padding: '5px 10px', fontSize: 11,
                          color: 'var(--text-3)', fontFamily: 'var(--f-head)', fontWeight: 600, cursor: 'pointer',
                        }}>
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredCodes.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)', fontSize: 13 }}>
                  Tidak ada member ditemukan
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════ ACTIVITY ════ */}
        {tab === 'activity' && (
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--text)', letterSpacing: '-.02em', marginBottom: 8 }}>
              Aktivitas User 📈
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>
              {todayActive} user aktif hari ini dari {codes.length} total member
            </div>

            <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
              🔥 Aktif Hari Ini
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {codes.filter(c => {
                const ud = getUserData(c.id);
                return ud && isToday(ud.updated_at);
              }).map(c => {
                const ud = getUserData(c.id);
                const prayers = ud?.prayers || {};
                const doneCount = Object.values(prayers).filter(v => v).length;
                return (
                  <div key={c.id} style={{
                    background: 'var(--surface)', border: '1px solid var(--gold-line)',
                    borderRadius: 14, padding: '14px 16px',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                      background: 'var(--gold-soft)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 15, color: 'var(--gold)',
                    }}>
                      {(c.name || '?')[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>
                        Terakhir: {fmtTime(ud?.updated_at)}
                      </div>
                      <div style={{ display: 'flex', gap: 10, marginTop: 5, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, color: 'var(--text-2)' }}>🕌 {doneCount}/5 sholat</span>
                        {ud?.streak > 0 && <span style={{ fontSize: 11, color: 'var(--text-2)' }}>🔥 {ud.streak} streak</span>}
                        {ud?.totalPoints > 0 && <span style={{ fontSize: 11, color: 'var(--text-2)' }}>⭐ {ud.totalPoints} XP</span>}
                        {ud?.dailyPoints > 0 && <span style={{ fontSize: 11, color: 'var(--text-2)' }}>📊 {ud.dailyPoints} poin hari ini</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
              {todayActive === 0 && (
                <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-3)', fontSize: 13,
                  background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14 }}>
                  Belum ada aktivitas hari ini
                </div>
              )}
            </div>

            <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
              Semua User — Diurutkan Terbaru
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {userData.map(ud => {
                const member = codes.find(c => c.id === ud.code_id);
                if (!member) return null;
                const prayers = ud.prayers || {};
                const doneCount = Object.values(prayers).filter(v => v).length;
                return (
                  <div key={ud.id} style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 12, padding: '12px 16px',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                      background: 'var(--elevated)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 13, color: 'var(--text-2)',
                    }}>
                      {(member.name || '?')[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>
                        {member.name}
                        {isToday(ud.updated_at) && <span style={{ marginLeft: 6, fontSize: 10, color: 'var(--gold)', fontWeight: 600 }}>🔥 hari ini</span>}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span>🕌 {doneCount}/5</span>
                        {ud.streak > 0 && <span>🔥 {ud.streak}hr</span>}
                        {ud.totalPoints > 0 && <span>⭐ {ud.totalPoints}xp</span>}
                        <span>· {fmtTime(ud.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
