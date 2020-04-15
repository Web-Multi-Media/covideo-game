const utils = require('./utils')
const _ = require('lodash');

function Room(id) {
  this.name = "";
  this.id = id;
  this.players = [];
  this.wordsPerPlayer = {};
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
  this.settings = this.getDefaultSettings();
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
  getDefaultSettings: function() {
    return {
      timesToGuessPerSet: [30, 30, 40],
      numWordsPerPlayer: 3,
      numMaxPlayers: 10,
      private: false,
    }
  },
  addPlayer: function(player) {
    this.updateActivity();
    this.players = [
      ...this.players,
      player
    ];
    this.wordsPerPlayer[player.id] = [];
    this.numberOfPlayer = this.players.length;
  },
  removePlayer: function(id) {
    this.updateActivity();
    this.players = _.filter(this.players, function(item) {
      return item.id != id;
    });
    delete this.wordsPerPlayer[id];
    this.numberOfPlayer = this.players.length;
  },
  addWord: function(word, playerId) {
    this.updateActivity();
    this.wordsPerPlayer[playerId] = [
      word,
      ...this.wordsPerPlayer[playerId]
    ];
  },
  deleteWord: function(word, playerId) {
    // delete only one occurence of the word to be deleted
    this.updateActivity();
    this.wordsPerPlayer[playerId] = (function(words, wordToRemove) {
      for (var i = words.length - 1; i >= 0; i--) {
        if (words[i] === wordToRemove) {
          words.splice(i, 1);
          return words;
        }}})(this.wordsPerPlayer[playerId], word);
  },
  startGame: function() {
    this.updateActivity();
    this.teams = utils.sortTeam(this.players.map(player => player.name));
  },
  startSet: function() {
    this.updateActivity();
    this.setFinished = false;
    let words = []
    for (var playerId in this.wordsPerPlayer) {
      words = [
        ...words,
        ...this.wordsPerPlayer[playerId]
      ];
    }
    this.wordsOfRound = utils.shuffle(words);
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
    this.wordsPerPlayer = {};
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
      lastActivity: this.lastActivity,
      settings: this.settings,
    }
  }
};

module.exports.Room = Room;
