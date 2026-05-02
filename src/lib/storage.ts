import type { AppState, Game } from '../types'

const STORAGE_KEY = 'skyjo-buddy-data'
const DATA_VERSION = 2

interface StorageData {
  version?: number
  state: AppState
}

function migrateGame(game: any): Game {
  // If game already has gameType, no migration needed
  if (game.gameType) {
    return game
  }

  // Migrate old games: all existing games are Skyjo
  const migratedGame: Game = {
    ...game,
    gameType: 'skyjo',
    skyjoRule: game.skyjoRule ?? true
  }

  return migratedGame
}

function migrateAppState(state: AppState): AppState {
  return {
    ...state,
    games: state.games.map(migrateGame)
  }
}

export const loadData = (): AppState => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)

      // Handle both old format (raw AppState) and new format (versioned)
      const rawState: AppState = parsed.version ? parsed.state : parsed

      // Apply migrations
      const migratedState = migrateAppState(rawState)

      // Save migrated data back for performance
      saveData(migratedState)

      return migratedState
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error)
  }
  return { games: [], currentGameId: null }
}

export const saveData = (state: AppState): void => {
  try {
    const storageData: StorageData = {
      version: DATA_VERSION,
      state
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData))
  } catch (error) {
    console.error('Error saving data to localStorage:', error)
  }
}

export const exportData = (): string => {
  const data = loadData()
  return JSON.stringify(data, null, 2)
}

export const importData = (jsonString: string): AppState | null => {
  try {
    const parsed = JSON.parse(jsonString)
    const rawState: AppState = parsed.version ? parsed.state : parsed

    if (rawState.games && Array.isArray(rawState.games)) {
      // Apply migrations to imported data
      const migratedState = migrateAppState(rawState)
      saveData(migratedState)
      return migratedState
    }
  } catch (error) {
    console.error('Error importing data:', error)
  }
  return null
}

export const resetData = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}
