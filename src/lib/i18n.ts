import { fr, type Translations } from '../locales/fr'
import { en } from '../locales/en'

type Locale = 'fr' | 'en'

const translations: Record<Locale, Translations> = {
  fr,
  en
}

class I18n {
  private locale: Locale
  private listeners: Set<() => void> = new Set()

  constructor() {
    // Get saved locale from localStorage or detect from browser
    const savedLocale = localStorage.getItem('locale') as Locale | null

    if (savedLocale && (savedLocale === 'fr' || savedLocale === 'en')) {
      this.locale = savedLocale
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith('fr')) {
        this.locale = 'fr'
      } else {
        this.locale = 'en'
      }
      localStorage.setItem('locale', this.locale)
    }
  }

  getLocale(): Locale {
    return this.locale
  }

  setLocale(locale: Locale) {
    this.locale = locale
    localStorage.setItem('locale', locale)
    this.notify()
  }

  t(key: string, params?: Record<string, string | number>): string {
    const keys = key.split('.')
    let value: any = translations[this.locale]

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        return key
      }
    }

    if (typeof value !== 'string') {
      return key
    }

    // Replace parameters in the string
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match
      })
    }

    return value
  }

  // Helper for pluralization
  plural(count: number, singular: string, plural: string): string {
    return count <= 1 ? this.t(singular) : this.t(plural)
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify() {
    this.listeners.forEach(listener => listener())
  }
}

export const i18n = new I18n()
