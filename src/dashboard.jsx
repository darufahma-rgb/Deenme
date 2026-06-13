// dashboard.jsx — Dashboard layout + prayer tracker + mission & reward system
import { useState, useEffect, useRef } from 'react';
import { Icon, PrayerRing, ScoreRing, fireConfetti } from './ui.jsx';

export const PRAYERS = [
  { k: 'subuh',   id: 'Subuh',   ar: 'الفجر'  },
  { k: 'dzuhur',  id: 'Dzuhur',  ar: 'الظهر'  },
  { k: 'ashar',   id: 'Ashar',   ar: 'العصر'  },
  { k: 'maghrib', id: 'Maghrib', ar: 'المغرب' },
  { k: 'isya',    id: 'Isya',    ar: 'العشاء' },
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
  const color = TYPE_COLOR[misi.type] || 'var(--gold)';
  const bg    = TYPE_BG[misi.type]    || 'var(--gold-soft)';
  return (
    <div className={'misi-item' + (done ? ' done' : '')}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        {/* Checkbox */}
        <button onClick={onToggle} className="misi-check" style={{
          borderColor: done ? color : 'var(--border-2)',
          background: done ? bg : 'transparent',
        }} aria-label={done ? 'Tandai belum selesai' : 'Tandai selesai'}>
          {done && (
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7.4 5.7 10 11 4.2"/>
            </svg>
          )}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Arabic name */}
          <div style={{ fontFamily: 'var(--f-ar)', direction: 'rtl', fontSize: 14, color: done ? color : 'var(--gold)', lineHeight: 1.5, marginBottom: 1 }}>
            {misi.nameAr}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 13, color: done ? 'var(--text-2)' : 'var(--text)', textDecoration: done ? 'line-through' : 'none' }}>
              {misi.name}
            </span>
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '.05em', padding: '1px 7px',
              borderRadius: 9999, border: `1px solid ${color}40`,
              color, background: bg,
            }}>{TYPE_LABEL[misi.type]}</span>
            {(misi.rakaat || misi.count) && (
              <span style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 500 }}>
                {misi.rakaat ? misi.rakaat + ' rakaat' : misi.count}
              </span>
            )}
          </div>

          {/* Expandable desc */}
          <button onClick={() => setOpen((o) => !o)} style={{
            marginTop: 4, background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4, padding: 0,
          }}>
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transition: 'transform .2s', transform: open ? 'rotate(90deg)' : 'none' }}>
              <path d="M6 3l5 5-5 5"/>
            </svg>
            {open ? 'Tutup' : 'Keterangan'}
          </button>
          {open && (
            <div style={{
              marginTop: 6, fontSize: 12, color: 'var(--text-2)', lineHeight: 1.55,
              background: 'var(--elevated)', borderRadius: 7, padding: '8px 10px',
              borderLeft: `2px solid ${color}50`,
              animation: 'detailIn .2s ease both',
            }}>{misi.desc}</div>
          )}
        </div>
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
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span className="eyebrow">{data.label}</span>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{doneCount}/{data.misi.length}</span>
        </div>
        <div style={{ height: 3, background: 'var(--elevated)', borderRadius: 9999, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 9999,
            width: (pct * 100) + '%',
            background: pct >= 1 ? 'linear-gradient(90deg, var(--gold), var(--mint))' : 'var(--gold)',
            transition: 'width 500ms ease',
          }} />
        </div>
      </div>
      <div style={{ padding: '6px 0 4px' }}>
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
        <div style={{ padding: '6px 0 16px' }}>
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

// ── Dashboard Page ───────────────────────────────────────────────────────────
export function DashboardPage({
  prayers, times, sunnah, setStatus, setTime, toggleSunnah,
  score, ring, streak, freeze, useFreeze, pulse, go,
  misiDone = {}, onMisiToggle, dailyPoints = 0, totalPoints = 0, misiPopup, setMisiPopup, badgeToast, clearBadgeToast,
}) {
  const [openKey, setOpenKey] = useState(null);
  const toggleOpen = (k) => setOpenKey((prev) => prev === k ? null : k);
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

        {/* Prayer list */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="eyebrow">Solat Wajib</span>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{doneCount} / 5 dicatat</span>
        </div>
        <div className="plist">
          {PRAYERS.map((p) => (
            <PrayerRowItem key={p.k} p={p} status={prayers[p.k]} time={times[p.k] || ''}
              sched={schedules[p.k] || (schedLoading ? '...' : '--:--')}
              isNext={p.k === nextK}
              timeRemaining={remaining[p.k]}
              ring={ring} onStatus={setStatus} onTime={setTime}
              open={openKey === p.k} onToggle={() => toggleOpen(p.k)} />
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

      {/* Right column */}
      <div className="col-r scrl">
        {/* Streak */}
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

        {/* Score ring */}
        <div className="card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
          <ScoreRing pct={score} size={88} />
          <div>
            <div className="eyebrow">Skor hari ini</div>
            <div className="h2" style={{ marginTop: 4 }}>Ibadah</div>
            <div style={{ marginTop: 5, fontSize: 12, color: 'var(--text-3)' }}>{doneCount}/5 wajib · {sunCount}/6 sunnah</div>
          </div>
        </div>

        {/* Level card */}
        <div className="card" style={{ padding: '14px 16px' }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Level Amal</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--f-ar)', fontSize: 17, color: 'var(--gold)', lineHeight: 1.5 }}>{level.ar}</div>
              <div style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 14, color: 'var(--text)', marginTop: 1 }}>{level.name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 22, color: 'var(--gold)', letterSpacing: '-0.5px' }}>{totalPoints}</div>
              <div style={{ fontSize: 10, color: 'var(--text-3)' }}>poin total</div>
            </div>
          </div>
          <div style={{ marginTop: 10, height: 3, background: 'var(--elevated)', borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 9999,
              width: (level.pct * 100) + '%',
              background: 'linear-gradient(90deg, var(--gold), var(--gold-2))',
              transition: 'width 700ms ease',
            }} />
          </div>
          {level.next && (
            <div style={{ marginTop: 5, fontSize: 11, color: 'var(--text-3)', textAlign: 'right' }}>
              {level.next - totalPoints} poin lagi ke level berikutnya
            </div>
          )}
        </div>

        {/* Mission Panel */}
        {panelKey && (
          <MisiPanel prayerKey={panelKey} misiDone={misiDone}
            onToggle={(id, allMisi) => onMisiToggle(id, allMisi)} />
        )}

        {/* Journal shortcut */}
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

      {/* Post-prayer Mission Popup */}
      {misiPopup && (
        <MisiPopup
          prayerKey={misiPopup}
          misiDone={misiDone}
          onToggle={(id, allMisi) => onMisiToggle(id, allMisi)}
          onClose={() => setMisiPopup(null)}
        />
      )}
    </div>
  );
}
