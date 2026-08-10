import { Bar } from 'react-chartjs-2'
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js'
ChartJS.register(BarElement, CategoryScale, Legend, LinearScale, Tooltip)

export default function BarChart({ statistics }) {
  const data = { labels: statistics.languages, datasets: [{ data: statistics.languages.map((language) => statistics[language]), backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#8e6bbf', '#ef6c57'], borderRadius: 5, barThickness: 30 }] }
  return <section className="chart-card"><p className="eyebrow">VERTEILUNG</p><h3>Wortanzahl</h3><Bar data={data} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }} /></section>
}
