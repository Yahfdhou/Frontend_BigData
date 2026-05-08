<script setup lang="ts">
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-vue-next'

const { items, remove } = useNotifications()

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
} as const

const styles = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900 shadow-emerald-100/70',
  error: 'border-rose-200 bg-rose-50 text-rose-900 shadow-rose-100/70',
  warning: 'border-amber-200 bg-amber-50 text-amber-900 shadow-amber-100/70',
  info: 'border-sky-200 bg-sky-50 text-sky-900 shadow-sky-100/70',
} as const
</script>

<template>
  <div class="pointer-events-none fixed bottom-4 left-4 right-4 z-50 flex flex-col gap-3 md:bottom-6 md:left-6 md:right-auto md:w-[min(28rem,calc(100vw-3rem))]">
    <TransitionGroup name="toast" tag="div" class="flex flex-col gap-3">
      <article
        v-for="item in items"
        :key="item.id"
        class="pointer-events-auto overflow-hidden rounded-2xl border backdrop-blur-xl shadow-2xl transition-all"
        :class="styles[item.kind]"
      >
        <div class="flex items-start gap-3 p-4">
          <div class="mt-0.5 rounded-full bg-white/70 p-2 shadow-sm">
            <component :is="icons[item.kind]" class="h-5 w-5" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold leading-5">{{ item.title }}</p>
            <p v-if="item.message" class="mt-1 text-sm/5 opacity-80">{{ item.message }}</p>
          </div>
          <button type="button" class="rounded-full p-1.5 opacity-60 transition hover:opacity-100" @click="remove(item.id)">
            <X class="h-4 w-4" />
          </button>
        </div>
      </article>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 220ms ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}
</style>
