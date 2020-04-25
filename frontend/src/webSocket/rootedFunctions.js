let rootingFunction = {
  'updateState': updateState,
  'gameStarted': gameStarted
};

export default function handleServerResponse(message, state, setState) {
  return rootingFunction[message.type](message, state, setState);
}

/**
 * Get a word for the host, and a list of words for the player.
 *
 * @param
 * @param  The room identifier
 */
export function updateState(message, gameState, setGameState) {
  setGameState({
    global: {
      ...gameState.global,
      ...message.global
    },
    player: {
      ...gameState.player,
      ...message.player
    },
    room: {
      ...gameState.room,
      ...message.room
    }
  });
}

function gameStarted(message, gameState, setGameState) {
  setGameState({
    global: {
      // playerTeam: 0,
      ...gameState.global,
      ...message.global,
      playerTeam: message.room.teams[0].map(player => player.id).findIndex((element) => element === gameState.player.id) !== -1 ? 1 : 2
    },
    player: {
      ...gameState.player,
      ...message.player
    },
    room: {
      ...gameState.room,
      ...message.room
    }
  });
}
