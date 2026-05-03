import type { AppState, Game, Player, Round, GameType } from '../types'
import { loadData, saveData, exportData, importData, resetData } from './storage'
import { getGameConfig } from './game-configs'
import { processRoundScores } from './scoring'

export class AppStore {
  private state: AppState = { games: [], currentGameId: null }
  private listeners: Set<() => void> = new Set()

  constructor() {
    this.state = loadData()
  }

  getState(): AppState {
    return this.state
  }

  getGames(): Game[] {
    return this.state.games
  }

  getGameById(id: string): Game | undefined {
    return this.state.games.find(g => g.id === id)
  }

  setState(newState: Partial<AppState>) {
    this.state = { ...this.state, ...newState }
    saveData(this.state)
    this.notify()
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify() {
    this.listeners.forEach(listener => listener())
  }

  // Actions
  createGame(name: string, playerNames: string[], scoreLimit: number, gameType: GameType = 'skyjo') {
    const config = getGameConfig(gameType)

    const players: Player[] = playerNames.map(pName => ({
      id: crypto.randomUUID(),
      name: pName,
      scores: [],
      totalScore: 0
    }))

    const newGame: Game = {
      id: crypto.randomUUID(),
      name,
      players,
      rounds: [],
      currentRound: 0,
      scoreLimit,
      gameType,
      // Set skyjoRule for backward compatibility
      skyjoRule: gameType === 'skyjo' ? config.scoringRules.hasDoublingRule : undefined,
      isFinished: false,
      createdAt: Date.now()
    }

    this.setState({
      games: [...this.state.games, newGame]
    })

    return newGame.id
  }

  deleteGame(gameId: string) {
    this.setState({
      games: this.state.games.filter(g => g.id !== gameId)
    })
  }

  addRound(gameId: string, scores: { [playerId: string]: number }, flippedAll?: { [playerId: string]: boolean }) {
    const currentGame = this.state.games.find(g => g.id === gameId)
    if (!currentGame) return

    // Use scoring strategy
    const scoringResult = processRoundScores(
      currentGame.gameType,
      scores,
      flippedAll
    )

    // Show warnings if any (console.warn for now)
    if (scoringResult.warnings && scoringResult.warnings.length > 0) {
      console.warn('Round scoring warnings:', scoringResult.warnings)
    }

    const newRound: Round = {
      roundNumber: currentGame.rounds.length + 1,
      scores: scoringResult.processedScores,
      timestamp: Date.now(),
      flippedAll: scoringResult.flippedAll
    }

    const updatedPlayers = currentGame.players.map(player => {
      const roundScore = scoringResult.processedScores[player.id] || 0
      const newScores = [...player.scores, roundScore]
      const totalScore = newScores.reduce((sum, s) => sum + s, 0)
      return { ...player, scores: newScores, totalScore }
    })

    const hasPlayerReachedLimit = updatedPlayers.some(p => p.totalScore >= currentGame.scoreLimit)

    this.setState({
      games: this.state.games.map(g =>
        g.id === currentGame.id
          ? {
              ...g,
              rounds: [...g.rounds, newRound],
              currentRound: g.currentRound + 1,
              players: updatedPlayers,
              isFinished: hasPlayerReachedLimit,
              finishedAt: hasPlayerReachedLimit ? Date.now() : undefined
            }
          : g
      )
    })
  }

  exportData() {
    const data = exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `board-game-buddy-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  importData(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const data = importData(content)
      if (data) {
        this.state = data
        this.notify()
        alert('Données importées avec succès !')
      } else {
        alert('Erreur lors de l\'import des données')
      }
    }
    reader.readAsText(file)
  }

  resetData() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ?')) {
      resetData()
      this.state = { games: [], currentGameId: null }
      this.notify()
    }
  }
}

export const store = new AppStore()
