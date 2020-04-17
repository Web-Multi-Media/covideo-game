const _ = require('lodash');
const playerFunction = require('./Player.js');
const utils = require('./utils')
const roomfunc = require('./Room.js');

let webSockets = {};
var rooms = new Map();

let rootingFunction = {
  'addPlayer': addPlayer,
  'changePlayerName': changePlayerName,
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
  console.log("Current player name " + ws.playerName);

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
      id: ws.roomId,
      settings: {}
    },
    global: {
      rooms: rooms_data,
      joinedRoom: roomId !== ''
    }
  };
  let room = rooms.get(ws.roomId);
  if (room){
    response.room = room.serialize();
  }
  ws.send(JSON.stringify(response));
}

function getRooms(ws, obj) {
  let rooms_data = [];
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

function addPlayerToRoom(ws, room){
  let playerName = ws.playerName;
  console.log("player name: " + ws.playerName)
  if (playerName === ''){
    playerName = "Anon" + ws.id;
  }
  let player = new playerFunction.Player(ws.id, playerName);
  room.addPlayer(player);
}

function createRoom(ws, obj) {
  let roomId = utils.getUniqueID();

  // Add new room
  let room = new roomfunc.Room(roomId);
  room.setGameMaster(ws.id);
  rooms.set(roomId, room);

  // Add player to room
  addPlayerToRoom(ws, room);

  //  Send room info for current client and connect him to the room
  console.log('Create room ' + roomId);
  let response = {
    type: 'updateState',
    global: {
      joinedRoom: true,
    },
    room: room.serialize()
  };
  console.log(response);
  ws.roomId = roomId;
  ws.send(JSON.stringify(response));

  // Broadcast new room info to all clients
  broadcastRoomsInfo();
}

function joinRoom(ws, obj) {
  let roomId = obj.roomId;
  let room = rooms.get(roomId);

  if (room !== undefined) { // room already exists
    // Set room id in web socket
    ws.roomId = roomId;

    // Add user to room
    addPlayerToRoom(ws, room);

    // Set user as game master if none exist
    if (room.gameMaster === null) {
      console.log("No game master in room. Appointing " + ws.id);
      room.setGameMaster(ws.id);
    }

    let response = {
      type: 'updateState',
      global: {
        joinedRoom: true,
      },
      room: room.serialize()
    };
    ws.send(JSON.stringify(response));
  } else {
    // room does not exist - can happen if trying to access deleted room URL
    let response = {
      type: 'updateState',
      global: {
        joinedRoom: false,
      },
      room: {
        id: ''
      }
    };
    ws.roomId = '';
    ws.send(JSON.stringify(response));
  }
}

function leaveRoom(ws, obj) {
  let roomId = ws.roomId;
  let id = obj.playerId;
  let room = rooms.get(roomId);
  let gameMaster = room.gameMaster;

  // Remove player from room
  // Set state back to room list
  console.log('Removing ' + id + ' from room ' + roomId);
  room.removePlayer(id);

  // Get list of rooms
  let rooms_data = [];
  for (const [id, room] of rooms.entries()) {
    console.log('Found room id ' + id + '');
    rooms_data.push(room.serialize());
  }

  let response = {
    type: 'updateState',
    global: {
      joinedRoom: false,
      rooms: rooms_data
    },
    room: {
      id: ''
    }
  };
  webSockets.clients.forEach(function each(client) {
    if (client.id === id) {
      client.send(JSON.stringify(response));
    }
  });

  // If player leaving is the game master, appoint a new game master
  // If no more players are left, set gameMaster to null.
  let response2 = {
    type:'updateState',
    room: {
      players: room.players
    }
  };
  if (id == gameMaster) {
    if (room.players.length > 0) {
      newGameMaster = room.players[0].id;
      console.log("Game master left the room. Appointing " + newGameMaster + " as gameMaster.");
      room.setGameMaster(newGameMaster);
      response2.room.gameMaster = newGameMaster;
    }else {
      console.log("No more players in room. Room gameMaster set to null.")
      room.setGameMaster(null);
      response2.room.gameMaster = null;
    }
  }
  broadcast(response2, room);
}

function changePlayerName(ws, obj){
  let room = rooms.get(ws.roomId);
  let players = room.players;
  let player = {};
  room.players.map(function(p){
    if (p.id === ws.id){
      player = p;
      ws.playerName = obj.playerName;
      p.name = obj.playerName;
    }
  });
  let response = {
    type: 'updateState',
    room: {
      players: room.players
    }
  }
  let response2 = {
    type: 'updateState',
    player: player,
    global: {
      joinedRoom: true,
    },
    room: {
      id: room.id,
    }
  };
  ws.send(JSON.stringify(response2));
  broadcast(response, room);
  broadcastRoomsInfo();
}

function addPlayer(ws, obj, room) {
  // var player = new playerFunction.Player(ws.id, obj.player);
  // var room = rooms.get(roomId);
  // room.addPlayer(player);
  // let response = {
  //   type: 'updateState',
  //   room: {
  //     players: room.players
  //   }
  // };
  // let response2 = {
  //   type: 'updateState',
  //   player: player,
  //   global: {
  //     joinedRoom: true,
  //   },
  //   room: {
  //     id: room.id,
  //   }
  // };
  // ws.send(JSON.stringify(response2));
  // broadcast(response, room);
  // broadcastRoomsInfo();
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
  room.startRound();
  let response = {
    type: 'updateState',
    room: {
      wordsValidated: [],
      gifUrl: ''
    },
    global: {}
  };
  response.room.wordsOfRound = room.wordsOfRound;
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
      response.room.startTimer = false;
      response.room.activePlayer = room.activePlayer;
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
      wordsOfRound: room.wordsOfRound,
      activePlayer: room.activePlayer,
      playerTeam: room.teams[0].findIndex((element) => element === ws.player) !== -1
      ? 1
      : 2,
    }
  };
  broadcast(response, room);
}

function addWord(ws, obj, room) {
  room.addWord(obj.word, ws.id);
  let response = {
    type: 'updateState',
    room: {
      words: room.getWords()
    }
  };
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
      wordsValidated: room.wordsValidated.length,
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
    };
    broadcast(response);
}

module.exports.messageHandler = messageHandler;
module.exports.connectPlayer = connectPlayer;
module.exports.rooms = rooms;
