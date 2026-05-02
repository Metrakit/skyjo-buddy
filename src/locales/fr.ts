export const fr = {
  app: {
    title: 'Skyjo Buddy',
    subtitle: 'Compteur de points multi-jeux'
  },
  home: {
    title: 'Mes parties',
    newGame: 'Créer une nouvelle partie',
    noGames: 'Aucune partie en cours',
    noGamesDescription: 'Créez votre première partie pour commencer à comptabiliser vos scores !',
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
    gameFinishedDescriptionLowest: 'Un joueur a atteint {limit} points : le plus bas score gagne !',
    gameFinishedDescriptionHighest: 'Un joueur a atteint {limit} points et remporte la partie !',
    currentRanking: 'Classement actuel',
    rankingDescription: 'Le joueur avec le score le plus bas gagne !',
    rankingLowestWins: 'Le joueur avec le score le plus bas gagne !',
    rankingHighestWins: 'Le joueur avec le score le plus haut gagne !',
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
      description: 'Configurez votre partie',
      gameTypeLabel: 'Type de jeu',
      skyjoDescription: 'Jeu de cartes où le plus bas score gagne. Score limite par défaut : 100 points.',
      papayooDescription: 'Jeu de plis à points négatifs. Total de 250 points par manche. Score limite par défaut : 500 points.',
      flip7Description: 'Jeu de stop-ou-encore où le plus haut score gagne. Score limite par défaut : 200 points.',
      gameName: 'Nom de la partie',
      gameNamePlaceholder: 'Partie du vendredi soir...',
      scoreLimitLabel: 'Score limite',
      scoreLimitHint: 'Valeur par défaut dépend du type de jeu sélectionné',
      playersLabel: 'Joueurs',
      playerNamePlaceholder: 'Nom du joueur...',
      createButton: 'Créer la partie'
    },
    addRound: {
      title: 'Manche {round}',
      description: 'Entrez le score de chaque joueur pour cette manche',
      flippedAllLabel: 'Joueur ayant retourné toutes ses cartes',
      selectPlayer: 'Sélectionner...',
      validationWarning: 'Total de la manche : {total} points (attendu : {expected} points)',
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
  },
  gameTypes: {
    skyjo: 'Skyjo',
    papayoo: 'Papayoo',
    flip7: 'Flip 7'
  }
}

export type Translations = typeof fr
