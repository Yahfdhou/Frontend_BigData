export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()
  const publicPaths = ['/', '/login', '/register']

  if (publicPaths.includes(to.path)) {
    return
  }

  if (!auth.token.value) {
    return navigateTo('/login')
  }

  if (auth.token.value && !auth.user.value) {
    await auth.getCurrentUser()
  }
})
