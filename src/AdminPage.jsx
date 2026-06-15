import { useState, useEffect, useRef } from 'react';

const getToken = () => sessionStorage.getItem('dm-token') || '';

async function api(path, opts = {}) {
  const res = await fetch(path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'x-session-token': getToken(),
      ...(opts.headers || {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function fmtDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function xp(userData) {
  return userData?.totalPoints || userData?.xp || 0;
}

function streak(userData) {
  return userData?.streak || 0;
}

function lastActive(user) {
  return user?.updated_at || null;
}

function StatCard({ icon, label, value, sub, color = 'var(--gold)' }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '16px 18px',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: 'var(--gold-soft)', border: '1px solid var(--gold-line)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20,
      }}>{icon}</div>
      <div>
        <div style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 22, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 12, color: 'var(--text-2)', marginTop: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

export function AdminPage({ onLogout }) {
  const [tab, setTab]           = useState('members');
  const [codes, setCodes]       = useState([]);
  const [users, setUsers]       = useState([]);
  const [dreams, setDreams]     = useState([]);
  const [aiUsage, setAiUsage]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');

  const [newName, setNewName]   = useState('');
  const [genResult, setGenResult] = useState(null);
  const [genLoading, setGenLoading] = useState(false);

  const [editId, setEditId]     = useState(null);
  const [editName, setEditName] = useState('');

  const [editCode, setEditCode]     = useState('');
  const [editCodeId, setEditCodeId] = useState(null);
  const [editCodeErr, setEditCodeErr] = useState('');

  const [toast, setToast]       = useState(null);
  const toastTimer              = useRef(null);

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  };

  const load = async () => {
    setLoading(true);
    try {
      const data = await api('/api/admin/members');
      setCodes(data.codes || []);
      setUsers(data.users || []);
      setDreams(data.dreams || []);
      setAiUsage(data.aiUsage || []);
    } catch {
      showToast('Gagal memuat data', 'err');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const generateCode = async () => {
    if (!newName.trim() || genLoading) return;
    setGenLoading(true);
    try {
      const data = await api('/api/admin/members', { method: 'POST', body: { name: newName.trim() } });
      setGenResult(data);
      setNewName('');
      showToast(`Kode untuk ${data.name} berhasil dibuat`);
      load();
    } catch {
      showToast('Gagal generate kode', 'err');
    }
    setGenLoading(false);
  };

  const toggleActive = async (id, current) => {
    try {
      await api(`/api/admin/members/${id}`, { method: 'PATCH', body: { is_active: !current } });
      showToast(current ? 'Member dinonaktifkan' : 'Member diaktifkan');
      load();
    } catch {
      showToast('Gagal update status', 'err');
    }
  };

  const saveEdit = async () => {
    if (!editName.trim()) return;
    try {
      await api(`/api/admin/members/${editId}`, { method: 'PATCH', body: { name: editName.trim() } });
      showToast('Nama berhasil diupdate');
      setEditId(null);
      load();
    } catch {
      showToast('Gagal update nama', 'err');
    }
  };

  const saveEditCode = async () => {
    if (!/^\d{6}$/.test(editCode)) {
      setEditCodeErr('Kode harus 6 digit angka');
      return;
    }
    const isDuplicate = codes.some(c => c.code === editCode && c.id !== editCodeId);
    if (isDuplicate) {
      setEditCodeErr('Kode sudah dipakai member lain');
      return;
    }
    try {
      await api(`/api/admin/members/${editCodeId}`, {
        method: 'PATCH',
        body: { code: editCode },
      });
      showToast('Kode berhasil diupdate');
      setEditCodeId(null);
      setEditCode('');
      setEditCodeErr('');
      load();
    } catch {
      showToast('Gagal update kode', 'err');
    }
  };

  const deleteMember = async (id, name) => {
    if (!confirm(`Hapus member "${name}"? Semua data ibadahnya juga akan ikut terhapus.`)) return;
    try {
      await api(`/api/admin/members/${id}`, { method: 'DELETE' });
      showToast(`Member ${name} dihapus`);
      load();
    } catch {
      showToast('Gagal hapus member', 'err');
    }
  };

  const filteredCodes = codes.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    c.code.includes(search)
  );

  const activeCount   = codes.filter(c => c.is_active).length;
  const today         = new Date().toISOString().slice(0, 10);
  const activeToday   = users.filter(u => lastActive(u)?.startsWith(today)).length;
  const totalXp       = users.reduce((s, u) => s + xp(u.data), 0);
  const aiToday       = aiUsage.filter(a => a.used_date === today).length;

  const getUserData   = (codeId) => users.find(u => u.code_id === codeId)?.data || {};
  const getDreamCount = (codeId) => dreams.filter(d => d.code_id === codeId).length;
  const getAiCount    = (codeId) => aiUsage.filter(a => a.code_id === codeId && a.used_date === today).length;

  const TABS = [
    { id: 'members',  label: 'Member',    icon: '👥' },
    { id: 'generate', label: 'Generate',  icon: '➕' },
    { id: 'activity', label: 'Aktivitas', icon: '📊' },
    { id: 'dreams',   label: 'Tafsir',    icon: '🌙' },
  ];

  return (
    <div style={{
      minHeight: '100dvh', background: 'var(--bg)',
      fontFamily: 'var(--f-head)', overflowY: 'auto',
    }}>

      {toast && (
        <div style={{
          position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, background: toast.type === 'err' ? 'var(--danger)' : 'var(--gold)',
          color: 'var(--bg)', borderRadius: 10, padding: '10px 20px',
          fontWeight: 700, fontSize: 13, boxShadow: '0 4px 20px rgba(0,0,0,.15)',
          animation: 'fadeIn .2s ease',
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="./assets/Deenme_logo.png" alt="Deenme" style={{ width: 28, filter: 'brightness(0) saturate(100%) invert(28%) sepia(30%) saturate(800%) hue-rotate(95deg) brightness(85%)' }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)' }}>Deenme Admin</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{codes.length} member terdaftar</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn sm" onClick={load} style={{ fontSize: 12 }}>⟳ Refresh</button>
          <button className="btn ghost sm" onClick={onLogout} style={{ fontSize: 12 }}>Keluar</button>
        </div>
      </div>

      <div style={{ padding: '16px 16px', maxWidth: 720, margin: '0 auto' }}>

        {/* Stats overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 }}>
          <StatCard icon="👥" label="Total Member"   value={codes.length}  sub={`${activeCount} aktif`} />
          <StatCard icon="🟢" label="Aktif Hari Ini" value={activeToday}   sub="user buka app" />
          <StatCard icon="⭐" label="Total XP"       value={totalXp.toLocaleString()} sub="semua member" />
          <StatCard icon="🤖" label="AI Dipakai"     value={aiToday}       sub="penggunaan hari ini" />
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', background: 'var(--elevated)',
          borderRadius: 10, padding: 4, marginBottom: 16, gap: 2,
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '8px 0', borderRadius: 7, border: 'none',
              background: tab === t.id ? 'var(--surface)' : 'transparent',
              color: tab === t.id ? 'var(--gold)' : 'var(--text-3)',
              fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 10,
              cursor: 'pointer', transition: 'all .15s',
              textTransform: 'uppercase', letterSpacing: '.04em',
            }}>
              <div style={{ fontSize: 14, marginBottom: 2 }}>{t.icon}</div>
              {t.label}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)', fontSize: 13 }}>
            Memuat data...
          </div>
        )}

        {/* ── TAB: MEMBER LIST ── */}
        {!loading && tab === 'members' && (
          <div>
            <input
              className="tinput"
              placeholder="🔍 Cari nama atau kode..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', marginBottom: 12 }}
            />

            <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 10 }}>
              {filteredCodes.length} dari {codes.length} member
            </div>

            {filteredCodes.map(c => {
              const ud      = getUserData(c.id);
              const dreams_ = getDreamCount(c.id);
              const aiUsed  = getAiCount(c.id);
              const isEdit  = editId === c.id;

              return (
                <div key={c.id} style={{
                  background: 'var(--surface)', border: `1px solid ${c.is_active ? 'var(--border)' : 'rgba(188,71,73,.2)'}`,
                  borderRadius: 14, padding: '14px 16px', marginBottom: 10,
                  opacity: c.is_active ? 1 : .65,
                }}>
                  {/* Row 1: nama + status */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {isEdit ? (
                        <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                          <input
                            className="tinput"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditId(null); }}
                            style={{ flex: 1, fontSize: 13 }}
                            autoFocus
                          />
                          <button className="btn gold sm" onClick={saveEdit}>✓</button>
                          <button className="btn sm" onClick={() => setEditId(null)}>✕</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                          <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)' }}>{c.name || 'Tanpa nama'}</span>
                          <button
                            onClick={() => { setEditId(c.id); setEditName(c.name || ''); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--text-3)', padding: 0 }}
                          >✏️</button>
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {editCodeId === c.id ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <input
                                className="tinput"
                                value={editCode}
                                onChange={e => { setEditCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setEditCodeErr(''); }}
                                onKeyDown={e => { if (e.key === 'Enter') saveEditCode(); if (e.key === 'Escape') { setEditCodeId(null); setEditCodeErr(''); } }}
                                placeholder="6 digit angka"
                                maxLength={6}
                                style={{ width: 120, fontFamily: 'monospace', fontSize: 16, letterSpacing: 4, fontWeight: 700 }}
                                autoFocus
                              />
                              <button className="btn gold sm" onClick={saveEditCode}>✓ Simpan</button>
                              <button className="btn sm" onClick={() => { setEditCodeId(null); setEditCode(''); setEditCodeErr(''); }}>✕</button>
                            </div>
                            {editCodeErr && (
                              <div style={{ fontSize: 11, color: 'var(--danger)', fontWeight: 600 }}>⚠ {editCodeErr}</div>
                            )}
                          </div>
                        ) : (
                          <>
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 14, color: 'var(--gold)', letterSpacing: 2 }}>{c.code}</span>
                            <button
                              onClick={() => { navigator.clipboard.writeText(c.code); showToast('Kode disalin'); }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--text-3)', padding: 0 }}
                            >📋 salin</button>
                            <button
                              onClick={() => { setEditCodeId(c.id); setEditCode(c.code); setEditCodeErr(''); }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--text-3)', padding: 0 }}
                            >✏️ edit kode</button>
                            <span style={{ fontSize: 11, color: c.is_active ? 'var(--ok)' : 'var(--danger)', fontWeight: 700 }}>
                              {c.is_active ? '● Aktif' : '● Nonaktif'}
                            </span>
                          </>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>
                        Bergabung {fmtDate(c.created_at)}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: stats */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 8, marginBottom: 12,
                    padding: '10px 0',
                    borderTop: '1px solid var(--border)',
                    borderBottom: '1px solid var(--border)',
                  }}>
                    {[
                      { label: 'XP',         val: xp(ud).toLocaleString() },
                      { label: 'Streak',     val: streak(ud) + ' hari' },
                      { label: 'Tafsir',     val: dreams_ + ' mimpi' },
                      { label: 'AI hari ini', val: aiUsed > 0 ? `${aiUsed}× dipakai` : '-' },
                    ].map(({ label, val }) => (
                      <div key={label} style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--gold)' }}>{val}</div>
                        <div style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 2 }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Row 3: terakhir aktif */}
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 12 }}>
                    Terakhir aktif: {fmtDateTime(users.find(u => u.code_id === c.id)?.updated_at)}
                  </div>

                  {/* Row 4: actions */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      className="btn sm"
                      style={{
                        borderColor: c.is_active ? 'var(--danger)' : 'var(--ok)',
                        color: c.is_active ? 'var(--danger)' : 'var(--ok)',
                        fontSize: 12,
                      }}
                      onClick={() => toggleActive(c.id, c.is_active)}
                    >
                      {c.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                    <button
                      className="btn sm"
                      style={{ borderColor: 'var(--danger)', color: 'var(--danger)', fontSize: 12 }}
                      onClick={() => deleteMember(c.id, c.name)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredCodes.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>
                Tidak ada member yang cocok
              </div>
            )}
          </div>
        )}

        {/* ── TAB: GENERATE ── */}
        {!loading && tab === 'generate' && (
          <div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ height: 3, background: 'linear-gradient(90deg, var(--gold), #a7c957)' }} />
              <div style={{ padding: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 10, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 14 }}>
                  Generate Kode Member Baru
                </div>
                <input
                  className="tinput"
                  placeholder="Nama member (misal: Ahmad)"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') generateCode(); }}
                  style={{ width: '100%', boxSizing: 'border-box', marginBottom: 12 }}
                />
                <button
                  className="btn gold"
                  style={{ width: '100%', opacity: newName.trim() ? 1 : .4 }}
                  onClick={generateCode}
                  disabled={genLoading || !newName.trim()}
                >
                  {genLoading ? '⟳ Generating...' : '➕ Generate Kode'}
                </button>
              </div>
            </div>

            {genResult && (
              <div style={{
                background: 'var(--gold-soft)', border: '1px solid var(--gold-line)',
                borderRadius: 16, padding: 24, textAlign: 'center',
              }}>
                <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 700, marginBottom: 8 }}>
                  Kode untuk {genResult.name}:
                </div>
                <div style={{
                  fontFamily: 'monospace', fontWeight: 900,
                  fontSize: 48, letterSpacing: 10, color: 'var(--gold)',
                  marginBottom: 16,
                }}>
                  {genResult.code}
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <button className="btn gold" onClick={() => {
                    navigator.clipboard.writeText(genResult.code);
                    showToast('Kode disalin!');
                  }}>
                    📋 Salin Kode
                  </button>
                  <button className="btn sm" onClick={() => {
                    const msg = `Assalamu'alaikum ${genResult.name}! 🌿\n\nIni kode akses Deenme kamu:\n*${genResult.code}*\n\nBarakallahu fiikum!`;
                    navigator.clipboard.writeText(msg);
                    showToast('Pesan disalin!');
                  }}>
                    💬 Salin Pesan WA
                  </button>
                </div>
              </div>
            )}

            {/* 5 kode terbaru */}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>
                5 Kode Terbaru
              </div>
              {codes.slice(0, 5).map(c => (
                <div key={c.id} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '10px 14px', marginBottom: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{c.name || 'Tanpa nama'}</span>
                    <span style={{ fontFamily: 'monospace', marginLeft: 10, color: 'var(--gold)', fontWeight: 700, fontSize: 14, letterSpacing: 2 }}>{c.code}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{fmtDate(c.created_at)}</span>
                    <button
                      onClick={() => { navigator.clipboard.writeText(c.code); showToast('Kode disalin'); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, padding: 0 }}
                    >📋</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: AKTIVITAS ── */}
        {!loading && tab === 'activity' && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>
              Aktif Hari Ini ({activeToday} member)
            </div>

            {users
              .filter(u => lastActive(u)?.startsWith(today))
              .map(u => {
                const code = codes.find(c => c.id === u.code_id);
                if (!code) return null;
                return (
                  <div key={u.id} style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 12, padding: '12px 16px', marginBottom: 8,
                    display: 'flex', alignItems: 'center', gap: 14,
                  }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: 'var(--gold-soft)', border: '1px solid var(--gold-line)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 15, color: 'var(--gold)',
                    }}>
                      {(code.name || '?')[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{code.name || 'Tanpa nama'}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                        {fmtDateTime(u.updated_at)} · {xp(u.data)} XP · Streak {streak(u.data)} hari
                      </div>
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--gold)', fontWeight: 700 }}>{code.code}</div>
                  </div>
                );
              })}

            {activeToday === 0 && (
              <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-3)', fontSize: 13 }}>
                Belum ada yang aktif hari ini
              </div>
            )}

            {/* AI Usage today */}
            {aiUsage.length > 0 && (
              <>
                <div style={{ fontWeight: 700, fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.1em', margin: '20px 0 10px' }}>
                  Penggunaan AI Hari Ini ({aiUsage.filter(a => a.used_date === today).length} sesi)
                </div>
                {aiUsage
                  .filter(a => a.used_date === today)
                  .map((a, i) => {
                    const code = codes.find(c => c.id === a.code_id);
                    return (
                      <div key={i} style={{
                        background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: 10, padding: '10px 14px', marginBottom: 6,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }}>
                        <div>
                          <span style={{ fontWeight: 700, fontSize: 13 }}>{code?.name || 'Unknown'}</span>
                          <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text-3)' }}>
                            {a.feature === 'dream' ? '🌙 Tafsir Mimpi' : a.feature === 'journal' ? '📖 Jurnal AI' : '🤲 Cari Doa'}
                          </span>
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{fmtDateTime(a.used_at)}</span>
                      </div>
                    );
                  })}
              </>
            )}

            {/* Ranking XP */}
            <div style={{ fontWeight: 700, fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.1em', margin: '20px 0 10px' }}>
              Ranking XP Semua Member
            </div>
            {[...users]
              .sort((a, b) => xp(b.data) - xp(a.data))
              .map((u, i) => {
                const code = codes.find(c => c.id === u.code_id);
                if (!code) return null;
                return (
                  <div key={u.id} style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 10, padding: '10px 14px', marginBottom: 6,
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: i < 3 ? 'var(--gold)' : 'var(--text-3)', width: 24, textAlign: 'center' }}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{code.name || 'Tanpa nama'}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Streak {streak(u.data)} hari</div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--gold)' }}>{xp(u.data).toLocaleString()} XP</div>
                  </div>
                );
              })}
          </div>
        )}

        {/* ── TAB: TAFSIR MIMPI ── */}
        {!loading && tab === 'dreams' && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>
              Riwayat Tafsir Mimpi ({dreams.length} total)
            </div>

            {dreams.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)', fontSize: 13 }}>
                Belum ada riwayat tafsir mimpi
              </div>
            )}

            {dreams.map(d => {
              const code = codes.find(c => c.id === d.code_id);
              return (
                <div key={d.id} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 14, padding: '14px 16px', marginBottom: 10,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--gold)' }}>
                      🌙 {code?.name || 'Unknown'}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{fmtDateTime(d.created_at)}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, fontStyle: 'italic' }}>
                    "{(d.dream_text || d.dream || '').slice(0, 120)}{(d.dream_text || d.dream || '').length > 120 ? '...' : ''}"
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
