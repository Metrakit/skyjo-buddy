export type ThemePref = 'auto' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

class ThemeManager {
  private pref: ThemePref
  private listeners: Set<() => void> = new Set()
  private mql: MediaQueryList | null = null

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY)
    this.pref = saved === 'auto' || saved === 'light' || saved === 'dark' ? saved : 'auto'
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.mql = window.matchMedia('(prefers-color-scheme: dark)')
      this.mql.addEventListener('change', () => {
        if (this.pref === 'auto') {
          this.apply()
          this.notify()
        }
      })
    }
    this.apply()
  }

  getPref(): ThemePref {
    return this.pref
  }

  getResolved(): ResolvedTheme {
    if (this.pref === 'auto') {
      return this.mql?.matches ? 'dark' : 'light'
    }
    return this.pref
  }

  setPref(pref: ThemePref) {
    this.pref = pref
    localStorage.setItem(STORAGE_KEY, pref)
    this.apply()
    this.notify()
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private apply() {
    document.documentElement.setAttribute('data-theme', this.getResolved())
  }

  private notify() {
    this.listeners.forEach(l => l())
  }
}

export const theme = new ThemeManager()
