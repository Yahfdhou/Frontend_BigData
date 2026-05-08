<script setup lang="ts">
import TopNav from '~/components/layout/TopNav.vue'

const route = useRoute()
const hideTopNav = computed(() => ['/login', '/register'].includes(route.path))
</script>

<template>
  <div class="min-h-screen pb-10">
    <TopNav v-if="!hideTopNav" />

    <main class="mt-6 w-full px-4 md:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>
