

let rootingFunction = {
    'getUsers': getUsers
};

exports.handleServerResponse = function(message, gameState, setGameState){
    return rootingFunction[message.type](message.value, gameState,  setGameState);
};

/**
 * Get a word for the host, and a list of words for the player.
 *
 * @param wordPoolIndex
 * @param gameId The room identifier
 */
function getUsers(users, gameState, setGameState) {
    setGameState({...gameState, users : users})
}

