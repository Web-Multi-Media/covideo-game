"use strict";
import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import handleServerResponse from "./webSocket/rootedFunctions";
import {useLocation} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from "@material-ui/core/Container";
import GameScreen from "./pages/GameScreen";
import SelectRoomScreen from "./pages/SelectRoomScreen";
import RoomScreen from "./pages/RoomScreen";
import AppMenu from "./component/AppMenu/AppMenu";
import Header from "./component/Header/Header";
import './App.css';
import { useCookies } from 'react-cookie';

const config = require('./env.json')[process.env.NODE_ENV || 'development']
const WS_PORT = config.WS_PORT;
const HOST = config.HOST;
let ws = {};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: 20
  },
}));

function App() {

  const classes = useStyles();
  const [gameState, setGameState] = useState({
    playerId:'',
    roomId: '',
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
    wordsValidated: [],
    setFinished: false,
    set: 1,
    activePlayer: '',
    startTimer: false,
    duration: 0,
    round: 0,
    timeLeft: 0,
    joinedRoom: false,
    rooms: [],
    socketConnected: false,
    gifUrl: '',
    roomSettings: {}
  });
  const [cookies, setCookie] = useCookies(['playerId', 'player', 'roomId']);
  const [img, setImg] = useState('');
  const location = useLocation();
  const players = gameState.players;
  const player = gameState.player; // Websocket player name
  const currentPlayer = _.filter(players, {'name': player})[0];  // Websocket player data
  const activePlayer = gameState.activePlayer;
  const gameMaster = gameState.gameMaster;
  const isGameMaster = gameState.gameMaster === gameState.playerId;
  const roomId = gameState.roomId;
  const rooms = gameState.rooms;
  const teams = gameState.teams;
  const words = gameState.words;
  const team1Score = gameState.team1Score;
  const team2Score = gameState.team2Score;
  const set = gameState.set;
  const roomSettings = gameState.roomSettings;
  const startTimer = gameState.startTimer;
  const duration = gameState.duration;
  const gifUrl = gameState.gifUrl;
  const wordsValidated = gameState.wordsValidated;
  const debug = process.env.NODE_ENV === 'development';

  useEffect(() => {

    let URL = `ws://${HOST}:${WS_PORT}`;
    URL += '?';
    URL += cookies.playerId !== undefined ? `playerId=${cookies.playerId}` : '';
    URL += cookies.roomId !== undefined ? `&roomId=${cookies.roomId}` : '';
    URL += cookies.player !== undefined ? `&playerName=${cookies.player}` : '';
    ws = new WebSocket(URL);

    ws.onopen = function() {
      setGameState({
        ...gameState,
        socketConnected: true
      })
    }
  }, []);

  useEffect(() => {
    if(gameState.roomId !== cookies.roomId) {
      setCookie('roomId', gameState.roomId, { path: '/' });
    }
    if(gameState.playerId !== cookies.playerId) {
      setCookie('playerId', gameState.playerId, { path: '/' });
    }
    if(gameState.player !== cookies.player) {
      setCookie('player', gameState.player, { path: '/' });
    }
  }, [gameState.roomId, gameState.playerId, gameState.player]);

  useEffect(() => {
    if (gameState.joinedRoom === true && gameState.socketConnected) {
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
    if (gameState.roomId !== '' && gameState.joinedRoom === false && gameState.socketConnected) {
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
      <p>{JSON.stringify(gameState)}</p>
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
            roomId={roomId}
            roomSettings={roomSettings}
            words={words}
            isGameMaster={isGameMaster}
            kickPlayer={kickPlayer}
            onGameReady={sendGameIsReady}
            onChangeSettings={sendRoomSettings}
            onSendUsername={sendUsername}
            onSendWord={sendWord}
            onDeleteWord={deleteWord}/>
        </React.Fragment>
      }
      {
        gameState.gameIsReady &&
          <GameScreen
            gameMaster={gameMaster}
            currentPlayer={currentPlayer}
            activePlayer={activePlayer}
            teams={teams}
            team1Score={team1Score}
            team2Score={team2Score}
            startRound={startRound}
            startTimer={startTimer}
            validateWord={validateWord}
            nextWord={nextWord}
            sendGif={chooseGif}
            gifUrl={gifUrl}
            set={set}
            words={words}
            wordsValidated={wordsValidated}
            duration={duration}
          />
      }
    </Container>
  </React.Fragment>);
}

export default App;
