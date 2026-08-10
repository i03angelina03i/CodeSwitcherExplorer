import React from 'react'

export default function Heatmap({sentences}){
  const max = Math.max(1, ...sentences.map(s=>s.count))
  return React.createElement('section', {className: 'chart-card heatmap-card'},
    React.createElement('p', {className: 'eyebrow'}, 'SATZEBENE'),
    React.createElement('h3', null, 'Switch-Intensität'),
    sentences.length ? React.createElement('div', {className: 'heatmap'}, sentences.map((s,i) => React.createElement('div', {key: i, className: 'heat-row'}, React.createElement('span', null, `Satz ${i+1}`), React.createElement('div', {className: 'heat-track'}, React.createElement('i', {style: {width: `${(s.count/max)*100}%`}})), React.createElement('strong', null, s.count)))) : React.createElement('div', {className: 'empty-state'}, 'Sätze werden nach der Analyse angezeigt.')
  )
}
