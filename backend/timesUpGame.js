const _ = require('lodash');
const playerFunction = require('./Player.js');
const utils = require('./utils')
const roomFunction = require('./Room.js');

let internWss = {};
var rooms = new Map();

let rootingFunction = {
  'addName': addName,
  'addWord': addWord,
  'getUsers': getUsers,
  'gameIsReady': gameIsReady,
  'startSet': startRound, // TODO: change startSet to startRound
  'validateWord': validateWord,
  'nextWord': nextWord,
  'resetGame': resetGame,
  'createRoom': createRoom,
  'joinRoom': joinRoom,
  'getRooms': getRooms,
  'leaveRoom': leaveRoom
};

function messageHandler(message, ws, wss) {
  internWss = wss;
  const obj = JSON.parse(message);
  console.log(ws.id + ' React request : ' + obj.type);
  const room = ws.roomId
    ? rooms.get(ws.roomId)
    : {};
  rootingFunction[obj.type](ws, obj, room);
}

function getRooms(ws, obj) {
  var rooms_data = [];
  for (const [id, room] of rooms.entries()) {
    console.log('Found room id ' + id + '');
    rooms_data.push(room.serialize());
  }
  let response = {
    type: 'updateState',
    rooms: rooms_data
  };
  ws.send(JSON.stringify(response));
}

function createRoom(ws, obj) {
  let roomId = utils.getUniqueID();
  while (rooms.has(roomId)) {
    roomId = utils.getUniqueID();
  }
  let room = new roomFunction.Room(roomId);
  rooms.set(roomId, room);
  console.log('Create room ' + roomId);
  let response = {
    type: 'updateState',
    roomId: roomId
  };
  ws.send(JSON.stringify(response));
}

function joinRoom(ws, obj) {
  let roomId = obj.roomId;
  let room = rooms.get(roomId);
  ws.roomId = roomId;
  let response = {
    type: 'updateState',
    joinedRoom: true,
    roomId: roomId
  };
  ws.send(JSON.stringify(response));
}

function leaveRoom(ws, obj, room) {
  let roomId = ws.roomId;
  let name = obj.name;
  var room = rooms.get(roomId);
  console.log('Removing ' + name + ' from room ' + roomId);
  room.removePlayer(name);
  ws.roomId = null;
  let response = {
    type: 'updateState',
    joinedRoom: false,
    roomId: roomId
  }
  ws.send(JSON.stringify(response));
}

function addName(ws, obj, room) {
  room.addUser(obj.player);
  room.addPlayer(new playerFunction.Player(ws.id, obj.player));
  let response = {
    type: 'updateState',
    users: _.cloneDeep(room.getUsers())
  };
  broadcast(response, room);
}

function startRound(ws, obj, room) {
  let response = {};
  response.type = 'updateState';
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
      response.words = room.getWordsOfRound();
      broadcast(response, room);
      clearInterval(WinnerCountdown);
    }
  }, 100);
  response.duration = counter;
  response.startTimer = true;
  broadcast(response, room);
}

function gameIsReady(ws, obj, room) {
  room.startGame();
  room.startSet();
  room.startRound();
  let response = {
    type: 'gameIsReady',
    teams: room.getTeams(),
    words: room.getWordsOfRound(),
    activePlayer: room.choosePlayer()
  }
  broadcast(response, room);
}

function addWord(ws, obj, room) {
  room.addWord(obj.word);
}

function validateWord(ws, obj, room) {
  room.validateWord(obj.team);
  let response = {
    type: 'updateState',
    words: room.getWordsOfRound(),
    team1Score: room.getScoreFirstTeam(),
    team2Score: room.getScoreSecondTeam()
  };
  broadcast(response, room);
}

function nextWord(ws, obj, room) {
  room.skipWord();
  let response = {
    type: 'updateState',
    words: room.getWordsOfRound()
  };
  broadcast(response, room);
}

function getUsers(ws, obj, room) {
  let response = {
    type: 'updateState',
    users: room.getUsers()
  };
  if (room.hasAGameMaster === false) {
    room.setGameMaster();
    response.isGameMaster = true;
  }
  ws.send(JSON.stringify(response));
}

function broadcast(msg, room, senderId) {
  internWss.clients.forEach(function each(client) {
    const player = room.players.find(player => player.id === client.id);
    msg.player = player
      ? player.name
      : '';
    if (senderId !== client.id && room.id === client.roomId) {
      client.send(JSON.stringify(msg));
    }
  });
}

function resetGame(ws, obj, room) {
  internWss = {};
  room.resetGame();
  console.log('fin de partie');
  if (internWss.clients) {
    internWss.clients.forEach(function each(client) {
      client.close();
    });
  }
}

module.exports.messageHandler = messageHandler;
module.exports.rooms = rooms;
