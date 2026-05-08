<script setup lang="ts">
import {
  CircleMinus,
  CircleOff,
  CirclePlus,
  Radar,
  UsersRound,
} from 'lucide-vue-next'
import StatCard from '~/components/stats/StatCard.vue'

import type { StatsResponse } from '~/types/api'

const props = defineProps<{
  stats: StatsResponse
}>()

const sentimentCoverage = computed(() => {
  if (!props.stats.total) {
    return 0
  }

  return Math.round((props.stats.streaming / props.stats.total) * 100)
})

const cards = computed(() => [
  {
    label: 'Total Reviews',
    value: props.stats.total,
    icon: UsersRound,
    tone: 'slate' as const,
    caption: 'Volume global des avis collectes',
  },
  {
    label: 'Positifs',
    value: props.stats.positifs,
    icon: CirclePlus,
    tone: 'teal' as const,
    caption: 'Clients satisfaits',
  },
  {
    label: 'Neutres',
    value: props.stats.neutres,
    icon: CircleOff,
    tone: 'amber' as const,
    caption: 'Retours mitiges',
  },
  {
    label: 'Negatifs',
    value: props.stats.negatifs,
    icon: CircleMinus,
    tone: 'rose' as const,
    caption: 'Points a corriger',
  },
  {
    label: 'Streaming Live',
    value: props.stats.streaming,
    icon: Radar,
    tone: 'sky' as const,
    caption: `${sentimentCoverage.value}% du total`,
  },
])
</script>

<template>
  <section>
    <div class="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 class="text-2xl font-semibold text-slate-900">Snapshot des metriques</h2>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard
        v-for="card in cards"
        :key="card.label"
        :label="card.label"
        :value="card.value"
        :icon="card.icon"
        :tone="card.tone"
        :caption="card.caption"
      />
    </div>
  </section>
</template>
