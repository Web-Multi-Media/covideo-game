const utils = require('./utils')
const _ = require('lodash');

function Room(id) {
  this.team1Player = 0;
  this.team2Player = 0;
  this.name = "";
  this.id = id;
  this.gifUrl = "";
  this.players = [];
  this.wordToGuess = ""
  this.words = [];
  this.wordsPerPlayer = {};
  this.wordsOfRound = [];
  this.wordsValidated = [];
  this.teams = [];
  this.gameMaster = null;
  this.round = 0;
  this.set = 1;
  this.startTimer = false;
  this.activePlayer = {};
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
    for (const playerId in this.wordsPerPlayer) {
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
    } else {
      this.gameMaster = id;
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
      ...this.wordsPerPlayer[playerId],
      word
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
    this.teams = utils.sortTeam(this.players);
    this.wordsOfRound = utils.shuffle(this.getWords());
  },
  startSet: function() {
    this.updateActivity();
    this.wordsOfRound = utils.shuffle(this.getWords());
    this.setFinished = false;
    this.set++;
  },
  startRound: function() {
    this.updateActivity();
    this.round++;
    this.setFinished = false;
  },
  setActivePlayer: function() {
    this.updateActivity();
    this.wordsOfRound = utils.shuffle(this.wordsOfRound);
    this.activePlayer = utils.getNextActivePlayer(this);
  },
  validateWord: function(team) {
    this.updateActivity();
    if (this.wordsOfRound.length > 0) {

      // Increase team score
      if (team === 1) {
        this.scoreFirstTeam++;
      } else {
        this.scoreSecondTeam++;
      }

      // Add word to validated words
      let word = this.wordsOfRound[0];
      this.wordsValidated.push(word);

      // Remove word from words of round
      this.wordsOfRound = _.tail(this.wordsOfRound);

      // Set gif URL if needed
      this.gifUrl = this.gifUrl === '' ? this.gifUrl : '';
    }
    // If no more words, set is finished
    if (this.wordsOfRound.length === 0) {
      this.setFinished = true;
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
    this.team1Player = 0;
    this.team2Player = 0;
    this.gifUrl = "";
    this.words = [];
    this.wordToGuess = "";
    let wordsPerPlayer = {};
    this.players.map(function(player){
      wordsPerPlayer[player.id] = [];
    })
    this.wordsPerPlayer = wordsPerPlayer;
    this.wordsOfRound = [];
    this.wordsValidated = [];
    this.teams = [];
    this.round = 0;
    this.set = 1;
    this.startTimer = false;
    this.activePlayer = {};
    this.gameIsReady = false;
    this.setFinished = false;
    this.scoreFirstTeam = 0;
    this.scoreSecondTeam = 0;
    this.lastActivity = Date.now();
  },
  updateActivity: function() {
    this.lastActivity = Date.now();
  },
  updateTeam1: function() {
    this.updateActivity();
    this.team1Player = (this.team1Player + 1) % this.teams[0].length;
    console.log('team1player = ' +this.team1Player);
  },
  updateTeam2: function() {
    this.updateActivity();
    this.team2Player = (this.team2Player + 1) % this.teams[1].length;
    console.log('team2player = ' +this.team2Player);
  },
  serialize: function() {
    return {
      name: this.name,
      id: this.id,
      teams: this.teams,
      activePlayer: this.activePlayer,
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
      gameIsReady: this.gameIsReady
    }
  }
};

module.exports.Room = Room;
