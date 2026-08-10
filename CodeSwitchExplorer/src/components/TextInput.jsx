import React from 'react'

export default function TextInput({value,onChange,onAnalyze,onLoadExample}){
  return React.createElement('section', {className: 'input-panel panel'},
    React.createElement('div', {className: 'section-heading'},
      React.createElement('div', null,
        React.createElement('p', {className: 'eyebrow'}, '01 · Korpus'),
        React.createElement('h2', null, 'Text untersuchen')
      ),
      React.createElement('span', {className: 'mono-label'}, 'DE / EN / RU')
    ),
    React.createElement('textarea', {value: value, onChange: e => onChange(e.target.value), placeholder: 'Füge hier einen deutsch-englisch-russischen Text oder Dialog ein...', 'aria-label': 'Text zur Analyse'}),
    React.createElement('div', {className: 'input-actions'},
      React.createElement('button', {className: 'primary-button', onClick: onAnalyze}, 'Analysieren'),
      React.createElement('button', {className: 'text-button', onClick: onLoadExample}, 'Beispiel laden')
    )
  )
}
