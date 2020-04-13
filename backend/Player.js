function Player(id, name) {
  this.id = id;
  this.name = name;
}

Player.prototype = {
  getId: function() {
    return {name: this.name, id: this.id};
  },
  getName: function() {
    return this.name;
  }
};

module.exports.Player = Player;
