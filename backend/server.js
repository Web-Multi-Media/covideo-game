const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const wildcard = require('@wildcard-api/server/express'); // npm install @wildcard-api/server

const app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = 8000;

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

app.use(wildcard(getContext));

// `getContext` is called on every API request. It defines the `context` object.
// `req` is Express' request object
async function getContext(req) {
    const context = {};
    // Authentication middlewares usually make user information available at `req.user`.
    context.user = req.user;
    return context;
}

//app.use(express.static(__dirname+'/../wildcard-front/build/'));
//app.use(express.static(path.join(__dirname, 'frontend/build')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname+'/../wildcard-front/build/index.html'));
// });


app.listen(port);

