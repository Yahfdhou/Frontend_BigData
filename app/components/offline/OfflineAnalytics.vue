<script setup lang="ts">
import ProductScoringChart from '~/components/charts/ProductScoringChart.vue'
import StackedBarChart from '~/components/charts/StackedBarChart.vue'
import type { NormalizedPrediction } from '~/types/api'

const props = defineProps<{
  records: NormalizedPrediction[]
}>()
</script>

<template>
  <div class="space-y-6">
    <div class="grid gap-6 xl:grid-cols-5">
      <div class="xl:col-span-3">
        <StackedBarChart
          title="Résultat des prédictions par date"
          :records="records"
        />
      </div>

      <div class="xl:col-span-2">
        <ProductScoringChart :records="records" />
      </div>
    </div>
  </div>
</template>
