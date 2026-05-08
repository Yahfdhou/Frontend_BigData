<script setup lang="ts">
import { BarChart3, TrendingUp } from 'lucide-vue-next'
import SentimentBadge from '~/components/predictions/SentimentBadge.vue'

import type { SentimentsResponse } from '~/types/api'

const props = defineProps<{
  data: SentimentsResponse
}>()

const sentimentItems = [
  { label: 'Positifs', key: 'positifs', color: 'from-emerald-100 to-teal-100' },
  { label: 'Neutres', key: 'neutres', color: 'from-amber-100 to-orange-100' },
  { label: 'Négatifs', key: 'negatifs', color: 'from-rose-100 to-pink-100' },
]
</script>

<template>
  <div class="space-y-6">
    <!-- Distribution Chart -->
    <section class="glass-panel section-enter rounded-3xl p-5 md:p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="grid h-10 w-10 place-items-center rounded-lg bg-slate-100">
          <BarChart3 class="h-5 w-5 text-slate-700" />
        </div>
        <div>
          <h2 class="text-xl font-semibold text-slate-900">Distribution des sentiments</h2>
          <p class="text-sm text-slate-600">Total: {{ data.distribution.total.toLocaleString('fr-FR') }} avis</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="(item, idx) in sentimentItems"
          :key="item.key"
          :class="`rounded-2xl bg-gradient-to-br ${item.color} border border-white/60 p-6`"
        >
          <p class="text-sm font-medium text-slate-700 mb-2">{{ item.label }}</p>
          <p class="text-3xl font-bold text-slate-900">
            {{ data.distribution[item.key] }}
          </p>
          <p class="mt-2 text-sm font-semibold text-slate-600">
            {{ data.distribution.pourcentages[item.key] }}%
          </p>

          <div class="mt-4 h-2 rounded-full bg-white/70">
            <div
              class="h-2 rounded-full transition-all duration-500"
              :class="{
                'bg-emerald-500': idx === 0,
                'bg-amber-500': idx === 1,
                'bg-rose-500': idx === 2,
              }"
              :style="{ width: `${data.distribution.pourcentages[item.key]}%` }"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Reviews -->
    <section class="glass-panel section-enter rounded-3xl p-5 md:p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="grid h-10 w-10 place-items-center rounded-lg bg-slate-100">
          <TrendingUp class="h-5 w-5 text-slate-700" />
        </div>
        <div>
          <h2 class="text-xl font-semibold text-slate-900">Avis récents</h2>
          <p class="text-sm text-slate-600">Les {{ data.recent_reviews.length }} derniers retours clients</p>
        </div>
      </div>

      <div v-if="data.recent_reviews.length > 0" class="overflow-x-auto rounded-2xl border border-slate-200">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <th class="px-4 py-3 text-left font-semibold text-slate-700">Produit</th>
              <th class="px-4 py-3 text-left font-semibold text-slate-700">Avis</th>
              <th class="px-4 py-3 text-center font-semibold text-slate-700">Score</th>
              <th class="px-4 py-3 text-center font-semibold text-slate-700">Pred</th>
              <th class="px-4 py-3 text-center font-semibold text-slate-700">Sentiment</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr
              v-for="(review, idx) in data.recent_reviews"
              :key="idx"
              :class="[
                'transition-colors hover:bg-slate-50 border-l-4',
                {
                  'bg-emerald-50/40 border-emerald-500': review.sentiment?.toLowerCase().includes('positif'),
                  'bg-rose-50/40 border-rose-500': review.sentiment?.toLowerCase().includes('negatif'),
                  'bg-amber-50/40 border-amber-500': review.sentiment?.toLowerCase().includes('neutre'),
                  'bg-slate-50/40 border-slate-300': !review.sentiment,
                }
              ]"
            >
              <td class="px-4 py-3">
                <span class="font-mono text-xs font-semibold text-slate-700 bg-slate-100 rounded px-2 py-1">
                  {{ review.product_id || '-' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="line-clamp-2 text-slate-700 font-medium">{{ review.text }}</div>
                <p class="text-xs text-slate-500 mt-0.5">{{ review.summary }}</p>
              </td>
              <td class="px-4 py-3 text-center">
                <span class="inline-block bg-blue-100 text-blue-700 font-semibold rounded-lg px-2.5 py-1">
                  {{ review.score }}
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                <span class="inline-block bg-slate-200 text-slate-700 font-semibold rounded-lg px-2.5 py-1">
                  {{ review.prediction }}
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                <SentimentBadge :sentiment="review.sentiment" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="py-12 text-center text-slate-500">
        <p class="text-lg font-medium">Aucun avis récent à afficher.</p>
      </div>
    </section>
  </div>
</template>
