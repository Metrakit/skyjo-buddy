import type { Translations } from './fr'

export const en: Translations = {
  app: {
    title: 'Skyjo Buddy',
    subtitle: 'Smart score tracker'
  },
  home: {
    title: 'My Games',
    newGame: 'Create new game',
    noGames: 'No games yet',
    noGamesDescription: 'Create your first Skyjo game to start tracking scores!',
    settings: 'Settings',
    players: 'Players',
    rounds: 'Rounds',
    scoreLimit: 'Score limit',
    leader: 'Leader',
    finished: 'Game finished',
    delete: 'Delete'
  },
  game: {
    createdOn: 'Created on',
    players: 'Players',
    rounds: 'Rounds',
    scoreLimit: 'Score limit',
    bestScore: 'Best score',
    finishRound: 'Finish a round',
    viewHistory: 'View history',
    gameFinished: 'Game finished!',
    gameFinishedDescription: 'A player has reached {limit} points',
    currentRanking: 'Current ranking',
    rankingDescription: 'The player with the lowest score wins!',
    points: 'points',
    round: 'round',
    rounds_plural: 'rounds',
    played: 'played',
    played_plural: 'played',
    backToHome: 'Back to home',
    backToGame: 'Back to game'
  },
  history: {
    title: 'Complete history',
    description: 'Detail of all rounds in {gameName}',
    noRounds: 'No rounds played',
    noRoundsDescription: 'Rounds will appear here as the game progresses',
    round: 'Round',
    leader: 'Leader',
    total: 'Total',
    thisRound: 'This round'
  },
  modal: {
    createGame: {
      title: 'Create new game',
      description: 'Configure your Skyjo game',
      gameName: 'Game name',
      gameNamePlaceholder: 'Friday night game...',
      scoreLimitLabel: 'Score limit (default: 100)',
      playersLabel: 'Players',
      playerNamePlaceholder: 'Player name...',
      createButton: 'Create game'
    },
    addRound: {
      title: 'Round {round}',
      description: 'Enter each player\'s score for this round',
      submitButton: 'Submit round'
    },
    settings: {
      title: 'Settings',
      description: 'Manage your data and preferences',
      language: 'Language',
      exportData: 'Export data',
      importData: 'Import data',
      resetData: 'Reset data',
      exportButton: 'Download JSON',
      importButton: 'Choose file',
      resetButton: 'Delete all'
    }
  },
  common: {
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    confirm: 'Confirm'
  }
}
