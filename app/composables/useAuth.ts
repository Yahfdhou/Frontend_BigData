import type { AuthResponse, UserObject } from '~/types/api'

export const useAuth = () => {
  const config = useRuntimeConfig()
  const API_BASE = config.public.apiBaseUrl || 'http://3.88.50.172:5000'

  const user = useCookie<UserObject | null>('auth_user', {
    sameSite: 'lax',
    default: () => null,
  })
  const token = useCookie<string | null>('auth_token', {
    sameSite: 'lax',
    default: () => null,
  })

  const setToken = (t: string | null) => {
    token.value = t
  }

  const setUser = (u: UserObject | null) => {
    user.value = u
  }

  const authHeader = (): HeadersInit | undefined =>
    token.value ? { Authorization: `Bearer ${token.value}` } : undefined

  const register = async (payload: { username: string; email: string; password: string; full_name?: string }) => {
    const data = await $fetch<AuthResponse>(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      body: payload,
      ignoreResponseError: true,
    })

    return data
  }

  const login = async (payload: { identifier: string; password: string }) => {
    const data = await $fetch<AuthResponse>(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      body: payload,
      ignoreResponseError: true,
    })

    if (data?.access_token) {
      setToken(data.access_token)
      if (data.user) {
        setUser(data.user)
        console.log('Login successful, user data stored:', data.user)
      }
    } else {
      console.error('Login failed:', data)
    }

    return data
  }

  const logout = async () => {
    setToken(null)
    setUser(null)
    await navigateTo('/login')
  }

  const fetchUsers = async () => {
    try {
      const res = await $fetch<any>(`${API_BASE}/api/users`, {
        headers: authHeader(),
      })
      return res.users || res
    } catch (err) {
      console.error('Error fetching users:', err)
      return []
    }
  }

  const getCurrentUser = async () => {
    try {
      const res = await $fetch<any>(`${API_BASE}/api/auth/me`, {
        headers: authHeader(),
      })
      if (res?.user) {
        setUser(res.user)
      }
      return res?.user || null
    } catch (err) {
      console.error('Error fetching current user:', err)
      return null
    }
  }

  const restoreFromStorage = () => {
    return
  }

  return {
    user,
    token,
    register,
    login,
    logout,
    fetchUsers,
    getCurrentUser,
    restoreFromStorage,
  }
}

export type UseAuth = ReturnType<typeof useAuth>
