import React from 'react'

export default function WordHighlight({tokens}){
  return React.createElement('section', {className: 'panel highlight-panel'},
    React.createElement('div', {className: 'section-heading'},
      React.createElement('div', null,
        React.createElement('p', {className: 'eyebrow'}, '03 · Textfluss'),
        React.createElement('h2', null, 'Sprachmarkierung')
      )
    ),
    React.createElement('div', {className: 'token-stream'},
      tokens.length ? tokens.map(t => React.createElement('span', {key: t.id, className: `token language-${t.language}`, title: `${t.language} ${t.switchBefore ? '· Switch davor' : ''}`}, t.word)) : React.createElement('div', {className: 'empty-state'}, 'Noch kein Text analysiert.')
    )
  )
}
