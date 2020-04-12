let rootingFunction = {
  'updateState': updateState,
  'gameIsReady': gameIsReady
};

export default function handleServerResponse(message, gameState, setGameState) {
  return rootingFunction[message.type](message, gameState, setGameState);
}

/**
 * Get a word for the host, and a list of words for the player.
 *
 * @param
 * @param  The room identifier
 */
function updateState(message, gameState, setGameState) {
  let objToUpdate = message;
  delete objToUpdate.type;
  setGameState({
    ...gameState,
    ...objToUpdate
  });
}

function gameIsReady(message, gameState, setGameState) {
  setGameState({
    ...gameState,
    gameIsReady: true,
    teams: message.teams,
    playerTeam: message.teams[0].findIndex((element) => element === gameState.player) !== -1
      ? 1
      : 2,
    words: message.words,
    activePlayer: message.activePlayer
  });
}
