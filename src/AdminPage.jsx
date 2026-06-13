import { useState, useEffect } from 'react';
import { supabase } from './supabase.js';

export function AdminPage({ onLogout }) {
  const [name, setName] = useState('');
  const [generated, setGenerated] = useState(null);
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCodes = async () => {
    const { data } = await supabase
      .from('member_codes')
      .select('*')
      .order('created_at', { ascending: false });
    setCodes(data || []);
  };

  useEffect(() => { loadCodes(); }, []);

  const generateCode = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const { error } = await supabase
      .from('member_codes')
      .insert({ code, name: name.trim() });
    if (!error) { setGenerated({ code, name }); setName(''); loadCodes(); }
    setLoading(false);
  };

  const toggleActive = async (id, current) => {
    await supabase.from('member_codes').update({ is_active: !current }).eq('id', id);
    loadCodes();
  };

  return (
    <div style={{ padding: 24, maxWidth: 480, margin: '0 auto', minHeight: '100dvh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="h1">Admin Panel</h1>
        <button className="btn ghost sm" onClick={onLogout}>Keluar</button>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Generate Kode Baru</div>
        <input
          className="tinput"
          style={{ width: '100%', textAlign: 'left', padding: '11px 14px', marginBottom: 12 }}
          placeholder="Nama orang (misal: Akbar)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') generateCode(); }}
        />
        <button className="btn gold" style={{ width: '100%' }} onClick={generateCode} disabled={loading || !name.trim()}>
          {loading ? 'Generating...' : 'Generate Kode'}
        </button>
        {generated && (
          <div style={{ marginTop: 16, textAlign: 'center', padding: 16, background: 'var(--gold-soft)', borderRadius: 12, border: '1px solid var(--gold-line)' }}>
            <div className="eyebrow">Kode untuk {generated.name}:</div>
            <div className="bignum" style={{ fontSize: 48, letterSpacing: 8, marginTop: 8 }}>{generated.code}</div>
            <button className="btn sm" style={{ marginTop: 10 }}
              onClick={() => navigator.clipboard.writeText(generated.code)}>
              Salin Kode
            </button>
          </div>
        )}
      </div>

      <div className="eyebrow" style={{ marginBottom: 12 }}>Semua Member ({codes.length})</div>
      {codes.map((c) => (
        <div key={c.id} className="card" style={{ padding: 16, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700 }}>{c.name || 'Tanpa nama'}</div>
            <div className="muted tiny">{c.code} · {new Date(c.created_at).toLocaleDateString('id-ID')}</div>
            <div className="muted tiny" style={{ marginTop: 2 }}>
              <span style={{ color: c.is_active ? 'var(--ok)' : 'var(--danger)' }}>
                {c.is_active ? '● Aktif' : '● Nonaktif'}
              </span>
            </div>
          </div>
          <button
            className="btn sm"
            style={{ borderColor: c.is_active ? 'var(--danger)' : 'var(--ok)', color: c.is_active ? 'var(--danger)' : 'var(--ok)' }}
            onClick={() => toggleActive(c.id, c.is_active)}
          >
            {c.is_active ? 'Nonaktifkan' : 'Aktifkan'}
          </button>
        </div>
      ))}
    </div>
  );
}
