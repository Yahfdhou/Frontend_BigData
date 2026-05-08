<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import SentimentsOverview from '~/components/sentiments/SentimentsOverview.vue'

useSeoMeta({
  title: 'Sentiments Analysis | Amazon Reviews Intelligence',
  description: 'Analyse détaillée de la distribution des sentiments et avis récents.',
})

const api = useApi()

const {
  data: sentimentsData,
  pending,
  error,
  refresh,
} = await useAsyncData('sentiments', () => api.getSentiments())
</script>

<template>
  <section class="space-y-5">
    <div class="section-enter glass-panel rounded-3xl p-4 md:p-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Analysis</p>
          <h1 class="text-2xl font-semibold leading-tight text-slate-900 md:text-3xl">
            Sentiments Analysis
          </h1>
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
      Chargement de l'analyse des sentiments...
    </div>

    <div v-else-if="error" class="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
      Erreur lors du chargement. Verifiez l'API backend sur le port 5000.
    </div>

    <SentimentsOverview v-else-if="sentimentsData" :data="sentimentsData" />

    <div v-else class="glass-panel rounded-3xl p-6 text-slate-600">
      Aucune donnee disponible.
    </div>
  </section>
</template>
