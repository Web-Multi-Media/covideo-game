/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */



function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function sortTeam(players){
    const randomizedUsers = shuffle(players);
    const teamA = randomizedUsers.slice(0, Math.floor(randomizedUsers.length /2));
    const teamB = randomizedUsers.slice(Math.floor(randomizedUsers.length /2), randomizedUsers.length);
    return [teamA, teamB];
}

function choosePlayer(round, teams, numberOfPlayer){
    const player = round % numberOfPlayer;
    const idx0 = Math.trunc(player % 2);
    const idx1 = Math.trunc(player / 2);
    return teams[idx0][idx1];
}

function firstToLastIndex (arr) {
    let newArray = arr.slice(1, arr.length);
    newArray.push(arr[0]);
    return newArray;
}

module.exports.shuffle = shuffle;
module.exports.sortTeam = sortTeam;
module.exports.choosePlayer = choosePlayer;
module.exports.firstToLastIndex = firstToLastIndex;
