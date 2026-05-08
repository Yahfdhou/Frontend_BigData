<script setup lang="ts">
import PredictionsExplorerTab from '~/components/model/PredictionsExplorerTab.vue'

useSeoMeta({
  title: 'Explorateur de Prédictions | Amazon Reviews Intelligence',
  description: 'Explorez et analylez les prédictions de sentiment.',
})
</script>

<template>
  <section class="space-y-6">
    <div class="glass-panel rounded-3xl p-4 md:p-5">
      <h1 class="text-2xl font-semibold text-slate-900 md:text-3xl">Explorateur de Prédictions</h1>
      <p class="mt-1 text-sm text-slate-600">Analysez le sentiment des textes en temps réel</p>
    </div>

    <PredictionsExplorerTab />
  </section>
</template>
