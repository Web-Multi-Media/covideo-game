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
// import AppMenu from "./component/AppMenu/AppMenu";
import AppMenuNew from "./component/AppMenu/AppMenuNew";
import Header from "./component/Header/Header";
import playSound from "./component/Audio/player";
import './App.css';
import { useCookies } from 'react-cookie';

const config = require('./env.json')[process.env.NODE_ENV || 'development']
const WS_PORT = config.WS_PORT;
const HOST = config.HOST;
let ws = {};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: 20,
    maxWidth: '100%'
  },
  ['@media (max-width:780px)']: { // eslint-disable-line no-useless-computed-key
    maxWidth: '100%'
  }
}));

function App() {
  const classes = useStyles();
  const [gameState, setGameState] = useState({
    global: {
      rooms: [],
      socketConnected: false,
      playerTeam: 0,
      joinedRoom: false,
      notificationsCount: 0,
      privateMessagesCount: 0
    },
    player: {
      id: '',
      name: '',
      status: ''
    },
    room: {
      name: '',
      id: '',
      gifUrl: '',
      players: [],
      activePlayer: {},
      wordsPerPlayer: {},
      wordToGuess: '',
      wordsValidated: [],
      teams: [],
      gameMaster: null,
      gameIsReady: false,
      round: 0,
      set: 1,
      startTimer: false,
      setFinished: false,
      team1Score: 0,
      team2Score: 0,
      numberOfPlayer: 0,
      lastActivity: Date.now(),
      settings: {
        timesToGuessPerSet: [30, 30, 40],
        numWordsPerPlayer: 3,
        numMaxPlayers: 10,
        private: false,
      }
    }
  });
  const [cookies, setCookie] = useCookies(['playerId', 'player', 'roomId']);
  const location = useLocation();
  const isGameMaster = gameState.room.gameMaster === gameState.player.id;
  const debug = process.env.NODE_ENV === 'development';

  function getPlayerWords(){
    let playerId = gameState.player.id;
    let wordsPerPlayer = gameState.room.wordsPerPlayer;
    let playerWords = [];
    if (playerId in wordsPerPlayer){
      playerWords = wordsPerPlayer[playerId];
    }
    return playerWords;
  }

  useEffect(() => {
    let URL = `ws://${HOST}:${WS_PORT}`;
    URL += '?';
    URL += cookies.playerId !== undefined ? `playerId=${cookies.playerId}` : '';
    URL += cookies.roomId !== undefined ? `&roomId=${cookies.roomId}` : '';
    URL += cookies.playerName !== undefined ? `&playerName=${cookies.playerName}` : '';
    ws = new WebSocket(URL);
    // ws.onopen = function() {
    //   setGameState({
    //     ...gameState,
    //     global: {
    //       ...gameState.global,
    //       socketConnected: true
    //     }
    //   })
    // }
  }, []);

  useEffect(() => {
    if (gameState.room.id !== cookies.roomId) {
      setCookie('roomId', gameState.room.id, { path: '/' });
    }
    if (gameState.player.id !== cookies.playerId) {
      setCookie('playerId', gameState.player.id, { path: '/' });
    }
    if (gameState.player.name !== cookies.playerName) {
      setCookie('playerName', gameState.player.name, { path: '/' });
    }
  }, [gameState.room.id, gameState.player.id, gameState.player.name]);

  useEffect(() => {
    if (location.pathname !== '/' && gameState.global.socketConnected) {
      console.log('has path name');
      console.log(location.pathname);
      ws.send(JSON.stringify({type: 'joinRoom', roomId: location.pathname.substring(1)}));
    }
  }, [gameState.socketConnected]);

  useEffect(() => {
    ws.onmessage = (message) => {
      const obj = JSON.parse(message.data);
      console.log('new event : ' + obj.type);
      console.log(obj);
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
    ws.send(JSON.stringify({type: 'changePlayerName', playerName: name}));
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
    ws.send(JSON.stringify({type: 'validateWord', team: gameState.global.playerTeam}));
  };

  const leaveRoom = (playerId) => {
    ws.send(JSON.stringify({type: 'leaveRoom', playerId: playerId}));
  };

  const kickPlayer = (playerId) => {
    console.log("Kicking player " + playerId);
    ws.send(JSON.stringify({type: 'leaveRoom', playerId: playerId}))
  };

  const chooseGif = (gifUrl) => {
    ws.send(JSON.stringify({type: 'setGif', gifUrl: gifUrl}));
  };

  // DEBUG
  let debugGameState = _.cloneDeep(gameState);
  delete debugGameState.global.rooms;
  if (debug) {
    console.log(debugGameState);
  }

  return (<React.Fragment>
    <CssBaseline/>
    <AppMenuNew
      notificationsCount={gameState.global.notificationsCount}
      privateMessagesCount={gameState.global.privateMessagesCount}
    />
    <Container className={classes.container} fixed maxWidth="xl">
      {/*UNCOMMENT IF YOU NEED IT BUT DO NOT COMMIT !!!*/}
      {/*<p> gameState.playerTeam {JSON.stringify(gameState.global.playerTeam)}</p>*/}
      {/*<p> gameState.global {JSON.stringify(gameState.global)}</p>*/}
      {/*<p> gameState.player {JSON.stringify(gameState.player)}</p>*/}
      {
        !gameState.room.gameIsReady && !gameState.global.joinedRoom && <React.Fragment>
            <Header/>
            <SelectRoomScreen
              currentPlayer={gameState.player}
              rooms={gameState.global.rooms}
              getRooms={getRooms}
              createNewRoom={createNewRoom}
              joinRoom={joinRoom}/>
            </React.Fragment>
      }
      {
        !gameState.room.gameIsReady && gameState.global.joinedRoom &&
          <RoomScreen
            players={gameState.room.players}
            currentPlayer={gameState.player}
            gameMaster={gameState.room.gameMaster}
            roomId={gameState.room.id}
            roomSettings={gameState.room.settings}
            playerWords={getPlayerWords()}
            isGameMaster={isGameMaster}
            kickPlayer={kickPlayer}
            leaveRoom={leaveRoom}
            onGameReady={sendGameIsReady}
            onChangeSettings={sendRoomSettings}
            onSendUsername={sendUsername}
            onSendWord={sendWord}
            playSound={playSound}
            onDeleteWord={deleteWord}/>
      }
      {
        gameState.room.gameIsReady && gameState.global.joinedRoom &&
          <GameScreen
            currentPlayer={gameState.player}
            gameMaster={gameState.room.gameMaster}
            activePlayer={gameState.room.activePlayer}
            teams={gameState.room.teams}
            team1Score={gameState.room.team1Score}
            team2Score={gameState.room.team2Score}
            startTimer={gameState.room.startTimer}
            gifUrl={gameState.room.gifUrl}
            set={gameState.room.set}
            wordToGuess={gameState.room.wordToGuess}
            wordsValidated={gameState.room.wordsValidated}
            roomSettings={gameState.room.settings}
            startRound={startRound}
            validateWord={validateWord}
            nextWord={nextWord}
            sendGif={chooseGif}
            playSound={playSound}
          />
      }
    </Container>
  </React.Fragment>);
}

export default App;
