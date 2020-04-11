
const _ = require('lodash');
let users = [];
let words = [];
let wordsOfRound = [];
let teams = [];
let hasAGameMaster = false;
let round = 0;
let set = 1;
let setFinished = false;
let scoreFirstTeam = 0;
let scoreSecondTeam = 0;
let internWss = {};
let numberOfPlayer = 0;
let Players = [];
const playerFunction = require('./Player.js');
const utils = require('./utils')

let rootingFunction = {
    'addName': addName,
    'addWord': addWord,
    'getUsers': getUsers,
    'gameIsReady': gameIsReady,
    'startSet': startSet,
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
    users = [...users, obj.player];
    response.type ='updateState';
    response.users = _.cloneDeep(users);
    Players.push(new playerFunction.Player(ws.id, obj.player));
    broadcast(response);
}

function startSet(ws, obj){
    let response = {};
    response.type ='updateState';
    setFinished = false;
    let counter = 30;
    let WinnerCountdown = setInterval(function(){
        counter= counter - 0.1;
        response.setFinished = setFinished;
        if (counter <= 0 || setFinished === true) {
            round = round + 1;
            if(setFinished === true){
                wordsOfRound = words;
                response.words = wordsOfRound;
                counter = 0;
            }
            response.startTimer = false;
            response.activePlayer = utils.choosePlayer(round, teams, numberOfPlayer);
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
    teams = utils.sortTeam(users);
    wordsOfRound = utils.shuffle(words);
    numberOfPlayer = users.length;
    response.type ='gameIsReady';
    response.teams = teams;
    response.words = wordsOfRound;
    response.activePlayer = utils.choosePlayer(round, teams, numberOfPlayer);
    broadcast(response);
}

function addWord(ws, obj) {
    words = [...words, obj.word];
}

function validateWord (ws, obj) {
    let response = {};
    if(obj.team === 1) {
        scoreFirstTeam++;
    }else{
        scoreSecondTeam++;
    }
    response.type ='updateState';
    wordsOfRound = _.tail(wordsOfRound);
    response.words = wordsOfRound;
    if(wordsOfRound.length === 0){
        setFinished = true;
        response.setFinished = true;
        set ++;
        response.set = set;
    }
    response.team1Score = scoreFirstTeam;
    response.team2Score = scoreSecondTeam;
    broadcast(response);
}

function nextWord () {
    let response = {};
    response.type ='updateState';
    wordsOfRound = utils.firstToLastIndex(wordsOfRound);
    response.words = wordsOfRound;
    broadcast(response);
}

function getUsers(ws) {
    let response = {};
    response.type ='updateState';
    response.users = users;
    if(hasAGameMaster === false){
        hasAGameMaster = true;
        response.isGameMaster = true;
    }
    ws.send(JSON.stringify(response));
}


function broadcast(msg, senderId) {
    internWss.clients.forEach(function each(client) {
        const player = Players.find(player => player.id === client.id);
        msg.player = player ? player.name : '';
        if(senderId !== client.id){
            client.send(JSON.stringify(msg));
        }
    });
}


function resetGame() {
    users = [];
    words = [];
    wordsOfRound = [];
    teams = [];
    hasAGameMaster = false;
    round = 0;
    set = 1;
    scoreFirstTeam = 0;
    scoreSecondTeam = 0;
    internWss = {};
    numberOfPlayer = 0;
    console.log('fin de partie');
    if(internWss.clients){
    internWss.clients.forEach(function each(client) {
        client.close();
    });
    }
}

module.exports.initGame = initGame;