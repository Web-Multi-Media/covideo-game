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
  'gameStarted': gameStarted,
  'startRound': startRound,
  'validateWord': validateWord,
  'nextWord': nextWord,
  'createRoom': createRoom,
  'joinRoom': joinRoom,
  'getRooms': getRooms,
  'leaveRoom': leaveRoom,
  'setGif': setGif,
  'chatMessage': chatMessage
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
  console.log(`ws client: ${ws.id} | React request: ${JSON.stringify(obj, null)}`);
  const room = ws.roomId ? rooms.get(ws.roomId) : {};
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
  ws.playerName = playerName ? playerName : utils.getRandomPlayerName(ws.id);
  ws.roomId = rooms.has(roomId) ?  roomId : '';
  let room = rooms.get(ws.roomId);
  let response = {
    type: 'updateState',
    player: {
      id: ws.id,
      name: ws.playerName
    },
    global: {
      rooms: serializeRooms(),
      joinedRoom: room !== undefined,
      socketConnected: true
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
  console.log(`Room ${room.id} created`);
  addPlayerToRoom(ws, room);
  let response = {
    type: 'updateState',
    global: {
      joinedRoom: true,
    },
    player: {
      words: []
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
  if (room === undefined){ return; }
  ws.roomId = roomId;
  addPlayerToRoom(ws, room);
  let response = {
    type: 'updateState',
    global: {
      joinedRoom: true,
    },
    room: room.serialize()
  };
  //BUG ?? we send the joinedRoom To EveryOne in the room
  broadcast(response, room);
  broadcastRoomsInfo();
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
  let room = rooms.get(roomId);
  let gameMaster = room.gameMaster;
  room.removePlayer(clientId);
  client = getClient(clientId);
  client.roomId = '';
  console.log(`Player ${ws.playerName} left room ${room.id}`);

  // Send individual response to client to disconnect from room
  let response = {
    type: 'updateState',
    global: {
      joinedRoom: false,
    }
  };

  // Send broadcast response to other clients.
  if (room.players.length === 0){ // no players left in room, delete room
    console.log(`No more players in room. Deleting room ${room.id}`);
    rooms.delete(room.id);
    sendMessage(response, clientId);
    broadcastRoomsInfo();
  } else {
    console.log(`Updating players in room and broadcasting to clients.`);
    let response2 = {
      type:'updateState',
      room: {
        players: room.players.map(player => player.serialize())
      }
    }
    broadCastTwoResponses(response2, response, clientId, room);
    broadcastRoomsInfo();
  }
}

/**
 * Add a player to a room.
 * Set new game master if room does not have one.
 * @param {object} ws   Websocket.
 * @param {Room}   room Current room.
 */
function addPlayerToRoom(ws, room){
  let player = new playerFunction.Player(ws.id, ws.playerName);
  room.addPlayer(player);
  changePlayerName(ws, {playerName: ws.playerName});
  console.log(`Player ${ws.playerName} added to room ${room.id}`);
  if (room.gameMaster === null) { // if no game master in room, set it
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

  // remove excedent words when num word setting has been decreased
  if (room.settings.numWordsPerPlayer > obj.settings.numWordsPerPlayer) {
    room.players.forEach(function each(player) {
      var numWordsToRemove = player.words.length - obj.settings.numWordsPerPlayer;
      if (numWordsToRemove > 0) {
        player.words.splice(-1, numWordsToRemove);
      }
    });
  }
  
  room.settings = obj.settings;

  // send different responses to all players in the room with their respective word count
  let baseResponse = {
    type: 'updateState',
    room: {
      settings: room.settings,
      players: room.players.map(player => player.serialize())
    },
  }
  webSockets.clients.forEach((client) =>{
    if (room.players.map(player => player.id).includes(client.id)) {
      let response = _.cloneDeep(baseResponse);
      response.player = {
        words: room.players.find(player => player.id === client.id).words
      };
      client.send(JSON.stringify(response));
    }
  });

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
      players: room.players.map(player => player.serialize())
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

  room.startRound(obj.team);
  let response = {
    type: 'updateState',
    room: {
      wordsValidated: [],
      gifUrl: ''
    }
  };

  let counter = room.settings.timesToGuessPerSet[room.set-1];
  let WinnerCountdown = setInterval(function() {
    counter = counter - 0.1;
    let isSetfinished = room.setFinished;
    response.room.setFinished = isSetfinished;
    if (counter <= 0 || isSetfinished === true) {
      if (isSetfinished === true) {
        room.startSet();
        if (room.set > 3){
          room.resetGame();
          let response = {
            type: 'updateState',
            player: {
              words: []
            },
            room: room.serialize()
          }
          broadcast(response, room);
          clearInterval(WinnerCountdown);
          return;
        }
        counter = 0;
      }
      room.setActivePlayer();
      response.room.set = room.set;
      response.room.startTimer = false;
      response.room.activePlayer = room.activePlayer;
      response.room.roundDescription = [];
      room.startTimer = false;
      room.roundDescription = [];
      broadcast(response, room);
      clearInterval(WinnerCountdown);
    }
  }, 100);

  room.startTimer = true;
  response.room.startTimer = room.startTimer;
  let responseToSpecific = _.cloneDeep(response);
  responseToSpecific.room.wordToGuess = room.wordsOfRound[0];
  broadCastTwoResponses(response, responseToSpecific, room.activePlayer.id, room);
}

/**
 * Start game, start first round, set active player.
 * Broadcast update room attributes to clients in room.
 * @param  {object} ws   Websocket.
 * @param  {object} obj  Message.
 * @param  {Room} room Current room.
 */
function gameStarted(ws, obj, room) {
  room.startGame();
  room.startRound();
  room.setActivePlayer();
  room.gameStarted = true;
  let response = {
    type: 'gameStarted',
    room: {
      gameStarted: true,
      teams: room.teams,
      activePlayer: room.activePlayer,
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
  const playerWords = room.addWord(obj.word, ws.id);
  let responseToBroadCast = {
    type: 'updateState',
    room:{
      players: room.players.map(player => player.serialize())
    }
  }
  let specificResponse = _.cloneDeep(responseToBroadCast)
  specificResponse.player = {words: playerWords};
  broadCastTwoResponses(responseToBroadCast, specificResponse, ws.id, room);
}

/**
 * Delete word from current room (used before game starts).
 * @param  {object} ws   Websocket.
 * @param  {object} obj  Message.
 * @param  {Room}   room Current room.
 */
function deleteWord(ws, obj, room) {
  const playerWords = room.deleteWord(obj.word, ws.id);
  let responseToBroadCast = {
    type: 'updateState',
    room:{
      players: room.players.map(player => player.serialize())
    }
  }
  let specificResponse = _.cloneDeep(responseToBroadCast)
  specificResponse.player = {words: playerWords};
  broadCastTwoResponses(responseToBroadCast, specificResponse, ws.id, room);
}

/**
 * Validate word and increase team score.
 * Broadcast updated team scores and words to current room.
 * @param  {object} ws   Websocket.
 * @param  {object} obj  Message.
 * @param  {Room}   room Current room.
 */
function validateWord(ws, obj, room) {
  if(room.validateWord(obj.team, obj.message)) {
    const responseToBroadCast = {
      type: 'updateState',
      room: {
        wordsValidated: room.wordsValidated.length,
        team1Score: room.scoreFirstTeam,
        team2Score: room.scoreSecondTeam,
        gifUrl: room.gifUrl
      }
    };
    let responseToSpecific = _.cloneDeep(responseToBroadCast);
    responseToSpecific.room.wordToGuess = room.wordsOfRound[0];

    broadCastTwoResponses(responseToBroadCast, responseToSpecific, room.activePlayer.id, room);
  }
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
      wordToGuess: room.wordsOfRound[0],
      wordDescription: room.roundDescription,
      gifUrl: ''
    }
  };
  if (room.set <= 2){
    sendMessage(response, ws.id);
  } else {
    let responseToBroadCast = {
      type: 'updateState',
      room: {
        gifUrl: ''
      }
    };
    broadCastTwoResponses(responseToBroadCast, response, ws.id, room);
  }
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
 * Send chat message.
 * Broadcast chat message to clients in room.
 * @param {object} ws   Websocket.
 * @param {object} obj  Message.
 * @param {Room}   room Current room.
 */
function chatMessage(ws, obj, room) {
  let response = {
    type: 'updateState',
    room:{}
  };
  console.log('room.setFinished' + room.startTimer);
  if(room.startTimer){
    if(ws.id === room.activePlayer.id){
      room.roundDescription.push({username: ws.playerName,message: obj.message})
      response.room.roundDescription = room.roundDescription;
    } else{
      response.room.incomingChatMessage= {
          username: ws.playerName,
              message: obj.message
        };
      validateWord(ws, obj, room);
      }
    }else {
    response.room.incomingChatMessage= {
      username: ws.playerName,
      message: obj.message
    };
  }
  console.log(JSON.stringify(response));
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
function broadcast(msg, room, senderId= '') {
  webSockets.clients.forEach(function each(client) {
    if (room === undefined && !client.roomId) {
      client.send(JSON.stringify(msg));
    } else if (client.id !== senderId && room && room.id === client.roomId) {
      client.send(JSON.stringify(msg));
    }
  });
}

/**
 * Broadcast one response to everyone and a second for a specific player
 */
function broadCastTwoResponses(responseToBroadCast, responseToSpecific, senderId, room) {
  broadcast(responseToBroadCast, room, senderId);
  sendMessage(responseToSpecific, senderId);
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
