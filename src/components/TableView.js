export default function TableView({ tokens }) {
  const typeStats = tokens.reduce((accumulator, token) => {
    const key = token.word.toLowerCase()
    if (!accumulator[key]) {
      accumulator[key] = { type: token.word, count: 0, switches: 0, language: token.language }
    }
    accumulator[key].count += 1
    if (token.switchBefore) accumulator[key].switches += 1
    return accumulator
  }, {})

  const sortedTypes = Object.values(typeStats).sort((left, right) => {
    if (right.count !== left.count) return right.count - left.count
    if (right.switches !== left.switches) return right.switches - left.switches
    return left.type.localeCompare(right.type)
  })

  return <section className="panel table-panel"><div className="section-heading"><div><p className="eyebrow">05 · Detailansicht</p><h2>Typ-Tabelle</h2></div><span className="mono-label">{sortedTypes.length} TYPES</span></div><div className="table-wrap"><table><thead><tr><th>Nr.</th><th>Typ</th><th>Häufigkeit</th><th>Switches</th><th>Sprache</th></tr></thead><tbody>{sortedTypes.map((entry, index) => <tr key={`${entry.type}-${index}`}><td>{String(index + 1).padStart(2, '0')}</td><td className="word-cell">{entry.type}</td><td>{entry.count}</td><td>{entry.switches}</td><td><span className="language-pill">{entry.language}</span></td></tr>)}</tbody></table>{!tokens.length && <div className="empty-state">Keine Token vorhanden.</div>}</div></section>
}
