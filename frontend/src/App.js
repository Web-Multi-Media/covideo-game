import React, {useEffect, useState} from 'react';
import './App.css';
import MainScreen from "./component/MainScreen";
import ConnectionScreen from "./component/ConnectionScreen";
import Timer from "./component/Timer";
import Button from "@material-ui/core/Button";
const {handleServerResponse} = require("./webSocket/rootedFunctions");
const URL = 'ws://localhost:8000';
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
        words: [],
        activePlayer: '',
        startTimer: ''
    });
    const [timer, setTimer] = useState(false);

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
   };

    const startTimer = () => {
        console.log('setTimer');
       setGameState({...gameState, startTimer: true})
    }

    const sendMessage =  (name) => {
        ws.send(JSON.stringify({type: 'addName', player: name}));
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
                <Timer
                    timerDuration
                    timerEnd = {timerIsDone}
                    startTimer = {gameState.startTimer}
                />
                <Button  id="outlined-basic-name" className="margButt" variant="contained" color="primary" onClick={startTimer}>
                    Timer
                </Button>
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
