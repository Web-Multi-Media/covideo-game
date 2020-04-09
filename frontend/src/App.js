"use strict";

import React, {useEffect, useState} from 'react';
import './App.css';
import MainScreen from "./component/MainScreen";
import ConnectionScreen from "./component/ConnectionScreen";
import handleServerResponse from "./webSocket/rootedFunctions";
import Button from "@material-ui/core/Button";
const URL = 'ws://51.178.18.81';
let ws = new WebSocket(URL);
const id = Math.floor(Math.random() * 1000);

function App() {

    console.log(id);
    const [gameState, setGameState] = useState({
        player: '',
        users : [],
        isGameMaster: false,
        gameIsReady:false,
        teams: [],
        playerTeam: 0,
        team1Score: 0,
        team2Score: 0,
        words: [],
        setFinished: false,
        set: 1,
        activePlayer: '',
        startTimer: '',
        timerDuration: 15,
        round: 0,
    });

   useEffect(() => {
       ws.onopen = function() {
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

   const timerIsDone = () => {
       console.log('timer Is Done');
       setGameState({...gameState, startTimer: false})
       if(gameState.player === gameState.activePlayer){
           ws.send(JSON.stringify({type: 'handleRound'}));
       }
   };

    const sendMessage =  (name) => {
        ws.send(JSON.stringify({type: 'addName', player: name}));
    };

    const sendWord =  (word) => {
        ws.send(JSON.stringify({type: 'addWord', word: word}));
    };

    const sendGameIsReady =  () => {
        ws.send(JSON.stringify({type: 'gameIsReady'}));
    };

    const startSet =  () => {
        ws.send(JSON.stringify({type: 'startSet'}));
    };

    const nextWord =  () => {
        ws.send(JSON.stringify({type: 'nextWord'}));
    };

    const validateWord =  () => {
        ws.send(JSON.stringify({type: 'validateWord', team: gameState.playerTeam}));
    };

    const resetSockets =  () => {
        ws.send(JSON.stringify({type: 'resetGame'}));
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
            finishTimer = {timerIsDone}
            gameState={gameState}
            startSet = {startSet}
            validateWord = {validateWord}
            nextWord = {nextWord}
        />
        }
            {gameMaster &&
            <Button className="margButt" variant="contained" color="primary" onClick={resetSockets} >
                RESET GAME
            </Button>
            }

    </div>
  );
}

export default App;
