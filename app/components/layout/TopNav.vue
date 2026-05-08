<script setup lang="ts">
import { Activity, BarChart3, ChevronDown, Database, Eye, LogOut, PieChart, Zap, Search } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/online', label: 'Online Stream', icon: Activity },
  { to: '/offline', label: 'Offline Insights', icon: Database },
  { to: '/sentiments', label: 'Sentiments', icon: PieChart },
  { to: '/model', label: 'Model', icon: Zap },
  { to: '/predictions', label: 'Predictions', icon: Search },
  { to: '/samples', label: 'Samples', icon: Eye },
  { to: '/users', label: 'Users', icon: BarChart3 },
]

const isActive = (path: string) => route.path === path
const auth = useAuth()
const open = ref(false)
const toggle = () => (open.value = !open.value)
const logout = async () => {
  console.log('TopNav.logout clicked')
  await auth.logout()
}

const profileInitial = computed(() => {
  console.log('profileInitial computed:', {
    user: auth.user.value,
    username: auth.user.value?.username,
    full_name: auth.user.value?.full_name,
  })
  
  const name = auth.user.value?.full_name || auth.user.value?.username || 'U'
  const trimmed = name.trim()
  const initial = trimmed.charAt(0).toUpperCase() || 'U'
  
  console.log('Profile initial result:', initial)
  return initial
})
</script>

<template>
  <header class="sticky top-0 z-40 px-4 pt-4 md:px-6 lg:px-8">
    <div
      class="glass-panel section-enter flex w-full flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/70 px-4 py-3 md:px-6"
    >
      <div class="flex min-w-0 items-center gap-3">
        <img
          src="/project-brand.svg"
          alt="Système de Revue Intelligente"
          class="h-16 w-[18rem] max-w-[52vw] shrink-0 object-contain drop-shadow-sm md:h-[4.5rem] md:w-[24rem]"
        >
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Amazon Reviews
          </p>
          <p class="truncate text-lg font-semibold leading-tight text-slate-900">
            Sentiment Intelligence
          </p>
        </div>
      </div>

      <nav class="flex items-center gap-2 overflow-x-auto rounded-2xl bg-slate-100/70 p-1">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-300"
          :class="
            isActive(link.to)
              ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
              : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
          "
        >
          <component :is="link.icon" class="h-4 w-4" />
          <span>{{ link.label }}</span>
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-3">
        <template v-if="auth.user">
          <div class="relative">
            <button @click="toggle" class="flex h-10 items-center gap-2 rounded-full bg-white/80 px-2.5 py-1.5 text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-white">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 text-sm font-bold text-white shadow-sm">
                {{ profileInitial }}
              </span>
              <ChevronDown class="h-4 w-4 text-slate-500" />
            </button>

            <div v-if="open" class="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl shadow-slate-200/70 backdrop-blur-xl">
              <div class="mb-3 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-slate-50 to-cyan-50 p-3">
                <div class="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 text-sm font-bold text-white shadow-md">
                  {{ profileInitial }}
                </div>
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold text-slate-900">{{ auth.user.value?.full_name || auth.user.value?.username }}</p>
                  <p class="truncate text-xs text-slate-500">@{{ auth.user.value?.username }}</p>
                </div>
              </div>

              <div class="space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600">
                <p class="truncate"><span class="font-medium text-slate-900">Email:</span> {{ auth.user.value?.email }}</p>
                <p class="truncate"><span class="font-medium text-slate-900">Role:</span> {{ auth.user.value?.role || 'user' }}</p>
                <p class="truncate"><span class="font-medium text-slate-900">Status:</span> {{ auth.user.value?.is_active ? 'active' : 'inactive' }}</p>
              </div>

              <button @click="logout" class="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-red-700">
                <LogOut class="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </template>

        <template v-else>
          <NuxtLink to="/login" class="text-sm font-medium text-slate-700 hover:text-slate-900">Login</NuxtLink>
          <NuxtLink to="/register" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">Sign up</NuxtLink>
        </template>
      </div>
    </div>
  </header>
</template>
