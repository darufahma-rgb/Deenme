// dashboard.jsx — Dashboard A layout + vertical-list prayer tracker
import { Icon, PrayerRing, ScoreRing } from './ui.jsx';

export const PRAYERS = [
  { k: 'subuh', id: 'Subuh', ar: 'الفجر', sched: '04:42' },
  { k: 'dzuhur', id: 'Dzuhur', ar: 'الظهر', sched: '11:54' },
  { k: 'ashar', id: 'Ashar', ar: 'العصر', sched: '15:18' },
  { k: 'maghrib', id: 'Maghrib', ar: 'المغرب', sched: '17:58' },
  { k: 'isya', id: 'Isya', ar: 'العشاء', sched: '19:09' },
];
export const SUNNAH = ['Rawatib Subuh', 'Dhuha', 'Rawatib Dzuhur', 'Rawatib Maghrib', 'Tahajud', 'Witir'];
const STATUS = [['ok', 'Tepat'], ['late', 'Telat'], ['qadha', 'Qadha']];

function PrayerRowItem({ p, status, time, isNext, ring, onStatus, onTime }) {
  const done = !!status;
  return (
    <div className={'pcard' + (done ? ' done' : '') + (status === 'qadha' ? ' qadha' : '')}>
      <div className="prow">
        <PrayerRing letter={p.id[0]} pct={done ? 1 : 0} tone={status === 'qadha' ? 'qadha' : 'gold'} style={ring} size={56} />
        <div className="pmeta">
          <div className="pname">
            {p.id}
            <span className="pa">{p.ar}</span>
            {isNext && <span className="next-tag">Berikutnya</span>}
          </div>
          <div className="psub">Jadwal {p.sched}{done ? ` · dicatat ${time || p.sched}` : ''}</div>
        </div>
        <input className="tinput" value={time} placeholder="--:--" maxLength={5}
          onChange={(e) => onTime(p.k, e.target.value)} aria-label={`Waktu ${p.id}`} />
        <div className="seg">
          {STATUS.map(([s, lbl]) => (
            <button key={s} className={'segbtn ' + s + (status === s ? ' on' : '')}
              onClick={() => onStatus(p.k, status === s ? null : s)}>
              <span className="sd" />{lbl}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardPage({ prayers, times, sunnah, setStatus, setTime, toggleSunnah, score, ring, streak, freeze, useFreeze, pulse, go }) {
  const nextK = PRAYERS.find((p) => !prayers[p.k])?.k;
  const doneCount = PRAYERS.filter((p) => prayers[p.k]).length;
  const sunCount = SUNNAH.filter((s) => sunnah[s]).length;
  return (
    <div className="main fade-in">
      <div className="content scrl">
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

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="eyebrow">Solat Wajib</span>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{doneCount} / 5 dicatat</span>
        </div>
        <div className="plist">
          {PRAYERS.map((p) => (
            <PrayerRowItem key={p.k} p={p} status={prayers[p.k]} time={times[p.k] || ''} isNext={p.k === nextK}
              ring={ring} onStatus={setStatus} onTime={setTime} />
          ))}
        </div>

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
