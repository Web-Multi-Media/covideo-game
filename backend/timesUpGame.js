let io;
let gameSocket;
let users = [];

/**
 * This function is called by index.js to initialize a new game instance.
 *
 * @param sio The Socket.IO library
 * @param socket The socket object for the connected client.
 */
exports.initGame = function(message, ws){
    const obj = JSON.parse(message);
    console.log('received');
    switch(obj.type) {
        case 'add user':
            // code block
            console.log('add user server');
            addName(obj.value, ws);
            break;
        default:
        // code block
            console.log('type inconnu');
            break;
    }

};

/**
 * Get a word for the host, and a list of words for the player.
 *
 * @param wordPoolIndex
 * @param gameId The room identifier
 */
function addName(name, ws) {
        let response = {};
        response.type ='added user'
        users = [...users, name];
        response.value = users;
        ws.send(JSON.stringify(response));
}

