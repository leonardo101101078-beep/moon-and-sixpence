export function getItem(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const rawValue = window.localStorage.getItem(key)

    if (rawValue === null) {
      return fallback
    }

    return JSON.parse(rawValue) ?? fallback
  } catch {
    return fallback
  }
}

export function setItem(key, value) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage write failures so the UI remains usable.
  }
}
