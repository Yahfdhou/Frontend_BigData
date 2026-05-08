<script setup lang="ts">
import type { Component } from 'vue'

const props = defineProps<{
  label: string
  value: number
  icon: Component
  tone: 'teal' | 'sky' | 'amber' | 'rose' | 'slate'
  caption: string
}>()

const toneClass = computed(() => {
  const toneMap = {
    teal: {
      surface: 'from-emerald-50 to-teal-50/70 border-emerald-100',
      icon: 'from-emerald-500/20 to-teal-500/10 text-emerald-700',
      accent: 'bg-emerald-500',
    },
    sky: {
      surface: 'from-sky-50 to-cyan-50/70 border-sky-100',
      icon: 'from-sky-500/20 to-cyan-500/10 text-sky-700',
      accent: 'bg-sky-500',
    },
    amber: {
      surface: 'from-amber-50 to-orange-50/70 border-amber-100',
      icon: 'from-amber-500/20 to-orange-500/10 text-amber-700',
      accent: 'bg-amber-500',
    },
    rose: {
      surface: 'from-rose-50 to-pink-50/70 border-rose-100',
      icon: 'from-rose-500/20 to-pink-500/10 text-rose-700',
      accent: 'bg-rose-500',
    },
    slate: {
      surface: 'from-slate-50 to-slate-100/70 border-slate-200',
      icon: 'from-slate-500/20 to-slate-400/10 text-slate-700',
      accent: 'bg-slate-500',
    },
  }

  return toneMap[props.tone]
})
</script>

<template>
  <article
    class="section-enter overflow-hidden rounded-3xl border bg-gradient-to-br p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    :class="toneClass.surface"
  >
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          {{ label }}
        </p>
        <p class="mt-2 text-3xl font-semibold text-slate-900">
          {{ value.toLocaleString('fr-FR') }}
        </p>
        <p class="mt-1 text-sm text-slate-600">{{ caption }}</p>
      </div>

      <div
        class="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br"
        :class="toneClass.icon"
      >
        <component :is="icon" class="h-5 w-5" />
      </div>
    </div>

    <div class="mt-4 h-1.5 w-full rounded-full bg-white/80">
      <div class="h-1.5 rounded-full" :class="toneClass.accent" />
    </div>
  </article>
</template>
