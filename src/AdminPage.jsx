import { useState, useEffect, useRef } from 'react';

/* ─── SVG Icons ──────────────────────────────────────────────────────────── */
const Ic = {
  users:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.85"/></svg>,
  plus:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>,
  activity: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  moon:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>,
  logout:   <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  refresh:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.49-5.49"/></svg>,
  edit:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>,
  copy:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  trash:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  check:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  close:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  search:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  star:     <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>,
  fire:     <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c2.6 4 5 6.2 5 10.2a5 5 0 0 1-10 0c0-2 .8-3.7 2.1-5.1.2 1.5 1 2.2 1.9 2.4C10.1 7.4 11 4.6 12 2z"/></svg>,
  robot:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="15" x2="8" y2="15"/><line x1="16" y1="15" x2="16" y2="15"/></svg>,
  shield:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  key:      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="15" r="5"/><path d="M21 2l-9.3 9.3M15.5 7.5l2 2M17 6l2 2"/></svg>,
  msg:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  person:   <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const getToken = () => sessionStorage.getItem('dm-token') || '';

async function api(path, opts = {}) {
  const res = await fetch(path, {
    ...opts,
    headers: { 'Content-Type': 'application/json', 'x-session-token': getToken(), ...(opts.headers||{}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

const fmtDate = iso => iso ? new Date(iso).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' }) : '—';
const fmtTime = iso => iso ? new Date(iso).toLocaleString('id-ID', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }) : '—';
const getXP     = d => d?.totalPoints || 0;
const getStreak = d => d?.streak || 0;

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function KpiCard({ icon, label, value, sub, accent = false }) {
  return (
    <div style={{
      background: accent ? 'var(--gold)' : 'var(--surface)',
      border: `1px solid ${accent ? 'var(--gold)' : 'var(--border)'}`,
      borderRadius: 14, padding: '16px 18px',
      display: 'flex', alignItems: 'center', gap: 14,
      boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 11, flexShrink: 0,
        background: accent ? 'rgba(255,255,255,.2)' : 'var(--gold-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: accent ? '#fff' : 'var(--gold)',
      }}>{icon}</div>
      <div>
        <div style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 24, lineHeight: 1, color: accent ? '#fff' : 'var(--text)' }}>{value}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: accent ? 'rgba(255,255,255,.8)' : 'var(--text-3)', marginTop: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: accent ? 'rgba(255,255,255,.6)' : 'var(--text-3)', marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}

function Badge({ children, color = 'var(--gold)', bg = 'var(--gold-soft)' }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: bg, color, border: `1px solid ${color}44`,
      borderRadius: 6, padding: '2px 8px',
      fontSize: 10, fontWeight: 700, letterSpacing: '.04em',
    }}>{children}</span>
  );
}

function IconBtn({ icon, label, onClick, danger, small }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: small ? '5px 10px' : '6px 12px',
        borderRadius: 8, border: `1px solid ${danger ? 'var(--danger)' : 'var(--border)'}`,
        background: hover ? (danger ? 'rgba(188,71,73,.08)' : 'var(--elevated)') : 'transparent',
        color: danger ? 'var(--danger)' : 'var(--text-2)',
        fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 11,
        cursor: 'pointer', transition: 'all .15s',
        WebkitTapHighlightColor: 'transparent',
      }}>
      {icon}{label}
    </button>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export function AdminPage({ onLogout }) {
  const [tab, setTab]           = useState('members');
  const [codes, setCodes]       = useState([]);
  const [users, setUsers]       = useState([]);
  const [dreams, setDreams]     = useState([]);
  const [aiUsage, setAiUsage]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');

  const [newName, setNewName]         = useState('');
  const [genResult, setGenResult]     = useState(null);
  const [genLoading, setGenLoading]   = useState(false);

  const [editId, setEditId]         = useState(null);
  const [editName, setEditName]     = useState('');
  const [editCodeId, setEditCodeId] = useState(null);
  const [editCode, setEditCode]     = useState('');
  const [editCodeErr, setEditCodeErr] = useState('');

  const [toast, setToast]   = useState(null);
  const toastRef            = useRef(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  const [activityData,    setActivityData]    = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityFilter,  setActivityFilter]  = useState('all');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type });
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 2600);
  };

  const load = async () => {
    setLoading(true);
    try {
      const d = await api('/api/admin/members');
      setCodes(d.codes || []);
      setUsers(d.users || []);
      setDreams(d.dreams || []);
      setAiUsage(d.aiUsage || []);
    } catch { showToast('Gagal memuat data', 'err'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (tab !== 'activity') return;
    setActivityLoading(true);
    api('/api/admin/activity')
      .then(d => setActivityData(d.members || []))
      .catch(() => {})
      .finally(() => setActivityLoading(false));
  }, [tab]);

  /* actions */
  const generateCode = async () => {
    if (!newName.trim() || genLoading) return;
    setGenLoading(true);
    try {
      const d = await api('/api/admin/members', { method: 'POST', body: { name: newName.trim() } });
      setGenResult(d); setNewName('');
      showToast(`Kode untuk ${d.name} berhasil dibuat`);
      load();
    } catch { showToast('Gagal generate kode', 'err'); }
    setGenLoading(false);
  };

  const toggleActive = async (id, cur) => {
    try {
      await api(`/api/admin/members/${id}`, { method: 'PATCH', body: { is_active: !cur } });
      showToast(cur ? 'Member dinonaktifkan' : 'Member diaktifkan');
      load();
    } catch { showToast('Gagal update status', 'err'); }
  };

  const saveEditName = async () => {
    if (!editName.trim()) return;
    try {
      await api(`/api/admin/members/${editId}`, { method: 'PATCH', body: { name: editName.trim() } });
      showToast('Nama diperbarui'); setEditId(null); load();
    } catch { showToast('Gagal update nama', 'err'); }
  };

  const saveEditCode = async () => {
    if (!/^\d{6}$/.test(editCode)) { setEditCodeErr('Harus 6 digit angka'); return; }
    if (codes.some(c => c.code === editCode && c.id !== editCodeId)) { setEditCodeErr('Kode sudah dipakai'); return; }
    try {
      await api(`/api/admin/members/${editCodeId}`, { method: 'PATCH', body: { code: editCode } });
      showToast('Kode diperbarui'); setEditCodeId(null); setEditCodeErr(''); load();
    } catch { showToast('Gagal update kode', 'err'); }
  };

  const deleteMember = async (id, name) => {
    if (!confirm(`Hapus "${name}"? Semua data ibadahnya ikut terhapus.`)) return;
    try {
      await api(`/api/admin/members/${id}`, { method: 'DELETE' });
      showToast(`${name} dihapus`); load();
    } catch { showToast('Gagal hapus', 'err'); }
  };

  /* computed */
  const filtered  = codes.filter(c => (c.name||'').toLowerCase().includes(search.toLowerCase()) || c.code.includes(search));
  const today     = new Date().toISOString().slice(0,10);
  const activeNow = users.filter(u => u.updated_at?.startsWith(today)).length;
  const totalXP   = users.reduce((s, u) => s + getXP(u.data), 0);
  const aiToday   = aiUsage.filter(a => a.used_date === today).length;

  const getUser   = id => users.find(u => u.code_id === id);
  const getDreams = id => dreams.filter(d => d.code_id === id).length;
  const getAiUsed = id => aiUsage.filter(a => a.code_id === id && a.used_date === today).length;

  const TABS = [
    { id: 'members',  label: 'Member',    icon: Ic.users },
    { id: 'generate', label: 'Generate',  icon: Ic.plus },
    { id: 'activity', label: 'Aktivitas', icon: Ic.activity },
    { id: 'dreams',   label: 'Tafsir',    icon: Ic.moon },
  ];

  /* ── Sidebar (desktop) ── */
  const Sidebar = () => (
    <aside style={{
      width: 220, flexShrink: 0,
      background: 'var(--surface)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      height: '100dvh', position: 'sticky', top: 0,
    }}>
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
          <img src="./assets/Deenme_logo.png" alt="Deenme" style={{
            width: 30, height: 30, objectFit: 'contain',
            filter: 'brightness(0) saturate(100%) invert(28%) sepia(30%) saturate(800%) hue-rotate(95deg) brightness(85%)',
          }} />
          <div>
            <div style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 14, color: 'var(--text)' }}>Deenme</div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 600 }}>Admin Panel</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 10, border: 'none',
            background: tab === t.id ? 'var(--gold-soft)' : 'transparent',
            color: tab === t.id ? 'var(--gold)' : 'var(--text-3)',
            fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 13,
            cursor: 'pointer', marginBottom: 2, transition: 'all .15s',
            textAlign: 'left',
          }}>
            <span style={{ flexShrink: 0 }}>{t.icon}</span>
            {t.label}
            {t.id === 'members' && (
              <span style={{ marginLeft: 'auto', background: 'var(--gold)', color: '#fff', borderRadius: 999, padding: '1px 7px', fontSize: 10, fontWeight: 800 }}>
                {codes.length}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)' }}>
        <button onClick={load} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '9px 12px', borderRadius: 10, border: '1px solid var(--border)',
          background: 'transparent', color: 'var(--text-3)',
          fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 12,
          cursor: 'pointer', marginBottom: 6, transition: 'background .15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--elevated)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          {Ic.refresh} Refresh Data
        </button>
        <button onClick={onLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '9px 12px', borderRadius: 10, border: '1px solid rgba(188,71,73,.3)',
          background: 'transparent', color: 'var(--danger)',
          fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 12,
          cursor: 'pointer', transition: 'background .15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(188,71,73,.06)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          {Ic.logout} Keluar
        </button>
      </div>
    </aside>
  );

  /* ── Content area ── */
  const Content = () => (
    <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px 16px 90px' : '24px 28px' }}>

      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: isMobile ? 20 : 24, color: 'var(--text)', letterSpacing: '-.03em', margin: 0 }}>
          {TABS.find(t => t.id === tab)?.label}
        </h1>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>
          {tab === 'members'  && `${codes.length} member terdaftar · ${activeNow} aktif hari ini`}
          {tab === 'generate' && 'Buat kode akses baru untuk member'}
          {tab === 'activity' && `${activeNow} aktif hari ini · ${aiToday} penggunaan AI`}
          {tab === 'dreams'   && `${dreams.length} riwayat tafsir mimpi`}
        </div>
      </div>

      {tab !== 'generate' && (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
          <KpiCard icon={Ic.users}    label="Total Member"   value={codes.length}             sub={`${codes.filter(c=>c.is_active).length} aktif`} accent />
          <KpiCard icon={Ic.activity} label="Aktif Hari Ini" value={activeNow}                sub="buka app hari ini" />
          <KpiCard icon={Ic.star}     label="Total XP"       value={totalXP.toLocaleString()} sub="gabungan semua member" />
          <KpiCard icon={Ic.robot}    label="AI Dipakai"     value={aiToday}                  sub="sesi AI hari ini" />
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-3)' }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Memuat data...</div>
        </div>
      )}

      {/* ── MEMBERS ── */}
      {!loading && tab === 'members' && (
        <div>
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }}>{Ic.search}</span>
            <input className="tinput" placeholder="Cari nama atau kode..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 36 }} />
          </div>

          <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 10, fontWeight: 600 }}>
            {filtered.length} dari {codes.length} member
          </div>

          {!isMobile ? (
            /* ── Desktop table ── */
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 0.8fr 0.8fr 0.8fr 1fr 1.2fr', gap: 0, padding: '10px 20px', borderBottom: '1px solid var(--border)', background: 'var(--elevated)' }}>
                {['Nama', 'Kode', 'XP', 'Streak', 'Status', 'Bergabung', 'Aksi'].map(h => (
                  <div key={h} style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{h}</div>
                ))}
              </div>

              {filtered.map((c, i) => {
                const ud   = getUser(c.id)?.data;
                const isEN = editId === c.id;
                const isEC = editCodeId === c.id;
                return (
                  <div key={c.id} style={{
                    display: 'grid', gridTemplateColumns: '1.8fr 1fr 0.8fr 0.8fr 0.8fr 1fr 1.2fr',
                    alignItems: 'center', gap: 0, padding: '13px 20px',
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                    background: !c.is_active ? 'rgba(188,71,73,.02)' : 'transparent',
                    transition: 'background .1s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = c.is_active ? 'var(--elevated)' : 'rgba(188,71,73,.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = !c.is_active ? 'rgba(188,71,73,.02)' : 'transparent'}
                  >
                    {/* Nama */}
                    <div>
                      {isEN ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <input className="tinput" value={editName} onChange={e => setEditName(e.target.value)}
                            onKeyDown={e => { if (e.key==='Enter') saveEditName(); if (e.key==='Escape') setEditId(null); }}
                            style={{ fontSize: 12, padding: '5px 8px', width: 120 }} autoFocus />
                          <button onClick={saveEditName} style={{ background: 'var(--gold)', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: '#fff' }}>{Ic.check}</button>
                          <button onClick={() => setEditId(null)} style={{ background: 'var(--elevated)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: 'var(--text-3)' }}>{Ic.close}</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                            background: 'var(--gold-soft)', border: '1px solid var(--gold-line)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, fontSize: 13, color: 'var(--gold)',
                          }}>{(c.name||'?')[0].toUpperCase()}</div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{c.name || 'Tanpa nama'}</div>
                            <div style={{ fontSize: 10, color: 'var(--text-3)' }}>
                              {getUser(c.id)?.updated_at ? `Aktif ${fmtTime(getUser(c.id)?.updated_at)}` : 'Belum pernah login'}
                            </div>
                          </div>
                          <button onClick={() => { setEditId(c.id); setEditName(c.name||''); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 2, opacity: .6 }}
                            title="Edit nama"
                          >{Ic.edit}</button>
                        </div>
                      )}
                    </div>

                    {/* Kode */}
                    <div>
                      {isEC ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <input className="tinput" value={editCode}
                              onChange={e => { setEditCode(e.target.value.replace(/\D/g,'').slice(0,6)); setEditCodeErr(''); }}
                              onKeyDown={e => { if(e.key==='Enter') saveEditCode(); if(e.key==='Escape') { setEditCodeId(null); setEditCodeErr(''); } }}
                              style={{ width: 80, fontFamily: 'monospace', fontSize: 13, letterSpacing: 3, fontWeight: 700, padding: '4px 8px' }}
                              maxLength={6} autoFocus />
                            <button onClick={saveEditCode} style={{ background: 'var(--gold)', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: '#fff' }}>{Ic.check}</button>
                            <button onClick={() => { setEditCodeId(null); setEditCodeErr(''); }} style={{ background: 'var(--elevated)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: 'var(--text-3)' }}>{Ic.close}</button>
                          </div>
                          {editCodeErr && <div style={{ fontSize: 10, color: 'var(--danger)' }}>{editCodeErr}</div>}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 14, color: 'var(--gold)', letterSpacing: 2 }}>{c.code}</span>
                          <button onClick={() => { navigator.clipboard.writeText(c.code); showToast('Disalin'); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 2, opacity: .6 }} title="Salin">{Ic.copy}</button>
                          <button onClick={() => { setEditCodeId(c.id); setEditCode(c.code); setEditCodeErr(''); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 2, opacity: .6 }} title="Edit kode">{Ic.key}</button>
                        </div>
                      )}
                    </div>

                    {/* XP */}
                    <div style={{ fontWeight: 700, fontSize: 13, color: getXP(ud) > 0 ? 'var(--gold)' : 'var(--text-3)' }}>
                      {getXP(ud).toLocaleString()}
                    </div>

                    {/* Streak */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: getStreak(ud) > 0 ? 'var(--warn)' : 'var(--text-3)', fontWeight: 600, fontSize: 12 }}>
                      {getStreak(ud) > 0 && Ic.fire} {getStreak(ud)} hr
                    </div>

                    {/* Status */}
                    <div>
                      <Badge
                        color={c.is_active ? 'var(--ok)' : 'var(--danger)'}
                        bg={c.is_active ? 'rgba(106,153,78,.12)' : 'rgba(188,71,73,.1)'}
                      >
                        {c.is_active ? '● Aktif' : '● Nonaktif'}
                      </Badge>
                    </div>

                    {/* Bergabung */}
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{fmtDate(c.created_at)}</div>

                    {/* Aksi */}
                    <div style={{ display: 'flex', gap: 5 }}>
                      <IconBtn
                        label={c.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        onClick={() => toggleActive(c.id, c.is_active)}
                        danger={c.is_active} small />
                      <IconBtn icon={Ic.trash} label="" onClick={() => deleteMember(c.id, c.name)} danger small />
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)', fontSize: 13 }}>Tidak ada member ditemukan</div>
              )}
            </div>
          ) : (
            /* ── Mobile cards ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map(c => {
                const ud = getUser(c.id)?.data;
                return (
                  <div key={c.id} style={{
                    background: 'var(--surface)', border: `1px solid ${c.is_active ? 'var(--border)' : 'rgba(188,71,73,.25)'}`,
                    borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-card)',
                  }}>
                    <div style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                          background: 'var(--gold-soft)', border: '1px solid var(--gold-line)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: 16, color: 'var(--gold)',
                        }}>{(c.name||'?')[0].toUpperCase()}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)' }}>{c.name || 'Tanpa nama'}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 14, color: 'var(--gold)', letterSpacing: 2 }}>{c.code}</span>
                            <button onClick={() => { navigator.clipboard.writeText(c.code); showToast('Disalin'); }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 2 }}>{Ic.copy}</button>
                          </div>
                        </div>
                        <Badge color={c.is_active ? 'var(--ok)' : 'var(--danger)'} bg={c.is_active ? 'rgba(106,153,78,.12)' : 'rgba(188,71,73,.1)'}>
                          {c.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, padding: '10px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 12 }}>
                        {[
                          { label: 'XP',     val: getXP(ud).toLocaleString() },
                          { label: 'Streak', val: getStreak(ud) + ' hr' },
                          { label: 'Tafsir', val: getDreams(c.id) },
                        ].map(({ label, val }) => (
                          <div key={label} style={{ textAlign: 'center' }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gold)' }}>{val}</div>
                            <div style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 2 }}>{label}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        <IconBtn label={c.is_active ? 'Nonaktifkan' : 'Aktifkan'} onClick={() => toggleActive(c.id, c.is_active)} danger={c.is_active} small />
                        <IconBtn icon={Ic.edit} label="Edit" onClick={() => { setEditId(c.id); setEditName(c.name||''); }} small />
                        <IconBtn icon={Ic.trash} label="Hapus" onClick={() => deleteMember(c.id, c.name)} danger small />
                      </div>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)', fontSize: 13 }}>Tidak ada member ditemukan</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── GENERATE ── */}
      {!loading && tab === 'generate' && (
        <div style={{ maxWidth: 480 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
            <div style={{ height: 3, background: 'linear-gradient(90deg, var(--gold), #a7c957)' }} />
            <div style={{ padding: 22 }}>
              <div style={{ fontWeight: 700, fontSize: 10, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 14 }}>Generate Kode Baru</div>
              <input className="tinput" placeholder="Nama member (misal: Ahmad)" value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key==='Enter') generateCode(); }}
                style={{ width: '100%', boxSizing: 'border-box', marginBottom: 12 }} />
              <button className="btn gold" style={{ width: '100%', opacity: newName.trim() ? 1 : .4 }}
                onClick={generateCode} disabled={genLoading || !newName.trim()}>
                {genLoading ? '⟳ Generating...' : '+ Generate Kode Member'}
              </button>
            </div>
          </div>

          {genResult && (
            <div style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', borderRadius: 16, padding: 24, textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 700, marginBottom: 8 }}>Kode untuk {genResult.name}</div>
              <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: 52, letterSpacing: 10, color: 'var(--gold)', marginBottom: 16 }}>{genResult.code}</div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn gold" onClick={() => { navigator.clipboard.writeText(genResult.code); showToast('Kode disalin'); }}>
                  {Ic.copy} &nbsp;Salin Kode
                </button>
                <button className="btn sm" onClick={() => {
                  const msg = `Assalamu'alaikum ${genResult.name}! 🌿\n\nKode akses Deenme kamu:\n*${genResult.code}*\n\nBarakallahu fiikum!`;
                  navigator.clipboard.writeText(msg); showToast('Pesan WA disalin');
                }}>
                  {Ic.msg} &nbsp;Pesan WA
                </button>
              </div>
            </div>
          )}

          <div style={{ fontWeight: 700, fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>5 Kode Terbaru</div>
          {codes.slice(0,5).map(c => (
            <div key={c.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-card)' }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{c.name||'Tanpa nama'}</span>
                <span style={{ fontFamily: 'monospace', marginLeft: 10, color: 'var(--gold)', fontWeight: 700, fontSize: 14, letterSpacing: 2 }}>{c.code}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{fmtDate(c.created_at)}</span>
                <button onClick={() => { navigator.clipboard.writeText(c.code); showToast('Disalin'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 2 }}>{Ic.copy}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ACTIVITY ── */}
      {!loading && tab === 'activity' && (
        <div>
          <div style={{ fontWeight: 700, fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>Aktif Hari Ini</div>
          {users.filter(u => u.updated_at?.startsWith(today)).length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-3)', fontSize: 13, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', marginBottom: 20 }}>Belum ada yang aktif hari ini</div>
          )}
          {users.filter(u => u.updated_at?.startsWith(today)).map(u => {
            const c = codes.find(x => x.id === u.code_id); if (!c) return null;
            return (
              <div key={u.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 14, boxShadow: 'var(--shadow-card)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: 'var(--gold)' }}>
                  {(c.name||'?')[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{fmtTime(u.updated_at)} · {getXP(u.data)} XP · Streak {getStreak(u.data)} hr</div>
                </div>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--gold)' }}>{c.code}</span>
              </div>
            );
          })}

          {aiUsage.filter(a => a.used_date === today).length > 0 && (
            <>
              <div style={{ fontWeight: 700, fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.1em', margin: '20px 0 10px' }}>Penggunaan AI Hari Ini</div>
              {aiUsage.filter(a => a.used_date === today).map((a, i) => {
                const c = codes.find(x => x.id === a.code_id);
                return (
                  <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-card)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 16 }}>{a.feature==='dream' ? '🌙' : a.feature==='journal' ? '📖' : '🤲'}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{c?.name || 'Unknown'}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{a.feature==='dream' ? 'Tafsir Mimpi' : a.feature==='journal' ? 'Rapikan Jurnal' : 'Cari Doa'}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{fmtTime(a.used_at)}</span>
                  </div>
                );
              })}
            </>
          )}

          <div style={{ fontWeight: 700, fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.1em', margin: '20px 0 10px' }}>Ranking XP</div>
          {[...users].sort((a,b) => getXP(b.data)-getXP(a.data)).map((u, i) => {
            const c = codes.find(x => x.id === u.code_id); if (!c) return null;
            return (
              <div key={u.id} style={{ background: 'var(--surface)', border: `1px solid ${i < 3 ? 'var(--gold-line)' : 'var(--border)'}`, borderRadius: 10, padding: '10px 14px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12, boxShadow: 'var(--shadow-card)' }}>
                <div style={{ fontWeight: 800, fontSize: 14, width: 28, textAlign: 'center', color: i < 3 ? 'var(--gold)' : 'var(--text-3)' }}>
                  {i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Streak {getStreak(u.data)} hari</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--gold)', fontWeight: 800, fontSize: 14 }}>
                  {Ic.star} {getXP(u.data).toLocaleString()}
                </div>
              </div>
            );
          })}

          {/* ── AI Usage per Member ── */}
          <div style={{ fontWeight: 700, fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.1em', margin: '28px 0 10px' }}>Penggunaan AI per Member</div>

          {/* summary line */}
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 12 }}>
            {activityData.length} member ·{' '}
            {activityData.filter(m => m.ai_usage_count > 0).length} pernah pakai AI ·{' '}
            {activityData.filter(m => m.has_progress_data).length} punya progress ibadah
          </div>

          {/* filter pills */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            {[['all', 'Semua'], ['active', 'Punya Progress'], ['ai_users', 'Pernah Pakai AI']].map(([val, label]) => (
              <button key={val} onClick={() => setActivityFilter(val)} style={{
                padding: '5px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                border: activityFilter === val ? '1.5px solid var(--gold)' : '1px solid var(--border)',
                background: activityFilter === val ? 'var(--gold-soft)' : 'transparent',
                color: activityFilter === val ? 'var(--gold)' : 'var(--text-3)',
                transition: 'all .15s',
              }}>{label}</button>
            ))}
          </div>

          {activityLoading && (
            <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-3)', fontSize: 13 }}>Memuat data AI...</div>
          )}

          {!activityLoading && activityData
            .filter(m => {
              if (activityFilter === 'active')   return m.has_progress_data;
              if (activityFilter === 'ai_users') return m.ai_usage_count > 0;
              return true;
            })
            .map(m => {
              const lastActive = m.last_ai_used || m.last_progress_update;
              const featureEntries = Object.entries(m.ai_features_used || {});
              return (
                <div key={m.id} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: '12px 16px', marginBottom: 8,
                  boxShadow: 'var(--shadow-card)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: m.ai_usage_count > 0 ? 'var(--gold-soft)' : 'var(--elevated)',
                      border: `1px solid ${m.ai_usage_count > 0 ? 'var(--gold-line)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 14,
                      color: m.ai_usage_count > 0 ? 'var(--gold)' : 'var(--text-3)',
                    }}>
                      {(m.name || '?')[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{m.name || '—'}</span>
                        <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-3)' }}>{m.code}</span>
                        {!m.is_active && <Badge color="var(--danger)" bg="rgba(188,71,73,.08)">Nonaktif</Badge>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                        {featureEntries.length === 0 ? (
                          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Belum pakai AI</span>
                        ) : featureEntries.map(([feat, count]) => (
                          <span key={feat} style={{
                            fontSize: 10, fontWeight: 700, borderRadius: 6, padding: '2px 8px',
                            background: 'var(--elevated)', color: 'var(--text-2)',
                            border: '1px solid var(--border)',
                          }}>
                            {feat === 'dream' ? '🌙' : feat === 'journal' ? '📖' : '🤲'}{' '}
                            {feat === 'dream' ? 'Tafsir' : feat === 'journal' ? 'Jurnal' : 'Doa'} {count}x
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: m.ai_usage_count > 0 ? 'var(--gold)' : 'var(--text-3)' }}>
                        {m.ai_usage_count}x
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>
                        {lastActive ? fmtTime(lastActive) : 'Belum aktif'}
                      </div>
                    </div>
                  </div>
                  {!m.has_progress_data && m.ai_usage_count === 0 && (
                    <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 6, paddingTop: 6, borderTop: '1px solid var(--border)' }}>
                      Bergabung {fmtDate(m.joined_at)} · Belum ada aktivitas
                    </div>
                  )}
                </div>
              );
            })
          }
        </div>
      )}

      {/* ── DREAMS ── */}
      {!loading && tab === 'dreams' && (
        <div>
          {dreams.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)', fontSize: 13, background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)' }}>Belum ada riwayat tafsir mimpi</div>
          )}
          {dreams.map(d => {
            const c = codes.find(x => x.id === d.code_id);
            return (
              <div key={d.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 16px', marginBottom: 10, boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: 'var(--gold)' }}>{Ic.moon}</span>
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--gold)' }}>{c?.name || 'Unknown'}</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{fmtTime(d.created_at)}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, fontStyle: 'italic', paddingLeft: 26 }}>
                  "{(d.dream_text||d.dream||'').slice(0,150)}{(d.dream_text||d.dream||'').length>150?'...':''}"
                </div>
              </div>
            );
          })}
        </div>
      )}

    </main>
  );

  /* ── Mobile bottom nav ── */
  const BottomNav = () => (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20,
      background: 'var(--surface)', borderTop: '1px solid var(--border)',
      display: 'flex', padding: '8px 0 calc(8px + env(safe-area-inset-bottom))',
      boxShadow: '0 -4px 20px rgba(0,0,0,.06)',
    }}>
      {TABS.map(t => (
        <button key={t.id} onClick={() => setTab(t.id)} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          background: 'none', border: 'none',
          color: tab === t.id ? 'var(--gold)' : 'var(--text-3)',
          fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 9,
          cursor: 'pointer', padding: '4px 0',
          textTransform: 'uppercase', letterSpacing: '.04em',
          WebkitTapHighlightColor: 'transparent',
        }}>
          <span style={{ fontSize: 18 }}>{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  );

  /* ── Mobile header ── */
  const MobileHeader = () => (
    <div style={{
      position: 'sticky', top: 0, zIndex: 10,
      background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      padding: '12px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img src="./assets/Deenme_logo.png" alt="Deenme" style={{ width: 26, objectFit: 'contain', filter: 'brightness(0) saturate(100%) invert(28%) sepia(30%) saturate(800%) hue-rotate(95deg) brightness(85%)' }} />
        <div style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 14, color: 'var(--text)' }}>Admin</div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={load} style={{ background: 'var(--elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center' }}>{Ic.refresh}</button>
        <button onClick={onLogout} style={{ background: 'rgba(188,71,73,.08)', border: '1px solid rgba(188,71,73,.3)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: 'var(--danger)', display: 'flex', alignItems: 'center' }}>{Ic.logout}</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', fontFamily: 'var(--f-head)' }}>

      {toast && (
        <div style={{
          position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, background: toast.type==='err' ? 'var(--danger)' : 'var(--gold)',
          color: '#fff', borderRadius: 10, padding: '10px 20px',
          fontWeight: 700, fontSize: 13, boxShadow: '0 4px 20px rgba(0,0,0,.2)',
          whiteSpace: 'nowrap',
        }}>
          {toast.msg}
        </div>
      )}

      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}>
          {MobileHeader()}
          {Content()}
          {BottomNav()}
        </div>
      ) : (
        <div style={{ display: 'flex', height: '100dvh', overflow: 'hidden' }}>
          {Sidebar()}
          {Content()}
        </div>
      )}
    </div>
  );
}
