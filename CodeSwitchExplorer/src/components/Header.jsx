import React from 'react'

export default function Header(){
  return React.createElement('header', {className: 'app-header'},
    React.createElement('div', {className: 'brand-mark'}, 'CSE'),
    React.createElement('div', null,
      React.createElement('p', {className: 'eyebrow'}, 'Multilingual Korpuswerkzeug'),
      React.createElement('h1', null, 'CodeSwitch Explorer — DE · EN · RU')
    ),
    React.createElement('div', {className: 'header-status'}, 'Lokal')
  )
}
