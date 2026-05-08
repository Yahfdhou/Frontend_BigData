<script setup lang="ts">
import OfflineAnalytics from '~/components/offline/OfflineAnalytics.vue'
import PredictionsTable from '~/components/predictions/PredictionsTable.vue'
import StatsOverview from '~/components/stats/StatsOverview.vue'

useSeoMeta({
  title: 'Offline | Amazon Reviews Intelligence',
  description: 'Analyse offline des avis avec normalisation des champs API.',
})

const api = useApi()

const {
  data: stats,
  pending: statsPending,
  error: statsError,
} = await useAsyncData('offline-stats', () => api.getStats())

const {
  data: offlinePredictions,
  pending: offlinePending,
  error: offlineError,
} = await useAsyncData('offline-list', () => api.getOffline())
</script>

<template>
  <section class="space-y-5">
    <div class="section-enter glass-panel rounded-3xl p-4 md:p-5">
      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Warehouse</p>
      <h1 class="text-2xl font-semibold leading-tight text-slate-900 md:text-3xl">
        Offline Insights
      </h1>
    </div>

    <div
      v-if="statsPending || offlinePending"
      class="glass-panel rounded-2xl p-8 text-center text-slate-600"
    >
      Chargement des donnees offline...
    </div>

    <div
      v-else-if="statsError || offlineError"
      class="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700"
    >
      Erreur lors du chargement offline. Verifiez l'endpoint /api/live.
    </div>

    <template v-else>
      <StatsOverview v-if="stats" :stats="stats" />

      <OfflineAnalytics :records="offlinePredictions || []" />

      <PredictionsTable
        :items="offlinePredictions || []"
        title="Historique offline"
        subtitle="Liste normalisee des avis live (max 100)"
        source-label="source live"
        :max-rows="100"
      />
    </template>
  </section>
</template>
