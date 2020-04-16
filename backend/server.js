const bodyParser = require('body-parser');
const path = require('path');
var schedule = require('node-schedule');
const WebSocket = require('ws');
const express = require('express');
const {createServer} = require('http');
const config = require('./env.json')[process.env.NODE_ENV || 'development'];
const game = require('./timesUpGame.js');
const utils = require('./utils');


// Create a new instance of Express
let app = express();


const server = createServer(app);

const wss = new WebSocket.Server({server});

require('dotenv').config();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = config.PORT;



const AUTO_DELETE_ROOM_TASK_EVERY = "0 * * * *";
const AUTO_DELETE_ROOM_TASK_TIME_OUT = 30 * 60 * 1000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.static(__dirname + '/../frontend/build/'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../frontend/build/index.html'));
});



wss.on('connection', function connection(ws, sed) {
  const urlParams = new URLSearchParams(sed.url.substring(1));
  const playerId = urlParams.get('playerId');
  const roomId = urlParams.get('roomId');
  const playerName = urlParams.get('playerName');
  ws.id = playerId ?  playerId : utils.getUniqueID();
  ws.roomId = rooms.has(roomId) ?  roomId : undefined;
  ws.player = playerName ? playerName : undefined;
  wss.clients.forEach(function each(client) {
    console.log('Client.ID: ' + client.id);
  });
  game.connectPlayer(ws);

  ws.on('message', function incoming(message) {
    game.messageHandler(message, ws, wss);
  });
});

// task schedule for auto removing inactive rooms
schedule.scheduleJob(AUTO_DELETE_ROOM_TASK_EVERY, function() {
  console.log('Run scheduled job auto room delete');
  game.rooms.forEach(function(room, roomId, map) {
    if (Date.now() - room.lastActivity > AUTO_DELETE_ROOM_TASK_TIME_OUT) {
      map.delete(roomId);
      console.log('Deleted room with id: ' + roomId);
    }
  })
});

server.listen(port, () => {
  console.log(`server listening to port ${port}`);
});
