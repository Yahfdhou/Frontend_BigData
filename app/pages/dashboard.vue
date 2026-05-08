<script setup lang="ts">
import {
  Activity,
  AlertTriangle,
  Gauge,
  RefreshCw,
  TrendingUp,
} from 'lucide-vue-next'
import BarChart from '~/components/charts/BarChart.vue'
import LineChart from '~/components/charts/LineChart.vue'
import DoughnutChart from '~/components/charts/DoughnutChart.vue'
import StatsOverview from '~/components/stats/StatsOverview.vue'

useSeoMeta({
  title: 'Dashboard | Amazon Reviews Intelligence',
  description: 'Vue globale des metriques de sentiment Amazon reviews.',
})

const api = useApi()

const {
  data: stats,
  pending,
  error,
  refresh,
} = await useAsyncData('dashboard-stats', () => api.getStats())

const safeStats = computed(() => ({
  total: stats.value?.total ?? 0,
  positifs: stats.value?.positifs ?? 0,
  neutres: stats.value?.neutres ?? 0,
  negatifs: stats.value?.negatifs ?? 0,
  streaming: stats.value?.streaming ?? 0,
}))

const toPercent = (value: number, total: number) => {
  if (!total) {
    return 0
  }

  return Math.round((value / total) * 100)
}

const distribution = computed(() => {
  const total = safeStats.value.total

  return [
    {
      label: 'Positifs',
      value: safeStats.value.positifs,
      percent: toPercent(safeStats.value.positifs, total),
      track: 'bg-emerald-500',
      text: 'text-emerald-700',
    },
    {
      label: 'Neutres',
      value: safeStats.value.neutres,
      percent: toPercent(safeStats.value.neutres, total),
      track: 'bg-amber-500',
      text: 'text-amber-700',
    },
    {
      label: 'Negatifs',
      value: safeStats.value.negatifs,
      percent: toPercent(safeStats.value.negatifs, total),
      track: 'bg-rose-500',
      text: 'text-rose-700',
    },
  ]
})

const streamCoverage = computed(() =>
  toPercent(safeStats.value.streaming, safeStats.value.total),
)

const sentimentIndex = computed(() => {
  if (!safeStats.value.total) {
    return 0
  }

  return Math.round(
    ((safeStats.value.positifs - safeStats.value.negatifs) / safeStats.value.total) * 100,
  )
})

const momentumLabel = computed(() => {
  if (sentimentIndex.value >= 40) {
    return 'Momentum tres positif'
  }

  if (sentimentIndex.value >= 10) {
    return 'Momentum en progression'
  }

  if (sentimentIndex.value > -10) {
    return 'Momentum stable'
  }

  return 'Tension negative a surveiller'
})

const refreshedAt = ref(new Date())

watch(stats, (value) => {
  if (value) {
    refreshedAt.value = new Date()
  }
})
</script>

<template>
  <section class="space-y-6">
    <div class="section-enter glass-panel rounded-3xl p-4 md:p-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 md:text-3xl">Dashboard</h1>
          <p class="mt-1 text-sm text-slate-600">
            Indice {{ sentimentIndex }}% • Couverture live {{ streamCoverage }}% • MAJ {{ refreshedAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }}
          </p>
        </div>

        <button
          class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="pending"
          @click="refresh()"
        >
          <RefreshCw class="h-4 w-4" :class="pending ? 'animate-spin' : ''" />
          Rafraichir
        </button>
      </div>
    </div>

    <div v-if="pending" class="glass-panel rounded-3xl p-8 text-center text-slate-600">
      Chargement des statistiques...
    </div>

    <div v-else-if="error" class="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
      Erreur lors du chargement des statistiques. Verifiez l'API backend sur le port 5000.
    </div>

    <div v-else-if="stats" class="space-y-6">
      <StatsOverview :stats="stats" />

      <div class="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <article class="glass-panel section-enter rounded-3xl p-5 xl:col-span-3">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Signal Radar</p>
          <div class="mt-4 flex items-center gap-3">
            <div class="grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white">
              <TrendingUp class="h-5 w-5" />
            </div>
            <div>
              <p class="text-xl font-semibold text-slate-900">{{ momentumLabel }}</p>
              <p class="text-sm text-slate-600">
                Base sur la difference entre avis positifs et negatifs.
              </p>
            </div>
          </div>

          <div class="mt-6 space-y-4">
            <div v-for="item in distribution" :key="item.label" class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <p class="font-medium" :class="item.text">{{ item.label }}</p>
                <p class="text-slate-600">{{ item.value.toLocaleString('fr-FR') }} ({{ item.percent }}%)</p>
              </div>
              <div class="h-2.5 rounded-full bg-slate-200">
                <div class="h-2.5 rounded-full transition-all duration-500" :class="item.track" :style="{ width: `${item.percent}%` }" />
              </div>
            </div>
          </div>
        </article>

        <article class="glass-panel section-enter rounded-3xl p-5 xl:col-span-2">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Pulse</p>

          <div class="mt-4 space-y-3">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p class="text-sm text-slate-500">Flux streaming</p>
              <p class="mt-1 flex items-end gap-2 text-2xl font-semibold text-slate-900">
                {{ safeStats.streaming.toLocaleString('fr-FR') }}
                <span class="text-xs font-medium text-slate-500">en direct</span>
              </p>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p class="text-sm text-slate-500">Qualite globale</p>
              <div class="mt-2 flex items-center gap-2">
                <Gauge class="h-4 w-4 text-cyan-700" />
                <p class="text-sm font-medium text-slate-700">{{ Math.max(0, 50 + sentimentIndex / 2) }} / 100</p>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p class="text-sm text-slate-500">Alerte</p>
              <div class="mt-2 flex items-center gap-2">
                <component :is="sentimentIndex < 0 ? AlertTriangle : Activity" class="h-4 w-4" :class="sentimentIndex < 0 ? 'text-rose-600' : 'text-emerald-600'" />
                <p class="text-sm font-medium text-slate-700">
                  {{ sentimentIndex < 0 ? 'Verifiez les retours negatifs prioritaires' : 'Signal stable et sous controle' }}
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <BarChart :positifs="safeStats.positifs" :neutres="safeStats.neutres" :negatifs="safeStats.negatifs" />
        <LineChart :positifs="safeStats.positifs" :neutres="safeStats.neutres" :negatifs="safeStats.negatifs" />
        <DoughnutChart :positifs="safeStats.positifs" :neutres="safeStats.neutres" :negatifs="safeStats.negatifs" />
      </div>
    </div>

    <div v-else class="glass-panel rounded-3xl p-6 text-slate-600">
      Aucun resultat disponible.
    </div>
  </section>
</template>
