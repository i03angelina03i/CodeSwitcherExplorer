import { useMemo, useState } from 'react'
import Header from './components/Header'
import TextInput from './components/TextInput'
import Statistics from './components/Statistics'
import WordHighlight from './components/WordHighlight'
import Timeline from './components/Timeline'
import BarChart from './components/BarChart'
import PieChart from './components/PieChart'
import Heatmap from './components/Heatmap'
import ExportButtons from './components/ExportButtons'
import TableView from './components/TableView'
import { analyzeText } from './utils/languageDetector'
import { detectSwitches } from './utils/switchDetector'
import { calculateStatistics, sentenceSwitches } from './utils/statistics'
import './App.css'

const EXAMPLES = [
  { label: 'Deutsch-Russisch', text: 'Ich gehe heute in die Stadt, потому что ich einen Termin habe.' },
  { label: 'Deutsch-Englisch', text: 'Heute gehen wir shopping, weil morgen ein Feiertag ist.' },
  { label: 'Russisch-Englisch', text: 'Мы обсуждаем new ideas и планируем следующий проект.' },
  { label: 'Deutsch-Russisch-Englisch', text: 'Heute habe ich einen meeting, потому что morgen ist holiday und wir arbeiten zusammen.' },
]
const EMPTY_STATS = calculateStatistics([])

export default function App() {
  const [text, setText] = useState('')
  const [tokens, setTokens] = useState([])
  const [message, setMessage] = useState('')
  const statistics = useMemo(() => (tokens.length ? calculateStatistics(tokens) : EMPTY_STATS), [tokens])
  const sentences = useMemo(() => (tokens.length ? sentenceSwitches(text, tokens) : []), [text, tokens])

  function analyze() {
    if (!text.trim()) {
      setMessage('Bitte einen Text eingeben.')
      setTokens([])
      return
    }

    const result = analyzeText(text)
    const analyzed = detectSwitches(result.tokens)
    setTokens(analyzed)
    setMessage(analyzed.some((token) => token.switchBefore) ? 'Analyse abgeschlossen · Code-Switching wurde erkannt.' : 'Keine klaren Code-Switches erkannt; die Token wurden trotzdem annotiert.')
  }

  function loadExample(exampleText = EXAMPLES[0].text) {
    setText(exampleText)
    const result = analyzeText(exampleText)
    setTokens(detectSwitches(result.tokens))
    setMessage('Beispiel geladen · Analyse bereit.')
  }

  function clearText() {
    setText('')
    setTokens([])
    setMessage('')
  }

  return <div className="app-shell"><Header /><main><div className="workspace-grid"><TextInput value={text} onChange={setText} onAnalyze={analyze} onLoadExample={() => loadExample(EXAMPLES[0].text)} onClear={clearText} examples={EXAMPLES} onSelectExample={loadExample} /><Statistics statistics={statistics} /></div>{message && <div className={`notice ${message.startsWith('Bitte') ? 'warning' : 'info'}`}>{message}</div>}<WordHighlight tokens={tokens} /><div className="visual-grid"><BarChart statistics={statistics} /><PieChart statistics={statistics} /><Heatmap sentences={sentences} /></div><Timeline tokens={tokens} /><div className="table-heading"><div><p className="eyebrow">DATENEXPORT</p><h2>Analysierte Wörter</h2></div><ExportButtons tokens={tokens} /></div><TableView tokens={tokens} /></main><footer>CodeSwitch Explorer <span>·</span> Mehrsprachige Code-Switch-Analyse im Browser</footer></div>
}
