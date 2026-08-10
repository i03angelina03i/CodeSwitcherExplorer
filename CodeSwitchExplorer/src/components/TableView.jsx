import React from 'react'

export default function TableView({tokens}){
  return React.createElement('section', {className: 'panel table-panel'},
    React.createElement('div', {className: 'section-heading'},
      React.createElement('div', null,
        React.createElement('p', {className: 'eyebrow'}, '05 · Detailansicht'),
        React.createElement('h2', null, 'Token-Tabelle')
      ),
      React.createElement('span', {className: 'mono-label'}, `${tokens.length} TOKENS`)
    ),
    React.createElement('div', {className: 'table-wrap'},
      React.createElement('table', null,
        React.createElement('thead', null, React.createElement('tr', null, React.createElement('th', null, 'Nr.'), React.createElement('th', null, 'Wort'), React.createElement('th', null, 'Sprache'), React.createElement('th', null, 'POS'), React.createElement('th', null, 'Switch davor?'))),
        React.createElement('tbody', null, tokens.map(t => React.createElement('tr', {key: t.id}, React.createElement('td', null, String(t.id).padStart(2,'0')), React.createElement('td', {className: 'word-cell'}, t.word), React.createElement('td', null, React.createElement('span', {className: `language-pill language-${t.language}`}, t.language)), React.createElement('td', null, t.pos), React.createElement('td', null, t.switchBefore ? 'Ja' : 'Nein'))))
      )
    )
  )
}
