function Player(id, name, status) {
  this.id = id;
  this.name = name;
  this.status = status;
  this.words = [];
}

Player.prototype = {
  serialize: function() {
    return {
      name: this.name, 
      id: this.id, 
      status: this.status, 
      numWords: this.words.length
    }
  },
  resetPlayer: function() {
    this.words = [];
  },
};

module.exports.Player = Player;
