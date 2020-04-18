const _ = require('lodash');
const playerFunction = require('./Player.js');
const utils = require('./utils')
const roomfunc = require('./Room.js');

let webSockets = {};
var rooms = new Map();

let rootingFunction = {
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

/**
 * Handles an incoming message from the Websocket
 * @param  {String} message Incoming message
 * @param  {object} ws      Websocket
 * @param  {list}   wss     All websockets
 */
function messageHandler(message, ws, wss) {
  webSockets = wss;
  const obj = JSON.parse(message);
  console.log(ws.id + ' React request : ' + obj.type);
  const room = ws.roomId
    ? rooms.get(ws.roomId)
    : {};
  rootingFunction[obj.type](ws, obj, room);
}

/**
 * Function triggered when a player connects to the app.
 * Retrieves player info (id, playerName, roomId) from cookies to handle
 * browser page refreshes.
 * Automatically reconnect client to room if it was in a room before.
 * @param  {object} ws        Websocket-
 * @param  {object} urlParams URL parameters object.
 */
function connectPlayer(ws, urlParams) {
  const playerId = urlParams.get('playerId');
  const roomId = urlParams.get('roomId');
  const playerName = urlParams.get('playerName');
  ws.id = playerId ?  playerId : utils.getUniqueID();
  ws.playerName = playerName ? playerName : '';
  ws.roomId = rooms.has(roomId) ?  roomId : '';
  let room = rooms.get(ws.roomId);
  let response = {
    type: 'updateState',
    player: {
      id: ws.id,
      name: ws.playerName,
    },
    global: {
      rooms: serializeRooms(),
      joinedRoom: room !== undefined
    }
  };
  if (room) {
    response.room = room.serialize();
  }
  ws.send(JSON.stringify(response));
}

/**
 * Send rooms info to the client websocket.
 * @param  {object} ws  Websocket
 * @param  {object} obj Message
 */
function getRooms(ws, obj) {
  let response = {
    type: 'updateState',
    global: {
      rooms: serializeRooms()
    }
  };
  ws.send(JSON.stringify(response));
}

/**
 * Create a new room.
 * Send room info to client.
 * Broadcast new room to clients not in a room.
 * @param  {object} ws  Websocket
 * @param  {object} obj Message
 */
function createRoom(ws, obj) {
  let roomId = utils.getUniqueID();
  let room = new roomfunc.Room(roomId);
  room.setGameMaster(ws.id);
  rooms.set(roomId, room);
  ws.roomId = roomId;
  addPlayerToRoom(ws, room);
  let response = {
    type: 'updateState',
    global: {
      joinedRoom: true,
    },
    room: room.serialize()
  };
  ws.send(JSON.stringify(response));
  broadcastRoomsInfo();
}

/**
 * Join an existing room.
 * Broadcast room info to clients in room.
 * Broadcast room player list to clients not currently in a room.
 * @param  {object} ws  Websocket
 * @param  {object} obj Message
 */
function joinRoom(ws, obj) {
  let roomId = obj.roomId;
  let room = rooms.get(roomId);
  if (room !== undefined) { // room already exists
    ws.roomId = roomId;
    addPlayerToRoom(ws, room);
    let response = {
      type: 'updateState',
      global: {
        joinedRoom: true,
      },
      room: room.serialize()
    };
    broadcast(response, room);
    broadcastRoomsInfo();
  } else { // room does not exist - can happen if trying to access deleted room URL
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

/**
 * Leave current room.
 * Broadcast player list to clients in room.
 * Can be called by another client than the one leaving (kick player).
 * @param  {object} ws  Websocket
 * @param  {object} obj Message
 */
function leaveRoom(ws, obj) {
  let roomId = ws.roomId;
  let clientId = obj.playerId;
  if (!clientId){
    clientId = ws.id;
  }
  console.log("Client id to leave " + clientId);
  console.log("Current client id " + ws.id);
  let room = rooms.get(roomId);
  let gameMaster = room.gameMaster;
  room.removePlayer(clientId);
  let response = {
    type: 'updateState',
    global: {
      joinedRoom: false,
      rooms: serializeRooms()
    },
    room: {
      id: ''
    }
  };
  sendMessage(response, clientId);

  let response2 = {
    type:'updateState',
    room: {
      players: room.players
    }
  };
  // If player leaving is the game master, appoint a new game master
  // If no more players are left, set gameMaster to null.
  if (clientId == gameMaster) {
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

/**
 * Add a player to a room.
 * Set new game master if room does not have one.
 * @param {object} ws   Websocket.
 * @param {Room}   room Current room.
 */
function addPlayerToRoom(ws, room){
  let playerName = ws.playerName;
  console.log("player name: " + ws.playerName)
  if (playerName === ''){
    let lastChars = ws.id.substr(ws.id.length - 4);
    playerName = `Player-${lastChars}`;
  }
  let player = new playerFunction.Player(ws.id, playerName);
  room.addPlayer(player);
  if (room.gameMaster === null) {
    console.log("No game master in room. Appointing " + ws.id);
    room.setGameMaster(ws.id);
  }
}

/**
 * Change current room settings.
 * Broadcast room settings to clients in room.
 * Broadcast room list to clients not in room.
 * @param  {object} ws   Websocket.
 * @param  {object} obj  Message.
 * @param  {Room}   room Current room.
 */
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

/**
 * Serialize rooms.
 * @return {list} List of serialized rooms.
 */
function serializeRooms(){
  let rooms_data = [];
  for (const [id, room] of rooms.entries()) {
    rooms_data.push(room.serialize());
  }
  return rooms_data;
}

/**
 * Change player name.
 * Update Websocket 'playerName' property and player object.
 * Send updated player info to current client.
 * Broadcast updated room players info to current room.
 * Broadcast updated room player list to clients not in room.
 * @param  {object} ws  Websocket.
 * @param  {object} obj Message.
 */
function changePlayerName(ws, obj){
  let room = rooms.get(ws.roomId);
  let players = room.players;
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
    player: player
  };
  ws.send(JSON.stringify(response2));
  broadcast(response, room);
  broadcastRoomsInfo();
}

/**
 * Start round and the countdown.
 * Broadcast new active player to clients in room when the set is finished.
 * Broadcast end of round to clients in room when round is finished.
 * @param  {object} ws   Websocket.
 * @param  {object} obj  Message.
 * @param  {Room}   room Current room.
 */
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
  response.room.wordToGuess = room.wordsOfRound[0];
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
      response.room.set = room.set;
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

/**
 * Start game, start first round, set active player.
 * Broadcast update room attributes to clients in room.
 * @param  {object} ws   Websocket.
 * @param  {object} obj  Message.
 * @param  {Room} room Current room.
 */
function gameIsReady(ws, obj, room) {
  room.startGame();
  room.startRound();
  room.setActivePlayer();
  let response = {
    type: 'updateState',
    room: {
      gameIsReady: true,
      teams: room.teams,
      wordToGuess: room.wordsOfRound[0],
      activePlayer: room.activePlayer,
      playerTeam: room.teams[0].findIndex((element) => element === ws.player) !== -1
      ? 1
      : 2,
    }
  };
  broadcast(response, room);
}

/**
 * Add word to current room (used before game starts).
 * @param  {object} ws   Websocket.
 * @param  {object} obj  Message.
 * @param  {Room}   room Current room.
 */
function addWord(ws, obj, room) {
  room.addWord(obj.word, ws.id);
  let response = {
    type: 'updateState',
    room: {
      words: room.getWords() // BUG: why are we broadcasting all the words again ?
    }
  };
  broadcast(response, room);
}

/**
 * Delete word from current room (used before game starts).
 * @param  {object} ws   Websocket.
 * @param  {object} obj  Message.
 * @param  {Room}   room Current room.
 */
function deleteWord(ws, obj, room) {
  room.deleteWord(obj.word, ws.id); // BUG: Why are we not broadcasting the updated words again ?
}

/**
 * Validate word and increase team score.
 * Broadcast updated team scores and words to current room.
 * @param  {object} ws   Websocket.
 * @param  {object} obj  Message.
 * @param  {Room}   room Current room.
 */
function validateWord(ws, obj, room) {
  room.validateWord(obj.team);
  let response = {
    type: 'updateState',
    room: {
      wordToGuess: room.wordsOfRound[0],
      wordsValidated: room.wordsValidated.length,
      team1Score: room.scoreFirstTeam,
      team2Score: room.scoreSecondTeam,
      gifUrl: room.gifUrl
    }
  };
  broadcast(response, room);
}

/**
 * Get next word in current game.
 * Broadcast next word to the active player.
 * Reset gif URL (clear gif from screen).
 * @param  {object} ws   Websocket.
 * @param  {object} obj  Message.
 * @param  {Room}   room Current room.
 */
function nextWord(ws, obj, room) {
  room.skipWord();
  let response = {
    type: 'updateState',
    room: {
      wordsOfRound: room.wordsOfRound,
      gifUrl: ''
    }
  };
  broadcast(response, room); // BUG: should send just the next word to the activePlayer.
}

/**
 * Set Gif URL.
 * Broadcast Gif to clients in room.
 * @param {object} ws   Websocket.
 * @param {object} obj  Message.
 * @param {Room}   room Current room.
 */
function setGif(ws, obj, room) {
  room.setGifUrl(obj.gifUrl);
  let response = {
    type: 'updateState',
    room: {
      gifUrl: obj.gifUrl
    }
  };
  broadcast(response, room);
}

/**
 * Get a websocket client by id.
 * @param  {String} clientId Client id.
 * @return {object}          Client Websocket or undefined if not found.
 */
function getClient(clientId){
  let ws = undefined;
  webSockets.clients.forEach(function each(client) {
    if (client.id === clientId){
      ws = client;
    }
  });
  return ws;
}

/**
 * Send a message to a specific client identified by clientId.
 * @param  {object} message  Message to send.
 * @param  {String} clientId Client id to send message to.
 */
function sendMessage(msg, clientId){
  let ws = getClient(clientId);
  if (!ws){
    console.log(`Could not fetch client '${clientId}'`);
    return;
  }
  ws.send(JSON.stringify(msg));
}

/**
 * Broadcast a message to clients.
 * If room is set, restrict the broadcasting to clients in room.
 * If room is unset, restrict the broadcasting to clients not in room.
 * @param  {object} msg      Message.
 * @param  {Room}   room     Room.
 * @param  {String} senderId Send id.
 */
function broadcast(msg, room) {
  webSockets.clients.forEach(function each(client) {
    if (room === undefined && !client.roomId) {
      client.send(JSON.stringify(msg));
    } else if (room && room.id === client.roomId) {
      client.send(JSON.stringify(msg));
    }
  });
}

/**
 * Broadcast rooms to all clients not in a room.
 */
function broadcastRoomsInfo() {
  broadcast({
    type: 'updateState',
    global: {
      rooms: serializeRooms()
    }
  });
}

module.exports.messageHandler = messageHandler;
module.exports.connectPlayer = connectPlayer;
module.exports.rooms = rooms;
