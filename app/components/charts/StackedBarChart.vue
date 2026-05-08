<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import type { NormalizedPrediction, PredictionsByDateResponse } from '~/types/api'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const api = useApi()

const props = defineProps<{
  records: NormalizedPrediction[]
}>()

const {
  data: groupedData,
  pending,
  error,
} = await useAsyncData('predictions-by-date', () => api.getPredictionsByDate(), {
  default: () => null as PredictionsByDateResponse | null,
})

const { data: monthData } = await useAsyncData('predictions-by-month', () => api.getPredictionsByMonth(), {
  default: () => null as any[] | null,
})

const localGrouped = computed(() => {
  const grouped = new Map<string, { negative: number; neutral: number; positive: number }>()

  props.records.forEach((record) => {
    if (!record.timestamp) return

    const parsedDate = new Date(record.timestamp)
    if (Number.isNaN(parsedDate.getTime())) return

    const dateKey = parsedDate.toISOString().slice(0, 10)
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, { negative: 0, neutral: 0, positive: 0 })
    }

    const bucket = grouped.get(dateKey)
    if (bucket) {
      if (record.prediction === 0) bucket.negative += 1
      if (record.prediction === 1) bucket.neutral += 1
      if (record.prediction === 2) bucket.positive += 1
    }
  })

  return Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => ({ date, ...counts }))
})

const chartItems = computed(() => {
  // Prefer backend monthly aggregation if present
  const monthItems = monthData.value || []
  if (Array.isArray(monthItems) && monthItems.length > 0) {
    // expected shape: [{ label: 'Dec-05', negative:0, neutral:0, positive:1 }, ...]
    return monthItems.map((m: any) => ({ date: m.label, negative: m.negative || 0, neutral: m.neutral || 0, positive: m.positive || 0 }))
  }

  // Fallback to daily API if provided
  const apiItems = groupedData.value?.predictions_by_date || []
  if (Array.isArray(apiItems) && apiItems.length > 0) {
    return apiItems.map((a: any) => ({ date: a.date, negative: a.negative || 0, neutral: a.neutral || 0, positive: a.positive || 0 }))
  }

  // Local grouping fallback
  return localGrouped.value
})

const chartData = computed<ChartData<'bar'>>(() => {
  const items = chartItems.value

  return {
    labels: items.map(item => item.date),
    datasets: [
      {
        label: 'Negative',
        data: items.map(item => item.negative),
        backgroundColor: 'rgba(239, 68, 68, 0.82)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        borderRadius: 6,
        stack: 'sentiments',
      },
      {
        label: 'Neutral',
        data: items.map(item => item.neutral),
        backgroundColor: 'rgba(245, 158, 11, 0.82)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 1,
        borderRadius: 6,
        stack: 'sentiments',
      },
      {
        label: 'Positive',
        data: items.map(item => item.positive),
        backgroundColor: 'rgba(16, 185, 129, 0.82)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
        borderRadius: 6,
        stack: 'sentiments',
      },
    ],
  }
})

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: 'rgb(71, 85, 105)',
        usePointStyle: true,
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
      ticks: {
        color: 'rgb(100, 116, 139)',
      },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      grid: {
        color: 'rgba(15, 23, 42, 0.06)',
      },
      ticks: {
        color: 'rgb(100, 116, 139)',
        precision: 0,
      },
    },
  },
}
</script>

<template>
  <section class="glass-panel section-enter rounded-3xl p-5 md:p-6">
    <div class="mb-4 flex items-center justify-between gap-3">
      <div>
        <h2 class="text-xl font-semibold text-slate-900">Résultat des prédictions par date</h2>
        <p class="text-sm text-slate-600">Source: /api/predictions-by-date</p>
      </div>
    </div>

    <div v-if="pending" class="flex h-[360px] items-center justify-center rounded-2xl border border-slate-200 bg-white/70 text-sm text-slate-500">
      Chargement du graphe...
    </div>

    <div v-else-if="error && chartItems.length === 0" class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
      Impossible de charger les données de date.
    </div>

    <div v-else class="h-[360px] rounded-2xl border border-slate-200 bg-white/70 p-3">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </section>
</template>
