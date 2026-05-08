<script setup lang="ts">
import ModelMetricsTab from '~/components/model/ModelMetricsTab.vue'

useSeoMeta({
  title: 'Métriques du Modèle | Amazon Reviews Intelligence',
  description: 'Performance du modèle ML et métriques d\'entraînement.',
})
</script>

<template>
  <section class="space-y-6">
    <div class="glass-panel rounded-3xl p-4 md:p-5">
      <h1 class="text-2xl font-semibold text-slate-900 md:text-3xl">Métriques du Modèle</h1>
      <p class="mt-1 text-sm text-slate-600">Performance du modèle ML et historique des entraînements</p>
    </div>

    <ModelMetricsTab />
  </section>
</template>
