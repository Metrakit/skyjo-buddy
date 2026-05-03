import { store } from '../../lib/store'
import { i18n } from '../../lib/i18n'
import { theme, type ThemePref } from '../../lib/theme'
import { inlineIcon } from '../../lib/icons'

export class SettingsModal extends HTMLElement {
  connectedCallback() {
    const currentLocale = i18n.getLocale()
    const currentTheme = theme.getPref()

    this.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <button class="modal-close" id="close-modal">✕</button>
          <h2 class="modal-title">${i18n.t('modal.settings.title')}</h2>
          <p class="modal-description">${i18n.t('modal.settings.description')}</p>

          <div class="mb-4">
            <label class="label">${i18n.t('modal.settings.language')}</label>
            <select class="input" id="language-select">
              <option value="fr" ${currentLocale === 'fr' ? 'selected' : ''}>Français</option>
              <option value="en" ${currentLocale === 'en' ? 'selected' : ''}>English</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="label">${i18n.t('modal.settings.theme')}</label>
            <select class="input" id="theme-select">
              <option value="auto" ${currentTheme === 'auto' ? 'selected' : ''}>${i18n.t('modal.settings.themeAuto')}</option>
              <option value="light" ${currentTheme === 'light' ? 'selected' : ''}>${i18n.t('modal.settings.themeLight')}</option>
              <option value="dark" ${currentTheme === 'dark' ? 'selected' : ''}>${i18n.t('modal.settings.themeDark')}</option>
            </select>
          </div>

          <div style="border-top: 1px solid var(--gray-200); margin: 1.5rem 0; padding-top: 1.5rem;">
            <div class="flex flex-col gap-3">
              <button class="btn btn-secondary w-full" id="export-btn">
                ${inlineIcon('download')} ${i18n.t('modal.settings.exportButton')}
              </button>

              <label class="btn btn-secondary w-full" style="cursor: pointer;">
                ${inlineIcon('upload')} ${i18n.t('modal.settings.importButton')}
                <input type="file" accept=".json" id="import-input" style="display: none;" />
              </label>

              <button class="btn btn-danger w-full" id="reset-btn">
                ${inlineIcon('refresh')} ${i18n.t('modal.settings.resetButton')}
              </button>
            </div>
          </div>
        </div>
      </div>
    `

    this.querySelector('#close-modal')!.addEventListener('click', () => this.remove())
    this.querySelector('.modal-overlay')!.addEventListener('click', (e) => {
      if (e.target === this.querySelector('.modal-overlay')) this.remove()
    })

    this.querySelector('#language-select')!.addEventListener('change', (e) => {
      const newLocale = (e.target as HTMLSelectElement).value as 'fr' | 'en'
      i18n.setLocale(newLocale)
    })

    this.querySelector('#theme-select')!.addEventListener('change', (e) => {
      theme.setPref((e.target as HTMLSelectElement).value as ThemePref)
    })

    this.querySelector('#export-btn')!.addEventListener('click', () => {
      store.exportData()
    })

    this.querySelector('#import-input')!.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        store.importData(file)
        this.remove()
      }
    })

    this.querySelector('#reset-btn')!.addEventListener('click', () => {
      store.resetData()
      this.remove()
    })
  }
}

customElements.define('settings-modal', SettingsModal)
