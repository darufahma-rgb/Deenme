// ui.jsx — shared UI: icons, PrayerRing, ScoreRing, Rail, Confetti

export const Icon = {
  dash: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6"/></svg>,
  journal: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6.5A1.5 1.5 0 0 1 5 19.5z"/><path d="M9 3v18"/><path d="M12.5 8.5h3.5M12.5 12h3.5"/></svg>,
  doa: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.5A8 8 0 1 1 10.2 4.3a6.3 6.3 0 0 0 9.8 10.2z"/><path d="M16.5 4.2l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6L14.2 6.5l1.6-.7z"/></svg>,
  stats: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>,
  amalan: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/><path d="M19.5 5.5l1.5-1.5M15 2l.5 2M20 7.5l2-.5"/></svg>,
  logout: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>,
  flame: <svg width="110" height="110" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c2.6 4 5 6.2 5 10.2a5 5 0 0 1-10 0c0-2 .8-3.7 2.1-5.1.2 1.5 1 2.2 1.9 2.4C10.1 7.4 11 4.6 12 2z"/></svg>,
  check: <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7.4 5.7 10 11 4.2"/></svg>,
  bookmark: (on) => <svg width="16" height="16" viewBox="0 0 24 24" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4z"/></svg>,
  chevL: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>,
  chevR: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>,
  snow: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19"/></svg>,
  spark: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6z"/></svg>,
};

export function PrayerRing({ letter, pct = 0, style = 'solid', tone = 'gold', size = 56 }) {
  const cx = 40, cy = 40, r = 29, C = 2 * Math.PI * r;
  const stroke = tone === 'qadha' ? 'var(--danger)' : 'var(--gold)';
  const done = pct >= 1;
  let prog;
  if (style === 'segments') {
    const segs = 18, on = Math.round(pct * segs);
    prog = [...Array(segs)].map((_, i) => {
      const a = (i / segs) * 2 * Math.PI - Math.PI / 2;
      const x1 = cx + (r - 4.5) * Math.cos(a), y1 = cy + (r - 4.5) * Math.sin(a);
      const x2 = cx + (r + 3.5) * Math.cos(a), y2 = cy + (r + 3.5) * Math.sin(a);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={i < on ? stroke : 'var(--border)'}
        strokeWidth="3.2" strokeLinecap="round"
        style={{ transition: 'stroke .22s', transitionDelay: (i * 14) + 'ms' }} />;
    });
  } else {
    prog = <circle cx={cx} cy={cy} r={r} fill="none" stroke={stroke} strokeWidth="4.5" strokeLinecap="round"
      strokeDasharray={C} strokeDashoffset={C * (1 - pct)} transform={`rotate(-90 ${cx} ${cy})`}
      style={{ transition: `stroke-dashoffset var(--ring-dur) cubic-bezier(.2,.8,.25,1)` }} />;
  }
  return (
    <div style={{ width: size, height: size, position: 'relative', flex: '0 0 auto' }}>
      {done && <div style={{ position: 'absolute', inset: -2, borderRadius: '50%',
        boxShadow: tone === 'qadha' ? '0 0 12px -4px var(--danger)' : '0 0 14px -4px var(--gold)', opacity: .5 }} />}
      <svg viewBox="0 0 80 80" width={size} height={size} style={{ position: 'relative', display: 'block' }}>
        {style !== 'segments' &&
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="4.5"
            strokeDasharray={style === 'dashed' ? '1.5 7' : null} />}
        {prog}
        <text x="40" y="41" textAnchor="middle" dominantBaseline="central" fontFamily="var(--f-head)"
          fontWeight="600" fontSize="21" fill={done ? stroke : 'var(--text-3)'}
          style={{ transition: 'fill .3s' }}>{letter}</text>
      </svg>
    </div>
  );
}

export function ScoreRing({ pct = 0, size = 88 }) {
  const cx = 40, cy = 40, r = 30, C = 2 * Math.PI * r;
  return (
    <div style={{ width: size, height: size, position: 'relative', flex: '0 0 auto' }}>
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="5.5" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--gold)" strokeWidth="5.5" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - pct)} transform="rotate(-90 40 40)"
          style={{ transition: 'stroke-dashoffset .7s cubic-bezier(.2,.8,.25,1)' }} />
        <text x="40" y="40" textAnchor="middle" dominantBaseline="central" fontFamily="var(--f-head)"
          fontWeight="600" fontSize="18" fill="var(--text)">{Math.round(pct * 100)}%</text>
      </svg>
    </div>
  );
}

const RAIL_ITEMS = [
  ['dashboard', 'dash',   'Dashboard'],
  ['journal',   'journal','Jurnal'],
  ['doa',       'doa',    'Bank Doa'],
  ['amalan',    'amalan', 'Amalan'],
  ['stats',     'stats',  'Statistik'],
];

export function Rail({ page, go, onLogout }) {
  return (
    <div className="rail">
      <div className="brand">
  <img src="./assets/Deenme_logo.png" alt="Deenme" style={{ width: 34, height: 'auto', filter: 'brightness(0) saturate(100%) invert(55%) sepia(40%) saturate(400%) hue-rotate(90deg)' }} />
</div>
      {RAIL_ITEMS.map(([view, icon, label]) => (
        <button key={view} className={'navbtn' + (page === view ? ' on' : '')} onClick={() => go(view)} aria-label={label}>
          {Icon[icon]}
          <span className="tip">{label}</span>
        </button>
      ))}
      <div style={{ flex: 1 }} />
      <button className="navbtn" onClick={onLogout} aria-label="Keluar">
        {Icon.logout}<span className="tip">Keluar</span>
      </button>
    </div>
  );
}

export function BottomNav({ page, go }) {
  const items = [
    { view: 'dashboard', icon: 'dash',    label: 'Beranda' },
    { view: 'journal',   icon: 'journal', label: 'Jurnal' },
    { view: 'doa',       icon: 'doa',     label: 'Doa' },
    { view: 'amalan',    icon: 'amalan',  label: 'Amalan' },
    { view: 'stats',     icon: 'stats',   label: 'Statistik' },
  ];
  return (
    <nav className="bottom-nav">
      {items.map(({ view, icon, label }) => (
        <button key={view} className={'bnav-btn' + (page === view ? ' on' : '')} onClick={() => go(view)}>
          {Icon[icon]}
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

export function fireConfetti() {
  const layer = document.createElement('div');
  layer.className = 'confetti';
  const colors = ['#d4753a', '#e8894e', '#fbbf24', '#6ee7b7', '#f7f4ed', '#4ade80'];
  for (let i = 0; i < 80; i++) {
    const p = document.createElement('i');
    p.className = 'cft';
    const x = 30 + Math.random() * 40;
    p.style.left = x + 'vw';
    p.style.top = '-20px';
    p.style.background = colors[(Math.random() * colors.length) | 0];
    p.style.opacity = '1';
    const dur = 1.3 + Math.random() * 1.2;
    p.style.animation = `cfall ${dur}s cubic-bezier(.25,.6,.5,1) ${Math.random() * .25}s forwards`;
    p.style.transform = `translateX(${(Math.random() * 220 - 110)}px)`;
    layer.appendChild(p);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 3000);
}
