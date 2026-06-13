// pages.jsx — Jurnal, Bank Doa, Statistik, Amalan Harian
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Icon } from './ui.jsx';
import { BADGES, getLevel, getGrade, calcDailyPoints, calcMaxPoints, IBADAH_POINTS } from './dashboard.jsx';

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

    const apiKey = import.meta.env.VITE_OPENROUTER_KEY;
    if (!apiKey) {
      setNoKeyToast(true);
      setTimeout(() => setNoKeyToast(false), 3500);
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://deenme.app',
          'X-Title': 'Deenme Journal',
        },
        body: JSON.stringify({
          model: 'google/gemini-flash-1.5',
          messages: [
            {
              role: 'system',
              content: `Kamu adalah asisten jurnal pribadi Muslim yang bertugas merapikan dan memperindah catatan harian.\n\nTugasmu:\n1. Perbaiki diksi dan tata bahasa Indonesia (santai tapi tetap elegan)\n2. Strukturkan dengan markdown: gunakan ## untuk heading utama, ### untuk sub-heading jika perlu\n3. Pisahkan paragraf dengan baik\n4. Pertahankan makna, suasana, dan kesan personal dari tulisan asli — jangan ubah fakta atau perasaan\n5. Jika ada ungkapan Arab/doa, pertahankan dengan benar\n6. Jangan tambahkan konten yang tidak ada di tulisan asli\n7. Mulai langsung dengan konten, tanpa pengantar atau penjelasan apapun\n8. Output hanya markdown, tidak ada komentar tambahan`,
            },
            { role: 'user', content: rawText },
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const result = data.choices?.[0]?.message?.content;
      if (result) {
        setMarkdownContent(result);
        setIsMarkdownMode(true);
        setEmpty(false);
      }
    } catch (err) {
      console.error('OpenRouter error:', err);
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

// ─── AMALAN HARIAN ────────────────────────────────────────
const AMALAN_HARIAN = [
  {
    id: 'dzikir-pagi',
    name: 'Dzikir Pagi',
    nameAr: 'أَذْكَارُ الصَّبَاحِ',
    category: 'dzikir',
    time: 'Setelah Subuh',
    rakaat: null,
    bacaan: [
      { ar: 'اللهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...', latin: 'Allahu laa ilaaha illaa huwal hayyul qayyuum...', arti: 'Allah, tidak ada ilah melainkan Dia, Yang Maha Hidup...', nama: 'Ayat Kursi', jumlah: '1×', src: 'QS. Al-Baqarah: 255' },
      { ar: 'قُلْ هُوَ اللهُ أَحَدٌ...', latin: 'Qul huwallahu ahad...', arti: 'Katakanlah: Dialah Allah Yang Maha Esa...', nama: 'Al-Ikhlas, Al-Falaq, An-Nas', jumlah: '3× masing-masing', src: 'HR. Abu Dawud no. 5082' },
      { ar: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ', latin: 'Subhaanallahi wa bihamdih', arti: 'Maha Suci Allah dan segala puji bagi-Nya', nama: 'Tasbih Pagi', jumlah: '33x Subhanallah, 33x Alhamdulillah, 34x Allahu Akbar', src: 'HR. Muslim no. 597' },
      { ar: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ', latin: 'Allahumma anta rabbii laa ilaaha illaa anta...', arti: 'Ya Allah, Engkau adalah Rabbku, tidak ada ilah selain Engkau...', nama: 'Sayyidul Istighfar', jumlah: '1×', src: 'HR. Bukhari no. 6306' },
    ],
    keutamaan: 'Barangsiapa mengucapkan Sayyidul Istighfar di pagi hari dengan penuh keyakinan, lalu meninggal sebelum sore hari, maka ia termasuk ahli surga. (HR. Bukhari no. 6306)',
    dalil: 'Dari Abdullah bin Khubaib radhiyallahu anhu, Rasulullah ﷺ bersabda: "Bacalah Al-Ikhlas, Al-Falaq, dan An-Nas tiga kali di pagi dan sore hari — itu cukup bagimu dari segala sesuatu." (HR. Abu Dawud no. 5082, shahih Al-Albani)',
    faedah: 'Dzikir pagi adalah perisai harian dari gangguan setan, sihir, penyakit ain, dan keburukan hari itu. Membaca Ayat Kursi setelah sholat wajib, tidak ada yang menghalanginya masuk surga selain kematian.',
    tuntunan: 'Duduk di tempat sholat setelah salam Subuh. Baca Ayat Kursi (1×), Al-Ikhlas/Al-Falaq/An-Nas (3× masing-masing), tasbih (33-33-34), lalu Sayyidul Istighfar. Selesaikan sebelum matahari naik sepenggalah.',
  },
  {
    id: 'dzikir-petang',
    name: 'Dzikir Petang',
    nameAr: 'أَذْكَارُ الْمَسَاءِ',
    category: 'dzikir',
    time: 'Setelah Ashar',
    rakaat: null,
    bacaan: [
      { ar: 'اللهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...', latin: 'Allahu laa ilaaha illaa huwal hayyul qayyuum...', arti: 'Allah, tidak ada ilah melainkan Dia, Yang Maha Hidup...', nama: 'Ayat Kursi', jumlah: '1×', src: 'QS. Al-Baqarah: 255' },
      { ar: 'قُلْ هُوَ اللهُ أَحَدٌ...', latin: 'Qul huwallahu ahad...', arti: 'Katakanlah: Dialah Allah Yang Maha Esa...', nama: 'Al-Ikhlas, Al-Falaq, An-Nas', jumlah: '3× masing-masing', src: 'HR. Abu Dawud no. 5082' },
      { ar: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلٰهَ إِلَّا أَنْتَ...', latin: 'Allahumma anta rabbii...', arti: 'Ya Allah, Engkau adalah Rabbku...', nama: 'Sayyidul Istighfar (Sore)', jumlah: '1×', src: 'HR. Bukhari no. 6306' },
      { ar: 'أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', latin: "A'udzu bikalimaatillahit taammaati min syarri maa khalaq", arti: 'Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan makhluk yang Dia ciptakan', nama: 'Doa Perlindungan Malam', jumlah: '3×', src: 'HR. Muslim no. 2709' },
    ],
    keutamaan: 'Barangsiapa membaca Sayyidul Istighfar di sore hari dengan penuh keyakinan, lalu meninggal sebelum pagi hari, maka ia termasuk ahli surga. (HR. Bukhari no. 6306)',
    dalil: "Dari Abud Darda radhiyallahu anhu, Rasulullah ﷺ bersabda: \"Barangsiapa membaca A'udzu bikalimaatillahit taammaati... tiga kali di sore hari, tidak ada racun atau sengatan yang membahayakannya malam itu.\" (HR. Muslim no. 2709)",
    faedah: 'Dzikir petang adalah penjaga dari gangguan malam, setan, jin, dan keburukan makhluk. Membacanya secara konsisten menjadi penghalang antara diri kita dan berbagai bencana yang tidak terlihat.',
    tuntunan: 'Dimulai setelah sholat Ashar hingga sebelum Maghrib. Baca Ayat Kursi, tiga qul 3× masing-masing, Sayyidul Istighfar, dan doa perlindungan malam.',
  },
  {
    id: 'sholat-dhuha',
    name: 'Sholat Dhuha',
    nameAr: 'صَلَاةُ الضُّحَى',
    category: 'sholat-sunnah',
    time: 'Pagi (15-20 menit setelah matahari terbit)',
    rakaat: '2-12',
    bacaan: [
      { ar: 'اللَّهُمَّ إِنَّ الضُّحَى ضُحَاؤُكَ، وَالْبَهَاءَ بَهَاؤُكَ، وَالْجَمَالَ جَمَالُكَ، وَالْقُوَّةَ قُوَّتُكَ، وَالْقُدْرَةَ قُدْرَتُكَ، وَالْعِصْمَةَ عِصْمَتُكَ. اللَّهُمَّ إِنْ كَانَ رِزْقِي فِي السَّمَاءِ فَأَنْزِلْهُ، وَإِنْ كَانَ فِي الْأَرْضِ فَأَخْرِجْهُ', latin: 'Allahumma innad dhuhaa dhuhaauka, wal bahaa\'a bahaauka...', arti: 'Ya Allah, sesungguhnya waktu dhuha adalah waktu dhuha-Mu... jika rezekiku di langit turunkanlah, jika di bumi keluarkanlah...', nama: 'Doa Setelah Sholat Dhuha', jumlah: '1× setelah salam', src: "Doa ma'tsur dari ulama" },
    ],
    keutamaan: 'Nabi ﷺ bersabda: "Setiap ruas tulang manusia wajib disedekahi tiap harinya. Dan dua rakaat Dhuha mencukupi semua itu." (HR. Muslim no. 720). Allah berfirman: "Wahai anak Adam, sholatlah 4 rakaat di awal hari, niscaya Aku cukupi kamu di sore harinya." (HR. Tirmidzi no. 475)',
    dalil: 'Dari Abu Hurairah radhiyallahu anhu: "Kekasihku ﷺ mewasiatkan kepadaku tiga hal: puasa tiga hari setiap bulan, dua rakaat Dhuha, dan sholat Witir sebelum tidur." (HR. Bukhari no. 1178, Muslim no. 721)',
    faedah: 'Sholat Dhuha adalah sedekah bagi seluruh 360 sendi tubuh. Menjadi sebab kecukupan rezeki hari itu, membuka pintu keberkahan, dan menggantikan kewajiban sedekah harian.',
    tuntunan: 'Dikerjakan setelah matahari naik ±15 menit (syuruq) hingga 15 menit sebelum Dzuhur. Minimal 2 rakaat, terbaik 8 rakaat. Setiap 2 rakaat satu salam. Baca Asy-Syams (91) dan Adh-Dhuha (93) pada 2 rakaat pertama.',
  },
  {
    id: 'sholat-rawatib',
    name: 'Sholat Rawatib',
    nameAr: 'صَلَاةُ الرَّوَاتِبِ',
    category: 'sholat-sunnah',
    time: 'Sebelum/sesudah sholat wajib',
    rakaat: '12',
    bacaan: [
      { ar: 'قُلْ يَا أَيُّهَا الْكَافِرُونَ...', latin: 'Qul yaa ayyuhal kafiruun...', arti: 'Katakanlah: Wahai orang-orang kafir...', nama: 'Al-Kafirun & Al-Ikhlas', jumlah: 'Untuk rawatib Subuh & Maghrib', src: 'HR. Muslim no. 726' },
    ],
    keutamaan: 'Barangsiapa menjaga 12 rakaat sunnah rawatib, Allah bangunkan untuknya rumah di surga. (HR. Muslim no. 728)',
    dalil: 'Dari Aisyah radhiyallahu anha: "Nabi ﷺ tidak pernah meninggalkan 4 rakaat sebelum Dzuhur dan 2 rakaat sebelum Subuh — baik ketika di rumah maupun dalam perjalanan." (HR. Bukhari no. 1182)',
    faedah: 'Rawatib adalah penambal kekurangan sholat wajib. Konsisten menjaga 12 rakaat rawatib menjadi jaminan rumah di surga. Nabi tidak pernah meninggalkan qabliyah Subuh meski dalam perjalanan.',
    tuntunan: 'Kerjakan langsung sebelum atau sesudah sholat wajib. Qabliyah Subuh paling utama. Baca Al-Kafirun (109) dan Al-Ikhlas (112) pada rawatib Subuh dan Maghrib.',
  },
  {
    id: 'sholat-tahajud',
    name: 'Sholat Tahajud',
    nameAr: 'صَلَاةُ التَّهَجُّدِ',
    category: 'sholat-sunnah',
    time: 'Sepertiga malam terakhir',
    rakaat: '2-8',
    bacaan: [
      { ar: 'اللَّهُمَّ لَكَ الْحَمْدُ، أَنْتَ نُورُ السَّمَوَاتِ وَالْأَرْضِ وَمَنْ فِيهِنَّ', latin: 'Allahumma lakal hamdu, anta nuurus samaawaati wal ardhi wa man fiihinna...', arti: 'Ya Allah, bagiMu segala puji, Engkau cahaya langit dan bumi serta semua yang ada di dalamnya...', nama: 'Doa Iftitah Tahajud', jumlah: 'Sebelum membaca Al-Fatihah rakaat pertama', src: 'HR. Bukhari no. 1120' },
      { ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِرِضَاكَ مِنْ سَخَطِكَ، وَبِمُعَافَاتِكَ مِنْ عُقُوبَتِكَ', latin: "Allahumma innii a'udzu biridhaaka min sakhotika wa bimu'aafaatika min 'uquubatik", arti: 'Ya Allah, aku berlindung dengan keridhaan-Mu dari kemurkaan-Mu, dan dengan ampunan-Mu dari siksa-Mu', nama: 'Doa dalam Sujud Tahajud', jumlah: 'Dalam sujud terakhir', src: 'HR. Muslim no. 486' },
    ],
    keutamaan: 'Sholat yang paling utama setelah sholat wajib adalah sholat malam. (HR. Muslim no. 1163). Allah turun ke langit dunia di sepertiga malam terakhir: "Siapa yang berdoa kepada-Ku, Aku kabulkan." (HR. Bukhari no. 1145)',
    dalil: 'Dari Jabir radhiyallahu anhu: "Sesungguhnya di malam hari ada suatu waktu, tidaklah seorang Muslim memohon kebaikan dunia dan akhirat bertepatan dengan waktu itu melainkan Allah berikan padanya." (HR. Muslim no. 757)',
    faedah: 'Tahajud adalah tanda orang-orang sholeh. Menjadi sebab dekatnya Allah, dikabulkannya doa, diangkatnya derajat ke maqam mahmud, dan dikuatkannya iman. Wajah orang yang rajin tahajud bersinar di siang hari.',
    tuntunan: 'Pasang alarm ±1-1.5 jam sebelum Subuh. Setelah bangun baca doa bangun tidur, berwudhu, sholat minimal 2 rakaat. Baca surat panjang dengan tartil. Perbanyak sujud dan doa. Tutup dengan Witir.',
  },
  {
    id: 'sholat-witir',
    name: 'Sholat Witir',
    nameAr: 'صَلَاةُ الْوِتْرِ',
    category: 'sholat-sunnah',
    time: 'Sebelum tidur atau setelah Tahajud',
    rakaat: '1-11',
    bacaan: [
      { ar: 'سَبِّحِ اسْمَ رَبِّكَ الْأَعْلَى', latin: "Sabbihisma rabbikal a'laa...", arti: 'Sucikanlah nama Tuhanmu Yang Maha Tinggi...', nama: 'Surat untuk Witir', jumlah: "R1: Al-A'la (87), R2: Al-Kafirun (109), R3: Al-Ikhlas + Al-Falaq + An-Nas", src: 'HR. Nasai no. 1729' },
      { ar: 'اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ', latin: "Allahummahdinii fiiman hadayt, wa 'aafinii fiiman 'aafayt, wa tawallanii fiiman tawallayt...", arti: 'Ya Allah, berilah aku petunjuk bersama orang yang telah Engkau beri petunjuk, berilah aku kesehatan bersama orang yang telah Engkau beri kesehatan...', nama: 'Doa Qunut Witir', jumlah: "Setelah ruku' rakaat terakhir", src: 'HR. Abu Dawud no. 1425, shahih Al-Albani' },
    ],
    keutamaan: 'Sesungguhnya Allah itu witir (ganjil) dan mencintai yang witir. Maka berwitirlah wahai ahli Quran. (HR. Abu Dawud no. 1416)',
    dalil: "Dari Ali radhiyallahu anhu: \"Witir bukan kewajiban seperti sholat wajib, akan tetapi Nabi ﷺ selalu melakukannya dan bersabda: sesungguhnya Allah witir dan mencintai yang witir.\" (HR. Tirmidzi no. 453)",
    faedah: 'Witir adalah penutup sholat malam yang menyempurnakan ibadah. Nabi ﷺ tidak pernah meninggalkan Witir baik ketika mukim maupun safar. Sholat malam yang tidak ditutup Witir seperti sholat yang belum sempurna.',
    tuntunan: "Jika tidak yakin bisa bangun: Witir sebelum tidur (1-3 rakaat). Jika yakin bisa Tahajud: Witir setelah Tahajud. Pada rakaat terakhir baca Doa Qunut setelah ruku'.",
  },
  {
    id: 'puasa-senin-kamis',
    name: 'Puasa Senin-Kamis',
    nameAr: 'صِيَامُ الِاثْنَيْنِ وَالْخَمِيسِ',
    category: 'puasa',
    time: 'Setiap Senin dan Kamis',
    rakaat: null,
    bacaan: [
      { ar: 'نَوَيْتُ صَوْمَ يَوْمِ الِاثْنَيْنِ سُنَّةً للهِ تَعَالَى', latin: "Nawaitu shauma yaumil itsnaini sunnatan lillaahi ta'aalaa", arti: 'Aku niat puasa hari Senin, sunnah karena Allah Ta\'ala', nama: 'Niat Puasa Senin', jumlah: 'Di malam hari atau pagi sebelum makan', src: 'Fiqh Sunnah' },
      { ar: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللهُ', latin: 'Dzahabazh zhama\'u wabtallatil uruuqu wa tsabatal ajru insyaallah', arti: 'Telah hilang rasa haus, telah basah urat nadi, dan telah tetap pahala insya Allah', nama: 'Doa Buka Puasa', jumlah: 'Saat berbuka', src: 'HR. Abu Dawud no. 2357, hasan Al-Albani' },
    ],
    keutamaan: 'Nabi ﷺ: "Pada hari itu amal manusia diangkat kepada Allah, dan aku ingin saat amalku diangkat aku dalam keadaan berpuasa." (HR. Nasai no. 2358). Pintu surga dibuka pada hari Senin dan Kamis, diampuni dosa setiap hamba yang tidak menyekutukan Allah. (HR. Muslim no. 2565)',
    dalil: 'Dari Aisyah radhiyallahu anha: "Rasulullah ﷺ sangat menjaga puasa Senin dan Kamis." (HR. Tirmidzi no. 745)',
    faedah: 'Puasa Senin-Kamis adalah amalan paling disenangi Nabi ﷺ karena amal diangkat pada hari itu. Manfaat fisik yang terbukti: detoksifikasi, menstabilkan gula darah, dan memperpanjang umur sel.',
    tuntunan: 'Niat di malam Senin/Kamis atau di pagi hari sebelum makan apapun. Buka puasa dengan kurma atau air putih. Boleh digabung dengan puasa Ayyamul Bidh (13-14-15 setiap bulan).',
  },
  {
    id: 'baca-quran',
    name: 'Tilawah Al-Quran',
    nameAr: 'تِلَاوَةُ الْقُرْآنِ',
    category: 'quran',
    time: 'Setelah Subuh (paling utama)',
    rakaat: null,
    bacaan: [
      { ar: 'أَعُوذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيمِ، بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ', latin: "A'udzu billahi minasy syaithaanir rajiim, bismillaahir rahmaanir rahiim", arti: 'Aku berlindung kepada Allah dari setan yang terkutuk. Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.', nama: "Ta'awwudz & Basmalah", jumlah: 'Sebelum membaca', src: 'QS. An-Nahl: 98' },
    ],
    keutamaan: 'Sebaik-baik kalian adalah yang mempelajari Al-Quran dan mengajarkannya. (HR. Bukhari no. 5027). Satu huruf Al-Quran dibalas 10 kebaikan — Alif satu huruf, Lam satu huruf, Mim satu huruf. (HR. Tirmidzi no. 2910)',
    dalil: 'Dari Abdullah bin Masud radhiyallahu anhu: "Bacalah Al-Quran karena ia akan datang pada hari kiamat sebagai pemberi syafa\'at bagi para pembacanya." (HR. Muslim no. 804)',
    faedah: 'Tilawah Al-Quran mengalirkan pahala per huruf. Membuat hati tenang, wajah bercahaya, rumah diberkahi, dan mendapat syafaat di hari kiamat. Setiap huruf = 10 kebaikan.',
    tuntunan: "Baca ta'awwudz dan basmalah sebelum mulai. Baca dengan tartil, tidak terburu-buru. Target minimal 1 halaman/hari. Waktu terbaik: setelah Subuh dan setelah Maghrib.",
  },
  {
    id: 'baca-alkahfi-jumat',
    name: 'Baca Al-Kahfi (Jumat)',
    nameAr: 'قِرَاءَةُ سُورَةِ الْكَهْفِ يَوْمَ الْجُمُعَةِ',
    category: 'quran',
    time: 'Hari Jumat (Kamis malam - Jumat sore)',
    rakaat: null,
    bacaan: [
      { ar: 'الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَى عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَل لَّهُ عِوَجًا', latin: "Alhamdu lillaahil ladzii anzala 'alaa 'abdihil kitaaba wa lam yaj'al lahu 'iwajaa", arti: 'Segala puji bagi Allah yang telah menurunkan Kitab kepada hamba-Nya dan Dia tidak mengadakan kebengkokan di dalamnya.', nama: 'Pembuka Al-Kahfi (QS. 18: 1)', jumlah: '—', src: 'QS. Al-Kahfi: 1' },
    ],
    keutamaan: 'Barangsiapa membaca surat Al-Kahfi pada hari Jumat, Allah menerangi cahaya baginya di antara dua Jumat. (HR. Hakim 2/399, shahih Al-Albani). Barangsiapa membaca 10 ayat pertama Al-Kahfi, ia terlindung dari fitnah Dajjal. (HR. Muslim no. 809)',
    dalil: "Dari Abu Said Al-Khudri radhiyallahu anhu, Rasulullah ﷺ bersabda: \"Barangsiapa membaca surat Al-Kahfi pada hari Jumat, ia mendapat cahaya di antara dirinya dan Ka'bah.\" (HR. Baihaqi, hasan Al-Albani)",
    faedah: "Al-Kahfi mengandung 4 kisah: Ashabul Kahfi (fitnah agama), si empunya kebun (fitnah harta), Nabi Musa & Khidir (fitnah ilmu), Dzulqarnain (fitnah kekuasaan). Membacanya melindungi dari 4 fitnah besar dunia.",
    tuntunan: 'Waktunya dari Kamis setelah Maghrib hingga Jumat sebelum Maghrib. Bisa dibaca sekaligus atau dibagi beberapa sesi. Dianjurkan dibaca dengan tartil dan tadabbur.',
  },
  {
    id: 'shalawat-100',
    name: 'Shalawat 100×',
    nameAr: 'الصَّلَاةُ عَلَى النَّبِيِّ ١٠٠×',
    category: 'dzikir',
    time: 'Bebas, dianjurkan pagi dan petang',
    rakaat: null,
    bacaan: [
      { ar: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ', latin: "Allahumma shalli 'alaa Muhammad wa 'alaa aali Muhammad", arti: 'Ya Allah, limpahkanlah rahmat kepada Muhammad dan keluarga Muhammad', nama: 'Shalawat Ibrahimiyyah', jumlah: '100×', src: 'HR. Muslim no. 408' },
    ],
    keutamaan: 'Barangsiapa bershalawat kepadaku sekali, Allah bershalawat (merahmati) kepadanya 10 kali. (HR. Muslim no. 408). Perbanyak shalawat pada hari Jumat karena shalawatmu disampaikan kepadaku. (HR. Abu Dawud no. 1047)',
    dalil: 'Dari Aus bin Aus radhiyallahu anhu, Rasulullah ﷺ bersabda: "Sesungguhnya hari terbaik kalian adalah hari Jumat. Perbanyaklah shalawat kepadaku pada hari itu." (HR. Abu Dawud no. 1047, shahih Al-Albani)',
    faedah: 'Shalawat adalah sebab turunnya rahmat Allah, terhapusnya dosa, naiknya derajat, dan terpenuhinya hajat. Nabi ﷺ mengetahui siapa yang bershalawat kepadanya dan membalasnya.',
    tuntunan: 'Bisa dibaca kapan saja: saat berjalan, menunggu, atau setelah sholat. Hari Jumat dianjurkan 1000×.',
  },
  {
    id: 'istighfar-100',
    name: 'Istighfar 100×',
    nameAr: 'الِاسْتِغْفَارُ ١٠٠×',
    category: 'dzikir',
    time: 'Setelah sholat atau kapan saja',
    rakaat: null,
    bacaan: [
      { ar: 'أَسْتَغْفِرُ اللهَ الْعَظِيمَ الَّذِي لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ', latin: "Astaghfirullahal 'azhiim alladzii laa ilaaha illaa huwal hayyul qayyuum wa atuubu ilaih", arti: 'Aku memohon ampun kepada Allah Yang Maha Agung, yang tidak ada ilah selain Dia, Yang Maha Hidup, dan aku bertaubat kepada-Nya', nama: 'Istighfar Lengkap', jumlah: '100×', src: 'HR. Tirmidzi no. 3577' },
    ],
    keutamaan: 'Demi Allah, aku beristighfar dan bertaubat kepada Allah lebih dari 70 kali sehari. (HR. Bukhari no. 6307). Barangsiapa memperbanyak istighfar, Allah jadikan setiap kesempitan menjadi jalan keluar dan memberinya rezeki dari arah yang tidak disangka. (HR. Ahmad no. 2234)',
    dalil: 'Dari Abdullah bin Umar: "Kami menghitung Rasulullah ﷺ dalam satu majelis mengucapkan Rabbighfir lii wa tub \'alayya sebanyak 100 kali." (HR. Abu Dawud no. 1516, shahih Al-Albani)',
    faedah: 'Istighfar adalah pembuka rezeki, pengangkat bala, penyebab turunnya hujan rahmat, dan penghapus dosa. Bahkan Nabi ﷺ yang sudah diampuni tetap beristighfar lebih dari 70 kali sehari.',
    tuntunan: 'Setelah setiap sholat wajib minimal 3×. Target harian 100×. Bisa dibaca saat berkendara, menunggu, atau sebelum tidur.',
  },
  {
    id: 'sedekah-harian',
    name: 'Sedekah Harian',
    nameAr: 'الصَّدَقَةُ الْيَوْمِيَّةُ',
    category: 'muamalah',
    time: 'Pagi hari (paling utama)',
    rakaat: null,
    bacaan: [
      { ar: 'اللَّهُمَّ أَعْطِ مُنْفِقًا خَلَفًا', latin: "Allahumma a'thi munfiqan khalafaa", arti: 'Ya Allah, berilah ganti kepada orang yang berinfak', nama: 'Doa Malaikat untuk Orang yang Bersedekah', jumlah: '—', src: 'HR. Bukhari no. 1442' },
    ],
    keutamaan: 'Setiap pagi ada dua malaikat yang turun. Salah satunya berdoa: "Ya Allah, berilah ganti kepada yang berinfak." Yang lain: "Ya Allah, berilah kerusakan kepada yang menahan hartanya." (HR. Bukhari no. 1442). Sedekah tidak mengurangi harta. (HR. Muslim no. 2588)',
    dalil: 'Dari Abu Hurairah radhiyallahu anhu: "Setiap ruas tulang manusia wajib bersedekah setiap harinya... ucapan yang baik adalah sedekah, setiap langkah menuju sholat adalah sedekah." (HR. Bukhari no. 2989)',
    faedah: 'Sedekah memadamkan murka Allah, menolak bala, memanjangkan umur, membuka pintu rezeki, dan menjadi perisai dari api neraka. Senyum kepada saudaramu pun adalah sedekah.',
    tuntunan: 'Niatkan setiap pagi untuk bersedekah walau sedikit. Bisa berupa uang, makanan, tenaga, ilmu, atau kata-kata baik. Konsistensi lebih utama dari jumlah.',
  },
];

const CAT_LABELS = { dzikir: 'Dzikir', 'sholat-sunnah': 'Sholat Sunnah', puasa: 'Puasa', quran: 'Al-Quran', muamalah: 'Muamalah' };
const CAT_COLORS = {
  dzikir: 'var(--gold)',
  'sholat-sunnah': 'var(--mint)',
  puasa: '#fb923c',
  quran: '#a78bfa',
  muamalah: '#f9a8d4',
};
const AMALAN_TABS = ['Semua', 'Dzikir', 'Sholat Sunnah', 'Puasa', 'Al-Quran', 'Muamalah'];
const TAB_TO_CAT = { 'Dzikir': 'dzikir', 'Sholat Sunnah': 'sholat-sunnah', 'Puasa': 'puasa', 'Al-Quran': 'quran', 'Muamalah': 'muamalah' };

function AmalanCard({ amalan, done, onToggle }) {
  const [openSection, setOpenSection] = useState(null);
  const toggleSection = (section) => setOpenSection(openSection === section ? null : section);
  const accent = CAT_COLORS[amalan.category] || 'var(--gold)';

  return (
    <div className={'amalan-card card' + (done ? ' amalan-done' : '')}>
      {/* Header */}
      <div className="amalan-header">
        <div
          className={'misi-item-checkbox' + (done ? ' checked' : '')}
          onClick={onToggle}
          style={{ flexShrink: 0, marginTop: 3, cursor: 'pointer' }}
        >
          {done && <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7.4 5.7 10 11 4.2"/></svg>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--f-ar)', fontSize: 19, color: accent, direction: 'rtl', lineHeight: 1.7, marginBottom: 2 }}>{amalan.nameAr}</div>
          <div style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 15, color: 'var(--text)', letterSpacing: '-0.2px' }}>{amalan.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>{amalan.tuntunan?.slice(0, 90)}…</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
          {amalan.rakaat && (
            <span className="chip" style={{ fontSize: 10, padding: '2px 9px', pointerEvents: 'none', color: accent, borderColor: 'var(--gold-line)' }}>
              {amalan.rakaat} rakaat
            </span>
          )}
          <span className="chip" style={{ fontSize: 10, padding: '2px 9px', pointerEvents: 'none', color: 'var(--text-3)' }}>{amalan.time}</span>
        </div>
      </div>

      {/* Expandable sections */}
      <div className="amalan-sections">
        {/* Bacaan */}
        {amalan.bacaan?.length > 0 && (
          <div className="amalan-section">
            <button className="amalan-section-toggle" onClick={() => toggleSection('bacaan')}>
              <span>📿 Bacaan</span>
              <span style={{ fontSize: 16, color: openSection === 'bacaan' ? 'var(--gold)' : 'var(--text-3)' }}>{openSection === 'bacaan' ? '▾' : '›'}</span>
            </button>
            {openSection === 'bacaan' && (
              <div className="amalan-section-body">
                {amalan.bacaan.map((b, i) => (
                  <div key={i} className="amalan-bacaan-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontFamily: 'var(--f-head)', fontWeight: 700, fontSize: 13, color: 'var(--gold)' }}>{b.nama}</span>
                      <span className="chip" style={{ fontSize: 10, padding: '1px 8px', pointerEvents: 'none' }}>{b.jumlah}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--f-ar)', fontSize: 21, color: 'var(--gold)', direction: 'rtl', lineHeight: 1.9, marginBottom: 8 }}>{b.ar}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)', fontStyle: 'italic', marginBottom: 5, lineHeight: 1.6 }}>{b.latin}</div>
                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, marginBottom: 6 }}>"{b.arti}"</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--f-head)', fontWeight: 600 }}>{b.src}</div>
                    {i < amalan.bacaan.length - 1 && <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '12px 0' }}/>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Keutamaan */}
        <div className="amalan-section">
          <button className="amalan-section-toggle" onClick={() => toggleSection('keutamaan')}>
            <span>⭐ Keutamaan</span>
            <span style={{ fontSize: 16, color: openSection === 'keutamaan' ? 'var(--gold)' : 'var(--text-3)' }}>{openSection === 'keutamaan' ? '▾' : '›'}</span>
          </button>
          {openSection === 'keutamaan' && (
            <div className="amalan-section-body">
              <p style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>{amalan.keutamaan}</p>
            </div>
          )}
        </div>

        {/* Dalil */}
        <div className="amalan-section">
          <button className="amalan-section-toggle" onClick={() => toggleSection('dalil')}>
            <span>📖 Dalil Anjuran</span>
            <span style={{ fontSize: 16, color: openSection === 'dalil' ? 'var(--gold)' : 'var(--text-3)' }}>{openSection === 'dalil' ? '▾' : '›'}</span>
          </button>
          {openSection === 'dalil' && (
            <div className="amalan-section-body">
              <p style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>{amalan.dalil}</p>
            </div>
          )}
        </div>

        {/* Faedah & Tuntunan */}
        <div className="amalan-section" style={{ borderBottom: 'none' }}>
          <button className="amalan-section-toggle" onClick={() => toggleSection('faedah')}>
            <span>💡 Faedah &amp; Tuntunan</span>
            <span style={{ fontSize: 16, color: openSection === 'faedah' ? 'var(--gold)' : 'var(--text-3)' }}>{openSection === 'faedah' ? '▾' : '›'}</span>
          </button>
          {openSection === 'faedah' && (
            <div className="amalan-section-body">
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 11, color: 'var(--gold)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.07em' }}>Faedah</div>
                <p style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>{amalan.faedah}</p>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 11, color: 'var(--gold)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.07em' }}>Cara Mengamalkan</div>
                <p style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>{amalan.tuntunan}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AmalanPage() {
  const [tab, setTab] = useState('Semua');
  const [done, setDone] = useState({});

  const toggle = (id) => setDone((d) => ({ ...d, [id]: !d[id] }));
  const list = tab === 'Semua'
    ? AMALAN_HARIAN
    : AMALAN_HARIAN.filter((a) => a.category === TAB_TO_CAT[tab]);

  const doneCount = AMALAN_HARIAN.filter((a) => done[a.id]).length;
  const total = AMALAN_HARIAN.length;
  const pct = Math.round((doneCount / total) * 100);

  return (
    <div className="main fade-in">
      <div className="content scrl">
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 className="h1">Amalan Harian</h1>
          <div style={{ marginTop: 4, fontSize: 13, color: 'var(--text-3)' }}>
            {doneCount} dari {total} amalan selesai hari ini
          </div>
          {/* Progress bar */}
          <div style={{ marginTop: 12, height: 4, background: 'var(--elevated)', borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 9999,
              width: pct + '%',
              background: 'linear-gradient(90deg, var(--gold), var(--mint))',
              transition: 'width .5s cubic-bezier(.2,.8,.3,1)',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 11, color: 'var(--text-3)' }}>
            <span>{pct}% selesai</span>
            <span>{total - doneCount} tersisa</span>
          </div>
        </div>

        {/* Category tabs */}
        <div className="tabs scrl" style={{ marginBottom: 20 }}>
          {AMALAN_TABS.map((t) => (
            <button key={t} className={'tab' + (tab === t ? ' on' : '')} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {/* Amalan list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {list.map((item) => (
            <AmalanCard key={item.id} amalan={item} done={!!done[item.id]} onToggle={() => toggle(item.id)} />
          ))}
        </div>
      </div>

      {/* Right column — daily summary */}
      <div className="col-r scrl">
        <span className="eyebrow">Ringkasan Hari Ini</span>
        {Object.entries(CAT_LABELS).map(([catKey, label]) => {
          const items = AMALAN_HARIAN.filter((a) => a.category === catKey);
          const doneInCat = items.filter((a) => done[a.id]).length;
          const color = CAT_COLORS[catKey];
          return (
            <div key={catKey} className="card" style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color, letterSpacing: '.03em' }}>{label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{doneInCat}/{items.length}</div>
              </div>
              <div style={{ height: 3, background: 'var(--elevated)', borderRadius: 9999, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 9999,
                  width: items.length ? (doneInCat / items.length * 100) + '%' : '0%',
                  background: color,
                  transition: 'width .4s ease',
                }} />
              </div>
            </div>
          );
        })}

        <div className="card" style={{ padding: '14px 16px', marginTop: 4 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Reset harian</div>
          <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--text-3)', lineHeight: 1.55 }}>
            Centang amalan yang sudah kamu kerjakan hari ini. Reset otomatis tiap hari.
          </p>
          <button className="btn ghost sm" style={{ width: '100%' }}
            onClick={() => setDone({})}>
            Reset semua
          </button>
        </div>
      </div>
    </div>
  );
}
