<script setup lang="ts">
import { Activity, Award, TrendingUp, Zap } from 'lucide-vue-next'
import {
  Bar,
  Doughnut,
  Radar,
} from 'vue-chartjs'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
  type ChartOptions,
} from 'chart.js'
import type { ModelMetricsResponse, ModelInfoResponse, DataStatsResponse } from '~/types/api'

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
)

const api = useApi()

const {
  data: metricsData,
  pending: metricsPending,
} = await useAsyncData('model-metrics', () => api.getModelMetrics())

const {
  data: infoData,
  pending: infoPending,
} = await useAsyncData('model-info', () => api.getModelInfo())

const {
  data: statsData,
  pending: statsPending,
} = await useAsyncData('data-stats', () => api.getDataStats())

const isPending = computed(() => metricsPending.value || infoPending.value || statsPending.value)

const modelInfo = computed(() => infoData.value)
const metrics = computed(() => metricsData.value)
const stats = computed(() => statsData.value)

const bestModelAccuracy = computed(() =>
  modelInfo.value?.accuracy ? Math.round(modelInfo.value.accuracy * 100) : 0
)

const bestModelF1 = computed(() =>
  modelInfo.value?.f1_score ? Math.round(modelInfo.value.f1_score * 100) : 0
)

const allModels = computed(() => metrics.value?.all_models ?? [])

const modelComparisonData = computed(() => ({
  labels: allModels.value.map((model) => model.model_name),
  datasets: [
    {
      label: 'Test Accuracy',
      data: allModels.value.map((model) => Number((model.test_accuracy * 100).toFixed(2))),
      backgroundColor: 'rgba(14, 165, 233, 0.75)',
      borderRadius: 10,
      borderSkipped: false,
      barThickness: 18,
    },
    {
      label: 'Validation Accuracy',
      data: allModels.value.map((model) => Number((model.val_accuracy * 100).toFixed(2))),
      backgroundColor: 'rgba(139, 92, 246, 0.75)',
      borderRadius: 10,
      borderSkipped: false,
      barThickness: 18,
    },
    {
      label: 'F1 Score',
      data: allModels.value.map((model) => Number((model.test_f1 * 100).toFixed(2))),
      backgroundColor: 'rgba(16, 185, 129, 0.75)',
      borderRadius: 10,
      borderSkipped: false,
      barThickness: 18,
    },
  ],
}))

const modelComparisonOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: 'rgb(51, 65, 85)',
        usePointStyle: true,
      },
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.dataset.label}: ${context.parsed.y}%`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      grid: {
        color: 'rgba(148, 163, 184, 0.2)',
      },
      ticks: {
        callback: (value) => `${value}%`,
        color: 'rgb(100, 116, 139)',
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: 'rgb(71, 85, 105)',
      },
    },
  },
}

const sentimentShareData = computed(() => {
  const distribution = stats.value?.class_distribution

  return {
    labels: ['Positifs', 'Neutres', 'Negatifs'],
    datasets: [
      {
        data: [
          distribution?.positive ?? 0,
          distribution?.neutral ?? 0,
          distribution?.negative ?? 0,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(244, 63, 94, 0.8)',
        ],
        borderColor: [
          'rgb(5, 150, 105)',
          'rgb(217, 119, 6)',
          'rgb(225, 29, 72)',
        ],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  }
})

const sentimentShareOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '58%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: 'rgb(51, 65, 85)',
        usePointStyle: true,
      },
    },
  },
}

const stabilityRadarData = computed(() => {
  const accuracy = bestModelAccuracy.value
  const f1 = bestModelF1.value
  const neutralShare = Math.round(stats.value?.percentages?.neutral ?? 0)
  const positiveShare = Math.round(stats.value?.percentages?.positive ?? 0)
  const negativeControl = Math.max(0, 100 - Math.round(stats.value?.percentages?.negative ?? 0))

  return {
    labels: ['Accuracy', 'F1', 'Neutral Balance', 'Positive Share', 'Negative Control'],
    datasets: [
      {
        label: 'Model Health Index',
        data: [accuracy, f1, neutralShare, positiveShare, negativeControl],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(37, 99, 235)',
        pointBackgroundColor: 'rgb(37, 99, 235)',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: 'rgb(37, 99, 235)',
        borderWidth: 2,
      },
    ],
  }
})

const stabilityRadarOptions: ChartOptions<'radar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: 'rgb(51, 65, 85)',
      },
    },
  },
  scales: {
    r: {
      beginAtZero: true,
      max: 100,
      ticks: {
        display: false,
      },
      pointLabels: {
        color: 'rgb(71, 85, 105)',
        font: {
          size: 11,
        },
      },
      grid: {
        color: 'rgba(148, 163, 184, 0.25)',
      },
      angleLines: {
        color: 'rgba(148, 163, 184, 0.25)',
      },
    },
  },
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="isPending" class="flex items-center justify-center rounded-2xl bg-slate-100 py-8">
      <p class="text-slate-600">Chargement des métriques du modèle...</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Best Model Info -->
      <div v-if="modelInfo" class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <article class="glass-panel rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-5">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-emerald-700">Précision</p>
              <p class="mt-2 text-3xl font-bold text-emerald-900">{{ bestModelAccuracy }}%</p>
              <p class="mt-1 text-xs text-emerald-700">{{ modelInfo.model_name }}</p>
            </div>
            <div class="rounded-lg bg-emerald-500/20 p-2">
              <Award class="h-6 w-6 text-emerald-700" />
            </div>
          </div>
        </article>

        <article class="glass-panel rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-5">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-blue-700">F1 Score</p>
              <p class="mt-2 text-3xl font-bold text-blue-900">{{ bestModelF1 }}%</p>
              <p class="mt-1 text-xs text-blue-700">Score équilibré</p>
            </div>
            <div class="rounded-lg bg-blue-500/20 p-2">
              <TrendingUp class="h-6 w-6 text-blue-700" />
            </div>
          </div>
        </article>

        <article class="glass-panel rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50 p-5">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-purple-700">Version Spark</p>
              <p class="mt-2 font-mono text-lg font-semibold text-purple-900">{{ modelInfo.spark_version }}</p>
              <p class="mt-1 text-xs text-purple-700">Version utilisée</p>
            </div>
            <div class="rounded-lg bg-purple-500/20 p-2">
              <Zap class="h-6 w-6 text-purple-700" />
            </div>
          </div>
        </article>

        <article class="glass-panel rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/50 p-5">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-amber-700">Enregistré</p>
              <p class="mt-2 text-sm font-semibold text-amber-900">
                {{ new Date(modelInfo.saved_at).toLocaleDateString('fr-FR') }}
              </p>
              <p class="mt-1 text-xs text-amber-700">{{ new Date(modelInfo.saved_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }}</p>
            </div>
            <div class="rounded-lg bg-amber-500/20 p-2">
              <Activity class="h-6 w-6 text-amber-700" />
            </div>
          </div>
        </article>
      </div>

      <!-- Data Statistics -->
      <div v-if="stats" class="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 class="mb-4 text-lg font-semibold text-slate-900">📊 Statistiques des Données</h3>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div class="rounded-xl bg-slate-50 p-4">
            <p class="text-sm text-slate-600">Total Prédictions</p>
            <p class="mt-2 text-2xl font-bold text-slate-900">{{ stats.total_predictions.toLocaleString('fr-FR') }}</p>
          </div>

          <div class="rounded-xl bg-rose-50 p-4">
            <p class="text-sm text-rose-700">Négatifs</p>
            <p class="mt-2 text-2xl font-bold text-rose-900">{{ stats.class_distribution.negative.toLocaleString('fr-FR') }}</p>
            <p class="mt-1 text-xs text-rose-600">{{ stats.percentages.negative }}%</p>
          </div>

          <div class="rounded-xl bg-amber-50 p-4">
            <p class="text-sm text-amber-700">Neutres</p>
            <p class="mt-2 text-2xl font-bold text-amber-900">{{ stats.class_distribution.neutral.toLocaleString('fr-FR') }}</p>
            <p class="mt-1 text-xs text-amber-600">{{ stats.percentages.neutral }}%</p>
          </div>

          <div class="rounded-xl bg-emerald-50 p-4">
            <p class="text-sm text-emerald-700">Positifs</p>
            <p class="mt-2 text-2xl font-bold text-emerald-900">{{ stats.class_distribution.positive.toLocaleString('fr-FR') }}</p>
            <p class="mt-1 text-xs text-emerald-600">{{ stats.percentages.positive }}%</p>
          </div>
        </div>
      </div>

      <div
        v-if="stats && metrics && metrics.all_models.length > 0"
        class="grid grid-cols-1 gap-5 xl:grid-cols-12"
      >
        <article class="glass-panel rounded-2xl border border-sky-100 bg-white p-5 xl:col-span-7">
          <div class="mb-4 flex items-center justify-between gap-3">
            <h3 class="text-lg font-semibold text-slate-900">Performance Comparee des Modeles</h3>
            <span class="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
              Live Benchmarks
            </span>
          </div>
          <div class="h-[300px]">
            <Bar :data="modelComparisonData" :options="modelComparisonOptions" />
          </div>
        </article>

        <article class="glass-panel rounded-2xl border border-emerald-100 bg-white p-5 xl:col-span-5">
          <h3 class="mb-4 text-lg font-semibold text-slate-900">Sentiment Mix</h3>
          <div class="h-[300px]">
            <Doughnut :data="sentimentShareData" :options="sentimentShareOptions" />
          </div>
        </article>
      </div>

      <article
        v-if="stats && modelInfo"
        class="glass-panel rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-white to-cyan-50/60 p-5"
      >
        <div class="mb-4 flex items-center justify-between gap-3">
          <h3 class="text-lg font-semibold text-slate-900">Radar de Stabilite du Modele</h3>
          <span class="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            {{ modelInfo.model_name }}
          </span>
        </div>
        <div class="h-[320px]">
          <Radar :data="stabilityRadarData" :options="stabilityRadarOptions" />
        </div>
      </article>

      <!-- Model Versions -->
      <div v-if="metrics && metrics.all_models.length > 0" class="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 class="mb-4 text-lg font-semibold text-slate-900">📈 Historique des Modèles</h3>
        <div class="space-y-2 overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="border-b border-slate-200">
              <tr>
                <th class="px-4 py-3 text-left font-semibold text-slate-600">Modèle</th>
                <th class="px-4 py-3 text-left font-semibold text-slate-600">Accuracy Test</th>
                <th class="px-4 py-3 text-left font-semibold text-slate-600">F1 Score</th>
                <th class="px-4 py-3 text-left font-semibold text-slate-600">Accuracy Val</th>
                <th class="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="model in metrics.all_models"
                :key="model.model_name"
                class="border-b border-slate-100 hover:bg-slate-50"
              >
                <td class="px-4 py-3 font-medium text-slate-900">{{ model.model_name }}</td>
                <td class="px-4 py-3 text-slate-700">{{ (model.test_accuracy * 100).toFixed(2) }}%</td>
                <td class="px-4 py-3 text-slate-700">{{ (model.test_f1 * 100).toFixed(2) }}%</td>
                <td class="px-4 py-3 text-slate-700">{{ (model.val_accuracy * 100).toFixed(2) }}%</td>
                <td class="px-4 py-3">
                  <span
                    class="inline-block rounded-full px-2 py-1 text-xs font-semibold"
                    :class="model.is_best
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-700'
                    "
                  >
                    {{ model.is_best ? '⭐ Meilleur' : 'Archive' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
