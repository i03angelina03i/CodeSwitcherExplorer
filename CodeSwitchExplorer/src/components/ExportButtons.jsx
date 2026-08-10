import React from 'react'

function download(content, filename, type){
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([content],{type}))
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

export default function ExportButtons({tokens, stats}){
  const csv = ['Nr.,Wort,Sprache,POS,Switch davor', ...tokens.map(t=>`${t.id},"${t.word.replaceAll('"','""')}",${t.language},${t.pos||''},${t.switchBefore?'Ja':'Nein'}`)].join('\n')
  const json = JSON.stringify({tokens, stats}, null, 2)
  return React.createElement('div', {className: 'export-actions'},
    React.createElement('button', {onClick: () => download(csv, 'codeswitch.csv', 'text/csv;charset=utf-8'), disabled: !tokens.length}, 'CSV ↓'),
    React.createElement('button', {onClick: () => download(json, 'codeswitch.json', 'application/json'), disabled: !tokens.length}, 'JSON ↓')
  )
}
