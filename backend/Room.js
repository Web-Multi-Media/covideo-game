const utils = require('./utils')
const _ = require('lodash');

function Room(id){
    this.name = "";
    this.id = id;
    this.users = [];
    this.words = [];
    this.wordsOfRound = [];
    this.teams = [];
    this.hasAGameMaster = false;
    this.round = 0;
    this.set = 0;
    this.setFinished = false;
    this.scoreFirstTeam = 0;
    this.scoreSecondTeam = 0;
    this.numberOfPlayer = 0;
    this.players = [];
}

Room.prototype = {
    getId: function() {
        return this.id;
    },
    getUsers: function() {
        return this.users;
    },
    getPlayers: function() {
        return this.players;
    },
    getWordsOfRound: function() {
        return this.wordsOfRound;
    },
    getSet: function() {
        return this.set;
    },
    getTeams: function() {
        return this.teams;
    },
    isSetFinished: function() {
        return this.setFinished;
    },
    getScoreFirstTeam: function() {
        return this.scoreFirstTeam;
    },
    getScoreSecondTeam: function() {
        return this.scoreSecondTeam;
    },
    setName: function(name) {
        this.name = name;
    },
    setGameMaster: function() {
        this.hasAGameMaster = true;
    },
    addUser: function(user) {
        this.users = [...this.users, user];
        this.numberOfPlayer = this.users.length;
    },
    addPlayer: function(player) {
        this.players = [...this.players, player];
    },
    addWord: function(word) {
        this.words = [...this.words, word];
    }, 
    startGame: function() {
        this.teams = utils.sortTeam(this.users);
    },
    startSet: function() {
        this.set++;
        this.setFinished = false;
        this.wordsOfRound = utils.shuffle(this.words);
    },
    startRound: function() {
        this.round++;
        this.setFinished = false;
    },
    choosePlayer: function() {
        this.wordsOfRound = utils.shuffle(this.wordsOfRound);
        return utils.choosePlayer(this.round, this.teams, this.numberOfPlayer);
    },
    validateWord: function(team) {
        if (team === 1) {
            this.scoreFirstTeam++;
        } else {
            this.scoreSecondTeam++;
        }
        this.wordsOfRound = _.tail(this.wordsOfRound);
        if (this.wordsOfRound.length === 0) {
            this.setFinished = true;
            // response.setFinished = true;
            this.set ++;
            // response.set = set;
        }
    },
    skipWord: function(){
        this.wordsOfRound = utils.firstToLastIndex(this.wordsOfRound);
    },
    resetGame: function() {
        this.users = [];
        this.words = [];
        this.wordsOfRound = [];
        this.teams = [];
        this.hasAGameMaster = false;
        this.round = 0;
        this.set = 1;
        this.scoreFirstTeam = 0;
        this.scoreSecondTeam = 0;
        this.numberOfPlayer = 0;
    }
};


module.exports.Room = Room;
