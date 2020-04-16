// To test the GameScreen directly, use this fake state
const [gameState, setGameState] = useState({
    global: {
        rooms: [],
        socketConnected: false,
        playerTeam: 0,
        joinedRoom: false
    },
    player: {
        id: 'testIdName',
        name: 'test1'
    },
    room: {
        name: 'testName',
        id: 'testId',
        gifUrl: '',
        players: [{id: 'testIdName', name: 'test1'}],
        wordsPerPlayer: {},
        wordsOfRound: ['wordTest'],
        wordsValidated: [],
        teams: [[{id: 'testIdName', name: 'test1'}],[]],
        gameMaster: 'dlkmgdkldfs',
        gameIsReady: true,
        round: 0,
        set: 1,
        setFinished: false,
        scoreFirstTeam: 0,
        scoreSecondTeam: 0,
        numberOfPlayer: 0,
        lastActivity: Date.now(),
        settings: {}
    }
});

