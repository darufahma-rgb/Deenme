import { useState, useEffect, useMemo, useRef } from 'react';
import './deenme-theme.css';
import { Rail, BottomNav, fireConfetti } from './ui.jsx';
import { PRAYERS, SUNNAH, DashboardPage, MISI_PER_SHOLAT, BADGES, computeDailyPoints, getLevel } from './dashboard.jsx';
import { JournalPage, BankDoaPage, StatistikPage, AmalanPage } from './pages.jsx';

const LS_KEY = 'deenme-state-v1';
const TODAY  = new Date().toISOString().slice(0, 10);

const loadState = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; } };

const DEFAULTS = {
  prayers: {},
  times: {},
  sunnah: {},
  bookmarks: {},
  userDoa: [],
  streak: 0,
  freeze: 2,
  misiDone: {},
  totalPoints: 0,
  dailyPoints: 0,
  unlockedBadges: [],
  lastDate: TODAY,
};

// ── Helper: check badge conditions ──────────────────────────────────────────
function checkBadges(misiDone, totalPoints, current) {
  const add = [];
  const rawatibIds = ['subuh-rawatib-qabl','dzuhur-rawatib-qabl','dzuhur-rawatib-bad','maghrib-rawatib-bad','isya-rawatib-bad'];

  // all-misi-complete: all missions done today
  const allComplete = Object.values(MISI_PER_SHOLAT).every(({ misi }) => misi.every((m) => misiDone[m.id]));
  if (allComplete && !current.includes('all-misi-complete')) add.push('all-misi-complete');

  // rawatib-complete
  if (rawatibIds.every((id) => misiDone[id]) && !current.includes('rawatib-complete')) add.push('rawatib-complete');

  // points-based badges
  BADGES.filter((b) => b.condition.type === 'points').forEach((b) => {
    if (totalPoints >= b.condition.points && !current.includes(b.id)) add.push(b.id);
  });

  return add;
}

// ── Login Page ───────────────────────────────────────────────────────────────
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
      <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 20, opacity: 0 }}>&nbsp;</div>
    </div>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const saved = useMemo(loadState, []);

  // Daily reset: if lastDate !== today, reset misiDone + dailyPoints
  const isNewDay = saved.lastDate !== TODAY;
  const init = {
    ...DEFAULTS,
    ...saved,
    misiDone:    isNewDay ? {} : (saved.misiDone    || {}),
    dailyPoints: isNewDay ? 0  : (saved.dailyPoints || 0),
    lastDate: TODAY,
  };

  const [view,          setView]         = useState('login');
  const [prayers,       setPrayers]      = useState(init.prayers);
  const [times,         setTimes]        = useState(init.times);
  const [sunnah,        setSunnah]       = useState(init.sunnah);
  const [bookmarks,     setBookmarks]    = useState(init.bookmarks);
  const [userDoa,       setUserDoa]      = useState(init.userDoa);
  const [streak]                         = useState(init.streak);
  const [freeze,        setFreeze]       = useState(init.freeze);
  const [pulse,         setPulse]        = useState(false);

  // Mission & Reward state
  const [misiDone,      setMisiDone]     = useState(init.misiDone);
  const [totalPoints,   setTotalPoints]  = useState(init.totalPoints);
  const [dailyPoints,   setDailyPoints]  = useState(init.dailyPoints);
  const [unlockedBadges, setUnlockedBadges] = useState(init.unlockedBadges);
  const [misiPopup,     setMisiPopup]    = useState(null);
  const [badgeToast,    setBadgeToast]   = useState(null);

  const prevAll = useRef(PRAYERS.every((p) => init.prayers[p.k]));

  // Persist state
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({
      prayers, times, sunnah, bookmarks, userDoa, streak, freeze,
      misiDone, totalPoints, dailyPoints, unlockedBadges, lastDate: TODAY,
    }));
  }, [prayers, times, sunnah, bookmarks, userDoa, freeze, misiDone, totalPoints, dailyPoints, unlockedBadges]);

  // Score
  const score = (PRAYERS.filter((p) => prayers[p.k]).length / 5) * 0.7
    + (SUNNAH.filter((s) => sunnah[s]).length / 6) * 0.3;

  // All-prayer confetti
  useEffect(() => {
    const all = PRAYERS.every((p) => prayers[p.k]);
    if (all && !prevAll.current) { fireConfetti(); setPulse(true); setTimeout(() => setPulse(false), 700); }
    prevAll.current = all;
  }, [prayers]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const setStatus = (k, val) => {
    setPrayers((p) => { const n = { ...p }; if (val) n[k] = val; else delete n[k]; return n; });
    // Trigger mission popup on Tepat or Telat (not Qadha, not unset)
    if (val === 'ok' || val === 'late') setMisiPopup(k);
    if (!val) setMisiPopup(null);
  };

  const setTime      = (k, v) => setTimes((tm) => ({ ...tm, [k]: v }));
  const toggleSunnah = (s) => setSunnah((x) => ({ ...x, [s]: !x[s] }));
  const toggleBookmark = (key) => setBookmarks((b) => ({ ...b, [key]: !b[key] }));
  const addDoa       = (d) => setUserDoa((u) => [d, ...u]);
  const useFreeze    = () => setFreeze((f) => Math.max(0, f - 1));

  // Toggle a mission item and recalculate points + check badges
  const onMisiToggle = (id) => {
    setMisiDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };

      // Recalculate daily points from scratch
      const dp = computeDailyPoints(next);
      setDailyPoints(dp);

      // Increment total points by the delta
      const oldDp = computeDailyPoints(prev);
      const delta = dp - oldDp;
      setTotalPoints((tp) => {
        const newTp = Math.max(0, tp + delta);

        // Check badges after total points update
        const newBadges = checkBadges(next, newTp, unlockedBadges);
        if (newBadges.length > 0) {
          setUnlockedBadges((ub) => {
            const merged = [...ub, ...newBadges];
            // Show toast for the first new badge
            const badge = BADGES.find((b) => b.id === newBadges[0]);
            if (badge) setBadgeToast(badge);
            return merged;
          });
        }
        return newTp;
      });

      return next;
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────
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
          <DashboardPage
            prayers={prayers} times={times} sunnah={sunnah}
            setStatus={setStatus} setTime={setTime} toggleSunnah={toggleSunnah}
            score={score} ring="solid" streak={streak} freeze={freeze}
            useFreeze={useFreeze} pulse={pulse} go={setView}
            misiDone={misiDone} onMisiToggle={onMisiToggle}
            dailyPoints={dailyPoints} totalPoints={totalPoints}
            misiPopup={misiPopup} setMisiPopup={setMisiPopup}
            badgeToast={badgeToast} clearBadgeToast={() => setBadgeToast(null)}
          />}

        {view === 'journal' && <JournalPage go={setView} />}
        {view === 'doa'     && <BankDoaPage bookmarks={bookmarks} toggleBookmark={toggleBookmark} userDoa={userDoa} addDoa={addDoa} />}
        {view === 'amalan'  && <AmalanPage />}
        {view === 'stats'   && <StatistikPage streak={streak} freeze={freeze} useFreeze={useFreeze} totalPoints={totalPoints} unlockedBadges={unlockedBadges} />}
      </div>
      <BottomNav page={view} go={setView} />
    </div>
  );
}
