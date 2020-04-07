let users = [];
let words = [];
let hasAGameMaster = false;
let internWss = {};
let teams = [];
let rootingFunction = {
    'addName': addName,
    'addWord': addWord,
    'getUsers': getUsers
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
    const name = obj.name;
    response.type ='getUsers'
    users = [...users, obj.name];
    response.value = users;
    broadcast(JSON.stringify(response));
}

function addWord(ws, obj) {
    words = [...words, obj.word];
    console.log('word');
    console.log(words);
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
    console.log(msg);
    internWss.clients.forEach(function each(client) {
        client.send(msg);
    });
};

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

function sortTeam(){
    const randomizedUsers = shuffle(users);
    const teamA = randomizedUsers.slice(0, Math.floor(randomizedUsers.length /2));
    const teamB = randomizedUsers.slice(Math.floor(randomizedUsers.length /2), randomizedUsers.length);
    return [teamA, teamB];
}