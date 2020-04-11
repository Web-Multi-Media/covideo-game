"use strict";

import React, {useEffect, useState} from 'react';
import './App.css';
import MainScreen from "./component/MainScreen";
import ConnectionScreen from "./component/ConnectionScreen";
import handleServerResponse from "./webSocket/rootedFunctions";
import Button from "@material-ui/core/Button";
import SelectRoomScreen from "./component/SelectRoomScreen";
const URL = 'ws://localhost:8000';
let ws = new WebSocket(URL);
const id = Math.floor(Math.random() * 1000);

function App() {

    console.log(id);
    const [gameState, setGameState] = useState({
        player: '',
        users : [],
        isGameMaster: false,
        gameIsReady: false,
        teams: [],
        playerTeam: 0,
        team1Score: 0,
        team2Score: 0,
        words: [],
        setFinished: false,
        set: 1,
        activePlayer: '',
        startTimer: false,
        duration: 0,
        round: 0,
        timeLeft: 0,
        joinedRoom: false,
        roomId: '',
    });

   useEffect(() => {
        if (gameState.joinedRoom === true) {
            ws.send(JSON.stringify({type: 'getUsers'}));
        }
   }, [gameState.joinedRoom]);

    useEffect(() => {
        if (gameState.roomId !== '') {
            joinRoom(gameState.roomId);
        }
   }, [gameState.roomId]);

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

    const createNewRoom = () => {
        ws.send(JSON.stringify({type: 'createRoom'}));
    };

    const joinRoom = (roomId) => {
        ws.send(JSON.stringify({type: 'joinRoom', roomId: roomId}));
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
    const roomId = gameState.roomId;

    return (

        <div className="App">
        <p>GAMESTATE {JSON.stringify(gameState)}</p>
        {!gameState.gameIsReady & !gameState.joinedRoom &&
        <SelectRoomScreen
            createNewRoom = {createNewRoom}
            roomId = {roomId}
            joinRoom = {joinRoom}
        />
        }
        {!gameState.gameIsReady & gameState.joinedRoom &&
            <React.Fragment>
            
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
            gameState= {gameState}
            startSet = {startSet}
            validateWord = {validateWord}
            nextWord = {nextWord}
        />
        }{gameState.isGameMaster &&
            <Button className="margButt" variant="contained" color="primary" onClick={resetSockets} >
                RESET GAME
            </Button>
        }
    </div>
  );
}

export default App;
