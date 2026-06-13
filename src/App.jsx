import { useState, useEffect, useMemo, useRef } from 'react';
import './deenme-theme.css';
import { Rail, fireConfetti } from './ui.jsx';
import { PRAYERS, SUNNAH, DashboardPage } from './dashboard.jsx';
import { JournalPage, BankDoaPage, StatistikPage, AmalanPage } from './pages.jsx';

const LS_KEY = 'deenme-state-v4';
const loadState = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; } };

const DEFAULTS = {
  prayers: { subuh: 'ok', dzuhur: 'late', ashar: 'ok' },
  times: { subuh: '04:48', dzuhur: '12:05', ashar: '15:22' },
  sunnah: { 'Rawatib Subuh': true, 'Dhuha': true },
  bookmarks: { 'رَبِّ زِدْنِي عِلْمًاQS. Thaha: 114': true },
  userDoa: [], streak: 12, freeze: 2,
};

function LoginPage({ onEnter }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);
  const submit = () => {
    if (code.length < 6 || loading) return;
    setLoading(true); setErr(false);
    setTimeout(() => { onEnter(); }, 950);
  };
  return (
    <div className="login">
      <div className="authcard fade-in">
        <div className="authlogo">د</div>
        <div style={{ fontFamily: 'var(--f-head)', fontWeight: 500, fontSize: 32, letterSpacing: '-.01em', color: 'var(--text)', marginTop: 2 }}>Deenme</div>
        <div className="ar" style={{ fontSize: 22, marginTop: 2 }}>مَرْحَبًا بِعَوْدَتِكَ</div>
        <div className="muted tiny" style={{ marginBottom: 8 }}>Welcome back</div>
        <div style={{ position: 'relative', margin: '6px 0' }}>
          <div className={'pin' + (err ? ' pinerr' : '')}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={'pincell' + (i < code.length ? ' fill' : '') + (i === code.length && !loading ? ' active' : '')}>
                {i < code.length ? '•' : ''}
              </div>
            ))}
          </div>
          <input ref={inputRef} value={code} inputMode="numeric" maxLength={6}
            onChange={(e) => { setErr(false); setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); }}
            onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'text' }} aria-label="Kode member" />
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 6 }}>Masukkan kode member · 6 digit</div>
        <button className="btn gold" style={{ width: '100%', padding: '12px 18px', opacity: code.length === 6 ? 1 : .5 }}
          onClick={submit} disabled={code.length < 6}>
          {loading ? <span className="spin" /> : 'Masuk'}
        </button>
        <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 16, letterSpacing: '.04em' }}>Deenme · Dar Dev</div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 20, opacity: .7 }}>Tip: ketik 6 digit apa saja untuk masuk demo</div>
    </div>
  );
}

export default function App() {
  const saved = useMemo(loadState, []);
  const init = { ...DEFAULTS, ...saved };
  const [view, setView] = useState('login');
  const [prayers, setPrayers] = useState(init.prayers);
  const [times, setTimes] = useState(init.times);
  const [sunnah, setSunnah] = useState(init.sunnah);
  const [bookmarks, setBookmarks] = useState(init.bookmarks);
  const [userDoa, setUserDoa] = useState(init.userDoa);
  const [streak] = useState(init.streak);
  const [freeze, setFreeze] = useState(init.freeze);
  const [pulse, setPulse] = useState(false);
  const prevAll = useRef(PRAYERS.every((p) => init.prayers[p.k]));

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({ prayers, times, sunnah, bookmarks, userDoa, streak, freeze }));
  }, [prayers, times, sunnah, bookmarks, userDoa, freeze]);

  const score = (PRAYERS.filter((p) => prayers[p.k]).length / 5) * 0.7
    + (SUNNAH.filter((s) => sunnah[s]).length / 6) * 0.3;

  const setStatus = (k, val) => {
    setPrayers((p) => { const n = { ...p }; if (val) n[k] = val; else delete n[k]; return n; });
    if (val) setTimes((tm) => tm[k] ? tm : { ...tm, [k]: PRAYERS.find((p) => p.k === k).sched });
  };
  const setTime = (k, v) => setTimes((tm) => ({ ...tm, [k]: v }));
  const toggleSunnah = (s) => setSunnah((x) => ({ ...x, [s]: !x[s] }));
  const toggleBookmark = (key) => setBookmarks((b) => ({ ...b, [key]: !b[key] }));
  const addDoa = (d) => setUserDoa((u) => [d, ...u]);
  const useFreeze = () => setFreeze((f) => Math.max(0, f - 1));

  useEffect(() => {
    const all = PRAYERS.every((p) => prayers[p.k]);
    if (all && !prevAll.current) { fireConfetti(); setPulse(true); setTimeout(() => setPulse(false), 700); }
    prevAll.current = all;
  }, [prayers]);

  if (view === 'login') {
    return (
      <div className="deenme-root">
        <div className="candle" />
        <LoginPage onEnter={() => setView('dashboard')} />
      </div>
    );
  }

  return (
    <div className="deenme-root">
      <div className="candle" />
      <div className="app">
        <Rail page={view} go={setView} onLogout={() => setView('login')} />
        {view === 'dashboard' &&
          <DashboardPage prayers={prayers} times={times} sunnah={sunnah} setStatus={setStatus} setTime={setTime}
            toggleSunnah={toggleSunnah} score={score} ring="solid" streak={streak} freeze={freeze}
            useFreeze={useFreeze} pulse={pulse} go={setView} />}
        {view === 'journal' && <JournalPage go={setView} />}
        {view === 'doa' && <BankDoaPage bookmarks={bookmarks} toggleBookmark={toggleBookmark} userDoa={userDoa} addDoa={addDoa} />}
        {view === 'amalan' && <AmalanPage />}
        {view === 'stats' && <StatistikPage streak={streak} freeze={freeze} useFreeze={useFreeze} />}
      </div>
    </div>
  );
}
