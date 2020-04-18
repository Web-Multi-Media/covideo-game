function Player(id, name, status) {
  this.id = id;
  this.name = name;
  this.status = status;
}

Player.prototype = {
  serialize: function() {
    return {name: this.name, id: this.id, status: this.status}
  }
};

module.exports.Player = Player;
