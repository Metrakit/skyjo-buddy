import { store } from '../../lib/store'
import { router } from '../../lib/router'
import { i18n } from '../../lib/i18n'
import { inlineIcon } from '../../lib/icons'
import { getAvailableGameTypes, getGameConfig } from '../../lib/game-configs'
import type { GameType } from '../../types'

export class CreateGameModal extends HTMLElement {
  private players: string[] = []

  connectedCallback() {
    this.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <button class="modal-close" id="close-modal">✕</button>
          <h2 class="modal-title">${i18n.t('modal.createGame.title')}</h2>
          <p class="modal-description">${i18n.t('modal.createGame.description')}</p>

          <div class="mb-4">
            <label class="label">${i18n.t('modal.createGame.gameTypeLabel')}</label>
            <select id="game-type" class="input">
              ${getAvailableGameTypes().map(type => {
                const config = getGameConfig(type)
                return `<option value="${type}">${config.name}</option>`
              }).join('')}
            </select>
            <p class="text-sm mt-1" style="color: var(--gray-600);" id="game-type-description">
              ${i18n.t('modal.createGame.skyjoDescription')}
            </p>
          </div>

          <div class="mb-4">
            <label class="label">${i18n.t('modal.createGame.gameName')}</label>
            <input type="text" class="input" id="game-name" placeholder="${i18n.t('modal.createGame.gameNamePlaceholder')}" />
          </div>

          <div class="mb-4">
            <label class="label">${i18n.t('modal.createGame.scoreLimitLabel')}</label>
            <input type="number" class="input" id="score-limit" value="100" />
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
    const gameTypeSelect = this.querySelector('#game-type') as HTMLSelectElement
    const descriptionEl = this.querySelector('#game-type-description')!

    closeBtn.addEventListener('click', () => this.remove())
    this.querySelector('.modal-overlay')!.addEventListener('click', (e) => {
      if (e.target === this.querySelector('.modal-overlay')) this.remove()
    })

    // Update UI when game type changes
    gameTypeSelect.addEventListener('change', () => {
      const selectedType = gameTypeSelect.value as GameType
      const config = getGameConfig(selectedType)

      // Update default score limit
      scoreLimitInput.value = config.defaultScoreLimit.toString()

      // Update description
      descriptionEl.textContent = i18n.t(`modal.createGame.${selectedType}Description`)
    })

    addPlayerBtn.addEventListener('click', () => this.addPlayer())
    playerNameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addPlayer()
    })

    createBtn.addEventListener('click', () => {
      const gameName = gameNameInput.value.trim()
      const scoreLimit = parseInt(scoreLimitInput.value) || 100
      const gameType = gameTypeSelect.value as GameType
      if (gameName && this.players.length >= 2) {
        const gameId = store.createGame(gameName, this.players, scoreLimit, gameType)
        this.remove()
        router.navigate('game', gameId)
      }
    })

    gameNameInput.addEventListener('input', () => this.updateCreateButton())
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
