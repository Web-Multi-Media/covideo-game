import React, {useEffect, useState} from 'react';
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
      status: '',
      words: []
    },
    room: {
      name: '',
      id: '',
      gifUrl: '',
      roundDescription:[],
      players: [],
      activePlayer: {},
      wordToGuess: '',
      wordsValidated: [],
      teams: [],
      gameMaster: null,
      gameStarted: false,
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
      },
      incomingChatMessage: {},
    }
  });
  const [cookies, setCookie] = useCookies(['playerId', 'player', 'roomId']);
  const location = useLocation();
  const isGameMaster = gameState.room.gameMaster === gameState.player.id;
  const debug = process.env.DEBUG === '1';

  function requestBackend(request){
    console.log("Backend request: ", request);
    ws.send(JSON.stringify(request));
  }

  function processBackendResponse(response){
    const obj = JSON.parse(response.data);
    console.log("Backend response: ", obj);
    handleServerResponse(obj, gameState, setGameState);
  }

  useEffect(() => {
    let URL = `ws://${HOST}:${WS_PORT}`;
    URL += '?';
    URL += cookies.playerId !== undefined ? `playerId=${cookies.playerId}` : '';
    URL += cookies.roomId !== undefined ? `&roomId=${cookies.roomId}` : '';
    URL += cookies.playerName !== undefined ? `&playerName=${cookies.playerName}` : '';
    ws = new WebSocket(URL);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.room.id, gameState.player.id, gameState.player.name]);

  useEffect(() => {
    if (location.pathname !== '/' && gameState.global.socketConnected) {
      console.log(`Location: ${location.pathname}`);
      requestBackend({type: 'joinRoom', roomId: location.pathname.substring(1)});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.socketConnected]);

  useEffect(() => {
    ws.onmessage = processBackendResponse;
  });

  useEffect(() => {
    playSound('userConnect', 0.01);
  }, [gameState.room.players.length]);

  const getRooms = () => {
    requestBackend({type: 'getRooms'});
  };

  const createNewRoom = () => {
    requestBackend({type: 'createRoom'});
  };

  const joinRoom = (roomId) => {
    requestBackend({type: 'joinRoom', roomId: roomId});
  };

  const sendUsername = (name) => {
    requestBackend({type: 'changePlayerName', playerName: name});
  };

  const sendRoomSettings = (settings) => {
    requestBackend({type: 'changeRoomSettings', settings: settings});
  };

  const sendWord = (word) => {
    requestBackend({type: 'addWord', word: word});
  };

  const deleteWord = (word) => {
    requestBackend({type: 'deleteWord', word: word});
  };

  const sendGameIsStarted = () => {
    requestBackend({type: 'gameStarted'});
  };

  const startRound = () => {
    requestBackend({type: 'startRound'});
  };

  const nextWord = () => {
    requestBackend({type: 'nextWord'});
    playSound('skipWord');
  };

  const validateWord = () => {
    requestBackend({type: 'validateWord', team: gameState.global.playerTeam});
  };

  const leaveRoom = (playerId) => {
    requestBackend({type: 'leaveRoom', playerId: playerId});
  };

  const kickPlayer = (playerId) => {
    console.log(`Kicking player ${playerId}`);
    requestBackend({type: 'leaveRoom', playerId: playerId})
  };

  const chooseGif = (gifUrl) => {
    requestBackend({type: 'setGif', gifUrl: gifUrl});
  };

  const sendChatMessage = (message) => {
    ws.send(JSON.stringify({
      type: 'chatMessage',
      message: message,
      team: gameState.global.playerTeam
    }))
  };

  // DEBUG
  if (debug) {
    console.log("Game state: ", gameState);
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
        !gameState.room.gameStarted && !gameState.global.joinedRoom && <React.Fragment>
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
        !gameState.room.gameStarted && gameState.global.joinedRoom &&
          <RoomScreen
            players={gameState.room.players}
            currentPlayer={gameState.player}
            gameMaster={gameState.room.gameMaster}
            roomId={gameState.room.id}
            roomSettings={gameState.room.settings}
            gameIsReady={gameState.room.gameIsReady}
            playerWords={gameState.player.words}
            isGameMaster={isGameMaster}
            kickPlayer={kickPlayer}
            leaveRoom={leaveRoom}
            onGameReady={sendGameIsStarted}
            onChangeSettings={sendRoomSettings}
            onSendUsername={sendUsername}
            onSendWord={sendWord}
            playSound={playSound}
            onDeleteWord={deleteWord}/>
      }
      {
        gameState.room.gameStarted && gameState.global.joinedRoom &&
          <GameScreen
            currentPlayer={gameState.player}
            gameMaster={gameState.room.gameMaster}
            activePlayer={gameState.room.activePlayer}
            teams={gameState.room.teams}
            team1Score={gameState.room.team1Score}
            team2Score={gameState.room.team2Score}
            startTimer={gameState.room.startTimer}
            roundDescription={gameState.room.roundDescription}
            gifUrl={gameState.room.gifUrl}
            set={gameState.room.set}
            wordToGuess={gameState.room.wordToGuess}
            wordsValidated={gameState.room.wordsValidated}
            roomSettings={gameState.room.settings}
            startRound={startRound}
            validateWord={validateWord}
            nextWord={nextWord}
            sendGif={chooseGif}
            sendChatMessage={sendChatMessage}
            incomingChatMessage={gameState.room.incomingChatMessage}
            playSound={playSound}
          />
      }
    </Container>
  </React.Fragment>);
}

export default App;
