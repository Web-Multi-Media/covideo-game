import {soundPlayers} from './sounds'


const playSound = (type, volume) => {
  if (volume === undefined) {
    volume = 0.05;
  }
  let sound_player = soundPlayers[type];
  if (sound_player !== undefined) {
    sound_player.play(volume);
  }
}

export default playSound;
