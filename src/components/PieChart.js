import { Doughnut } from 'react-chartjs-2'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
ChartJS.register(ArcElement, Legend, Tooltip)

export default function PieChart({ statistics }) {
  const data = { labels: statistics.languages, datasets: [{ data: statistics.languages.map((language) => statistics[language]), backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#8e6bbf', '#ef6c57'], borderWidth: 4, borderColor: '#fff' }] }
  return <section className="chart-card pie-card"><p className="eyebrow">ANTEILE</p><h3>Sprachanteil</h3><Doughnut data={data} options={{ responsive: true, cutout: '66%', plugins: { legend: { position: 'bottom' } } }} /></section>
}
