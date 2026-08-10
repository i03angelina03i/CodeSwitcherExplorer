import React, {useState} from 'react'
import Header from './components/Header.jsx'
import TextInput from './components/TextInput.jsx'
import Statistics from './components/Statistics.jsx'
import POSStatistics from './components/POSStatistics.jsx'
import WordHighlight from './components/WordHighlight.jsx'
import Timeline from './components/Timeline.jsx'
import BarChart from './components/BarChart.jsx'
import PieChart from './components/PieChart.jsx'
import Heatmap from './components/Heatmap.jsx'
import ExportButtons from './components/ExportButtons.jsx'
import TableView from './components/TableView.jsx'
import {analyzeTokens} from './utils/languageDetector'
import {detectSwitches} from './utils/switchDetector'
import {calculateStatistics, sentenceSwitches} from './utils/statistics'
import { tagPOS } from './utils/posTagger'
import './App.css'

const EXAMPLE = 'Привет! Hello, how are you? Ich komme später nach Hause.'

export default function App(){
  const [text,setText] = useState('')
  const [tokens,setTokens] = useState([])
  const [stats,setStats] = useState({total:0,counts:{},switches:0,posPerLang:{}})
  const [message,setMessage] = useState('')

  function analyze(){
    if(!text.trim()){ setMessage('Bitte einen Text eingeben.'); return }
    const raw = analyzeTokens(text)
    const withSwitch = detectSwitches(raw)
    // tag POS for each token
    const withPOS = withSwitch.map(t=>({...t, pos: tagPOS(t.language, t.word)}))
    const s = calculateStatistics(withPOS)
    setTokens(withPOS)
    setStats(s)
    setMessage(s.switches? '': 'Kein Code-Switching erkannt.')
  }
  function loadExample(){ setText(EXAMPLE); setMessage(''); analyzeTokens(EXAMPLE); const raw = analyzeTokens(EXAMPLE); setTokens(detectSwitches(raw)) }

  const sentences = tokens.length? sentenceSwitches(text,tokens):[]

  return React.createElement('div', {className: 'app-shell'},
    React.createElement(Header, null),
    React.createElement('main', null,
      React.createElement('div', {className: 'workspace-grid'},
        React.createElement(TextInput, {value: text, onChange: setText, onAnalyze: analyze, onLoadExample: loadExample}),
        React.createElement(Statistics, {stats: stats})
      ),
      message && React.createElement('div', {className: `notice ${message.startsWith('Bitte') ? 'warning' : 'info'}`}, message),
      React.createElement(WordHighlight, {tokens: tokens}),
      React.createElement('div', {className: 'visual-grid'},
        React.createElement(BarChart, {stats: stats}),
        React.createElement(PieChart, {stats: stats}),
        React.createElement(Heatmap, {sentences: sentences})
      ),
      React.createElement(Timeline, {tokens: tokens}),
      React.createElement('div', {className: 'table-heading'},
        React.createElement('div', null,
          React.createElement('p', {className: 'eyebrow'}, 'DATENEXPORT'),
          React.createElement('h2', null, 'Analysierte Wörter')
        ),
        React.createElement(ExportButtons, {tokens: tokens, stats: stats})
      ),
      React.createElement(POSStatistics, {posPerLang: stats.posPerLang}),
      React.createElement(TableView, {tokens: tokens})
    ),
    React.createElement('footer', null, 'CodeSwitch Explorer — DE / EN / RU')
  )
}
