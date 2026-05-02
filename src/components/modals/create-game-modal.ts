import { store } from '../../lib/store'
import { router } from '../../lib/router'
import { i18n } from '../../lib/i18n'
import { inlineIcon } from '../../lib/icons'
import {
  getGameConfig,
  sortGameTypesByPopularity,
  type RankedGameType
} from '../../lib/game-configs'
import type { GameType } from '../../types'

export class CreateGameModal extends HTMLElement {
  private players: string[] = []
  private rankedGameTypes: RankedGameType[] = []
  private selectedGameType: GameType = 'skyjo'
  private searchQuery: string = ''

  connectedCallback() {
    this.rankedGameTypes = sortGameTypesByPopularity(store.getGames())
    this.selectedGameType = this.rankedGameTypes[0]?.type ?? 'skyjo'

    const initialConfig = getGameConfig(this.selectedGameType)

    this.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <button class="modal-close" id="close-modal">✕</button>
          <h2 class="modal-title">${i18n.t('modal.createGame.title')}</h2>
          <p class="modal-description">${i18n.t('modal.createGame.description')}</p>

          <div class="mb-4">
            <label class="label">${i18n.t('modal.createGame.gameTypeLabel')}</label>
            <div class="game-type-picker" data-open="false">
              <div class="game-type-input-wrapper">
                <input
                  type="text"
                  id="game-type-search"
                  class="input game-type-search"
                  placeholder="${i18n.t('modal.createGame.gameTypeSearchPlaceholder')}"
                  autocomplete="off"
                  value="${initialConfig.name}"
                />
                <span class="game-type-chevron" aria-hidden="true">${inlineIcon('chevronRight')}</span>
              </div>
              <div id="game-type-list" class="game-type-list">
                ${this.renderGameTypeOptions()}
              </div>
            </div>
            <p class="text-sm mt-1" style="color: var(--gray-600);" id="game-type-description">
              ${i18n.t(`modal.createGame.${this.selectedGameType}Description`)}
            </p>
          </div>

          <div class="mb-4">
            <label class="label">${i18n.t('modal.createGame.gameName')}</label>
            <input type="text" class="input" id="game-name" placeholder="${i18n.t('modal.createGame.gameNamePlaceholder')}" />
          </div>

          <div class="mb-4">
            <label class="label">${i18n.t('modal.createGame.scoreLimitLabel')}</label>
            <input type="number" class="input" id="score-limit" value="${initialConfig.defaultScoreLimit}" />
            <p class="text-sm mt-1" style="color: var(--gray-600);">
              ${i18n.t('modal.createGame.scoreLimitHint')}
            </p>
          </div>

          <div class="mb-4">
            <label class="label">${i18n.t('modal.createGame.playersLabel')} (<span id="player-count">0</span>)</label>
            <div class="flex gap-2">
              <input type="text" class="input" id="player-name" placeholder="${i18n.t('modal.createGame.playerNamePlaceholder')}" />
              <button class="btn btn-primary btn-icon" id="add-player-btn">${inlineIcon('plus')}</button>
            </div>
            <div id="players-list" class="mt-4"></div>
          </div>

          <button class="btn btn-primary w-full" id="create-game-btn" disabled>
            ${i18n.t('modal.createGame.createButton')}
          </button>
        </div>
      </div>
    `

    const closeBtn = this.querySelector('#close-modal')!
    const addPlayerBtn = this.querySelector('#add-player-btn')!
    const createBtn = this.querySelector('#create-game-btn')!
    const playerNameInput = this.querySelector('#player-name') as HTMLInputElement
    const gameNameInput = this.querySelector('#game-name') as HTMLInputElement
    const scoreLimitInput = this.querySelector('#score-limit') as HTMLInputElement
    const searchInput = this.querySelector('#game-type-search') as HTMLInputElement
    const listEl = this.querySelector('#game-type-list') as HTMLElement

    closeBtn.addEventListener('click', () => this.remove())
    this.querySelector('.modal-overlay')!.addEventListener('click', (e) => {
      if (e.target === this.querySelector('.modal-overlay')) this.remove()
    })

    const picker = this.querySelector('.game-type-picker') as HTMLElement

    searchInput.addEventListener('focus', () => {
      picker.dataset.open = 'true'
      searchInput.value = ''
      this.searchQuery = ''
      listEl.innerHTML = this.renderGameTypeOptions()
      this.attachGameTypeOptionListeners()
    })

    searchInput.addEventListener('blur', () => {
      picker.dataset.open = 'false'
      this.searchQuery = ''
      searchInput.value = getGameConfig(this.selectedGameType).name
    })

    searchInput.addEventListener('input', () => {
      this.searchQuery = searchInput.value
      listEl.innerHTML = this.renderGameTypeOptions()
      this.attachGameTypeOptionListeners()
    })

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.blur()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const firstOption = listEl.querySelector('.game-type-option') as HTMLButtonElement | null
        if (firstOption?.dataset.type) {
          this.selectGameType(firstOption.dataset.type as GameType)
          searchInput.blur()
        }
      }
    })

    this.attachGameTypeOptionListeners()

    addPlayerBtn.addEventListener('click', () => this.addPlayer())
    playerNameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addPlayer()
    })

    createBtn.addEventListener('click', () => {
      const gameName = gameNameInput.value.trim()
      const scoreLimit = parseInt(scoreLimitInput.value) || getGameConfig(this.selectedGameType).defaultScoreLimit
      if (gameName && this.players.length >= 2) {
        const gameId = store.createGame(gameName, this.players, scoreLimit, this.selectedGameType)
        this.remove()
        router.navigate('game', gameId)
      }
    })

    gameNameInput.addEventListener('input', () => this.updateCreateButton())
  }

  private renderGameTypeOptions(): string {
    const query = this.searchQuery.trim().toLowerCase()
    const filtered = query
      ? this.rankedGameTypes.filter(({ type }) =>
          getGameConfig(type).name.toLowerCase().includes(query)
        )
      : this.rankedGameTypes

    if (filtered.length === 0) {
      return `<p class="game-type-empty">${i18n.t('modal.createGame.noGameTypeFound')}</p>`
    }

    return filtered
      .map(({ type, playCount, isMostPlayed }) => {
        const config = getGameConfig(type)
        const selected = type === this.selectedGameType
        const popularBadge = isMostPlayed
          ? `<span class="game-type-popular" title="${i18n.t('modal.createGame.mostPlayed')}">${inlineIcon('sparkles')} ${i18n.t('modal.createGame.mostPlayed')}</span>`
          : ''
        const countLabel = playCount > 0
          ? `<span class="game-type-count">${i18n.t('modal.createGame.playCount', { count: playCount.toString() })}</span>`
          : ''
        return `
          <button type="button" class="game-type-option ${selected ? 'selected' : ''}" data-type="${type}">
            <span class="game-type-option-main">
              <span class="game-type-badge" data-type="${type}">${config.name}</span>
              ${popularBadge}
            </span>
            ${countLabel}
          </button>
        `
      })
      .join('')
  }

  private attachGameTypeOptionListeners() {
    const options = this.querySelectorAll('.game-type-option') as NodeListOf<HTMLButtonElement>
    const searchInput = this.querySelector('#game-type-search') as HTMLInputElement
    options.forEach(option => {
      option.addEventListener('mousedown', (e) => e.preventDefault())
      option.addEventListener('click', () => {
        const type = option.dataset.type as GameType
        this.selectGameType(type)
        searchInput.blur()
      })
    })
  }

  private selectGameType(type: GameType) {
    if (type === this.selectedGameType) return
    this.selectedGameType = type

    const listEl = this.querySelector('#game-type-list') as HTMLElement
    listEl.innerHTML = this.renderGameTypeOptions()
    this.attachGameTypeOptionListeners()

    const config = getGameConfig(type)
    const scoreLimitInput = this.querySelector('#score-limit') as HTMLInputElement
    scoreLimitInput.value = config.defaultScoreLimit.toString()

    const descriptionEl = this.querySelector('#game-type-description')!
    descriptionEl.textContent = i18n.t(`modal.createGame.${type}Description`)
  }

  addPlayer() {
    const input = this.querySelector('#player-name') as HTMLInputElement
    const playerName = input.value.trim()
    if (playerName) {
      this.players.push(playerName)
      input.value = ''
      this.renderPlayers()
      this.updateCreateButton()
    }
  }

  renderPlayers() {
    const list = this.querySelector('#players-list')!
    const count = this.querySelector('#player-count')!
    count.textContent = this.players.length.toString()

    list.innerHTML = this.players.map((player, index) => `
      <div class="player-item">
        <div class="flex items-center gap-3">
          <div class="player-badge">${index + 1}</div>
          <span class="font-bold">${player}</span>
        </div>
        <button class="btn btn-danger btn-sm" data-index="${index}">${inlineIcon('trash')}</button>
      </div>
    `).join('')

    list.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt((btn as HTMLElement).dataset.index!)
        this.players.splice(index, 1)
        this.renderPlayers()
        this.updateCreateButton()
      })
    })
  }

  updateCreateButton() {
    const btn = this.querySelector('#create-game-btn') as HTMLButtonElement
    const gameNameInput = this.querySelector('#game-name') as HTMLInputElement
    btn.disabled = !gameNameInput.value.trim() || this.players.length < 2
  }
}

customElements.define('create-game-modal', CreateGameModal)
