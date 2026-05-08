type NotificationKind = 'success' | 'error' | 'info' | 'warning'

export interface AppNotification {
  id: string
  title: string
  message?: string
  kind: NotificationKind
}

export const useNotifications = () => {
  const items = useState<AppNotification[]>('app_notifications', () => [])

  const remove = (id: string) => {
    items.value = items.value.filter((item) => item.id !== id)
  }

  const push = (payload: { title: string; message?: string; kind?: NotificationKind; timeoutMs?: number }) => {
    const id = Math.random().toString(36).slice(2, 10)
    items.value = [
      ...items.value,
      {
        id,
        title: payload.title,
        message: payload.message,
        kind: payload.kind || 'info',
      },
    ]

    const timeoutMs = payload.timeoutMs ?? 3500
    window.setTimeout(() => remove(id), timeoutMs)
  }

  return {
    items,
    push,
    remove,
  }
}
