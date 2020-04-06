let users = [];
let internWss = {};
let rootingFunction = {
    'addName': addName,
    'getUsers': getUsers
};
/**
 * This function is called by index.js to initialize a new game instance.
 *
 * @param sio The Socket.IO library
 * @param socket The socket object for the connected client.
 *
 */
exports.initGame = function(message, ws, wss){
    internWss = wss;
    const obj = JSON.parse(message);
    rootingFunction[obj.type](ws, obj.value);
};


function addName(ws, name) {
    let response = {};
    response.type ='getUsers'
    users = [...users, name];
    response.value = users
    broadcast(JSON.stringify(response));
}

function getUsers(ws) {
    let response = {};
    response.type ='getUsers';
    response.value = users
    ws.send(JSON.stringify(response));
}

function broadcast(msg) {
    console.log(msg);
    internWss.clients.forEach(function each(client) {
        client.send(msg);
    });
};