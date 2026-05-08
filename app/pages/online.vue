<script setup lang="ts">
import { TimerReset } from 'lucide-vue-next'
import PredictionsTable from '~/components/predictions/PredictionsTable.vue'
import StatsOverview from '~/components/stats/StatsOverview.vue'

useSeoMeta({
  title: 'Online | Amazon Reviews Intelligence',
  description: 'Flux live des predictions sentiment avec polling toutes les 10 secondes.',
})

const api = useApi()
const lastUpdated = ref<string>('')
let intervalId: number | undefined

const {
  data: stats,
  pending: statsPending,
  error: statsError,
  refresh: refreshStats,
} = await useAsyncData('online-stats', () => api.getStats())

const {
  data: livePredictions,
  pending: livePending,
  error: liveError,
  refresh: refreshLive,
} = await useAsyncData('online-live', () => api.getLive(), {
  server: false,
  default: () => [],
})

const refreshAll = async () => {
  await Promise.all([refreshStats(), refreshLive()])
  lastUpdated.value = new Date().toLocaleTimeString('fr-FR')
}

onMounted(async () => {
  await refreshAll()

  intervalId = window.setInterval(() => {
    refreshAll()
  }, 10000)
})

onBeforeUnmount(() => {
  if (intervalId) {
    window.clearInterval(intervalId)
  }
})
</script>

<template>
  <section class="space-y-5">
    <div class="section-enter glass-panel flex flex-wrap items-center justify-between gap-3 rounded-3xl p-4 md:p-5">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Realtime</p>
        <h1 class="text-2xl font-semibold leading-tight text-slate-900 md:text-3xl">
          Online Stream
        </h1>
      </div>

      <div
        class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
      >
        <TimerReset class="h-4 w-4" />
        <span>Refresh 10s{{ lastUpdated ? ` - ${lastUpdated}` : '' }}</span>
      </div>
    </div>

    <div v-if="statsPending || livePending" class="glass-panel rounded-2xl p-8 text-center text-slate-600">
      Chargement du flux live...
    </div>

    <div
      v-else-if="statsError || liveError"
      class="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700"
    >
      Erreur lors du chargement online. Verifiez la disponibilite du backend API.
    </div>

    <template v-else>
      <StatsOverview v-if="stats" :stats="stats" />

      <PredictionsTable
        :items="livePredictions || []"
        title="Dernieres predictions live"
        subtitle="Liste normalisee des avis online (max 20)"
        source-label="source live"
        :max-rows="20"
      />
    </template>
  </section>
</template>
