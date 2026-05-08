<template>
  <div>
    <NuxtLoadingIndicator :height="3" color="var(--color-accent)" />
    <NuxtRouteAnnouncer />
    <NotificationStack />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
