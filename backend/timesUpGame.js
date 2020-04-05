let io;
let gameSocket;
let users = [];

/**
 * This function is called by index.js to initialize a new game instance.
 *
 * @param sio The Socket.IO library
 * @param socket The socket object for the connected client.
 */
exports.initGame = function(sio, socket){
    io = sio;
    gameSocket = socket;
    console.log('init')
    gameSocket.emit('connected', { message: "You are connected!" });
    // Host Events


};

/**
 * Get a word for the host, and a list of words for the player.
 *
 * @param wordPoolIndex
 * @param gameId The room identifier
 */
function addName({name}) {
        users = [...users, name];
        console.log(users);
        gameSocket.emit('user Added', { users: users });
}

