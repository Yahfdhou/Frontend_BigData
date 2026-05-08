<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
  type ChartOptions,
} from 'chart.js'
import { BadgeCheck, CircleUserRound, UserCheck, Users, UserX } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

ChartJS.register(ArcElement, BarElement, CategoryScale, Legend, LinearScale, Tooltip)

interface UserItem {
  id: string
  username: string
  email: string
  full_name?: string
  role?: string
  is_active?: boolean
  created_at?: string
  last_login?: string | null
}

const auth = useAuth()
const users = ref<UserItem[]>([])
const loading = ref(false)

const load = async () => {
  loading.value = true
  users.value = await auth.fetchUsers()
  loading.value = false
}

onMounted(() => {
  load()
})

const totalUsers = computed(() => users.value.length)
const activeUsers = computed(() => users.value.filter((user) => user.is_active !== false).length)
const inactiveUsers = computed(() => Math.max(0, totalUsers.value - activeUsers.value))

const chartData = computed(() => ({
  labels: ['Active', 'Inactive'],
  datasets: [
    {
      data: [activeUsers.value, inactiveUsers.value],
      backgroundColor: ['rgba(16, 185, 129, 0.85)', 'rgba(148, 163, 184, 0.72)'],
      borderColor: ['rgb(16, 185, 129)', 'rgb(148, 163, 184)'],
      borderWidth: 2,
      hoverOffset: 10,
    },
  ],
}))

const statusBarData = computed(() => ({
  labels: ['Active', 'Inactive'],
  datasets: [
    {
      label: 'Users',
      data: [activeUsers.value, inactiveUsers.value],
      backgroundColor: ['rgba(14, 165, 233, 0.75)', 'rgba(203, 213, 225, 0.9)'],
      borderRadius: 12,
      borderWidth: 0,
    },
  ],
}))

const doughnutOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: 'rgb(71, 85, 105)',
        usePointStyle: true,
        padding: 20,
      },
    },
  },
}

const barOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(15, 23, 42, 0.06)' },
      ticks: { color: 'rgb(100, 116, 139)' },
    },
    x: {
      grid: { display: false },
      ticks: { color: 'rgb(100, 116, 139)' },
    },
  },
}

const avatarInitial = (user: UserItem) => (user.username || user.full_name || 'U').trim().charAt(0).toUpperCase() || 'U'
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-8 py-8">
    <section class="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 p-4 shadow-lg shadow-slate-100">
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div class="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
            <Users class="h-4 w-4" />
            Registered Users
          </div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">People using the app</h1>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            A modern overview of your registered users, their activity, and the distribution of active accounts.
          </p>
        </div>

        <button class="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700" @click="load">
          Refresh data
        </button>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/70">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Total users</p>
            <p class="mt-2 text-3xl font-black text-slate-900">{{ totalUsers }}</p>
          </div>
          <div class="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
            <Users class="h-5 w-5" />
          </div>
        </div>
      </article>

      <article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/70">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Active users</p>
            <p class="mt-2 text-3xl font-black text-emerald-600">{{ activeUsers }}</p>
          </div>
          <div class="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
            <UserCheck class="h-5 w-5" />
          </div>
        </div>
      </article>

      <article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/70">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Inactive users</p>
            <p class="mt-2 text-3xl font-black text-slate-600">{{ inactiveUsers }}</p>
          </div>
          <div class="rounded-2xl bg-slate-100 p-3 text-slate-600">
            <UserX class="h-5 w-5" />
          </div>
        </div>
      </article>

      <article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/70">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Verified flow</p>
            <p class="mt-2 text-3xl font-black text-indigo-600">100%</p>
          </div>
          <div class="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
            <BadgeCheck class="h-5 w-5" />
          </div>
        </div>
      </article>
    </section>

    <section class="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
        <div class="mb-5 flex items-center gap-3">
          <div class="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
            <CircleUserRound class="h-5 w-5" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-slate-900">User activity split</h3>
            <p class="text-sm text-slate-500">Active vs inactive accounts</p>
          </div>
        </div>
        <div class="relative h-[20rem]">
          <Doughnut :data="chartData" :options="doughnutOptions" />
        </div>
      </div>

      <div class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
        <div class="mb-5 flex items-center gap-3">
          <div class="rounded-2xl bg-indigo-50 p-3 text-indigo-700">
            <Users class="h-5 w-5" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-slate-900">Users chart</h3>
            <p class="text-sm text-slate-500">Quick visual overview of account states</p>
          </div>
        </div>
        <div class="relative h-[20rem]">
          <Bar :data="statusBarData" :options="barOptions" />
        </div>
      </div>
    </section>

    <section class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
      <div class="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 class="text-lg font-semibold text-slate-900">Registered users</h3>
          <p class="text-sm text-slate-500">Each person sees the first letter of their username automatically.</p>
        </div>
        <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {{ totalUsers }} accounts
        </span>
      </div>

      <div v-if="loading" class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
        Loading users...
      </div>

      <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article v-for="user in users" :key="user.id" class="group rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <div class="mb-4 flex items-start gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-sm font-bold text-white shadow-lg shadow-cyan-100">
              {{ avatarInitial(user) }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-base font-semibold text-slate-900">{{ user.full_name || user.username }}</p>
              <p class="truncate text-sm text-slate-500">@{{ user.username }}</p>
            </div>
            <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="user.is_active !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'">
              {{ user.is_active !== false ? 'active' : 'inactive' }}
            </span>
          </div>

          <div class="space-y-2 text-sm text-slate-600">
            <p class="truncate"><span class="font-medium text-slate-900">Email:</span> {{ user.email }}</p>
            <p><span class="font-medium text-slate-900">Role:</span> {{ user.role || 'user' }}</p>
            <p class="truncate"><span class="font-medium text-slate-900">Last login:</span> {{ user.last_login || 'never' }}</p>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
