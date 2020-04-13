const utils = require('./utils')
const _ = require('lodash');

function Room(id) {
  this.name = "";
  this.id = id;
  this.players = [];
  this.words = [];
  this.wordsOfRound = [];
  this.teams = [];
  this.hasAGameMaster = false;
  this.round = 0;
  this.set = 1;
  this.setFinished = false;
  this.scoreFirstTeam = 0;
  this.scoreSecondTeam = 0;
  this.numberOfPlayer = 0;
  this.players = [];
  this.lastActivity = Date.now();
}

Room.prototype = {
  getId: function() {
    this.updateActivity();
    return this.id;
  },
  getPlayers: function() {
    this.updateActivity();
    return this.players;
  },
  getPlayers: function() {
    this.updateActivity();
    return this.players;
  },
  getWordsOfRound: function() {
    this.updateActivity();
    return this.wordsOfRound;
  },
  getSet: function() {
    this.updateActivity();
    return this.set;
  },
  getRound: function() {
    this.updateActivity();
    return this.round;
  },
  getGifUrl: function() {
    this.updateActivity();
    return this.gifUrl;
  },
  getTeams: function() {
    this.updateActivity();
    return this.teams;
  },
  isSetFinished: function() {
    this.updateActivity();
    return this.setFinished;
  },
  getScoreFirstTeam: function() {
    this.updateActivity();
    return this.scoreFirstTeam;
  },
  getScoreSecondTeam: function() {
    this.updateActivity();
    return this.scoreSecondTeam;
  },
  setName: function(name) {
    this.updateActivity();
    this.name = name;
  },
  setGameMaster: function() {
    this.updateActivity();
    this.hasAGameMaster = true;
  },
  addPlayer: function(player) {
    this.updateActivity();
    this.players = [
      ...this.players,
      player
    ];
    this.numberOfPlayer = this.players.length;
  },
  removePlayer: function(name) {
    this.updateActivity();
    this.players = this.players.filter(function(item){
      return item.name != name;
    });
  },
  addWord: function(word) {
    this.updateActivity();
    this.words = [
      ...this.words,
      word
    ];
  },
  startGame: function() {
    this.updateActivity();
    this.teams = utils.sortTeam(this.players.map(player => player.name));
  },
  startSet: function() {
    this.updateActivity();
    this.setFinished = false;
    this.wordsOfRound = utils.shuffle(this.words);
  },
  startRound: function() {
    this.updateActivity();
    this.round++;
    this.setFinished = false;
  },
  choosePlayer: function() {
    this.updateActivity();
    this.wordsOfRound = utils.shuffle(this.wordsOfRound);
    return utils.choosePlayer(this.round, this.teams, this.numberOfPlayer);
  },
  validateWord: function(team) {
    this.updateActivity();
    if (team === 1) {
      this.scoreFirstTeam++;
    } else {
      this.scoreSecondTeam++;
    }
    this.wordsOfRound = _.tail(this.wordsOfRound);
    this.gifUrl = this.gifUrl === '' ? this.gifUrl : '';
    if (this.wordsOfRound.length === 0) {
      this.setFinished = true;
      // response.setFinished = true;
      this.set++;
      // response.set = set;
    }
  },
  skipWord: function() {
    this.updateActivity();
    this.wordsOfRound = utils.firstToLastIndex(this.wordsOfRound);
  },
  setGifUrl: function(gifUrl){
    this.updateActivity();
    this.gifUrl = gifUrl;
  },
  resetGame: function() {
    this.updateActivity();
    this.players = [];
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
  updateActivity: function() {
    this.lastActivity = Date.now();
  },
  serialize: function() {
    return {
      name: this.name,
      id: this.id,
      users: this.user,
      words: this.words,
      wordsOfRound: this.wordsOfRound,
      teams: this.teams,
      hasAGameMaster: this.hasAGameMaster,
      round: this.round,
      set: this.set,
      setFinished: this.setFinished,
      scoreFirstTeam: this.scoreFirstTeam,
      scoreSecondTeam: this.scoreSecondTeam,
      numberOfPlayer: this.numberOfPlayer,
      players: this.players,
      lastActivity: this.lastActivity
    }
  }
};

module.exports.Room = Room;
