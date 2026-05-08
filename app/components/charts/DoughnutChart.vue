<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  title?: string
  positifs: number
  neutres: number
  negatifs: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Répartition des Sentiments',
})

const total = computed(() => props.positifs + props.neutres + props.negatifs)

const chartData = computed(() => ({
  labels: ['Positifs', 'Neutres', 'Négatifs'],
  datasets: [
    {
      data: [props.positifs, props.neutres, props.negatifs],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
      borderColor: [
        'rgb(16, 185, 129)',
        'rgb(245, 158, 11)',
        'rgb(239, 68, 68)',
      ],
      borderWidth: 2,
      hoverOffset: 12,
    },
  ],
}))

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
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
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.label || ''
          const value = context.parsed as number
          const percent = ((value / total.value) * 100).toFixed(1)
          return `${label}: ${value} (${percent}%)`
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
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
