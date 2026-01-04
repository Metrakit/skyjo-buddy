import type { AppState } from '../types'

const STORAGE_KEY = 'skyjo-buddy-data'

export const loadData = (): AppState => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error)
  }
  return { games: [], currentGameId: null }
}

export const saveData = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
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
    const data = JSON.parse(jsonString) as AppState
    if (data.games && Array.isArray(data.games)) {
      saveData(data)
      return data
    }
  } catch (error) {
    console.error('Error importing data:', error)
  }
  return null
}

export const resetData = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}
