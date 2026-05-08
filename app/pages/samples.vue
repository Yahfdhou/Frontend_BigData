<script setup lang="ts">
import PredictionsSamplesTab from '~/components/model/PredictionsSamplesTab.vue'

useSeoMeta({
  title: 'Échantillons de Prédictions | Amazon Reviews Intelligence',
  description: 'Visualisez les échantillons détaillés des prédictions.',
})
</script>

<template>
  <section class="space-y-6">
    <div class="glass-panel rounded-3xl p-4 md:p-5">
      <h1 class="text-2xl font-semibold text-slate-900 md:text-3xl">Échantillons de Prédictions</h1>
      <p class="mt-1 text-sm text-slate-600">Détails complets des prédictions avec analyse complète</p>
    </div>

    <PredictionsSamplesTab />
  </section>
</template>
