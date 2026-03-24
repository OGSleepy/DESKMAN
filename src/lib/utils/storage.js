const PREFIX = 'deskman_'

export const storage = {
  get(key, fallback = null) {
    try {
      const val = localStorage.getItem(PREFIX + key)
      return val !== null ? JSON.parse(val) : fallback
    } catch { return fallback }
  },
  set(key, value) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)) } catch {}
  },
  remove(key) {
    try { localStorage.removeItem(PREFIX + key) } catch {}
  },
}
