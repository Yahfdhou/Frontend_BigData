<script setup lang="ts">
import { ChevronDown, ChevronUp, Eye } from 'lucide-vue-next'
import type { PredictionsSampleResponse } from '~/types/api'

const api = useApi()

const {
  data: samplesData,
  pending: samplesPending,
  refresh,
} = await useAsyncData('predictions-sample', () => api.getPredictionsSample(50))

const samples = computed(() => samplesData.value?.samples ?? [])

const expandedId = ref<string | null>(null)

const toggleExpand = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id
}

const getSentimentColor = (prediction: number) => {
  if (prediction === 0) return 'rose'
  if (prediction === 1) return 'amber'
  return 'emerald'
}

const getSentimentLabel = (prediction: number) => {
  if (prediction === 0) return 'Négatif'
  if (prediction === 1) return 'Neutre'
  return 'Positif'
}

const getSentimentEmoji = (prediction: number) => {
  if (prediction === 0) return '😡'
  if (prediction === 1) return '😐'
  return '😊'
}

const getAccuracy = (label: number, prediction: number) => {
  return label === prediction ? 'correcte' : 'incorrecte'
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between rounded-lg bg-slate-100 p-4">
      <p class="text-sm font-medium text-slate-700">
        {{ samples.length }} prédictions chargées
      </p>
      <button
        class="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
        :disabled="samplesPending"
        @click="refresh()"
      >
        Rafraîchir
      </button>
    </div>

    <div v-if="samplesPending" class="rounded-lg bg-slate-50 p-8 text-center text-slate-600">
      Chargement des échantillons...
    </div>

    <div v-else-if="samples.length === 0" class="rounded-lg bg-amber-50 p-6 text-center text-amber-700">
      Aucune prédiction trouvée
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="sample in samples"
        :key="sample.Id"
        class="rounded-lg border border-slate-200 bg-white transition hover:border-slate-300"
      >
        <!-- Header -->
        <div
          class="flex cursor-pointer items-center gap-4 p-4 hover:bg-slate-50"
          @click="toggleExpand(sample.Id)"
        >
          <button class="text-slate-400 hover:text-slate-600">
            <ChevronDown v-if="expandedId !== sample.Id" class="h-5 w-5" />
            <ChevronUp v-else class="h-5 w-5" />
          </button>

          <!-- Main Info -->
          <div class="flex-1 min-w-0">
            <p class="font-medium text-slate-900 line-clamp-1">{{ sample.Summary }}</p>
            <p class="mt-1 text-xs text-slate-500">ID: {{ sample.Id }}</p>
          </div>

          <!-- Score & Sentiment -->
          <div class="flex items-center gap-3">
            <div class="text-center">
              <div class="text-xl font-bold text-yellow-600">⭐ {{ sample.Score }}</div>
            </div>

            <!-- Prediction Badge -->
            <div
              class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
              :class="{
                'bg-rose-100 text-rose-700': getSentimentColor(sample.prediction) === 'rose',
                'bg-amber-100 text-amber-700': getSentimentColor(sample.prediction) === 'amber',
                'bg-emerald-100 text-emerald-700': getSentimentColor(sample.prediction) === 'emerald',
              }"
            >
              {{ getSentimentEmoji(sample.prediction) }} {{ sample.prediction_str }}
            </div>

            <!-- Label Badge -->
            <div
              class="inline-flex rounded-full px-2 py-1 text-xs font-semibold"
              :class="{
                'bg-green-100 text-green-700': getAccuracy(sample.label, sample.prediction) === 'correcte',
                'bg-red-100 text-red-700': getAccuracy(sample.label, sample.prediction) === 'incorrecte',
              }"
            >
              {{ getAccuracy(sample.label, sample.prediction) === 'correcte' ? '✓' : '✗' }}
            </div>
          </div>
        </div>

        <!-- Expanded Content -->
        <transition
          enter-active-class="transition duration-200"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-96"
          leave-active-class="transition duration-200"
          leave-from-class="opacity-100 max-h-96"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-show="expandedId === sample.Id" class="space-y-3 border-t border-slate-200 bg-slate-50 p-4">
            <!-- Full Text -->
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-slate-500">Texte Complet</p>
              <p class="mt-2 text-sm leading-relaxed text-slate-700">{{ sample.Text }}</p>
            </div>

            <!-- Predictions Comparison -->
            <div class="grid grid-cols-2 gap-4">
              <div class="rounded-lg bg-white p-3">
                <p class="text-xs font-semibold text-slate-500">Étiquette</p>
                <p class="mt-2 text-sm font-semibold text-slate-900">{{ sample.label_str }}</p>
              </div>
              <div class="rounded-lg bg-white p-3">
                <p class="text-xs font-semibold text-slate-500">Prédiction</p>
                <p class="mt-2 text-sm font-semibold text-slate-900">{{ sample.prediction_str }}</p>
              </div>
            </div>

            <!-- Footer Info -->
            <div class="flex items-center justify-between border-t border-slate-200 pt-3">
              <p class="text-xs text-slate-500">
                <Eye class="inline h-3 w-3" /> Score de confiance détecté: {{ sample.Score }}
              </p>
              <span
                class="inline-block rounded-full px-2 py-1 text-xs font-semibold"
                :class="{
                  'bg-emerald-100 text-emerald-700': getAccuracy(sample.label, sample.prediction) === 'correcte',
                  'bg-red-100 text-red-700': getAccuracy(sample.label, sample.prediction) === 'incorrecte',
                }"
              >
                {{ getAccuracy(sample.label, sample.prediction) }}
              </span>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
