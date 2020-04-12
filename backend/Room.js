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
    this.gifUrl = '';
    this.players = [];
    this.lastActivity = Date.now();
}

Room.prototype = {
    getId: function() {
        this.updateAcitvity();
        return this.id;
    },
    getUsers: function() {
        this.updateAcitvity();
        return this.users;
    },
    getPlayers: function() {
        this.updateAcitvity();
        return this.players;
    },
    getWordsOfRound: function() {
        this.updateAcitvity();
        return this.wordsOfRound;
    },
    getSet: function() {
        this.updateAcitvity();
        return this.set;
    },
    getTeams: function() {
        this.updateAcitvity();
        return this.teams;
    },
    isSetFinished: function() {
        this.updateAcitvity();
        return this.setFinished;
    },
    getScoreFirstTeam: function() {
        this.updateAcitvity();
        return this.scoreFirstTeam;
    },
    getScoreSecondTeam: function() {
        this.updateAcitvity();
        return this.scoreSecondTeam;
    },
    setName: function(name) {
        this.updateAcitvity();
        this.name = name;
    },
    setGifUrl: function(gifUrl) {
        this.updateAcitvity();
        this.gifUrl = gifUrl;
    },
    setGameMaster: function() {
        this.updateAcitvity();
        this.hasAGameMaster = true;
    },
    addUser: function(user) {
        this.updateAcitvity();
        this.users = [...this.users, user];
        this.numberOfPlayer = this.users.length;
    },
    addPlayer: function(player) {
        this.updateAcitvity();
        this.players = [...this.players, player];
    },
    addWord: function(word) {
        this.updateAcitvity();
        this.words = [...this.words, word];
    },
    startGame: function() {
        this.updateAcitvity();
        this.teams = utils.sortTeam(this.users);
    },
    startSet: function() {
        this.updateAcitvity();
        this.set++;
        this.setFinished = false;
        this.wordsOfRound = utils.shuffle(this.words);
    },
    startRound: function() {
        this.updateAcitvity();
        this.round++;
        this.setFinished = false;
    },
    choosePlayer: function() {
        this.updateAcitvity();
        this.wordsOfRound = utils.shuffle(this.wordsOfRound);
        return utils.choosePlayer(this.round, this.teams, this.numberOfPlayer);
    },
    validateWord: function(team) {
        this.updateAcitvity();
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
        this.updateAcitvity();
        this.wordsOfRound = utils.firstToLastIndex(this.wordsOfRound);
    },
    resetGame: function() {
        this.updateAcitvity();
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
    },
    updateAcitvity: function() {
        this.lastActivity = Date.now();
    },
};


module.exports.Room = Room;
