<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Eye, EyeOff, LockKeyhole, Mail, Sparkles, UserRound } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'auth',
})

const auth = useAuth()
const { push } = useNotifications()

const form = reactive({
  identifier: '',
  password: '',
})

const loading = ref(false)
const revealPassword = ref(false)

const errors = computed(() => {
  const output: Record<string, string> = {}

  if (!form.identifier.trim()) {
    output.identifier = 'Email ou nom d’utilisateur requis.'
  }

  if (!form.password.trim()) {
    output.password = 'Mot de passe requis.'
  } else if (form.password.trim().length < 6) {
    output.password = 'Le mot de passe doit contenir au moins 6 caractères.'
  }

  return output
})

const canSubmit = computed(() => Object.keys(errors.value).length === 0 && !loading.value)

const submit = async () => {
  if (!canSubmit.value) {
    push({
      title: 'Formulaire incomplet',
      message: 'Vérifie les champs avant de continuer.',
      kind: 'warning',
    })
    return
  }

  loading.value = true

  try {
    const res = await auth.login({ identifier: form.identifier.trim(), password: form.password })

    if (res?.access_token) {
      // Fetch current user to ensure full user data is stored
      await auth.getCurrentUser()
      
      push({
        title: 'Connexion réussie',
        message: 'Bienvenue sur le dashboard.',
        kind: 'success',
      })
      await navigateTo('/dashboard')
      return
    }

    push({
      title: 'Connexion refusée',
      message: res?.message || 'Identifiants invalides.',
      kind: 'error',
    })
  } catch (err: any) {
    push({
      title: 'Erreur réseau',
      message: err?.message || 'Impossible de joindre le serveur.',
      kind: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-indigo-50 py-8">
    <!-- Animated gradient background for Big Data -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-1/2 -right-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-blue-300/20 to-indigo-300/15 blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-1/3 -left-1/4 h-80 w-80 rounded-full bg-gradient-to-tr from-purple-300/20 to-pink-300/15 blur-3xl animate-pulse" style="animation-delay: 2s"></div>
      <div class="absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-gradient-to-b from-cyan-300/15 to-blue-300/10 blur-3xl" style="animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; animation-delay: 1s"></div>
    </div>

    <!-- Grid background pattern -->
    <div class="absolute inset-0 bg-[linear-gradient(90deg,_rgba(148,163,184,0.08)_1px,_transparent_1px),linear-gradient(0deg,_rgba(148,163,184,0.08)_1px,_transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

    <!-- Content -->
    <div class="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-md items-center justify-center">
      <section class="w-full">
      <div class="rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-2xl shadow-slate-200/70 backdrop-blur-xl">
        <div class="mb-6 flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-lg shadow-cyan-100">
            <UserRound class="h-6 w-6" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-slate-900">Sign in</h2>
            <p class="text-sm text-slate-500">Enter your email or username and password.</p>
          </div>
        </div>

        <form class="space-y-4" @submit.prevent="submit">
          <label class="block">
            <span class="mb-1.5 block text-sm font-medium text-slate-700">Email or username</span>
            <div class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-indigo-400 focus-within:bg-white">
              <Mail class="h-4 w-4 text-slate-400" />
              <input
                v-model="form.identifier"
                type="text"
                autocomplete="username"
                placeholder="ahmed@example.com"
                class="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              >
            </div>
            <p v-if="errors.identifier" class="mt-1.5 text-xs font-medium text-rose-600">{{ errors.identifier }}</p>
          </label>

          <label class="block">
            <span class="mb-1.5 block text-sm font-medium text-slate-700">Password</span>
            <div class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-indigo-400 focus-within:bg-white">
              <LockKeyhole class="h-4 w-4 text-slate-400" />
              <input
                v-model="form.password"
                :type="revealPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••"
                class="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              >
              <button type="button" class="rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" @click="revealPassword = !revealPassword">
                <component :is="revealPassword ? EyeOff : Eye" class="h-4 w-4" />
              </button>
            </div>
            <p v-if="errors.password" class="mt-1.5 text-xs font-medium text-rose-600">{{ errors.password }}</p>
          </label>

          <button
            type="submit"
            :disabled="!canSubmit"
            class="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-100 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span v-if="!loading">Sign in</span>
            <span v-else>Signing in...</span>
          </button>
        </form>

        <p class="mt-5 text-center text-sm text-slate-600">
          Don’t have an account?
          <NuxtLink to="/register" class="font-semibold text-indigo-600 transition hover:text-indigo-700">Sign up</NuxtLink>
        </p>
      </div>
      </section>
    </div>
  </div>
</template>
