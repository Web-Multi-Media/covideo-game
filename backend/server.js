// Import the Express module
const bodyParser = require('body-parser');

// Import the 'path' module (packaged with Node.js)
const path = require('path');

// Create a new instance of Express
const express = require('express');
const { createServer } = require('http');
let app = express();

const server = createServer(app);
const WebSocket = require('ws');

const wss = new WebSocket.Server({ server });

require('dotenv').config();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = 8000;

const  tug = require('./timesUpGame');

// We install the Wildcard middleware

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.static(__dirname+'/../frontend/build/'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/../frontend/build/index.html'));
});


wss.on('connection', function connection(ws) {
    ws.on('message', function incoming( message) {
        tug.initGame(message, ws, wss);
    });
});

server.listen(port, () => {
    console.log(`server listening to port ${port}`);
});

