let users = [];
let words = [];
let teams = [];
let hasAGameMaster = false;
let round = 0;
let set = 0;
let scoreFirstTeam = 0;
let scoreSercondTeam = 0;
let internWss = {};
let numberOfPlayer = 0;

let rootingFunction = {
    'addName': addName,
    'addWord': addWord,
    'getUsers': getUsers,
    'gameIsReady': gameIsReady
};
/**
 * This function is called by index.js to initialize a new game instance.
 *
 * @param sio The Socket.IO library
 * @param socket The socket object for the connected client.
 *
 */
exports.initGame = function(message, ws, wss){
    internWss = wss;
    const obj = JSON.parse(message);
    rootingFunction[obj.type](ws, obj);
};

function addName(ws, obj) {
    let response = {};
    let response2 = {};
    response.type ='getUsers'
    users = [...users, obj.player];
    response.value = users;
    response2.type ='addName'
    response2.player = obj.player;
    ws.send(JSON.stringify(response2));
    broadcast(JSON.stringify(response));
}

function handleRound(){
    let response = {};
    response.type ='handleRound';
    response.activePlayer = choosePlayer(round);
    round = round + 1;
    broadcast(JSON.stringify(response));
}


function gameIsReady() {
    let response = {};
    teams = sortTeam(users);
    const shuffleWords = shuffle(words);
    numberOfPlayer = users.length;
    response.type ='gameIsReady'
    response.teams = teams;
    response.words = shuffleWords;
    response.activePlayer = choosePlayer(round);
    round = round + 1;
    broadcast(JSON.stringify(response));
}

function addWord(ws, obj) {
    words = [...words, obj.word];
}

function getUsers(ws) {
    let response = {};
    response.type ='getUsers';
    response.value = users;
    if(hasAGameMaster === false){
        hasAGameMaster = true;
        response.gameMaster = true;
    }
    ws.send(JSON.stringify(response));
}

function broadcast(msg) {
    internWss.clients.forEach(function each(client) {
        client.send(msg);
    });
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function sortTeam(players){
    const randomizedUsers = shuffle(players);
    const teamA = randomizedUsers.slice(0, Math.floor(randomizedUsers.length /2));
    const teamB = randomizedUsers.slice(Math.floor(randomizedUsers.length /2), randomizedUsers.length);
    return [teamA, teamB];
}

function choosePlayer(round){
    const player = round % numberOfPlayer;
    const idx0 = Math.trunc(player % 2);
    const idx1 = Math.trunc(player / 2);
    return teams[idx0][idx1];
}