// To test the GameScreen directly, use this fake state

const [gameState, setGameState] = useState({
  player: 'test',
  players: [{'id': '5465461231', 'name': 'test'}, {'id': '546544321', 'name': 'test2'}],
  isGameMaster: true,
  gameIsReady: true,
  gameMaster: '5465461231',
  teams: [['test'],['test2']],
  playerTeam: 0,
  team1Score: 0,
  team2Score: 0,
  words: ['test', 'test2', 'test3', 'test4'],
  setFinished: false,
  set: 1,
  activePlayer: 'test',
  startTimer: false,
  duration: 30,
  round: 0,
  timeLeft: 30,
  joinedRoom: true,
  roomId: '532463546543',
  rooms: [],
  socketConnected: false,
  gifUrl: '',
  roomSettings: {timesToGuessPerSet: [30]}
});
