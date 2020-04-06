import React, {useEffect, useState} from 'react';
import './App.css';
import MainScreen from "./component/MainScreen";
import ConnectionScreen from "./component/ConnectionScreen";
const {handleServerResponse} = require("./webSocket/rootedFunctions");
const URL = 'ws://localhost:8000';

function App() {

    let ws = new WebSocket(URL);
    const [inRoom, setInRoom] = useState(false);
    const [gameState, setGameState] = useState({users : []});

   useEffect(() => {
       ws.onopen = function() {
           console.log('service Connected');
            ws.send(JSON.stringify({type: 'getUsers'}));
       };
   }, []);

   useEffect(() => {
       ws.onmessage = (message) => {
           const obj = JSON.parse(message.data);
           console.log('new event : ' + obj.type);
           handleServerResponse(obj, gameState, setGameState);
       };
   });

    const sendMessage =  (name) => {
        ws.send(JSON.stringify({type: 'addName', value: name}));
    };

    const users = gameState.users;
    const player = gameState.player;

    return (

        <div className="App">
        {!inRoom &&
            <React.Fragment>
            <p>GAMESTATE {JSON.stringify(gameState)}</p>
            <ConnectionScreen
                player = {player}
                users = {users}
                onSend = {sendMessage}
            />
            </React.Fragment>
        }
        {inRoom && <MainScreen/>}
    </div>
  );
}

export default App;
