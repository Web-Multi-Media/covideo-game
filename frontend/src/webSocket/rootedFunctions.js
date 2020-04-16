let rootingFunction = {
  'updateState': updateState
};

export default function handleServerResponse(message, state, setState) {
  console.log('server response ' + message.type);
  return rootingFunction[message.type](message, state, setState);
}

/**
 * Get a word for the host, and a list of words for the player.
 *
 * @param
 * @param  The room identifier
 */
function updateState(message, gameState, setGameState) {
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
