// pages.jsx — Jurnal, Bank Doa, Statistik, Amalan Harian
import { useState, useRef, useEffect } from 'react';
import { Icon } from './ui.jsx';

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
const MINI_SEQ = ['full','full','part','full','empty','full','full','part','full','full',
  'full','empty','part','full','full','full','full','part','full','empty',
  'full','full','full','part','full','full','full','part','full','full'];
const HEATC = { full: '#4ade80', part: '#fbbf24', empty: '#f87171', none: 'transparent' };

export function JournalPage({ go }) {
  const edRef = useRef(null);
  const [empty, setEmpty] = useState(true);
  const [detected, setDetected] = useState([]);
  const [day, setDay] = useState(13);
  const onInput = () => {
    const txt = edRef.current.innerText;
    setEmpty(txt.trim() === '');
    setDetected(detectDoa(txt));
  };
  const cmd = (c) => { document.execCommand(c, false); edRef.current.focus(); };
  return (
    <div className="main fade-in">
      <div className="col-l scrl">
        <span className="eyebrow">30 hari terakhir</span>
        <div className="heat" style={{ gridTemplateColumns: 'repeat(6,1fr)' }}>
          {MINI_SEQ.map((k, i) => (
            <div key={i} className="hc" title={`${i + 1} Juni`}
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

      <div className="content scrl" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="daynav" style={{ marginBottom: 20 }}>
          <button className="iconbtn" onClick={() => setDay((d) => Math.max(1, d - 1))}>{Icon.chevL}</button>
          <div>
            <h1 className="h1">Jurnal</h1>
            <div style={{ marginTop: 3, fontSize: 12, color: 'var(--text-3)' }}>{day} Juni 2026</div>
          </div>
          <button className="iconbtn" onClick={() => setDay((d) => Math.min(13, d + 1))} disabled={day >= 13}
            style={{ opacity: day >= 13 ? .4 : 1 }}>{Icon.chevR}</button>
        </div>

        <div className="editor">
          <div className="etools">
            <button className="etb" style={{ fontWeight: 700 }} onMouseDown={(e) => { e.preventDefault(); cmd('bold'); }}>B</button>
            <button className="etb" style={{ fontStyle: 'italic' }} onMouseDown={(e) => { e.preventDefault(); cmd('italic'); }}>I</button>
            <span style={{ fontSize: 12, color: 'var(--text-3)', marginLeft: 'auto' }}>Tersimpan otomatis</span>
          </div>
          <div ref={edRef} className="earea scrl" contentEditable suppressContentEditableWarning
            data-empty={empty ? '1' : '0'} data-ph="Hari ini bagaimana, akhi?" onInput={onInput} />
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
const WEEK = [0.82, 0.64, 1, 0.9, 0.42, 1, 0.74];
const WDAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const MONTH_DATA = ['full','full','part','full','empty','full','full','part','full','full',
  'full','empty','part','full','full','full','full','part','full','empty',
  'full','full','full','part','full','full','full','part','full','full',
  'none','none','none','none','none'];

export function StatistikPage({ streak, freeze, useFreeze }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);
  return (
    <div className="main fade-in">
      <div className="content scrl">
        <h1 className="h1" style={{ marginBottom: 22 }}>Statistik &amp; Streak</h1>

        <div className="streak" style={{ display: 'flex', alignItems: 'center', gap: 30, padding: 24, marginBottom: 16 }}>
          <span className="flame" style={{ color: 'rgba(110,231,183,.18)', right: 20, top: -10 }}>{Icon.flame}</span>
          <div>
            <div style={{ fontFamily: 'var(--f-body)', fontWeight: 500, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mint)', marginBottom: 2 }}>
              Beruntun saat ini
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <span className="bignum" style={{ fontSize: 60 }}>{streak}</span>
              <span style={{ fontFamily: 'var(--f-head)', fontWeight: 400, fontSize: 18, marginBottom: 10, color: 'rgba(247,244,237,.7)' }}>hari</span>
            </div>
          </div>
          <div className="divline" style={{ width: 1, height: 56, margin: '0 4px' }} />
          <div>
            <div style={{ fontFamily: 'var(--f-body)', fontWeight: 500, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mint)', marginBottom: 2 }}>
              {Icon.spark} Terpanjang
            </div>
            <div style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 36, color: 'var(--cream)', marginTop: 2, letterSpacing: '-1px' }}>
              34 <span style={{ fontFamily: 'var(--f-head)', fontWeight: 400, fontSize: 18, color: 'rgba(247,244,237,.6)' }}>hari</span>
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'rgba(247,244,237,.45)', marginBottom: 8 }}>{freeze} freeze tersisa bulan ini</div>
            <button className="btn sm" onClick={useFreeze}
              style={{ borderColor: 'rgba(110,231,183,.3)', color: 'var(--mint)', background: 'rgba(110,231,183,.08)', fontSize: 12 }}>
              {Icon.snow} Gunakan freeze
            </button>
          </div>
        </div>

        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
          <span className="eyebrow">Skor ibadah · 7 hari terakhir</span>
          <div className="bars" style={{ marginTop: 16 }}>
            {WEEK.map((h, i) => (
              <div key={i} className="barcol">
                <div className={'bar' + (h < 0.5 ? ' low' : '')} style={{ height: mounted ? (h * 100) + '%' : '0%' }} />
                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{WDAYS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <span className="eyebrow">Heatmap · Juni 2026</span>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{MONTH_DATA.filter((m) => m === 'full').length} hari lengkap</span>
          </div>
          <div className="heat">
            {MONTH_DATA.map((k, i) => (
              <div key={i} className="hc" title={`${i + 1} Juni`}
                style={{
                  background: HEATC[k],
                  borderColor: k === 'none' ? 'var(--border)' : 'transparent',
                  opacity: k === 'none' ? .3 : 1,
                  outline: i === 12 ? '2px solid var(--gold)' : 'none',
                  outlineOffset: 1,
                }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
            {[['#4ade80', 'Lengkap'], ['#fbbf24', 'Sebagian'], ['#f87171', 'Kosong'], ['transparent', 'Belum']].map(([c, l], i) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: c, border: i === 3 ? '1px solid var(--border-2)' : 0, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-r scrl">
        <span className="eyebrow">Ringkasan bulan ini</span>
        <div className="card" style={{ padding: 20 }}>
          <div className="eyebrow">Rata-rata skor</div>
          <div style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 44, color: 'var(--gold)', marginTop: 4, letterSpacing: '-1.2px' }}>78%</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>+6% dari bulan lalu</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div className="eyebrow">Paling sering terlewat</div>
          <div className="h1" style={{ fontSize: 24, marginTop: 8 }}>Subuh</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>7× terlewat bulan ini</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div className="eyebrow">Total dicatat</div>
          <div style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 34, color: 'var(--text)', marginTop: 4, letterSpacing: '-1px' }}>
            132 <span style={{ fontSize: 18, fontWeight: 400, color: 'var(--text-2)' }}>solat</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>dari 145 terjadwal</div>
        </div>
      </div>
    </div>
  );
}

// ─── AMALAN HARIAN ────────────────────────────────────────
const AMALAN_HARIAN = [
  {
    id: 'dzikir-pagi', name: 'Dzikir Pagi', nameAr: 'أَذْكَارُ الصَّبَاحِ',
    category: 'dzikir', time: 'Setelah Subuh',
    description: 'Dzikir pagi dibaca setelah sholat Subuh hingga matahari terbit. Termasuk: Ayat Kursi, Al-Ikhlas/Al-Falaq/An-Nas (3x), tasbih 33x, tahmid 33x, takbir 34x, dan Sayyidul Istighfar.',
    keutamaan: 'Nabi bersabda: barangsiapa membaca dzikir pagi, ia berada dalam perlindungan Allah hingga sore. (HR. Tirmidzi no. 3391)',
    src: 'Hisnul Muslim — Imam Ibnul Qayyim',
  },
  {
    id: 'dzikir-petang', name: 'Dzikir Petang', nameAr: 'أَذْكَارُ الْمَسَاءِ',
    category: 'dzikir', time: 'Setelah Ashar',
    description: 'Dzikir petang dibaca setelah Ashar hingga Maghrib. Mencakup Ayat Kursi, tiga qul (3x), istighfar 100x, shalawat, dan doa perlindungan malam.',
    keutamaan: 'Dzikir petang adalah perisai dari gangguan setan, sihir, dan keburukan malam. (HR. Abu Dawud no. 5082)',
    src: 'Hisnul Muslim — Imam Ibnul Qayyim',
  },
  {
    id: 'sholat-dhuha', name: 'Sholat Dhuha', nameAr: 'صَلَاةُ الضُّحَى',
    category: 'sholat-sunnah', time: '15–20 menit setelah matahari terbit', rakaat: '2–12',
    description: 'Sholat sunnah 2–12 rakaat yang dikerjakan setelah matahari sepenggalah naik hingga sebelum waktu Dzuhur. Minimal 2 rakaat, paling utama 8 rakaat.',
    keutamaan: 'Nabi bersabda: setiap ruas tulang manusia wajib disedekahi tiap harinya. Dan 2 rakaat Dhuha mencukupi semua itu. (HR. Muslim no. 720)',
    src: 'HR. Bukhari no. 1178, HR. Muslim no. 720',
  },
  {
    id: 'sholat-rawatib', name: 'Sholat Rawatib', nameAr: 'صَلَاةُ الرَّوَاتِبِ',
    category: 'sholat-sunnah', time: 'Sebelum/sesudah sholat wajib', rakaat: '12',
    description: '12 rakaat sunnah rawatib muakkadah: 2 rakaat sebelum Subuh, 4 rakaat sebelum Dzuhur, 2 rakaat sesudah Dzuhur, 2 rakaat sesudah Maghrib, 2 rakaat sesudah Isya.',
    keutamaan: 'Barangsiapa menjaga 12 rakaat sunnah rawatib, Allah bangunkan untuknya rumah di surga. (HR. Muslim no. 728)',
    src: 'HR. Muslim no. 728, HR. Tirmidzi no. 414',
  },
  {
    id: 'sholat-tahajud', name: 'Sholat Tahajud', nameAr: 'صَلَاةُ التَّهَجُّدِ',
    category: 'sholat-sunnah', time: 'Sepertiga malam terakhir', rakaat: '2–8',
    description: 'Sholat sunnah malam yang paling utama. Dikerjakan setelah tidur terlebih dahulu. Minimal 2 rakaat, paling utama 8 rakaat + 3 witir.',
    keutamaan: 'Sholat yang paling utama setelah sholat wajib adalah sholat malam (qiyamullail). (HR. Muslim no. 1163). Allah turun ke langit dunia di sepertiga malam terakhir.',
    src: 'HR. Muslim no. 1163, HR. Bukhari no. 1145',
  },
  {
    id: 'sholat-witir', name: 'Sholat Witir', nameAr: 'صَلَاةُ الْوِتْرِ',
    category: 'sholat-sunnah', time: 'Sebelum tidur atau setelah Tahajud', rakaat: '1–11',
    description: 'Sholat penutup malam dengan rakaat ganjil (1, 3, 5, 7, atau 11 rakaat). Wajib dikerjakan minimal sekali sebelum Subuh.',
    keutamaan: 'Nabi bersabda: sesungguhnya Allah itu witir (ganjil) dan mencintai yang witir. Maka berwitirlah wahai ahli Quran. (HR. Abu Dawud no. 1416)',
    src: 'HR. Bukhari no. 998, HR. Muslim no. 752',
  },
  {
    id: 'puasa-senin-kamis', name: 'Puasa Senin-Kamis', nameAr: 'صِيَامُ الاِثْنَيْنِ وَالْخَمِيسِ',
    category: 'puasa', time: 'Setiap Senin dan Kamis',
    description: 'Puasa sunnah yang rutin dikerjakan Nabi setiap Senin dan Kamis. Niat dilakukan di malam hari atau di pagi hari sebelum makan.',
    keutamaan: 'Nabi ditanya mengapa berpuasa Senin-Kamis: pada hari itu amal manusia diangkat kepada Allah, dan aku ingin saat amalku diangkat aku dalam keadaan berpuasa. (HR. Nasai no. 2358)',
    src: 'HR. Tirmidzi no. 747, HR. Nasai no. 2358',
  },
  {
    id: 'baca-quran', name: 'Tilawah Al-Quran', nameAr: 'تِلَاوَةُ الْقُرْآنِ',
    category: 'quran', time: 'Setelah Subuh (paling utama)',
    description: 'Membaca Al-Quran dengan tartil minimal 1 halaman per hari. Target khatam 1x per bulan = 20 halaman/hari. Minimal 3–5 ayat untuk menjaga keistiqomahan.',
    keutamaan: 'Sebaik-baik kalian adalah yang mempelajari Al-Quran dan mengajarkannya. (HR. Bukhari no. 5027). Satu huruf = 10 kebaikan.',
    src: 'HR. Bukhari no. 5027, HR. Tirmidzi no. 2910',
  },
  {
    id: 'shalawat-100', name: 'Shalawat 100×', nameAr: 'الصَّلَاةُ عَلَى النَّبِيِّ ١٠٠×',
    category: 'dzikir', time: 'Bebas, dianjurkan pagi dan petang',
    description: 'Membaca shalawat kepada Nabi Muhammad ﷺ minimal 100x per hari. Boleh dibaca kapan saja, terutama hari Jumat dianjurkan 1000x.',
    keutamaan: 'Barangsiapa bershalawat kepadaku sekali, Allah bershalawat (merahmati) kepadanya 10x. (HR. Muslim no. 408). Nabi tahu siapa yang bershalawat kepadanya.',
    src: 'HR. Muslim no. 408, HR. Abu Dawud no. 1047',
  },
  {
    id: 'istighfar-100', name: 'Istighfar 100×', nameAr: 'الِاسْتِغْفَارُ ١٠٠×',
    category: 'dzikir', time: 'Setelah sholat atau kapan saja',
    description: 'Membaca istighfar (astaghfirullah) minimal 100x per hari. Nabi yang sudah dijamin surga pun beristighfar lebih dari 70x sehari.',
    keutamaan: 'Nabi bersabda: demi Allah, aku beristighfar dan bertaubat kepada Allah lebih dari 70 kali sehari. (HR. Bukhari no. 6307). Istighfar adalah pembuka rezeki.',
    src: 'HR. Bukhari no. 6307, HR. Muslim no. 2702',
  },
  {
    id: 'sedekah-harian', name: 'Sedekah Harian', nameAr: 'الصَّدَقَةُ الْيَوْمِيَّةُ',
    category: 'muamalah', time: 'Pagi hari (paling utama)',
    description: 'Bersedekah setiap hari walau sedikit. Bisa berupa uang, makanan, tenaga, senyum, atau ilmu. Sedekah terbaik adalah yang diberikan saat sehat dan menyukai harta.',
    keutamaan: 'Setiap pagi ada dua malaikat yang turun. Salah satunya berdoa: ya Allah, berilah ganti kepada yang berinfak. Yang lain berdoa: ya Allah, berilah kerusakan kepada yang menahan (hartanya). (HR. Bukhari no. 1442)',
    src: 'HR. Bukhari no. 1442, HR. Muslim no. 1010',
  },
  {
    id: 'baca-alkahfi-jumat', name: 'Baca Al-Kahfi (Jumat)', nameAr: 'قِرَاءَةُ سُورَةِ الْكَهْفِ يَوْمَ الْجُمُعَةِ',
    category: 'quran', time: 'Kamis malam – Jumat sore',
    description: 'Membaca surat Al-Kahfi (18) setiap hari Jumat. Waktunya dari malam Jumat (Kamis malam) hingga terbenamnya matahari hari Jumat.',
    keutamaan: 'Barangsiapa membaca surat Al-Kahfi pada hari Jumat, maka Allah menerangi cahaya baginya di antara dua Jumat. (HR. Hakim, dinilai shahih Al-Albani)',
    src: 'HR. Hakim no. 2/399, dinilai shahih oleh Al-Albani dalam Shahih Al-Jami no. 6470',
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

function AmalanCard({ item, done, onToggle }) {
  const [open, setOpen] = useState(false);
  const accent = CAT_COLORS[item.category] || 'var(--gold)';
  return (
    <div className="card" style={{
      padding: 0, overflow: 'hidden',
      border: done ? `1px solid rgba(110,231,183,0.28)` : '1px solid var(--border)',
      background: done ? 'rgba(110,231,183,0.05)' : 'var(--surface)',
      transition: 'border-color .2s, background .2s',
    }}>
      <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        {/* Checkbox */}
        <button onClick={onToggle} style={{
          width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
          border: done ? '1.5px solid var(--mint)' : '1.5px solid var(--border-2)',
          background: done ? 'rgba(110,231,183,0.2)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: '.18s',
        }} aria-label={done ? 'Tandai belum' : 'Tandai selesai'}>
          {done && <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="var(--mint)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7.4 5.7 10 11 4.2"/></svg>}
        </button>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <div>
              <div style={{ fontFamily: 'var(--f-ar)', direction: 'rtl', fontSize: 17, color: accent, lineHeight: 1.5, marginBottom: 2 }}>
                {item.nameAr}
              </div>
              <div style={{ fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 14, color: done ? 'var(--text-2)' : 'var(--text)', letterSpacing: '-0.2px', textDecoration: done ? 'line-through' : 'none' }}>
                {item.name}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
              {item.rakaat && (
                <span style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: '.06em',
                  color: accent, background: `rgba(${accent === 'var(--gold)' ? '212,117,58' : '110,231,183'},0.12)`,
                  border: `1px solid rgba(${accent === 'var(--gold)' ? '212,117,58' : '110,231,183'},0.28)`,
                  padding: '2px 7px', borderRadius: 9999,
                }}>{item.rakaat} rakaat</span>
              )}
              <span style={{
                fontSize: 10, fontWeight: 500, letterSpacing: '.05em', color: 'var(--text-3)',
                background: 'var(--elevated)', border: '1px solid var(--border)',
                padding: '2px 7px', borderRadius: 9999,
              }}>{item.time}</span>
            </div>
          </div>

          <div style={{ marginTop: 6, fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.55 }}>
            {item.description}
          </div>

          {/* Expandable keutamaan */}
          <button onClick={() => setOpen((o) => !o)} style={{
            marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            fontSize: 11.5, fontWeight: 600, color: accent, letterSpacing: '.02em',
          }}>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transition: 'transform .2s', transform: open ? 'rotate(90deg)' : 'none' }}>
              <path d="M6 3l5 5-5 5" />
            </svg>
            {open ? 'Tutup keutamaan' : 'Keutamaan'}
          </button>

          {open && (
            <div style={{
              marginTop: 8, fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6,
              background: 'var(--elevated)', borderRadius: 8, padding: '10px 12px',
              borderLeft: `2px solid ${accent === 'var(--gold)' ? 'var(--gold-line)' : 'rgba(110,231,183,0.3)'}`,
              animation: 'detailIn .22s ease both',
            }}>
              <div style={{ marginBottom: 4 }}>{item.keutamaan}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>{item.src}</div>
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
            <AmalanCard key={item.id} item={item} done={!!done[item.id]} onToggle={() => toggle(item.id)} />
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
