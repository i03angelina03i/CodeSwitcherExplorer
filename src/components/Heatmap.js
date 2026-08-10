export default function Heatmap({ sentences }) {
  const max = Math.max(1, ...sentences.map((item) => item.count))
  return <section className="chart-card heatmap-card"><p className="eyebrow">SATZEBENE</p><h3>Switch-Intensität</h3>{sentences.length ? <div className="heatmap">{sentences.map((item, index) => <div className="heat-row" key={`${item.sentence}-${index}`}><span>Satz {index + 1}</span><div className="heat-track"><i style={{ width: `${(item.count / max) * 100}%`, opacity: item.count ? 0.45 + item.count / max * 0.55 : 0.08 }} /></div><strong>{item.count}</strong></div>)}</div> : <span className="empty-state">Sätze werden nach der Analyse angezeigt.</span>}</section>
}
