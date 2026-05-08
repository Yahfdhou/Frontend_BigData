<script setup lang="ts">
import { ThumbsUp, Minus, ThumbsDown } from 'lucide-vue-next'

const props = defineProps<{
  sentiment: string
}>()

const sentimentData = computed(() => {
  // Normalize text: lowercase and remove diacritics so 'Négatif' -> 'negatif'
  const raw = String(props.sentiment || '')
  const value = raw.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')

  // Fallback checks covering French and English words
  if (value.includes('positif') || value.includes('positive')) {
    return {
      icon: ThumbsUp,
      class: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      label: 'Positif',
    }
  }

  if (value.includes('negatif') || value.includes('negative')) {
    return {
      icon: ThumbsDown,
      class: 'bg-rose-100 text-rose-700 border border-rose-200',
      label: 'Négatif',
    }
  }

  return {
    icon: Minus,
    class: 'bg-amber-100 text-amber-700 border border-amber-200',
    label: 'Neutre',
  }
})

// Debug: اطبع البيانات في console للتحقق
watch(
  () => props.sentiment,
  (newVal) => {
    if (newVal) {
      console.log('Sentiment value:', newVal, 'Normalized:', sentimentData.value.label)
    }
  },
  { immediate: true },
)
</script>

<template>
  <span
    class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
    :class="sentimentData.class"
  >
    <component :is="sentimentData.icon" class="h-4 w-4" />
    <span>{{ sentimentData.label }}</span>
  </span>
</template>
