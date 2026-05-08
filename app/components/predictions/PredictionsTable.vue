<script setup lang="ts">
import { ListFilter } from 'lucide-vue-next'
import SentimentBadge from '~/components/predictions/SentimentBadge.vue'

import type { NormalizedPrediction } from '~/types/api'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle: string
    items: NormalizedPrediction[]
    maxRows?: number
    sourceLabel?: string
  }>(),
  {
    maxRows: 100,
    sourceLabel: '',
  },
)

const rows = computed(() => props.items.slice(0, props.maxRows))
</script>

<template>
  <section class="glass-panel section-enter overflow-hidden rounded-2xl p-5 md:p-6">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-semibold text-slate-900">{{ title }}</h2>
        <p class="mt-1 text-sm text-slate-600">{{ subtitle }}</p>
      </div>

      <div class="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700">
        <ListFilter class="h-4 w-4" />
        <span>{{ rows.length }} lignes{{ sourceLabel ? ` - ${sourceLabel}` : '' }}</span>
      </div>
    </div>

    <div class="overflow-x-auto rounded-2xl border border-slate-200/60 shadow-sm">
      <table class="min-w-full divide-y divide-slate-200 text-sm">
        <thead class="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200">
          <tr>
            <th class="px-4 py-4 text-left font-semibold text-slate-700 uppercase tracking-[0.05em] text-xs">Text</th>
            <th class="px-4 py-4 text-left font-semibold text-slate-700 uppercase tracking-[0.05em] text-xs">Summary</th>
            <th class="px-4 py-4 text-left font-semibold text-slate-700 uppercase tracking-[0.05em] text-xs">Score</th>
            <th class="px-4 py-4 text-left font-semibold text-slate-700 uppercase tracking-[0.05em] text-xs">Prediction</th>
            <th class="px-4 py-4 text-left font-semibold text-slate-700 uppercase tracking-[0.05em] text-xs">Sentiment</th>
            <th class="px-4 py-4 text-left font-semibold text-slate-700 uppercase tracking-[0.05em] text-xs">Product ID</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100/80 bg-white">
          <tr 
            v-for="(row, idx) in rows" 
            :key="row.id" 
            class="transition-colors duration-200"
            :class="idx % 2 === 0 ? 'hover:bg-blue-50/60' : 'bg-blue-50/30 hover:bg-blue-100/40'"
          >
            <td class="max-w-sm px-4 py-4 text-slate-700">
              <p class="line-clamp-2 text-sm">{{ row.text }}</p>
            </td>
            <td class="max-w-52 px-4 py-4 text-slate-600">
              <p class="line-clamp-2 text-sm">{{ row.summary || '-' }}</p>
            </td>
            <td class="px-4 py-4">
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg font-semibold text-slate-700 bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200">
                {{ row.score }}
              </span>
            </td>
            <td class="px-4 py-4">
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg font-semibold text-slate-700 bg-gradient-to-br from-sky-100 to-cyan-100 border border-sky-200">
                {{ row.prediction }}
              </span>
            </td>
            <td class="px-4 py-4">
              <SentimentBadge :sentiment="row.sentiment" />
            </td>
            <td class="px-4 py-4 text-slate-600 text-sm">
              <span class="font-mono bg-slate-100 rounded-lg px-3 py-1.5 inline-block border border-slate-200">
                {{ row.productId || '-' }}
              </span>
            </td>
          </tr>

          <tr v-if="rows.length === 0">
            <td colspan="6" class="px-4 py-12 text-center text-sm text-slate-500">
              Aucune donnee a afficher.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
