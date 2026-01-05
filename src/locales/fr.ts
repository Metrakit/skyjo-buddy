export const fr = {
  app: {
    title: 'Skyjo Buddy',
    subtitle: 'Compteur de points intelligent'
  },
  home: {
    title: 'Mes parties',
    newGame: 'Créer une nouvelle partie',
    noGames: 'Aucune partie en cours',
    noGamesDescription: 'Créez votre première partie de Skyjo pour commencer à comptabiliser vos scores !',
    settings: 'Paramètres',
    players: 'Joueurs',
    rounds: 'Manches',
    scoreLimit: 'Score limite',
    leader: 'En tête',
    finished: 'Partie terminée',
    delete: 'Supprimer'
  },
  game: {
    createdOn: 'Créée le',
    players: 'Joueurs',
    rounds: 'Manches',
    scoreLimit: 'Score limite',
    bestScore: 'Meilleur score',
    finishRound: 'Terminer une manche',
    viewHistory: 'Voir l\'historique',
    gameFinished: 'Partie terminée !',
    gameFinishedDescription: 'Un joueur a atteint {limit} points',
    currentRanking: 'Classement actuel',
    rankingDescription: 'Le joueur avec le score le plus bas gagne !',
    points: 'points',
    round: 'manche',
    rounds_plural: 'manches',
    played: 'jouée',
    played_plural: 'jouées',
    backToHome: 'Retour à l\'accueil',
    backToGame: 'Retour à la partie'
  },
  history: {
    title: 'Historique complet',
    description: 'Détail de toutes les manches de {gameName}',
    noRounds: 'Aucune manche jouée',
    noRoundsDescription: 'Les manches apparaîtront ici au fur et à mesure de la partie',
    round: 'Manche',
    leader: 'Leader',
    total: 'Total',
    thisRound: 'Cette manche'
  },
  modal: {
    createGame: {
      title: 'Créer une nouvelle partie',
      description: 'Configurez votre partie de Skyjo',
      gameName: 'Nom de la partie',
      gameNamePlaceholder: 'Partie du vendredi soir...',
      scoreLimitLabel: 'Score limite (défaut: 100)',
      skyjoRuleLabel: 'Doubler les points',
      skyjoRuleDescription: 'Si le joueur qui retourne toutes ses cartes en premier n’a pas le score le plus bas, son score est doublé pour la manche.',
      playersLabel: 'Joueurs',
      playerNamePlaceholder: 'Nom du joueur...',
      createButton: 'Créer la partie'
    },
    addRound: {
      title: 'Manche {round}',
      description: 'Entrez le score de chaque joueur pour cette manche',
      flippedAllLabel: 'Joueur ayant retourné toutes ses cartes',
      selectPlayer: 'Sélectionner...',
      submitButton: 'Valider la manche'
    },
    settings: {
      title: 'Paramètres',
      description: 'Gérez vos données et préférences',
      language: 'Langue',
      exportData: 'Exporter les données',
      importData: 'Importer les données',
      resetData: 'Réinitialiser les données',
      exportButton: 'Télécharger JSON',
      importButton: 'Choisir un fichier',
      resetButton: 'Tout supprimer'
    }
  },
  common: {
    close: 'Fermer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    confirm: 'Confirmer'
  }
}

export type Translations = typeof fr
