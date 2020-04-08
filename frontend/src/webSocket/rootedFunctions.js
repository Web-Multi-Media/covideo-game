

let rootingFunction = {
    'getUsers': getUsers,
    'addName': addName,
    'gameIsReady': gameIsReady,

};

exports.handleServerResponse = function(message, gameState, setGameState){
    return rootingFunction[message.type](message, gameState,  setGameState);
};

/**
 * Get a word for the host, and a list of words for the player.
 *
 * @param
 * @param  The room identifier
 */
function getUsers(message, gameState, setGameState) {
    let objToSend = {};
    objToSend.users =  message.value;
    if(message.gameMaster === true){
        objToSend.isGameMaster = true;
    }
        setGameState({
            ...gameState,
            ...objToSend
        });
}

function addName(message, gameState, setGameState) {
    let objToSend = {};
    console.log('message.player');
    console.log(message.player);
    objToSend.player =  message.player;
    setGameState({
        ...gameState,
       ...objToSend
    });
}

function gameIsReady(message, gameState, setGameState) {
    setGameState({
        ...gameState,
        gameIsReady : true,
        teams: message.teams,
        words: message.words,
        activePlayer: message.activePlayer
    });
}
