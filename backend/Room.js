const utils = require('./utils')
const _ = require('lodash');

function Room(id) {
  this.name = "";
  this.id = id;
  this.gifUrl = "";
  this.players = [];
  this.wordsPerPlayer = {};
  this.wordsOfRound = [];
  this.wordsValidated = [];
  this.teams = [];
  this.gameMaster = null;
  this.hasAGameMaster = false;
  this.round = 0;
  this.set = 1;
  this.startTimer = false;
  this.activePlayer = "";
  this.gameIsReady = false;
  this.setFinished = false;
  this.scoreFirstTeam = 0;
  this.scoreSecondTeam = 0;
  this.numberOfPlayer = 0;
  this.lastActivity = Date.now();
  this.settings = this.getDefaultSettings();
}

Room.prototype = {
  getWords: function() {
    let words = []
    for (var playerId in this.wordsPerPlayer) {
      words = [
        ...words,
        ...this.wordsPerPlayer[playerId]
      ];
    }
    return words;
  },
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
    this.players = _.uniqBy(this.players, function (p) {
      return p.id;
    });
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
    this.wordsOfRound = utils.shuffle(this.getWords());
  },
  startRound: function() {
    this.updateActivity();
    this.round++;
    this.setFinished = false;
  },
  setActivePlayer: function() {
    this.updateActivity();
    this.wordsOfRound = utils.shuffle(this.wordsOfRound);
    this.activePlayer = utils.getNextActivePlayer(this.round, this.teams, this.numberOfPlayer);
  },
  validateWord: function(team) {
    this.updateActivity();

    // Increase team score
    if (team === 1) {
      this.scoreFirstTeam++;
    } else {
      this.scoreSecondTeam++;
    }

    // Add word to validated words
    var word = this.wordsOfRound[0];
    this.wordsValidated.push(word);

    // Remove word from words of round
    this.wordsOfRound = _.tail(this.wordsOfRound);

    // Set gif URL if needed
    this.gifUrl = this.gifUrl === ''
      ? this.gifUrl
      : '';

    // If no more words, set is finished
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
    this.wordsValidated = [];
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
      gameMaster: this.gameMaster,
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
