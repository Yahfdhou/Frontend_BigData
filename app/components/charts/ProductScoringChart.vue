<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import type { NormalizedPrediction, ProductScoringResponse } from '~/types/api'

ChartJS.register(ArcElement, Legend, Tooltip)

const props = defineProps<{
  records: NormalizedPrediction[]
}>()

const api = useApi()

const productIds = computed(() => {
  return Array.from(new Set(
    props.records
      .map(record => record.productId)
      .filter((productId): productId is string => Boolean(productId)),
  )).sort()
})

const apiProducts = ref<string[]>([])

const combinedProductIds = computed(() => {
  const set = new Set<string>([...productIds.value])
  apiProducts.value.forEach(p => set.add(p))
  return Array.from(set).sort()
})

const selectedProductId = ref('')
const productScoring = ref<ProductScoringResponse | null>(null)
const loading = ref(false)
const loadError = ref('')

const loadProductScoring = async () => {
  if (!selectedProductId.value) {
    productScoring.value = null
    return
  }

  loading.value = true
  loadError.value = ''

  try {
    productScoring.value = await api.getProductScoring(selectedProductId.value)
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : 'Erreur inconnue'
    productScoring.value = null
  } finally {
    loading.value = false
  }
}

const loadApiProducts = async () => {
  try {
    const res = await api.getProducts()
    if (!res) return
    // res may be array of strings or objects {product_id: ...}
    if (Array.isArray(res)) {
      apiProducts.value = res.map((r: any) => typeof r === 'string' ? r : (r.product_id || r.id || ''))
        .filter(Boolean)
    }
  } catch (e) {
    // ignore - api client already logs
  }
}

watch(combinedProductIds, (ids) => {
  if (!selectedProductId.value && ids.length > 0) {
    selectedProductId.value = ids[0]
  }
}, { immediate: true })

watch(selectedProductId, async (value) => {
  if (!value) return
  await loadProductScoring()
}, { immediate: true })

onMounted(async () => {
  await loadApiProducts()
})

const chartData = computed<ChartData<'doughnut'>>(() => {
  const scoring = productScoring.value

  return {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [
          scoring?.sentiments?.positive ?? 0,
          scoring?.sentiments?.neutral ?? 0,
          scoring?.sentiments?.negative ?? 0,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.82)',
          'rgba(245, 158, 11, 0.82)',
          'rgba(239, 68, 68, 0.82)',
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  }
})

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: 'rgb(71, 85, 105)',
        usePointStyle: true,
      },
    },
  },
}
</script>

<template>
  <section class="glass-panel section-enter rounded-3xl p-5 md:p-6">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-xl font-semibold text-slate-900">Scoring relatif au produit</h2>
        <p class="text-sm text-slate-600">Source: /api/product-scoring/&lt;product_id&gt;</p>
      </div>

      <select
        v-model="selectedProductId"
        class="min-w-56 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-sky-400"
      >
        <option v-for="productId in combinedProductIds" :key="productId" :value="productId">
          {{ productId }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="flex h-[320px] items-center justify-center rounded-2xl border border-slate-200 bg-white/70 text-sm text-slate-500">
      Chargement du scoring...
    </div>

    <div v-else-if="loadError && !productScoring" class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
      Impossible de charger le scoring du produit.
    </div>

    <div v-else-if="selectedProductId && productScoring" class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <div class="h-[320px] rounded-2xl border border-slate-200 bg-white/70 p-3">
        <Doughnut :data="chartData" :options="chartOptions" />
      </div>

      <div class="grid gap-3 content-start rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <div class="rounded-xl bg-white p-4 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">ProductId</p>
          <p class="mt-1 break-all text-lg font-semibold text-slate-900">{{ productScoring.product_id }}</p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-xl bg-emerald-50 p-4">
            <p class="text-xs font-semibold uppercase text-emerald-700">Positive</p>
            <p class="mt-1 text-2xl font-bold text-emerald-800">{{ productScoring.sentiments.positive }}</p>
          </div>
          <div class="rounded-xl bg-amber-50 p-4">
            <p class="text-xs font-semibold uppercase text-amber-700">Neutral</p>
            <p class="mt-1 text-2xl font-bold text-amber-800">{{ productScoring.sentiments.neutral }}</p>
          </div>
          <div class="rounded-xl bg-rose-50 p-4">
            <p class="text-xs font-semibold uppercase text-rose-700">Negative</p>
            <p class="mt-1 text-2xl font-bold text-rose-800">{{ productScoring.sentiments.negative }}</p>
          </div>
          <div class="rounded-xl bg-slate-100 p-4">
            <p class="text-xs font-semibold uppercase text-slate-600">Average score</p>
            <p class="mt-1 text-2xl font-bold text-slate-900">{{ productScoring.average_score }}</p>
          </div>
        </div>

        <p class="text-sm text-slate-500">
          Total: {{ productScoring.total_reviews }} avis
        </p>
      </div>
    </div>

    <div v-else-if="selectedProductId" class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
      Aucun scoring détaillé n'a été retourné pour ce produit.
    </div>

    <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
      Aucun ProductId disponible pour générer le scoring.
    </div>
  </section>
</template>
