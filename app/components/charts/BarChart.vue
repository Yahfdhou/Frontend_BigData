<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Props {
  title?: string
  positifs: number
  neutres: number
  negatifs: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Distribution des Sentiments',
})

const chartData = computed(() => ({
  labels: ['Positifs', 'Neutres', 'Négatifs'],
  datasets: [
    {
      label: 'Nombre d\'avis',
      data: [props.positifs, props.neutres, props.negatifs],
      backgroundColor: [
        'rgba(16, 185, 129, 0.6)',
        'rgba(245, 158, 11, 0.6)',
        'rgba(239, 68, 68, 0.6)',
      ],
      borderColor: [
        'rgb(16, 185, 129)',
        'rgb(245, 158, 11)',
        'rgb(239, 68, 68)',
      ],
      borderWidth: 2,
      borderRadius: 8,
      hoverBackgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
    },
  ],
}))

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: true,
  indexAxis: 'x',
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
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
