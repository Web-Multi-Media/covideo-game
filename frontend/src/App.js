import React, {useEffect, useState} from 'react';
import './App.css';
import MainScreen from "./component/MainScreen";
import ConnectionScreen from "./component/ConnectionScreen";
const {handleServerResponse} = require("./webSocket/rootedFunctions");
const URL = 'ws://localhost:8000';

function App() {

    let ws = new WebSocket(URL);
    const [inRoom, setInRoom] = useState(false);
    const [gameState, setGameState] = useState({users : [], isGameMaster: false, gameIsReady:false, teams: [], words: []});

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
        ws.send(JSON.stringify({type: 'addName', name: name}));
    };

    const sendWord =  (word) => {
        ws.send(JSON.stringify({type: 'addWord', word: word}));
    };

    const sendGameIsReady =  () => {
        ws.send(JSON.stringify({type: 'gameIsReady'}));
    };

    const users = gameState.users;
    const gameMaster = gameState.isGameMaster;

    return (

        <div className="App">
        {!gameState.gameIsReady &&
            <React.Fragment>
            <p>GAMESTATE {JSON.stringify(gameState)}</p>
            <ConnectionScreen
                users = {users}
                isGameMaster = {gameMaster}
                onGameReady = {sendGameIsReady}
                onSend = {sendMessage}
                onSendWord = {sendWord}
            />
            </React.Fragment>
        }
        {gameState.gameIsReady &&
        <MainScreen
            gameState={gameState}
        />
        }
    </div>
  );
}

export default App;
