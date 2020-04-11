const _ = require('lodash');
const playerFunction = require('./Player.js');
const utils = require('./utils')
const roomFunction = require('./Room.js');

let internWss = {};
// let rooms = []; // TODO: create several rooms
let room = new roomFunction.Room(0);

let rootingFunction = {
    'addName': addName,
    'addWord': addWord,
    'getUsers': getUsers,
    'gameIsReady': gameIsReady,
    'startSet': startRound,  // TODO: change startSet to startRound
    'validateWord': validateWord,
    'nextWord': nextWord,
    'resetGame': resetGame
};

/**
 * This function is called by index.js to initialize a new game instance.
 *
 * @param sio The Socket.IO library
 * @param socket The socket object for the connected client.
*
*/

function initGame (message, ws, wss) {
    internWss = wss;
    const obj = JSON.parse(message);
    console.log('React request : ' + obj.type);
    rootingFunction[obj.type](ws, obj);
}

function addName(ws, obj) {
    let response = {};
    room.addUser(obj.player);
    response.type ='updateState';
    response.users = _.cloneDeep(room.getUsers());
    room.addPlayer(new playerFunction.Player(ws.id, obj.player))
    broadcast(response);
}

function startRound(ws, obj){
    let response = {};
    response.type ='updateState';
    room.startRound();
    let counter = 30;
    let WinnerCountdown = setInterval(function() {
        counter = counter - 0.1;
        let isSetfinished = room.isSetFinished();
        response.setFinished = isSetfinished;
        if (counter <= 0 || isSetfinished === true) {
            if (isSetfinished === true) {
                room.startSet();
                counter = 0;
            }
            response.startTimer = false;
            response.activePlayer = room.choosePlayer();
            response.words =  room.getWordsOfRound();
            broadcast(response);
            clearInterval(WinnerCountdown);
        }
    }, 100);
    response.duration = counter;
    response.startTimer = true;
    broadcast(response);
}

function gameIsReady() {
    let response = {};
    room.startGame();
    room.startSet();
    room.startRound();
    response.type ='gameIsReady';
    response.teams = room.getTeams();
    response.words = room.getWordsOfRound();
    response.activePlayer = room.choosePlayer();
    broadcast(response);
}

function addWord(ws, obj) {
    room.addWord(obj.word);
}

function validateWord (ws, obj) {
    let response = {};
    response.type ='updateState';
    room.validateWord(obj.team);
    response.words = room.getWordsOfRound();
    response.team1Score = room.getScoreFirstTeam();
    response.team2Score = room.getScoreSecondTeam();
    broadcast(response);
}

function nextWord () {
    let response = {};
    response.type ='updateState';
    room.skipWord();
    response.words = room.getWordsOfRound();
    broadcast(response);
}

function getUsers(ws) {
    let response = {};
    response.type ='updateState';
    response.users = room.getUsers();
    if (room.hasAGameMaster === false) {
        room.setGameMaster();
        response.isGameMaster = true;
    }
    ws.send(JSON.stringify(response));
}

function broadcast(msg, senderId) {
    internWss.clients.forEach(function each(client) {
        const player = room.players.find(player => player.id === client.id);
        msg.player = player ? player.name : '';
        if(senderId !== client.id){
            client.send(JSON.stringify(msg));
        }
    });
}

function resetGame() {
    internWss = {};
    room.resetGame();
    console.log('fin de partie');
    if(internWss.clients){
    internWss.clients.forEach(function each(client) {
        client.close();
    });
    }
}


module.exports.initGame = initGame;
