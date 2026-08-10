import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
ChartJS.register(ArcElement, Legend, Tooltip)

export default function PieChart({stats}){
  const labels = Object.keys(stats.counts||{})
  const data = { labels, datasets:[{ data: labels.map(l=>stats.counts[l]), backgroundColor:['#4caf50','#2196f3','#ff9800'], borderWidth:4, borderColor:'#fff' }] }
  return React.createElement('section', {className: 'chart-card pie-card'},
    React.createElement('p', {className: 'eyebrow'}, 'ANTEILE'),
    React.createElement('h3', null, 'Sprachanteil'),
    React.createElement(Doughnut, {data: data, options: {responsive: true, cutout: '66%'}})
  )
}
