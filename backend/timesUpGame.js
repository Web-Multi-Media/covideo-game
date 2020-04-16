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
  'changeRoomSettings': changeRoomSettings,
  'gameIsReady': gameIsReady,
  'startRound': startRound,
  'validateWord': validateWord,
  'nextWord': nextWord,
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

function connectPlayer(ws, urlParams) {
  // Set default websockets attributes
  const playerId = urlParams.get('playerId');
  const roomId = urlParams.get('roomId');
  const playerName = urlParams.get('playerName');
  ws.id = playerId ?  playerId : utils.getUniqueID();
  ws.playerName = playerName ? playerName : '';
  ws.roomId = rooms.has(roomId) ?  roomId : '';

  // Get rooms
  let rooms_data = [];
  for (const [id, room] of rooms.entries()) {
    console.log('Found room id ' + id + '');
    rooms_data.push(room.serialize());
  }

  // Send state to client
  let response = {
    type: 'updateState',
    player: {
      id: ws.id,
      name: ws.playerName,
    },
    room: {
      roomId: ws.roomId,
    },
    global: {
      rooms: rooms_data
    }
  };
  var roomData = {};
  var room = rooms.get(ws.roomId);
  if (room){
    roomData = room.serialize();
  }
  console.log('add player id ' + response.player.id);
  ws.send(JSON.stringify({...response, ...roomData}));
}

function getRooms(ws, obj) {
  var rooms_data = [];
  for (const [id, room] of rooms.entries()) {
    console.log('Found room id ' + id + '');
    rooms_data.push(room.serialize());
  }
  let response = {
    type: 'updateState',
    global: {
      rooms: rooms_data
    }
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
    room: room.serialize()
  };
  ws.send(JSON.stringify(response));
  broadcastRoomsInfo();
}

function joinRoom(ws, obj) {
  // Get room
  let roomId = obj.roomId;
  let room = rooms.get(roomId);

  if (room !== undefined) {
    // Set room id in web socket and update state
    ws.roomId = roomId;
    let response = {
      type: 'updateState',
      global: {
        joinedRoom: true,
      },
      room: {
        id: roomId,
        settings: room.settings
      }
    };

    // Set user as game master if none exist
    if (room.gameMaster === null) {
      console.log("No game master in room. Appointing " + ws.id);
      room.setGameMaster(ws.id);
      response.isGameMaster = true;
    }
    response.gameMaster = room.gameMaster;
    ws.send(JSON.stringify(response));
  } else {
    // room does not exist
    let response = {
      type: 'updateState',
      global: {
        joinedRoom: false,
      },
      room: {
        id: ''
      }
    };
    ws.send(JSON.stringify(response));
  }
}

function leaveRoom(ws, obj, room) {
  let roomId = ws.roomId;
  let id = obj.playerId;
  var room = rooms.get(roomId);
  var gameMaster = room.gameMaster;

  // Remove player from room
  // Set state back to room list
  console.log('Removing ' + id + ' from room ' + roomId);
  room.removePlayer(id);
  let response = {
    type: 'updateState',
    global: {
      joinedRoom: false
    }
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
    room: {
      players: room.players
    }
  }
  if (id == gameMaster) {
    if (room.players.length > 0) {
      newGameMaster = room.players[0].id;
      console.log("Game master left the room. Appointing " + newGameMaster + " as gameMaster.");
      room.setGameMaster(newGameMaster);
      response2.room.gameMaster = newGameMaster;
    } else {
      console.log("No more players in room. Room gameMaster set to null.")
      room.setGameMaster(null);
      response2.room.gameMaster = null;
    }
  }
  broadcast(response2, room);
}

function addName(ws, obj, room) {
  var player = new playerFunction.Player(ws.id, obj.player);
  room.addPlayer(player);
  console.log(player);
  let response = {
    type: 'updateState',
    player: player,
    room: {
      players: room.players
    }
  };
  console.log(`Adding player '${player.name}'. Response: ${response}`);
  broadcast(response, room);
  broadcastRoomsInfo();
}

function changeRoomSettings(ws, obj, room) {
  console.log('Receive new settings for room: ' + room.id);
  room.settings = obj.settings;
  let response = {
    type: 'updateState',
    room: {
      settings: room.settings
    }
  };
  broadcast(response, room);
  broadcastRoomsInfo();
}

function startRound(ws, obj, room) {
  room.startTimer = false;
  let response = {
    type: 'updateState',
    room: {
      startTimer: false,
      wordsValidated: [],
      gifUrl: ''
    },
    global: {}
  };
  room.startRound();
  let counter = room.settings.timesToGuessPerSet[room.set-1];
  let WinnerCountdown = setInterval(function() {
    counter = counter - 0.1;
    let isSetfinished = room.setFinished;
    response.room.setFinished = isSetfinished;
    if (counter <= 0 || isSetfinished === true) {
      if (isSetfinished === true) {
        room.startSet();
        counter = 0;
      }
      room.setActivePlayer();
      response.room.activePlayer = room.activePlayer;
      response.room.words = room.wordsOfRound;
      broadcast(response, room);
      clearInterval(WinnerCountdown);
    }
  }, 100);
  room.startTimer = true;
  response.room.startTimer = room.startTimer;
  broadcast(response, room);
}

function gameIsReady(ws, obj, room) {
  room.startGame();
  room.startSet();
  room.startRound();
  room.setActivePlayer();
  let response = {
    type: 'updateState',
    room: {
      gameIsReady: true,
      teams: room.teams,
      words: room.wordsOfRound,
      activePlayer: room.activePlayer,
      playerTeam: room.teams[0].findIndex((element) => element === ws.player) !== -1
      ? 1
      : 2,
    }
  }
  broadcast(response, room);
}

function addWord(ws, obj, room) {
  room.addWord(obj.word, ws.id);
  let response = {
    type: 'updateState',
    room: {
      words: room.getWords()
    }
  }
  broadcast(response, room);
}

function deleteWord(ws, obj, room) {
  room.deleteWord(obj.word, ws.id);
}

function validateWord(ws, obj, room) {
  room.validateWord(obj.team);
  let response = {
    type: 'updateState',
    room: {
      wordsOfRound: room.wordsOfRound,
      wordsValidated: room.wordsValidated,
      team1Score: room.scoreFirstTeam,
      team2Score: room.scoreSecondTeam,
      set: room.set,
      gifUrl: room.gifUrl
    }
  };
  broadcast(response, room);
}

function nextWord(ws, obj, room) {
  room.skipWord();
  let response = {
    type: 'updateState',
    room: {
      wordsOfRound: room.wordsOfRound,
      gifUrl: ''
    }
  };
  broadcast(response, room);
}

function setGif(ws, obj, room) {
  let response = {
    type: 'updateState',
    room: {
      gifUrl: obj.gifUrl
    }
  };
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

function broadcastRoomsInfo() {
    // Broadcast new room settings to all clients
    var rooms_data = [];
    for (const [id, room] of rooms.entries()) {
      rooms_data.push(room.serialize());
    }
    let response = {
      type: 'updateState',
      global: {
        rooms: rooms_data
      }
    }
    broadcast(response);
}

module.exports.messageHandler = messageHandler;
module.exports.connectPlayer = connectPlayer;
module.exports.rooms = rooms;
