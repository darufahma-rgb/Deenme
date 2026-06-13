// dashboard.jsx — Dashboard layout + prayer tracker + mission & reward system
import { useState, useEffect, useRef } from 'react';
import { Icon, PrayerRing, ScoreRing, fireConfetti } from './ui.jsx';
import { AMALAN_PER_WAKTU } from './pages.jsx';

export const PRAYERS = [
  { k: 'subuh',   id: 'Subuh',   ar: 'الفجر'  },
  { k: 'dzuhur',  id: 'Dzuhur',  ar: 'الظهر'  },
  { k: 'ashar',   id: 'Ashar',   ar: 'العصر'  },
  { k: 'maghrib', id: 'Maghrib', ar: 'المغرب' },
  { k: 'isya',    id: 'Isya',    ar: 'العشاء' },
];
export const PRAYER_CARDS = [
  {
    k: 'tahajud', id: 'Tahajud', ar: 'التَّهَجُّد', sched: '03:00',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  },
  {
    k: 'subuh', id: 'Subuh', ar: 'الفجر', sched: '--:--',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="2" y1="18" x2="4" y2="18"/><line x1="20" y1="18" x2="22" y2="18"/><line x1="19.78" y1="10.22" x2="18.36" y2="11.64"/></svg>,
  },
  {
    k: 'dzuhur', id: 'Dzuhur', ar: 'الظهر', sched: '--:--',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>,
  },
  {
    k: 'ashar', id: 'Ashar', ar: 'العصر', sched: '--:--',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/><path d="M3 12h1M20 12h1M12 3v1M12 20v1M5.64 5.64l.7.7M17.66 17.66l.7.7M17.66 6.34l-.7.7M5.64 18.36l.7-.7"/></svg>,
  },
  {
    k: 'maghrib', id: 'Maghrib', ar: 'المغرب', sched: '--:--',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="2" y1="18" x2="22" y2="18"/><path d="M12 2L12 9"/><path d="M4.22 10.22L5.64 11.64"/><path d="M19.78 10.22L18.36 11.64"/></svg>,
  },
  {
    k: 'isya', id: 'Isya', ar: 'العشاء', sched: '--:--',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/></svg>,
  },
];
export const SUNNAH = ['Rawatib Subuh', 'Dhuha', 'Rawatib Dzuhur', 'Rawatib Maghrib', 'Tahajud', 'Witir'];
const STATUS = [['ok', 'Tepat'], ['late', 'Telat'], ['qadha', 'Qadha']];

// ── Mission & Reward Data ────────────────────────────────────────────────────
export const MISI_PER_SHOLAT = {
  subuh: {
    label: 'Misi Setelah Subuh',
    misi: [
      { id: 'subuh-rawatib-qabl', name: 'Rawatib Qabliyah Subuh', nameAr: 'سُنَّةُ الفَجْرِ', type: 'sholat', rakaat: '2', desc: '2 rakaat sebelum Subuh — sunnah muakkadah yang tidak pernah ditinggalkan Nabi.' },
      { id: 'subuh-ayat-kursi', name: 'Ayat Kursi', nameAr: 'آيَةُ الكُرْسِيِّ', type: 'dzikir', count: '1×', desc: 'Dibaca setelah salam sholat Subuh. Penjaga hingga sore hari.' },
      { id: 'subuh-3qul', name: 'Al-Ikhlas, Al-Falaq, An-Nas', nameAr: 'المُعَوِّذَتَانِ', type: 'dzikir', count: '3×', desc: 'Dibaca 3x masing-masing. Cukup sebagai penjaga dari segala sesuatu.' },
      { id: 'subuh-sayyidul-istighfar', name: 'Sayyidul Istighfar', nameAr: 'سَيِّدُ الاسْتِغْفَار', type: 'dzikir', count: '1×', desc: 'Dibaca di pagi hari — barangsiapa membacanya dan meninggal sebelum sore, ia ahli surga.' },
      { id: 'subuh-tasbih', name: 'Tasbih Pagi (33-33-34)', nameAr: 'تَسْبِيحُ الصَّبَاح', type: 'dzikir', count: '100× total', desc: 'Subhanallah 33x, Alhamdulillah 33x, Allahu Akbar 34x.' },
      { id: 'subuh-doa-ilmu', name: 'Doa Ilmu & Rezeki', nameAr: 'دُعَاءُ العِلْمِ', type: 'doa', desc: 'Allahumma inni asaluka ilman nafia... Dibaca sebelum beranjak dari tempat duduk.' },
    ],
  },
  dzuhur: {
    label: 'Misi Setelah Dzuhur',
    misi: [
      { id: 'dzuhur-rawatib-qabl', name: 'Rawatib Qabliyah Dzuhur', nameAr: 'سُنَّةُ الظُّهْرِ القَبْلِيَّة', type: 'sholat', rakaat: '4', desc: '4 rakaat sebelum Dzuhur (2+2). Nabi rutin mengerjakannya.' },
      { id: 'dzuhur-rawatib-bad', name: 'Rawatib Ba\'diyah Dzuhur', nameAr: 'سُنَّةُ الظُّهْرِ البَعْدِيَّة', type: 'sholat', rakaat: '2', desc: '2 rakaat setelah Dzuhur. Bagian dari 12 rakaat rawatib muakkadah.' },
      { id: 'dzuhur-ayat-kursi', name: 'Ayat Kursi', nameAr: 'آيَةُ الكُرْسِيِّ', type: 'dzikir', count: '1×', desc: 'Dibaca setelah setiap sholat wajib.' },
      { id: 'dzuhur-shalawat', name: 'Shalawat 100×', nameAr: 'الصَّلَاةُ عَلَى النَّبِيّ', type: 'dzikir', count: '100×', desc: 'Allahumma shalli ala Muhammad. Satu shalawat dibalas 10 rahmat Allah.' },
    ],
  },
  ashar: {
    label: 'Misi Setelah Ashar',
    misi: [
      { id: 'ashar-ayat-kursi', name: 'Ayat Kursi', nameAr: 'آيَةُ الكُرْسِيِّ', type: 'dzikir', count: '1×', desc: 'Dibaca setelah salam. Penjaga dari Ashar hingga Maghrib.' },
      { id: 'ashar-tasbih', name: 'Tasbih Sore (33-33-34)', nameAr: 'تَسْبِيحُ المَسَاء', type: 'dzikir', count: '100×', desc: 'Subhanallah 33x, Alhamdulillah 33x, Allahu Akbar 34x.' },
      { id: 'ashar-dzikir-petang', name: 'Dzikir Petang', nameAr: 'أَذْكَارُ المَسَاء', type: 'dzikir', count: 'Hisnul Muslim', desc: 'Dimulai setelah Ashar hingga Maghrib. Termasuk 3 qul 3x dan doa perlindungan malam.' },
      { id: 'ashar-istighfar', name: 'Istighfar 100×', nameAr: 'الاسْتِغْفَار', type: 'dzikir', count: '100×', desc: 'Astaghfirullahal adzim. Nabi beristighfar lebih dari 70x sehari walau sudah diampuni.' },
    ],
  },
  maghrib: {
    label: 'Misi Setelah Maghrib',
    misi: [
      { id: 'maghrib-rawatib-bad', name: 'Rawatib Ba\'diyah Maghrib', nameAr: 'سُنَّةُ المَغْرِبِ', type: 'sholat', rakaat: '2', desc: '2 rakaat setelah Maghrib. Bagian dari 12 rakaat rawatib muakkadah.' },
      { id: 'maghrib-ayat-kursi', name: 'Ayat Kursi', nameAr: 'آيَةُ الكُرْسِيِّ', type: 'dzikir', count: '1×', desc: 'Penjaga malam hingga Subuh.' },
      { id: 'maghrib-3qul', name: 'Al-Ikhlas, Al-Falaq, An-Nas', nameAr: 'المُعَوِّذَتَانِ', type: 'dzikir', count: '3×', desc: 'Dzikir petang — dibaca 3x masing-masing setelah Maghrib.' },
      { id: 'maghrib-sayyidul-istighfar', name: 'Sayyidul Istighfar (Petang)', nameAr: 'سَيِّدُ الاسْتِغْفَار', type: 'dzikir', count: '1×', desc: 'Dibaca di sore hari — barangsiapa membacanya dan meninggal sebelum pagi, ia ahli surga.' },
      { id: 'maghrib-shalawat', name: 'Shalawat (Jumat: 1000×)', nameAr: 'الصَّلَاةُ عَلَى النَّبِيّ', type: 'dzikir', count: '100×', desc: 'Hari Jumat sangat dianjurkan memperbanyak shalawat.' },
    ],
  },
  isya: {
    label: 'Misi Setelah Isya',
    misi: [
      { id: 'isya-rawatib-bad', name: 'Rawatib Ba\'diyah Isya', nameAr: 'سُنَّةُ العِشَاء', type: 'sholat', rakaat: '2', desc: '2 rakaat setelah Isya. Bagian dari 12 rakaat rawatib muakkadah.' },
      { id: 'isya-witir', name: 'Sholat Witir', nameAr: 'صَلَاةُ الوِتْر', type: 'sholat', rakaat: '1-3', desc: 'Penutup sholat malam. Jika tidak yakin bisa Tahajud, witir sekarang sebelum tidur.' },
      { id: 'isya-tasbih-tidur', name: 'Tasbih Fatimah', nameAr: 'تَسْبِيحُ فَاطِمَة', type: 'dzikir', count: '33-33-34', desc: 'Subhanallah 33x, Alhamdulillah 33x, Allahu Akbar 34x sebelum tidur. Lebih baik dari pembantu.' },
      { id: 'isya-doa-tidur', name: 'Doa Sebelum Tidur', nameAr: 'دُعَاءُ النَّوْم', type: 'doa', desc: 'Bismika Allahumma amutu wa ahya. Dibaca sambil berbaring miring ke kanan.' },
      { id: 'isya-tahajud-niat', name: 'Niat Tahajud', nameAr: 'نِيَّةُ التَّهَجُّد', type: 'sholat', desc: 'Pasang alarm sepertiga malam terakhir. Nabi bersabda: siapa yang berniat sholat malam lalu tertidur, niatnya tetap dicatat.' },
    ],
  },
};

export const BADGES = [
  { id: 'subuh-7', name: 'Penjaga Fajar', nameAr: 'حَارِسُ الفَجْر', icon: '🌅', desc: 'Selesaikan semua misi Subuh 7 hari berturut-turut', condition: { type: 'streak-prayer', prayer: 'subuh', streak: 7 } },
  { id: 'dzikir-pagi-30', name: 'Lidah yang Basah', nameAr: 'اللِّسَانُ الرَّطْب', icon: '💧', desc: 'Selesaikan dzikir pagi 30 hari', condition: { type: 'misi-count', misiId: 'subuh-sayyidul-istighfar', count: 30 } },
  { id: 'rawatib-complete', name: 'Ahli Sunnah', nameAr: 'صَاحِبُ السُّنَّة', icon: '⭐', desc: 'Selesaikan semua rawatib dalam satu hari', condition: { type: 'rawatib-complete' } },
  { id: 'witir-streak-7', name: 'Penutup Malam', nameAr: 'خَاتِمُ اللَّيْل', icon: '🌙', desc: 'Sholat Witir 7 hari berturut-turut', condition: { type: 'streak-misi', misiId: 'isya-witir', streak: 7 } },
  { id: 'all-misi-complete', name: 'Hari Sempurna', nameAr: 'يَوْمٌ كَامِل', icon: '🏆', desc: 'Selesaikan semua misi dalam satu hari', condition: { type: 'all-complete' } },
  { id: 'level-mutawassit', name: 'Mutawassit', nameAr: 'مُتَوَسِّط', icon: '🥈', desc: 'Capai 500 poin amal', condition: { type: 'points', points: 500 } },
  { id: 'level-mutaqaddim', name: 'Mutaqaddim', nameAr: 'مُتَقَدِّم', icon: '🥇', desc: 'Capai 1000 poin amal', condition: { type: 'points', points: 1000 } },
];

export function getLevel(pts) {
  if (pts >= 1000) return { name: 'Muttaqi',    ar: 'مُتَّقِي',     next: null, low: 1000, pct: 1 };
  if (pts >= 600)  return { name: 'Mutaqaddim', ar: 'مُتَقَدِّم',   next: 1000, low: 600,  pct: (pts - 600) / 400 };
  if (pts >= 300)  return { name: 'Mutawassit', ar: 'مُتَوَسِّط',   next: 600,  low: 300,  pct: (pts - 300) / 300 };
  if (pts >= 100)  return { name: 'Mutaallim',  ar: 'مُتَعَلِّم',   next: 300,  low: 100,  pct: (pts - 100) / 200 };
  return              { name: 'Mubtadi',     ar: 'مُبْتَدِئ',    next: 100,  low: 0,    pct: pts / 100 };
}

// ── Solo Leveling Rank System ────────────────────────────────────────────────
export const RANK_SYSTEM = [
  { rank: 'E',   label: 'Mubtadi',    minPts: 0,     color: '#555555', glow: '#333333', border: '#2a2a2a', bg: '#0a0a0f' },
  { rank: 'D',   label: 'Mutaallim', minPts: 100,   color: '#6688cc', glow: '#4466aa', border: '#334488', bg: '#080a14' },
  { rank: 'C',   label: 'Mutawassit',minPts: 300,   color: '#00b4d8', glow: '#0088bb', border: '#006688', bg: '#040e14' },
  { rank: 'B',   label: 'Mutaqaddim',minPts: 600,   color: '#00cfef', glow: '#00aad0', border: '#0088bb', bg: '#030f16' },
  { rank: 'A',   label: 'Muttaqin',  minPts: 1000,  color: '#00e5ff', glow: '#00c4ee', border: '#00aadd', bg: '#020e18' },
  { rank: 'S',   label: 'Wali',      minPts: 2000,  color: '#40ffff', glow: '#00e5ff', border: '#00cfef', bg: '#010d16' },
  { rank: 'SS',  label: 'Shiddiq',   minPts: 5000,  color: '#80ffff', glow: '#40efff', border: '#00dfff', bg: '#010c15' },
  { rank: 'SSS', label: 'Ulul Albab',minPts: 10000, color: '#ffffff', glow: '#80ffff', border: '#40ffff', bg: '#000d18' },
];

export function getRank(totalPoints) {
  const sorted = [...RANK_SYSTEM].reverse();
  return sorted.find(r => totalPoints >= r.minPts) || RANK_SYSTEM[0];
}

export function getNextRank(totalPoints) {
  return RANK_SYSTEM.find(r => r.minPts > totalPoints) || null;
}

export function computeDailyPoints(misiDone) {
  let pts = 0;
  let allDayDone = true;
  for (const data of Object.values(MISI_PER_SHOLAT)) {
    let prayerAllDone = true;
    for (const misi of data.misi) {
      if (misiDone[misi.id]) {
        pts += misi.type === 'sholat' ? 20 : 10;
      } else {
        prayerAllDone = false;
        allDayDone = false;
      }
    }
    if (prayerAllDone && data.misi.length > 0) pts += 15;
  }
  if (allDayDone) pts += 50;
  return pts;
}

// ── Solo Leveling Panel Component ───────────────────────────────────────────
export function SoloLevelingPanel({ totalPoints, streak, freeze, score, prayers, misiDone }) {
  const rank     = getRank(totalPoints);
  const nextRank = getNextRank(totalPoints);
  const xpToNext = nextRank ? nextRank.minPts - totalPoints : 0;
  const xpPct    = nextRank
    ? ((totalPoints - rank.minPts) / (nextRank.minPts - rank.minPts)) * 100
    : 100;

  const doneCount   = Object.values(misiDone  || {}).filter(Boolean).length;
  const prayerCount = Object.values(prayers   || {}).filter(Boolean).length;

  return (
    <div className="sl-hunter-card" style={{ '--rank-color': rank.color, '--rank-glow': rank.glow, '--rank-border': rank.border }}>

      {/* Top row — badge + identity + shield */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <div
          className={`sl-rank-badge sl-rank-${rank.rank.toLowerCase()}`}
          style={{ background: rank.bg, color: rank.color, '--rank-glow': rank.glow, '--rank-border': rank.border, '--rank-color': rank.color }}
        >
          {rank.rank}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
            <span style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 18, color: rank.color, letterSpacing: '-.02em', lineHeight: 1 }}>{rank.label}</span>
            <span style={{ fontFamily: 'var(--f-ar)', fontSize: 14, color: rank.color, opacity: .55, lineHeight: 1 }}>{rank.ar}</span>
          </div>
          <div style={{ fontFamily: 'var(--f-head)', fontSize: 10, color: 'var(--text-3)', letterSpacing: '.09em', textTransform: 'uppercase' }}>
            Rank {rank.rank} Hunter · {totalPoints} XP
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10, padding: '7px 10px', flexShrink: 0 }}>
          <span style={{ fontSize: 14, lineHeight: 1 }}>🛡️</span>
          <span style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 12, color: '#2ecc8a', lineHeight: 1, marginTop: 2 }}>{freeze}×</span>
        </div>
      </div>

      {/* XP bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
          <span style={{ fontFamily: 'var(--f-head)', fontSize: 11, fontWeight: 700, color: rank.color }}>
            {nextRank ? `${xpToNext} XP → Rank ${nextRank.rank}` : 'MAX RANK ✦'}
          </span>
          <span style={{ fontFamily: 'var(--f-head)', fontSize: 11, color: 'var(--text-3)' }}>{Math.round(xpPct)}%</span>
        </div>
        <div className="sl-xp-track">
          <div className="sl-xp-fill" style={{ width: xpPct + '%' }} />
        </div>
      </div>

      {/* Stats row — inline inside card */}
      <div className="sl-stats-row">
        <div className="sl-stat-item">
          <div className="sl-stat-val">{streak}</div>
          <div className="sl-stat-lbl">Streak 🔥</div>
        </div>
        <div className="sl-stat-div" />
        <div className="sl-stat-item">
          <div className="sl-stat-val">{prayerCount}/5</div>
          <div className="sl-stat-lbl">Sholat 🕌</div>
        </div>
        <div className="sl-stat-div" />
        <div className="sl-stat-item">
          <div className="sl-stat-val">{doneCount}</div>
          <div className="sl-stat-lbl">Misi ⚔️</div>
        </div>
      </div>
    </div>
  );
}

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

// ── Date helpers ─────────────────────────────────────────────────────────────
const _AR_DAYS   = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
const _AR_MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const _ID_DAYS   = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const _ID_MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const _toAr = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
function _arDate() {
  const d = new Date();
  return `${_AR_DAYS[d.getDay()]}، ${_toAr(d.getDate())} ${_AR_MONTHS[d.getMonth()]} ${_toAr(d.getFullYear())}`;
}
function _idDate() {
  const d = new Date();
  return `${_ID_DAYS[d.getDay()]}, ${d.getDate()} ${_ID_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

const TYPE_COLOR = { sholat: 'var(--mint)', dzikir: 'var(--gold)', doa: '#a78bfa' };
const TYPE_BG    = { sholat: 'rgba(110,231,183,0.12)', dzikir: 'var(--gold-soft)', doa: 'rgba(167,139,250,0.12)' };
const TYPE_LABEL = { sholat: 'Sholat', dzikir: 'Dzikir', doa: 'Doa' };
const PRAYER_ID  = { subuh: 'Subuh', dzuhur: 'Dzuhur', ashar: 'Ashar', maghrib: 'Maghrib', isya: 'Isya' };
const PRAYER_AR  = { subuh: 'الفجر', dzuhur: 'الظهر', ashar: 'العصر', maghrib: 'المغرب', isya: 'العشاء' };

// ── Mission Item ─────────────────────────────────────────────────────────────
function MisiItem({ misi, done, onToggle }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={'misi-item' + (done ? ' done' : '')}>
      <div
        className={'misi-item-checkbox' + (done ? ' checked' : '')}
        onClick={() => onToggle(misi.id)}
      >
        {done && <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="var(--bg)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7.4 5.7 10 11 4.2"/></svg>}
      </div>
      <div className="misi-item-body">
        <div className="misi-item-ar">{misi.nameAr}</div>
        <div className="misi-item-top">
          <span className={'misi-item-name' + (done ? ' checked' : '')}>{misi.name}</span>
        </div>
        <div className="misi-item-meta">
          <span className="chip" style={{
            background: misi.type === 'sholat' ? 'color-mix(in srgb, var(--ok) 15%, transparent)' :
                        misi.type === 'dzikir' ? 'color-mix(in srgb, var(--gold) 15%, transparent)' :
                        'color-mix(in srgb, #8b8bff 15%, transparent)',
            color: misi.type === 'sholat' ? 'var(--ok)' :
                   misi.type === 'dzikir' ? 'var(--gold)' : '#a0a0ff',
            borderColor: 'transparent',
            pointerEvents: 'none',
          }}>
            {misi.type === 'sholat' ? 'Sholat' : misi.type === 'dzikir' ? 'Dzikir' : 'Doa'}
          </span>
          {(misi.count || misi.rakaat) && (
            <span className="misi-item-count">
              {misi.rakaat ? `${misi.rakaat} rakaat` : misi.count}
            </span>
          )}
        </div>
        {misi.desc && (
          <>
            <button className="misi-item-toggle" onClick={() => setOpen((o) => !o)}>
              <span>{open ? '▾' : '›'}</span>
              <span>{open ? 'Sembunyikan' : 'Keterangan'}</span>
            </button>
            {open && <div className="misi-item-detail">{misi.desc}</div>}
          </>
        )}
      </div>
    </div>
  );
}

// ── Mission Panel (right col, always visible) ────────────────────────────────
function MisiPanel({ prayerKey, misiDone, onToggle }) {
  if (!prayerKey || !MISI_PER_SHOLAT[prayerKey]) return null;
  const data = MISI_PER_SHOLAT[prayerKey];
  const doneCount = data.misi.filter((m) => misiDone[m.id]).length;
  const pct = data.misi.length ? doneCount / data.misi.length : 0;
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span className="eyebrow">{data.label}</span>
        <span className="muted tiny">{doneCount}/{data.misi.length}</span>
      </div>
      <div style={{ height: 3, background: 'var(--elevated)', borderRadius: 9999, overflow: 'hidden', marginBottom: 4 }}>
        <div style={{
          height: '100%', borderRadius: 9999,
          width: (pct * 100) + '%',
          background: pct >= 1 ? 'linear-gradient(90deg, var(--gold), var(--gold-2))' : 'var(--gold)',
          transition: 'width 500ms ease',
        }} />
      </div>
      <div
        className="misi-panel-list"
        style={{ overflowY: 'auto', maxHeight: '60dvh', WebkitOverflowScrolling: 'touch' }}
      >
        {data.misi.map((m) => (
          <MisiItem key={m.id} misi={m} done={!!misiDone[m.id]} onToggle={() => onToggle(m.id, data.misi)} />
        ))}
      </div>
    </div>
  );
}

// ── Post-Prayer Mission Popup ────────────────────────────────────────────────
function MisiPopup({ prayerKey, misiDone, onToggle, onClose, onBadgeUnlock }) {
  const data = MISI_PER_SHOLAT[prayerKey];
  const [fired, setFired] = useState(false);
  const [badgeShow, setBadgeShow] = useState(null);
  if (!data) return null;

  const doneCount = data.misi.filter((m) => misiDone[m.id]).length;
  const allDone = doneCount === data.misi.length;
  const pct = data.misi.length ? doneCount / data.misi.length : 0;

  const handleToggle = (id, allMisi) => {
    onToggle(id, allMisi);
  };

  // Fire confetti when all done
  useEffect(() => {
    if (allDone && !fired) {
      setFired(true);
      setTimeout(() => fireConfetti(), 200);
    }
  }, [allDone]);

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 38,
        background: 'rgba(0,0,0,.45)',
        backdropFilter: 'blur(3px)',
      }} />

      {/* Slide-up sheet */}
      <div className="misi-popup scrl">
        {/* Header */}
        <div style={{ padding: '20px 22px 16px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontFamily: 'var(--f-ar)', direction: 'rtl', fontSize: 20, color: 'var(--gold)', marginBottom: 2 }}>
                مِهَامٌ بَعْدَ {PRAYER_AR[prayerKey]}
              </div>
              <div style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 16, color: 'var(--text)' }}>
                {data.label}
              </div>
            </div>
            <button onClick={onClose} className="iconbtn" style={{ flexShrink: 0, marginTop: 2 }} aria-label="Tutup">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Progress */}
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-3)', marginBottom: 5 }}>
              <span>{doneCount} dari {data.misi.length} misi selesai</span>
              {allDone && <span style={{ color: 'var(--mint)', fontWeight: 600 }}>✓ Semua selesai!</span>}
            </div>
            <div style={{ height: 4, background: 'var(--elevated)', borderRadius: 9999, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 9999,
                width: (pct * 100) + '%',
                background: allDone ? 'linear-gradient(90deg, var(--gold), var(--mint))' : 'var(--gold)',
                transition: 'width 600ms ease',
              }} />
            </div>
          </div>
        </div>

        {/* Mission list */}
        <div style={{ padding: '6px 22px 16px' }}>
          {data.misi.map((m) => (
            <MisiItem key={m.id} misi={m} done={!!misiDone[m.id]} onToggle={() => handleToggle(m.id, data.misi)} />
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 22px 24px', borderTop: '1px solid var(--border)' }}>
          <button className="btn gold" style={{ width: '100%' }} onClick={onClose}>
            {allDone ? '🌟 Alhamdulillah — Tutup' : 'Tutup'}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Timbangan Amal Progress Bar ──────────────────────────────────────────────
function TimbangAmal({ dailyPoints, totalPoints }) {
  const level = getLevel(totalPoints);
  const pct = Math.min(1, dailyPoints / 200);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 120); return () => clearTimeout(t); }, []);
  const isFull = pct >= 1;
  return (
    <div className={'timbang-amal card' + (isFull ? ' timbang-full' : '')} style={{ padding: '13px 18px', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 16 }}>⚖️</span>
          <span className="eyebrow">Timbangan Amal Hari Ini</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span className="timbang-pts">{dailyPoints}</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>/ 200 poin</span>
        </div>
      </div>
      <div style={{ height: 5, background: 'var(--elevated)', borderRadius: 9999, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 9999,
          width: mounted ? (pct * 100) + '%' : '0%',
          background: isFull
            ? 'linear-gradient(90deg, var(--gold), var(--gold-2), var(--mint))'
            : 'linear-gradient(90deg, var(--gold), var(--gold-2))',
          transition: 'width 600ms ease',
        }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontFamily: 'var(--f-ar)', fontSize: 13, color: 'var(--gold)' }}>{level.ar}</span>
          <span style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>{level.name}</span>
        </div>
        {level.next && (
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
            {level.next - totalPoints} poin lagi
          </span>
        )}
      </div>
    </div>
  );
}

// ── Badge Toast ──────────────────────────────────────────────────────────────
function BadgeToast({ badge, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, []);
  if (!badge) return null;
  return (
    <div className="badge-toast">
      <span style={{ fontSize: 28 }}>{badge.icon}</span>
      <div>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.08em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 2 }}>
          Badge Terbuka! 🎉
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{badge.name}</div>
        <div style={{ fontFamily: 'var(--f-ar)', fontSize: 13, color: 'var(--gold)' }}>{badge.nameAr}</div>
      </div>
    </div>
  );
}

// ── Accordion Detail Panel ───────────────────────────────────────────────────
function DetailPanel({ pKey }) {
  const d = DETAIL[pKey];
  if (!d) return null;
  return (
    <div className="pdetail">
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

// ── Prayer Times Hook ────────────────────────────────────────────────────────
function usePrayerTimes() {
  const [schedules, setSchedules] = useState({});
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(false);

  const load = () => {
    setError(false);
    setLoading(true);
    const today = new Date();
    const dd    = String(today.getDate()).padStart(2, '0');
    const mm    = String(today.getMonth() + 1).padStart(2, '0');
    const date  = `${dd}-${mm}-${today.getFullYear()}`;
    const cacheKey = `deenme-sched-${date}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try { setSchedules(JSON.parse(cached)); setLoading(false); return; } catch {}
    }
    const url = `https://api.aladhan.com/v1/timingsByCity/${date}?city=Tangerang&country=Indonesia&method=11`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const t = data.data.timings;
        const s = { subuh: t.Fajr, dzuhur: t.Dhuhr, ashar: t.Asr, maghrib: t.Maghrib, isya: t.Isha };
        setSchedules(s);
        setLoading(false);
        localStorage.setItem(cacheKey, JSON.stringify(s));
      })
      .catch(() => { setError(true); setLoading(false); });
  };

  useEffect(() => { load(); }, []);
  return { schedules, loading, error, retry: load };
}

function _wibNow() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
}

function getTimeRemaining(schedStr) {
  if (!schedStr || schedStr === '--:--') return null;
  const [h, m] = schedStr.split(':').map(Number);
  const now    = _wibNow();
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  const diff  = target - now;
  const hours = Math.floor(diff / 3600000);
  const mins  = Math.floor((diff % 3600000) / 60000);
  return hours > 0 ? `dalam ${hours}j ${mins}m` : `dalam ${mins}m`;
}

function getNextPrayerKey(schedules) {
  const now    = _wibNow();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  for (const p of PRAYERS) {
    const s = schedules[p.k];
    if (!s || s === '--:--') continue;
    const [h, m] = s.split(':').map(Number);
    if (h * 60 + m > nowMin) return p.k;
  }
  return PRAYERS[0].k;
}

// ── Prayer Card Row ──────────────────────────────────────────────────────────
function PrayerRowItem({ p, status, time, sched, isNext, timeRemaining, ring, onStatus, onTime, open, onToggle }) {
  const done = !!status;
  return (
    <div className={
      'pcard' +
      (done ? ' done' : '') +
      (status === 'qadha' ? ' qadha' : '') +
      (open ? ' open' : '')
    }>
      <div className="prow">
        <button className="pchev" onClick={onToggle}
          aria-label={open ? 'Tutup detail' : 'Lihat detail'} aria-expanded={open}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: 'transform .22s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
            <path d="M6 3l5 5-5 5"/>
          </svg>
        </button>

        <PrayerRing letter={p.id[0]} pct={done ? 1 : 0} tone={status === 'qadha' ? 'qadha' : 'gold'} style={ring} size={54} />

        <div className="pmeta">
          <div className="pname">
            {p.id}
            <span className="pa">{p.ar}</span>
            {isNext && (
              <span className="next-tag">
                {timeRemaining || 'Berikutnya'}
              </span>
            )}
          </div>
          <div className="psub">
            Jadwal {sched}{done ? ` · dicatat ${time || sched}` : ''}
            {!open && <span className="psub-hint"> · klik ▸ untuk dzikir &amp; amalan</span>}
          </div>
        </div>

        <input className="tinput" value={time} placeholder="--:--" maxLength={5}
          onChange={(e) => onTime(p.k, e.target.value)}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Waktu ${p.id}`} />

        <div className="seg">
          {STATUS.map(([s, lbl]) => (
            <button key={s} className={'segbtn ' + s + (status === s ? ' on' : '')}
              onClick={(e) => { e.stopPropagation(); onStatus(p.k, status === s ? null : s); }}>
              <span className="sd"/>{lbl}
            </button>
          ))}
        </div>
      </div>
      {open && <DetailPanel pKey={p.k} />}
    </div>
  );
}

// ── Prayer Bottom Sheet (mobile) ─────────────────────────────────────────────
function PrayerBottomSheet({ pKey, onClose }) {
  if (!pKey) return null;
  const p = PRAYERS.find((x) => x.k === pKey);
  return (
    <>
      <div className="bottom-sheet-overlay" onClick={onClose} />
      <div className="bottom-sheet">
        <div className="bottom-sheet-handle" />
        <div style={{ fontFamily: 'var(--f-ar)', fontSize: 22, color: 'var(--gold)', textAlign: 'right', direction: 'rtl', marginBottom: 2 }}>
          {p?.ar}
        </div>
        <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 20, color: 'var(--text)', marginBottom: 20 }}>
          {p?.id}
        </div>
        <DetailPanel pKey={pKey} />
      </div>
    </>
  );
}

// ── Prayer Card (grid tile) ──────────────────────────────────────────────────
function PrayerCard({ p, status, time, isNext, onStatus, onSetTime, onClick, schedules, schedLoading }) {
  const done = !!status;
  const sched = p.k === 'tahajud' ? p.sched : (schedules?.[p.k] || (schedLoading ? '...' : p.sched));
  return (
    <div
      className={'prayer-card' + (done ? ' done' : '') + (status === 'qadha' ? ' qadha' : '') + (isNext ? ' next' : '')}
      onClick={() => onClick(p)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <span style={{ fontFamily: 'var(--f-ar)', fontSize: 13, color: done ? 'var(--gold)' : 'var(--text-3)', direction: 'rtl', lineHeight: 1.4 }}>{p.ar}</span>
        <span style={{ color: done ? 'var(--gold)' : 'var(--text-3)', transition: 'color .2s' }}>
          {p.icon}
        </span>
      </div>
      <div style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 15, color: 'var(--text)', marginBottom: 2, letterSpacing: '-.01em' }}>{p.id}</div>
      <div style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 11, color: done ? 'var(--gold)' : 'var(--text-3)', marginBottom: 10 }}>
        {sched}
        {time && done && <span style={{ color: 'var(--text-2)', marginLeft: 4 }}>· {time}</span>}
      </div>
      <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
        {[['ok', '✓', 'Tepat'], ['late', '!', 'Telat'], ['qadha', '○', 'Qadha']].map(([s, icon, lbl]) => (
          <button
            key={s}
            className={'prayer-status-btn ' + s + (status === s ? ' on' : '')}
            onClick={(e) => { e.stopPropagation(); onStatus(p.k, status === s ? null : s); }}
            title={lbl}
          >{icon}</button>
        ))}
      </div>
      {isNext && (
        <div style={{ marginTop: 8, fontSize: 9, padding: '2px 7px', borderRadius: 999, border: '1px solid var(--gold-line)', color: 'var(--gold)', display: 'inline-block', letterSpacing: '.05em', fontFamily: 'var(--f-head)', fontWeight: 700 }}>
          BERIKUTNYA
        </div>
      )}
      {done && (
        <div style={{ position: 'absolute', top: 10, right: 10, width: 7, height: 7, borderRadius: '50%', background: status === 'qadha' ? 'var(--danger)' : 'var(--ok)', boxShadow: `0 0 5px ${status === 'qadha' ? 'var(--danger)' : 'var(--ok)'}` }} />
      )}
    </div>
  );
}

// ── Prayer Amalan Sheet — per-amalan item (sub-component avoids useState-in-map) ──
function AmalanSheetItem({ amalan, done, onToggle }) {
  const [expanded, setExpanded] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const toggleSec = (sec) => setOpenSections(p => ({ ...p, [sec]: !p[sec] }));

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', marginBottom: 10, overflow: 'hidden', opacity: done ? .7 : 1, transition: 'opacity .2s' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px' }}>
        <div
          style={{ width: 22, height: 22, borderRadius: 7, border: `1.5px solid ${done ? 'var(--gold)' : 'var(--border-2)'}`, background: done ? 'var(--gold)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', transition: '.18s', marginTop: 2 }}
          onClick={() => onToggle(amalan.id)}
        >
          {done && <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7.4 5.7 10 11 4.2"/></svg>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--f-ar)', fontSize: 15, color: 'var(--gold)', direction: 'rtl', marginBottom: 3, lineHeight: 1.6 }}>{amalan.nameAr}</div>
          <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 14, color: done ? 'var(--text-2)' : 'var(--text)', textDecoration: done ? 'line-through' : 'none' }}>{amalan.name}</div>
        </div>
        <button onClick={() => setExpanded(e => !e)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 18, flexShrink: 0, padding: '0 4px' }}>
          {expanded ? '▾' : '›'}
        </button>
      </div>
      {expanded && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '4px 16px 10px' }}>
          {amalan.bacaan?.length > 0 && (
            <div style={{ borderBottom: '1px solid var(--border)' }}>
              <button className="amalan-section-toggle" onClick={() => toggleSec('bacaan')}>
                <span>📿 Bacaan &amp; Lafaz</span><span>{openSections.bacaan ? '▾' : '›'}</span>
              </button>
              {openSections.bacaan && (
                <div style={{ paddingBottom: 12 }}>
                  {amalan.bacaan.map((b, i) => (
                    <div key={i} style={{ background: 'var(--elevated)', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                      <div style={{ marginBottom: 8 }}>
                        <span className="chip" style={{ fontSize: 10, padding: '2px 8px', pointerEvents: 'none' }}>{b.jumlah}</span>
                      </div>
                      <div style={{ fontFamily: 'var(--f-ar)', fontSize: 19, color: 'var(--gold)', direction: 'rtl', lineHeight: 2, marginBottom: 8 }}>{b.ar}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)', fontStyle: 'italic', marginBottom: 6, lineHeight: 1.6 }}>{b.latin}</div>
                      <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7 }}>"{b.arti}"</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {amalan.tuntunan && (
            <div style={{ borderBottom: '1px solid var(--border)' }}>
              <button className="amalan-section-toggle" onClick={() => toggleSec('tuntunan')}>
                <span>📋 Cara Mengamalkan</span><span>{openSections.tuntunan ? '▾' : '›'}</span>
              </button>
              {openSections.tuntunan && <div style={{ paddingBottom: 12 }}><p style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>{amalan.tuntunan}</p></div>}
            </div>
          )}
          {amalan.khasiat && (
            <div style={{ borderBottom: '1px solid var(--border)' }}>
              <button className="amalan-section-toggle" onClick={() => toggleSec('khasiat')}>
                <span>✨ Khasiat &amp; Faedah</span><span>{openSections.khasiat ? '▾' : '›'}</span>
              </button>
              {openSections.khasiat && <div style={{ paddingBottom: 12 }}><p style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>{amalan.khasiat}</p></div>}
            </div>
          )}
          {amalan.dalil && (
            <div style={{ borderBottom: '1px solid var(--border)' }}>
              <button className="amalan-section-toggle" onClick={() => toggleSec('dalil')}>
                <span>📖 Dalil Anjuran</span><span>{openSections.dalil ? '▾' : '›'}</span>
              </button>
              {openSections.dalil && (
                <div style={{ paddingBottom: 12 }}>
                  <p style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.7, margin: '0 0 8px' }}>{amalan.dalil}</p>
                  {amalan.sumber && <div style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 11, color: 'var(--gold)', letterSpacing: '.04em' }}>{amalan.sumber}</div>}
                </div>
              )}
            </div>
          )}
          {amalan.keutamaan && (
            <div>
              <button className="amalan-section-toggle" onClick={() => toggleSec('keutamaan')}>
                <span>⭐ Keutamaan</span><span>{openSections.keutamaan ? '▾' : '›'}</span>
              </button>
              {openSections.keutamaan && <div style={{ paddingBottom: 12 }}><p style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>{amalan.keutamaan}</p></div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// ── Dashboard Page ───────────────────────────────────────────────────────────
export function DashboardPage({
  prayers, times, sunnah, setStatus, setTime, toggleSunnah,
  score, ring, streak, freeze, useFreeze, pulse, go,
  misiDone = {}, onMisiToggle, toggleMisi, dailyPoints = 0, totalPoints = 0, badgeToast, clearBadgeToast,
  userName = 'Akhi', onPrayerCardClick,
}) {
  const misiToggleFn = toggleMisi || onMisiToggle;
  const doneCount = PRAYERS.filter((p) => prayers[p.k]).length;
  const sunCount = SUNNAH.filter((s) => sunnah[s]).length;
  const level = getLevel(totalPoints);

  // Live prayer times from Aladhan API
  const { schedules, loading: schedLoading, error: schedError, retry } = usePrayerTimes();

  // Next prayer key based on real WIB clock
  const nextK = Object.keys(schedules).length > 0
    ? getNextPrayerKey(schedules)
    : PRAYERS.find((p) => !prayers[p.k])?.k;

  // Live clock — updates every second
  const [clock, setClock] = useState(() =>
    _wibNow().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );
  useEffect(() => {
    const tid = setInterval(() => {
      setClock(_wibNow().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(tid);
  }, []);

  // Time-remaining label — updates every minute
  const [remaining, setRemaining] = useState({});
  useEffect(() => {
    const update = () => {
      const r = {};
      PRAYERS.forEach((p) => { r[p.k] = getTimeRemaining(schedules[p.k]); });
      setRemaining(r);
    };
    update();
    const tid = setInterval(update, 60000);
    return () => clearInterval(tid);
  }, [schedules]);

  // Panel shows: last prayed prayer, or next if none prayed
  const lastPrayed = [...PRAYERS].reverse().find((p) => prayers[p.k] === 'ok' || prayers[p.k] === 'late');
  const panelKey = lastPrayed?.k || nextK;

  const nextPrayer = PRAYERS.find((p) => p.k === nextK);
  const nextSched  = nextPrayer ? (schedules[nextK] || (schedLoading ? '...' : '--:--')) : '--:--';

  return (
    <div className="main fade-in">
      {/* Badge Toast */}
      {badgeToast && <BadgeToast badge={badgeToast} onDone={clearBadgeToast} />}

      <div className="content scrl">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: 'var(--f-ar)', direction: 'rtl', color: 'var(--gold)', fontSize: 14, marginBottom: 4 }}>
              {_arDate()}
            </div>
            <h1 className="h1">{_idDate()}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 5 }}>
              <span style={{ fontFamily: 'var(--f-head)', fontSize: 13, color: 'var(--text-2)', letterSpacing: '.04em' }}>
                {clock} <span style={{ color: 'var(--text-3)', fontSize: 11 }}>WIB</span>
              </span>
              {schedError && (
                <button onClick={retry} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: 12, padding: '2px 6px', borderRadius: 6, borderLeft: '1px solid var(--border)' }}>
                  ⟳ Muat ulang jadwal
                </button>
              )}
            </div>
          </div>
          {nextPrayer && (
            <div className="card" style={{ padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <span style={{ color: 'var(--gold)' }}>{Icon.spark}</span>
              <div>
                <div className="eyebrow" style={{ fontSize: 10 }}>Solat berikutnya</div>
                <div style={{ fontFamily: 'var(--f-head)', fontWeight: 500, fontSize: 14, color: 'var(--text)', marginTop: 1 }}>
                  {nextPrayer.id}
                  <span style={{ color: 'var(--text-3)', fontWeight: 400 }}> · {nextSched}</span>
                </div>
                {remaining[nextK] && (
                  <div style={{ fontSize: 11, color: 'var(--mint)', marginTop: 2 }}>{remaining[nextK]}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Timbangan Amal */}
        <TimbangAmal dailyPoints={dailyPoints} totalPoints={totalPoints} />

        {/* Mobile stats strip (hidden on desktop via CSS) */}
        <div className="mobile-stats-strip">
          {[
            { label: 'Streak',  val: streak,                  unit: 'hari',     col: 'var(--mint)' },
            { label: 'Skor',    val: `${Math.round(score * 100)}%`, unit: 'hari ini', col: 'var(--gold)' },
            { label: 'Solat',   val: `${doneCount}/5`,         unit: 'wajib',    col: 'var(--text)' },
            { label: 'Freeze',  val: freeze,                   unit: 'tersisa',  col: 'var(--text)' },
          ].map(({ label, val, unit, col }) => (
            <div key={label} className="mobile-stat-card">
              <div style={{ fontFamily: 'var(--f-body)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--mint)', marginBottom: 4 }}>{label}</div>
              <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 26, color: col, letterSpacing: '-0.5px', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>{unit}</div>
            </div>
          ))}
        </div>

        {/* Prayer card grid */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="eyebrow">Waktu Sholat</span>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{doneCount} / 5 dicatat</span>
        </div>
        <div className="prayer-grid">
          {PRAYER_CARDS.map((p) => (
            <PrayerCard
              key={p.k}
              p={p}
              status={prayers[p.k]}
              time={times[p.k]}
              isNext={p.k === nextK}
              onStatus={setStatus}
              onSetTime={(k) => setTime(k, _wibNow().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hour12: false }))}
              onClick={() => onPrayerCardClick && onPrayerCardClick(p)}
              schedules={schedules}
              schedLoading={schedLoading}
            />
          ))}
        </div>

        {/* Sunnah chips */}
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

      {/* Right column — Solo Leveling */}
      <div className="col-r scrl">
        <SoloLevelingPanel
          totalPoints={totalPoints}
          streak={streak}
          freeze={freeze}
          score={score}
          prayers={prayers}
          misiDone={misiDone}
        />

        <button
          className="sl-arise-btn"
          onClick={() => go('amalan')}
          style={{ marginBottom: 16 }}
        >
          ⚔ ARISE — Buka Daily Quest
        </button>

        {/* Mission Panel */}
        {panelKey && (
          <MisiPanel prayerKey={panelKey} misiDone={misiDone}
            onToggle={(id, allMisi) => misiToggleFn(id, allMisi)} />
        )}

      </div>

    </div>
  );
}

// ─── IBADAH POINT SYSTEM ──────────────────────────────────────────────────
export const IBADAH_POINTS = {
  sholat_tepat: 30,
  sholat_telat: 20,
  sholat_qadha: 10,
  sunnah_rawatib: 15,
  sunnah_dhuha: 20,
  sunnah_tahajud: 25,
  sunnah_witir: 15,
  misi_sholat: 15,
  misi_dzikir: 8,
  misi_doa: 8,
  amalan_dzikir: 10,
  amalan_quran: 15,
  amalan_puasa: 25,
  amalan_sedekah: 10,
  bonus_semua_wajib: 20,
  bonus_semua_tepat: 30,
  bonus_semua_misi: 15,
};

export const GRADE_SYSTEM = [
  { grade: 'A+', label: 'Istimewa',    min: 95, color: '#00cfef', desc: 'MasyaAllah, hari yang sempurna!' },
  { grade: 'A',  label: 'Sangat Baik', min: 85, color: '#00b4d8', desc: 'Hari yang luar biasa, terus pertahankan!' },
  { grade: 'B+', label: 'Baik Sekali', min: 75, color: '#0099cc', desc: 'Ibadah hari ini sangat bagus.' },
  { grade: 'B',  label: 'Baik',        min: 65, color: '#0077aa', desc: 'Ibadah hari ini sudah baik.' },
  { grade: 'C+', label: 'Cukup Baik',  min: 55, color: '#005588', desc: 'Masih bisa ditingkatkan lagi.' },
  { grade: 'C',  label: 'Cukup',       min: 45, color: '#f0a500', desc: 'Jangan menyerah, besok lebih baik.' },
  { grade: 'D',  label: 'Perlu Usaha', min: 30, color: '#cc6600', desc: 'Yuk semangat, Allah Maha Menerima Taubat.' },
  { grade: 'F',  label: 'Belum Mulai', min: 0,  color: '#e05555', desc: 'Hari ini belum mulai, masih ada waktu!' },
];

export function getGrade(pct) {
  return GRADE_SYSTEM.find(g => pct >= g.min) || GRADE_SYSTEM[GRADE_SYSTEM.length - 1];
}

export function calcDailyPoints({ prayers = {}, sunnah = {}, misiDone = {}, amalanDone = {} }) {
  let points = 0;
  let breakdown = { wajib: 0, sunnah: 0, misi: 0, amalan: 0, bonus: 0 };

  const PRAYER_KEYS = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
  let allDone = true, allTepat = true;
  PRAYER_KEYS.forEach(k => {
    if (prayers[k] === 'ok')    { points += IBADAH_POINTS.sholat_tepat;  breakdown.wajib += IBADAH_POINTS.sholat_tepat; }
    else if (prayers[k] === 'late') { points += IBADAH_POINTS.sholat_telat; breakdown.wajib += IBADAH_POINTS.sholat_telat; allTepat = false; }
    else if (prayers[k] === 'qadha') { points += IBADAH_POINTS.sholat_qadha; breakdown.wajib += IBADAH_POINTS.sholat_qadha; allTepat = false; }
    else { allDone = false; allTepat = false; }
  });

  if (allDone)  { points += IBADAH_POINTS.bonus_semua_wajib;  breakdown.bonus += IBADAH_POINTS.bonus_semua_wajib; }
  if (allTepat) { points += IBADAH_POINTS.bonus_semua_tepat; breakdown.bonus += IBADAH_POINTS.bonus_semua_tepat; }

  const SUNNAH_MAP = {
    'Rawatib Subuh': 'sunnah_rawatib', 'Rawatib Dzuhur': 'sunnah_rawatib',
    'Rawatib Maghrib': 'sunnah_rawatib', 'Rawatib Isya': 'sunnah_rawatib',
    'Dhuha': 'sunnah_dhuha', 'Tahajud': 'sunnah_tahajud', 'Witir': 'sunnah_witir',
  };
  Object.entries(sunnah).forEach(([k, v]) => {
    if (v && SUNNAH_MAP[k]) { const p = IBADAH_POINTS[SUNNAH_MAP[k]]; points += p; breakdown.sunnah += p; }
  });

  Object.entries(misiDone).forEach(([id, done]) => {
    if (!done) return;
    if (id.includes('rawatib') || id.includes('witir') || id.includes('dhuha') || id.includes('tahajud') || id.includes('niat')) {
      points += IBADAH_POINTS.misi_sholat; breakdown.misi += IBADAH_POINTS.misi_sholat;
    } else if (id.includes('doa')) {
      points += IBADAH_POINTS.misi_doa; breakdown.misi += IBADAH_POINTS.misi_doa;
    } else {
      points += IBADAH_POINTS.misi_dzikir; breakdown.misi += IBADAH_POINTS.misi_dzikir;
    }
  });

  const AMALAN_MAP = {
    'dzikir-pagi': 'amalan_dzikir', 'dzikir-petang': 'amalan_dzikir',
    'shalawat-100': 'amalan_dzikir', 'istighfar-100': 'amalan_dzikir',
    'baca-quran': 'amalan_quran', 'baca-alkahfi-jumat': 'amalan_quran',
    'puasa-senin-kamis': 'amalan_puasa', 'sedekah-harian': 'amalan_sedekah',
    'sholat-dhuha': 'sunnah_dhuha', 'sholat-rawatib': 'sunnah_rawatib',
    'sholat-tahajud': 'sunnah_tahajud', 'sholat-witir': 'sunnah_witir',
  };
  Object.entries(amalanDone).forEach(([id, done]) => {
    if (!done) return;
    const key = AMALAN_MAP[id];
    if (key) { const p = IBADAH_POINTS[key]; points += p; breakdown.amalan += p; }
  });

  return { points, breakdown };
}

export function calcMaxPoints() {
  return (
    IBADAH_POINTS.sholat_tepat * 5 +
    IBADAH_POINTS.bonus_semua_wajib +
    IBADAH_POINTS.bonus_semua_tepat +
    IBADAH_POINTS.sunnah_rawatib * 4 +
    IBADAH_POINTS.sunnah_dhuha +
    IBADAH_POINTS.sunnah_tahajud +
    IBADAH_POINTS.sunnah_witir +
    IBADAH_POINTS.misi_sholat * 10 +
    IBADAH_POINTS.misi_dzikir * 15 +
    IBADAH_POINTS.amalan_dzikir * 4 +
    IBADAH_POINTS.amalan_quran * 2 +
    IBADAH_POINTS.amalan_puasa +
    IBADAH_POINTS.amalan_sedekah
  );
}
