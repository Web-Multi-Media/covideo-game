"use strict";

import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import handleServerResponse from "./webSocket/rootedFunctions";
import {useLocation} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import GameScreen from "./pages/GameScreen";
import SelectRoomScreen from "./pages/SelectRoomScreen";
import RoomScreen from "./pages/RoomScreen";
import AppMenu from "./component/AppMenu/AppMenu";
import Header from "./component/Header/Header";
import './App.css';

const config = require('./env.json')[process.env.NODE_ENV || 'development']
const WS_PORT = config.WS_PORT;
const HOST = config.HOST;
const URL = `ws://${HOST}:${WS_PORT}`;
let ws = new WebSocket(URL);
const id = Math.floor(Math.random() * 1000);

const useStyles = makeStyles((theme) => ({
  container: {
    padding: 20
  },
}));

function App() {
  const classes = useStyles();
  const [gameState, setGameState] = useState({
    player: '',
    players: [],
    isGameMaster: false,
    gameIsReady: false,
    gameMaster: '',
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
    rooms: [],
    socketConnected: false,
    gifUrl: '',
    roomSettings: {}
  });
  const [img, setImg] = useState('');

  const location = useLocation();

  useEffect(() => {
    ws.onopen = function() {
      getRooms();
      setGameState({
        ...gameState,
        socketConnected: true
      })
    }
  }, []);

  useEffect(() => {
    if (gameState.joinedRoom === true) {
      ws.send(JSON.stringify({type: 'getPlayers'}));
    }
  }, [gameState.joinedRoom]);

  useEffect(() => {
    if (location.pathname !== '/' && gameState.socketConnected) {
      console.log('has pathe name');
      console.log(location.pathname);
      ws.send(JSON.stringify({type: 'joinRoom', roomId: location.pathname.substring(1)}));
    }
  }, [gameState.socketConnected]);

  useEffect(() => {
    if (gameState.roomId !== '' && gameState.joinedRoom === false) {
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

  const getRooms = () => {
    ws.send(JSON.stringify({type: 'getRooms'}));
  };

  const createNewRoom = () => {
    ws.send(JSON.stringify({type: 'createRoom'}));
  };

  const joinRoom = (roomId) => {
    ws.send(JSON.stringify({type: 'joinRoom', roomId: roomId}));
  };

  const sendUsername = (name) => {
    ws.send(JSON.stringify({type: 'addName', player: name}));
  };

  const sendRoomSettings = (settings) => {
    ws.send(JSON.stringify({
      type: 'changeRoomSettings', settings: settings}));
  };

  const sendWord = (word) => {
    ws.send(JSON.stringify({type: 'addWord', word: word}));
  };

  const deleteWord = (word) => {
    ws.send(JSON.stringify({type: 'deleteWord', word: word}));
  };

  const sendGameIsReady = () => {
    ws.send(JSON.stringify({type: 'gameIsReady'}));
  };

  const startRound = () => {
    ws.send(JSON.stringify({type: 'startRound'}));
  };

  const nextWord = () => {
    ws.send(JSON.stringify({type: 'nextWord'}));
  };

  const validateWord = () => {
    ws.send(JSON.stringify({type: 'validateWord', team: gameState.playerTeam}));
  };

  const resetSockets = () => {
    ws.send(JSON.stringify({type: 'resetGame'}));
  };

  const leaveRoom = (player_id) => {
    ws.send(JSON.stringify({type: 'leaveRoom', player_id: player_id}));
  };

  const kickPlayer = (player_id) => {
    console.log("Kicking player " + player_id);
    ws.send(JSON.stringify({type: 'leaveRoom', player_id: player_id}))
  };

  const chooseGif = (gifUrl) => {
    ws.send(JSON.stringify({type: 'setGif', gifUrl: gifUrl}));
  };

  const players = gameState.players;
  const gameMaster = gameState.gameMaster;
  const isGameMaster = gameState.isGameMaster;
  const roomId = gameState.roomId;
  const rooms = gameState.rooms;
  const player = gameState.player;
  const debug = process.env.NODE_ENV === 'development';
  var currentPlayer = _.filter(players, {'name': player})[0];
  const roomSettings = gameState.roomSettings;

  // DEBUG
  let debugGameState = _.cloneDeep(gameState);
  delete debugGameState.rooms;
  if (debug) {
    console.log(debugGameState);
  }

  return (<React.Fragment>
    <CssBaseline/>
    <AppMenu/>
    <Container className={classes.container} fixed="fixed" maxWidth="xl">
      {
        !gameState.gameIsReady && !gameState.joinedRoom && <React.Fragment>
            <Header/>
            <SelectRoomScreen createNewRoom={createNewRoom} joinRoom={joinRoom} getRooms={getRooms} rooms={rooms}/>
          </React.Fragment>
      }
      {
        !gameState.gameIsReady && gameState.joinedRoom && <React.Fragment>
            <RoomScreen
              players={players}
              currentPlayer={currentPlayer}
              gameMaster={gameMaster}
              isGameMaster={isGameMaster}
              onGameReady={sendGameIsReady}
              onChangeSettings={sendRoomSettings}
              roomSettings={roomSettings}
              onSendUsername={sendUsername}
              onSendWord={sendWord}
              onDeleteWord={deleteWord}
              roomId={roomId}
              kickPlayer={kickPlayer}/>
          </React.Fragment>
      }
      {gameState.gameIsReady && <GameScreen gameState={gameState} startRound={startRound} validateWord={validateWord} nextWord={nextWord} sendGif={chooseGif}/>}
    </Container>
  </React.Fragment>);
}

export default App;
