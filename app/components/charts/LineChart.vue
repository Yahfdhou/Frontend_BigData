<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface Props {
  title?: string
  positifs: number
  neutres: number
  negatifs: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Tendance des Sentiments',
})

const chartData = computed(() => ({
  labels: ['Positifs', 'Neutres', 'Négatifs'],
  datasets: [
    {
      label: 'Positifs',
      data: [props.positifs, props.positifs * 0.8, props.positifs * 0.6],
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 5,
      pointBackgroundColor: 'rgb(16, 185, 129)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointHoverRadius: 7,
    },
    {
      label: 'Neutres',
      data: [props.neutres, props.neutres * 1.2, props.neutres * 0.9],
      borderColor: 'rgb(245, 158, 11)',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 5,
      pointBackgroundColor: 'rgb(245, 158, 11)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointHoverRadius: 7,
    },
    {
      label: 'Négatifs',
      data: [props.negatifs, props.negatifs * 1.1, props.negatifs * 1.3],
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 5,
      pointBackgroundColor: 'rgb(239, 68, 68)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointHoverRadius: 7,
    },
  ],
}))

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: 'rgb(71, 85, 105)',
        font: {
          size: 12,
          weight: 'bold',
        },
        padding: 20,
        usePointStyle: true,
      },
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(15, 23, 42, 0.05)',
        drawBorder: false,
      },
      ticks: {
        color: 'rgb(100, 116, 139)',
        font: {
          size: 11,
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: 'rgb(100, 116, 139)',
        font: {
          size: 12,
          weight: 'bold',
        },
      },
    },
  },
}
</script>

<template>
  <div class="glass-panel section-enter rounded-3xl p-6">
    <h3 class="mb-6 text-lg font-semibold text-slate-900">{{ title }}</h3>
    <div class="relative h-64">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
