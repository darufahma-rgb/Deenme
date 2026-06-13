// pages.jsx — Jurnal, Bank Doa, Statistik
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
const HEATC = { full: 'var(--ok)', part: 'var(--warn)', empty: 'var(--danger)', none: 'transparent' };

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
              style={{ background: HEATC[k], outline: i === 12 ? '2px solid var(--gold)' : 'none', outlineOffset: 1 }} />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 6 }}>
          {[['full', 'Lengkap'], ['part', 'Sebagian'], ['empty', 'Kosong']].map(([k, l]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ width: 13, height: 13, borderRadius: 4, background: HEATC[k] }} />
              <span className="muted tiny">{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="content scrl" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="daynav" style={{ marginBottom: 22 }}>
          <button className="iconbtn" onClick={() => setDay((d) => Math.max(1, d - 1))}>{Icon.chevL}</button>
          <div>
            <h1 className="h1">Jurnal</h1>
            <div className="muted tiny" style={{ marginTop: 4 }}>{day} Juni 2026</div>
          </div>
          <button className="iconbtn" onClick={() => setDay((d) => Math.min(13, d + 1))} disabled={day >= 13}
            style={{ opacity: day >= 13 ? .4 : 1 }}>{Icon.chevR}</button>
        </div>

        <div className="editor">
          <div className="etools">
            <button className="etb" style={{ fontWeight: 700 }} onMouseDown={(e) => { e.preventDefault(); cmd('bold'); }}>B</button>
            <button className="etb" style={{ fontStyle: 'italic' }} onMouseDown={(e) => { e.preventDefault(); cmd('italic'); }}>I</button>
            <span className="muted tiny" style={{ marginLeft: 'auto' }}>Tersimpan otomatis</span>
          </div>
          <div ref={edRef} className="earea scrl" contentEditable suppressContentEditableWarning
            data-empty={empty ? '1' : '0'} data-ph="Hari ini bagaimana, akhi?" onInput={onInput} />
        </div>

        <div className="card" style={{ padding: 18, marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="eyebrow">Doa yang relevan hari ini</span>
          {detected.length === 0
            ? <p className="muted tiny" style={{ margin: 0 }}>Mulai menulis — doa yang relevan akan muncul di sini secara otomatis.</p>
            : <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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
const DOA = [
  { cat: 'Ujian', ar: 'رَبِّ زِدْنِي عِلْمًا', tr: 'Ya Allah, tambahkanlah ilmuku.', src: 'QS. Thaha: 114' },
  { cat: 'Ujian', ar: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', tr: 'Ya Tuhanku, lapangkanlah dadaku dan mudahkanlah urusanku.', src: 'QS. Thaha: 25–26' },
  { cat: 'Syukur', ar: 'الْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ', tr: 'Segala puji bagi Allah, Tuhan semesta alam.', src: 'QS. Al-Fatihah: 2' },
  { cat: 'Galau', ar: 'لَا إِلٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ', tr: 'Tiada Tuhan selain Engkau. Maha Suci Engkau, sungguh aku termasuk orang yang zalim.', src: 'QS. Al-Anbiya: 87 · Doa Nabi Yunus' },
  { cat: 'Galau', ar: 'حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ', tr: 'Cukuplah Allah bagi kami, dan Dia sebaik-baik pelindung.', src: 'QS. Ali Imran: 173' },
  { cat: 'Safar', ar: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هٰذَا', tr: 'Maha Suci Allah yang telah menundukkan ini bagi kami.', src: 'QS. Az-Zukhruf: 13' },
  { cat: 'Sakit', ar: 'اللّٰهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ اشْفِ', tr: 'Ya Allah, Tuhan manusia, hilangkanlah penyakit dan sembuhkanlah.', src: 'HR. Bukhari no. 5743' },
  { cat: 'Rezeki', ar: 'اللّٰهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ', tr: 'Ya Allah, cukupkanlah aku dengan rezeki halal-Mu dari yang haram.', src: 'HR. Tirmidzi no. 3563' },
  { cat: 'Per Waktu Solat', ar: 'اللّٰهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ', tr: 'Ya Allah, Engkau Maha Sejahtera dan dari-Mu kesejahteraan.', src: 'HR. Muslim no. 591' },
];
const DOA_TABS = ['Semua', 'Per Waktu Solat', 'Ujian', 'Galau', 'Safar', 'Sakit', 'Rezeki', 'Syukur'];

function AddDoaModal({ onClose, onAdd }) {
  const [ar, setAr] = useState(''); const [tr, setTr] = useState(''); const [note, setNote] = useState('');
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(6,6,8,.66)',
      backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 460, maxWidth: '90vw', background: 'var(--elevated)',
        border: '1px solid var(--border-2)', borderRadius: 18, padding: 28, display: 'flex', flexDirection: 'column', gap: 14,
        boxShadow: '0 40px 120px -30px #000' }}>
        <h2 className="h2">Tambah Doa</h2>
        <input className="tinput" style={{ width: '100%', textAlign: 'right', fontFamily: 'var(--f-ar)', fontSize: 22, padding: '12px 14px' }}
          placeholder="نص الدعاء" value={ar} onChange={(e) => setAr(e.target.value)} />
        <input className="tinput" style={{ width: '100%', textAlign: 'left', fontFamily: 'var(--f-body)', fontWeight: 400, padding: '11px 14px' }}
          placeholder="Terjemahan Indonesia" value={tr} onChange={(e) => setTr(e.target.value)} />
        <input className="tinput" style={{ width: '100%', textAlign: 'left', fontFamily: 'var(--f-body)', fontWeight: 400, padding: '11px 14px' }}
          placeholder="Catatan / sumber (opsional)" value={note} onChange={(e) => setNote(e.target.value)} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
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
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 }}>
          <h1 className="h1">Bank Doa</h1>
          <span className="muted tiny">{all.length} doa tersimpan</span>
        </div>
        <div className="tabs scrl" style={{ marginBottom: 22 }}>
          {DOA_TABS.map((t) => (
            <button key={t} className={'tab' + (tab === t ? ' on' : '')} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        <div className="doagrid">
          {list.map((d) => {
            const key = d.ar + d.src;
            return (
              <div key={key} className="doacard">
                <button className={'bm' + (bookmarks[key] ? ' on' : '')} onClick={() => toggleBookmark(key)} aria-label="Simpan">
                  {Icon.bookmark(!!bookmarks[key])}
                </button>
                <div className="dar" style={{ paddingLeft: 38 }}>{d.ar}</div>
                <div className="dtr">{d.tr}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="dsrc">{d.src}</span>
                  <span style={{ flex: 1 }} />
                  <span className="chip" style={{ padding: '3px 11px', fontSize: 11.5, pointerEvents: 'none' }}>{d.cat}</span>
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

        <div className="streak" style={{ display: 'flex', alignItems: 'center', gap: 34, padding: 26, marginBottom: 18 }}>
          <span className="flame" style={{ color: 'var(--gold)', right: 24, top: -10 }}>{Icon.flame}</span>
          <div>
            <div className="eyebrow" style={{ color: 'var(--gold)' }}>Beruntun saat ini</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
              <span className="bignum" style={{ fontSize: 66 }}>{streak}</span>
              <span className="h2" style={{ marginBottom: 12 }}>hari</span>
            </div>
          </div>
          <hr className="divline" style={{ width: 1, height: 64, background: 'var(--gold-line)' }} />
          <div>
            <div className="eyebrow">{Icon.spark} Terpanjang</div>
            <div className="summary-num" style={{ marginTop: 4 }}>34 <span className="h2" style={{ fontWeight: 600 }}>hari</span></div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ textAlign: 'right' }}>
            <div className="muted tiny" style={{ marginBottom: 8 }}>{freeze} freeze tersisa bulan ini</div>
            <button className="btn ghost sm" onClick={useFreeze} style={{ borderColor: 'var(--gold-line)', color: 'var(--gold)' }}>{Icon.snow} Gunakan freeze</button>
          </div>
        </div>

        <div className="card" style={{ padding: 22, marginBottom: 18 }}>
          <span className="eyebrow">Skor ibadah · 7 hari terakhir</span>
          <div className="bars" style={{ marginTop: 18 }}>
            {WEEK.map((h, i) => (
              <div key={i} className="barcol">
                <div className={'bar' + (h < 0.5 ? ' low' : '')} style={{ height: mounted ? (h * 100) + '%' : '0%' }} />
                <span className="muted tiny">{WDAYS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <span className="eyebrow">Heatmap · Juni 2026</span>
            <span className="muted tiny">{MONTH_DATA.filter((m) => m === 'full').length} hari lengkap</span>
          </div>
          <div className="heat">
            {MONTH_DATA.map((k, i) => (
              <div key={i} className="hc" title={`${i + 1} Juni`}
                style={{ background: HEATC[k], borderColor: k === 'none' ? 'var(--border)' : 'transparent',
                  outline: i === 12 ? '2px solid var(--gold)' : 'none', outlineOffset: 1 }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 16, flexWrap: 'wrap' }}>
            {[['full', 'Lengkap'], ['part', 'Sebagian'], ['empty', 'Kosong'], ['none', 'Belum']].map(([k, l]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 13, height: 13, borderRadius: 4, background: HEATC[k], border: k === 'none' ? '1px solid var(--border)' : 0 }} />
                <span className="muted tiny">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-r scrl">
        <span className="eyebrow">Ringkasan bulan ini</span>
        <div className="card" style={{ padding: 22 }}>
          <div className="eyebrow">Rata-rata skor</div>
          <div className="summary-num" style={{ color: 'var(--gold)', fontSize: 46, marginTop: 6 }}>78%</div>
          <div className="muted tiny" style={{ marginTop: 4 }}>+6% dari bulan lalu</div>
        </div>
        <div className="card" style={{ padding: 22 }}>
          <div className="eyebrow">Paling sering terlewat</div>
          <div className="h1" style={{ fontSize: 26, marginTop: 8 }}>Subuh</div>
          <div className="muted tiny" style={{ marginTop: 4 }}>7× terlewat bulan ini</div>
        </div>
        <div className="card" style={{ padding: 22 }}>
          <div className="eyebrow">Total dicatat</div>
          <div className="summary-num" style={{ fontSize: 36, marginTop: 6 }}>132 <span className="h2" style={{ fontWeight: 600 }}>solat</span></div>
          <div className="muted tiny" style={{ marginTop: 4 }}>dari 145 terjadwal</div>
        </div>
      </div>
    </div>
  );
}
