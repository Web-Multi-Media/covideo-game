

let rootingFunction = {
    'getUsers': getUsers
};

exports.handleServerResponse = function(message, gameState, setGameState){
    return rootingFunction[message.type](message, gameState,  setGameState);
};

/**
 * Get a word for the host, and a list of words for the player.
 *
 * @param wordPoolIndex
 * @param gameId The room identifier
 */
function getUsers(message, gameState, setGameState) {
    if(message.gameMaster === true){
    setGameState({...gameState, users : message.value, isGameMaster: true});
    }
    else{
        setGameState({...gameState, users : message.value});
    }
}

