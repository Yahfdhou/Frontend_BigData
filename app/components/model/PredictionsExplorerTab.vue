<script setup lang="ts">
import { Flame, Lightbulb, Search, Smile, ThumbsUp } from 'lucide-vue-next'
import type { PredictResponse } from '~/types/api'

const api = useApi()

const {
  data: bestData,
  pending: bestPending,
} = await useAsyncData('best-predictions', () => api.getBestPredictions(8))

const {
  data: worstData,
  pending: worstPending,
} = await useAsyncData('worst-predictions', () => api.getWorstPredictions(8))

const {
  data: distributionData,
  pending: distributionPending,
} = await useAsyncData('sentiments-distribution', () => api.getSentimentsDistribution())

const isPending = computed(() => bestPending.value || worstPending.value || distributionPending.value)
const bestReviews = computed(() => bestData.value?.reviews ?? [])
const worstReviews = computed(() => worstData.value?.reviews ?? [])
const bestReviewsCount = computed(() => bestData.value?.count ?? bestReviews.value.length)
const worstReviewsCount = computed(() => worstData.value?.count ?? worstReviews.value.length)
const distribution = computed(() => distributionData.value)

// Search functionality
const searchText = ref('')
const summaryText = ref('')
const predictionMode = ref<'auto' | 'LogisticRegression_Weighted' | 'NaiveBayes'>('auto')
const predictionResult = ref<PredictResponse | null>(null)
const predictionError = ref<string | null>(null)
const searchPending = ref(false)

const handleSearch = async () => {
  if (!searchText.value.trim()) return

  searchPending.value = true
  predictionError.value = null
  predictionResult.value = null

  const cleanedText = searchText.value.trim()
  const cleanedSummary = summaryText.value.trim()
  const result = await api.predictSentiment({
    text: cleanedText,
    summary: cleanedSummary || undefined,
    modelName: predictionMode.value,
  })

  searchPending.value = false

  if (result) {
    if (result.status === 'success') {
      predictionResult.value = result
    } else {
      predictionError.value = result.message || result.error || 'Le backend a retourné une erreur de prédiction.'
    }
  } else {
    predictionError.value = 'Aucune reponse de prediction. Verifiez le backend.'
  }
}

const getSentimentColor = (sentiment: string) => {
  const lower = sentiment.toLowerCase()
  if (lower.includes('positif') || lower.includes('positive')) return 'emerald'
  if (lower.includes('negatif') || lower.includes('negative')) return 'rose'
  return 'amber'
}

const getSentimentTextClass = (sentiment: string) => {
  const color = getSentimentColor(sentiment)

  if (color === 'emerald') return 'text-emerald-600'
  if (color === 'rose') return 'text-rose-600'
  return 'text-amber-600'
}

const getSentimentIcon = (sentiment: string) => {
  const lower = sentiment.toLowerCase()
  if (lower.includes('positif') || lower.includes('positive')) return Smile
  if (lower.includes('negatif') || lower.includes('negative')) return Flame
  return Lightbulb
}

const confidencePercent = computed(() => {
  if (!predictionResult.value) {
    return 0
  }

  if (typeof predictionResult.value.confidence_percent === 'number') {
    return predictionResult.value.confidence_percent
  }

  return Math.round((predictionResult.value.confidence ?? 0) * 100)
})

const modelLabel = computed(() => {
  const model = predictionResult.value?.model_used ?? predictionMode.value

  if (model === 'LogisticRegression_Weighted') return 'LogisticRegression_Weighted'
  if (model === 'NaiveBayes') return 'NaiveBayes'
  if (model === 'auto') return 'Auto'

  return model || 'Unknown'
})

const availableModels = computed(() => predictionResult.value?.available_models ?? [])

const modelLinkedLabel = computed(() => (predictionResult.value?.model_linked ? 'Oui' : 'Non'))

const predictionDescription = computed(() => {
  if (!predictionResult.value) return ''

  const parts = [
    predictionResult.value.method,
    predictionResult.value.model_used ? `modèle ${predictionResult.value.model_used}` : '',
    predictionResult.value.summary ? `résumé: ${predictionResult.value.summary}` : '',
  ].filter(Boolean)

  return parts.join(' · ')
})

const backendErrorDetails = computed(() => {
  if (!predictionError.value) return ''

  const models = predictionResult.value?.available_models ?? []
  return models.length ? `Modèles disponibles: ${models.join(', ')}` : ''
})
</script>

<template>
  <div class="space-y-6">
    <!-- Search Section -->
    <div class="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
      <h3 class="mb-4 text-lg font-semibold text-slate-900">🔍 Prédire le Sentiment</h3>
      <div class="grid grid-cols-1 gap-3 lg:grid-cols-6">
        <textarea
          v-model="searchText"
          placeholder="Entrez un texte pour analyser son sentiment..."
          rows="3"
          maxlength="600"
          class="lg:col-span-4 resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        <div class="lg:col-span-2 space-y-2">
          <textarea
            v-model="summaryText"
            placeholder="Résumé optionnel..."
            rows="3"
            maxlength="300"
            class="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          <select
            v-model="predictionMode"
            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="auto">auto</option>
            <option value="LogisticRegression_Weighted">LogisticRegression_Weighted</option>
            <option value="NaiveBayes">NaiveBayes</option>
          </select>

          <button
            class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            :disabled="searchPending || !searchText.trim()"
            @click="handleSearch"
          >
            <Search class="h-4 w-4" />
            {{ searchPending ? 'Analyse...' : 'Analyser' }}
          </button>
        </div>
      </div>

      <div class="mt-2 flex items-center justify-between text-xs text-slate-500">
        <p>Modèle sélectionné: <span class="font-semibold text-slate-700">{{ predictionMode }}</span></p>
        <p>{{ searchText.length }}/600</p>
      </div>

      <div v-if="predictionError" class="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
        {{ predictionError }}
        <p v-if="backendErrorDetails" class="mt-1 text-xs text-rose-600">{{ backendErrorDetails }}</p>
      </div>

      <div v-if="predictionResult" class="mt-4 space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <div class="flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            Modèle: {{ modelLabel }}
          </span>
          <span
            class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
            :class="predictionResult.model_linked ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
          >
            Model linked: {{ modelLinkedLabel }}
          </span>
          <span
            v-if="!predictionResult.model_linked"
            class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
          >
            Mode secours local
          </span>
        </div>

        <p class="text-sm text-slate-600">{{ predictionResult.text }}</p>
        <p v-if="predictionResult.summary" class="text-sm text-slate-500">Résumé: {{ predictionResult.summary }}</p>

        <div class="flex flex-wrap items-center gap-3">
          <span class="text-3xl">{{ predictionResult.emoji }}</span>
          <component :is="getSentimentIcon(predictionResult.sentiment)" class="h-5 w-5" :class="getSentimentTextClass(predictionResult.sentiment)" />
          <span class="font-semibold text-slate-900">{{ predictionResult.sentiment }}</span>
          <span class="text-xs text-slate-500">Confiance: {{ confidencePercent.toFixed(1) }}%</span>
        </div>

        <p v-if="predictionDescription" class="text-xs text-slate-500">{{ predictionDescription }}</p>

        <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div class="rounded-lg bg-slate-50 p-3">
            <p class="text-xs text-slate-500">Prediction</p>
            <p class="mt-1 text-sm font-semibold text-slate-900">{{ predictionResult.prediction }}</p>
          </div>

          <div class="rounded-lg bg-slate-50 p-3">
            <p class="text-xs text-slate-500">Confidence %</p>
            <p class="mt-1 text-sm font-semibold text-slate-900">{{ confidencePercent.toFixed(1) }}%</p>
          </div>

          <div class="rounded-lg bg-slate-50 p-3">
            <p class="text-xs text-slate-500">Model used</p>
            <p class="mt-1 text-sm font-semibold text-slate-900">{{ predictionResult.model_used ?? '-' }}</p>
          </div>
        </div>

        <div v-if="availableModels.length" class="rounded-lg bg-slate-50 p-3">
          <p class="text-xs font-semibold text-slate-500">Available models</p>
          <p class="mt-1 text-sm text-slate-700">{{ availableModels.join(', ') }}</p>
        </div>

        <div v-if="predictionResult.example_similar" class="rounded-lg bg-sky-50 p-3">
          <p class="text-xs font-semibold text-sky-700">Exemple similaire</p>
          <p class="mt-1 text-sm text-sky-900">{{ predictionResult.example_similar }}</p>
        </div>

      </div>
    </div>

    <!-- Distribution Overview -->
    <div v-if="!isPending && distribution" class="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 class="mb-4 text-lg font-semibold text-slate-900">📊 Distribution des Sentiments</h3>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="rounded-xl border-2 border-rose-200 bg-rose-50 p-5">
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-rose-500/20 p-3">
              <Flame class="h-5 w-5 text-rose-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm text-rose-700">Négatifs</p>
              <p class="text-2xl font-bold text-rose-900">{{ distribution.distribution.negative.count.toLocaleString('fr-FR') }}</p>
              <p class="text-xs text-rose-600">{{ distribution.distribution.negative.percentage }}%</p>
            </div>
          </div>
        </div>

        <div class="rounded-xl border-2 border-amber-200 bg-amber-50 p-5">
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-amber-500/20 p-3">
              <Lightbulb class="h-5 w-5 text-amber-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm text-amber-700">Neutres</p>
              <p class="text-2xl font-bold text-amber-900">{{ distribution.distribution.neutral.count.toLocaleString('fr-FR') }}</p>
              <p class="text-xs text-amber-600">{{ distribution.distribution.neutral.percentage }}%</p>
            </div>
          </div>
        </div>

        <div class="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-5">
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-emerald-500/20 p-3">
              <Smile class="h-5 w-5 text-emerald-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm text-emerald-700">Positifs</p>
              <p class="text-2xl font-bold text-emerald-900">{{ distribution.distribution.positive.count.toLocaleString('fr-FR') }}</p>
              <p class="text-xs text-emerald-600">{{ distribution.distribution.positive.percentage }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Best & Worst Reviews -->
    <div v-if="!isPending" class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Best Reviews -->
      <div class="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6">
        <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold text-emerald-900">
          <ThumbsUp class="h-5 w-5" />
          Meilleur Avis
        </h3>
        <div v-if="bestReviews.length" class="space-y-3">
          <div
            v-for="(review, idx) in bestReviews"
            :key="idx"
            class="rounded-lg border border-emerald-200 bg-white/80 p-4 hover:bg-white transition"
          >
            <div class="flex items-start gap-3">
              <span class="text-xl">😊</span>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-slate-900 line-clamp-2">{{ review.Summary }}</p>
                <p class="mt-1 text-xs text-slate-600 line-clamp-2">{{ review.Text }}</p>
                <div class="mt-2 flex items-center gap-1 text-xs">
                  <span class="inline-block rounded bg-yellow-100 px-1.5 py-0.5 text-yellow-700">⭐ {{ review.Score }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="rounded-xl border border-dashed border-emerald-200 bg-white/70 p-4 text-sm text-emerald-800">
          L'endpoint a répondu avec {{ bestReviewsCount }} meilleur avis. Aucun avis positif n'est disponible pour l'instant.
        </div>
      </div>

      <!-- Worst Reviews -->
      <div class="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100/50 p-6">
        <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold text-rose-900">
          <Flame class="h-5 w-5" />
          Avis Critique
        </h3>
        <div v-if="worstReviews.length" class="space-y-3">
          <div
            v-for="(review, idx) in worstReviews"
            :key="idx"
            class="rounded-lg border border-rose-200 bg-white/80 p-4 hover:bg-white transition"
          >
            <div class="flex items-start gap-3">
              <span class="text-xl">😡</span>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-slate-900 line-clamp-2">{{ review.Summary }}</p>
                <p class="mt-1 text-xs text-slate-600 line-clamp-2">{{ review.Text }}</p>
                <div class="mt-2 flex items-center gap-1 text-xs">
                  <span class="inline-block rounded bg-red-100 px-1.5 py-0.5 text-red-700">⭐ {{ review.Score }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="rounded-xl border border-dashed border-rose-200 bg-white/70 p-4 text-sm text-rose-800">
          L'endpoint a répondu avec {{ worstReviewsCount }} avis critiques. Aucun avis critique n'est disponible pour l'instant.
        </div>
      </div>
    </div>
  </div>
</template>
