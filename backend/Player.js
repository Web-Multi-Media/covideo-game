function Player(id, name, status) {
  this.id = id;
  this.name = name;
  this.status = status;
  this.words = [];
}

Player.prototype = {
  serialize: function() {
    return {name: this.name, id: this.id, status: this.status}
  },
  sendPlayerInfos: function () {
    return {name: this.name, id: this.id, words: this.words.length}
  }
};

module.exports.Player = Player;
