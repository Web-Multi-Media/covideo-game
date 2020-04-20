/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [
      a[i], a[j]
    ] = [
      a[j], a[i]
    ];
  }
  return a;
}

function sortTeam(players) {
  const randomizedPlayers = shuffle(players);
  const teamA = randomizedPlayers.slice(0, Math.floor(randomizedPlayers.length / 2));
  const teamB = randomizedPlayers.slice(Math.floor(randomizedPlayers.length / 2), randomizedPlayers.length);
  return [teamA, teamB];
}

function getNextActivePlayer(room) {
  const teamPlaying = room.round % 2;
  const player = teamPlaying === 0 ? room.team1Player : room.team2Player;
  teamPlaying === 0 ? room.updateTeam1() : room.updateTeam2();
  return room.teams[teamPlaying][player];
}

function firstToLastIndex(arr) {
  let newArray = arr.slice(1, arr.length);
  newArray.push(arr[0]);
  return newArray;
}

function getUniqueID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4();
};

function getRandomPlayerName(id){
  let lastChars = id.substr(id.length - 4);
  playerName = `Player-${lastChars}`;
  return playerName;
};

module.exports.shuffle = shuffle;
module.exports.sortTeam = sortTeam;
module.exports.getNextActivePlayer = getNextActivePlayer;
module.exports.firstToLastIndex = firstToLastIndex;
module.exports.getUniqueID = getUniqueID;
module.exports.getRandomPlayerName = getRandomPlayerName;
