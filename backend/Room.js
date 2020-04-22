const utils = require('./utils')
const _ = require('lodash');
const stringSimilarity = require('string-similarity');
const similarity = require('similarity')


function Room(id) {
  this.id = id;
  this.name = "";
  this.players = [];
  this.numberOfPlayer = 0;
  this.gameMaster = null;
  this.settings = this.getDefaultSettings();
  this.team1Player = 0;
  this.team2Player = 0;
  this.gifUrl = "";
  this.wordToGuess = ""
  this.words = [];
  this.wordsPerPlayer = {};
  this.wordsOfRound = [];
  this.wordsValidated = [];
  this.teams = [];
  this.round = 0;
  this.roundDescription = [];
  this.set = 1;
  this.startTimer = false;
  this.activePlayer = {};
  this.gameIsReady = false;
  this.gameStarted = false;
  this.setFinished = false;
  this.scoreFirstTeam = 0;
  this.scoreSecondTeam = 0;
  this.teamPlaying = 0;
  this.lastActivity = Date.now();
}

Room.prototype = {
  getWords: function() {
    return _.flatten(this.players.map(player => player.words));
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
      return item.id !== id;
    });
    delete this.wordsPerPlayer[id];
    this.numberOfPlayer = this.players.length;
    if (id ===this.gameMaster){
      if (this.numberOfPlayer > 0){
        this.setGameMaster(this.players[0].id);
      } else {
        this.setGameMaster(null);
      }
    }
  },
  addWord: function(word, playerId) {
    this.updateActivity();
    let player = this.players.find(player => player.id === playerId)
    player.words = [...player.words, word];
    return player.words;
  },
  deleteWord: function(word, playerId) {
    this.updateActivity();
    let playerWords = this.players.find(player => player.id === playerId).words
    let wordIndex = playerWords.indexOf(word);
    if (wordIndex > -1) {
      playerWords.splice(wordIndex, 1);
    }
    return playerWords;
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
  startRound: function(team) {
    this.updateActivity();
    this.round++;
    this.setFinished = false;
    this.teamPlaying = team;
  },
  setActivePlayer: function() {
    this.updateActivity();
    this.wordsOfRound = utils.shuffle(this.wordsOfRound);
    this.activePlayer = utils.getNextActivePlayer(this);
  },
  validateWord: function(team, message) {
    this.updateActivity();
    const similarity1 = stringSimilarity.compareTwoStrings(message, this.wordsOfRound[0]);
    const similarity2 = similarity(message, this.wordsOfRound[0]);
    console.log(message, this.wordsOfRound[0], similarity1);
    console.log(message, this.wordsOfRound[0], similarity2);
    if (this.wordsOfRound.length > 0 && message === this.wordsOfRound[0]) {
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
      // If no more words, set is finished
      if (this.wordsOfRound.length === 0) {
        this.setFinished = true;
      }
      return true;
    }else{
      return false;
    }
  },
  skipWord: function() {
    this.updateActivity();
    this.wordsOfRound = utils.firstToLastIndex(this.wordsOfRound);
    this.roundDescription = [];
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
    this.wordToGuess = "";
    this.words = [];
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
    this.gameStarted = false;
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
  },
  updateTeam2: function() {
    this.updateActivity();
    this.team2Player = (this.team2Player + 1) % this.teams[1].length;
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
      players: this.players.map(player => player.sendPlayerInfos()),
      lastActivity: this.lastActivity,
      settings: this.settings,
      gameIsReady: this.gameIsReady,
      gameStarted: this.gameStarted
    }
  }
};

module.exports.Room = Room;
