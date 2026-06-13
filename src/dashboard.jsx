// dashboard.jsx — Dashboard layout + vertical-list prayer tracker with accordion detail
import { useState } from 'react';
import { Icon, PrayerRing, ScoreRing } from './ui.jsx';

export const PRAYERS = [
  { k: 'subuh',   id: 'Subuh',   ar: 'الفجر',   sched: '04:42' },
  { k: 'dzuhur',  id: 'Dzuhur',  ar: 'الظهر',   sched: '11:54' },
  { k: 'ashar',   id: 'Ashar',   ar: 'العصر',   sched: '15:18' },
  { k: 'maghrib', id: 'Maghrib', ar: 'المغرب',  sched: '17:58' },
  { k: 'isya',    id: 'Isya',    ar: 'العشاء',  sched: '19:09' },
];
export const SUNNAH = ['Rawatib Subuh', 'Dhuha', 'Rawatib Dzuhur', 'Rawatib Maghrib', 'Tahajud', 'Witir'];
const STATUS = [['ok', 'Tepat'], ['late', 'Telat'], ['qadha', 'Qadha']];

// ── Prayer-specific content ──────────────────────────────────────────────────
const DETAIL = {
  subuh: {
    dzikir: [
      { ar: 'أَسْتَغْفِرُ اللّٰهَ', tr: 'Aku memohon ampun kepada Allah', rep: '3×' },
      { ar: 'اللّٰهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ', tr: 'Ya Allah, Engkau Maha Sejahtera dan dari-Mu kesejahteraan.', rep: '1×' },
      { ar: 'سُبْحَانَ اللّٰهِ', tr: 'Maha Suci Allah', rep: '33×' },
      { ar: 'الْحَمْدُ لِلّٰهِ', tr: 'Segala puji bagi Allah', rep: '33×' },
      { ar: 'اللّٰهُ أَكْبَرُ', tr: 'Allah Maha Besar', rep: '33×' },
      { ar: 'آيَةُ الْكُرْسِيِّ', tr: 'Ayat Kursi (QS. Al-Baqarah: 255)', rep: '1×' },
    ],
    amalan: [
      { icon: '🌅', judul: 'Dhuha', ket: 'Setelah matahari terbit ~15 menit, minimal 2 rakaat.' },
      { icon: '📖', judul: 'Murajaah hafalan', ket: 'Waktu pagi — kondisi pikiran paling segar.' },
      { icon: '📿', judul: 'Baca Al-Quran', ket: 'Antara Subuh hingga terbit matahari, duduk di tempat solat.' },
      { icon: '🤲', judul: 'Doa pagi', ket: 'Baca doa & dzikir pagi (al-ma\'tsurat) setelah Subuh.' },
    ],
    window: 'Subuh → Dzuhur',
  },
  dzuhur: {
    dzikir: [
      { ar: 'أَسْتَغْفِرُ اللّٰهَ', tr: 'Aku memohon ampun kepada Allah', rep: '3×' },
      { ar: 'اللّٰهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ', tr: 'Ya Allah, Engkau Maha Sejahtera dan dari-Mu kesejahteraan.', rep: '1×' },
      { ar: 'سُبْحَانَ اللّٰهِ', tr: 'Maha Suci Allah', rep: '33×' },
      { ar: 'الْحَمْدُ لِلّٰهِ', tr: 'Segala puji bagi Allah', rep: '33×' },
      { ar: 'اللّٰهُ أَكْبَرُ', tr: 'Allah Maha Besar', rep: '33×' },
      { ar: 'لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ…', tr: 'La ilaha illallah wahdah… (100×, hari Jumat)', rep: '100×' },
    ],
    amalan: [
      { icon: '🕌', judul: 'Rawatib ba\'diyah', ket: '2 rakaat sunnah setelah Dzuhur.' },
      { icon: '😴', judul: 'Tidur siang (qailulah)', ket: 'Sunnah tidur sebentar sebelum Ashar.' },
      { icon: '📖', judul: 'Al-Kahfi (Jumat)', ket: 'Baca Surah Al-Kahfi setiap hari Jumat.' },
      { icon: '📿', judul: 'Istighfar siang', ket: 'Perbanyak istighfar di sela aktivitas.' },
    ],
    window: 'Dzuhur → Ashar',
  },
  ashar: {
    dzikir: [
      { ar: 'أَسْتَغْفِرُ اللّٰهَ', tr: 'Aku memohon ampun kepada Allah', rep: '3×' },
      { ar: 'اللّٰهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ', tr: 'Ya Allah, Engkau Maha Sejahtera dan dari-Mu kesejahteraan.', rep: '1×' },
      { ar: 'سُبْحَانَ اللّٰهِ', tr: 'Maha Suci Allah', rep: '33×' },
      { ar: 'الْحَمْدُ لِلّٰهِ', tr: 'Segala puji bagi Allah', rep: '33×' },
      { ar: 'اللّٰهُ أَكْبَرُ', tr: 'Allah Maha Besar', rep: '33×' },
      { ar: 'آيَةُ الْكُرْسِيِّ', tr: 'Ayat Kursi (QS. Al-Baqarah: 255)', rep: '1×' },
    ],
    amalan: [
      { icon: '📖', judul: 'Tilawah Al-Quran', ket: 'Waktu yang baik untuk tadabbur Al-Quran.' },
      { icon: '🚶', judul: 'Jangan tidur sore', ket: 'Makruh tidur antara Ashar dan Maghrib.' },
      { icon: '📿', judul: 'Dzikir petang', ket: 'Baca doa & dzikir petang (al-ma\'tsurat).' },
      { icon: '🤲', judul: 'Doa mustajab', ket: 'Waktu di antara Ashar & Maghrib sangat mustajab.' },
    ],
    window: 'Ashar → Maghrib',
  },
  maghrib: {
    dzikir: [
      { ar: 'أَسْتَغْفِرُ اللّٰهَ', tr: 'Aku memohon ampun kepada Allah', rep: '3×' },
      { ar: 'اللّٰهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ', tr: 'Ya Allah, Engkau Maha Sejahtera dan dari-Mu kesejahteraan.', rep: '1×' },
      { ar: 'سُبْحَانَ اللّٰهِ', tr: 'Maha Suci Allah', rep: '33×' },
      { ar: 'الْحَمْدُ لِلّٰهِ', tr: 'Segala puji bagi Allah', rep: '33×' },
      { ar: 'اللّٰهُ أَكْبَرُ', tr: 'Allah Maha Besar', rep: '33×' },
      { ar: 'قُلْ هُوَ اللّٰهُ أَحَدٌ', tr: 'Surah Al-Ikhlas, Al-Falaq, An-Nas', rep: '3×' },
    ],
    amalan: [
      { icon: '🕌', judul: 'Rawatib ba\'diyah', ket: '2 rakaat sunnah setelah Maghrib.' },
      { icon: '📖', judul: 'Baca Al-Quran', ket: 'Setelah Maghrib adalah waktu yang dianjurkan.' },
      { icon: '🚫', judul: 'Jauhi sibuk duniawi', ket: 'Waktu antara Maghrib–Isya untuk ibadah.' },
      { icon: '🤲', judul: 'Doa buka puasa', ket: 'Jika berpuasa, doa saat berbuka sangat mustajab.' },
    ],
    window: 'Maghrib → Isya',
  },
  isya: {
    dzikir: [
      { ar: 'أَسْتَغْفِرُ اللّٰهَ', tr: 'Aku memohon ampun kepada Allah', rep: '3×' },
      { ar: 'اللّٰهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ', tr: 'Ya Allah, Engkau Maha Sejahtera dan dari-Mu kesejahteraan.', rep: '1×' },
      { ar: 'سُبْحَانَ اللّٰهِ', tr: 'Maha Suci Allah', rep: '33×' },
      { ar: 'الْحَمْدُ لِلّٰهِ', tr: 'Segala puji bagi Allah', rep: '33×' },
      { ar: 'اللّٰهُ أَكْبَرُ', tr: 'Allah Maha Besar', rep: '33×' },
      { ar: 'آيَةُ الْكُرْسِيِّ', tr: 'Ayat Kursi sebelum tidur', rep: '1×' },
    ],
    amalan: [
      { icon: '🌙', judul: 'Witir', ket: 'Minimal 1 rakaat, penutup solat malam.' },
      { icon: '🌃', judul: 'Tahajud', ket: 'Bangun malam sepertiga akhir — waktu paling mustajab.' },
      { icon: '📿', judul: 'Dzikir sebelum tidur', ket: 'Baca 3 Qul, Ayat Kursi, dan doa tidur.' },
      { icon: '📖', judul: 'Tilawah malam', ket: 'Baca Al-Quran sebelum tidur, meski sedikit.' },
    ],
    window: 'Isya → Subuh',
  },
};

// ── Accordion Detail Panel ───────────────────────────────────────────────────
function DetailPanel({ pKey }) {
  const d = DETAIL[pKey];
  if (!d) return null;
  return (
    <div className="pdetail">
      {/* Dzikir column */}
      <div className="pdetail-col">
        <div className="pdetail-heading">
          <span className="pdetail-icon">📿</span>
          Dzikir &amp; Doa Ba'da Solat
        </div>
        <div className="pdetail-dzikir-list">
          {d.dzikir.map((item, i) => (
            <div key={i} className="dzikir-row">
              <div className="dzikir-ar">{item.ar}</div>
              <div className="dzikir-meta">
                <span className="dzikir-tr">{item.tr}</span>
                <span className="dzikir-rep">{item.rep}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Amalan column */}
      <div className="pdetail-col">
        <div className="pdetail-heading">
          <span className="pdetail-icon">⏱</span>
          Amalan Antar Waktu
          <span className="pdetail-window">{d.window}</span>
        </div>
        <div className="pdetail-amalan-list">
          {d.amalan.map((item, i) => (
            <div key={i} className="amalan-row">
              <span className="amalan-emoji">{item.icon}</span>
              <div className="amalan-body">
                <div className="amalan-judul">{item.judul}</div>
                <div className="amalan-ket">{item.ket}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Prayer Card Row ──────────────────────────────────────────────────────────
function PrayerRowItem({ p, status, time, isNext, ring, onStatus, onTime, open, onToggle }) {
  const done = !!status;
  return (
    <div className={
      'pcard' +
      (done ? ' done' : '') +
      (status === 'qadha' ? ' qadha' : '') +
      (open ? ' open' : '')
    }>
      {/* Main row — click chevron area to toggle */}
      <div className="prow">
        {/* Chevron toggle — left side */}
        <button
          className="pchev"
          onClick={onToggle}
          aria-label={open ? 'Tutup detail' : 'Lihat detail'}
          aria-expanded={open}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: 'transform .22s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
            <path d="M6 3l5 5-5 5" />
          </svg>
        </button>

        <PrayerRing letter={p.id[0]} pct={done ? 1 : 0} tone={status === 'qadha' ? 'qadha' : 'gold'} style={ring} size={54} />

        <div className="pmeta">
          <div className="pname">
            {p.id}
            <span className="pa">{p.ar}</span>
            {isNext && <span className="next-tag">Berikutnya</span>}
          </div>
          <div className="psub">
            Jadwal {p.sched}{done ? ` · dicatat ${time || p.sched}` : ''}
            {!open && <span className="psub-hint"> · klik ▸ untuk dzikir &amp; amalan</span>}
          </div>
        </div>

        <input
          className="tinput"
          value={time}
          placeholder="--:--"
          maxLength={5}
          onChange={(e) => onTime(p.k, e.target.value)}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Waktu ${p.id}`}
        />

        <div className="seg">
          {STATUS.map(([s, lbl]) => (
            <button
              key={s}
              className={'segbtn ' + s + (status === s ? ' on' : '')}
              onClick={(e) => { e.stopPropagation(); onStatus(p.k, status === s ? null : s); }}
            >
              <span className="sd" />{lbl}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion detail panel */}
      {open && <DetailPanel pKey={p.k} />}
    </div>
  );
}

// ── Dashboard Page ───────────────────────────────────────────────────────────
export function DashboardPage({ prayers, times, sunnah, setStatus, setTime, toggleSunnah, score, ring, streak, freeze, useFreeze, pulse, go }) {
  const [openKey, setOpenKey] = useState(null);

  const toggleOpen = (k) => setOpenKey((prev) => prev === k ? null : k);

  const nextK = PRAYERS.find((p) => !prayers[p.k])?.k;
  const doneCount = PRAYERS.filter((p) => prayers[p.k]).length;
  const sunCount = SUNNAH.filter((s) => sunnah[s]).length;

  return (
    <div className="main fade-in">
      <div className="content scrl">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 28 }}>
          <div>
            <div style={{ fontFamily: 'var(--f-ar)', direction: 'rtl', color: 'var(--gold)', fontSize: 14, marginBottom: 4 }}>
              السبت، ١٣ يونيو ٢٠٢٦
            </div>
            <h1 className="h1">Sabtu, 13 Juni 2026</h1>
            <div style={{ marginTop: 5, fontSize: 13, color: 'var(--text-3)' }}>Assalamu'alaikum — semoga harimu penuh berkah.</div>
          </div>
          {nextK && (
            <div className="card" style={{ padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <span style={{ color: 'var(--gold)' }}>{Icon.spark}</span>
              <div>
                <div className="eyebrow" style={{ fontSize: 10 }}>Solat berikutnya</div>
                <div style={{ fontFamily: 'var(--f-head)', fontWeight: 500, fontSize: 14, color: 'var(--text)', marginTop: 1 }}>
                  {PRAYERS.find((p) => p.k === nextK).id}
                  <span style={{ color: 'var(--text-3)', fontWeight: 400 }}> · {PRAYERS.find((p) => p.k === nextK).sched}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Prayer list */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="eyebrow">Solat Wajib</span>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{doneCount} / 5 dicatat</span>
        </div>
        <div className="plist">
          {PRAYERS.map((p) => (
            <PrayerRowItem
              key={p.k}
              p={p}
              status={prayers[p.k]}
              time={times[p.k] || ''}
              isNext={p.k === nextK}
              ring={ring}
              onStatus={setStatus}
              onTime={setTime}
              open={openKey === p.k}
              onToggle={() => toggleOpen(p.k)}
            />
          ))}
        </div>

        {/* Sunnah */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '28px 0 12px' }}>
          <span className="eyebrow">Solat Sunnah</span>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{sunCount} / 6 selesai</span>
        </div>
        <div className="chips scrl">
          {SUNNAH.map((s) => (
            <button key={s} className={'chip' + (sunnah[s] ? ' on' : '')} onClick={() => toggleSunnah(s)}>
              <span className="ck">{sunnah[s] && Icon.check}</span>{s}
            </button>
          ))}
        </div>
      </div>

      {/* Right column */}
      <div className="col-r scrl">
        <div className="streak">
          <span className="flame" style={{ color: 'rgba(168,216,196,.3)' }}>{Icon.flame}</span>
          <div style={{ fontFamily: 'var(--f-body)', fontWeight: 500, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mint)', marginBottom: 2 }}>
            Beruntun
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, margin: '4px 0 2px' }}>
            <span className={'bignum' + (pulse ? ' pulse' : '')}>{streak}</span>
            <span style={{ fontFamily: 'var(--f-head)', fontWeight: 400, fontSize: 18, marginBottom: 8, color: 'rgba(255,255,255,.8)' }}>hari</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', marginBottom: 16 }}>Terpanjang · {streak >= 34 ? streak : 34} hari</div>
          <button className="btn sm" onClick={useFreeze}
            style={{ borderColor: 'rgba(168,216,196,.35)', color: 'var(--mint)', background: 'rgba(168,216,196,.1)', fontSize: 12 }}>
            {Icon.snow} {freeze} freeze tersisa
          </button>
        </div>

        <div className="card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
          <ScoreRing pct={score} size={88} />
          <div>
            <div className="eyebrow">Skor hari ini</div>
            <div className="h2" style={{ marginTop: 4 }}>Ibadah</div>
            <div style={{ marginTop: 5, fontSize: 12, color: 'var(--text-3)' }}>{doneCount}/5 wajib · {sunCount}/6 sunnah</div>
          </div>
        </div>

        <div className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 11 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="h2">Jurnal hari ini</span>
            <span style={{ color: 'var(--text-3)' }}>{Icon.journal}</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
            Luangkan sejenak untuk merefleksikan harimu, akhi.
          </p>
          <button className="btn gold sm" style={{ alignSelf: 'flex-start' }} onClick={() => go('journal')}>
            Tulis sekarang →
          </button>
        </div>
      </div>
    </div>
  );
}
