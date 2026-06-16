// pages.jsx — Jurnal, Bank Doa, Statistik, Amalan Harian
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Icon } from './ui.jsx';
import { BADGES, getLevel, getGrade, calcDailyPoints, calcMaxPoints, IBADAH_POINTS } from './dashboard.jsx';

const WAKTU_ICONS = {
  tahajud: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  witir: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  subuh: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 18a5 5 0 0 0-10 0"/>
      <line x1="12" y1="2" x2="12" y2="9"/>
      <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/>
      <line x1="2" y1="18" x2="4" y2="18"/>
      <line x1="20" y1="18" x2="22" y2="18"/>
      <line x1="19.78" y1="10.22" x2="18.36" y2="11.64"/>
    </svg>
  ),
  dhuha: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  dzuhur: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  ),
  ashar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
      <path d="M3 12h1M20 12h1M12 3v1M12 20v1M5.64 5.64l.7.7M17.66 17.66l.7.7M17.66 6.34l-.7.7M5.64 18.36l.7-.7"/>
    </svg>
  ),
  maghrib: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 18a5 5 0 0 0-10 0"/>
      <line x1="2" y1="18" x2="22" y2="18"/>
      <path d="M12 2L12 9"/>
      <path d="M4.22 10.22L5.64 11.64"/>
      <path d="M19.78 10.22L18.36 11.64"/>
    </svg>
  ),
  isya: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      <path d="M14 10l-2 2-2-2"/>
    </svg>
  ),
};

const WAKTU_BIG_ICONS = {
  tahajud: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  witir: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  subuh: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 18a5 5 0 0 0-10 0"/>
      <line x1="12" y1="2" x2="12" y2="9"/>
      <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/>
      <line x1="2" y1="18" x2="4" y2="18"/>
      <line x1="20" y1="18" x2="22" y2="18"/>
      <line x1="19.78" y1="10.22" x2="18.36" y2="11.64"/>
    </svg>
  ),
  dhuha: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  dzuhur: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  ),
  ashar: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
      <path d="M3 12h1M20 12h1M12 3v1M12 20v1M5.64 5.64l.7.7M17.66 17.66l.7.7M17.66 6.34l-.7.7M5.64 18.36l.7-.7"/>
    </svg>
  ),
  maghrib: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 18a5 5 0 0 0-10 0"/>
      <line x1="2" y1="18" x2="22" y2="18"/>
      <path d="M12 2L12 9"/>
      <path d="M4.22 10.22L5.64 11.64"/>
      <path d="M19.78 10.22L18.36 11.64"/>
    </svg>
  ),
  isya: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
};

// ─── JURNAL ───────────────────────────────────────────────
const KW = {
  'Doa Ujian': ['ujian', 'imtihan', 'belajar', 'tahriri', 'exam', 'hafalan', 'muraja'],
  'Doa Syukur': ['syukur', 'alhamdulillah', 'nikmat', 'bersyukur', 'bahagia', 'senang'],
  'Doa Ketenangan': ['galau', 'sedih', 'berat', 'capek', 'lelah', 'gelisah', 'rindu'],
  'Doa Safar': ['safar', 'perjalanan', 'pulang', 'cairo', 'mudik', 'pesawat'],
  'Doa Kesembuhan': ['sakit', 'demam', 'syifa', 'lemas', 'pusing'],
  'Doa Rezeki': ['rezeki', 'hutang', 'uang', 'tagihan', 'biaya'],
};
function detectDoa(text) {
  const t = (text || '').toLowerCase();
  return Object.keys(KW).filter((d) => KW[d].some((w) => t.includes(w)));
}
const MINI_SEQ = Array(30).fill('none');
const HEATC = { full: '#4ade80', part: '#fbbf24', empty: '#f87171', none: 'transparent' };

const _ID_MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

function JournalContent({ go, codeId }) {
  const edRef = useRef(null);
  const [empty, setEmpty] = useState(true);
  const [detected, setDetected] = useState([]);
  const [day, setDay] = useState(() => new Date().getDate());
  const [aiLoading, setAiLoading] = useState(false);
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');
  const [noKeyToast, setNoKeyToast] = useState(false);

  const onInput = () => {
    const txt = edRef.current.innerText;
    setEmpty(txt.trim() === '');
    setDetected(detectDoa(txt));
  };
  const cmd = (c) => { document.execCommand(c, false); edRef.current.focus(); };

  // Reset markdown mode when switching days
  useEffect(() => {
    setIsMarkdownMode(false);
  }, [day]);

  useEffect(() => {
    const handler = () => {
      if (!window.visualViewport) return;
      const kbH = window.innerHeight - window.visualViewport.height;
      const el = edRef.current;
      if (el) el.style.paddingBottom = (kbH > 0 ? kbH : 0) + 'px';
    };
    window.visualViewport?.addEventListener('resize', handler);
    return () => window.visualViewport?.removeEventListener('resize', handler);
  }, []);

  const rapikanJurnal = async () => {
    const rawText = edRef.current?.innerText?.trim();
    if (!rawText || rawText.length < 10) return;

    setAiLoading(true);
    try {
      const token = sessionStorage.getItem('dm-token');
      const response = await fetch('/api/ai/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-token': token },
        body: JSON.stringify({ text: rawText }),
      });

      if (response.status === 503) {
        setNoKeyToast(true);
        setTimeout(() => setNoKeyToast(false), 3500);
        return;
      }
      if (response.status === 429) {
        const d = await response.json();
        alert(d.message || 'Batas harian tercapai. Coba lagi besok.');
        setAiLoading(false);
        return;
      }

      const data = await response.json();
      if (data.result) {
        setMarkdownContent(data.result);
        setIsMarkdownMode(true);
        setEmpty(false);
      }
    } catch (err) {
      console.error('Journal enhance error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const backToEdit = () => {
    setIsMarkdownMode(false);
    if (edRef.current) {
      edRef.current.innerText = markdownContent;
      setEmpty(false);
    }
  };

  return (
    <div className="main fade-in">
      <div className="col-l scrl">
        <span className="eyebrow">30 hari terakhir</span>
        <div className="heat" style={{ gridTemplateColumns: 'repeat(6,1fr)' }}>
          {MINI_SEQ.map((k, i) => (
            <div key={i} className="hc" title={`${i + 1} ${_ID_MONTHS[new Date().getMonth()]}`}
              style={{
                background: HEATC[k],
                outline: i === 12 ? '2px solid var(--gold)' : 'none',
                outlineOffset: 1,
                opacity: k === 'none' ? 0 : 1,
              }} />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          {[['full', '#4ade80', 'Lengkap'], ['part', '#fbbf24', 'Sebagian'], ['empty', '#f87171', 'Kosong']].map(([k, c, l]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: c, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="content scrl" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* No-key toast */}
        {noKeyToast && (
          <div style={{
            position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--danger)', color: '#fff', padding: '10px 18px',
            borderRadius: 10, fontSize: 13, fontFamily: 'var(--f-head)',
            zIndex: 999, boxShadow: '0 4px 20px rgba(0,0,0,.4)',
            whiteSpace: 'nowrap',
          }}>
            API key tidak ditemukan. Tambahkan VITE_OPENROUTER_KEY di Replit Secrets.
          </div>
        )}

        <div className="daynav" style={{ marginBottom: 20 }}>
          <button className="iconbtn" onClick={() => setDay((d) => Math.max(1, d - 1))}>{Icon.chevL}</button>
          <div>
            <h1 className="h1">Jurnal</h1>
            <div style={{ marginTop: 3, fontSize: 12, color: 'var(--text-3)' }}>{day} {_ID_MONTHS[new Date().getMonth()]} {new Date().getFullYear()}</div>
          </div>
          <button className="iconbtn" onClick={() => setDay((d) => Math.min(new Date().getDate(), d + 1))} disabled={day >= new Date().getDate()}
            style={{ opacity: day >= new Date().getDate() ? .4 : 1 }}>{Icon.chevR}</button>
        </div>

        <div className="editor">
          <div className="etools">
            {!isMarkdownMode ? (
              <>
                <button className="etb" style={{ fontWeight: 700 }} onMouseDown={(e) => { e.preventDefault(); cmd('bold'); }}>B</button>
                <button className="etb" style={{ fontStyle: 'italic' }} onMouseDown={(e) => { e.preventDefault(); cmd('italic'); }}>I</button>
                <div style={{ flex: 1 }} />
                <button
                  className="btn gold sm"
                  style={{ padding: '6px 14px', fontSize: 12, opacity: aiLoading ? 0.6 : 1 }}
                  onClick={rapikanJurnal}
                  disabled={aiLoading || empty}
                >
                  {aiLoading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="spin" style={{ width: 12, height: 12, borderWidth: 2 }} />
                      Merapikan...
                    </span>
                  ) : '✦ Rapikan'}
                </button>
                <span className="muted tiny" style={{ marginLeft: 8 }}>Tersimpan otomatis</span>
              </>
            ) : (
              <>
                <span style={{ fontFamily: 'var(--f-head)', fontSize: 12, color: 'var(--gold)', fontWeight: 600 }}>
                  ✦ Dirapikan AI
                </span>
                <div style={{ flex: 1 }} />
                <button className="btn ghost sm" style={{ fontSize: 12 }} onClick={backToEdit}>
                  Edit lagi
                </button>
              </>
            )}
          </div>

          {isMarkdownMode ? (
            <div className="earea scrl markdown-render" style={{ cursor: 'default' }}>
              <ReactMarkdown>{markdownContent}</ReactMarkdown>
            </div>
          ) : (
            <div ref={edRef} className="earea scrl" contentEditable suppressContentEditableWarning
              data-empty={empty ? '1' : '0'} data-ph="Hari ini bagaimana, akhi?" onInput={onInput} />
          )}
        </div>

        <div className="card" style={{ padding: 16, marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="eyebrow">Doa yang relevan hari ini</span>
          {detected.length === 0
            ? <p style={{ margin: 0, fontSize: 13, color: 'var(--text-3)' }}>Mulai menulis — doa yang relevan akan muncul di sini secara otomatis.</p>
            : <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {detected.map((d) => (
                <button key={d} className="chip on" onClick={() => go('doa')}>{Icon.spark}{d}</button>
              ))}
            </div>}
        </div>
      </div>
    </div>
  );
}

// ── Tafsir Mimpi Page ─────────────────────────────────────────────────────────
const getTok = () => sessionStorage.getItem('dm-token') || '';

function TafsirMimpiPage({ codeId }) {
  const [dreamText, setDreamText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [noKeyToast, setNoKeyToast] = useState(false);
  const textRef = useRef(null);

  // ── Daily limit — 1× per hari per user ──
  const todayKey = new Date().toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const limitKey = `deenme-tafsir-date-${codeId}`;
  const usedToday = localStorage.getItem(limitKey) === todayKey;

  // Countdown ke midnight WIB
  const getMidnightWIB = () => {
    const now = new Date();
    const wib = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const midnight = new Date(wib);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - wib;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}j ${m}m`;
  };

  useEffect(() => {
    if (!codeId) { setLoadingHistory(false); return; }
    const load = async () => {
      try {
        const res = await fetch('/api/dreams', { headers: { 'x-session-token': getTok() } });
        if (res.ok) {
          const json = await res.json();
          setHistory(json.dreams || []);
        }
      } catch {}
      setLoadingHistory(false);
    };
    load();
  }, [codeId]);

  const tafsirkan = async () => {
    const text = dreamText.trim();
    if (!text || loading || usedToday) return;
    setLoading(true);
    setResult(null);
    setSelectedHistory(null);

    try {
      const response = await fetch('/api/ai/dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-token': getTok() },
        body: JSON.stringify({ text }),
      });

      if (response.status === 503) {
        setNoKeyToast(true);
        setTimeout(() => setNoKeyToast(false), 3500);
        setLoading(false);
        return;
      }
      if (response.status === 429) {
        const d = await response.json();
        setResult(`⏳ **${d.message || 'Tafsir hanya 1x per hari. Coba lagi besok.'}**`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      const tafsir = data.result;

      if (tafsir) {
        setResult(tafsir);
        localStorage.setItem(limitKey, todayKey);
        if (codeId) {
          try {
            const saveRes = await fetch('/api/dreams', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-session-token': getTok() },
              body: JSON.stringify({ dream_text: text, tafsir_result: tafsir }),
            });
            if (saveRes.ok) {
              const { dream: saved } = await saveRes.json();
              if (saved) setHistory(prev => [saved, ...prev]);
            }
          } catch {}
        }
      }
    } catch (err) {
      setResult('Terjadi kesalahan. Pastikan koneksi internet aktif dan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const deleteHistory = async (id) => {
    try {
      await fetch(`/api/dreams/${id}`, {
        method: 'DELETE',
        headers: { 'x-session-token': getTok() },
      });
    } catch {}
    setHistory(prev => prev.filter(h => h.id !== id));
    if (selectedHistory?.id === id) setSelectedHistory(null);
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', width: '100%' }}>
      {/* No-key toast */}
      {noKeyToast && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--danger)', color: '#fff', padding: '10px 18px',
          borderRadius: 10, fontSize: 13, fontFamily: 'var(--f-head)',
          zIndex: 999, boxShadow: '0 4px 20px rgba(0,0,0,.4)', whiteSpace: 'nowrap',
        }}>
          API key tidak ditemukan. Tambahkan OPENROUTER_KEY di Replit Secrets.
        </div>
      )}

      {/* Left: History */}
      <div className="col-l scrl" style={{ minWidth: 220, maxWidth: 260 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Riwayat Tafsir</div>
        {loadingHistory ? (
          <div className="muted tiny">Memuat...</div>
        ) : history.length === 0 ? (
          <div className="muted tiny" style={{ lineHeight: 1.6 }}>Belum ada riwayat tafsir mimpi.</div>
        ) : history.map(h => (
          <div
            key={h.id}
            onClick={() => { setSelectedHistory(h); setResult(null); setDreamText(''); }}
            style={{
              background: selectedHistory?.id === h.id ? 'var(--gold-soft)' : 'var(--surface)',
              border: `1px solid ${selectedHistory?.id === h.id ? 'var(--gold-line)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-sm)', padding: '10px 12px', marginBottom: 8,
              cursor: 'pointer', transition: '.15s',
            }}
          >
            <div style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 12.5, color: 'var(--text)', marginBottom: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {h.dream_text}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="muted tiny">{formatDate(h.created_at)}</span>
              <button
                onClick={(e) => { e.stopPropagation(); deleteHistory(h.id); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '0 2px' }}
              >×</button>
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="content scrl">
        <div style={{ marginBottom: 20 }}>
          <h1 className="h1">Tafsir Mimpi</h1>
          <div className="muted tiny" style={{ marginTop: 4 }}>Berdasarkan kitab Ibnu Sirin &amp; psikologi modern · dijawab AI</div>
        </div>

        {/* ── Banner limit harian ── */}
        {usedToday && !selectedHistory && (
          <div style={{
            background: 'var(--elevated)',
            border: '1px solid var(--border)',
            borderLeft: '3px solid var(--warn)',
            borderRadius: 'var(--radius)',
            padding: '14px 18px', marginBottom: 16,
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--warn)', flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
            </svg>
            <div>
              <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 13, color: 'var(--text)', marginBottom: 4 }}>
                Tafsir hari ini sudah digunakan
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>
                Limit 1× tafsir per hari. Reset dalam <strong>{getMidnightWIB()}</strong> lagi.
                Lihat riwayat tafsir di panel kiri.
              </div>
            </div>
          </div>
        )}

        {selectedHistory ? (
          <div>
            <button
              onClick={() => setSelectedHistory(null)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer', fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 13, padding: '0 0 16px', marginLeft: -4 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Tafsir Baru
            </button>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18, marginBottom: 16 }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Cerita Mimpi</div>
              <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>"{selectedHistory.dream_text}"</p>
              <div className="muted tiny" style={{ marginTop: 8 }}>{formatDate(selectedHistory.created_at)}</div>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Hasil Tafsir</div>
              <div className="markdown-render">
                <ReactMarkdown>{selectedHistory.tafsir_result}</ReactMarkdown>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Input area */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', marginBottom: 16, overflow: 'hidden',
              opacity: usedToday ? .5 : 1,
              pointerEvents: usedToday ? 'none' : 'auto',
              transition: 'opacity .2s',
            }}>
              <div style={{ padding: '14px 16px 8px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>Ceritakan mimpi kamu</div>
                  {/* Indikator limit */}
                  <span style={{
                    fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 11,
                    color: usedToday ? 'var(--danger)' : 'var(--ok)',
                    background: usedToday ? 'color-mix(in srgb, var(--danger) 10%, transparent)' : 'color-mix(in srgb, var(--ok) 10%, transparent)',
                    border: `1px solid ${usedToday ? 'color-mix(in srgb, var(--danger) 25%, transparent)' : 'color-mix(in srgb, var(--ok) 25%, transparent)'}`,
                    borderRadius: 999, padding: '2px 10px',
                  }}>
                    {usedToday ? '0/1 tersisa' : '1/1 tersisa'}
                  </span>
                </div>
                <div className="muted tiny" style={{ marginTop: 4 }}>Semakin detail ceritamu, semakin akurat tafsirnya</div>
              </div>
              <textarea
                ref={textRef}
                value={dreamText}
                onChange={e => setDreamText(e.target.value)}
                placeholder="Contoh: Tadi malam saya bermimpi berada di sebuah masjid yang sangat besar dan indah, lalu tiba-tiba langit menjadi terang benderang..."
                disabled={usedToday}
                style={{
                  width: '100%', minHeight: 160, padding: '16px',
                  background: 'transparent', border: 'none', outline: 'none',
                  resize: 'vertical', fontFamily: 'var(--f-body)', fontSize: 14,
                  color: 'var(--text)', lineHeight: 1.7, boxSizing: 'border-box',
                }}
              />
              <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="muted tiny">{dreamText.length} karakter</span>
                <button
                  className="btn gold"
                  style={{ padding: '10px 22px', fontSize: 13, opacity: dreamText.trim().length < 10 || loading || usedToday ? .5 : 1, display: 'flex', alignItems: 'center', gap: 8 }}
                  onClick={tafsirkan}
                  disabled={dreamText.trim().length < 10 || loading || usedToday}
                >
                  {loading ? (
                    <><span className="spin" style={{ width: 14, height: 14, borderWidth: 2 }} />Menafsirkan...</>
                  ) : (
                    <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>Tafsirkan Mimpi</>
                  )}
                </button>
              </div>
            </div>

            {/* Tips */}
            {!result && !loading && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18, marginBottom: 16 }}>
                <div className="eyebrow" style={{ marginBottom: 12 }}>Tips Sebelum Tafsir</div>
                {[
                  ['🌙', 'Mimpi di sepertiga malam terakhir biasanya lebih bermakna'],
                  ['📝', 'Catat mimpi segera setelah bangun agar tidak terlupa'],
                  ['🤲', 'Jika mimpi buruk, baca ta\'awwudz dan jangan ceritakan ke orang lain'],
                  ['✨', 'Jika mimpi baik, boleh diceritakan kepada orang yang dipercaya'],
                ].map(([icon, tip]) => (
                  <div key={tip} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{tip}</span>
                  </div>
                ))}
                <div className="muted tiny" style={{ marginTop: 8, paddingTop: 10, borderTop: '1px solid var(--border)', fontStyle: 'italic' }}>
                  Tafsir mengacu pada kitab Mukhtasar Al-Ru'ya karya Ibnu Sirin dan pendekatan psikologi analitik Carl Jung.
                </div>
              </div>
            )}

            {/* Result */}
            {result && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid var(--gold)', borderRadius: 'var(--radius)', padding: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div className="eyebrow">Hasil Tafsir</div>
                  <span className="chip" style={{ fontSize: 10, pointerEvents: 'none' }}>Ibnu Sirin · Psikologi</span>
                </div>
                <div className="markdown-render">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <div className="muted tiny" style={{ fontStyle: 'italic' }}>
                    ⚠️ Tafsir ini adalah interpretasi, bukan ramalan. Hanya Allah yang mengetahui makna mimpi sesungguhnya. Wallahu a'lam.
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Journal Page with tabs ────────────────────────────────────────────────────
export function JournalPage({ go, codeId }) {
  const [activeTab, setActiveTab] = useState('jurnal');

  return (
    <div className="main fade-in" style={{ position: 'relative' }}>
      {/* Tab bar — sticky at top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, borderBottom: '1px solid var(--border)', background: 'var(--surface)', zIndex: 5, display: 'flex', padding: '0 24px' }}>
        {[
          {
            id: 'jurnal', label: 'Jurnal Harian',
            icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6.5A1.5 1.5 0 0 1 5 19.5z"/><path d="M9 3v18"/><path d="M12.5 8.5h3.5M12.5 12h3.5"/></svg>,
          },
          {
            id: 'mimpi', label: 'Tafsir Mimpi',
            icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/><circle cx="12" cy="12" r="3"/></svg>,
          },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '14px 18px', background: 'none', border: 'none',
              borderBottom: activeTab === t.id ? '2px solid var(--gold)' : '2px solid transparent',
              color: activeTab === t.id ? 'var(--gold)' : 'var(--text-3)',
              fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 13,
              cursor: 'pointer', transition: '.15s', marginBottom: -1,
            }}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Content — padded top to clear tab bar */}
      <div style={{ paddingTop: 49, width: '100%', display: 'flex', flex: 1, overflow: 'hidden', height: '100%' }}>
        {activeTab === 'jurnal' ? (
          <JournalContent go={go} codeId={codeId} />
        ) : (
          <TafsirMimpiPage codeId={codeId} />
        )}
      </div>
    </div>
  );
}

// ─── BANK DOA ─────────────────────────────────────────────
export const DOA = [

  // Per Waktu Solat
  { cat: 'Per Waktu Solat', waktu: 'Subuh', name: 'Dzikir Pagi — Sayyidul Istighfar',
    ar: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    tr: 'Ya Allah, Engkau adalah Rabbku. Tidak ada ilah selain Engkau. Engkau yang menciptakanku dan aku adalah hamba-Mu. Aku berada di atas perjanjian-Mu dan janji-Mu semampuku. Aku berlindung kepada-Mu dari keburukan perbuatanku. Aku mengakui nikmat-Mu atasku dan aku mengakui dosaku, maka ampunilah aku.',
    src: 'HR. Bukhari no. 6306',
    faedah: 'Barangsiapa membacanya di pagi hari dengan penuh keyakinan, lalu meninggal sebelum sore hari, maka ia termasuk ahli surga.',
    kisah: `Suatu hari Syaddad bin Aus radhiyallahu anhu duduk bersama Rasulullah ﷺ. Beliau bersabda: "Maukah aku beritahu kalian tentang penghulu istighfar?" Para sahabat berkata: "Tentu ya Rasulullah." Lalu beliau mengajarkan doa ini dan bersabda: "Barangsiapa membacanya di pagi hari dengan penuh keyakinan, lalu meninggal sebelum sore, maka ia ahli surga." Kata "sayyid" berarti pemimpin — doa ini disebut pemimpin karena ia mencakup seluruh hakikat istighfar: pengakuan rububiyah, pengakuan kehambaan, pengakuan janji, pengakuan dosa, dan permohonan ampun.` },

  { cat: 'Per Waktu Solat', waktu: 'Subuh', name: 'Dzikir Pagi — Doa Ilmu, Rezeki & Amal',
    ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
    tr: 'Ya Allah, sesungguhnya aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik, dan amal yang diterima.',
    src: 'HR. Ibnu Majah no. 925, dinilai shahih oleh Al-Albani',
    faedah: 'Dibaca setelah salam sholat Subuh sebelum beranjak dari tempat duduk.',
    kisah: `Ummu Salamah radhiyallahu anha meriwayatkan bahwa setiap kali Rasulullah ﷺ selesai sholat Subuh dan mengucap salam, beliau tidak beranjak dari tempat duduknya sebelum membaca doa ini. Ini adalah rutinitas harian Nabi — membuka hari dengan tiga permohonan paling esensial: ilmu yang bermanfaat sebagai bekal akal, rezeki yang baik sebagai bekal fisik, dan amal yang diterima sebagai bekal akhirat.` },

  { cat: 'Per Waktu Solat', waktu: 'Subuh', name: 'Dzikir Pagi — Al-Ikhlas, Al-Falaq, An-Nas (3×)',
    ar: 'قُلْ هُوَ اللهُ أَحَدٌ، اللهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
    tr: 'Katakanlah: Dialah Allah, Yang Maha Esa. Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu. Dia tidak beranak dan tidak diperanakkan, dan tidak ada seorang pun yang setara dengan Dia.',
    src: 'HR. Abu Dawud no. 5082, HR. Tirmidzi no. 3575',
    faedah: 'Dibaca 3x di pagi hari, cukup sebagai penjagaan dari segala sesuatu.',
    kisah: `Abdullah bin Khubaib radhiyallahu anhu bercerita: suatu malam hujan lebat dan gelap gulita, kami menunggu Rasulullah ﷺ untuk mengimami sholat. Ketika beliau datang, beliau berkata: "Bacalah!" Aku bertanya: "Apa yang harus aku baca?" Beliau menjawab: "Bacalah Al-Ikhlas dan Al-Muawwidzatain (Al-Falaq dan An-Nas) tiga kali di pagi dan sore hari — itu cukup bagimu dari segala sesuatu." Tiga surat ini disebut Al-Muqasyqisyat — penyembuh dari segala penyakit hati.` },

  { cat: 'Per Waktu Solat', waktu: 'Maghrib', name: 'Dzikir Petang — Sayyidul Istighfar',
    ar: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    tr: 'Ya Allah, Engkau adalah Rabbku. Tidak ada ilah selain Engkau. Engkau yang menciptakanku dan aku adalah hamba-Mu. Aku berada di atas perjanjian-Mu dan janji-Mu semampuku. Aku berlindung kepada-Mu dari keburukan perbuatanku. Aku mengakui nikmat-Mu atasku dan aku mengakui dosaku, maka ampunilah aku.',
    src: 'HR. Bukhari no. 6306',
    faedah: 'Barangsiapa membacanya di sore hari dengan penuh keyakinan, lalu meninggal sebelum pagi hari, maka ia termasuk ahli surga.',
    kisah: `Sama dengan versi pagi, namun dibaca di sore hari sebelum matahari terbenam. Nabi ﷺ mengajarkan doa ini dua kali sehari — pagi dan petang — sebagai "bingkai" hari seorang Muslim. Pagi dibuka dengan pengakuan dan permohonan ampun, sore ditutup dengan hal yang sama. Seseorang yang rutin membacanya setiap pagi dan petang memiliki dua kesempatan masuk surga setiap harinya.` },

  { cat: 'Per Waktu Solat', waktu: 'Maghrib', name: 'Dzikir Petang — Ayat Kursi',
    ar: 'اللهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ',
    tr: 'Allah, tidak ada ilah melainkan Dia, Yang Maha Hidup lagi terus menerus mengurus makhluk-Nya. Dia tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi.',
    src: 'QS. Al-Baqarah: 255 — HR. Nasai no. 9928',
    faedah: 'Barangsiapa membaca Ayat Kursi setiap selesai sholat, tidak ada yang menghalanginya masuk surga selain kematian.',
    kisah: `Abu Hurairah radhiyallahu anhu ditugaskan Nabi ﷺ menjaga harta zakat Ramadan. Tiga malam berturut-turut, ada makhluk mencuri makanan. Abu Hurairah menangkapnya setiap kali. Pada malam ketiga, makhluk itu berkata: "Lepaskan aku, aku akan mengajarkanmu sesuatu yang berharga." Lalu ia mengajarkan Ayat Kursi dan berkata: "Bacalah sebelum tidur, Allah akan menjagamu dan setan tidak akan mendekatimu." Nabi ﷺ kemudian membenarkan bahwa makhluk itu adalah setan yang berkata jujur untuk pertama kalinya.` },

  { cat: 'Per Waktu Solat', waktu: 'Isya', name: 'Doa Sebelum Tidur',
    ar: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    tr: 'Dengan nama-Mu ya Allah, aku mati dan aku hidup.',
    src: 'HR. Bukhari no. 6312, HR. Muslim no. 2711',
    faedah: 'Dibaca saat hendak tidur. Tidur diumpamakan seperti kematian kecil, dan bangun seperti kehidupan kembali.',
    kisah: `Hudzaifah bin Al-Yaman radhiyallahu anhu adalah sahabat yang sering menemani Nabi ﷺ di malam hari. Ia meriwayatkan bahwa Nabi, setiap kali hendak tidur, meletakkan tangan kanan di bawah pipi lalu berdoa: "Bismika Allahumma amuutu wa ahyaa." Dalam Islam, tidur disebut sebagai "saudaranya kematian" — jiwa diangkat saat tidur dan dikembalikan saat bangun. Maka doa ini adalah doa seorang hamba yang menyerahkan hidupnya kepada Allah setiap malam.` },

  { cat: 'Per Waktu Solat', waktu: 'Isya', name: 'Doa Sebelum Tidur — Tasbih Fatimah',
    ar: 'سُبْحَانَ اللهِ (٣٣×)، الْحَمْدُ لِلّٰهِ (٣٣×)، اللهُ أَكْبَرُ (٣٤×)',
    tr: 'Maha Suci Allah (33x), Segala puji bagi Allah (33x), Allah Maha Besar (34x).',
    src: 'HR. Bukhari no. 3705, HR. Muslim no. 2727',
    faedah: 'Lebih baik bagimu daripada seorang pembantu. Dibaca sebelum tidur untuk menguatkan badan.',
    kisah: `Fatimah radhiyallahu anha, putri Rasulullah ﷺ, datang kepada ayahnya dengan telapak tangan yang kasar dan kapalan karena setiap hari menggiling gandum dan mengangkat air. Ia meminta seorang pembantu. Nabi ﷺ tidak memberinya pembantu, tapi mengajarkan sesuatu yang lebih berharga: "Sebelum tidur, bertasbihlah 33 kali, bertahmidlah 33 kali, dan bertakbirlah 34 kali. Itu lebih baik bagimu daripada seorang pembantu." Ali bin Abi Thalib berkata: "Sejak itu aku tidak pernah meninggalkannya."` },

  // Ujian
  { cat: 'Ujian', name: 'Doa Minta Tambahan Ilmu',
    ar: 'رَبِّ زِدْنِي عِلْمًا',
    tr: 'Ya Tuhanku, tambahkanlah ilmuku.',
    src: 'QS. Thaha: 114',
    faedah: 'Satu-satunya ayat dalam Al-Quran yang Allah perintahkan Nabi untuk meminta tambahan, yaitu ilmu.',
    kisah: `Ini adalah satu-satunya bidang yang Allah perintahkan Nabi ﷺ untuk meminta tambahan. Dalam seluruh Al-Quran, tidak ada perintah "minta tambahan" kecuali untuk ilmu. Allah tidak berkata "minta tambahan harta" atau "minta tambahan umur" — hanya ilmu. Para ulama menyebut ayat ini sebagai bukti bahwa ilmu adalah semulia-mulianya sesuatu yang bisa diminta seorang hamba.` },

  { cat: 'Ujian', name: 'Doa Lapang Dada & Kemudahan Urusan',
    ar: 'رَبِّ اشْرَحْ لِي صَدْرِي، وَيَسِّرْ لِي أَمْرِي، وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي، يَفْقَهُوا قَوْلِي',
    tr: 'Ya Tuhanku, lapangkanlah dadaku, dan mudahkanlah urusanku, dan lepaskanlah kekakuan lidahku, agar mereka mengerti perkataanku.',
    src: 'QS. Thaha: 25-28',
    faedah: 'Doa Nabi Musa sebelum menghadap Firaun. Sangat dianjurkan dibaca sebelum ujian, presentasi, atau berbicara di depan umum.',
    kisah: `Nabi Musa alaihissalam menerima wahyu yang sangat berat: pergi menghadap Firaun — penguasa paling zalim di zamannya — dan menyampaikan risalah Allah. Firaun yang pernah membesarkannya, kini harus dihadapinya sebagai musuh. Sebelum berangkat, Musa berdoa memohon kelapangan dada, kemudahan urusan, dan kelancaran lisan. Allah mengabulkan dan bahkan memberinya Harun sebagai pendamping. Doa ini mengajarkan bahwa saat menghadapi tugas berat, yang pertama diminta adalah kekuatan batin, bukan kekuatan fisik.` },

  { cat: 'Ujian', name: 'Doa Sebelum Belajar',
    ar: 'اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي، وَعَلِّمْنِي مَا يَنْفَعُنِي، وَزِدْنِي عِلْمًا',
    tr: 'Ya Allah, berikanlah manfaat kepadaku atas apa yang telah Engkau ajarkan kepadaku, ajarkan aku apa yang bermanfaat bagiku, dan tambahkanlah ilmu kepadaku.',
    src: 'HR. Tirmidzi no. 3599, dinilai hasan oleh Al-Albani',
    faedah: 'Dibaca sebelum memulai belajar atau membaca kitab.',
    kisah: `Ibn Abbas radhiyallahu anhu adalah anak kecil berusia 10 tahun ketika Rasulullah ﷺ wafat. Namun ia dikenal sebagai Turjumanul Quran — juru tafsir Al-Quran. Rahasianya: Nabi pernah memeluknya dan berdoa "Allahumma faqqihhu fid diin wa allimhut ta'wiil." Sejak saat itu, ilmu mengalir deras kepadanya. Para ulama menganjurkan doa ini dibaca sebelum belajar, sebagai pengakuan bahwa pemahaman sejati hanya datang dari Allah.` },

  { cat: 'Ujian', name: 'Doa Meminta Pemahaman',
    ar: 'اللَّهُمَّ فَقِّهْنِي فِي الدِّينِ وَعَلِّمْنِي التَّأْوِيلَ',
    tr: 'Ya Allah, pahamkanlah aku dalam agama dan ajarilah aku takwil (pemahaman mendalam).',
    src: 'HR. Bukhari no. 143 — Doa Nabi untuk Ibnu Abbas',
    faedah: 'Nabi mendoakan ini untuk Ibnu Abbas hingga beliau menjadi lautan ilmu tafsir.',
    kisah: `Kisah yang sama dengan Ibn Abbas di atas. Suatu hari Nabi ﷺ masuk ke kamar mandi, dan Ibn Abbas kecil sudah menyiapkan air wudhu untuknya. Nabi senang dan memeluknya sambil mendoakan doa ini. Ibn Abbas sendiri kelak menjadi rujukan tafsir Al-Quran bagi seluruh sahabat dan tabi'in — meski ia paling muda di antara mereka. Ibnu Mas'ud berkata: "Sebaik-baik penerjemah Al-Quran adalah Ibn Abbas."` },

  { cat: 'Ujian', name: 'Doa Menghafal & Tidak Lupa',
    ar: 'اللَّهُمَّ ارْزُقْنِي حِفْظًا قَوِيًّا وَفَهْمًا ثَاقِبًا',
    tr: 'Ya Allah, anugerahkanlah aku hafalan yang kuat dan pemahaman yang tajam.',
    src: 'Doa ma\'tsur dari ulama salaf',
    faedah: 'Dibaca sebelum menghafal Al-Quran atau materi pelajaran.',
    kisah: `Para ulama hadits meriwayatkan bahwa doa ini diamalkan oleh para penghafal Al-Quran dan pelajar ilmu sejak generasi awal Islam. Imam Syafi'i yang terkenal memiliki daya ingat luar biasa menganjurkan murid-muridnya untuk banyak istighfar sebelum menghafal — karena ia percaya dosa adalah penyebab utama lemahnya hafalan. Ia berkata kepada gurunya Waki': "Aku mengadu tentang buruknya hafalanku, lalu ia memerintahkan aku untuk meninggalkan maksiat."` },

  // Galau
  { cat: 'Galau', name: 'Doa Nabi Yunus — Doa Dalam Kegelapan',
    ar: 'لَا إِلٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    tr: 'Tiada Tuhan selain Engkau. Maha Suci Engkau. Sungguh aku termasuk orang-orang yang zalim.',
    src: 'QS. Al-Anbiya: 87',
    faedah: 'Doa yang dibaca Nabi Yunus di dalam perut ikan paus. Allah berfirman: maka Kami kabulkan doanya dan Kami selamatkan dia dari kesedihan.',
    kisah: `Nabi Yunus alaihissalam meninggalkan kaumnya sebelum mendapat izin Allah. Di tengah laut, kapal yang ditumpanginya oleng dalam badai. Awak kapal mengundi siapa yang harus dibuang ke laut untuk meringankan beban — dan nama Yunus keluar tiga kali. Ia pun terjun ke laut dan ditelan ikan paus besar. Di dalam kegelapan — kegelapan perut ikan, kegelapan dasar laut, kegelapan malam — ia berdoa: "Laa ilaaha illaa anta subhaanaka innii kuntu minazh zhaalimiin." Allah berfirman: maka Kami kabulkan dan Kami selamatkan dia.` },

  { cat: 'Galau', name: 'Doa Nabi Ayyub — Doa Saat Ditimpa Musibah',
    ar: 'أَنِّي مَسَّنِيَ الضُّرُّ وَأَنْتَ أَرْحَمُ الرَّاحِمِينَ',
    tr: 'Sesungguhnya aku telah ditimpa penyakit (kesulitan) dan Engkau adalah Tuhan Yang Maha Penyayang di antara semua penyayang.',
    src: 'QS. Al-Anbiya: 83',
    faedah: 'Doa Nabi Ayyub setelah bertahun-tahun ditimpa penyakit. Allah langsung mengabulkan dan menyembuhkannya.',
    kisah: `Nabi Ayyub alaihissalam diuji Allah dengan ujian yang tak tertandingi: ia kehilangan harta, anak-anaknya meninggal semua, lalu tubuhnya diserang penyakit selama 18 tahun (sebagian riwayat menyebut 7 tahun). Kulitnya penuh luka, orang-orang menjauhinya, istrinya menjadi pembantu untuk menghidupi mereka berdua. Tapi ia tidak pernah mengeluh kepada manusia. Ia hanya berdoa kepada Allah: "Sesungguhnya aku ditimpa bahaya dan Engkau adalah Tuhan yang Maha Penyayang." Tanpa permintaan eksplisit — hanya mengadu. Dan Allah langsung menjawab.` },

  { cat: 'Galau', name: 'Doa Minta Ketenangan Hati',
    ar: 'اللَّهُمَّ إِنِّي عَبْدُكَ، ابْنُ عَبْدِكَ، ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ، أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ سَمَّيْتَ بِهِ نَفْسَكَ، أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ، أَوْ عَلَّمْتَهُ أَحَدًا مِنْ خَلْقِكَ، أَوِ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ، أَنْ تَجْعَلَ الْقُرْآنَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجَلَاءَ حُزْنِي، وَذَهَابَ هَمِّي',
    tr: 'Ya Allah, sesungguhnya aku adalah hamba-Mu, anak hamba-Mu (laki-laki), anak hamba-Mu (perempuan). Ubun-ubunku ada di tangan-Mu, keputusan-Mu berlaku padaku, ketetapan-Mu adil bagiku. Aku memohon kepada-Mu dengan setiap nama yang Engkau miliki … agar Engkau menjadikan Al-Quran sebagai musim semi hatiku, cahaya dadaku, pengusir kesedihanku, dan penghilang kegundahanku.',
    src: 'HR. Ahmad no. 3712, dinilai shahih oleh Al-Albani',
    faedah: 'Nabi bersabda: tidaklah seseorang membaca doa ini kecuali Allah akan menghilangkan kesedihannya dan menggantikannya dengan kegembiraan.',
    kisah: `Nabi ﷺ mengajarkan doa ini kepada seorang sahabat yang sedang dilanda kesedihan mendalam. Para ulama menyebut kumpulan doa ini sebagai "Doa Kesedihan" — yang Nabi ajarkan khusus untuk situasi ketika hati terasa sempit dan pikiran kusut. Yang menarik, Nabi tidak hanya mengajarkan satu doa, tapi sebuah rangkaian yang mencakup segala aspek: dari iman, takdir, hingga tawakkal.` },

  { cat: 'Galau', name: 'Hasbunallah — Cukuplah Allah',
    ar: 'حَسْبُنَا اللهُ وَنِعْمَ الْوَكِيلُ',
    tr: 'Cukuplah Allah bagi kami, dan Dia sebaik-baik pelindung.',
    src: 'QS. Ali Imran: 173',
    faedah: 'Ini adalah ucapan Nabi Ibrahim saat dilempar ke dalam api, dan ucapan Nabi Muhammad saat diancam musuh di Perang Uhud.',
    kisah: `Dua momen paling dramatis dalam sejarah Islam. Pertama: Nabi Ibrahim alaihissalam diikat dan dilempar ke dalam api yang menyala-nyala oleh Namrud. Malaikat Jibril datang menawarkan bantuan, Ibrahim menjawab: "Dari kamu, tidak perlu. Dari Allah, hasbiyallah." Api pun menjadi dingin. Kedua: setelah Perang Uhud, kaum kafir Quraisy mengancam akan kembali menyerang. Para sahabat yang masih terluka berkata: "Hasbunallah wa ni'mal wakiil." Allah menurunkan ayat memuji mereka.` },

  { cat: 'Galau', name: 'Doa Minta Kesabaran',
    ar: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    tr: 'Ya Tuhan kami, limpahkanlah kesabaran atas diri kami, dan teguhkanlah pendirian kami, dan tolonglah kami terhadap orang-orang kafir.',
    src: 'QS. Al-Baqarah: 250',
    faedah: 'Doa para pejuang saat menghadapi musuh yang jauh lebih banyak. Cocok dibaca saat menghadapi situasi yang terasa mustahil.',
    kisah: `Thalut memimpin pasukan kecil melawan Jalut dan bala tentaranya yang besar. Saat melihat jumlah musuh yang sangat banyak, banyak prajurit ciut. Tapi mereka yang yakin berkata: "Kam min fi'atin qaliilatin ghalabat fi'atan katsiiran bi idzinillah" — berapa banyak kelompok kecil yang mengalahkan kelompok besar dengan izin Allah. Lalu mereka berdoa: "Rabbanaa afrigh alainaa shabran..." Doa ini mengajarkan bahwa kemenangan bukan soal jumlah, tapi soal kesabaran dan keteguhan.` },

  // Syukur
  { cat: 'Syukur', name: 'Doa Saat Mendapat Nikmat',
    ar: 'الْحَمْدُ لِلّٰهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ',
    tr: 'Segala puji bagi Allah yang dengan nikmat-Nya sempurnalah segala kebaikan.',
    src: 'HR. Ibnu Majah no. 3803, dinilai hasan oleh Al-Albani',
    faedah: 'Dibaca saat mendapat kabar gembira, keberhasilan, atau nikmat apapun.',
    kisah: `Nabi ﷺ mengajarkan doa ini setiap kali mendapat kabar gembira. Dalam budaya Arab, sujud syukur dan mengucap hamdalah adalah respons spontan terhadap nikmat. Sahabat Abu Bakar radhiyallahu anhu dikenal sering sujud syukur saat mendapat berita baik. Doa ini mengingatkan bahwa setiap nikmat adalah ujian — apakah kita bersyukur atau kufur. Dan syukur yang sesungguhnya bukan di lisan saja, tapi harus diikuti amal.` },

  { cat: 'Syukur', name: 'Doa Syukur Setelah Makan',
    ar: 'الْحَمْدُ لِلّٰهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    tr: 'Segala puji bagi Allah yang telah memberi kami makan, memberi kami minum, dan menjadikan kami orang-orang Muslim.',
    src: 'HR. Abu Dawud no. 3850, HR. Tirmidzi no. 3457',
    faedah: 'Dibaca setelah selesai makan. Mengakui bahwa makanan adalah nikmat dari Allah.',
    kisah: `Muadz bin Anas radhiyallahu anhu meriwayatkan bahwa Nabi ﷺ bersabda: "Barangsiapa setelah makan membaca Alhamdulillaahil ladzii ath'amanii haadza war razaqaniihi min ghairi hawlim minnii wa laa quwwatin — maka diampuni dosanya yang telah lalu." Sebuah pengampunan dosa hanya dengan mengucap syukur setelah makan! Para ulama menyebut ini sebagai keajaiban syariat Islam: bahkan aktivitas duniawi seperti makan bisa menjadi jalan ampunan.` },

  { cat: 'Syukur', name: 'Doa Agar Bisa Bersyukur',
    ar: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَى وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَدْخِلْنِي بِرَحْمَتِكَ فِي عِبَادِكَ الصَّالِحِينَ',
    tr: 'Ya Tuhanku, ilhamkanlah aku untuk tetap mensyukuri nikmat-Mu yang telah Engkau anugerahkan kepadaku dan kepada kedua orang tuaku dan untuk tetap mengerjakan amal shaleh yang Engkau ridhai, dan masukkanlah aku dengan rahmat-Mu ke dalam golongan hamba-hamba-Mu yang shaleh.',
    src: 'QS. An-Naml: 19 — Doa Nabi Sulaiman',
    faedah: 'Doa ini mengajarkan bahwa syukur bukan hanya ucapan, tapi juga amal shaleh.',
    kisah: `Nabi Sulaiman alaihissalam adalah raja terkaya yang pernah ada di muka bumi — kerajaan, harta, pasukan jin dan manusia, kemampuan berbicara dengan binatang, angin yang tunduk. Tapi saat seekor semut kecil berkata kepada kawanannya "masuk ke sarang kalian agar tidak terinjak Sulaiman", dan Sulaiman mendengarnya, ia berhenti dan tersenyum — lalu berdoa memohon agar tetap bisa bersyukur. Raja terkaya di dunia, takut tidak bisa bersyukur.` },

  { cat: 'Syukur', name: 'Al-Hamdulillah — Pembuka Segala Kebaikan',
    ar: 'الْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ',
    tr: 'Segala puji bagi Allah, Tuhan semesta alam.',
    src: 'QS. Al-Fatihah: 2',
    faedah: 'Nabi bersabda: kalimat alhamdulillah memenuhi timbangan amal.',
    kisah: `Alhamdulillah adalah kalimat pertama dalam Al-Quran setelah Bismillah. Para ulama menyebut ini bukan kebetulan: Allah membuka Kitab-Nya dengan pujian kepada diri-Nya sendiri, mengajarkan manusia bahwa segala sesuatu dimulai dari kesadaran bahwa semua nikmat berasal dari-Nya. Nabi ﷺ bersabda: "Tidak ada nikmat sekecil apapun yang diterima seorang hamba, lalu ia mengucap alhamdulillah, melainkan syukurnya itu lebih besar dari nikmat yang ia terima."` },

  // Safar
  { cat: 'Safar', name: 'Doa Keluar Rumah',
    ar: 'بِسْمِ اللهِ، تَوَكَّلْتُ عَلَى اللهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ',
    tr: 'Dengan nama Allah, aku bertawakal kepada Allah, dan tidak ada daya dan kekuatan kecuali dengan Allah.',
    src: 'HR. Abu Dawud no. 5095, HR. Tirmidzi no. 3426',
    faedah: 'Barangsiapa membacanya saat keluar rumah, dikatakan kepadanya: kamu telah diberi petunjuk, dicukupi, dan dijaga. Setan pun menjauh darinya.',
    kisah: `Anas bin Malik radhiyallahu anhu meriwayatkan bahwa Nabi ﷺ mengajarkan doa ini untuk dibaca setiap kali keluar rumah. Yang menakjubkan adalah responsnya: ada malaikat yang menyambut dan berkata "kamu telah diberi petunjuk, dicukupi, dan dijaga" — dan setan pun menjauh sambil berkata kepada setan lain "bagaimana aku bisa menggodanya, ia sudah diberi petunjuk, dicukupi, dan dijaga?" Satu doa pendek, tapi mengaktifkan perlindungan penuh dari Allah.` },

  { cat: 'Safar', name: 'Doa Naik Kendaraan',
    ar: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنقَلِبُونَ',
    tr: 'Maha Suci Allah yang telah menundukkan semua ini bagi kami padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami.',
    src: 'QS. Az-Zukhruf: 13-14',
    faedah: 'Dibaca setiap kali naik kendaraan — mobil, pesawat, motor, kapal. Termasuk sunnah muakkadah safar.',
    kisah: `Ibn Abbas radhiyallahu anhu meriwayatkan bahwa Nabi ﷺ, setiap kali menaiki unta atau kendaraan, membaca Bismillah tiga kali, lalu membaca ayat ini dari QS. Az-Zukhruf. Para ulama mencatat bahwa doa ini mengandung dua kesadaran sekaligus: pertama, pengakuan bahwa kendaraan itu tunduk bukan karena kehebatan manusia tapi karena Allah menundukkannya. Kedua, pengingat bahwa kita akan kembali kepada Allah — perjalanan apapun pada akhirnya adalah perjalanan menuju-Nya.` },

  { cat: 'Safar', name: 'Doa Memasuki Kota Baru',
    ar: 'اللَّهُمَّ رَبَّ السَّمَاوَاتِ السَّبْعِ وَمَا أَظْلَلْنَ، وَرَبَّ الْأَرَضِينَ السَّبْعِ وَمَا أَقْلَلْنَ، أَسْأَلُكَ خَيْرَ هٰذِهِ الْقَرْيَةِ وَخَيْرَ أَهْلِهَا',
    tr: 'Ya Allah, Tuhan tujuh langit dan apa yang dinaunginya, Tuhan tujuh bumi dan apa yang dikandungnya. Aku memohon kepada-Mu kebaikan kampung ini dan kebaikan penghuninya.',
    src: 'HR. Nasai no. 8829, dinilai shahih oleh Al-Albani',
    faedah: 'Dibaca saat pertama kali tiba di suatu kota atau tempat baru.',
    kisah: `Nabi ﷺ mengajarkan doa ini khusus untuk dibaca saat tiba di suatu tempat atau kota baru. Konteks historisnya: para sahabat sering bepergian jauh ke kota-kota yang asing, dan tidak tahu siapa penduduknya, bagaimana wataknya, atau apa bahayanya. Doa ini adalah penyerahan diri kepada Allah sebagai "pemandu" di tempat yang belum dikenal. Sangat relevan bagi Masisir yang pertama kali tiba di Cairo — kota yang asing, budaya berbeda, dan tantangan baru.` },

  { cat: 'Safar', name: 'Doa Pulang dari Safar',
    ar: 'آيِبُونَ، تَائِبُونَ، عَابِدُونَ، لِرَبِّنَا حَامِدُونَ',
    tr: 'Kami kembali, kami bertobat, kami beribadah, dan kepada Tuhan kami kami memuji.',
    src: 'HR. Bukhari no. 3085, HR. Muslim no. 1342',
    faedah: 'Dibaca Nabi setiap kali kembali dari perjalanan. Menandai kembalinya dengan taubat dan syukur.',
    kisah: `Setiap kali Nabi ﷺ kembali dari perjalanan, beliau tidak langsung masuk rumah. Beliau terlebih dahulu singgah di masjid dan sholat dua rakaat. Lalu mengucap doa ini di setiap bukit atau dataran tinggi yang dilewati: "Aayibuuna taabibuuna..." — kami kembali, bertaubat, beribadah, dan memuji Rabb kami. Safar dalam Islam bukan sekadar perjalanan fisik. Setiap kepulangan adalah momen muhasabah: apa yang sudah dilakukan selama perjalanan? Adakah yang perlu ditaubati?` },

  // Sakit
  { cat: 'Sakit', name: 'Doa Ruqyah Ma\'tsur — Memohon Kesembuhan',
    ar: 'أَذْهِبِ الْبَأْسَ رَبَّ النَّاسِ، وَاشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا',
    tr: 'Hilangkanlah penyakit ini wahai Tuhan manusia, dan sembuhkanlah, Engkaulah Sang Penyembuh, tidak ada kesembuhan kecuali kesembuhan dari-Mu, kesembuhan yang tidak meninggalkan penyakit sedikit pun.',
    src: 'HR. Bukhari no. 5743, HR. Muslim no. 2191',
    faedah: 'Dibaca sambil mengusapkan tangan ke bagian tubuh yang sakit.',
    kisah: `Aisyah radhiyallahu anha meriwayatkan bahwa setiap malam sebelum tidur, Nabi ﷺ mengumpulkan kedua telapak tangannya, meniupnya, lalu membaca Al-Ikhlas, Al-Falaq, dan An-Nas. Kemudian mengusapkan tangan ke seluruh tubuhnya yang bisa dijangkau, dimulai dari kepala, wajah, dan bagian depan tubuh. Beliau melakukannya tiga kali. Ini adalah ruqyah preventif — dilakukan sebelum sakit. Saat sakit, beliau juga mengajarkan doa spesifik yang diusapkan ke bagian yang nyeri.` },

  { cat: 'Sakit', name: 'Doa Saat Merasakan Sakit di Tubuh',
    ar: 'بِسْمِ اللهِ (٣×) أَعُوذُ بِاللهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ (٧×)',
    tr: 'Dengan nama Allah (3x). Aku berlindung kepada Allah dan kekuasaan-Nya dari keburukan yang aku rasakan dan yang aku khawatirkan (7x).',
    src: 'HR. Muslim no. 2202',
    faedah: 'Letakkan tangan di bagian yang sakit, baca bismillah 3x, lalu baca doa 7x.',
    kisah: `Ustman bin Abi Al-Ash radhiyallahu anhu mengadu kepada Nabi ﷺ tentang rasa sakit di tubuhnya yang sudah berlangsung lama. Nabi mengajarkan: "Letakkan tanganmu di tempat yang sakit, baca bismillah 3 kali, lalu baca: A'udzu billahi wa qudratihi min syarri maa ajidu wa uhaadziru, 7 kali." Ustman berkata: "Aku melakukannya dan Allah menghilangkan rasa sakitku. Sejak itu aku selalu mengajarkannya kepada keluarga dan orang-orang yang kukenal."` },

  { cat: 'Sakit', name: 'Doa Menjenguk Orang Sakit',
    ar: 'لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللهُ',
    tr: 'Tidak mengapa, semoga (sakit ini) membersihkan (dosa), insya Allah.',
    src: 'HR. Bukhari no. 3616',
    faedah: 'Dibaca saat menjenguk orang yang sakit. Mengingatkan bahwa sakit adalah penghapus dosa.',
    kisah: `Ibnu Abbas radhiyallahu anhu meriwayatkan bahwa Nabi ﷺ, setiap kali menjenguk orang sakit, mengucap doa: "Laa ba'sa thahurun insyaallah" — tidak mengapa, semoga menjadi penghapus dosa insyaAllah. Para ulama menjelaskan bahwa doa ini mengandung dua fungsi: pertama sebagai doa yang mengharapkan kesembuhan, kedua sebagai penghiburan bahwa sakit itu bukan sia-sia — melainkan penghapus dosa yang sangat bernilai di sisi Allah.` },

  { cat: 'Sakit', name: 'Doa Ruqyah — Al-Fatihah',
    ar: 'الْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ، الرَّحْمٰنِ الرَّحِيمِ، مَالِكِ يَوْمِ الدِّينِ، إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ، اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    tr: 'Segala puji bagi Allah, Tuhan semesta alam. Yang Maha Pengasih lagi Maha Penyayang. Yang menguasai hari pembalasan. Hanya kepada-Mu kami menyembah dan hanya kepada-Mu kami memohon pertolongan. Tunjukilah kami jalan yang lurus.',
    src: 'QS. Al-Fatihah: 1-5 — HR. Bukhari no. 5736',
    faedah: 'Al-Fatihah adalah Ummul Quran sekaligus ruqyah yang paling mujarab. Nabi membenarkan sahabat yang meruqyah dengan Al-Fatihah.',
    kisah: `Sekelompok sahabat dalam perjalanan singgah di suatu suku Arab. Mereka meminta keramahan tuan rumah tapi ditolak. Lalu pemimpin suku itu tersengat kalajengking. Orang-orangnya datang meminta pertolongan para sahabat. Seorang sahabat meruqyah dengan membaca Al-Fatihah dan meludah ke tempat yang tersengat. Pemimpin suku itu pun sembuh dan memberi hadiah 30 ekor kambing. Para sahabat bertanya kepada Nabi: bolehkah kami mengambilnya? Nabi tersenyum dan bertanya: "Dari mana kalian tahu Al-Fatihah adalah ruqyah?"` },

  // Rezeki
  { cat: 'Rezeki', name: 'Doa Kelapangan Rezeki — Penghilang Hutang',
    ar: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    tr: 'Ya Allah, cukupkanlah aku dengan rezeki halal-Mu dari yang haram, dan kayakanlah aku dengan karunia-Mu dari selain-Mu.',
    src: 'HR. Tirmidzi no. 3563, dinilai hasan oleh Al-Albani',
    faedah: 'Ali bin Abi Thalib berkata: Nabi mengajarkan doa ini untuk membayar hutang, sekalipun hutangnya sebesar gunung.',
    kisah: `Ali bin Abi Thalib radhiyallahu anhu berkata: "Seorang budak mukatab datang kepadaku dan berkata: aku tidak mampu membayar cicilan pembebasanku, bantulah aku." Ali berkata: "Maukah aku ajarkan kalimat yang diajarkan Rasulullah ﷺ kepadaku? Seandainya kamu punya hutang sebesar gunung, Allah akan melunasinya." Lalu ia mengajarkan doa: "Allahumma akfinii bihalalatika an haraamik wa aghnini bi fadhlika amman siwaak." Inilah doa yang Nabi ajarkan khusus untuk melunasi hutang.` },

  { cat: 'Rezeki', name: 'Doa Pagi untuk Barakah Rezeki',
    ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
    tr: 'Ya Allah, sesungguhnya aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik (halal dan berkah), dan amal yang diterima.',
    src: 'HR. Ibnu Majah no. 925, dinilai shahih oleh Al-Albani',
    faedah: 'Dibaca setelah salam sholat Subuh sebelum beranjak. Tiga permohonan sekaligus: ilmu, rezeki, amal.',
    kisah: `Lihat kisah doa no. 2 — Doa Ilmu, Rezeki & Amal. Kedua doa ini saling berkaitan dan keduanya diajarkan Nabi untuk dibaca di waktu pagi, sebelum memulai aktivitas. Prinsipnya: mulailah hari dengan memohon kepada Allah, bukan dengan langsung terjun ke urusan dunia. Nabi tidak pernah memulai hari tanpa berdoa. Ini mengajarkan bahwa keberkahan rezeki bukan soal seberapa awal kita bekerja, tapi seberapa awal kita mengingat Allah.` },

  { cat: 'Rezeki', name: 'Doa Saat Berhutang',
    ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    tr: 'Ya Allah, aku berlindung kepada-Mu dari rasa gundah dan sedih, dari kelemahan dan kemalasan, dari kebakhilan dan ketakutan, dari lilitan hutang dan penguasaan orang lain.',
    src: 'HR. Bukhari no. 6369',
    faedah: 'Nabi membaca doa ini setiap pagi dan petang. Termasuk berlindung dari lilitan hutang (dhala\'id-dain).',
    kisah: `Doa ini sebenarnya adalah doa perlindungan pagi-petang yang komprehensif. Di dalamnya terdapat permintaan perlindungan dari "dhalad-dain" — lilitan hutang. Para ulama menjelaskan bahwa Nabi ﷺ sangat serius soal hutang: beliau pernah menolak menyolati jenazah seseorang yang meninggal dengan hutang yang belum terlunasi, hingga ada sahabat yang bersedia menanggungnya. Hutang bukan hanya beban finansial — ia juga beban di akhirat.` },

  { cat: 'Rezeki', name: 'Doa Setelah Sholat Dhuha untuk Rezeki',
    ar: 'اللَّهُمَّ إِنَّ الضُّحَى ضُحَاؤُكَ، وَالْبَهَاءَ بَهَاؤُكَ، وَالْجَمَالَ جَمَالُكَ، وَالْقُوَّةَ قُوَّتُكَ، وَالْقُدْرَةَ قُدْرَتُكَ، وَالْعِصْمَةَ عِصْمَتُكَ. اللَّهُمَّ إِنْ كَانَ رِزْقِي فِي السَّمَاءِ فَأَنْزِلْهُ، وَإِنْ كَانَ فِي الْأَرْضِ فَأَخْرِجْهُ',
    tr: 'Ya Allah, sesungguhnya waktu dhuha adalah waktu dhuha-Mu, keagungan adalah keagungan-Mu, keindahan adalah keindahan-Mu, kekuatan adalah kekuatan-Mu, kekuasaan adalah kekuasaan-Mu, dan penjagaan adalah penjagaan-Mu. Ya Allah, jika rezekiku ada di langit maka turunkanlah, dan jika ada di bumi maka keluarkanlah.',
    src: 'Doa ma\'tsur dari ulama, diriwayatkan dalam kitab-kitab doa',
    faedah: 'Dibaca setelah sholat Dhuha selesai.',
    kisah: `Doa ini diajarkan ulama untuk dibaca setelah sholat Dhuha. Konteksnya: Dhuha adalah waktu ketika pasar mulai ramai dan orang-orang sibuk mencari nafkah. Sholat Dhuha adalah pernyataan seorang Muslim bahwa sebelum terjun ke pasar, ia lebih dulu melapor kepada Allah. Dan doa setelahnya adalah permohonan agar rezeki yang akan dicari hari itu datang dari jalan yang halal, mudah, dan berkah.` },

  // ── REZEKI (+3) ──
  { cat: 'Rezeki', waktu: null, name: 'Doa Keberkahan Rezeki',
    ar: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ',
    tr: 'Ya Allah, berkahilah kami dalam rezeki yang telah Engkau berikan kepada kami, dan jagalah kami dari azab neraka.',
    src: 'Doa ma\'tsur — dibaca sebelum makan',
    faedah: 'Mengundang keberkahan dalam setiap rezeki. Dibaca sebelum makan agar memberi manfaat bagi tubuh dan ibadah.',
    kisah: `Doa sebelum makan ini memiliki kedalaman makna yang sering terlewat. "Baarik lanaa fiimaa razaqtanaa" — berkahilah kami dalam rezeki yang Engkau berikan. Bukan meminta lebih, tapi meminta berkah dari yang sudah ada. Para ulama membedakan antara "banyak" dan "berkah": rezeki yang banyak tapi tidak berkah akan habis tanpa manfaat. Rezeki yang sedikit tapi berkah akan mencukupi semua kebutuhan dan mendatangkan kebaikan.` },

  { cat: 'Rezeki', waktu: null, name: 'Doa Mohon Kecukupan dari Yang Halal',
    ar: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    tr: 'Ya Allah, cukupkanlah aku dengan yang halal dari-Mu sehingga tidak membutuhkan yang haram, dan kayakanlah aku dengan karunia-Mu sehingga tidak butuh selain-Mu.',
    src: 'HR. Tirmidzi no. 3563, dinilai hasan Al-Albani',
    faedah: 'Doa paling lengkap untuk memohon rezeki halal dan kecukupan tanpa bergantung kepada manusia.',
    kisah: `Kisah yang sama dengan no. 30. Ali bin Abi Thalib mengajarkan doa ini kepada seorang budak yang ingin merdeka namun tak mampu membayar. Tapi konteks doa ini lebih luas: ia adalah permohonan untuk tidak perlu bergantung kepada manusia. "Aghnini bi fadhlika amman siwaak" — kayakan aku dengan karunia-Mu sehingga aku tidak butuh selain Engkau. Ini adalah doa kemerdekaan jiwa — bebas dari ketergantungan kepada makhluk.` },

  { cat: 'Rezeki', waktu: null, name: 'Doa Pagi untuk Keberkahan Hari',
    ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ فَتْحَهُ وَنَصْرَهُ وَنُورَهُ وَبَرَكَتَهُ وَهُدَاهُ',
    tr: 'Ya Allah, sesungguhnya aku memohon kepada-Mu kebaikan hari ini: pembukaannya, pertolongannya, cahayanya, keberkahannya, dan petunjuknya.',
    src: 'HR. Abu Dawud no. 5084, dinilai hasan Al-Albani',
    faedah: 'Membuka hari dengan memohon seluruh kebaikan — rezeki, pertolongan, cahaya, keberkahan, dan petunjuk dalam satu doa.',
    kisah: `Doa ini diajarkan Nabi ﷺ untuk merangkum seluruh kebaikan yang diharapkan dalam satu hari. Lima permintaan dalam satu doa: fathu (pembukaan/kemudahan), nashr (pertolongan), nuur (cahaya/petunjuk), barakah (keberkahan), dan hudaa (hidayah). Para ulama mencatat bahwa urutan ini pun mengajarkan: yang pertama diminta adalah kemudahan, bukan langsung meminta hasil.` },

  // ── UJIAN (+3) ──
  { cat: 'Ujian', waktu: null, name: 'Doa Mohon Kemudahan Urusan',
    ar: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي',
    tr: 'Ya Tuhanku, lapangkanlah dadaku, mudahkanlah urusanku, dan lepaskanlah kekakuan lidahku supaya mereka mengerti perkataanku.',
    src: 'QS. Thaha: 25-28 — Doa Nabi Musa',
    faedah: 'Doa Nabi Musa saat menghadapi tugas berat. Sangat cocok dibaca sebelum presentasi, ujian lisan, atau menghadapi situasi menegangkan.',
    kisah: `Lihat kisah doa no. 9. Ini adalah doa yang sama dengan Nabi Musa sebelum menghadap Firaun. Yang membedakannya dari doa lapang dada biasa adalah tambahan "wahlul uqdatam min lisaani yafqahuu qawlii" — lepaskan kekakuan dari lisanku agar mereka mengerti perkataanku. Nabi Musa merasa lisannya kurang fasih. Tapi Allah tidak langsung menyembuhkan kekurangan itu — Ia memberinya Harun sebagai pendamping. Terkadang jawaban doa bukan penghapusan kelemahan, tapi pemberian pendamping yang melengkapi.` },

  { cat: 'Ujian', waktu: null, name: 'Doa Mohon Keteguhan Hati',
    ar: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
    tr: 'Wahai Dzat yang membolak-balikkan hati, teguhkanlah hatiku di atas agama-Mu.',
    src: 'HR. Tirmidzi no. 3522, dinilai hasan Al-Albani',
    faedah: 'Nabi ﷺ banyak membaca doa ini. Cocok saat menghadapi ujian keimanan, tekanan lingkungan, atau keraguan.',
    kisah: `Aisyah radhiyallahu anha berkata: "Doa yang paling sering dibaca Rasulullah ﷺ adalah: Yaa muqallibal quluub, tsabbit qalbii alaa diiniik." Aisyah kemudian bertanya: "Ya Rasulullah, mengapa engkau sering sekali berdoa ini?" Nabi menjawab: "Wahai Aisyah, setiap hati berada di antara dua jari Rahman. Jika Ia mau, Ia teguhkan. Jika Ia mau, Ia belokkan." Bahkan Nabi — yang hatinya paling teguh — tetap memohon keteguhan kepada Allah. Ini mengajarkan bahwa istiqamah bukan pencapaian, tapi permohonan yang terus-menerus.` },

  { cat: 'Ujian', waktu: null, name: 'Doa Tawakkal Setelah Ikhtiar',
    ar: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    tr: 'Cukuplah Allah sebagai penolong kami, dan Dia adalah sebaik-baik pelindung.',
    src: 'QS. Ali Imran: 173 — dibaca Nabi Ibrahim saat dilempar ke api',
    faedah: 'Kalimat yang dibaca para nabi saat menghadapi tekanan terberat. Menenangkan hati dan meneguhkan tawakkal setelah berusaha maksimal.',
    kisah: `Lihat kisah doa no. 16. "Hasbunallah wa ni'mal wakiil" adalah kalimat yang diucapkan dua nabi di dua situasi paling ekstrem: Nabi Ibrahim di depan api, dan umat Nabi Muhammad setelah Perang Uhud saat diancam serangan kedua. Allah merespons keduanya dengan keajaiban. Api menjadi dingin bagi Ibrahim. Dan musuh yang mengancam itu justru pergi ketakutan tanpa sebab. Para ulama berkata: tawakkal sejati bukan pasif — tapi menyerahkan hasil setelah berusaha maksimal.` },

  // ── GALAU (+3) ──
  { cat: 'Galau', waktu: null, name: 'Doa Ketenangan Hati',
    ar: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    tr: 'Ketahuilah, hanya dengan mengingat Allah hati menjadi tenang.',
    src: 'QS. Ar-Ra\'d: 28',
    faedah: 'Ayat ini adalah obat hati yang paling mujarab. Baca berulang-ulang saat hati gelisah, cemas, atau kehilangan arah.',
    kisah: `Ayat "Alaa bidzikrillahi tathmainnul quluub" turun berkaitan dengan orang-orang yang beriman yang hatinya tenang saat mendengar nama Allah disebut. Allah tidak hanya memerintahkan zikir — Ia menjamin hasilnya: ketenangan. Para ulama mencatat bahwa ini adalah satu-satunya "resep" ketenangan hati yang Allah jamin dalam Al-Quran. Bukan harta, bukan kesehatan, bukan popularitas — hanya zikir.` },

  { cat: 'Galau', waktu: null, name: 'Doa Saat Ditimpa Kesulitan',
    ar: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    tr: 'Tiada ilah selain Engkau, Maha Suci Engkau, sesungguhnya aku termasuk orang-orang yang zalim.',
    src: 'QS. Al-Anbiya: 87 — Doa Nabi Yunus dalam perut ikan',
    faedah: 'Tidak ada seorang Muslim pun yang berdoa dengan doa ini melainkan Allah kabulkan. (HR. Tirmidzi no. 3505). Dibaca saat merasa terjebak dan tidak ada jalan keluar.',
    kisah: `Kisah yang sama dengan doa no. 13 — Nabi Yunus dalam perut ikan. Tapi konteks ini lebih spesifik: doa ini dibaca saat merasa terjebak total — seperti Yunus yang terjebak di tiga kegelapan sekaligus. Para ulama mengajarkan: saat tidak ada jalan keluar yang terlihat, justru itulah saatnya doa ini paling mujarab. Karena ketika manusia benar-benar sudah tidak bisa apa-apa, barulah mereka benar-benar berdoa dengan sepenuh hati.` },

  { cat: 'Galau', waktu: null, name: 'Doa Mohon Dijauhkan dari Kesedihan',
    ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    tr: 'Ya Allah, aku berlindung kepada-Mu dari kesedihan dan kesusahan, kelemahan dan kemalasan, kekikiran dan sifat pengecut, dari lilitan hutang dan tekanan manusia.',
    src: 'HR. Bukhari no. 6369',
    faedah: 'Doa lengkap dari Nabi ﷺ yang mencakup perlindungan dari semua sebab kegelisahan jiwa. Baca rutin pagi dan petang.',
    kisah: `Doa ini adalah bagian dari doa pagi-petang Nabi ﷺ yang komprehensif. Di dalamnya terdapat delapan hal yang dimohon perlindungannya: hamma (kesedihan yang terkait masa depan), hazan (kesedihan terkait masa lalu), ajz (kelemahan), kasal (kemalasan), bukhl (kikir), jubn (pengecut), dhalaad-dain (lilitan hutang), dan ghalabatur rijaal (tekanan/penindasan manusia). Nabi mengajarkan bahwa kegelisahan manusia bersumber dari delapan hal ini — dan semua bisa dilindungi dengan satu doa.` },

  // ── SAKIT (+3) ──
  { cat: 'Sakit', waktu: null, name: 'Doa Ruqyah — Tiup ke Tangan',
    ar: 'بِسْمِ اللَّهِ أَرْقِيكَ مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ مِنْ شَرِّ كُلِّ نَفْسٍ أَوْ عَيْنٍ حَاسِدٍ اللَّهُ يَشْفِيكَ بِسْمِ اللَّهِ أَرْقِيكَ',
    tr: 'Dengan nama Allah aku meruqyahmu dari segala sesuatu yang menyakitimu, dari kejahatan setiap jiwa atau mata yang dengki. Semoga Allah menyembuhkanmu. Dengan nama Allah aku meruqyahmu.',
    src: 'HR. Muslim no. 2186',
    faedah: 'Dibaca Nabi ﷺ saat meruqyah. Tiupkan ke telapak tangan lalu usapkan ke tubuh yang sakit, atau bisa dibacakan kepada orang lain.',
    kisah: `Aisyah radhiyallahu anha meriwayatkan bahwa ketika Nabi ﷺ sakit menjelang wafatnya, beliau sendiri yang meruqyah dirinya dengan Al-Muawwidzat. Tapi saat sakitnya semakin berat dan tangannya sudah tidak mampu mengusap tubuhnya sendiri, Aisyah lah yang melakukannya — mengambil tangan Nabi dan mengusapkannya ke tubuh beliau. Momen yang sangat mengharukan: istri meruqyah suaminya dengan tangan suami itu sendiri.` },

  { cat: 'Sakit', waktu: null, name: 'Doa Kesabaran dalam Sakit',
    ar: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا',
    tr: 'Sesungguhnya kami milik Allah dan kepada-Nya kami kembali. Ya Allah, berilah aku pahala dalam musibahku ini dan gantikanlah bagiku yang lebih baik darinya.',
    src: 'HR. Muslim no. 918',
    faedah: 'Barangsiapa membaca ini saat tertimpa musibah, Allah akan memberi pahala dan mengganti dengan yang lebih baik. Ummu Salamah bersaksi sendiri atas keajaiban doa ini.',
    kisah: `Ummu Salamah radhiyallahu anha bercerita: ketika suaminya Abu Salamah wafat, ia mendengar Nabi mengajarkan doa ini dan berkata: "Tidaklah seorang hamba tertimpa musibah lalu mengucap innaa lillaahi wa innaa ilaihi raaji'uun, Allahumma ajurnii fii mushiibatii wa akhlif lii khairan minhaa — melainkan Allah memberinya ganti yang lebih baik." Ummu Salamah berkata: "Aku pun mengucapkannya, tapi dalam hati aku pikir, siapa yang bisa lebih baik dari Abu Salamah?" Ternyata Allah menggantikannya dengan Rasulullah ﷺ sendiri.` },

  { cat: 'Sakit', waktu: null, name: 'Doa Menjenguk Orang Sakit',
    ar: 'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ اشْفِهِ وَأَنْتَ الشَّافِي لَا شِفَاءَ إِلَّا شِفَاؤُكَ شِفَاءً لَا يُغَادِرُ سَقَمًا',
    tr: 'Ya Allah, Tuhan manusia, hilangkanlah penyakit ini, sembuhkanlah ia. Engkaulah Yang Maha Menyembuhkan. Tidak ada kesembuhan kecuali kesembuhan dari-Mu, kesembuhan yang tidak meninggalkan penyakit.',
    src: 'HR. Bukhari no. 5742, HR. Muslim no. 2191',
    faedah: 'Dibaca Nabi ﷺ saat menjenguk orang sakit dengan mengusap bagian yang sakit. Doa ini mengandung pengakuan bahwa hanya Allah yang menyembuhkan.',
    kisah: `Aisyah radhiyallahu anha meriwayatkan bahwa Nabi ﷺ ketika menjenguk orang sakit, mengusap bagian yang sakit dengan tangan kanannya sambil berdoa: "Allahumma rabban naas, adzhibilba'sa, isyfihi wa antasy syaafii, laa syifaa'a illaa syifaauka, syifaa'an laa yughaadiruuu saqamaa." Doa ini mengandung tiga elemen: permohonan (hilangkan penyakit), pengakuan (Engkaulah Yang Menyembuhkan), dan spesifikasi (kesembuhan total tanpa sisa).` },

  // ── SAFAR (+2) ──
  { cat: 'Safar', waktu: null, name: 'Doa Tiba di Tempat Tujuan',
    ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا وَخَيْرَ أَهْلِهَا وَأَعُوذُ بِكَ مِنْ شَرِّهَا وَشَرِّ أَهْلِهَا',
    tr: 'Ya Allah, sesungguhnya aku memohon kepada-Mu kebaikan tempat ini dan kebaikan penghuninya, dan aku berlindung kepada-Mu dari keburukan tempat ini dan keburukan penghuninya.',
    src: 'HR. Bukhari dalam Al-Adab Al-Mufrad, dinilai shahih Al-Albani',
    faedah: 'Dibaca saat tiba di kota/tempat baru. Sangat relevan bagi Masisir yang baru tiba di Cairo atau bepergian ke luar kota.',
    kisah: `Nabi ﷺ mengajarkan doa ini dalam konteks perjalanan sahabat ke berbagai penjuru. Kota-kota yang dikunjungi tidak selalu ramah — ada kota dengan cuaca berbeda, air berbeda, penyakit berbeda, dan manusia dengan watak berbeda. Doa ini adalah "protokol keamanan" seorang Muslim di tempat baru: serahkan dirimu kepada Allah sebelum berinteraksi dengan lingkungan baru. Yang menarik, doa ini tidak hanya memohon perlindungan dari keburukan tempat, tapi juga dari "syarri ahliha" — keburukan penghuninya.` },

  { cat: 'Safar', waktu: null, name: 'Doa Naik Kendaraan',
    ar: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    tr: 'Maha Suci Allah yang telah menundukkan kendaraan ini bagi kami padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami.',
    src: 'QS. Az-Zukhruf: 13-14, HR. Abu Dawud no. 2602',
    faedah: 'Dibaca Nabi ﷺ setiap kali naik kendaraan. Cocok dibaca saat naik metro Cairo, pesawat, bus, atau kendaraan apapun.',
    kisah: `Kisah yang sama dengan doa no. 23. Konteks tambahan: dalam sejarah Islam, perjalanan adalah momen penuh risiko. Unta bisa tersandung, kapal bisa tenggelam, kuda bisa tergelincir. Ayat ini mengingatkan dua hal sekaligus: bahwa Allah lah yang "menundukkan" kendaraan itu agar bisa dinaiki (karena manusia pada dasarnya tidak bisa mengendalikan alam), dan bahwa setiap perjalanan pada akhirnya adalah perjalanan pulang kepada Allah.` },

  // ── TOBAT (+2) ──
  { cat: 'Tobat', waktu: null, name: 'Doa Tobat Nasuha',
    ar: 'رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
    tr: 'Ya Tuhan kami, kami telah menzalimi diri kami sendiri. Jika Engkau tidak mengampuni kami dan memberi rahmat kepada kami, niscaya kami termasuk orang-orang yang rugi.',
    src: 'QS. Al-A\'raf: 23 — Doa Nabi Adam dan Hawa',
    faedah: 'Doa tobat pertama dalam sejarah manusia. Mengandung pengakuan dosa yang tulus dan pengharapan penuh kepada ampunan Allah.',
    kisah: `Ini adalah doa pertama dalam sejarah manusia. Adam dan Hawa alaihimassalam telah dilarang mendekati pohon tertentu di surga. Namun setan berhasil membujuk mereka. Setelah memakan buah terlarang itu, mereka sadar dan menyesal. Allah tidak perlu diajarkan tobat — Ia yang mengajarkan kalimat tobat ini kepada Adam. Lalu Adam bertobat dengan sungguh-sungguh menggunakan kalimat yang Allah ajarkan. Dan Allah menerima tobatnya. Pelajaran: Allah sendiri yang membuka pintu tobat dan mengajarkan cara mengetuknya.` },

  { cat: 'Tobat', waktu: null, name: 'Doa Istighfar Nabi Nuh',
    ar: 'رَبِّ إِنِّي أَعُوذُ بِكَ أَنْ أَسْأَلَكَ مَا لَيْسَ لِي بِهِ عِلْمٌ وَإِلَّا تَغْفِرْ لِي وَتَرْحَمْنِي أَكُنْ مِنَ الْخَاسِرِينَ',
    tr: 'Ya Tuhanku, sesungguhnya aku berlindung kepada-Mu untuk memohon sesuatu yang aku tidak mengetahui hakikatnya. Dan jika Engkau tidak mengampuniku dan merahmatiku, niscaya aku termasuk orang-orang yang rugi.',
    src: 'QS. Hud: 47 — Doa Nabi Nuh',
    faedah: 'Doa yang menggabungkan kerendahan hati, pengakuan atas keterbatasan diri, dan permohonan ampun. Dibaca saat merasa telah salah langkah.',
    kisah: `Nabi Nuh alaihissalam memiliki anak yang menolak beriman. Saat banjir besar datang, anaknya memilih naik ke puncak gunung bukan masuk ke bahtera. Nuh berdoa memohon keselamatan anaknya — karena Allah berjanji menyelamatkan keluarganya. Tapi Allah menjawab: anaknya bukan bagian dari keluarganya dalam konteks iman. Nuh terdiam dan menyadari ia telah memohon sesuatu yang tidak ia pahami sepenuhnya. Lalu ia berdoa doa ini: memohon ampun atas permohonannya yang melampaui pengetahuannya.` },

  // ── ISTIQAMAH (+1) ──
  { cat: 'Istiqamah', waktu: null, name: 'Doa Mohon Istiqamah di Atas Kebaikan',
    ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الثَّبَاتَ فِي الْأَمْرِ وَالْعَزِيمَةَ عَلَى الرُّشْدِ وَأَسْأَلُكَ شُكْرَ نِعْمَتِكَ وَحُسْنَ عِبَادَتِكَ وَأَسْأَلُكَ قَلْبًا سَلِيمًا وَلِسَانًا صَادِقًا',
    tr: 'Ya Allah, aku memohon kepada-Mu keteguhan dalam urusan, tekad kuat di atas petunjuk, rasa syukur atas nikmat-Mu, indahnya beribadah kepada-Mu, hati yang selamat, dan lisan yang jujur.',
    src: 'HR. Nasai no. 1304, dinilai shahih Al-Albani',
    faedah: 'Doa komprehensif yang mencakup semua modal istiqamah: keteguhan, tekad, syukur, ibadah yang baik, hati bersih, dan lisan jujur.',
    kisah: `Sufyan bin Abdillah Ats-Tsaqafi radhiyallahu anhu pernah meminta Nabi ﷺ: "Beritahu aku satu hal tentang Islam yang tidak perlu aku tanyakan kepada orang lain." Nabi menjawab: "Qul aamantu billahi tsummas taqim" — katakan aku beriman kepada Allah, lalu istiqamahlah. Istiqamah adalah puncak Islam. Para ulama berkata: Abu Bakar menangis saat ayat "istaqim kamaa umirta" turun — karena ia tahu betapa beratnya istiqamah. Doa ini adalah permohonan untuk dibantu menanggung beban yang paling berat dalam perjalanan seorang Muslim.` },
];

const DOA_TABS = ['Semua', 'Per Waktu Solat', 'Ujian', 'Galau', 'Syukur', 'Safar', 'Sakit', 'Rezeki', 'Tobat', 'Istiqamah'];

const WAKTU_SOLAT_LIST = [
  { key: 'Semua',   label: 'Semua',   ar: null,         emoji: '🕌' },
  { key: 'Subuh',   label: 'Subuh',   ar: 'الفَجْر',    emoji: '🌅' },
  { key: 'Dzuhur',  label: 'Dzuhur',  ar: 'الظُّهْر',   emoji: '☀️' },
  { key: 'Ashar',   label: 'Ashar',   ar: 'العَصْر',    emoji: '🌤️' },
  { key: 'Maghrib', label: 'Maghrib', ar: 'المَغْرِب',  emoji: '🌆' },
  { key: 'Isya',    label: 'Isya',    ar: 'العِشَاء',   emoji: '🌙' },
];

function AddDoaModal({ onClose, onAdd }) {
  const [ar, setAr] = useState(''); const [tr, setTr] = useState(''); const [note, setNote] = useState('');
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(0,0,0,.55)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 460, maxWidth: '90vw',
        background: 'var(--surface)',
        border: '1px solid var(--border-2)',
        borderRadius: 14,
        padding: 28,
        display: 'flex', flexDirection: 'column', gap: 12,
        boxShadow: '0 24px 80px rgba(0,0,0,.5)',
      }}>
        <h2 className="h2">Tambah Doa</h2>
        <input className="tinput" style={{ width: '100%', textAlign: 'right', fontFamily: 'var(--f-ar)', fontSize: 20, padding: '11px 14px' }}
          placeholder="نص الدعاء" value={ar} onChange={(e) => setAr(e.target.value)} />
        <input className="tinput" style={{ width: '100%', textAlign: 'left', fontFamily: 'var(--f-body)', fontWeight: 400, padding: '10px 14px' }}
          placeholder="Terjemahan Indonesia" value={tr} onChange={(e) => setTr(e.target.value)} />
        <input className="tinput" style={{ width: '100%', textAlign: 'left', fontFamily: 'var(--f-body)', fontWeight: 400, padding: '10px 14px' }}
          placeholder="Catatan / sumber (opsional)" value={note} onChange={(e) => setNote(e.target.value)} />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          <button className="btn ghost sm" onClick={onClose}>Batal</button>
          <button className="btn gold sm" onClick={() => { if (ar.trim()) onAdd({ cat: 'Syukur', ar, tr, src: note || 'Doa pribadi' }); onClose(); }}>Simpan</button>
        </div>
      </div>
    </div>
  );
}

function DoaDetailDrawer({ doa, bookmarked, onToggleBookmark, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 280);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: visible ? 'blur(2px)' : 'none',
          zIndex: 50,
          opacity: visible ? 1 : 0,
          transition: 'opacity .28s ease',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(520px, 100vw)',
        background: 'var(--bg)',
        zIndex: 51,
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,.2)',
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .28s cubic-bezier(.32,.72,0,1)',
        borderLeft: '1px solid var(--border)',
        borderTopLeftRadius: 16, borderBottomLeftRadius: 16,
        overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{
          background: 'var(--surface)', borderBottom: '1px solid var(--border)',
          padding: '14px 20px', display: 'flex', alignItems: 'center',
          gap: 12, flexShrink: 0,
        }}>
          <button onClick={handleClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-2)', display: 'flex', alignItems: 'center',
            gap: 6, fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 13, padding: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
            Tutup
          </button>
          <div style={{ flex: 1 }} />
          <button
            className={'bm' + (bookmarked ? ' on' : '')}
            onClick={onToggleBookmark}
            aria-label="Simpan"
          >
            {Icon.bookmark(bookmarked)}
          </button>
          {(doa.waktu || doa.cat) && (
            <span className="chip" style={{ fontSize: 10, pointerEvents: 'none' }}>
              {doa.waktu || doa.cat}
            </span>
          )}
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>

          {/* Hero: name + Arabic */}
          <div style={{
            background: 'var(--surface)', borderBottom: '1px solid var(--border)',
            padding: '28px 24px 24px',
          }}>
            {doa.name && (
              <div style={{
                fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 11,
                color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '.1em',
                marginBottom: 12,
              }}>
                {doa.name}
              </div>
            )}
            <div style={{
              fontFamily: 'var(--f-ar)', direction: 'rtl', textAlign: 'center',
              fontSize: 26, color: 'var(--gold)', lineHeight: 2.0,
              marginBottom: 0,
            }}>
              {doa.ar}
            </div>
          </div>

          <div style={{ padding: '20px 24px 80px', display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Terjemahan */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '16px 18px',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ height: 2, background: 'var(--gold)', marginBottom: 14, borderRadius: 1, width: 32 }} />
              <div style={{
                fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 10,
                color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.1em',
                marginBottom: 8,
              }}>Terjemahan</div>
              <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.85 }}>
                "{doa.tr}"
              </div>
            </div>

            {/* Faedah */}
            {doa.faedah && (
              <div style={{
                background: 'var(--elevated)', border: '1px solid var(--border)',
                borderLeft: '3px solid var(--gold)',
                borderRadius: 'var(--radius-sm)', padding: '13px 16px',
              }}>
                <div style={{
                  fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 10,
                  color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '.1em',
                  marginBottom: 6,
                }}>Faedah & Waktu Baca</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>
                  {doa.faedah}
                </div>
              </div>
            )}

            {/* Kisah di balik doa */}
            {doa.kisah && (
              <div style={{ marginTop: 14, padding: '14px 16px', background: 'var(--elevated)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--gold-line)' }}>
                <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 11, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>
                  📖 Kisah &amp; Latar Belakang
                </div>
                <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.85, margin: 0 }}>{doa.kisah}</p>
              </div>
            )}

            {/* Sumber */}
            {doa.src && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', padding: '12px 16px',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold)', flexShrink: 0 }}>
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                <span style={{
                  fontFamily: 'var(--f-head)', fontWeight: 600,
                  fontSize: 12, color: 'var(--text-2)',
                }}>{doa.src}</span>
              </div>
            )}

            {/* Close button */}
            <button className="btn gold" style={{ width: '100%', padding: 13, marginTop: 4 }} onClick={handleClose}>
              Kembali ke Bank Doa
            </button>

          </div>
        </div>
      </div>
    </>
  );
}

// ── Doa Situasional data ──
const SITUASI = [
  { iconKey: 'galau',  label: 'Lagi galau',     cat: 'Galau',          keywords: ['galau', 'sedih', 'gundah', 'resah', 'khawatir', 'stress'] },
  { iconKey: 'ujian',  label: 'Mau ujian',       cat: 'Ujian',          keywords: ['ujian', 'test', 'belajar', 'hafal', 'presentasi'] },
  { iconKey: 'rezeki', label: 'Butuh rezeki',    cat: 'Rezeki',         keywords: ['rezeki', 'uang', 'kerja', 'hutang', 'bisnis'] },
  { iconKey: 'sakit',  label: 'Lagi sakit',      cat: 'Sakit',          keywords: ['sakit', 'demam', 'sembuh', 'sehat', 'obat'] },
  { iconKey: 'safar',  label: 'Mau bepergian',   cat: 'Safar',          keywords: ['pergi', 'safar', 'perjalanan', 'mudik', 'travel'] },
  { iconKey: 'syukur', label: 'Mau bersyukur',   cat: 'Syukur',         keywords: ['syukur', 'senang', 'bahagia', 'nikmat', 'alhamdulillah'] },
  { iconKey: 'sholat', label: 'Setelah sholat',  cat: 'Per Waktu Solat', keywords: ['sholat', 'dzikir', 'setelah sholat'] },
  { iconKey: 'tidur',  label: 'Mau tidur',       cat: 'Per Waktu Solat', keywords: ['tidur', 'malam', 'istirahat', 'mimpi'] },
];

function SituasiIcon({ iconKey, size = 22, color = 'currentColor' }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (iconKey) {
    case 'galau': return (
      <svg {...p}>
        <circle cx="12" cy="12" r="9"/>
        <path d="M9 16c.85-1 4.15-1 6 0"/>
        <circle cx="9.5" cy="10.5" r=".8" fill={color} stroke="none"/>
        <circle cx="14.5" cy="10.5" r=".8" fill={color} stroke="none"/>
      </svg>
    );
    case 'ujian': return (
      <svg {...p}>
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
        <path d="M8 7h8M8 11h5"/>
      </svg>
    );
    case 'rezeki': return (
      <svg {...p}>
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 8v1m0 6v1"/>
        <path d="M10 11a2 2 0 012-2h.5a1.5 1.5 0 010 3h-1a1.5 1.5 0 000 3H12a2 2 0 002-2"/>
      </svg>
    );
    case 'sakit': return (
      <svg {...p}>
        <rect x="8" y="3" width="8" height="18" rx="2"/>
        <rect x="3" y="8" width="18" height="8" rx="2"/>
      </svg>
    );
    case 'safar': return (
      <svg {...p}>
        <path d="M22 2L11 13"/>
        <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
      </svg>
    );
    case 'syukur': return (
      <svg {...p}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    );
    case 'sholat': return (
      <svg {...p}>
        <path d="M3 21h18"/>
        <path d="M6 21V12"/>
        <path d="M18 21V12"/>
        <path d="M6 12C6 8.13 8.69 5 12 5s6 3.13 6 7"/>
        <path d="M12 5V3"/>
        <path d="M10.5 3h3"/>
      </svg>
    );
    case 'tidur': return (
      <svg {...p}>
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
      </svg>
    );
    default: return (
      <svg {...p}><circle cx="12" cy="12" r="9"/></svg>
    );
  }
}

function matchSituasi(text, doa) {
  const t = text.toLowerCase();
  const matched = SITUASI.find(s =>
    s.keywords.some(k => t.includes(k)) || t.includes(s.cat.toLowerCase())
  );
  if (!matched) return false;
  return doa.cat === matched.cat || (matched.cat === 'Per Waktu Solat' && doa.waktu);
}

// ── Komponen DoaSituasional ──
function DoaSituasional({ allDoa, onSelect, codeId }) {
  const [mode, setMode]       = useState('idle');
  const [text, setText]       = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chosen, setChosen]   = useState(null);

  const handleQuick = (situasi) => {
    const filtered = allDoa.filter(d => d.cat === situasi.cat);
    setResults(filtered.slice(0, 4));
    setChosen(situasi);
    setMode('result');
  };

  const handleSearch = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setMode('result');

    const local = allDoa.filter(d => matchSituasi(text, d));
    if (local.length >= 2) {
      setResults(local.slice(0, 4));
      setLoading(false);
      return;
    }

    try {
      const token = sessionStorage.getItem('dm-token');
      const res = await fetch('/api/ai/doa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-token': token },
        body: JSON.stringify({ situasi: text }),
      });

      if (res.status === 429) {
        const d = await res.json();
        setResults([]);
        setLoading(false);
        alert(d.message);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setResults((data.doas || []).map(d => ({
          name: d.name,
          ar: d.ar,
          tr: d.arti,
          src: d.sumber,
          faedah: d.alasan,
          cat: 'Situasional',
        })));
      } else {
        setResults(allDoa.slice(0, 4));
      }
    } catch {
      setResults(allDoa.slice(0, 4));
    }
    setLoading(false);
  };

  const reset = () => { setMode('idle'); setText(''); setResults([]); setChosen(null); };

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 16,
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, color-mix(in srgb, var(--gold) 10%, var(--elevated)), var(--elevated))',
        borderBottom: '1px solid var(--border)', padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 11V9a2 2 0 00-4 0v2"/>
          <path d="M14 10V8a2 2 0 00-4 0v3"/>
          <path d="M10 10.5V5a2 2 0 00-4 0v9"/>
          <path d="M18 11a2 2 0 114 0v1a8 8 0 01-8 8h-2c-2.76 0-4.5-.88-5.4-2.1L6 17"/>
        </svg>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>
            Aku lagi...
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>
            Ceritakan situasimu, kami carikan doanya
          </div>
        </div>
        {mode !== 'idle' && (
          <button onClick={reset} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-3)', fontFamily: 'var(--f-head)', fontSize: 12,
            padding: '4px 8px',
          }}>← Kembali</button>
        )}
      </div>

      {/* IDLE — pilihan cepat */}
      {mode === 'idle' && (
        <div style={{ padding: '14px 18px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
            marginBottom: 12,
          }}>
            {SITUASI.map(s => (
              <button
                key={s.cat + s.label}
                onClick={() => handleQuick(s)}
                style={{
                  background: 'var(--elevated)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '10px 6px',
                  cursor: 'pointer', textAlign: 'center',
                  transition: 'border-color .15s, transform .12s',
                  fontFamily: 'var(--f-head)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold-line)'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <div style={{ marginBottom: 6, color: 'var(--gold)', display: 'flex', justifyContent: 'center' }}>
                  <SituasiIcon iconKey={s.iconKey} size={22} />
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-2)', lineHeight: 1.3, fontWeight: 600 }}>
                  {s.label}
                </div>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="tinput"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Atau ceritakan situasimu..."
              style={{
                flex: 1, background: 'var(--elevated)',
                border: '1px solid var(--border)', color: 'var(--text)',
                fontSize: 13,
              }}
            />
            <button
              onClick={handleSearch}
              className="btn gold"
              style={{ padding: '0 16px', fontSize: 13, flexShrink: 0 }}
            >
              Cari
            </button>
          </div>
        </div>
      )}

      {/* RESULT */}
      {mode === 'result' && (
        <div style={{ padding: '12px 18px' }}>
          {chosen && (
            <div style={{
              fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 11,
              color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '.1em',
              marginBottom: 10,
            }}>
              {chosen.emoji} Doa untuk "{chosen.label}"
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-3)', fontSize: 13 }}>
              🔍 Mencarikan doa terbaik...
            </div>
          ) : results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-3)', fontSize: 13 }}>
              Tidak ditemukan. Coba kata lain.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {results.map((doa, i) => (
                <div
                  key={i}
                  onClick={() => onSelect(doa)}
                  style={{
                    background: 'var(--elevated)', border: '1px solid var(--border)',
                    borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
                    transition: 'border-color .15s',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold-line)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {doa.name && (
                      <div style={{
                        fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 12,
                        color: 'var(--text)', marginBottom: 3,
                      }}>{doa.name}</div>
                    )}
                    <div style={{
                      fontFamily: 'var(--f-ar)', direction: 'rtl', fontSize: 15,
                      color: 'var(--gold)', lineHeight: 1.6,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{doa.ar}</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-3)', flexShrink: 0 }}>
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DoaListCard({ doa, bookmarked, onToggleBookmark, onSelect }) {
  return (
    <div
      onClick={onSelect}
      style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '14px 16px',
        cursor: 'pointer', transition: 'border-color .15s, transform .1s',
        display: 'flex', alignItems: 'center', gap: 14,
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold-line)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {doa.name && (
          <div style={{
            fontFamily: 'var(--f-head)', fontWeight: 700,
            fontSize: 13, color: 'var(--text)', marginBottom: 4,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {doa.name}
          </div>
        )}
        <div style={{
          fontFamily: 'var(--f-ar)', direction: 'rtl',
          fontSize: 17, color: 'var(--gold)', lineHeight: 1.6,
          overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
          marginBottom: 4,
        }}>
          {doa.ar}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--f-head)', fontSize: 10, color: 'var(--text-3)', fontWeight: 500 }}>
            {doa.src}
          </span>
          {(doa.waktu || doa.cat) && (
            <>
              <span style={{ color: 'var(--border-2)', fontSize: 10 }}>·</span>
              <span className="chip" style={{ padding: '1px 8px', fontSize: 10, pointerEvents: 'none' }}>
                {doa.waktu || doa.cat}
              </span>
            </>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <button
          className={'bm' + (bookmarked ? ' on' : '')}
          onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }}
          aria-label="Simpan"
          style={{ padding: 4 }}
        >
          {Icon.bookmark(bookmarked)}
        </button>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: 'var(--text-3)', flexShrink: 0 }}>
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </div>
    </div>
  );
}

export function BankDoaPage({ bookmarks, toggleBookmark, userDoa, addDoa, codeId }) {
  const [tab, setTab]               = useState('Semua');
  const [waktuFilter, setWaktuFilter] = useState('Semua');
  const [modal, setModal]           = useState(false);
  const [selected, setSelected]     = useState(null);

  const all = [...userDoa, ...DOA];

  const byTab = all.filter((d) => tab === 'Semua' || d.cat === tab);

  const list = (tab === 'Per Waktu Solat' && waktuFilter !== 'Semua')
    ? byTab.filter(d => d.waktu === waktuFilter)
    : byTab;

  const showGrouped = tab === 'Per Waktu Solat' && waktuFilter === 'Semua';
  const grouped = showGrouped
    ? WAKTU_SOLAT_LIST.filter(w => w.key !== 'Semua').map(w => ({
        ...w,
        items: list.filter(d => d.waktu === w.key),
      })).filter(g => g.items.length > 0)
    : null;

  const handleTabChange = (t) => {
    setTab(t);
    setWaktuFilter('Semua');
  };

  return (
    <div className="main fade-in">
      <div className="content scrl" style={{ position: 'relative' }}>

        {/* Header */}
        <div style={{ marginBottom: 16 }}>
          <h1 className="h1">Bank Doa</h1>
          <div style={{ marginTop: 4, fontSize: 13, color: 'var(--text-3)' }}>
            {all.length} doa tersimpan · sumber terverifikasi
          </div>
        </div>

        {/* Doa Situasional */}
        <DoaSituasional allDoa={all} onSelect={(doa) => setSelected(doa)} codeId={codeId} />

        {/* Tabs utama */}
        <div className="tabs scrl" style={{ marginBottom: tab === 'Per Waktu Solat' ? 10 : 20 }}>
          {DOA_TABS.map((t) => (
            <button key={t} className={'tab' + (tab === t ? ' on' : '')} onClick={() => handleTabChange(t)}>
              {t}
            </button>
          ))}
        </div>

        {/* Sub-filter waktu — hanya tampil kalau tab Per Waktu Solat */}
        {tab === 'Per Waktu Solat' && (
          <div className="tabs scrl" style={{ marginBottom: 20, gap: 6 }}>
            {WAKTU_SOLAT_LIST.map(({ key, label, emoji }) => (
              <button
                key={key}
                onClick={() => setWaktuFilter(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 14px', borderRadius: 20,
                  border: `1.5px solid ${waktuFilter === key ? 'var(--gold)' : 'var(--border-2)'}`,
                  background: waktuFilter === key ? 'var(--gold-soft)' : 'transparent',
                  fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 12,
                  color: waktuFilter === key ? 'var(--gold)' : 'var(--text-3)',
                  cursor: 'pointer', flexShrink: 0,
                  transition: 'all .15s ease',
                }}
              >
                <span style={{ fontSize: 13 }}>{emoji}</span>
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Doa list */}
        {showGrouped ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {grouped.map(({ key, label, ar, emoji, items }) => (
              <div key={key}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  marginBottom: 10, paddingBottom: 8,
                  borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontSize: 18 }}>{emoji}</span>
                  <div>
                    <div style={{
                      fontFamily: 'var(--f-head)', fontWeight: 800,
                      fontSize: 15, color: 'var(--text)', lineHeight: 1,
                    }}>{label}</div>
                    {ar && (
                      <div style={{
                        fontFamily: 'var(--f-ar)', fontSize: 13,
                        color: 'var(--gold)', direction: 'rtl', marginTop: 2, opacity: .8,
                      }}>{ar}</div>
                    )}
                  </div>
                  <span style={{
                    marginLeft: 'auto', fontFamily: 'var(--f-head)', fontWeight: 600,
                    fontSize: 11, color: 'var(--text-3)',
                  }}>
                    {items.length} doa
                  </span>
                </div>
                <div className="dm-stagger" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {items.map((d, idx) => (
                    <DoaListCard
                      key={d.ar + idx}
                      doa={d}
                      bookmarked={!!bookmarks[d.ar + (d.src || '')]}
                      onToggleBookmark={() => toggleBookmark(d.ar + (d.src || ''))}
                      onSelect={() => setSelected(d)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dm-stagger" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {list.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '40px 0',
                color: 'var(--text-3)', fontFamily: 'var(--f-head)', fontSize: 13,
              }}>
                Belum ada doa untuk waktu ini
              </div>
            ) : list.map((d, idx) => (
              <DoaListCard
                key={d.ar + idx}
                doa={d}
                bookmarked={!!bookmarks[d.ar + (d.src || '')]}
                onToggleBookmark={() => toggleBookmark(d.ar + (d.src || ''))}
                onSelect={() => setSelected(d)}
              />
            ))}
          </div>
        )}

        <button className="fab" onClick={() => setModal(true)} aria-label="Tambah Doa">+</button>
      </div>

      {selected && (
        <DoaDetailDrawer
          doa={selected}
          bookmarked={!!bookmarks[selected.ar + (selected.src || '')]}
          onToggleBookmark={() => toggleBookmark(selected.ar + (selected.src || ''))}
          onClose={() => setSelected(null)}
        />
      )}

      {modal && <AddDoaModal onClose={() => setModal(false)} onAdd={addDoa} />}
    </div>
  );
}

// ─── QADHA TRACKER ────────────────────────────────────────
const PRAYER_LABELS = [
  { k: 'subuh',   label: 'Subuh',   ar: 'الفَجْر',   icon: '🌅' },
  { k: 'dzuhur',  label: 'Dzuhur',  ar: 'الظُّهْر',  icon: '☀️' },
  { k: 'ashar',   label: 'Ashar',   ar: 'العَصْر',   icon: '🌤️' },
  { k: 'maghrib', label: 'Maghrib', ar: 'المَغْرِب',  icon: '🌆' },
  { k: 'isya',    label: 'Isya',    ar: 'العِشَاء',  icon: '🌙' },
];

function QadhaTracker({ qadhaDebt, addQadha, lunasiQadha, totalQadha }) {
  const [addMode,   setAddMode]   = useState(false);
  const [amounts,   setAmounts]   = useState({});
  const [lunasing,  setLunasing]  = useState(null);

  const handleLunasi = (k) => {
    if (!qadhaDebt[k] || qadhaDebt[k] <= 0) return;
    setLunasing(k);
    setTimeout(() => setLunasing(null), 400);
    lunasiQadha(k);
    if (navigator.vibrate) navigator.vibrate(12);
  };

  const handleAdd = () => {
    Object.entries(amounts).forEach(([k, v]) => {
      const n = parseInt(v);
      if (n > 0) addQadha(k, n);
    });
    setAmounts({});
    setAddMode(false);
  };

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 16,
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--elevated)', borderBottom: '1px solid var(--border)',
        padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: 'color-mix(in srgb, #bc4749 15%, transparent)',
          border: '1px solid color-mix(in srgb, #bc4749 30%, transparent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0,
        }}>📋</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>
            Qadha Tracker
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>
            {totalQadha > 0 ? `${totalQadha} solat belum dilunasi` : 'Tidak ada hutang solat 🤲'}
          </div>
        </div>
        <button
          onClick={() => setAddMode(m => !m)}
          style={{
            background: addMode ? 'var(--gold-soft)' : 'var(--elevated-2)',
            border: '1px solid var(--border-2)',
            borderRadius: 8, padding: '6px 12px',
            fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 12,
            color: 'var(--gold)', cursor: 'pointer',
          }}
        >
          {addMode ? 'Batal' : '+ Catat'}
        </button>
      </div>

      {/* Add mode */}
      {addMode && (
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', background: 'var(--elevated)' }}>
          <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>
            Berapa hutang tiap waktu?
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
            {PRAYER_LABELS.map(({ k, label }) => (
              <div key={k} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--f-head)', fontSize: 10, color: 'var(--text-2)', marginBottom: 4 }}>{label}</div>
                <input
                  type="number" min="0" max="999"
                  value={amounts[k] || ''}
                  onChange={e => setAmounts(a => ({ ...a, [k]: e.target.value }))}
                  placeholder="0"
                  style={{
                    width: '100%', background: 'var(--surface)',
                    border: '1px solid var(--border-2)', borderRadius: 6,
                    padding: '6px 4px', textAlign: 'center',
                    fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 14,
                    color: 'var(--text)',
                  }}
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleAdd}
            className="btn gold"
            style={{ width: '100%', marginTop: 12, padding: '10px 0', fontSize: 13 }}
          >
            Simpan Hutang
          </button>
        </div>
      )}

      {/* Prayer list */}
      <div style={{ padding: '10px 18px 14px' }}>
        {totalQadha === 0 && !addMode ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-3)', fontSize: 13, fontFamily: 'var(--f-head)' }}>
            ✅ Alhamdulillah, tidak ada hutang solat
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PRAYER_LABELS.map(({ k, label, ar, icon }) => {
              const debt = qadhaDebt[k] || 0;
              const isAnimating = lunasing === k;
              return (
                <div key={k} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px',
                  background: debt > 0 ? 'color-mix(in srgb, #bc4749 5%, var(--surface))' : 'var(--elevated)',
                  border: `1px solid ${debt > 0 ? 'color-mix(in srgb, #bc4749 20%, transparent)' : 'var(--border)'}`,
                  borderRadius: 10,
                  transition: 'all .2s ease',
                  opacity: isAnimating ? .5 : 1,
                  transform: isAnimating ? 'scale(.97)' : 'scale(1)',
                }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{label}</div>
                    <div style={{ fontFamily: 'var(--f-ar)', fontSize: 12, color: 'var(--gold)', opacity: .7 }}>{ar}</div>
                  </div>
                  {debt > 0 ? (
                    <>
                      <div style={{
                        fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 22,
                        color: '#bc4749', minWidth: 36, textAlign: 'center', lineHeight: 1,
                      }}>{debt}</div>
                      <button
                        onClick={() => handleLunasi(k)}
                        style={{
                          background: 'color-mix(in srgb, var(--gold) 15%, transparent)',
                          border: '1.5px solid var(--gold-line)',
                          borderRadius: 8, padding: '7px 12px',
                          fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 12,
                          color: 'var(--gold)', cursor: 'pointer', flexShrink: 0,
                          transition: 'transform .1s',
                        }}
                        onPointerDown={e => e.currentTarget.style.transform = 'scale(.93)'}
                        onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        Lunasi ✓
                      </button>
                    </>
                  ) : (
                    <div style={{
                      fontFamily: 'var(--f-head)', fontSize: 11, color: 'var(--gold)',
                      background: 'var(--gold-soft)', border: '1px solid var(--gold-line)',
                      borderRadius: 6, padding: '4px 10px',
                    }}>Lunas ✓</div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {totalQadha > 0 && (
          <div style={{
            marginTop: 12, padding: '10px 14px',
            background: 'color-mix(in srgb, var(--gold) 8%, transparent)',
            border: '1px solid var(--gold-line)', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 12, color: 'var(--text-2)' }}>
              Total sisa hutang
            </span>
            <span style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 18, color: 'var(--gold)' }}>
              {totalQadha} waktu
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── STATISTIK ────────────────────────────────────────────
export function StatistikPage({ streak, freeze, useFreeze, prayers, times, sunnah, misiDone, amalanDone, setAmalanDone, qadhaDebt, addQadha, lunasiQadha, totalQadha }) {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState('harian');
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  // ── Rekap sholat dari prayers state (satu source of truth dengan Dashboard) ──
  const PRAYER_LABELS = {
    tahajud: 'Tahajud', subuh: 'Subuh', dzuhur: 'Dzuhur',
    ashar: 'Ashar', maghrib: 'Maghrib', isya: 'Isya',
  };
  const qadhaList = Object.entries(prayers || {})
    .filter(([_, status]) => status === 'qadha')
    .map(([k]) => ({ key: k, label: PRAYER_LABELS[k] || k, time: times?.[k] || null }));
  const tepat = Object.values(prayers || {}).filter(s => s === 'ok').length;
  const telat = Object.values(prayers || {}).filter(s => s === 'late').length;
  const qadha = Object.values(prayers || {}).filter(s => s === 'qadha').length;
  const totalSholat = tepat + telat + qadha;

  const maxPoints = calcMaxPoints();
  const { points: todayPoints, breakdown } = calcDailyPoints({ prayers: prayers || {}, sunnah: sunnah || {}, misiDone: misiDone || {}, amalanDone: amalanDone || {} });
  const todayPct = Math.round((todayPoints / maxPoints) * 100);
  const grade = getGrade(todayPct);
  // Checklist items
  const CHECKLIST = [
    { id: 'subuh-tepat',    label: 'Subuh tepat waktu',    points: IBADAH_POINTS.sholat_tepat,   category: 'wajib',  done: prayers?.subuh === 'ok' },
    { id: 'dzuhur-tepat',   label: 'Dzuhur tepat waktu',   points: IBADAH_POINTS.sholat_tepat,   category: 'wajib',  done: prayers?.dzuhur === 'ok' },
    { id: 'ashar-tepat',    label: 'Ashar tepat waktu',    points: IBADAH_POINTS.sholat_tepat,   category: 'wajib',  done: prayers?.ashar === 'ok' },
    { id: 'maghrib-tepat',  label: 'Maghrib tepat waktu',  points: IBADAH_POINTS.sholat_tepat,   category: 'wajib',  done: prayers?.maghrib === 'ok' },
    { id: 'isya-tepat',     label: 'Isya tepat waktu',     points: IBADAH_POINTS.sholat_tepat,   category: 'wajib',  done: prayers?.isya === 'ok' },
    { id: 'sunnah-dhuha',   label: 'Sholat Dhuha',         points: IBADAH_POINTS.sunnah_dhuha,   category: 'sunnah', done: !!(sunnah?.['Dhuha'] || amalanDone?.['sholat-dhuha']) },
    { id: 'sunnah-tahajud', label: 'Sholat Tahajud',       points: IBADAH_POINTS.sunnah_tahajud, category: 'sunnah', done: !!(sunnah?.['Tahajud'] || amalanDone?.['sholat-tahajud']) },
    { id: 'sunnah-witir',   label: 'Sholat Witir',         points: IBADAH_POINTS.sunnah_witir,   category: 'sunnah', done: !!(sunnah?.['Witir'] || amalanDone?.['sholat-witir']) },
    { id: 'rawatib-subuh',  label: 'Rawatib Subuh',        points: IBADAH_POINTS.sunnah_rawatib, category: 'sunnah', done: !!sunnah?.['Rawatib Subuh'] },
    { id: 'rawatib-dzuhur', label: 'Rawatib Dzuhur',       points: IBADAH_POINTS.sunnah_rawatib, category: 'sunnah', done: !!sunnah?.['Rawatib Dzuhur'] },
    { id: 'rawatib-maghrib',label: 'Rawatib Maghrib',      points: IBADAH_POINTS.sunnah_rawatib, category: 'sunnah', done: !!sunnah?.['Rawatib Maghrib'] },
    { id: 'dzikir-pagi',    label: 'Dzikir Pagi',          points: IBADAH_POINTS.amalan_dzikir,  category: 'amalan', done: !!amalanDone?.['dzikir-pagi'] },
    { id: 'dzikir-petang',  label: 'Dzikir Petang',        points: IBADAH_POINTS.amalan_dzikir,  category: 'amalan', done: !!amalanDone?.['dzikir-petang'] },
    { id: 'shalawat-100',   label: 'Shalawat 100×',        points: IBADAH_POINTS.amalan_dzikir,  category: 'amalan', done: !!amalanDone?.['shalawat-100'] },
    { id: 'istighfar-100',  label: 'Istighfar 100×',       points: IBADAH_POINTS.amalan_dzikir,  category: 'amalan', done: !!amalanDone?.['istighfar-100'] },
    { id: 'baca-quran',     label: 'Tilawah Al-Quran',     points: IBADAH_POINTS.amalan_quran,   category: 'amalan', done: !!amalanDone?.['baca-quran'] },
    { id: 'puasa',          label: 'Puasa Senin/Kamis',    points: IBADAH_POINTS.amalan_puasa,   category: 'amalan', done: !!amalanDone?.['puasa-senin-kamis'] },
    { id: 'sedekah',        label: 'Sedekah Harian',       points: IBADAH_POINTS.amalan_sedekah, category: 'amalan', done: !!amalanDone?.['sedekah-harian'] },
  ];

  const CATEGORY_COLORS = { wajib: 'var(--gold)', sunnah: '#22b578', amalan: '#8b8bff' };

  const WEEK = [0.82, 0.64, 1, 0.9, 0.42, 1, todayPct / 100];
  const WDAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  const categoryBreakdown = {
    wajib:  { done: CHECKLIST.filter(c => c.category === 'wajib' && c.done).length,  total: CHECKLIST.filter(c => c.category === 'wajib').length },
    sunnah: { done: CHECKLIST.filter(c => c.category === 'sunnah' && c.done).length, total: CHECKLIST.filter(c => c.category === 'sunnah').length },
    amalan: { done: CHECKLIST.filter(c => c.category === 'amalan' && c.done).length, total: CHECKLIST.filter(c => c.category === 'amalan').length },
  };

  const bestCategory = Object.entries(categoryBreakdown).sort((a,b) => (b[1].done/b[1].total) - (a[1].done/a[1].total))[0];
  const weakCategory = Object.entries(categoryBreakdown).sort((a,b) => (a[1].done/a[1].total) - (b[1].done/b[1].total))[0];

  const HEATC = { full: 'var(--ok)', part: 'var(--warn)', empty: 'var(--danger)', none: 'var(--border)' };
  const MONTH_DATA = Array(35).fill('none');

  return (
    <div className="main fade-in">
      <div className="content scrl">
        <h1 className="h1" style={{ marginBottom: 6 }}>Statistik &amp; Laporan</h1>
        <div className="muted tiny" style={{ marginBottom: 20 }}>Rekap kualitas ibadah harian &amp; mingguan</div>

        {/* Tab */}
        <div className="tabs scrl" style={{ marginBottom: 24 }}>
          {['harian', 'mingguan'].map(t => (
            <button key={t} className={'tab' + (tab === t ? ' on' : '')} onClick={() => setTab(t)}>
              {t === 'harian' ? 'Laporan Harian' : 'Laporan Mingguan'}
            </button>
          ))}
        </div>

        {tab === 'harian' && (
          <>
            {/* Grade card */}
            <div className="card" style={{ padding: 24, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 56, color: grade.color, lineHeight: 1, letterSpacing: '-.02em' }}>{grade.grade}</div>
                <div style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>{grade.label}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="eyebrow" style={{ marginBottom: 8 }}>Kualitas Ibadah Hari Ini</div>
                <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 10 }}>{grade.desc}</div>
                <div style={{ background: 'var(--border)', borderRadius: 999, height: 8, marginBottom: 6 }}>
                  <div style={{ width: mounted ? todayPct + '%' : '0%', height: '100%', borderRadius: 999, background: grade.color, transition: 'width .8s cubic-bezier(.2,.8,.25,1)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="muted tiny">{todayPoints} poin</span>
                  <span className="muted tiny">{todayPct}% dari {maxPoints} poin max</span>
                </div>
              </div>
            </div>

            {/* ── REKAP SHOLAT ── */}
            <div style={{ marginBottom: 16 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Rekap Sholat Hari Ini</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
                {[
                  { label: 'Tepat Waktu', val: tepat, color: 'var(--ok)' },
                  { label: 'Telat', val: telat, color: 'var(--warn)' },
                  { label: 'Qadha', val: qadha, color: 'var(--danger)' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="card" style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 28, color, lineHeight: 1, letterSpacing: '-.02em' }}>{val}</div>
                    <div className="muted tiny" style={{ marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>

              {qadhaList.length > 0 && (
                <div style={{ background: 'var(--surface)', border: '1px solid color-mix(in srgb, var(--danger) 30%, transparent)', borderLeft: '3px solid var(--danger)', borderRadius: 'var(--radius)', padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--danger)', flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                    </svg>
                    <span style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 13, color: 'var(--danger)' }}>
                      {qadhaList.length} sholat perlu diqadha
                    </span>
                  </div>
                  {qadhaList.map((q, i) => (
                    <div key={q.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < qadhaList.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)', flexShrink: 0 }} />
                        <span style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{q.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {q.time && <span className="muted tiny">Dicatat {q.time}</span>}
                        <span style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 11, color: 'var(--danger)', background: 'color-mix(in srgb, var(--danger) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--danger) 25%, transparent)', borderRadius: 999, padding: '2px 8px' }}>
                          Qadha
                        </span>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: 12 }}>
                    <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>
                      Segera qadha sholat yang terlewat. Qadha dilakukan sesuai jumlah rakaat aslinya, tidak perlu mengganti waktu yang sama.
                    </p>
                  </div>
                </div>
              )}

              {totalSholat >= 5 && qadhaList.length === 0 && (
                <div style={{ background: 'var(--surface)', border: '1px solid color-mix(in srgb, var(--ok) 30%, transparent)', borderLeft: '3px solid var(--ok)', borderRadius: 'var(--radius)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ok)', flexShrink: 0 }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <path d="M22 4L12 14.01l-3-3"/>
                  </svg>
                  <span style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 13, color: 'var(--ok)' }}>
                    MasyaAllah! Semua sholat hari ini terjaga ✓
                  </span>
                </div>
              )}
            </div>

            {/* Qadha Tracker */}
            <QadhaTracker
              qadhaDebt={qadhaDebt}
              addQadha={addQadha}
              lunasiQadha={lunasiQadha}
              totalQadha={totalQadha}
            />

            {/* Breakdown per kategori */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
              {[
                { key: 'wajib', label: 'Sholat Wajib',  points: breakdown.wajib,  color: CATEGORY_COLORS.wajib },
                { key: 'sunnah', label: 'Sholat Sunnah', points: breakdown.sunnah, color: CATEGORY_COLORS.sunnah },
                { key: 'misi',  label: 'Misi Amalan',   points: breakdown.misi,   color: CATEGORY_COLORS.amalan },
              ].map(({ key, label, points: p, color }) => (
                <div key={key} className="card" style={{ padding: 14, textAlign: 'center' }}>
                  <div className="eyebrow" style={{ fontSize: 10, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 28, color, lineHeight: 1 }}>{p}</div>
                  <div className="muted tiny">poin</div>
                </div>
              ))}
            </div>

            {/* Best & Weakest */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              <div className="card" style={{ padding: 14, borderLeft: '3px solid var(--ok)' }}>
                <div className="eyebrow" style={{ fontSize: 10, color: 'var(--ok)', marginBottom: 4 }}>⭐ Terbaik Hari Ini</div>
                <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 14, color: 'var(--text)', textTransform: 'capitalize' }}>{bestCategory[0]}</div>
                <div className="muted tiny">{bestCategory[1].done}/{bestCategory[1].total} selesai</div>
              </div>
              <div className="card" style={{ padding: 14, borderLeft: '3px solid var(--warn)' }}>
                <div className="eyebrow" style={{ fontSize: 10, color: 'var(--warn)', marginBottom: 4 }}>⚠️ Perlu Ditingkatkan</div>
                <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 14, color: 'var(--text)', textTransform: 'capitalize' }}>{weakCategory[0]}</div>
                <div className="muted tiny">{weakCategory[1].done}/{weakCategory[1].total} selesai</div>
              </div>
            </div>

            {/* Full checklist — redesigned */}
            <div style={{ marginBottom: 8 }}>
              {/* Section header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 14, color: 'var(--text)', letterSpacing: '-.01em' }}>
                  Checklist Ibadah Hari Ini
                </div>
                <div style={{ fontFamily: 'var(--f-head)', fontSize: 11, color: 'var(--text-3)' }}>
                  {CHECKLIST.filter(c => c.done).length}/{CHECKLIST.length} selesai
                </div>
              </div>

              {['wajib', 'sunnah', 'amalan'].map(cat => {
                const items   = CHECKLIST.filter(c => c.category === cat);
                const doneCnt = items.filter(c => c.done).length;
                const pct     = items.length ? Math.round((doneCnt / items.length) * 100) : 0;
                const color   = CATEGORY_COLORS[cat];
                const catLabel = cat === 'wajib' ? 'Sholat Wajib' : cat === 'sunnah' ? 'Sholat Sunnah' : 'Amalan Harian';

                return (
                  <div key={cat} style={{ marginBottom: 14 }}>
                    <div style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      overflow: 'hidden',
                    }}>
                      {/* Category header row */}
                      <div style={{
                        padding: '11px 16px 9px',
                        display: 'flex', alignItems: 'center', gap: 10,
                      }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
                        <span style={{
                          flex: 1,
                          fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 10,
                          color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '.12em',
                        }}>
                          {catLabel}
                        </span>
                        <span style={{
                          fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 11, color,
                        }}>
                          {doneCnt}/{items.length}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div style={{ height: 2, background: 'var(--border)' }}>
                        <div style={{
                          height: '100%', background: color,
                          width: mounted ? pct + '%' : '0%',
                          transition: 'width .7s cubic-bezier(.2,.8,.25,1)',
                        }} />
                      </div>

                      {/* Items */}
                      {items.map((item, idx) => (
                        <div
                          key={item.id}
                          onClick={() => { if (cat === 'amalan') setAmalanDone(prev => ({ ...prev, [item.id]: !prev[item.id] })); }}
                          style={{
                            padding: '11px 16px',
                            display: 'flex', alignItems: 'center', gap: 12,
                            borderTop: '1px solid var(--border)',
                            background: item.done ? `color-mix(in srgb, ${color} 7%, transparent)` : 'transparent',
                            cursor: cat === 'amalan' ? 'pointer' : 'default',
                            transition: 'background .2s',
                          }}
                        >
                          {/* Checkbox */}
                          <div style={{
                            width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                            border: `1.5px solid ${item.done ? color : 'var(--border-2)'}`,
                            background: item.done ? color : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all .18s',
                          }}>
                            {item.done && (
                              <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 7.4 5.7 10 11 4.2"/>
                              </svg>
                            )}
                          </div>

                          {/* Label */}
                          <span style={{
                            flex: 1,
                            fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 13,
                            color: item.done ? 'var(--text-3)' : 'var(--text)',
                            textDecoration: item.done ? 'line-through' : 'none',
                            transition: 'color .2s',
                          }}>
                            {item.label}
                          </span>

                          {/* Points badge */}
                          <div style={{
                            fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 11,
                            color: item.done ? color : 'var(--text-3)',
                            background: item.done ? `color-mix(in srgb, ${color} 15%, transparent)` : 'transparent',
                            border: `1px solid ${item.done ? `color-mix(in srgb, ${color} 30%, transparent)` : 'transparent'}`,
                            borderRadius: 999,
                            padding: '2px 9px',
                            transition: 'all .2s',
                          }}>
                            +{item.points}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === 'mingguan' && (
          <>
            {/* Weekly bar chart */}
            <div className="card" style={{ padding: 22, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span className="eyebrow">Skor Ibadah · 7 Hari Terakhir</span>
                <span className="muted tiny">Rata-rata: {Math.round(WEEK.reduce((a,b) => a+b,0) / WEEK.length * 100)}%</span>
              </div>
              <div className="bars" style={{ height: 160 }}>
                {WEEK.map((h, i) => {
                  const pct = Math.round(h * 100);
                  const g = getGrade(pct);
                  return (
                    <div key={i} className="barcol">
                      <span style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 11, color: g.color, marginBottom: 4 }}>{pct}%</span>
                      <div style={{ width: '100%', maxWidth: 34, borderRadius: '7px 7px 3px 3px', background: g.color, height: mounted ? (h * 100) + '%' : '0%', transition: `height .7s cubic-bezier(.2,.8,.3,1) ${i * 60}ms`, minHeight: 4 }} />
                      <span className="muted tiny">{WDAYS[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekly summary */}
            <div className="card" style={{ padding: 20, marginBottom: 16 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Ringkasan Minggu Ini</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {[
                  { label: 'Rata-rata Skor', value: Math.round(WEEK.reduce((a,b) => a+b,0) / WEEK.length * 100) + '%', color: 'var(--gold)' },
                  { label: 'Hari Terbaik',   value: WDAYS[WEEK.indexOf(Math.max(...WEEK))], color: 'var(--ok)' },
                  { label: 'Hari Terlemah',  value: WDAYS[WEEK.indexOf(Math.min(...WEEK))], color: 'var(--warn)' },
                  { label: 'Hari Lengkap',   value: WEEK.filter(h => h >= 0.85).length + ' hari', color: 'var(--text)' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="card" style={{ padding: 14, background: 'var(--elevated)' }}>
                    <div className="eyebrow" style={{ fontSize: 10, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 24, color, lineHeight: 1 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Heatmap */}
            <div className="card" style={{ padding: 22, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                <span className="eyebrow">Heatmap · Bulan Ini</span>
                <span className="muted tiny">0 hari lengkap</span>
              </div>
              <div className="heat">
                {MONTH_DATA.map((k, i) => (
                  <div key={i} className="hc" style={{ background: HEATC[k] }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
                {[['full','Lengkap (A/A+)'],['part','Sebagian (B/C)'],['empty','Minim (D/F)'],['none','Belum ada data']].map(([k,l]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: HEATC[k], border: k === 'none' ? '1px solid var(--border)' : 0 }} />
                    <span className="muted tiny">{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Streak */}
            <div className="streak" style={{ marginBottom: 16 }}>

              {/* Top accent bar */}
              <div style={{
                height: 3,
                background: 'linear-gradient(90deg, #6a994e, #a7c957, #6a994e)',
                flexShrink: 0,
              }} />

              {/* Content */}
              <div style={{ padding: '20px 22px 22px' }}>

                {/* Label */}
                <div style={{
                  fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 10,
                  letterSpacing: '.12em', textTransform: 'uppercase',
                  color: '#a7c957', marginBottom: 16,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2c0 6-6 8-6 14a6 6 0 0 0 12 0c0-6-6-8-6-14z"/>
                    <path d="M12 12c0 3-2 4-2 7a2 2 0 0 0 4 0c0-3-2-4-2-7z" fill="currentColor" opacity=".4"/>
                  </svg>
                  Streak Saat Ini
                </div>

                {/* Big number + label row */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 6 }}>
                  <span className="bignum">{streak}</span>
                  <span style={{
                    fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 22,
                    color: 'rgba(255,255,255,0.6)', marginBottom: 8, lineHeight: 1,
                  }}>hari</span>
                </div>

                {/* Subtitle */}
                <div style={{
                  fontSize: 12, color: 'rgba(255,255,255,0.45)',
                  fontFamily: 'var(--f-head)', marginBottom: 20,
                }}>
                  Terpanjang · {streak} hari
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 16 }} />

                {/* Freeze button */}
                <button
                  onClick={useFreeze}
                  disabled={freeze === 0}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 8, padding: '9px 14px',
                    cursor: freeze > 0 ? 'pointer' : 'not-allowed',
                    fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 12,
                    color: freeze > 0 ? '#a7c957' : 'rgba(255,255,255,0.3)',
                    transition: 'background .15s, border-color .15s',
                    opacity: freeze === 0 ? .5 : 1,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M20 16l-4-4 4-4M4 8l4 4-4 4M16 4l-4 4-4-4M8 20l4-4 4 4"/>
                  </svg>
                  <span>{freeze} freeze tersisa</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>·</span>
                  <span>Gunakan</span>
                </button>

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── AMALAN PER WAKTU SHOLAT ──────────────────────────────
export const AMALAN_PER_WAKTU = [
  {
    id: 'tahajud', waktu: 'Tahajud', waktuAr: 'قِيَامُ اللَّيْل',
    waktuDesc: 'Sepertiga malam terakhir · ±1-1.5 jam sebelum Subuh', emoji: '🌙',
    amalan: [
      {
        id: 'tahajud-doa-bangun', name: 'Doa Bangun Tidur', nameAr: 'دُعَاءُ الاِسْتِيقَاظِ',
        bacaan: [{ ar: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', latin: 'Alhamdulillaahil ladzii ahyaanaa ba\'da maa amaatanaa wa ilaihin nusyuur', arti: 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya kami dikembalikan', jumlah: '1×' }],
        tuntunan: 'Dibaca segera saat bangun tidur untuk Tahajud, sebelum melakukan apapun. Kemudian bersiwak dan berwudhu.',
        khasiat: 'Mengawali malam dengan pengakuan bahwa hidup dan mati ada di tangan Allah. Membuka keberkahan malam dan menguatkan tauhid.',
        dalil: 'Dari Hudzaifah dan Abu Dzarr radhiyallahu anhuma, Rasulullah ﷺ apabila bangun di malam hari membaca doa ini.',
        sumber: 'HR. Bukhari no. 6312, HR. Muslim no. 2711',
        keutamaan: 'Memulai malam dengan zikir adalah sunnah Nabi ﷺ dan menjadi sebab diterimanya ibadah malam.',
      },
      {
        id: 'tahajud-sholat', name: 'Sholat Tahajud', nameAr: 'صَلَاةُ التَّهَجُّدِ',
        bacaan: [
          { ar: 'اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ نُورُ السَّمَوَاتِ وَالْأَرْضِ وَمَنْ فِيهِنَّ، وَلَكَ الْحَمْدُ أَنْتَ قَيِّمُ السَّمَوَاتِ وَالْأَرْضِ وَمَنْ فِيهِنَّ، وَلَكَ الْحَمْدُ أَنْتَ الْحَقُّ، وَوَعْدُكَ الْحَقُّ، وَلِقَاؤُكَ حَقٌّ، وَالْجَنَّةُ حَقٌّ، وَالنَّارُ حَقٌّ، وَالسَّاعَةُ حَقٌّ', latin: 'Allahumma lakal hamdu anta nuurus samaawaati wal ardhi wa man fiihinna...', arti: 'Ya Allah, hanya milik-Mu segala puji, Engkau cahaya langit dan bumi. Engkau Maha Benar, janji-Mu benar, surga itu benar, neraka itu benar, dan hari kiamat itu benar.', jumlah: 'Doa iftitah Tahajud sebelum Al-Fatihah' },
          { ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِرِضَاكَ مِنْ سَخَطِكَ، وَبِمُعَافَاتِكَ مِنْ عُقُوبَتِكَ، وَأَعُوذُ بِكَ مِنْكَ لَا أُحْصِي ثَنَاءً عَلَيْكَ أَنْتَ كَمَا أَثْنَيْتَ عَلَى نَفْسِكَ', latin: 'Allahumma innii a\'udzu biridhaaka min sakhotika, wa bimu\'aafaatika min \'uquubatika, wa a\'udzu bika minka laa uhshii tsanaa\'an \'alaika anta kamaa atsnaita \'alaa nafsika', arti: 'Ya Allah, aku berlindung dengan keridhaan-Mu dari kemurkaan-Mu, dengan ampunan-Mu dari siksa-Mu. Aku tidak sanggup menghitung pujian terhadap-Mu, Engkau sebagaimana Engkau memuji diri-Mu sendiri.', jumlah: 'Dalam sujud Tahajud' },
        ],
        tuntunan: 'Minimal 2 rakaat setelah tidur. Terbaik 8 rakaat (4 salam). Baca surat panjang dengan tartil. Perbanyak sujud dan doa. Tutup dengan Witir.',
        khasiat: 'Sujud di sepertiga malam adalah posisi paling dekat hamba dengan Allah. Doa yang dipanjatkan hampir pasti dikabulkan.',
        dalil: 'Dari Abu Hurairah radhiyallahu anhu: "Tuhan kita turun ke langit dunia setiap malam di sepertiga terakhir. Siapa yang berdoa, Aku kabulkan. Siapa yang meminta, Aku berikan. Siapa yang memohon ampun, Aku ampuni."',
        sumber: 'HR. Bukhari no. 1145, HR. Muslim no. 758',
        keutamaan: 'Sholat yang paling utama setelah sholat wajib adalah sholat malam (HR. Muslim no. 1163). Orang yang rajin Tahajud wajahnya bercahaya di siang hari.',
      },
      {
        id: 'tahajud-doa-sujud', name: 'Doa dalam Sujud Malam', nameAr: 'دُعَاءُ السُّجُودِ فِي اللَّيْل',
        bacaan: [
          { ar: 'سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ، اللَّهُمَّ اغْفِرْ لِي', latin: 'Subhaanaka Allahumma rabbanaa wa bihamdika, Allahummagh fir lii', arti: 'Maha Suci Engkau ya Allah Tuhan kami dan dengan memuji-Mu, ya Allah ampunilah aku', jumlah: 'Banyak-banyak dalam sujud' },
          { ar: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ', latin: 'Rabbighfir lii wa tub \'alayya innaka antal tawwaabur rahiim', arti: 'Ya Tuhanku, ampunilah aku dan terimalah taubatku, sesungguhnya Engkau Maha Penerima Taubat lagi Maha Penyayang', jumlah: '100× (Nabi dalam satu majelis)' },
        ],
        tuntunan: 'Perpanjang sujud dan perbanyak doa. Boleh berdoa dengan bahasa apapun dalam sujud sunnah.',
        khasiat: 'Sujud adalah posisi paling dekat hamba dengan Rabb-nya. Doa dalam sujud malam memiliki kedudukan istimewa.',
        dalil: 'Dari Aisyah radhiyallahu anha: Nabi ﷺ memperbanyak bacaan subhaanaka Allahumma wa bihamdika dalam ruku dan sujudnya.',
        sumber: 'HR. Bukhari no. 817, HR. Muslim no. 484',
        keutamaan: '"Keadaan paling dekat seorang hamba dengan Rabb-nya adalah ketika ia sujud, maka perbanyaklah doa." (HR. Muslim no. 482)',
      },
    ]
  },
  {
    id: 'witir', waktu: 'Witir', waktuAr: 'صَلَاةُ الْوِتْر',
    waktuDesc: 'Penutup sholat malam · setelah Tahajud atau sebelum tidur', emoji: '⭐',
    amalan: [
      {
        id: 'witir-sholat', name: 'Sholat Witir', nameAr: 'صَلَاةُ الْوِتْر',
        bacaan: [{ ar: 'سَبِّحِ اسْمَ رَبِّكَ الْأَعْلَى', latin: 'Sabbihismar rabbikal a\'laa...', arti: 'Sucikanlah nama Tuhanmu Yang Maha Tinggi...', jumlah: 'R1: Al-A\'la (87), R2: Al-Kafirun (109), R3: Al-Ikhlas + Al-Falaq + An-Nas' }],
        tuntunan: '1, 3, 5, 7, atau 11 rakaat. Jika 3 rakaat: 2+1 dengan salam di tengah. Jika tidak yakin bisa Tahajud, witir sebelum tidur.',
        khasiat: 'Penutup sempurna sholat malam. Tanda kecintaan kepada sunnah Nabi yang tidak pernah beliau tinggalkan.',
        dalil: 'Dari Ali radhiyallahu anhu: Rasulullah ﷺ bersabda: "Sesungguhnya Allah witir (ganjil) dan mencintai yang witir. Maka berwitirlah wahai ahli Quran."',
        sumber: 'HR. Abu Dawud no. 1416, HR. Tirmidzi no. 453',
        keutamaan: 'Nabi ﷺ tidak pernah meninggalkan Witir baik saat mukim maupun safar.',
      },
      {
        id: 'witir-qunut', name: 'Doa Qunut Witir', nameAr: 'دُعَاءُ الْقُنُوت',
        bacaan: [{ ar: 'اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ، وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، وَلَا يَعِزُّ مَنْ عَادَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ', latin: 'Allahummahdinii fiiman hadayt, wa \'aafinii fiiman \'aafayt, wa tawallanii fiiman tawallayt, wa baarik lii fiimaa a\'thayt, wa qinii syarra maa qadhayt, fa innaka taqdhi wa laa yuqdha \'alayk, wa innahu laa yadzillu man waalayt, wa laa ya\'izzu man \'aadayt, tabaarakta rabbanaa wa ta\'aalayt', arti: 'Ya Allah, berilah aku petunjuk bersama orang yang telah Engkau beri petunjuk, berilah aku kesehatan bersama orang yang telah Engkau beri kesehatan, uruslah aku bersama orang yang telah Engkau urus, berkahilah aku dalam apa yang telah Engkau berikan, jagalah aku dari keburukan apa yang Engkau tetapkan. Sesungguhnya Engkau yang menetapkan dan tidak ada yang menetapkan atas-Mu. Tidak akan hina orang yang Engkau jadikan wali, dan tidak akan mulia orang yang Engkau musuhi. Maha Suci Engkau wahai Tuhan kami dan Maha Tinggi.', jumlah: '1× setelah ruku rakaat terakhir Witir' }],
        tuntunan: 'Dibaca setelah ruku rakaat terakhir Witir sebelum sujud. Angkat tangan seperti berdoa.',
        khasiat: 'Permohonan lengkap: petunjuk, kesehatan, perlindungan, dan keberkahan dalam satu doa di waktu paling mustajab.',
        dalil: 'Dari Al-Hasan bin Ali radhiyallahu anhuma: Rasulullah ﷺ mengajarkan doa ini untuk aku baca dalam Witir.',
        sumber: 'HR. Abu Dawud no. 1425, HR. Tirmidzi no. 464, dinilai shahih Al-Albani',
        keutamaan: 'Qunut Witir adalah sunnah yang diajarkan langsung Nabi ﷺ kepada cucunya. Mengandung permohonan kebaikan dunia dan akhirat sekaligus.',
      },
    ]
  },
  {
    id: 'subuh', waktu: 'Subuh', waktuAr: 'الفجر',
    waktuDesc: 'Setelah sholat Subuh · hingga matahari terbit', emoji: '🌅',
    amalan: [
      {
        id: 'subuh-rawatib', name: 'Rawatib Qabliyah Subuh', nameAr: 'سُنَّةُ الْفَجْرِ الْقَبْلِيَّة',
        bacaan: [{ ar: 'قُلْ يَا أَيُّهَا الْكَافِرُونَ', latin: 'Qul yaa ayyuhal kaafiruun...', arti: 'Katakanlah: Wahai orang-orang kafir...', jumlah: 'R1: Al-Kafirun (109), R2: Al-Ikhlas (112)' }],
        tuntunan: '2 rakaat ringan dan cepat sebelum Subuh wajib.',
        khasiat: 'Membuka hari dengan ibadah yang paling dicintai Allah. Lebih baik dari dunia dan seisinya.',
        dalil: 'Dari Aisyah radhiyallahu anha: Nabi ﷺ tidak pernah meninggalkan 2 rakaat sebelum Subuh — di rumah maupun dalam perjalanan.',
        sumber: 'HR. Bukhari no. 1182, HR. Muslim no. 724',
        keutamaan: '"Dua rakaat Fajar lebih baik dari dunia dan seisinya." (HR. Muslim no. 725) — Satu-satunya rawatib yang Nabi tidak pernah tinggalkan bahkan dalam safar.',
      },
      {
        id: 'subuh-ayat-kursi', name: 'Ayat Kursi Setelah Subuh', nameAr: 'آيَةُ الْكُرْسِيّ',
        bacaan: [{ ar: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ', latin: 'Allahu laa ilaaha illaa huwal hayyul qayyuum, laa ta\'khudzuhuu sinatuw wa laa nawm, lahuu maa fis samaawaati wa maa fil ardh...', arti: 'Allah, tidak ada ilah melainkan Dia, Yang Maha Hidup lagi terus menerus mengurus makhluk-Nya. Kursi Allah meliputi langit dan bumi. Dan Allah Maha Tinggi lagi Maha Besar.', jumlah: '1× setelah setiap sholat wajib' }],
        tuntunan: 'Dibaca segera setelah salam, sebelum beranjak dari tempat duduk.',
        khasiat: 'Ayat paling agung dalam Al-Quran. Penjaga dari Subuh hingga Dzuhur. Jaminan masuk surga.',
        dalil: 'Dari Abu Umamah radhiyallahu anhu, Rasulullah ﷺ bersabda: "Barangsiapa membaca Ayat Kursi setiap selesai sholat wajib, tidak ada yang menghalanginya masuk surga selain kematian."',
        sumber: 'HR. Nasai no. 9928 dalam Al-Kubra, dinilai shahih Al-Albani',
        keutamaan: 'Ayat Kursi adalah ayat terbaik dalam Al-Quran (HR. Muslim no. 810). Membacanya setelah sholat wajib menjamin surga.',
      },
      {
        id: 'subuh-3qul', name: 'Tiga Qul (3×)', nameAr: 'الْمُعَوِّذَتَانِ وَالْإِخْلَاص',
        bacaan: [
          { ar: 'قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', latin: 'Qul huwallahu ahad, Allahus shamad, lam yalid wa lam yuulad, wa lam yakul lahuu kufuwan ahad', arti: 'Katakanlah: Dialah Allah Yang Maha Esa. Allah tempat bergantung. Dia tidak beranak dan tidak diperanakkan, dan tidak ada yang setara dengan Dia.', jumlah: 'Al-Ikhlas: 3×' },
          { ar: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، مِن شَرِّ مَا خَلَقَ', latin: 'Qul a\'udzu birabbil falaq, min syarri maa khalaq...', arti: 'Katakanlah: Aku berlindung kepada Tuhan yang menguasai subuh, dari kejahatan makhluk-Nya...', jumlah: 'Al-Falaq: 3×' },
          { ar: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ، مَلِكِ النَّاسِ، إِلَٰهِ النَّاسِ', latin: 'Qul a\'udzu birabbin naas, malikin naas, ilaahin naas...', arti: 'Katakanlah: Aku berlindung kepada Tuhan manusia, Raja manusia, Sembahan manusia...', jumlah: 'An-Nas: 3×' },
        ],
        tuntunan: 'Baca masing-masing surat 3 kali berturut-turut setelah Subuh dan Maghrib.',
        khasiat: 'Al-Ikhlas menyucikan tauhid, Al-Falaq melindungi dari keburukan eksternal, An-Nas dari keburukan internal.',
        dalil: '"Bacalah Al-Ikhlas, Al-Falaq, dan An-Nas tiga kali di pagi dan sore hari — itu cukup bagimu dari segala sesuatu."',
        sumber: 'HR. Abu Dawud no. 5082, HR. Tirmidzi no. 3575, dinilai shahih Al-Albani',
        keutamaan: 'Cukup sebagai penjaga dari segala keburukan hari itu. Nabi ﷺ rutin tanpa pernah meninggalkan.',
      },
      {
        id: 'subuh-sayyidul-istighfar', name: 'Sayyidul Istighfar', nameAr: 'سَيِّدُ الِاسْتِغْفَار',
        bacaan: [{ ar: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ', latin: 'Allahumma anta rabbii laa ilaaha illaa anta, khalaqtanii wa anaa abduka, wa anaa \'alaa \'ahdika wa wa\'dika mastatha\'tu, a\'udzu bika min syarri maa shana\'tu, abuu\'u laka bini\'matika \'alayya, wa abuu\'u laka bidzanbii, faghfir lii fa\'innahuu laa yaghfirudz dzunuuba illaa anta', arti: 'Ya Allah, Engkau adalah Rabbku. Tidak ada ilah selain Engkau. Engkau yang menciptakanku dan aku adalah hamba-Mu. Aku berada di atas perjanjian dan janji-Mu semampuku. Aku berlindung dari keburukan perbuatanku. Aku mengakui nikmat-Mu dan mengakui dosaku. Maka ampunilah aku, karena tidak ada yang mengampuni dosa selain Engkau.', jumlah: '1× setelah Subuh' }],
        tuntunan: 'Dibaca di pagi hari dengan penuh keyakinan dan kehadiran hati, menghayati setiap kalimatnya.',
        khasiat: 'Pembuka hari yang paling sempurna. Pengakuan tauhid, kehambaan, dosa, dan permohonan ampun sekaligus.',
        dalil: 'Dari Syaddad bin Aus radhiyallahu anhu, Rasulullah ﷺ bersabda: "Penghulu istighfar adalah engkau mengucapkan: Allahumma anta rabbii..."',
        sumber: 'HR. Bukhari no. 6306',
        keutamaan: 'Barangsiapa membacanya di pagi hari dengan yakin lalu meninggal sebelum sore, ia termasuk ahli surga.',
      },
      {
        id: 'subuh-tasbih', name: 'Tasbih Pagi (33-33-34)', nameAr: 'تَسْبِيحُ الصَّبَاح',
        bacaan: [
          { ar: 'سُبْحَانَ اللَّهِ (٣٣×)، الْحَمْدُ لِلَّهِ (٣٣×)، اللَّهُ أَكْبَرُ (٣٤×)', latin: 'Subhaanallah (33×), Alhamdulillah (33×), Allahu akbar (34×)', arti: 'Maha Suci Allah (33×), Segala puji bagi Allah (33×), Allah Maha Besar (34×)', jumlah: '100× total' },
          { ar: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', latin: 'Laa ilaaha illallaahu wahdahu laa syariika lahu, lahul mulku wa lahul hamdu wa huwa \'alaa kulli syay\'in qadiir', arti: 'Tidak ada ilah selain Allah semata, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan pujian, dan Dia Maha Kuasa atas segala sesuatu.', jumlah: '1× penutup' },
        ],
        tuntunan: 'Dihitung dengan jari tangan kanan atau tasbih. Dibaca setelah sholat wajib.',
        khasiat: 'Memenuhi timbangan amal. Menyucikan lisan dan hati dari kesombongan.',
        dalil: 'Dari Abu Hurairah radhiyallahu anhu, Nabi ﷺ mengajarkan tasbih 33-33-34 setelah sholat.',
        sumber: 'HR. Muslim no. 597',
        keutamaan: '"Dua kalimat yang ringan di lisan, berat di timbangan, dan dicintai Ar-Rahman: Subhaanallahi wa bihamdih, subhaanallahil \'azhiim." (HR. Bukhari no. 6682)',
      },
      {
        id: 'subuh-doa-ilmu', name: 'Doa Ilmu & Rezeki', nameAr: 'دُعَاءُ الْعِلْمِ وَالرِّزْق',
        bacaan: [{ ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا', latin: 'Allahumma innii as\'aluka \'ilman naafi\'aa, wa rizqan thayyibaa, wa \'amalan mutaqabbalaa', arti: 'Ya Allah, sesungguhnya aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik (halal dan berkah), dan amal yang diterima.', jumlah: '1× sebelum beranjak dari tempat sholat Subuh' }],
        tuntunan: 'Dibaca setelah salam sholat Subuh sebelum beranjak. Doa spesifik untuk waktu ini.',
        khasiat: 'Tiga permohonan terpenting dalam satu doa: ilmu (bekal akal), rezeki (bekal fisik), dan amal diterima (bekal akhirat).',
        dalil: 'Dari Ummu Salamah radhiyallahu anha: Nabi ﷺ apabila sholat Subuh dan salam, beliau mengucapkan doa ini.',
        sumber: 'HR. Ibnu Majah no. 925, dinilai shahih Al-Albani',
        keutamaan: 'Doa yang diajarkan khusus untuk dibaca setelah Subuh sebelum beranjak — spesifik waktu dan sangat mustajab.',
      },
    ]
  },
  {
    id: 'dhuha', waktu: 'Dhuha', waktuAr: 'الضُّحَى',
    waktuDesc: '15-20 menit setelah matahari terbit · hingga sebelum Dzuhur', emoji: '☀️',
    amalan: [
      {
        id: 'dhuha-sholat', name: 'Sholat Dhuha', nameAr: 'صَلَاةُ الضُّحَى',
        bacaan: [{ ar: 'وَالشَّمْسِ وَضُحَاهَا', latin: 'Wash shams wa dhuhaha...', arti: 'Demi matahari dan sinarnya di pagi hari...', jumlah: 'R1: Asy-Syams (91), R2: Adh-Dhuha (93)' }],
        tuntunan: 'Setelah matahari naik ±15-20 menit hingga 15 menit sebelum Dzuhur. Minimal 2 rakaat, terbaik 8 rakaat.',
        khasiat: 'Sedekah bagi seluruh 360 sendi tubuh. Allah menjamin mencukupi urusan siapapun yang sholat Dhuha.',
        dalil: '"Setiap ruas tulang kalian wajib bersedekah setiap pagi... dan 2 rakaat Dhuha mencukupi semua itu."',
        sumber: 'HR. Muslim no. 720',
        keutamaan: 'Allah berfirman: "Wahai anak Adam, sholatlah 4 rakaat di awal hari, niscaya Aku cukupi kamu di sore harinya." (HR. Tirmidzi no. 475) — Janji langsung dari Allah.',
      },
      {
        id: 'dhuha-doa', name: 'Doa Setelah Dhuha', nameAr: 'دُعَاءُ صَلَاةِ الضُّحَى',
        bacaan: [{ ar: 'اللَّهُمَّ إِنَّ الضُّحَى ضُحَاؤُكَ، وَالْبَهَاءَ بَهَاؤُكَ، وَالْجَمَالَ جَمَالُكَ، وَالْقُوَّةَ قُوَّتُكَ، وَالْقُدْرَةَ قُدْرَتُكَ، وَالْعِصْمَةَ عِصْمَتُكَ. اللَّهُمَّ إِنْ كَانَ رِزْقِي فِي السَّمَاءِ فَأَنْزِلْهُ، وَإِنْ كَانَ فِي الْأَرْضِ فَأَخْرِجْهُ، وَإِنْ كَانَ مُعَسَّرًا فَيَسِّرْهُ، وَإِنْ كَانَ حَرَامًا فَطَهِّرْهُ، وَإِنْ كَانَ بَعِيدًا فَقَرِّبْهُ، بِحَقِّ ضُحَائِكَ وَبَهَائِكَ وَجَمَالِكَ وَقُوَّتِكَ وَقُدْرَتِكَ، آتِنِي مَا آتَيْتَ عِبَادَكَ الصَّالِحِينَ', latin: 'Allahumma innad dhuhaa dhuhaauka, wal bahaa\'a bahaauka, wal jamaala jamaaluka, wal quwwata quwwatuka, wal qudrata qudratuka, wal \'ishmata \'ishmatuka. Allahumma in kaana rizqii fis samaa\'i fa anzilhu, wa in kaana fil ardhi fa akhrijah, wa in kaana mu\'assaran fa yassirhu, wa in kaana haraaman fa thahhirhu, wa in kaana ba\'iidan fa qarribhu, bihaqqi dhuhaa\'ika wa bahaa\'ika wa jamaalika wa quwwatika wa qudratika, aatinii maa aatayta \'ibaadakash shaalihiin', arti: 'Ya Allah, sesungguhnya waktu dhuha adalah waktu dhuha-Mu, keagungan adalah keagungan-Mu... Ya Allah, jika rezekiku di langit turunkanlah, jika di bumi keluarkanlah, jika dipersulit mudahkanlah, jika haram sucikanlah, jika jauh dekatkanlah.', jumlah: '1× setelah salam Dhuha' }],
        tuntunan: 'Dibaca setelah salam sholat Dhuha selesai dengan tangan diangkat.',
        khasiat: 'Mencakup semua kondisi rezeki: yang di langit, di bumi, yang susah, yang haram, dan yang jauh — doa rezeki paling komprehensif.',
        dalil: 'Doa ini diriwayatkan dari berbagai jalur sebagai doa yang dibaca setelah sholat Dhuha oleh para salaf.',
        sumber: 'Dinukil oleh banyak ulama termasuk Imam Al-Ghazali dalam Ihya Ulumiddin',
        keutamaan: 'Doa rezeki paling lengkap dan komprehensif — menutup semua kemungkinan kondisi rezeki dalam satu doa.',
      },
    ]
  },
  {
    id: 'dzuhur', waktu: 'Dzuhur', waktuAr: 'الظُّهْر',
    waktuDesc: 'Sebelum dan sesudah sholat Dzuhur', emoji: '🕛',
    amalan: [
      {
        id: 'dzuhur-rawatib-qabl', name: 'Rawatib Qabliyah Dzuhur', nameAr: 'سُنَّةُ الظُّهْرِ الْقَبْلِيَّة',
        bacaan: [{ ar: '٤ رَكَعَات قَبْلَ الظُّهْر', latin: '4 rakaat sebelum Dzuhur (2+2 salam)', arti: 'Baca surat apa saja setelah Al-Fatihah', jumlah: '4 rakaat (2 salam)' }],
        tuntunan: '4 rakaat sebelum Dzuhur, dikerjakan 2+2. Dikerjakan antara adzan dan iqamah.',
        khasiat: 'Penyambung ibadah pagi ke sore. Menjaga kesinambungan ibadah di tengah kesibukan siang.',
        dalil: 'Dari Aisyah radhiyallahu anha: Nabi ﷺ tidak pernah meninggalkan 4 rakaat sebelum Dzuhur.',
        sumber: 'HR. Bukhari no. 1182',
        keutamaan: 'Bagian dari 12 rakaat rawatib muakkadah yang menjamin rumah di surga (HR. Muslim no. 728).',
      },
      {
        id: 'dzuhur-rawatib-bad', name: 'Rawatib Ba\'diyah Dzuhur', nameAr: 'سُنَّةُ الظُّهْرِ الْبَعْدِيَّة',
        bacaan: [{ ar: 'رَكْعَتَانِ بَعْدَ الظُّهْر', latin: '2 rakaat setelah Dzuhur', arti: '2 rakaat sunnah ba\'diyah', jumlah: '2 rakaat' }],
        tuntunan: '2 rakaat segera setelah salam sholat Dzuhur.',
        khasiat: 'Menyempurnakan Dzuhur dan menjadi penambal kekurangan sholat wajib. Sebab diharamkannya neraka.',
        dalil: '"Barangsiapa menjaga 4 rakaat sebelum Dzuhur dan 2 rakaat sesudahnya, Allah haramkan api neraka atasnya."',
        sumber: 'HR. Abu Dawud no. 1269, HR. Tirmidzi no. 428, dinilai shahih Al-Albani',
        keutamaan: 'Neraka diharamkan bagi orang yang menjaga rawatib Dzuhur — jaminan yang sangat besar untuk amalan beberapa menit.',
      },
      {
        id: 'dzuhur-shalawat', name: 'Shalawat 100×', nameAr: 'الصَّلَاةُ عَلَى النَّبِيِّ',
        bacaan: [{ ar: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ', latin: 'Allahumma shalli \'alaa Muhammad wa \'alaa aali Muhammad, kamaa shallaita \'alaa Ibraahiim wa \'alaa aali Ibraahiim, innaka hamiidun majiid', arti: 'Ya Allah, limpahkanlah rahmat kepada Muhammad dan keluarga Muhammad, sebagaimana Engkau telah melimpahkan rahmat kepada Ibrahim dan keluarga Ibrahim. Sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.', jumlah: '100×' }],
        tuntunan: 'Bisa dibaca kapan saja siang hari. Hari Jumat dianjurkan hingga 1000×.',
        khasiat: 'Setiap shalawat dibalas 10 rahmat Allah, diangkat 10 derajat, dan dihapus 10 keburukan.',
        dalil: '"Barangsiapa bershalawat kepadaku sekali, Allah bershalawat kepadanya 10 kali."',
        sumber: 'HR. Muslim no. 408',
        keutamaan: 'Amalan paling menguntungkan: ringan dilakukan, besar pahalanya, dan menjadi sebab syafaat Nabi ﷺ di kiamat.',
      },
    ]
  },
  {
    id: 'ashar', waktu: 'Ashar', waktuAr: 'الْعَصْر',
    waktuDesc: 'Setelah sholat Ashar · hingga sebelum Maghrib', emoji: '🌤️',
    amalan: [
      {
        id: 'ashar-ayat-kursi', name: 'Ayat Kursi Setelah Ashar', nameAr: 'آيَةُ الْكُرْسِيّ',
        bacaan: [{ ar: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...', latin: 'Allahu laa ilaaha illaa huwal hayyul qayyuum...', arti: 'Allah, tidak ada ilah melainkan Dia, Yang Maha Hidup...', jumlah: '1× setelah salam sholat Ashar' }],
        tuntunan: 'Dibaca setiap selesai sholat wajib termasuk Ashar.',
        khasiat: 'Penjaga dari Ashar hingga Maghrib. Waktu diangkatnya amal — Ayat Kursi di momen ini sangat bermakna.',
        dalil: '"Barangsiapa membaca Ayat Kursi setiap selesai sholat wajib, tidak ada yang menghalanginya masuk surga selain kematian."',
        sumber: 'HR. Nasai no. 9928 dalam Al-Kubra, dinilai shahih Al-Albani',
        keutamaan: 'Jaminan surga dengan amalan kurang dari 1 menit setelah setiap sholat.',
      },
      {
        id: 'ashar-dzikir-petang', name: 'Dzikir Petang', nameAr: 'أَذْكَارُ الْمَسَاء',
        bacaan: [
          { ar: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', latin: 'Amsaynaa wa amsal mulku lillaah, walhamdu lillaah, laa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa \'alaa kulli syay\'in qadiir', arti: 'Kami telah memasuki waktu sore dan seluruh kerajaan milik Allah, segala puji bagi Allah, tidak ada ilah selain Allah semata.', jumlah: '1× pembuka dzikir petang' },
          { ar: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', latin: 'A\'udzu bikalimaatillaahit taammaati min syarri maa khalaq', arti: 'Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan makhluk yang Dia ciptakan.', jumlah: '3×' },
        ],
        tuntunan: 'Dimulai setelah Ashar hingga sebelum Maghrib. Dibaca secara berurutan, tidak terburu-buru.',
        khasiat: 'Perisai dari gangguan malam, setan, jin, sihir, dan segala keburukan yang datang di waktu gelap.',
        dalil: '"Barangsiapa membaca A\'udzu bikalimaatillaahit taammaati... tiga kali di sore hari, tidak ada racun atau sengatan yang membahayakannya malam itu."',
        sumber: 'HR. Muslim no. 2709',
        keutamaan: 'Allah berfirman: "Bertasbihlah memuji Tuhanmu sebelum matahari terbit dan sebelum terbenamnya." (QS. Thaha: 130) — perintah langsung dari Allah.',
      },
      {
        id: 'ashar-istighfar', name: 'Istighfar 100×', nameAr: 'الِاسْتِغْفَار',
        bacaan: [{ ar: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ', latin: 'Astaghfirullahal \'azhiim alladzii laa ilaaha illaa huwal hayyul qayyuum wa atuubu ilaih', arti: 'Aku memohon ampun kepada Allah Yang Maha Agung, tidak ada ilah selain Dia, Yang Maha Hidup, dan aku bertaubat kepada-Nya.', jumlah: '100×' }],
        tuntunan: 'Dibaca setelah Ashar atau saat perjalanan pulang. Bisa sambil berjalan atau berkendara.',
        khasiat: 'Ashar adalah waktu diangkatnya amal. Istighfar memastikan amal diangkat dalam keadaan penuh ampunan.',
        dalil: '"Sesungguhnya hatiku terkadang lalai, dan aku beristighfar kepada Allah seratus kali dalam sehari."',
        sumber: 'HR. Muslim no. 2702',
        keutamaan: 'Nabi ﷺ yang sudah diampuni tetap beristighfar 70× sehari. Istighfar pembuka rezeki, pengangkat bala, sebab turunnya rahmat.',
      },
    ]
  },
  {
    id: 'maghrib', waktu: 'Maghrib', waktuAr: 'الْمَغْرِب',
    waktuDesc: 'Setelah sholat Maghrib · waktu penuh berkah', emoji: '🌇',
    amalan: [
      {
        id: 'maghrib-rawatib', name: 'Rawatib Ba\'diyah Maghrib', nameAr: 'سُنَّةُ الْمَغْرِبِ',
        bacaan: [{ ar: 'قُلْ يَا أَيُّهَا الْكَافِرُونَ', latin: 'Qul yaa ayyuhal kaafiruun...', arti: 'Katakanlah: Wahai orang-orang kafir...', jumlah: 'R1: Al-Kafirun (109), R2: Al-Ikhlas (112)' }],
        tuntunan: '2 rakaat segera setelah salam Maghrib. Di rumah lebih utama.',
        khasiat: 'Menyempurnakan Maghrib dan menguatkan di awal malam. Rumah yang ada sholat sunnah bercahaya bagi penduduk langit.',
        dalil: 'Dari Ibnu Umar radhiyallahu anhuma: Nabi ﷺ melaksanakan 2 rakaat setelah Maghrib di rumahnya.',
        sumber: 'HR. Bukhari no. 1165, HR. Muslim no. 729',
        keutamaan: 'Bagian dari 12 rakaat rawatib yang menjamin rumah di surga (HR. Muslim no. 728).',
      },
      {
        id: 'maghrib-3qul', name: 'Tiga Qul Petang (3×)', nameAr: 'الْمُعَوِّذَتَانِ وَالْإِخْلَاص',
        bacaan: [{ ar: 'قُلْ هُوَ اللَّهُ أَحَدٌ... (٣×)، قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ... (٣×)، قُلْ أَعُوذُ بِرَبِّ النَّاسِ... (٣×)', latin: 'Al-Ikhlas (3×), Al-Falaq (3×), An-Nas (3×)', arti: 'Ketiga surat perlindungan dibaca masing-masing tiga kali', jumlah: 'Masing-masing 3×' }],
        tuntunan: 'Dibaca setelah Maghrib seperti setelah Subuh. Dzikir petang paling utama.',
        khasiat: 'Penjaga dari segala keburukan malam: sihir, jin, dengki, dan waswas setan. Perlindungan sepanjang malam.',
        dalil: '"Bacalah Al-Ikhlas, Al-Falaq, dan An-Nas tiga kali di pagi dan sore hari — itu cukup bagimu dari segala sesuatu."',
        sumber: 'HR. Abu Dawud no. 5082, dinilai shahih Al-Albani',
        keutamaan: 'Nabi ﷺ tidak pernah meninggalkan tiga qul pagi dan petang. Juga dibaca 3× sebelum tidur.',
      },
      {
        id: 'maghrib-sayyidul-istighfar-petang', name: 'Sayyidul Istighfar (Petang)', nameAr: 'سَيِّدُ الِاسْتِغْفَار مَسَاءً',
        bacaan: [{ ar: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ', latin: 'Allahumma anta rabbii laa ilaaha illaa anta, khalaqtanii wa anaa abduka...', arti: 'Ya Allah, Engkau adalah Rabbku, tidak ada ilah selain Engkau. Engkau menciptakanku dan aku hamba-Mu...', jumlah: '1× setelah Maghrib' }],
        tuntunan: 'Dibaca di sore/petang (setelah Maghrib) dengan penuh keyakinan dan kesadaran. Pasangan dari Sayyidul Istighfar pagi.',
        khasiat: 'Menutup hari dengan pengakuan dosa dan permohonan ampun. Membersihkan dari dosa-dosa sepanjang hari.',
        dalil: 'Dari Syaddad bin Aus: Nabi ﷺ bersabda barangsiapa mengucapkannya di sore hari dengan yakin lalu meninggal sebelum pagi, maka ia ahli surga.',
        sumber: 'HR. Bukhari no. 6306',
        keutamaan: 'Dua peluang surga setiap hari: pagi dan petang. Siapapun yang rutin membaca Sayyidul Istighfar pagi dan petang.',
      },
      {
        id: 'maghrib-shalawat', name: 'Shalawat (Jumat: perbanyak)', nameAr: 'الصَّلَاةُ عَلَى النَّبِيّ',
        bacaan: [{ ar: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ', latin: 'Allahumma shalli \'alaa Muhammad wa \'alaa aali Muhammad', arti: 'Ya Allah, limpahkanlah rahmat kepada Muhammad dan keluarga Muhammad', jumlah: 'Minimal 100×, Jumat malam: 1000×' }],
        tuntunan: 'Malam Jumat (setelah Maghrib Kamis) waktu terbaik memperbanyak shalawat.',
        khasiat: 'Shalawat malam Jumat berlipat pahalanya. Orang paling banyak shalawat paling dekat dengan Nabi di kiamat.',
        dalil: '"Perbanyaklah shalawat kepadaku di hari Jumat dan malam Jumat. Barangsiapa bershalawat sekali, Allah bershalawat 10 kali."',
        sumber: 'HR. Baihaqi, HR. Abu Dawud no. 1047',
        keutamaan: '"Orang yang paling dekat denganku di hari kiamat adalah yang paling banyak bershalawat kepadaku." (HR. Tirmidzi no. 484)',
      },
    ]
  },
  {
    id: 'isya', waktu: 'Isya', waktuAr: 'الْعِشَاء',
    waktuDesc: 'Setelah sholat Isya · menutup hari dengan sempurna', emoji: '🌙',
    amalan: [
      {
        id: 'isya-rawatib', name: 'Rawatib Ba\'diyah Isya', nameAr: 'سُنَّةُ الْعِشَاء',
        bacaan: [{ ar: 'رَكْعَتَانِ بَعْدَ الْعِشَاء', latin: '2 rakaat setelah Isya', arti: '2 rakaat sunnah ba\'diyah Isya', jumlah: '2 rakaat' }],
        tuntunan: '2 rakaat segera setelah salam Isya. Setelah ini boleh langsung Witir jika tidak berniat Tahajud.',
        khasiat: 'Menutup sholat wajib Isya dengan sempurna. Melengkapi 12 rakaat rawatib yang menjamin surga.',
        dalil: '"Barangsiapa menjaga 2 rakaat sesudah Maghrib, 2 rakaat sesudah Isya... Allah haramkan api neraka atasnya."',
        sumber: 'HR. Abu Dawud no. 1269, HR. Tirmidzi no. 428',
        keutamaan: 'Neraka diharamkan. Keutamaan sangat besar untuk amalan beberapa menit saja.',
      },
      {
        id: 'isya-tasbih-tidur', name: 'Tasbih Fatimah Sebelum Tidur', nameAr: 'تَسْبِيحُ فَاطِمَة',
        bacaan: [{ ar: 'سُبْحَانَ اللَّهِ (٣٣×)، الْحَمْدُ لِلَّهِ (٣٣×)، اللَّهُ أَكْبَرُ (٣٤×)', latin: 'Subhaanallah (33×), Alhamdulillah (33×), Allahu akbar (34×)', arti: 'Maha Suci Allah (33×), Segala puji bagi Allah (33×), Allah Maha Besar (34×)', jumlah: '100× sebelum tidur' }],
        tuntunan: 'Dibaca sambil berbaring di tempat tidur sebelum tertidur.',
        khasiat: 'Menutup hari dengan tasbih menguatkan fisik dan jiwa. Lebih baik dari pembantu menurut Nabi ﷺ.',
        dalil: 'Dari Ali radhiyallahu anhu: Fatimah mengadu kepada Nabi tentang beratnya pekerjaan. Nabi mengajarkan tasbih ini: "ini lebih baik bagimu daripada pembantu."',
        sumber: 'HR. Bukhari no. 3705, HR. Muslim no. 2727',
        keutamaan: '"Aku tidak akan meninggalkan kalian sesuatu yang lebih baik dari ini." — Warisan langsung Nabi ﷺ kepada putrinya.',
      },
      {
        id: 'isya-doa-tidur', name: 'Doa Sebelum Tidur', nameAr: 'دُعَاءُ النَّوْم',
        bacaan: [
          { ar: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', latin: 'Bismika Allahumma amuutu wa ahyaa', arti: 'Dengan nama-Mu ya Allah, aku mati dan aku hidup', jumlah: '1×' },
          { ar: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ', latin: 'Allahumma qinii \'adzaabaka yawma tab\'atsu \'ibaadaka', arti: 'Ya Allah, jauhkanlah aku dari azab-Mu pada hari Engkau membangkitkan hamba-hamba-Mu', jumlah: '3×' },
        ],
        tuntunan: 'Dibaca sambil berbaring di sisi kanan menghadap kiblat. Sebelumnya baca tiga qul (3×) sambil mengusap tubuh.',
        khasiat: 'Tidur adalah kematian kecil. Mengucapkan nama Allah saat tidur menjaga jiwa dalam perlindungan-Nya.',
        dalil: 'Dari Hudzaifah radhiyallahu anhu: Apabila Nabi ﷺ hendak tidur, beliau meletakkan tangan di bawah pipi lalu membaca doa ini.',
        sumber: 'HR. Bukhari no. 6312, HR. Muslim no. 2711',
        keutamaan: 'Menutup hari dengan nama Allah menjadikan tidur sebagai ibadah. Jika meninggal dalam tidur, meninggal dalam keadaan menyebut nama Allah — husnul khatimah.',
      },
      {
        id: 'isya-niat-tahajud', name: 'Niat Tahajud & Pasang Alarm', nameAr: 'نِيَّةُ التَّهَجُّد',
        bacaan: [{ ar: 'نَوَيْتُ أَنْ أَقُومَ اللَّيْلَ لِلَّهِ تَعَالَى', latin: 'Nawaitu an aquumallail lillaahi ta\'aalaa', arti: 'Aku berniat untuk sholat malam karena Allah Ta\'ala', jumlah: '1× dalam hati sebelum tidur' }],
        tuntunan: 'Niatkan sebelum tidur. Pasang alarm sepertiga malam terakhir (±1-1.5 jam sebelum Subuh). Tidur dalam keadaan suci jika bisa.',
        khasiat: 'Niat yang kuat sebelum tidur dicatat sebagai amal, bahkan jika tidak bisa bangun.',
        dalil: '"Barangsiapa mendatangi tempat tidurnya dengan niat untuk bangun sholat malam, lalu matanya tertidur hingga pagi, dicatat baginya apa yang ia niatkan."',
        sumber: 'HR. Nasai no. 1787, HR. Ibnu Majah no. 1344, dinilai shahih Al-Albani',
        keutamaan: 'Niat ikhlas untuk Tahajud, meski tidak terlaksana, tetap dicatat sebagai pahala Tahajud. Allah Maha Mengetahui niat hamba-Nya.',
      },
    ]
  },
];

// ── Prayer Amalan Page — full screen page opened from Dashboard prayer card ───
const PRAYER_WAKTU_MAP = {
  tahajud: 'tahajud', witir: 'witir',
  subuh: 'subuh', dhuha: 'dhuha',
  dzuhur: 'dzuhur', ashar: 'ashar',
  maghrib: 'maghrib', isya: 'isya',
};

function AmalanDrawer({ amalan, waktu, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 280);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          zIndex: 50,
          opacity: visible ? 1 : 0,
          transition: 'opacity .28s ease',
          backdropFilter: visible ? 'blur(2px)' : 'none',
        }}
      />

      {/* Drawer panel */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 'min(480px, 100vw)',
          background: 'var(--bg)',
          zIndex: 51,
          display: 'flex', flexDirection: 'column',
          boxShadow: '-8px 0 40px rgba(0,0,0,.25)',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform .28s cubic-bezier(.32,.72,0,1)',
          borderLeft: '1px solid var(--border)',
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
          overflow: 'hidden',
        }}
      >
        {/* HEADER */}
        <div style={{
          background: 'var(--surface)', borderBottom: '1px solid var(--border)',
          padding: '14px 20px', display: 'flex', alignItems: 'center',
          gap: 14, flexShrink: 0,
        }}>
          <button
            onClick={handleClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-2)', display: 'flex', alignItems: 'center',
              gap: 6, fontFamily: 'var(--f-head)', fontWeight: 600,
              fontSize: 13, padding: '6px 10px 6px 0', flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
            Tutup
          </button>
          {waktu && (
            <span className="chip" style={{ fontSize: 10, pointerEvents: 'none', flexShrink: 0 }}>
              {waktu.waktu}
            </span>
          )}
        </div>

        {/* SCROLLABLE CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>

          {/* HERO */}
          <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '28px 24px 24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -10, right: -10, fontFamily: 'var(--f-ar)', fontSize: 100, color: 'var(--gold)', opacity: .05, lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>
              {amalan.nameAr}
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 22, color: 'var(--text)', letterSpacing: '-.02em', marginBottom: 8 }}>
                {amalan.name}
              </div>
              <div style={{ fontFamily: 'var(--f-ar)', fontSize: 20, color: 'var(--gold)', direction: 'rtl', lineHeight: 1.7, textAlign: 'right', opacity: .8 }}>
                {amalan.nameAr}
              </div>
            </div>
          </div>

          {/* BODY */}
          <div style={{ padding: '0 20px 80px' }}>

            {/* BACAAN */}
            {amalan.bacaan?.map((b, i) => (
              <div key={i} style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 3, height: 16, borderRadius: 2, background: 'var(--gold)', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 11, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '.12em' }}>
                    Bacaan {amalan.bacaan.length > 1 ? i + 1 : ''}
                  </span>
                  <span className="chip on" style={{ fontSize: 10, padding: '2px 10px', pointerEvents: 'none', marginLeft: 4 }}>{b.jumlah}</span>
                </div>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px 20px 16px', marginBottom: 10, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
                  <div style={{ fontFamily: 'var(--f-ar)', fontSize: 26, color: 'var(--gold)', direction: 'rtl', lineHeight: 2.2, marginBottom: 16 }}>
                    {b.ar}
                  </div>
                  <div style={{ width: 40, height: 1, background: 'var(--border)', margin: '0 auto 16px' }} />
                  <div style={{ fontSize: 13, color: 'var(--text-2)', fontStyle: 'italic', lineHeight: 1.9 }}>
                    {b.latin}
                  </div>
                </div>
                <div style={{ background: 'var(--elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 3, background: 'var(--gold)', borderRadius: 2, alignSelf: 'stretch', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 10, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>Artinya</div>
                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.85 }}>"{b.arti}"</div>
                  </div>
                </div>
              </div>
            ))}

            {/* INFO GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 24 }}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold)' }}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  </div>
                  <span style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 11, color: 'var(--text)' }}>Cara Mengamalkan</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.8, margin: 0 }}>{amalan.tuntunan}</p>
              </div>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold)' }}><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/></svg>
                  </div>
                  <span style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 11, color: 'var(--text)' }}>Khasiat &amp; Faedah</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.8, margin: 0 }}>{amalan.khasiat}</p>
              </div>
            </div>

            {/* DALIL */}
            <div style={{ marginTop: 14, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <div style={{ background: 'var(--elevated)', padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold)' }}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                </div>
                <span style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 12, color: 'var(--text)' }}>Dalil Anjuran</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 11, color: 'var(--gold)' }}>{amalan.sumber}</span>
              </div>
              <div style={{ padding: 16 }}>
                <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.9, margin: 0 }}>{amalan.dalil}</p>
              </div>
            </div>

            {/* KEUTAMAAN */}
            <div style={{ marginTop: 14, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ height: 3, background: 'linear-gradient(90deg, var(--gold), var(--gold-2, var(--gold)), transparent)' }} />
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold)' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </div>
                  <span style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 12, color: 'var(--text)' }}>Keutamaan</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.9, margin: 0 }}>{amalan.keutamaan}</p>
              </div>
            </div>

            {/* CLOSE BUTTON */}
            <button
              className="btn gold"
              style={{ width: '100%', padding: 13, fontSize: 14, marginTop: 24 }}
              onClick={handleClose}
            >
              ← Kembali ke {waktu?.waktu || 'Amalan'}
            </button>

          </div>
        </div>
      </div>
    </>
  );
}

export function PrayerAmalanPage({ card, misiDone, toggleMisi, onBack }) {
  const waktuData = AMALAN_PER_WAKTU.find(w => w.id === (PRAYER_WAKTU_MAP[card.k] || card.k));
  const [selectedAmalan, setSelectedAmalan] = useState(null);

  useEffect(() => {
    window.history.pushState({ prayerPage: true }, '');
    const handlePop = () => onBack();
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const doneCount = waktuData?.amalan.filter(a => misiDone?.[a.id]).length || 0;
  const totalCount = waktuData?.amalan.length || 0;

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 10 }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 13, padding: '6px 10px 6px 0', flexShrink: 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Kembali
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--f-ar)', fontSize: 16, color: 'var(--gold)', direction: 'rtl', lineHeight: 1.4 }}>{card.ar}</div>
          <div style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 18, color: 'var(--text)', letterSpacing: '-.01em' }}>Amalan Setelah {card.id}</div>
        </div>
      </div>

      {/* Waktu desc + progress */}
      {waktuData && (
        <div style={{ padding: '12px 24px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
          <div className="muted tiny" style={{ marginBottom: 8 }}>{waktuData.waktuDesc}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--f-head)' }}>{doneCount} / {totalCount} selesai</span>
          </div>
          <div style={{ background: 'var(--border)', borderRadius: 999, height: 3 }}>
            <div style={{ width: totalCount ? `${(doneCount / totalCount) * 100}%` : '0%', height: '100%', borderRadius: 999, background: 'var(--gold)', transition: 'width .5s ease' }} />
          </div>
        </div>
      )}

      {/* Amalan grid — Notion style */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 80px' }}>
        {!waktuData ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>
            <div className="muted">Amalan untuk waktu ini segera hadir</div>
          </div>
        ) : (
          <div className="prayer-amalan-grid dm-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, maxWidth: 960, margin: '0 auto' }}>
            {waktuData.amalan.map((amalan, idx) => {
              const done = !!misiDone?.[amalan.id];
              return (
                <div
                  key={amalan.id}
                  style={{
                    background: done ? 'var(--elevated)' : 'var(--surface)',
                    border: `1px solid ${done ? 'var(--gold-line)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    opacity: done ? .7 : 1,
                    transition: 'border-color .15s, transform .1s, opacity .2s',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onClick={() => setSelectedAmalan(amalan)}
                >
                  {/* Card top accent line */}
                  <div style={{ height: 3, background: done ? 'var(--gold)' : 'var(--border)', transition: 'background .2s' }} />

                  {/* Card body */}
                  <div style={{ padding: '16px 18px', flex: 1 }}>

                    {/* Number + Arabic row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: done ? 'var(--gold)' : 'var(--elevated)', border: `1px solid ${done ? 'var(--gold)' : 'var(--border-2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 11, color: done ? 'white' : 'var(--text-3)', flexShrink: 0, transition: '.18s' }}>
                        {done ? (
                          <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7.4 5.7 10 11 4.2"/></svg>
                        ) : idx + 1}
                      </div>
                      <div style={{ fontFamily: 'var(--f-ar)', fontSize: 16, color: done ? 'var(--gold)' : 'var(--text-3)', direction: 'rtl', lineHeight: 1.5, textAlign: 'right', opacity: done ? 1 : .7 }}>
                        {amalan.nameAr}
                      </div>
                    </div>

                    {/* Name */}
                    <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 15, color: done ? 'var(--text-2)' : 'var(--text)', textDecoration: done ? 'line-through' : 'none', marginBottom: 10, lineHeight: 1.3 }}>
                      {amalan.name}
                    </div>

                    {/* Preview: first bacaan latin (truncated) */}
                    {amalan.bacaan?.[0]?.latin && (
                      <div style={{ fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic', lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', marginBottom: 12 }}>
                        {amalan.bacaan[0].latin}
                      </div>
                    )}

                    {/* Tags row */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {amalan.bacaan?.[0]?.jumlah && (
                        <span style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 10, color: 'var(--gold)', background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', borderRadius: 999, padding: '2px 8px' }}>
                          {amalan.bacaan[0].jumlah}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card footer */}
                  <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 11, color: done ? 'var(--ok)' : 'var(--text-3)', transition: 'color .15s', padding: 0 }}
                      onClick={(e) => { e.stopPropagation(); toggleMisi(amalan.id); }}
                    >
                      <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${done ? 'var(--ok)' : 'var(--border-2)'}`, background: done ? 'var(--ok)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '.18s' }}>
                        {done && <svg width="9" height="9" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7.4 5.7 10 11 4.2"/></svg>}
                      </div>
                      {done ? 'Selesai' : 'Tandai selesai'}
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-3)', fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 11 }}>
                      Lihat detail
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Drawer */}
      {selectedAmalan && (
        <AmalanDrawer
          amalan={selectedAmalan}
          waktu={waktuData}
          onClose={() => setSelectedAmalan(null)}
        />
      )}
    </div>
  );
}

export function AmalanPage({ amalanDone, setAmalanDone }) {
  const [activeTab, setActiveTab] = useState('subuh');
  const [drawerAmalan, setDrawerAmalan] = useState(null);

  const currentWaktu = AMALAN_PER_WAKTU.find(w => w.id === activeTab);
  const doneInTab = currentWaktu?.amalan.filter(a => amalanDone?.[a.id]).length || 0;
  const totalInTab = currentWaktu?.amalan.length || 0;

  const closeDrawer = () => setDrawerAmalan(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeDrawer(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="main fade-in">
      <div className="content scrl" style={{ display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h1 className="h1">Amalan Harian</h1>
          <div className="muted tiny" style={{ marginTop: 4 }}>
            {doneInTab} dari {totalInTab} amalan selesai · {currentWaktu?.waktu}
          </div>
          <div style={{ background: 'var(--border)', borderRadius: 999, height: 4, marginTop: 10 }}>
            <div style={{ width: totalInTab ? `${(doneInTab/totalInTab)*100}%` : '0%', height: '100%', borderRadius: 999, background: 'var(--gold)', transition: 'width .5s ease' }} />
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs scrl" style={{ marginBottom: 20, gap: 6 }}>
          {AMALAN_PER_WAKTU.map(w => (
            <button
              key={w.id}
              className={'tab' + (activeTab === w.id ? ' on' : '')}
              onClick={() => { setActiveTab(w.id); setDrawerAmalan(null); }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
            >
              {WAKTU_ICONS[w.id]}
              <span>{w.waktu}</span>
            </button>
          ))}
        </div>

        {/* Waktu header */}
        {currentWaktu && (
          <div className="card" style={{ padding: '14px 18px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ color: 'var(--gold)' }}>{WAKTU_BIG_ICONS[currentWaktu.id]}</div>
            <div>
              <div style={{ fontFamily: 'var(--f-ar)', fontSize: 18, color: 'var(--gold)', direction: 'rtl', marginBottom: 2 }}>{currentWaktu.waktuAr}</div>
              <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{currentWaktu.waktu}</div>
              <div className="muted tiny">{currentWaktu.waktuDesc}</div>
            </div>
          </div>
        )}

        {/* Amalan list */}
        {currentWaktu?.amalan.map((amalan) => {
          const done = !!amalanDone?.[amalan.id];
          const isActive = drawerAmalan?.id === amalan.id;
          return (
            <div
              key={amalan.id}
              className="card"
              style={{
                marginBottom: 8,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                opacity: done ? .65 : 1,
                borderColor: isActive ? 'var(--gold-line)' : undefined,
                background: isActive ? 'var(--gold-soft)' : undefined,
                transition: 'opacity .2s, border-color .15s, background .15s',
              }}
              onClick={() => setDrawerAmalan(isActive ? null : amalan)}
            >
              {/* Checkbox */}
              <div
                style={{ width: 22, height: 22, borderRadius: 7, border: `1.5px solid ${done ? 'var(--gold)' : 'var(--border-2)'}`, background: done ? 'var(--gold)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', transition: '.18s' }}
                onClick={(e) => { e.stopPropagation(); setAmalanDone(prev => ({ ...prev, [amalan.id]: !prev[amalan.id] })); }}
              >
                {done && <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7.4 5.7 10 11 4.2"/></svg>}
              </div>

              {/* Content sejajar */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 14, color: done ? 'var(--text-3)' : 'var(--text)', textDecoration: done ? 'line-through' : 'none', flex: 1, minWidth: 0 }}>
                  {amalan.name}
                </span>
                <span style={{ fontFamily: 'var(--f-ar)', fontSize: 14, color: 'var(--gold)', direction: 'rtl', flexShrink: 0, lineHeight: 1.5 }}>
                  {amalan.nameAr}
                </span>
              </div>

              {/* Arrow indicator */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ color: isActive ? 'var(--gold)' : 'var(--text-3)', flexShrink: 0, transform: isActive ? 'rotate(180deg)' : 'none', transition: 'transform .2s, color .15s' }}>
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          );
        })}
      </div>

      {/* Drawer */}
      {drawerAmalan && (
        <AmalanDrawer
          amalan={drawerAmalan}
          waktu={currentWaktu}
          onClose={closeDrawer}
        />
      )}
    </div>
  );
}

export function AmalanDetailPage({ amalan, waktu, onBack }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bg)', display: 'flex', flexDirection: 'column', zIndex: 20 }}>

      {/* HEADER */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 13, padding: '6px 10px 6px 0', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Kembali
        </button>
        {waktu && <span className="chip" style={{ fontSize: 10, pointerEvents: 'none', flexShrink: 0 }}>{waktu.waktu}</span>}
      </div>

      {/* SCROLLABLE */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>

        {/* HERO */}
        <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '32px 28px 28px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -10, right: -10, fontFamily: 'var(--f-ar)', fontSize: 120, color: 'var(--gold)', opacity: .05, lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>
            {amalan.nameAr}
          </div>
          <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
            <div style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 26, color: 'var(--text)', letterSpacing: '-.02em', marginBottom: 10 }}>
              {amalan.name}
            </div>
            <div style={{ fontFamily: 'var(--f-ar)', fontSize: 22, color: 'var(--gold)', direction: 'rtl', lineHeight: 1.7, textAlign: 'right', opacity: .8 }}>
              {amalan.nameAr}
            </div>
          </div>
        </div>

        {/* BODY */}
        <div style={{ padding: '0 24px 100px', maxWidth: 728, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

          {/* BACAAN */}
          {amalan.bacaan?.map((b, i) => (
            <div key={i} style={{ marginTop: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{ width: 3, height: 16, borderRadius: 2, background: 'var(--gold)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 11, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '.12em' }}>Bacaan {amalan.bacaan.length > 1 ? i + 1 : ''}</span>
                <span className="chip on" style={{ fontSize: 10, padding: '2px 10px', pointerEvents: 'none', marginLeft: 4 }}>{b.jumlah}</span>
              </div>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px 24px 20px', marginBottom: 12, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
                <div style={{ fontFamily: 'var(--f-ar)', fontSize: 30, color: 'var(--gold)', direction: 'rtl', lineHeight: 2.2, marginBottom: 20 }}>
                  {b.ar}
                </div>
                <div style={{ width: 40, height: 1, background: 'var(--border)', margin: '0 auto 20px' }} />
                <div style={{ fontSize: 13, color: 'var(--text-2)', fontStyle: 'italic', lineHeight: 1.9 }}>
                  {b.latin}
                </div>
              </div>
              <div style={{ background: 'var(--elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 3, background: 'var(--gold)', borderRadius: 2, alignSelf: 'stretch', flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 10, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Artinya</div>
                  <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.85 }}>"{b.arti}"</div>
                </div>
              </div>
            </div>
          ))}

          {/* INFO GRID — Cara + Khasiat */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 28 }}>
            <div className="amalan-info-grid-item" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold)' }}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                </div>
                <span style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 12, color: 'var(--text)' }}>Cara Mengamalkan</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.8, margin: 0 }}>{amalan.tuntunan}</p>
            </div>
            <div className="amalan-info-grid-item" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold)' }}><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/></svg>
                </div>
                <span style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 12, color: 'var(--text)' }}>Khasiat & Faedah</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.8, margin: 0 }}>{amalan.khasiat}</p>
            </div>
          </div>

          {/* DALIL */}
          <div style={{ marginTop: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            <div style={{ background: 'var(--elevated)', padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold)' }}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              </div>
              <span style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>Dalil Anjuran</span>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 11, color: 'var(--gold)' }}>{amalan.sumber}</span>
            </div>
            <div style={{ padding: 20 }}>
              <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.9, margin: 0 }}>{amalan.dalil}</p>
            </div>
          </div>

          {/* KEUTAMAAN */}
          <div style={{ marginTop: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ height: 3, background: 'linear-gradient(90deg, var(--gold), var(--gold-2, var(--gold)), transparent)' }} />
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold)' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <span style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>Keutamaan</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.9, margin: 0 }}>{amalan.keutamaan}</p>
            </div>
          </div>

          {/* BACK BUTTON */}
          <button className="btn gold" style={{ width: '100%', padding: 14, fontSize: 14, marginTop: 28 }} onClick={onBack}>
            ← Kembali ke {waktu?.waktu || 'Amalan'}
          </button>

        </div>
      </div>
    </div>
  );
}
