import React from 'react'

export default function Statistics({ stats }){
  const languages = Object.keys(stats.counts||{})
  return React.createElement('section', {className: 'stats-panel'},
    React.createElement('div', {className: 'section-heading'},
      React.createElement('div', null,
        React.createElement('p', {className: 'eyebrow'}, '02 · Überblick'),
        React.createElement('h2', null, 'Statistik')
      )
    ),
    React.createElement('div', {className: 'stat-grid'},
      React.createElement('div', {className: 'stat-card neutral'}, React.createElement('span', null, 'Wörter insgesamt'), React.createElement('strong', null, stats.total)),
      ...languages.map((l,i) => React.createElement('div', {key: l, className: `stat-card language-${i%5}`}, React.createElement('span', null, l), React.createElement('strong', null, stats.counts[l]))),
      React.createElement('div', {className: 'stat-card switch'}, React.createElement('span', null, 'Code-Switches'), React.createElement('strong', null, stats.switches))
    )
  )
}
