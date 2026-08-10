function download(content, filename, type) {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([content], { type }))
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

export default function ExportButtons({ tokens }) {
  const exportCsv = () => download(['Nr.,Wort,Sprache,Switch davor', ...tokens.map((token) => `${token.id},"${token.word.replaceAll('"', '""')}",${token.language},${token.switchBefore ? 'Ja' : 'Nein'}`)].join('\n'), 'codeswitch-analyse.csv', 'text/csv;charset=utf-8')
  const exportJson = () => download(JSON.stringify(tokens, null, 2), 'codeswitch-analyse.json', 'application/json')
  return <div className="export-actions"><span>Export</span><button onClick={exportCsv} disabled={!tokens.length}>CSV ↓</button><button onClick={exportJson} disabled={!tokens.length}>JSON ↓</button></div>
}
