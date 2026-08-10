import React from 'react'

export default function POSStatistics({ posPerLang }){
  const langs = Object.keys(posPerLang||{})
  return React.createElement('section', {className: 'panel pos-panel'},
    React.createElement('div', {className: 'section-heading'},
      React.createElement('div', null,
        React.createElement('p', {className: 'eyebrow'}, 'POS'),
        React.createElement('h2', null, 'Wortarten pro Sprache')
      )
    ),
    langs.length ? langs.map(lang => React.createElement('div', {key: lang, className: 'pos-block'}, React.createElement('h4', null, lang), React.createElement('ul', null, Object.entries(posPerLang[lang]).map(([pos,count])=> React.createElement('li', {key: pos}, React.createElement('strong', null, pos), ': ', String(count)))) ) ) : React.createElement('div', {className: 'empty-state'}, 'Keine POS-Daten vorhanden.')
  )
}
