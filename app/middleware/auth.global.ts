export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()
  const publicPaths = ['/', '/login', '/register']

  if (publicPaths.includes(to.path)) {
    return
  }

  if (!auth.token.value) {
    return navigateTo('/login')
  }

  // If we have a token but no user data, fetch the current user
  if (auth.token.value && !auth.user.value) {
    await auth.getCurrentUser()
  }
})
