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

export function JournalPage({ go }) {
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
      const response = await fetch('/api/journal/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText }),
      });

      if (response.status === 503) {
        setNoKeyToast(true);
        setTimeout(() => setNoKeyToast(false), 3500);
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

// ─── BANK DOA ─────────────────────────────────────────────
export const DOA = [

  // Per Waktu Solat
  { cat: 'Per Waktu Solat', waktu: 'Subuh', name: 'Dzikir Pagi — Sayyidul Istighfar',
    ar: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    tr: 'Ya Allah, Engkau adalah Rabbku. Tidak ada ilah selain Engkau. Engkau yang menciptakanku dan aku adalah hamba-Mu. Aku berada di atas perjanjian-Mu dan janji-Mu semampuku. Aku berlindung kepada-Mu dari keburukan perbuatanku. Aku mengakui nikmat-Mu atasku dan aku mengakui dosaku, maka ampunilah aku.',
    src: 'HR. Bukhari no. 6306',
    faedah: 'Barangsiapa membacanya di pagi hari dengan penuh keyakinan, lalu meninggal sebelum sore hari, maka ia termasuk ahli surga.' },

  { cat: 'Per Waktu Solat', waktu: 'Subuh', name: 'Dzikir Pagi — Doa Ilmu, Rezeki & Amal',
    ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
    tr: 'Ya Allah, sesungguhnya aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik, dan amal yang diterima.',
    src: 'HR. Ibnu Majah no. 925, dinilai shahih oleh Al-Albani',
    faedah: 'Dibaca setelah salam sholat Subuh sebelum beranjak dari tempat duduk.' },

  { cat: 'Per Waktu Solat', waktu: 'Subuh', name: 'Dzikir Pagi — Al-Ikhlas, Al-Falaq, An-Nas (3×)',
    ar: 'قُلْ هُوَ اللهُ أَحَدٌ، اللهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
    tr: 'Katakanlah: Dialah Allah, Yang Maha Esa. Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu. Dia tidak beranak dan tidak diperanakkan, dan tidak ada seorang pun yang setara dengan Dia.',
    src: 'HR. Abu Dawud no. 5082, HR. Tirmidzi no. 3575',
    faedah: 'Dibaca 3x di pagi hari, cukup sebagai penjagaan dari segala sesuatu.' },

  { cat: 'Per Waktu Solat', waktu: 'Maghrib', name: 'Dzikir Petang — Sayyidul Istighfar',
    ar: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    tr: 'Ya Allah, Engkau adalah Rabbku. Tidak ada ilah selain Engkau. Engkau yang menciptakanku dan aku adalah hamba-Mu. Aku berada di atas perjanjian-Mu dan janji-Mu semampuku. Aku berlindung kepada-Mu dari keburukan perbuatanku. Aku mengakui nikmat-Mu atasku dan aku mengakui dosaku, maka ampunilah aku.',
    src: 'HR. Bukhari no. 6306',
    faedah: 'Barangsiapa membacanya di sore hari dengan penuh keyakinan, lalu meninggal sebelum pagi hari, maka ia termasuk ahli surga.' },

  { cat: 'Per Waktu Solat', waktu: 'Maghrib', name: 'Dzikir Petang — Ayat Kursi',
    ar: 'اللهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ',
    tr: 'Allah, tidak ada ilah melainkan Dia, Yang Maha Hidup lagi terus menerus mengurus makhluk-Nya. Dia tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi.',
    src: 'QS. Al-Baqarah: 255 — HR. Nasai no. 9928',
    faedah: 'Barangsiapa membaca Ayat Kursi setiap selesai sholat, tidak ada yang menghalanginya masuk surga selain kematian.' },

  { cat: 'Per Waktu Solat', waktu: 'Isya', name: 'Doa Sebelum Tidur',
    ar: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    tr: 'Dengan nama-Mu ya Allah, aku mati dan aku hidup.',
    src: 'HR. Bukhari no. 6312, HR. Muslim no. 2711',
    faedah: 'Dibaca saat hendak tidur. Tidur diumpamakan seperti kematian kecil, dan bangun seperti kehidupan kembali.' },

  { cat: 'Per Waktu Solat', waktu: 'Isya', name: 'Doa Sebelum Tidur — Tasbih Fatimah',
    ar: 'سُبْحَانَ اللهِ (٣٣×)، الْحَمْدُ لِلّٰهِ (٣٣×)، اللهُ أَكْبَرُ (٣٤×)',
    tr: 'Maha Suci Allah (33x), Segala puji bagi Allah (33x), Allah Maha Besar (34x).',
    src: 'HR. Bukhari no. 3705, HR. Muslim no. 2727',
    faedah: 'Lebih baik bagimu daripada seorang pembantu. Dibaca sebelum tidur untuk menguatkan badan.' },

  // Ujian
  { cat: 'Ujian', name: 'Doa Minta Tambahan Ilmu',
    ar: 'رَبِّ زِدْنِي عِلْمًا',
    tr: 'Ya Tuhanku, tambahkanlah ilmuku.',
    src: 'QS. Thaha: 114',
    faedah: 'Satu-satunya ayat dalam Al-Quran yang Allah perintahkan Nabi untuk meminta tambahan, yaitu ilmu.' },

  { cat: 'Ujian', name: 'Doa Lapang Dada & Kemudahan Urusan',
    ar: 'رَبِّ اشْرَحْ لِي صَدْرِي، وَيَسِّرْ لِي أَمْرِي، وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي، يَفْقَهُوا قَوْلِي',
    tr: 'Ya Tuhanku, lapangkanlah dadaku, dan mudahkanlah urusanku, dan lepaskanlah kekakuan lidahku, agar mereka mengerti perkataanku.',
    src: 'QS. Thaha: 25-28',
    faedah: 'Doa Nabi Musa sebelum menghadap Firaun. Sangat dianjurkan dibaca sebelum ujian, presentasi, atau berbicara di depan umum.' },

  { cat: 'Ujian', name: 'Doa Sebelum Belajar',
    ar: 'اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي، وَعَلِّمْنِي مَا يَنْفَعُنِي، وَزِدْنِي عِلْمًا',
    tr: 'Ya Allah, berikanlah manfaat kepadaku atas apa yang telah Engkau ajarkan kepadaku, ajarkan aku apa yang bermanfaat bagiku, dan tambahkanlah ilmu kepadaku.',
    src: 'HR. Tirmidzi no. 3599, dinilai hasan oleh Al-Albani',
    faedah: 'Dibaca sebelum memulai belajar atau membaca kitab.' },

  { cat: 'Ujian', name: 'Doa Meminta Pemahaman',
    ar: 'اللَّهُمَّ فَقِّهْنِي فِي الدِّينِ وَعَلِّمْنِي التَّأْوِيلَ',
    tr: 'Ya Allah, pahamkanlah aku dalam agama dan ajarilah aku takwil (pemahaman mendalam).',
    src: 'HR. Bukhari no. 143 — Doa Nabi untuk Ibnu Abbas',
    faedah: 'Nabi mendoakan ini untuk Ibnu Abbas hingga beliau menjadi lautan ilmu tafsir.' },

  { cat: 'Ujian', name: 'Doa Menghafal & Tidak Lupa',
    ar: 'اللَّهُمَّ ارْزُقْنِي حِفْظًا قَوِيًّا وَفَهْمًا ثَاقِبًا',
    tr: 'Ya Allah, anugerahkanlah aku hafalan yang kuat dan pemahaman yang tajam.',
    src: 'Doa ma\'tsur dari ulama salaf',
    faedah: 'Dibaca sebelum menghafal Al-Quran atau materi pelajaran.' },

  // Galau
  { cat: 'Galau', name: 'Doa Nabi Yunus — Doa Dalam Kegelapan',
    ar: 'لَا إِلٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    tr: 'Tiada Tuhan selain Engkau. Maha Suci Engkau. Sungguh aku termasuk orang-orang yang zalim.',
    src: 'QS. Al-Anbiya: 87',
    faedah: 'Doa yang dibaca Nabi Yunus di dalam perut ikan paus. Allah berfirman: maka Kami kabulkan doanya dan Kami selamatkan dia dari kesedihan.' },

  { cat: 'Galau', name: 'Doa Nabi Ayyub — Doa Saat Ditimpa Musibah',
    ar: 'أَنِّي مَسَّنِيَ الضُّرُّ وَأَنْتَ أَرْحَمُ الرَّاحِمِينَ',
    tr: 'Sesungguhnya aku telah ditimpa penyakit (kesulitan) dan Engkau adalah Tuhan Yang Maha Penyayang di antara semua penyayang.',
    src: 'QS. Al-Anbiya: 83',
    faedah: 'Doa Nabi Ayyub setelah bertahun-tahun ditimpa penyakit. Allah langsung mengabulkan dan menyembuhkannya.' },

  { cat: 'Galau', name: 'Doa Minta Ketenangan Hati',
    ar: 'اللَّهُمَّ إِنِّي عَبْدُكَ، ابْنُ عَبْدِكَ، ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ، أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ سَمَّيْتَ بِهِ نَفْسَكَ، أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ، أَوْ عَلَّمْتَهُ أَحَدًا مِنْ خَلْقِكَ، أَوِ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ، أَنْ تَجْعَلَ الْقُرْآنَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجَلَاءَ حُزْنِي، وَذَهَابَ هَمِّي',
    tr: 'Ya Allah, sesungguhnya aku adalah hamba-Mu, anak hamba-Mu (laki-laki), anak hamba-Mu (perempuan). Ubun-ubunku ada di tangan-Mu, keputusan-Mu berlaku padaku, ketetapan-Mu adil bagiku. Aku memohon kepada-Mu dengan setiap nama yang Engkau miliki … agar Engkau menjadikan Al-Quran sebagai musim semi hatiku, cahaya dadaku, pengusir kesedihanku, dan penghilang kegundahanku.',
    src: 'HR. Ahmad no. 3712, dinilai shahih oleh Al-Albani',
    faedah: 'Nabi bersabda: tidaklah seseorang membaca doa ini kecuali Allah akan menghilangkan kesedihannya dan menggantikannya dengan kegembiraan.' },

  { cat: 'Galau', name: 'Hasbunallah — Cukuplah Allah',
    ar: 'حَسْبُنَا اللهُ وَنِعْمَ الْوَكِيلُ',
    tr: 'Cukuplah Allah bagi kami, dan Dia sebaik-baik pelindung.',
    src: 'QS. Ali Imran: 173',
    faedah: 'Ini adalah ucapan Nabi Ibrahim saat dilempar ke dalam api, dan ucapan Nabi Muhammad saat diancam musuh di Perang Uhud.' },

  { cat: 'Galau', name: 'Doa Minta Kesabaran',
    ar: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    tr: 'Ya Tuhan kami, limpahkanlah kesabaran atas diri kami, dan teguhkanlah pendirian kami, dan tolonglah kami terhadap orang-orang kafir.',
    src: 'QS. Al-Baqarah: 250',
    faedah: 'Doa para pejuang saat menghadapi musuh yang jauh lebih banyak. Cocok dibaca saat menghadapi situasi yang terasa mustahil.' },

  // Syukur
  { cat: 'Syukur', name: 'Doa Saat Mendapat Nikmat',
    ar: 'الْحَمْدُ لِلّٰهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ',
    tr: 'Segala puji bagi Allah yang dengan nikmat-Nya sempurnalah segala kebaikan.',
    src: 'HR. Ibnu Majah no. 3803, dinilai hasan oleh Al-Albani',
    faedah: 'Dibaca saat mendapat kabar gembira, keberhasilan, atau nikmat apapun.' },

  { cat: 'Syukur', name: 'Doa Syukur Setelah Makan',
    ar: 'الْحَمْدُ لِلّٰهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    tr: 'Segala puji bagi Allah yang telah memberi kami makan, memberi kami minum, dan menjadikan kami orang-orang Muslim.',
    src: 'HR. Abu Dawud no. 3850, HR. Tirmidzi no. 3457',
    faedah: 'Dibaca setelah selesai makan. Mengakui bahwa makanan adalah nikmat dari Allah.' },

  { cat: 'Syukur', name: 'Doa Agar Bisa Bersyukur',
    ar: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَى وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَدْخِلْنِي بِرَحْمَتِكَ فِي عِبَادِكَ الصَّالِحِينَ',
    tr: 'Ya Tuhanku, ilhamkanlah aku untuk tetap mensyukuri nikmat-Mu yang telah Engkau anugerahkan kepadaku dan kepada kedua orang tuaku dan untuk tetap mengerjakan amal shaleh yang Engkau ridhai, dan masukkanlah aku dengan rahmat-Mu ke dalam golongan hamba-hamba-Mu yang shaleh.',
    src: 'QS. An-Naml: 19 — Doa Nabi Sulaiman',
    faedah: 'Doa ini mengajarkan bahwa syukur bukan hanya ucapan, tapi juga amal shaleh.' },

  { cat: 'Syukur', name: 'Al-Hamdulillah — Pembuka Segala Kebaikan',
    ar: 'الْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ',
    tr: 'Segala puji bagi Allah, Tuhan semesta alam.',
    src: 'QS. Al-Fatihah: 2',
    faedah: 'Nabi bersabda: kalimat alhamdulillah memenuhi timbangan amal.' },

  // Safar
  { cat: 'Safar', name: 'Doa Keluar Rumah',
    ar: 'بِسْمِ اللهِ، تَوَكَّلْتُ عَلَى اللهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ',
    tr: 'Dengan nama Allah, aku bertawakal kepada Allah, dan tidak ada daya dan kekuatan kecuali dengan Allah.',
    src: 'HR. Abu Dawud no. 5095, HR. Tirmidzi no. 3426',
    faedah: 'Barangsiapa membacanya saat keluar rumah, dikatakan kepadanya: kamu telah diberi petunjuk, dicukupi, dan dijaga. Setan pun menjauh darinya.' },

  { cat: 'Safar', name: 'Doa Naik Kendaraan',
    ar: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنقَلِبُونَ',
    tr: 'Maha Suci Allah yang telah menundukkan semua ini bagi kami padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami.',
    src: 'QS. Az-Zukhruf: 13-14',
    faedah: 'Dibaca setiap kali naik kendaraan — mobil, pesawat, motor, kapal. Termasuk sunnah muakkadah safar.' },

  { cat: 'Safar', name: 'Doa Memasuki Kota Baru',
    ar: 'اللَّهُمَّ رَبَّ السَّمَاوَاتِ السَّبْعِ وَمَا أَظْلَلْنَ، وَرَبَّ الْأَرَضِينَ السَّبْعِ وَمَا أَقْلَلْنَ، أَسْأَلُكَ خَيْرَ هٰذِهِ الْقَرْيَةِ وَخَيْرَ أَهْلِهَا',
    tr: 'Ya Allah, Tuhan tujuh langit dan apa yang dinaunginya, Tuhan tujuh bumi dan apa yang dikandungnya. Aku memohon kepada-Mu kebaikan kampung ini dan kebaikan penghuninya.',
    src: 'HR. Nasai no. 8829, dinilai shahih oleh Al-Albani',
    faedah: 'Dibaca saat pertama kali tiba di suatu kota atau tempat baru.' },

  { cat: 'Safar', name: 'Doa Pulang dari Safar',
    ar: 'آيِبُونَ، تَائِبُونَ، عَابِدُونَ، لِرَبِّنَا حَامِدُونَ',
    tr: 'Kami kembali, kami bertobat, kami beribadah, dan kepada Tuhan kami kami memuji.',
    src: 'HR. Bukhari no. 3085, HR. Muslim no. 1342',
    faedah: 'Dibaca Nabi setiap kali kembali dari perjalanan. Menandai kembalinya dengan taubat dan syukur.' },

  // Sakit
  { cat: 'Sakit', name: 'Doa Ruqyah Ma\'tsur — Memohon Kesembuhan',
    ar: 'أَذْهِبِ الْبَأْسَ رَبَّ النَّاسِ، وَاشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا',
    tr: 'Hilangkanlah penyakit ini wahai Tuhan manusia, dan sembuhkanlah, Engkaulah Sang Penyembuh, tidak ada kesembuhan kecuali kesembuhan dari-Mu, kesembuhan yang tidak meninggalkan penyakit sedikit pun.',
    src: 'HR. Bukhari no. 5743, HR. Muslim no. 2191',
    faedah: 'Dibaca sambil mengusapkan tangan ke bagian tubuh yang sakit.' },

  { cat: 'Sakit', name: 'Doa Saat Merasakan Sakit di Tubuh',
    ar: 'بِسْمِ اللهِ (٣×) أَعُوذُ بِاللهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ (٧×)',
    tr: 'Dengan nama Allah (3x). Aku berlindung kepada Allah dan kekuasaan-Nya dari keburukan yang aku rasakan dan yang aku khawatirkan (7x).',
    src: 'HR. Muslim no. 2202',
    faedah: 'Letakkan tangan di bagian yang sakit, baca bismillah 3x, lalu baca doa 7x.' },

  { cat: 'Sakit', name: 'Doa Menjenguk Orang Sakit',
    ar: 'لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللهُ',
    tr: 'Tidak mengapa, semoga (sakit ini) membersihkan (dosa), insya Allah.',
    src: 'HR. Bukhari no. 3616',
    faedah: 'Dibaca saat menjenguk orang yang sakit. Mengingatkan bahwa sakit adalah penghapus dosa.' },

  { cat: 'Sakit', name: 'Doa Ruqyah — Al-Fatihah',
    ar: 'الْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ، الرَّحْمٰنِ الرَّحِيمِ، مَالِكِ يَوْمِ الدِّينِ، إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ، اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    tr: 'Segala puji bagi Allah, Tuhan semesta alam. Yang Maha Pengasih lagi Maha Penyayang. Yang menguasai hari pembalasan. Hanya kepada-Mu kami menyembah dan hanya kepada-Mu kami memohon pertolongan. Tunjukilah kami jalan yang lurus.',
    src: 'QS. Al-Fatihah: 1-5 — HR. Bukhari no. 5736',
    faedah: 'Al-Fatihah adalah Ummul Quran sekaligus ruqyah yang paling mujarab. Nabi membenarkan sahabat yang meruqyah dengan Al-Fatihah.' },

  // Rezeki
  { cat: 'Rezeki', name: 'Doa Kelapangan Rezeki — Penghilang Hutang',
    ar: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    tr: 'Ya Allah, cukupkanlah aku dengan rezeki halal-Mu dari yang haram, dan kayakanlah aku dengan karunia-Mu dari selain-Mu.',
    src: 'HR. Tirmidzi no. 3563, dinilai hasan oleh Al-Albani',
    faedah: 'Ali bin Abi Thalib berkata: Nabi mengajarkan doa ini untuk membayar hutang, sekalipun hutangnya sebesar gunung.' },

  { cat: 'Rezeki', name: 'Doa Pagi untuk Barakah Rezeki',
    ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
    tr: 'Ya Allah, sesungguhnya aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik (halal dan berkah), dan amal yang diterima.',
    src: 'HR. Ibnu Majah no. 925, dinilai shahih oleh Al-Albani',
    faedah: 'Dibaca setelah salam sholat Subuh sebelum beranjak. Tiga permohonan sekaligus: ilmu, rezeki, amal.' },

  { cat: 'Rezeki', name: 'Doa Saat Berhutang',
    ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    tr: 'Ya Allah, aku berlindung kepada-Mu dari rasa gundah dan sedih, dari kelemahan dan kemalasan, dari kebakhilan dan ketakutan, dari lilitan hutang dan penguasaan orang lain.',
    src: 'HR. Bukhari no. 6369',
    faedah: 'Nabi membaca doa ini setiap pagi dan petang. Termasuk berlindung dari lilitan hutang (dhala\'id-dain).' },

  { cat: 'Rezeki', name: 'Doa Setelah Sholat Dhuha untuk Rezeki',
    ar: 'اللَّهُمَّ إِنَّ الضُّحَى ضُحَاؤُكَ، وَالْبَهَاءَ بَهَاؤُكَ، وَالْجَمَالَ جَمَالُكَ، وَالْقُوَّةَ قُوَّتُكَ، وَالْقُدْرَةَ قُدْرَتُكَ، وَالْعِصْمَةَ عِصْمَتُكَ. اللَّهُمَّ إِنْ كَانَ رِزْقِي فِي السَّمَاءِ فَأَنْزِلْهُ، وَإِنْ كَانَ فِي الْأَرْضِ فَأَخْرِجْهُ',
    tr: 'Ya Allah, sesungguhnya waktu dhuha adalah waktu dhuha-Mu, keagungan adalah keagungan-Mu, keindahan adalah keindahan-Mu, kekuatan adalah kekuatan-Mu, kekuasaan adalah kekuasaan-Mu, dan penjagaan adalah penjagaan-Mu. Ya Allah, jika rezekiku ada di langit maka turunkanlah, dan jika ada di bumi maka keluarkanlah.',
    src: 'Doa ma\'tsur dari ulama, diriwayatkan dalam kitab-kitab doa',
    faedah: 'Dibaca setelah sholat Dhuha selesai.' },
];

const DOA_TABS = ['Semua', 'Per Waktu Solat', 'Ujian', 'Galau', 'Syukur', 'Safar', 'Sakit', 'Rezeki'];

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

export function BankDoaPage({ bookmarks, toggleBookmark, userDoa, addDoa }) {
  const [tab, setTab] = useState('Semua');
  const [modal, setModal] = useState(false);
  const all = [...userDoa, ...DOA];
  const list = all.filter((d) => tab === 'Semua' || d.cat === tab);
  return (
    <div className="main fade-in">
      <div className="content scrl" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h1 className="h1">Bank Doa</h1>
            <div style={{ marginTop: 4, fontSize: 13, color: 'var(--text-3)' }}>{all.length} doa tersimpan · sumber terverifikasi</div>
          </div>
        </div>
        <div className="tabs scrl" style={{ marginBottom: 20 }}>
          {DOA_TABS.map((t) => (
            <button key={t} className={'tab' + (tab === t ? ' on' : '')} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        <div className="doagrid">
          {list.map((d, idx) => {
            const key = d.ar + (d.src || '');
            return (
              <div key={key + idx} className="doacard">
                <button className={'bm' + (bookmarks[key] ? ' on' : '')} onClick={() => toggleBookmark(key)} aria-label="Simpan">
                  {Icon.bookmark(!!bookmarks[key])}
                </button>
                {d.name && (
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gold)', letterSpacing: '.02em', paddingRight: 36 }}>
                    {d.name}
                  </div>
                )}
                <div className="dar" style={{ paddingLeft: 0, paddingRight: d.name ? 0 : 36 }}>{d.ar}</div>
                <div className="dtr">{d.tr}</div>
                {d.faedah && (
                  <div style={{
                    fontSize: 11.5, color: 'var(--text-3)', lineHeight: 1.5,
                    background: 'var(--elevated)', borderRadius: 6, padding: '7px 10px',
                    borderLeft: '2px solid var(--gold-line)',
                  }}>
                    {d.faedah}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span className="dsrc">{d.src}</span>
                  <span style={{ flex: 1 }} />
                  {d.waktu
                    ? <span className="chip" style={{ padding: '2px 9px', fontSize: 11, pointerEvents: 'none' }}>{d.waktu}</span>
                    : <span className="chip" style={{ padding: '2px 9px', fontSize: 11, pointerEvents: 'none' }}>{d.cat}</span>
                  }
                </div>
              </div>
            );
          })}
        </div>
        <button className="fab" onClick={() => setModal(true)} aria-label="Tambah Doa">+</button>
      </div>
      {modal && <AddDoaModal onClose={() => setModal(false)} onAdd={addDoa} />}
    </div>
  );
}

// ─── STATISTIK ────────────────────────────────────────────
export function StatistikPage({ streak, freeze, useFreeze, prayers, sunnah, misiDone, amalanDone, setAmalanDone }) {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState('harian');
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

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

            {/* Full checklist */}
            <div className="eyebrow" style={{ marginBottom: 12 }}>Checklist Ibadah Hari Ini</div>
            {['wajib', 'sunnah', 'amalan'].map(cat => (
              <div key={cat} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: CATEGORY_COLORS[cat], flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 12, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
                    {cat === 'wajib' ? 'Sholat Wajib' : cat === 'sunnah' ? 'Sholat Sunnah' : 'Amalan Harian'}
                  </span>
                </div>
                {CHECKLIST.filter(c => c.category === cat).map(item => (
                  <div key={item.id} className="card" style={{ padding: '10px 14px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12, opacity: item.done ? 1 : 0.7 }}>
                    <div
                      style={{ width: 20, height: 20, borderRadius: 6, border: `1.5px solid ${item.done ? CATEGORY_COLORS[cat] : 'var(--border-2)'}`, background: item.done ? CATEGORY_COLORS[cat] : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: cat === 'amalan' ? 'pointer' : 'default', transition: '.18s' }}
                      onClick={() => { if (cat === 'amalan') setAmalanDone(prev => ({ ...prev, [item.id]: !prev[item.id] })); }}
                    >
                      {item.done && <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7.4 5.7 10 11 4.2"/></svg>}
                    </div>
                    <span style={{ flex: 1, fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 13.5, color: 'var(--text)', textDecoration: item.done ? 'line-through' : 'none', opacity: item.done ? 0.6 : 1 }}>{item.label}</span>
                    <span style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 12, color: CATEGORY_COLORS[cat] }}>+{item.points}</span>
                    {cat !== 'amalan' && item.done && <span style={{ fontSize: 11, color: 'var(--ok)' }}>✓</span>}
                    {cat !== 'amalan' && !item.done && <span style={{ fontSize: 11, color: 'var(--text-3)' }}>—</span>}
                  </div>
                ))}
              </div>
            ))}
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
            <div className="streak" style={{ padding: 22, marginBottom: 16 }}>
              <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 8 }}>🔥 Streak Saat Ini</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 8 }}>
                <span className="bignum">{streak}</span>
                <span className="h2" style={{ marginBottom: 10 }}>hari</span>
              </div>
              <div className="muted tiny" style={{ marginBottom: 14 }}>Terpanjang · {streak} hari</div>
              <button className="btn ghost sm" onClick={useFreeze} style={{ borderColor: 'var(--gold-line)', color: 'var(--gold)' }}>
                ❄️ {freeze} freeze tersisa · Gunakan
              </button>
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

function AmalanDetailPage({ amalan, waktu, onBack }) {
  const [openSections, setOpenSections] = useState({});
  const toggleSec = (sec) => setOpenSections(p => ({ ...p, [sec]: !p[sec] }));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 10 }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 13, padding: '6px 10px 6px 0', flexShrink: 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Kembali
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--f-ar)', fontSize: 15, color: 'var(--gold)', direction: 'rtl', lineHeight: 1.4 }}>{amalan.nameAr}</div>
          <div style={{ fontFamily: 'var(--f-head)', fontWeight: 800, fontSize: 17, color: 'var(--text)', letterSpacing: '-.01em' }}>{amalan.name}</div>
        </div>
      </div>

      {waktu && (
        <div style={{ padding: '10px 24px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span className="chip" style={{ fontSize: 11, pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ color: 'var(--gold)' }}>{WAKTU_ICONS[waktu.id]}</span>
            {waktu.waktu}
          </span>
          <span className="muted tiny">{waktu.waktuDesc}</span>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 60px' }}>
        {amalan.bacaan?.length > 0 && (
          <div className="card" style={{ marginBottom: 12, overflow: 'hidden' }}>
            <button className="amalan-section-toggle" onClick={() => toggleSec('bacaan')}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                Bacaan &amp; Lafaz
              </span>
              <span>{openSections.bacaan ? '▾' : '›'}</span>
            </button>
            {openSections.bacaan && (
              <div style={{ padding: '4px 18px 14px' }}>
                {amalan.bacaan.map((b, i) => (
                  <div key={i} style={{ background: 'var(--elevated)', borderRadius: 10, padding: 14, marginBottom: 10 }}>
                    <span className="chip" style={{ fontSize: 10, padding: '2px 8px', pointerEvents: 'none', marginBottom: 10, display: 'inline-block' }}>{b.jumlah}</span>
                    <div style={{ fontFamily: 'var(--f-ar)', fontSize: 22, color: 'var(--gold)', direction: 'rtl', lineHeight: 2, marginBottom: 10 }}>{b.ar}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)', fontStyle: 'italic', marginBottom: 6, lineHeight: 1.6 }}>{b.latin}</div>
                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7 }}>"{b.arti}"</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {amalan.tuntunan && (
          <div className="card" style={{ marginBottom: 12, overflow: 'hidden' }}>
            <button className="amalan-section-toggle" onClick={() => toggleSec('tuntunan')}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Cara Mengamalkan
              </span>
              <span>{openSections.tuntunan ? '▾' : '›'}</span>
            </button>
            {openSections.tuntunan && <div style={{ padding: '4px 18px 14px' }}><p style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>{amalan.tuntunan}</p></div>}
          </div>
        )}

        {amalan.khasiat && (
          <div className="card" style={{ marginBottom: 12, overflow: 'hidden' }}>
            <button className="amalan-section-toggle" onClick={() => toggleSec('khasiat')}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                Khasiat &amp; Faedah
              </span>
              <span>{openSections.khasiat ? '▾' : '›'}</span>
            </button>
            {openSections.khasiat && <div style={{ padding: '4px 18px 14px' }}><p style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>{amalan.khasiat}</p></div>}
          </div>
        )}

        {amalan.dalil && (
          <div className="card" style={{ marginBottom: 12, overflow: 'hidden' }}>
            <button className="amalan-section-toggle" onClick={() => toggleSec('dalil')}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                Dalil Anjuran
              </span>
              <span>{openSections.dalil ? '▾' : '›'}</span>
            </button>
            {openSections.dalil && (
              <div style={{ padding: '4px 18px 14px' }}>
                <p style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.7, margin: '0 0 8px' }}>{amalan.dalil}</p>
                <div style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 11, color: 'var(--gold)', letterSpacing: '.04em' }}>{amalan.sumber}</div>
              </div>
            )}
          </div>
        )}

        {amalan.keutamaan && (
          <div className="card" style={{ marginBottom: 12, overflow: 'hidden' }}>
            <button className="amalan-section-toggle" onClick={() => toggleSec('keutamaan')}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
                Keutamaan
              </span>
              <span>{openSections.keutamaan ? '▾' : '›'}</span>
            </button>
            {openSections.keutamaan && <div style={{ padding: '4px 18px 14px' }}><p style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>{amalan.keutamaan}</p></div>}
          </div>
        )}
      </div>
    </div>
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

  if (selectedAmalan) {
    return (
      <AmalanDetailPage
        amalan={selectedAmalan}
        waktu={waktuData}
        onBack={() => setSelectedAmalan(null)}
      />
    );
  }

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

      {/* Amalan list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 80px' }}>
        {!waktuData ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-3)', marginBottom: 16 }}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <div className="muted">Amalan untuk waktu ini segera hadir</div>
          </div>
        ) : waktuData.amalan.map((amalan, idx) => {
          const done = !!misiDone?.[amalan.id];
          return (
            <div
              key={amalan.id}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', cursor: 'pointer', transition: 'border-color .15s', opacity: done ? .65 : 1 }}
              onClick={() => setSelectedAmalan(amalan)}
            >
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--elevated)', border: '1px solid var(--border-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 12, color: 'var(--text-3)' }}>
                {idx + 1}
              </div>
              <div
                style={{ width: 22, height: 22, borderRadius: 7, border: `1.5px solid ${done ? 'var(--gold)' : 'var(--border-2)'}`, background: done ? 'var(--gold)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', transition: '.18s' }}
                onClick={(e) => { e.stopPropagation(); toggleMisi(amalan.id); }}
              >
                {done && <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7.4 5.7 10 11 4.2"/></svg>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--f-ar)', fontSize: 14, color: 'var(--gold)', direction: 'rtl', marginBottom: 3, lineHeight: 1.6, textAlign: 'right' }}>{amalan.nameAr}</div>
                <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 14, color: done ? 'var(--text-3)' : 'var(--text)', textDecoration: done ? 'line-through' : 'none' }}>{amalan.name}</div>
                <div className="muted tiny" style={{ marginTop: 3 }}>Ketuk untuk lihat bacaan lengkap</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-3)', flexShrink: 0 }}><path d="M9 18l6-6-6-6"/></svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AmalanPage({ amalanDone, setAmalanDone }) {
  const [activeTab, setActiveTab] = useState('subuh');
  const [openSections, setOpenSections] = useState({});
  const [openAmalan, setOpenAmalan] = useState({});

  const currentWaktu = AMALAN_PER_WAKTU.find(w => w.id === activeTab);
  const doneInTab = currentWaktu?.amalan.filter(a => amalanDone?.[a.id]).length || 0;
  const totalInTab = currentWaktu?.amalan.length || 0;

  const toggleSection = (amalanId, section) => {
    const key = `${amalanId}-${section}`;
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAmalan = (id) => {
    setOpenAmalan(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isOpen = (amalanId, section) => openSections[`${amalanId}-${section}`];

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

        {/* Tabs — scrollable */}
        <div className="tabs scrl" style={{ marginBottom: 20, gap: 6 }}>
          {AMALAN_PER_WAKTU.map(w => (
            <button
              key={w.id}
              className={'tab' + (activeTab === w.id ? ' on' : '')}
              onClick={() => setActiveTab(w.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
            >
              <span style={{ opacity: activeTab === w.id ? 1 : 0.6 }}>{WAKTU_ICONS[w.id]}</span>
              <span>{w.waktu}</span>
            </button>
          ))}
        </div>

        {/* Waktu header */}
        {currentWaktu && (
          <div className="card" style={{ padding: '14px 18px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ color: 'var(--gold)', flexShrink: 0 }}>
              {WAKTU_BIG_ICONS[currentWaktu.id]}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--f-ar)', fontSize: 18, color: 'var(--gold)', direction: 'rtl', marginBottom: 2 }}>{currentWaktu.waktuAr}</div>
              <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{currentWaktu.waktu}</div>
              <div className="muted tiny">{currentWaktu.waktuDesc}</div>
            </div>
          </div>
        )}

        {/* Amalan list */}
        {currentWaktu?.amalan.map(amalan => {
          const done = !!amalanDone?.[amalan.id];
          const expanded = !!openAmalan[amalan.id];
          return (
            <div key={amalan.id} className="card" style={{ marginBottom: 10, overflow: 'hidden', opacity: done ? .7 : 1, transition: 'opacity .2s' }}>
              {/* Amalan header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px 18px' }}>
                <div
                  style={{ width: 22, height: 22, borderRadius: 7, border: `1.5px solid ${done ? 'var(--gold)' : 'var(--border-2)'}`, background: done ? 'var(--gold)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', transition: '.18s', marginTop: 2 }}
                  onClick={() => setAmalanDone(prev => ({ ...prev, [amalan.id]: !prev[amalan.id] }))}
                >
                  {done && <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="#020d10" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7.4 5.7 10 11 4.2"/></svg>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--f-ar)', fontSize: 17, color: 'var(--gold)', direction: 'rtl', marginBottom: 3, lineHeight: 1.6 }}>{amalan.nameAr}</div>
                  <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 15, color: done ? 'var(--text-2)' : 'var(--text)', textDecoration: done ? 'line-through' : 'none' }}>{amalan.name}</div>
                </div>
                <button
                  onClick={() => toggleAmalan(amalan.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 18, padding: '0 4px', flexShrink: 0 }}
                >
                  {expanded ? '▾' : '›'}
                </button>
              </div>

              {/* Expandable detail */}
              {expanded && (
                <div style={{ borderTop: '1px solid var(--border)', padding: '4px 18px 8px' }}>

                  {/* Bacaan */}
                  <div style={{ borderBottom: '1px solid var(--border)' }}>
                    <button className="amalan-section-toggle" onClick={() => toggleSection(amalan.id, 'bacaan')}>
                      <span>📿 Bacaan & Lafaz</span>
                      <span>{isOpen(amalan.id, 'bacaan') ? '▾' : '›'}</span>
                    </button>
                    {isOpen(amalan.id, 'bacaan') && (
                      <div style={{ paddingBottom: 14 }}>
                        {amalan.bacaan.map((b, i) => (
                          <div key={i} className="amalan-bacaan-item" style={{ marginBottom: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                              <span className="chip" style={{ fontSize: 10, padding: '2px 8px', pointerEvents: 'none' }}>{b.jumlah}</span>
                            </div>
                            <div style={{ fontFamily: 'var(--f-ar)', fontSize: 22, color: 'var(--gold)', direction: 'rtl', lineHeight: 2, marginBottom: 10 }}>{b.ar}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-2)', fontStyle: 'italic', marginBottom: 6, lineHeight: 1.6 }}>{b.latin}</div>
                            <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7 }}>"{b.arti}"</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tuntunan */}
                  <div style={{ borderBottom: '1px solid var(--border)' }}>
                    <button className="amalan-section-toggle" onClick={() => toggleSection(amalan.id, 'tuntunan')}>
                      <span>📋 Cara Mengamalkan</span>
                      <span>{isOpen(amalan.id, 'tuntunan') ? '▾' : '›'}</span>
                    </button>
                    {isOpen(amalan.id, 'tuntunan') && (
                      <div style={{ paddingBottom: 14 }}>
                        <p style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>{amalan.tuntunan}</p>
                      </div>
                    )}
                  </div>

                  {/* Khasiat */}
                  <div style={{ borderBottom: '1px solid var(--border)' }}>
                    <button className="amalan-section-toggle" onClick={() => toggleSection(amalan.id, 'khasiat')}>
                      <span>✨ Khasiat & Faedah</span>
                      <span>{isOpen(amalan.id, 'khasiat') ? '▾' : '›'}</span>
                    </button>
                    {isOpen(amalan.id, 'khasiat') && (
                      <div style={{ paddingBottom: 14 }}>
                        <p style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>{amalan.khasiat}</p>
                      </div>
                    )}
                  </div>

                  {/* Dalil */}
                  <div style={{ borderBottom: '1px solid var(--border)' }}>
                    <button className="amalan-section-toggle" onClick={() => toggleSection(amalan.id, 'dalil')}>
                      <span>📖 Dalil Anjuran</span>
                      <span>{isOpen(amalan.id, 'dalil') ? '▾' : '›'}</span>
                    </button>
                    {isOpen(amalan.id, 'dalil') && (
                      <div style={{ paddingBottom: 14 }}>
                        <p style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.7, margin: '0 0 8px' }}>{amalan.dalil}</p>
                        <div style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 11, color: 'var(--gold)', letterSpacing: '.04em' }}>{amalan.sumber}</div>
                      </div>
                    )}
                  </div>

                  {/* Keutamaan */}
                  <div>
                    <button className="amalan-section-toggle" onClick={() => toggleSection(amalan.id, 'keutamaan')} style={{ borderBottom: 'none' }}>
                      <span>⭐ Keutamaan</span>
                      <span>{isOpen(amalan.id, 'keutamaan') ? '▾' : '›'}</span>
                    </button>
                    {isOpen(amalan.id, 'keutamaan') && (
                      <div style={{ paddingBottom: 14 }}>
                        <p style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>{amalan.keutamaan}</p>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
