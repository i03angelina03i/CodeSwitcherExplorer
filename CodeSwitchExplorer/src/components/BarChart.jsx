import React from 'react'
import { Bar } from 'react-chartjs-2'
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js'
ChartJS.register(BarElement, CategoryScale, Legend, LinearScale, Tooltip)

export default function BarChart({stats}){
  const labels = Object.keys(stats.counts||{})
  const data = { labels, datasets:[{ data: labels.map(l=>stats.counts[l]), backgroundColor:['#4caf50','#2196f3','#ff9800'], borderRadius:5 }] }
  return React.createElement('section', {className: 'chart-card'},
    React.createElement('p', {className: 'eyebrow'}, 'VERTEILUNG'),
    React.createElement('h3', null, 'Wortanzahl'),
    React.createElement(Bar, {data: data, options: {responsive: true, plugins: {legend: {display: false}}}})
  )
}
