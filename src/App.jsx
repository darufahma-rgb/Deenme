import { useState, useEffect, useRef } from 'react';
import './deenme-theme.css';
import { Rail, BottomNav, fireConfetti } from './ui.jsx';
import { PRAYERS, SUNNAH, DashboardPage, MISI_PER_SHOLAT, BADGES, computeDailyPoints, getLevel, getRank } from './dashboard.jsx';
import { JournalPage, BankDoaPage, StatistikPage, AmalanPage, PrayerAmalanPage } from './pages.jsx';
import { LandingPage } from './LandingPage.jsx';
import { getToken, setToken, clearToken, serverFetch } from './api.js';
import { AdminPage } from './AdminPage.jsx';
import { ProfilePage } from './ProfilePage.jsx';
import { OnboardingOverlay } from './OnboardingPage.jsx';

// ── Solo Leveling: page transition ───────────────────────────────────────────
function PageTransition({ viewKey, children }) {
  const [displayKey, setDisplayKey] = useState(viewKey);
  const [cls, setCls] = useState('');
  const [flash, setFlash] = useState(false);
  const [line, setLine] = useState(false);
  const nextKey = useRef(viewKey);

  useEffect(() => {
    if (viewKey === displayKey) return;
    nextKey.current = viewKey;
    setCls('sl-pg-exit');
    setFlash(true);
    setLine(true);
    const t1 = setTimeout(() => {
      setDisplayKey(nextKey.current);
      setCls('sl-pg-enter');
    }, 180);
    const t2 = setTimeout(() => {
      setCls('');
      setFlash(false);
      setLine(false);
    }, 180 + 320);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [viewKey]);

  return (
    <>
      {flash && <div className="sl-pg-flash" />}
      {line  && <div className="sl-pg-line"  />}
      <div className={'sl-pg-wrap ' + cls}>
        {children(displayKey)}
      </div>
    </>
  );
}

// ── Solo Leveling: floating particles — off for light mode ───────────────────
function SLParticles() { return null; }
function _SLParticles_disabled() {
  useEffect(() => {
    const container = document.createElement('div');
    container.className = 'sl-particles';
    document.body.appendChild(container);
    const colors = ['#4f772d', '#90a955', '#ecf39e', '#31572c'];
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
function checkBadges(misiDone, totalPoints, streak, sunnah, unlockedBadges, bookmarks) {
  const add = [];
  const cur = unlockedBadges || [];

  const has = (id) => cur.includes(id);
  const push = (id) => { if (!has(id)) add.push(id); };

  // Rawatib complete
  const rawatibIds = ['subuh-rawatib-qabl','dzuhur-rawatib-qabl','dzuhur-rawatib-bad','maghrib-rawatib-bad','isya-rawatib-bad'];
  if (rawatibIds.every(id => misiDone[id])) push('rawatib-complete');

  // All misi complete
  const allComplete = Object.values(MISI_PER_SHOLAT).every(({ misi }) => misi.every(m => misiDone[m.id]));
  if (allComplete) push('all-misi-complete');

  // Points / rank badges
  BADGES.filter(b => b.condition.type === 'points').forEach(b => {
    if (totalPoints >= b.condition.points) push(b.id);
  });

  // Streak badges
  BADGES.filter(b => b.condition.type === 'streak').forEach(b => {
    if (streak >= b.condition.streak) push(b.id);
  });

  // Dhuha sunnah
  if ((sunnah?.['Dhuha'] || 0) >= 7) push('dhuha-7');

  // Bookmark badges
  const bmCount = Object.values(bookmarks || {}).filter(Boolean).length;
  if (bmCount >= 5) push('bookmark-5');

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

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (res.status === 429) {
        setErr(true);
        setLocked(true);
        setLockTimer(900);
        const interval = setInterval(() => {
          setLockTimer(t => {
            if (t <= 1) { clearInterval(interval); setLocked(false); return 0; }
            return t - 1;
          });
        }, 1000);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setErr(true);
        setCode('');
        setLoading(false);
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 5) {
          setLocked(true);
          let t = 60;
          setLockTimer(t);
          const interval = setInterval(() => {
            t--;
            setLockTimer(t);
            if (t <= 0) { clearInterval(interval); setLocked(false); setAttempts(0); }
          }, 1000);
        }
        return;
      }

      const data = await res.json();
      setToken(data.token);
      localStorage.setItem('deenme-user-name', data.name);
      if (data.codeId) localStorage.setItem('deenme-code-id', data.codeId);
      onEnter(data.codeId, data.name, data.role === 'admin' ? 'admin' : 'dashboard');
    } catch {
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="authcard fade-in">
        <div className="authlogo">
          <img
            src="/assets/Deenme_logo.png"
            alt="Deenme"
            style={{
              width: 44,
              height: 'auto',
              filter: 'brightness(0) saturate(100%) invert(28%) sepia(30%) saturate(800%) hue-rotate(95deg) brightness(85%)',
            }}
          />
        </div>
        <div className="ar" style={{ fontSize: 22, marginTop: 2 }}>مَرْحَبًا بِعَوْدَتِكَ</div>
        <div className="muted tiny" style={{ marginBottom: 8 }}>Welcome back</div>
        <div style={{ position: 'relative', margin: '6px 0' }}>
          {code.length <= 6 ? (
            <>
              <div className={'pin' + (err ? ' pinerr' : '')}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={'pincell' + (i < code.length ? ' fill' : '') + (i === code.length && !loading ? ' active' : '')}>
                    {i < code.length ? '•' : ''}
                  </div>
                ))}
              </div>
              <input ref={inputRef} value={code} inputMode="numeric" maxLength={32}
                onChange={(e) => { setErr(false); setCode(e.target.value.slice(0, 32)); }}
                onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'text' }} aria-label="Kode" />
            </>
          ) : (
            <input ref={inputRef} value={code} maxLength={32}
              onChange={(e) => { setErr(false); setCode(e.target.value.slice(0, 32)); }}
              onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'var(--surface)', border: `1.5px solid ${err ? 'var(--danger)' : 'var(--border)'}`,
                borderRadius: 10, padding: '11px 14px', fontSize: 15,
                color: 'var(--text)', fontFamily: 'monospace', letterSpacing: '0.1em',
                outline: 'none',
              }}
              aria-label="Kode" autoFocus />
          )}
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

// ── Timezone Options ─────────────────────────────────────────────────────────
const TIMEZONE_OPTIONS = [
  { value: 'Asia/Jakarta', label: 'Tangerang / WIB', flag: '🇮🇩', offset: 'UTC+7' },
  { value: 'Africa/Cairo', label: 'Cairo / EEST',    flag: '🇪🇬', offset: 'UTC+3' },
];

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [codeId,   setCodeId]   = useState(null);
  const [userName, setUserName] = useState(() => localStorage.getItem('deenme-user-name') || 'Akhi');
  const [view,     setView]     = useState('landing');

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
  const [badgeToast,     setBadgeToast]    = useState(null);
  const [amalanDone,     setAmalanDone]    = useState({});
  const [activePrayerCard, setActivePrayerCard] = useState(null);
  const [qadhaDebt,      setQadhaDebt]     = useState(() => {
    try { return JSON.parse(localStorage.getItem('deenme-qadha') || '{}'); }
    catch { return {}; }
  });
  const [timezone, setTimezone] = useState(
    () => localStorage.getItem('deenme-timezone') || 'Asia/Jakarta'
  );
  const changeTimezone = (tz) => {
    setTimezone(tz);
    localStorage.setItem('deenme-timezone', tz);
  };
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasOnboarded,   setHasOnboarded]   = useState(false);

  const prevAll = useRef(false);

  // ── Validate existing token on mount (auto-login) ────────────────────────
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    serverFetch('/api/auth/me').then(async res => {
      if (res.ok) {
        const me = await res.json();
        setCodeId(me.codeId);
        const savedName = localStorage.getItem('deenme-user-name') || me.name || 'Akhi';
        setUserName(savedName);
        setView(me.role === 'admin' ? 'admin' : 'dashboard');
      } else {
        clearToken();
      }
    }).catch(() => clearToken());
  }, []);

  // ── Load data from server on login ───────────────────────────────────────
  useEffect(() => {
    if (!codeId) return;
    const load = async () => {
      const res = await serverFetch('/api/user/data');
      if (!res.ok) return;
      const { data } = await res.json();
      if (!data || !data.hasOnboarded) {
        setShowOnboarding(true);
        if (!data) return;
      } else {
        setHasOnboarded(true);
      }
      const d = data;
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
      if (d.qadhaDebt)      setQadhaDebt(d.qadhaDebt);
      if (d.bookmarks)      setBookmarks(d.bookmarks);
      if (d.userDoa)        setUserDoa(d.userDoa);
      if (d.streak !== undefined)       setStreak(d.streak);
      if (d.freeze !== undefined)       setFreeze(d.freeze);
      if (d.totalPoints !== undefined)  setTotalPoints(d.totalPoints);
      if (d.unlockedBadges)             setUnlockedBadges(d.unlockedBadges);
    };
    load();
  }, [codeId]);

  // ── Save data to server (debounced 2 seconds) ────────────────────────────
  useEffect(() => {
    if (!codeId) return;
    const timeout = setTimeout(async () => {
      const payload = {
        prayers, times, sunnah, bookmarks, userDoa,
        streak, freeze, totalPoints, dailyPoints, unlockedBadges, misiDone, amalanDone, qadhaDebt,
        hasOnboarded,
        lastSaved: new Date().toISOString(),
      };
      await serverFetch('/api/user/data', {
        method: 'POST',
        body: JSON.stringify({ payload }),
      });
    }, 2000);
    return () => clearTimeout(timeout);
  }, [prayers, times, sunnah, bookmarks, userDoa, streak, freeze, totalPoints, dailyPoints, unlockedBadges, misiDone, amalanDone, hasOnboarded]);

  // Qadha helpers
  const addQadha = (prayer, amount = 1) => {
    setQadhaDebt(prev => {
      const next = { ...prev, [prayer]: (prev[prayer] || 0) + amount };
      localStorage.setItem('deenme-qadha', JSON.stringify(next));
      return next;
    });
  };
  const lunasiQadha = (prayer) => {
    setQadhaDebt(prev => {
      if (!prev[prayer] || prev[prayer] <= 0) return prev;
      const next = { ...prev, [prayer]: prev[prayer] - 1 };
      localStorage.setItem('deenme-qadha', JSON.stringify(next));
      return next;
    });
  };
  const totalQadha = Object.values(qadhaDebt).reduce((a, b) => a + (b || 0), 0);

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

  const onUpdateName = (newName) => {
    setUserName(newName);
    localStorage.setItem('deenme-user-name', newName);
  };

  const onLogout = async () => {
    // Flush any pending debounced save immediately before clearing state
    if (codeId) {
      try {
        await serverFetch('/api/user/data', {
          method: 'POST',
          body: JSON.stringify({
            payload: {
              prayers, times, sunnah, bookmarks, userDoa,
              streak, freeze, totalPoints, dailyPoints,
              unlockedBadges, misiDone, amalanDone, qadhaDebt,
              hasOnboarded,
              lastSaved: new Date().toISOString(),
            },
          }),
        });
      } catch { /* best-effort, proceed with logout regardless */ }
    }
    clearToken();
    localStorage.removeItem('deenme-code-id');
    localStorage.removeItem('deenme-user-name');
    setCodeId(null);
    setPrayers({}); setTimes({}); setSunnah({}); setBookmarks({});
    setUserDoa([]); setStreak(0); setFreeze(2); setMisiDone({});
    setTotalPoints(0); setDailyPoints(0); setUnlockedBadges([]); setAmalanDone({});
    setHasOnboarded(false);
    setShowOnboarding(false);
    setView('landing');
  };

  const onOnboardingDone = (selectedTz) => {
    const tzValue = selectedTz === 'EG' ? 'Africa/Cairo' : 'Asia/Jakarta';
    setTimezone(tzValue);
    localStorage.setItem('deenme-timezone', tzValue);
    setHasOnboarded(true);
    setShowOnboarding(false);
  };

  // ── Handlers ─────────────────────────────────────────────────────────────
  const setStatus = (k, val) => {
    setPrayers((p) => { const n = { ...p }; if (val) n[k] = val; else delete n[k]; return n; });

    if (val) {
      const now = new Date();
      const wibTime = now.toLocaleTimeString('id-ID', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      setTimes((tm) => ({ ...tm, [k]: wibTime }));
    } else {
      setTimes((tm) => { const n = { ...tm }; delete n[k]; return n; });
    }

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

        const newBadges = checkBadges(next, newTp, streak, sunnah, unlockedBadges, bookmarks);
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
  if (activePrayerCard) {
    return (
      <div className="deenme-root">
        <SLParticles />
        <PrayerAmalanPage
          card={activePrayerCard}
          misiDone={misiDone}
          toggleMisi={onMisiToggle}
          onBack={() => setActivePrayerCard(null)}
        />
      </div>
    );
  }

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
    <>
      <div className="deenme-root">
        <SLParticles />
        <div className="candle" />
        <div className="app">
          <Rail page={view} go={setView} onLogout={onLogout} timezone={timezone} changeTimezone={changeTimezone} timezoneOptions={TIMEZONE_OPTIONS} />
          <PageTransition viewKey={view}>
            {(v) => (<>
              {v === 'dashboard' &&
                <DashboardPage
                  prayers={prayers} times={times} sunnah={sunnah}
                  setStatus={setStatus} setTime={setTime} toggleSunnah={toggleSunnah}
                  score={score} ring="solid" streak={streak} freeze={freeze}
                  useFreeze={useFreeze} pulse={pulse} go={setView}
                  misiDone={misiDone} onMisiToggle={onMisiToggle} toggleMisi={onMisiToggle}
                  dailyPoints={dailyPoints} totalPoints={totalPoints}
                  badgeToast={badgeToast} clearBadgeToast={() => setBadgeToast(null)}
                  userName={userName}
                  onPrayerCardClick={setActivePrayerCard}
                  timezone={timezone} changeTimezone={changeTimezone} timezoneOptions={TIMEZONE_OPTIONS}
                />}
              {v === 'journal' && <JournalPage go={setView} codeId={codeId} />}
              {v === 'doa'     && <BankDoaPage bookmarks={bookmarks} toggleBookmark={toggleBookmark} userDoa={userDoa} addDoa={addDoa} codeId={codeId} />}
              {v === 'amalan'  && <AmalanPage amalanDone={amalanDone} setAmalanDone={setAmalanDone} />}
              {v === 'stats'   && <StatistikPage streak={streak} freeze={freeze} useFreeze={useFreeze} prayers={prayers} times={times} sunnah={sunnah} misiDone={misiDone} amalanDone={amalanDone} setAmalanDone={setAmalanDone} qadhaDebt={qadhaDebt} addQadha={addQadha} lunasiQadha={lunasiQadha} totalQadha={totalQadha} />}
              {v === 'profile' && <ProfilePage userName={userName} codeId={codeId} totalPoints={totalPoints} streak={streak} freeze={freeze} prayers={prayers} misiDone={misiDone} unlockedBadges={unlockedBadges} onUpdateName={onUpdateName} onLogout={onLogout} />}
            </>)}
          </PageTransition>
        </div>
        <BottomNav page={view} go={setView} />
      </div>

      {showOnboarding && (
        <OnboardingOverlay userName={userName} onDone={onOnboardingDone} />
      )}
    </>
  );
}
