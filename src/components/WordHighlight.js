const classNames = { de: 'german', ru: 'russian', unknown: 'unknown' }

export default function WordHighlight({ tokens }) {
  return <section className="panel highlight-panel"><div className="section-heading"><div><p className="eyebrow">03 · Textfluss</p><h2>Sprachmarkierung</h2></div><div className="legend"><span><i className="legend-dot german" /> Deutsch</span><span><i className="legend-dot russian" /> Russisch</span><span><i className="legend-dot switch" /> Switch</span></div></div><div className="token-stream">{tokens.length ? tokens.map((token) => <span key={token.id} className={`token ${classNames[token.language] || 'unknown'} ${token.switchBefore ? 'switch-before' : ''}`} title={`${token.language}${token.switchBefore ? ' · Switch davor' : ''}`}>{token.word}</span>) : <span className="empty-state">Noch kein Text analysiert.</span>}</div></section>
}
