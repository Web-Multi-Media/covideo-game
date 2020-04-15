const _ = require('lodash');
const playerFunction = require('./Player.js');
const utils = require('./utils')
const roomfunc = require('./Room.js');

let webSockets = {};
var rooms = new Map();

let rootingFunction = {
  'addName': addName,
  'addWord': addWord,
  'deleteWord': deleteWord,
  'getPlayers': getPlayers,
  'changeRoomSettings': changeRoomSettings,
  'gameIsReady': gameIsReady,
  'startRound': startRound,
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
  room.setGameMaster(ws.id);
  rooms.set(roomId, room);
  console.log('Create room ' + roomId);
  let response = {
    type: 'updateState',
    roomId: room.id,
    gameMaster: room.gameMaster,
    isGameMaster: true
  };
  ws.send(JSON.stringify(response));
  broadcastRoomsInfo();
}

function joinRoom(ws, obj) {
  // Get room
  let roomId = obj.roomId;
  let room = rooms.get(roomId);

  // Set room id in web socket and update state
  ws.roomId = roomId;
  let response = {
    type: 'updateState',
    joinedRoom: true,
    roomId: roomId,
    roomSettings: room.settings
  };

  // Set user as game master if none exist
  if (room.gameMaster === null) {
    console.log("No game master in room. Appointing " + ws.id);
    room.setGameMaster(ws.id);
    response.isGameMaster = true;
  }
  response.gameMaster = room.gameMaster;
  ws.send(JSON.stringify(response));
}

function leaveRoom(ws, obj, room) {
  let roomId = ws.roomId;
  let id = obj.player_id;
  var room = rooms.get(roomId);
  var gameMaster = room.gameMaster;

  // Remove player from room
  // Set state back to room list
  console.log('Removing ' + id + ' from room ' + roomId);
  room.removePlayer(id);
  let response = {
    type: 'updateState',
    joinedRoom: false
  };
  webSockets.clients.forEach(function each(client) {
    if (client.id === id) {
      client.send(JSON.stringify(response));
    }
  });

  // If player leaving is the game master, appoint a new game master
  // If no more players are left, set gameMaster to null.
  response2 = {
    type:'updateState',
    players: room.players
  }
  if (id == gameMaster) {
    if (room.players.length > 0) {
      newGameMaster = room.players[0].id;
      console.log("Game master left the room. Appointing " + newGameMaster + " as gameMaster.");
      room.setGameMaster(newGameMaster);
      response2.gameMaster = newGameMaster;
    } else {
      console.log("No more players in room. Room gameMaster set to null.")
      room.setGameMaster(null);
      response2.gameMaster = null;
    }
  }
  broadcast(response2, room);
}

function addName(ws, obj, room) {
  room.addPlayer(new playerFunction.Player(ws.id, obj.player));
  let response = {
    type: 'updateState',
    players: _.cloneDeep(room.players)
  };
  broadcast(response, room);
  broadcastRoomsInfo();
}

function changeRoomSettings(ws, obj, room) {
  console.log('Receive new settings for room: ' + room.id);
  room.settings = obj.settings;
  let response = {
    type: 'updateState',
    roomSettings: room.settings
  }
  broadcast(response, room);
  broadcastRoomsInfo();
}

function startRound(ws, obj, room) {
  let response = {
    type: 'updateState'
  };
  room.startRound();
  let counter = room.settings.timesToGuessPerSet[room.set-1];
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
      response.wordsValidated = [];
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
  let response = {
    type: 'updateState',
    words: room.words
  }
  broadcast(response, room);
}

function deleteWord(ws, obj, room) {
  room.deleteWord(obj.word);
}

function validateWord(ws, obj, room) {
  room.validateWord(obj.team);
  let response = {
    type: 'updateState',
    words: room.wordsOfRound,
    wordsValidated: room.wordsValidated,
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
  response.gameMaster = room.gameMaster;
  ws.send(JSON.stringify(response));
}

function setGif(ws, obj, room) {
  let response = {};
  response.type = 'updateState';
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

function broadcastRoomsInfo() {
    // Broadcast new room settings to all clients
    var rooms_data = [];
    for (const [id, room] of rooms.entries()) {
      rooms_data.push(room.serialize());
    }
    let response = {
      type: 'updateState',
      rooms: rooms_data
    }
    broadcast(response);
}

module.exports.messageHandler = messageHandler;
module.exports.rooms = rooms;
