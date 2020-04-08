

let rootingFunction = {
    'getUsers': getUsers,
    'addName': addName,
    'gameIsReady': gameIsReady,
    'startSet': startSet,
    'updateWord': updateWord,
    'handleRound': handleRound

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
function getUsers(message, gameState, setGameState) {
    let objToUpdate = {};
    objToUpdate.users =  message.value;
    if(message.gameMaster === true){
        objToUpdate.isGameMaster = true;
    }
        setGameState({
            ...gameState,
            ...objToUpdate
        });
}

function addName(message, gameState, setGameState) {
    let objToUpdate = {};
    objToUpdate.player =  message.player;
    setGameState({
        ...gameState,
       ...objToUpdate
    });
}

function gameIsReady(message, gameState, setGameState) {
    setGameState({
        ...gameState,
        gameIsReady : true,
        teams: message.teams,
        playerTeam: message.teams[0].findIndex((element) => element === gameState.player) !== -1 ? 1 : 2,
        words: message.words,
        activePlayer: message.activePlayer
    });
}

function startSet(message, gameState, setGameState){
    setGameState({
        ...gameState,
        startTimer: message.startTimer
    });
}

function updateWord(message, gameState, setGameState){
    let objToUpdate = {};
    objToUpdate.words =  message.words;
    if(message.scoreFirstTeam){
        objToUpdate.team1Score = message.scoreFirstTeam;
    }
    if(message.setFinished){
        objToUpdate.setFinished = message.setFinished;
    }
    if(message.set){
        objToUpdate.set = message.set;
    }
    if(message.scoreSecondTeam){
        objToUpdate.team2Score = message.scoreSecondTeam;
    }
    setGameState({
        ...gameState,
        ...objToUpdate
    });
}

function handleRound(message, gameState, setGameState){
    setGameState({
        ...gameState,
        activePlayer: message.activePlayer,
        round: message.round
    });
}

