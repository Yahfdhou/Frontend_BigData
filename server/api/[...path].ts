import { defineEventHandler, getRouterParam, getQuery, getRequestHeader } from 'h3'

const API_BASE = 'http://localhost:5000'

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path') || ''
  const targetUrl = new URL(`${API_BASE}/api/${path}`)
  const query = getQuery(event)

  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      value.forEach((item) => targetUrl.searchParams.append(key, String(item)))
    } else if (value !== undefined) {
      targetUrl.searchParams.set(key, String(value))
    }
  }

  const acceptHeader = getRequestHeader(event, 'accept')

  return await $fetch(targetUrl.toString(), {
    headers: acceptHeader ? { accept: acceptHeader } : undefined,
  })
})
