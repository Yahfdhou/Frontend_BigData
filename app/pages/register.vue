<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Eye, EyeOff, Mail, Sparkles, UserPlus, UserRound, LockKeyhole, IdCard } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'auth',
})

const auth = useAuth()
const { push } = useNotifications()

const form = reactive({
  full_name: '',
  username: '',
  email: '',
  password: '',
})

const loading = ref(false)
const revealPassword = ref(false)

const errors = computed(() => {
  const output: Record<string, string> = {}

  if (!form.full_name.trim() || form.full_name.trim().length < 2) {
    output.full_name = 'Le nom complet doit contenir au moins 2 caractères.'
  }

  if (!form.username.trim() || form.username.trim().length < 3) {
    output.username = 'Le nom d’utilisateur doit contenir au moins 3 caractères.'
  }

  if (!form.email.trim()) {
    output.email = 'Adresse email requise.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    output.email = 'Adresse email invalide.'
  }

  if (!form.password.trim()) {
    output.password = 'Mot de passe requis.'
  } else if (form.password.trim().length < 8) {
    output.password = 'Le mot de passe doit contenir au moins 8 caractères.'
  }

  return output
})

const canSubmit = computed(() => Object.keys(errors.value).length === 0 && !loading.value)

const submit = async () => {
  if (!canSubmit.value) {
    push({
      title: 'Formulaire incomplet',
      message: 'Corrige les champs avant de créer le compte.',
      kind: 'warning',
    })
    return
  }

  loading.value = true

  try {
    const res = await auth.register({
      full_name: form.full_name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
    })

    if (res?.access_token) {
      push({
        title: 'Compte créé',
        message: 'Votre compte est prêt. Connectez-vous maintenant.',
        kind: 'success',
      })

      await navigateTo('/login')
      return
    }

    push({
      title: 'Inscription refusée',
      message: res?.message || 'Impossible de créer le compte.',
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
      <section class="w-full overflow-hidden rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-2xl shadow-slate-200/70 backdrop-blur-xl">
      <div class="mb-6 flex items-center gap-3">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-100">
          <UserPlus class="h-6 w-6" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Create account</h2>
          <p class="text-sm text-slate-500">Create your profile and access the dashboard.</p>
        </div>
      </div>

      <form class="space-y-4" @submit.prevent="submit">
        <label class="block">
          <span class="mb-1.5 block text-sm font-medium text-slate-700">Full name</span>
          <div class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-cyan-400 focus-within:bg-white">
            <IdCard class="h-4 w-4 text-slate-400" />
            <input v-model="form.full_name" type="text" autocomplete="name" placeholder="Ahmed Ali" class="w-full bg-transparent text-sm outline-none placeholder:text-slate-400">
          </div>
          <p v-if="errors.full_name" class="mt-1.5 text-xs font-medium text-rose-600">{{ errors.full_name }}</p>
        </label>

        <label class="block">
          <span class="mb-1.5 block text-sm font-medium text-slate-700">Username</span>
          <div class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-cyan-400 focus-within:bg-white">
            <UserRound class="h-4 w-4 text-slate-400" />
            <input v-model="form.username" type="text" autocomplete="username" placeholder="ahmed123" class="w-full bg-transparent text-sm outline-none placeholder:text-slate-400">
          </div>
          <p v-if="errors.username" class="mt-1.5 text-xs font-medium text-rose-600">{{ errors.username }}</p>
        </label>

        <label class="block">
          <span class="mb-1.5 block text-sm font-medium text-slate-700">Email</span>
          <div class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-cyan-400 focus-within:bg-white">
            <Mail class="h-4 w-4 text-slate-400" />
            <input v-model="form.email" type="email" autocomplete="email" placeholder="ahmed@example.com" class="w-full bg-transparent text-sm outline-none placeholder:text-slate-400">
          </div>
          <p v-if="errors.email" class="mt-1.5 text-xs font-medium text-rose-600">{{ errors.email }}</p>
        </label>

        <label class="block">
          <span class="mb-1.5 block text-sm font-medium text-slate-700">Password</span>
          <div class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-cyan-400 focus-within:bg-white">
            <LockKeyhole class="h-4 w-4 text-slate-400" />
            <input v-model="form.password" :type="revealPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="Minimum 8 characters" class="w-full bg-transparent text-sm outline-none placeholder:text-slate-400">
            <button type="button" class="rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" @click="revealPassword = !revealPassword">
              <component :is="revealPassword ? EyeOff : Eye" class="h-4 w-4" />
            </button>
          </div>
          <p v-if="errors.password" class="mt-1.5 text-xs font-medium text-rose-600">{{ errors.password }}</p>
        </label>

        <button
          type="submit"
          :disabled="!canSubmit"
          class="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-100 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span v-if="!loading">Create account</span>
          <span v-else>Creating...</span>
        </button>
      </form>

      <p class="mt-5 text-center text-sm text-slate-600">
        Already have an account?
        <NuxtLink to="/login" class="font-semibold text-indigo-600 transition hover:text-indigo-700">Sign in</NuxtLink>
      </p>
      </section>
    </div>
  </div>
</template>
