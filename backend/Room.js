const utils = require('./utils')
const _ = require('lodash');

function Room(id) {
  this.name = "";
  this.id = id;
  this.players = [];
  this.words = [];
  this.wordsOfRound = [];
  this.teams = [];
  this.gameMaster = null;
  this.hasAGameMaster = false;
  this.round = 0;
  this.set = 1;
  this.setFinished = false;
  this.scoreFirstTeam = 0;
  this.scoreSecondTeam = 0;
  this.numberOfPlayer = 0;
  this.lastActivity = Date.now();
}

Room.prototype = {
  setName: function(name) {
    this.updateActivity();
    this.name = name;
  },
  setGameMaster: function(id) {
    this.updateActivity();
    if (id === null){
      this.gameMaster = null;
      this.hasAGameMaster = false;
    } else {
      this.gameMaster = id;
      this.hasAGameMaster = true;
    }
  },
  addPlayer: function(player) {
    this.updateActivity();
    this.players = [
      ...this.players,
      player
    ];
    this.numberOfPlayer = this.players.length;
  },
  removePlayer: function(id) {
    this.updateActivity();
    this.players = _.filter(this.players, function(item) {
      return item.id != id;
    });
    this.numberOfPlayer = this.players.length;
  },
  addWord: function(word) {
    this.updateActivity();
    var check = this.words.includes(word);
    if (!check){
      this.words = [
        word,
        ...this.words,
      ]
    }
  },
  deleteWord: function(word) {
    this.updateActivity();
    this.words = _.filter(this.words, function(name){
      name != word
    });
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
    this.gifUrl = this.gifUrl === ''
      ? this.gifUrl
      : '';
    if (this.wordsOfRound.length === 0) {
      this.setFinished = true;
      this.set++;
    }
  },
  skipWord: function() {
    this.updateActivity();
    this.wordsOfRound = utils.firstToLastIndex(this.wordsOfRound);
  },
  setGifUrl: function(gifUrl) {
    this.updateActivity();
    this.gifUrl = gifUrl;
  },
  resetGame: function() {
    this.updateActivity();
    this.words = [];
    this.wordsOfRound = [];
    this.round = 0;
    this.set = 1;
    this.scoreFirstTeam = 0;
    this.scoreSecondTeam = 0;
  },
  updateActivity: function() {
    this.lastActivity = Date.now();
  },
  serialize: function() {
    return {
      name: this.name,
      id: this.id,
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
