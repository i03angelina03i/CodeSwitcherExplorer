export default function Timeline({tokens}){
  return <section className="panel timeline-panel"><div className="section-heading"><div><p className="eyebrow">04 · Sequenz</p><h2>Zeitlinie</h2></div></div><div className="timeline">{tokens.length?tokens.map((t,i)=> <div key={t.id} className="timeline-item"><div className={`timeline-box language-${i%5}`}>{t.id}</div>{t.switchBefore && <div className="switch-line"/>}</div>):<div className="empty-state">Die analysierte Sequenz erscheint hier.</div>}</div></section>
}
