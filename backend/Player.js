function Player(id, name) {
  this.id = id;
  this.name = name;
}

Player.prototype = {
  serialize: function() {
    return {name: this.name, id: this.id}
  }
};

module.exports.Player = Player;
