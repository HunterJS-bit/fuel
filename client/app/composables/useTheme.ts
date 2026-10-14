const STORAGE_KEY = 'fuelcalc-theme'

export function useTheme() {
  const isDark = useState('theme-dark', () => false)

  const applyTheme = (dark: boolean) => {
    isDark.value = dark

    if (import.meta.client) {
      document.documentElement.classList.toggle('dark-mode', dark)
      localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
    }
  }

  const toggleTheme = () => applyTheme(!isDark.value)

  const initTheme = () => {
    if (!import.meta.client) return

    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'dark') {
      applyTheme(true)
      return
    }
    if (saved === 'light') {
      applyTheme(false)
      return
    }

    applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches)
  }

  return { isDark, applyTheme, toggleTheme, initTheme }
}
