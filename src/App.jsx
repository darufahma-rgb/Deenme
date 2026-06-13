import { useState, useEffect, useRef } from 'react';
import './deenme-theme.css';
import { Rail, BottomNav, fireConfetti } from './ui.jsx';
import { PRAYERS, SUNNAH, DashboardPage, MISI_PER_SHOLAT, BADGES, computeDailyPoints, getLevel, getRank } from './dashboard.jsx';
import { JournalPage, BankDoaPage, StatistikPage, AmalanPage } from './pages.jsx';
import { LandingPage } from './LandingPage.jsx';
import { supabase } from './supabase.js';
import { AdminPage } from './AdminPage.jsx';

// ── Solo Leveling: floating particles ───────────────────────────────────────
function SLParticles() {
  useEffect(() => {
    const container = document.createElement('div');
    container.className = 'sl-particles';
    document.body.appendChild(container);
    const colors = ['#00b4d8', '#0088bb', '#00cfef', '#004488'];
    for (let i = 0; i < 35; i++) {
      const p = document.createElement('div');
      p.className = 'sl-particle';
      const size = 1.5 + Math.random() * 3;
      p.style.cssText = `
        width:${size}px;height:${size}px;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        --dur:${3 + Math.random() * 4}s;
        --delay:${Math.random() * 4}s;
      `;
      container.appendChild(p);
    }
    return () => container.remove();
  }, []);
  return null;
}

// ── Solo Leveling: XP popup & level-up modal ─────────────────────────────────
function showXPPopup(pts, x, y) {
  const el = document.createElement('div');
  el.className = 'sl-xp-popup';
  el.textContent = `+${pts} XP`;
  el.style.left = (x - 20) + 'px';
  el.style.top  = (y - 10) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

function showLevelUp(rank) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:99;backdrop-filter:blur(4px);';
  const card = document.createElement('div');
  card.className = 'sl-levelup';
  card.innerHTML = `
    <div class="sl-levelup-title">— Rank Up —</div>
    <div class="sl-levelup-rank" style="color:${rank.color}">${rank.rank}</div>
    <div class="sl-levelup-label">${rank.label}</div>
    <button class="btn gold" style="min-width:140px;" onclick="this.closest('[data-levelup]').remove()">Lanjutkan</button>
  `;
  card.dataset.levelup = '1';
  overlay.appendChild(card);
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

// ── Helper: check badge conditions ──────────────────────────────────────────
function checkBadges(misiDone, totalPoints, current) {
  const add = [];
  const rawatibIds = ['subuh-rawatib-qabl','dzuhur-rawatib-qabl','dzuhur-rawatib-bad','maghrib-rawatib-bad','isya-rawatib-bad'];

  const allComplete = Object.values(MISI_PER_SHOLAT).every(({ misi }) => misi.every((m) => misiDone[m.id]));
  if (allComplete && !current.includes('all-misi-complete')) add.push('all-misi-complete');

  if (rawatibIds.every((id) => misiDone[id]) && !current.includes('rawatib-complete')) add.push('rawatib-complete');

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
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);

  const submit = async () => {
    if (code.length < 6 || loading || locked) return;
    setLoading(true);
    setErr(false);

    // Admin login (12 digit)
    if (code.length === 12) {
      const { data } = await supabase
        .from('admin_codes')
        .select('id')
        .eq('code', code)
        .single();
      if (data) { onEnter(null, 'Admin', 'admin'); return; }
      setErr(true);
      setCode('');
      setLoading(false);
      return;
    }

    // Member login (6 digit)
    const { data, error } = await supabase
      .from('member_codes')
      .select('id, name')
      .eq('code', code)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      setErr(true);
      setCode('');
      setLoading(false);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 5) {
        setLocked(true);
        let t = 30;
        setLockTimer(t);
        const interval = setInterval(() => {
          t--;
          setLockTimer(t);
          if (t <= 0) {
            clearInterval(interval);
            setLocked(false);
            setAttempts(0);
          }
        }, 1000);
      }
      return;
    }

    onEnter(data.id, data.name || 'Akhi', 'dashboard');
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
          <input ref={inputRef} value={code} inputMode="numeric" maxLength={12}
            onChange={(e) => { setErr(false); setCode(e.target.value.replace(/\D/g, '').slice(0, 12)); }}
            onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'text' }} aria-label="Kode member" />
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 6 }}>Masukkan kode member · 6 digit</div>
        {err && (
          <div style={{ color: 'var(--danger)', fontSize: 12, fontFamily: 'var(--f-head)', marginTop: 6, textAlign: 'center' }}>
            Kode salah. Coba lagi.
          </div>
        )}
        {locked && (
          <div style={{ color: 'var(--warn)', fontSize: 12, fontFamily: 'var(--f-head)', textAlign: 'center' }}>
            Terlalu banyak percobaan. Tunggu {lockTimer} detik.
          </div>
        )}
        <button className="btn gold" style={{ width: '100%', padding: '12px 18px', marginTop: 6, opacity: (code.length >= 6 && !locked) ? 1 : .5 }}
          onClick={submit} disabled={code.length < 6 || locked}>
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
  const [codeId,   setCodeId]   = useState(() => localStorage.getItem('deenme-code-id') || null);
  const [userName, setUserName] = useState(() => localStorage.getItem('deenme-user-name') || 'Akhi');
  const [view,     setView]     = useState(() => {
    const saved = localStorage.getItem('deenme-code-id');
    return saved ? 'dashboard' : 'landing';
  });

  // App data state — loaded from Supabase after login
  const [prayers,        setPrayers]       = useState({});
  const [times,          setTimes]         = useState({});
  const [sunnah,         setSunnah]        = useState({});
  const [bookmarks,      setBookmarks]     = useState({});
  const [userDoa,        setUserDoa]       = useState([]);
  const [streak,         setStreak]        = useState(0);
  const [freeze,         setFreeze]        = useState(2);
  const [pulse,          setPulse]         = useState(false);
  const [misiDone,       setMisiDone]      = useState({});
  const [totalPoints,    setTotalPoints]   = useState(0);
  const [dailyPoints,    setDailyPoints]   = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [misiPopup,      setMisiPopup]     = useState(null);
  const [badgeToast,     setBadgeToast]    = useState(null);
  const [amalanDone,     setAmalanDone]    = useState({});

  const prevAll = useRef(false);

  // ── Load data from Supabase on login ────────────────────────────────────
  useEffect(() => {
    if (!codeId) return;
    const load = async () => {
      const { data } = await supabase
        .from('user_data')
        .select('data')
        .eq('code_id', codeId)
        .single();
      if (data?.data) {
        const d = data.data;
        const lastDate = d.lastSaved ? new Date(d.lastSaved).toDateString() : null;
        const today = new Date().toDateString();
        const isNewDay = lastDate !== today;
        if (!isNewDay) {
          if (d.prayers)   setPrayers(d.prayers);
          if (d.times)     setTimes(d.times);
          if (d.sunnah)    setSunnah(d.sunnah);
          if (d.misiDone)  setMisiDone(d.misiDone);
          if (d.dailyPoints !== undefined) setDailyPoints(d.dailyPoints);
        }
        if (d.amalanDone && !isNewDay) setAmalanDone(d.amalanDone);
        if (d.bookmarks)      setBookmarks(d.bookmarks);
        if (d.userDoa)        setUserDoa(d.userDoa);
        if (d.streak !== undefined)       setStreak(d.streak);
        if (d.freeze !== undefined)       setFreeze(d.freeze);
        if (d.totalPoints !== undefined)  setTotalPoints(d.totalPoints);
        if (d.unlockedBadges)             setUnlockedBadges(d.unlockedBadges);
      }
    };
    load();
  }, [codeId]);

  // ── Save data to Supabase (debounced 2 seconds) ──────────────────────────
  useEffect(() => {
    if (!codeId) return;
    const timeout = setTimeout(async () => {
      const payload = {
        prayers, times, sunnah, bookmarks, userDoa,
        streak, freeze, totalPoints, dailyPoints, unlockedBadges, misiDone, amalanDone,
        lastSaved: new Date().toISOString(),
      };
      await supabase
        .from('user_data')
        .upsert({ code_id: codeId, data: payload }, { onConflict: 'code_id' });
    }, 2000);
    return () => clearTimeout(timeout);
  }, [prayers, times, sunnah, bookmarks, userDoa, streak, freeze, totalPoints, dailyPoints, unlockedBadges, misiDone, amalanDone]);

  // Score
  const score = (PRAYERS.filter((p) => prayers[p.k]).length / 5) * 0.7
    + (SUNNAH.filter((s) => sunnah[s]).length / 6) * 0.3;

  // All-prayer confetti
  useEffect(() => {
    const all = PRAYERS.every((p) => prayers[p.k]);
    if (all && !prevAll.current) { fireConfetti(); setPulse(true); setTimeout(() => setPulse(false), 700); }
    prevAll.current = all;
  }, [prayers]);

  // ── Auth handlers ────────────────────────────────────────────────────────
  const onEnter = (id, name, destination) => {
    if (id) localStorage.setItem('deenme-code-id', id);
    localStorage.setItem('deenme-user-name', name);
    setCodeId(id);
    setUserName(name);
    setView(destination);
  };

  const onLogout = () => {
    localStorage.removeItem('deenme-code-id');
    localStorage.removeItem('deenme-user-name');
    setCodeId(null);
    setPrayers({}); setTimes({}); setSunnah({}); setBookmarks({});
    setUserDoa([]); setStreak(0); setFreeze(2); setMisiDone({});
    setTotalPoints(0); setDailyPoints(0); setUnlockedBadges([]); setAmalanDone({});
    setView('landing');
  };

  // ── Handlers ─────────────────────────────────────────────────────────────
  const setStatus = (k, val) => {
    setPrayers((p) => { const n = { ...p }; if (val) n[k] = val; else delete n[k]; return n; });

    if (val) {
      const now = new Date();
      const wibTime = now.toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      setTimes((tm) => ({ ...tm, [k]: wibTime }));
    } else {
      setTimes((tm) => { const n = { ...tm }; delete n[k]; return n; });
    }

    if (val === 'ok' || val === 'late') setMisiPopup(k);
    if (!val) setMisiPopup(null);
  };

  const setTime        = (k, v) => setTimes((tm) => ({ ...tm, [k]: v }));
  const toggleSunnah   = (s) => setSunnah((x) => ({ ...x, [s]: !x[s] }));
  const toggleBookmark = (key) => setBookmarks((b) => ({ ...b, [key]: !b[key] }));
  const addDoa         = (d) => setUserDoa((u) => [d, ...u]);
  const useFreeze      = () => setFreeze((f) => Math.max(0, f - 1));

  const onMisiToggle = (id) => {
    setMisiDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };

      const dp    = computeDailyPoints(next);
      const oldDp = computeDailyPoints(prev);
      setDailyPoints(dp);

      const delta = dp - oldDp;
      setTotalPoints((tp) => {
        const newTp = Math.max(0, tp + delta);

        // XP popup — muncul di tengah layar saat quest selesai
        if (delta > 0) {
          showXPPopup(delta, window.innerWidth / 2, window.innerHeight / 3);
        }

        // Level up detection — cek apakah rank naik
        const oldRank = getRank(tp);
        const newRank = getRank(newTp);
        if (newRank.rank !== oldRank.rank && delta > 0) {
          setTimeout(() => showLevelUp(newRank), 400);
        }

        const newBadges = checkBadges(next, newTp, unlockedBadges);
        if (newBadges.length > 0) {
          setUnlockedBadges((ub) => {
            const merged = [...ub, ...newBadges];
            const badge  = BADGES.find((b) => b.id === newBadges[0]);
            if (badge) setBadgeToast(badge);
            return merged;
          });
        }
        return newTp;
      });

      return next;
    });
  };

  // ── Render ───────────────────────────────────────────────────────────────
  if (view === 'landing') {
    return (
      <div className="deenme-root" style={{ overflow: 'auto', height: '100dvh' }}>
        <SLParticles />
        <LandingPage onEnter={() => setView('login')} />
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="deenme-root">
        <SLParticles />
        <div className="candle" />
        <LoginPage onEnter={onEnter} />
      </div>
    );
  }

  if (view === 'admin') {
    return (
      <div className="deenme-root">
        <SLParticles />
        <div className="candle" />
        <AdminPage onLogout={onLogout} />
      </div>
    );
  }

  return (
    <div className="deenme-root">
      <SLParticles />
      <div className="candle" />
      <div className="app">
        <Rail page={view} go={setView} onLogout={onLogout} />

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
            userName={userName}
          />}

        {view === 'journal' && <JournalPage go={setView} />}
        {view === 'doa'     && <BankDoaPage bookmarks={bookmarks} toggleBookmark={toggleBookmark} userDoa={userDoa} addDoa={addDoa} />}
        {view === 'amalan'  && <AmalanPage amalanDone={amalanDone} setAmalanDone={setAmalanDone} />}
        {view === 'stats'   && <StatistikPage streak={streak} freeze={freeze} useFreeze={useFreeze} prayers={prayers} sunnah={sunnah} misiDone={misiDone} amalanDone={amalanDone} setAmalanDone={setAmalanDone} />}
      </div>
      <BottomNav page={view} go={setView} />
    </div>
  );
}
