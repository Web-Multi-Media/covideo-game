const _ = require('lodash');
const playerFunction = require('./Player.js');
const utils = require('./utils')
const roomfunc = require('./Room.js');

let webSockets = {};
var rooms = new Map();

let rootingFunction = {
  'addName': addName,
  'addWord': addWord,
  'getPlayers': getPlayers,
  'gameIsReady': gameIsReady,
  'startRound': startRound, // TODO: change startRound to startRound
  'validateWord': validateWord,
  'nextWord': nextWord,
  'resetGame': resetGame,
  'createRoom': createRoom,
  'joinRoom': joinRoom,
  'getRooms': getRooms,
  'leaveRoom': leaveRoom,
  'setGif': setGif
};

function messageHandler(message, ws, wss) {
  webSockets = wss;
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

  // Set current room
  let room = new roomfunc.Room(roomId);
  rooms.set(roomId, room);
  console.log('Create room ' + roomId);
  console.log('Rooms ' + rooms);
  let response = {
    type: 'updateState',
    roomId: roomId
  };
  ws.send(JSON.stringify(response));

  // Broadcast rooms to all clients
  var rooms_data = [];
  for (const [id, room] of rooms.entries()) {
    rooms_data.push(room.serialize());
  }
  let response2 = {
    type: 'updateState',
    rooms: rooms_data
  }
  broadcast(response2);
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
  };
  ws.send(JSON.stringify(response));
}

function addName(ws, obj, room) {
  room.addPlayer(new playerFunction.Player(ws.id, obj.player));
  let response = {
    type: 'updateState',
    players: _.cloneDeep(room.players)
  };
  broadcast(response, room);
}

function startRound(ws, obj, room) {
  let response = {
    type: 'updateState'
  };
  room.startRound();
  let counter = 30;
  let WinnerCountdown = setInterval(function() {
    counter = counter - 0.1;
    let isSetfinished = room.setFinished;
    response.setFinished = isSetfinished;
    if (counter <= 0 || isSetfinished === true) {
      if (isSetfinished === true) {
        room.startSet();
        counter = 0;
      }
      response.startTimer = false;
      response.activePlayer = room.choosePlayer();
      response.words = room.wordsOfRound;
      response.gifUrl = '';
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
    teams: room.teams,
    words: room.wordsOfRound,
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
    words: room.wordsOfRound,
    team1Score: room.scoreFirstTeam,
    team2Score: room.scoreSecondTeam,
    set: room.set,
    gifUrl: room.gifUrl
  };
  broadcast(response, room);
}

function nextWord(ws, obj, room) {
  room.skipWord();
  let response = {
    type: 'updateState',
    words: room.wordsOfRound,
    gifUrl: ''
  };
  broadcast(response, room);
}

function getPlayers(ws, obj, room) {
  let response = {
    type: 'updateState',
    players: room.players
  };
  if (room.hasAGameMaster === false) {
    room.setGameMaster(ws.id);
    response.isGameMaster = true;
  }
  ws.send(JSON.stringify(response));
}

function setGif(ws, obj, room) {
    let response = {};
    response.type ='updateState';
    response.gifUrl = obj.gifUrl;
    room.setGifUrl(obj.gifUrl);
    broadcast(response, room);
}

function broadcast(msg, room, senderId) {
  webSockets.clients.forEach(function each(client) {
    if (room === undefined && client.roomId === undefined) {
      client.send(JSON.stringify(msg));
    } else if (senderId !== client.id && room !== undefined && room.id === client.roomId) {
      const player = room.players.find(player => player.id === client.id);
      msg.player = player
        ? player.name
        : '';
      client.send(JSON.stringify(msg));
    }
  });
}

function resetGame(ws, obj, room) {
  room.resetGame();
  let response = {
    type: 'updateState',
    gameIsReady: false
  }
  broadcast(response, room);
  console.log('fin de partie');
}

module.exports.messageHandler = messageHandler;
module.exports.rooms = rooms;
